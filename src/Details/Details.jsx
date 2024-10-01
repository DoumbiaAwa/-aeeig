import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { app } from '../firebaseConf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Details() {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState({});
  const [annee, setAnnee] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [modify, setModify] = useState("");
  const modalRef = useRef(null);
  const modalEditRef = useRef(null);

  useEffect(() => {
    fetchEtudiant(id);
  }, [id]);

  const fetchEtudiant = async (etudiantId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `etudiants/${etudiantId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setEtudiant(snapshot.val());
    } else {
      alert("Étudiant non trouvé");
    }
  };

  const handleAjouterNote = async () => {
    const db = getDatabase(app);
    const notesRef = ref(db, `etudiants/${id}/notes`);
  
    const newNote = {
      annee: annee ? annee.getFullYear() : null, 
      // fichier: fichier.name? fichier.name : null,
    };
  
    if (modify) {
      // Modifier une note existante
      await update(ref(db, `etudiants/${id}/notes/${modify}`), newNote);
      alert("Modification réussie");
    } else {
      // Ajouter une nouvelle note
      await update(notesRef, { [new Date().getTime()]: newNote });
      alert("Note ajoutée avec succès");
    }
  
    setAnnee(null);
    setFichier(null);
    setModify(null);
    fetchEtudiant(id);  // Actualiser les données de l'étudiant après l'ajout ou la modification
    closeModal();
  };
  
  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };



  const modifier = async (noteId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `etudiants/${id}/notes/${noteId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setAnnee(new Date(snapshot.val().annee, 0, 1));  // Annee est seulement l'année
      setFichier(snapshot.val().fichier);  // Assurez-vous que 'fichier' contient le nom correct
      setModify(noteId);  // Stocker l'identifiant de la note pour modification
      openEditModal();  // Ouvrir la modale de modification
    } else {
      alert("Impossible de récupérer les données à modifier.");
    }
  };
  
  const deleteNotes = async (noteId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer  ?")) {
      const db = getDatabase(app);
      const dbRef = ref(db, `etudiants/${id}/notes/${noteId}`);
      await remove(dbRef);
      alert("Note supprimée avec succès");
      fetchEtudiant(id);  // Actualiser les données de l'étudiant après suppression
    }
  };
  

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'block';
    }
  };

  const openEditModal = () => {
    if (modalEditRef.current) {
      modalEditRef.current.style.display = 'block';
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    if (modalEditRef.current) {
      modalEditRef.current.style.display = 'none';
    }
    setAnnee(null);
    setFichier(null);
    setModify(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ marginTop: '-45%', width: '80%', marginLeft: '15%' }}>
        <h3>Ajouter des notes pour : {etudiant.etudiantNom} {etudiant.etudiantPrenom} {etudiant.etudiantFiliere}</h3>
          
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document" id='add'>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter une Note</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="annee">Choisir l'année</label>
                    <DatePicker
                      selected={annee}
                      onChange={date => setAnnee(date)}
                      showYearPicker
                      dateFormat="yyyy"
                      className="form-control"
                      id="annee"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="file">Choisir un fichier</label>
                    <input type="file" id="file" className="form-control" onChange={handleFileChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleAjouterNote} className="btn btn-primary">Ajouter</button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ marginLeft: '85%' }}>
          Ajouter une Note
        </button>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Listes des Notes</h6>
          </div>
          <div className="card-body">
            <DataTable data={etudiant.notes || {}} modifier={modifier} deleteNotes={deleteNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}

const DataTable = ({ data, modifier, deleteNotes }) => (
  <div className="table-responsive">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Année</th>
          <th>Fichier</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, note]) => (
          <tr key={key}>
            <td>{note.annee}</td>
            <td>{note.fichier}</td>
            <td>
              <button   onClick={() => modifier(key)}>
                <i className="fas fa-edit" style={{ color: 'green' }}></i>
              </button>
              <button onClick={() => deleteNotes(key)}>
                <i className="fas fa-trash-alt" style={{ color: 'red' }}></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
