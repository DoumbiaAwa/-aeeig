import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, set, push, remove, get } from "firebase/database";
import { app } from '../firebaseConf';

export default function Filieres() {
    const [searchTerm, setSearchTerm] = useState('');
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [filières, setFilières] = useState([]);
    const [editingId, setEditingId] = useState(null); // Ajoutez cet état pour gérer l'ID en modification

    // Références pour les modales
    const modalRef = useRef(null);
    const modalEditRef = useRef(null);

    // Ajouter ou Modifier
    const saveData = async () => {
        const db = getDatabase(app);
        if (editingId) {
            // Modification
            const dbRef = ref(db, "filieres/" + editingId);
            set(dbRef, {
                filiereNom: nom,
                filiereDescription: description
            }).then(() => {
                alert("Modification réussie");
                setNom("");
                setDescription("");
                setEditingId(null); // Réinitialiser l'ID d'édition
                fetchData(); // Refresh data after modification
                closeModal(); // Fermer la modale après modification
            }).catch((error) => {
                alert("Erreur: " + error.message);
            });
        } else {
            // Ajout
            const newDocRef = push(ref(db, "filieres"));
            set(newDocRef, {
                filiereNom: nom,
                filiereDescription: description
            }).then(() => {
                alert("Ajout avec succès");
                setNom("");
                setDescription("");
                fetchData(); // Refresh data after adding
                closeModal(); // Fermer la modale après ajout
            }).catch((error) => {
                alert("Erreur: " + error.message);
            });
        }
    }

    //  modification
    const modifier = async (filiereId) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "filieres/" + filiereId);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setNom(snapshot.val().filiereNom);
            setDescription(snapshot.val().filiereDescription);
            setEditingId(filiereId);  // Stocker l'ID de la filière à modifier
            openEditModal(); // Ouvrir la modale d'édition
        } else {
            alert("Impossible de récupérer les données à modifier.");
        }
    }

    // Récupérer les données
    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "filieres");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setFilières(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
        } else {
            alert("Aucune donnée trouvée");
        }
    }

    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, []);

    // Supprimer
    const deleteFiliere = async (filiereId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
            const db = getDatabase(app);
            const dbRef = ref(db, "filieres/" + filiereId);
            await remove(dbRef);
            alert("Filière supprimée avec succès");
            fetchData(); // Refresh data after deleting
        }
    }

    // Ouvrir la modale d'ajout
    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.style.display = 'block';
        }
    }

    // Ouvrir la modale de modification
    const openEditModal = () => {
        if (modalEditRef.current) {
            modalEditRef.current.style.display = 'block';
        }
    }

    // Fermer la modale
    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.style.display = 'none';
        }
        if (modalEditRef.current) {
            modalEditRef.current.style.display = 'none';
        }
        setNom("");
        setDescription("");
        setEditingId(null);
    }

    // Afficher les données filtrées dans un tableau
    const DataTable = ({ searchTerm }) => {
        const filteredData = filières.filter(item =>
            item.filiereNom.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.filiereNom}</td>
                                <td>{item.filiereDescription}</td>
                                <td>
                                    <button onClick={() => modifier(item.id)}>
                                        <i className="fas fa-edit" style={{ color: 'green' }}></i>
                                    </button>
                                    <button onClick={() => deleteFiliere(item.id)}>
                                        <i className="fas fa-trash-alt" style={{ color: 'red' }}></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '-45%', width: '80%', marginLeft: '15%' }}>

                {/* Ajout */}
                <div className="modal" ref={modalRef} style={{ display: 'none' }}>
                    <div className="modal-dialog" role="document" id='add'>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nouvelle filière</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Nom:</label>
                                        <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={saveData}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modification */}
                <div className="modal" ref={modalEditRef} style={{ display: 'none' }}>
                    <div className="modal-dialog" role="document" id='add'>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modifier la filière</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Nom:</label>
                                        <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={saveData}>
                                    Modifier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                

                <button type="button" onClick={openModal} className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ marginLeft: '85%' }}>
                    Ajouter une filière
                </button>
                <h1 className="h3 mb-2 text-gray-800">Filières</h1>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Listes des filières</h6>
                    </div>
                    </div>

                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher une filière..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTable searchTerm={searchTerm} />
                    </div>
                </div>
            </div>
        </div>
    );
}
