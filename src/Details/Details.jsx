import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, set, push, remove, get } from "firebase/database";
import DatePicker from 'react-datepicker';
import { app } from '../firebaseConf';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Details() {
  const [searchTerm, setSearchTerm] = useState('');
  const [annee, setAnnee] = useState(null); 
  const [fiche, setFiche] = useState('');
  const [notes, setNotes] = useState([]);
  const [etudiants, setEtudiants] = useState({});
  const [modify, setModify] = useState(null);

  const modalRef = useRef(null);
  const modalEditRef = useRef(null);

  const saveNotes = async () => {
    const db = getDatabase(app);
    const storage = getStorage(app);
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    
    let fileUrl = null;
  
    if (file) {
      const fileRef = storageRef(storage, `notes/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }
  
    const noteData = {
      notesAnnee: annee ? annee.getFullYear() : null,
      notesFiche: fiche,
      fileUrl: fileUrl
    };
  
    if (modify) {
      const dbRef = ref(db, "notes/" + modify);
      set(dbRef, noteData).then(() => {
        alert("Modification réussie");
        resetForm();
        fetchData();
        closeModal();
      }).catch((error) => {
        alert("Erreur: " + error.message);
      });
    } else {
      const newDocRef = push(ref(db, "notes"));
      set(newDocRef, noteData).then(() => {
        alert("Ajout avec succès");
        resetForm();
        fetchData();
        closeModal();
      }).catch((error) => {
        alert("Erreur: " + error.message);
      });
    }
  };

  const modifier = async (NotesId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, "notes/" + NotesId);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setAnnee(new Date(snapshot.val().notesAnnee, 0, 1));
      setFiche(snapshot.val().notesFiche);
      setModify(NotesId);
      openEditModal();
    } else {
      alert("Impossible de récupérer les données à modifier.");
    }
  };

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "notes");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setNotes(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
    } else {
      alert("Aucune donnée trouvée");
    }
  };

  const fetchEtudiants = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "etudiants");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setEtudiants(snapshot.val());
    } else {
      alert("Aucun étudiant trouvé");
    }
  };

  useEffect(() => {
    fetchData();
    fetchEtudiants();
  }, []);

  const deleteNotes = async (NotesId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ?")) {
      const db = getDatabase(app);
      const dbRef = ref(db, "notes/" + NotesId);
      await remove(dbRef);
      alert("Notes supprimée avec succès");
      fetchData();
    }
  };

  const openModal = () => modalRef.current.style.display = 'block';
  const openEditModal = () => modalEditRef.current.style.display = 'block';
  const closeModal = () => {
    modalRef.current.style.display = 'none';
    modalEditRef.current.style.display = 'none';
    resetForm();
  };

  const resetForm = () => {
    setAnnee(null);
    setFiche("");
    setModify(null);
  };

  const filteredData = notes.filter(item => item.notesAnnee && item.notesAnnee.toString().includes(searchTerm));

  const DataTable = ({ data }) => (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Année</th>
            <th>Fiche</th>
            <th>Nom de l'Étudiant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.notesAnnee}</td>
              <td>{item.notesFiche}</td>
              <td></td>
              <td>
                <button onClick={() => modifier(item.id)}>
                  <i className="fas fa-edit" style={{ color: 'green' }}></i>
                </button>
                <button onClick={() => deleteNotes(item.id)}>
                  <i className="fas fa-trash-alt" style={{ color: 'red' }}></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ marginTop: '-45%', width: '80%', marginLeft: '15%' }}>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document" id='add'>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Notes</h5>
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
                    <input type="file" id="file" className="form-control" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={saveNotes} className="btn btn-primary">Ajouter</button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ marginLeft: '85%' }}> Ajouter une Note</button>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Listes des Notes</h6>
          </div>

          <div className="card-body">
            <input
              type="text"
              placeholder="Search by year"
              className="form-control mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DataTable data={filteredData} />
          </div>
        </div>

      </div>
    </div>
  );
}
