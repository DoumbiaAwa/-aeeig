import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebaseConf';

export default function Notes() {
  const [etudiant, setEtudiants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filieres, setFilieres] = useState([]); // Pour stocker les filières
  const [selectedFiliere, setSelectedFiliere] = useState(''); // Pour filtrer par filière

  // Récupérer les filières
  const fetchFiliere = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, 'filieres');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setFilieres(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
    } else {
      alert('Aucune filière trouvée');
    }
  };

  // Récupérer les étudiants
  const fetchEtudiant = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, 'etudiants');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setEtudiants(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));
    } else {
      alert('Aucun étudiant trouvé');
    }
  };

  useEffect(() => {
    fetchFiliere(); // Appel pour récupérer les filières
    fetchEtudiant(); // Appel pour récupérer les étudiants
  }, []);

  // Fonction pour filtrer les étudiants par nom et par filière
  const DataTable = () => {
    const filteredEtudiant = etudiant.filter((item) => {
      const matchesName = item.etudiantNom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFiliere = selectedFiliere === '' || item.etudiantFiliere === selectedFiliere;
      return matchesName && matchesFiliere;
    });

    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Filière</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEtudiant.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.etudiantNom}</td>
                <td>{item.etudiantPrenom}</td>
                <td>{item.etudiantFiliere}</td>
                <td>
                  <Link to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: '#11a40a' }}>
                    Voir <i className="fas fa-eye"></i>
                  </Link>
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
      <div style={{ marginTop: '-45%', width: '80%', marginLeft: '16%' }}>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Listes des Étudiants</h6>
          </div>

          <div className="card-body">
            {/* Barre de recherche par nom */}
            <input
              type="text"
              placeholder="Rechercher par nom"
              className="form-control mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filtrer par filière */}
            <select
              className="form-control mb-3"
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
            >
              <option value="">Toutes les filières</option>
              {filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.filiereNom}>
                  {filiere.filiereNom}
                </option>
              ))}
            </select>

            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
}
