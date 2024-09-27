import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, set, push, remove, get } from "firebase/database";
import { app } from '../firebaseConf';

export default function Etudiants() {
    const [searchTerm, setSearchTerm] = useState('');
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [mail, setMail] = useState("");
    const [filiere, setFiliere] = useState("");
    const [code, setCode] = useState("");
    const [etudiants, setEtudiants] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [modify, setModify] = useState(null);

    // État pour gérer l'affichage de la modale
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ajouter ou modifier un étudiant
    const saveEtudiants = async () => {
        const db = getDatabase(app);
        if (modify) {
            const dbRef = ref(db, "etudiants/" + modify);
            set(dbRef, {
                etudiantNom: nom,
                etudiantPrenom: prenom,
                etudiantMail: mail,
                etudiantFiliere: filiere,
                etudiantCode: code,
            }).then(() => {
                alert("Modification réussie");
                resetForm();
                fetchData(); 
                closeModal();
            }).catch((error) => {
                alert("Erreur: " + error.message);
            });
        } else {
            const newDocRef = push(ref(db, "etudiants"));
            set(newDocRef, {
                etudiantNom: nom,
                etudiantPrenom: prenom,
                etudiantMail: mail,
                etudiantFiliere: filiere,
                etudiantCode: code,
            }).then(() => {
                alert("Ajout avec succès");
                resetForm();
                fetchData();
                closeModal();
            }).catch((error) => {
                alert("Erreur: " + error.message);
            });
        }
    };

    // Fonction pour récupérer les données
    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "etudiants");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setEtudiants(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
        } else {
            alert("Aucune donnée trouvée");
        }
    };

    // Fonction pour récupérer les filières depuis Firebase
    const fetchFilieres = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "filieres");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
          setFilieres(Object.values(snapshot.val()));
      } else {
          alert("Aucune filière trouvée");
      }
    };

    useEffect(() => {
        fetchData();
        fetchFilieres();
    }, []);

    // Supprimer
    const deleteEtudiant = async (etudiantId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
            const db = getDatabase(app);
            const dbRef = ref(db, "etudiants/" + etudiantId);
            await remove(dbRef);
            alert("Étudiant supprimé avec succès");
            fetchData();
        }
    };

    // Ouvrir et fermer les modales
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
        setNom("");
        setPrenom("");
        setMail("");
        setFiliere("");
        setCode("");
        setModify(null);
    };

    // Tableau des étudiants filtré par le terme de recherche
    const DataTable = ({ searchTerm }) => {
        const filteredData = etudiants.filter(item =>
            item.etudiantNom.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Filiere</th>
                            <th>Code</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.etudiantNom}</td>
                                <td>{item.etudiantPrenom}</td>
                                <td>{item.etudiantMail}</td>
                                <td>{item.etudiantFiliere}</td>
                                <td>{item.etudiantCode}</td>
                                <td>
                                    <button >
                                        <i className="fas fa-edit" style={{ color: 'green' }}></i>
                                    </button>
                                    <button onClick={() => deleteEtudiant(item.id)}>
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
                <button type="button" className="btn btn-primary" onClick={openModal} style={{ marginLeft: '85%' }}> Ajouter Étudiant</button>

                <h1 className="h3 mb-2 text-gray-800">Étudiants</h1>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Liste des Étudiants</h6>
                    </div>
                    <div className="card-body">
                        <input
                            type="text"
                            placeholder="Rechercher par nom"
                            className="form-control mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTable searchTerm={searchTerm} />
                    </div>
                </div>

                {/* Modale Ajouter Étudiant */}
                {isModalOpen && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Nouveau Étudiant</h5>
                                    <button type="button" className="close" onClick={closeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Nom:</label>
                                            <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Prénom:</label>
                                            <input type="text" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input type="email" className="form-control" value={mail} onChange={(e) => setMail(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Filière:</label>
                                            <select className="form-control" value={filiere} onChange={(e) => setFiliere(e.target.value)}>
                                                <option value="">Sélectionner une filière</option>
                                                {filieres.map((filiereItem, index) => (
                                                    <option key={index} value={filiereItem.nom}>
                                                        {filiereItem.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Code:</label>
                                            <input type="text" className="form-control" value={code} onChange={(e) => setCode(e.target.value)} />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                                    <button type="button" className="btn btn-primary" onClick={saveEtudiants}>Sauvegarder</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
