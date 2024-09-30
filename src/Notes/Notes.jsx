import React, {useEffect, useState} from 'react'
import { Link,useLocation} from 'react-router-dom';
import { getDatabase, ref, set, push, remove, get } from "firebase/database";
import { app } from '../firebaseConf';


export default function Notes() {
  const [etudiant, setEtudiants]= useState([])

  const fetchEtudiant = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "etudiants");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        setEtudiants(Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })));

    } else {
        alert("Aucun etudiant trouvée");
    }
  };

  useEffect(()=> {
    fetchEtudiant()
  },[]);
  const DataTable = ({ searchTerm }) => {
    const filteredEtudiant = etudiant.filter(item =>
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
                            <th>Filiere</th>
                            <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {etudiant.map(item => (
                    <tr key={item.id}>
                       <td>{item.id}</td>
                                <td>{item.etudiantNom}</td>
                                <td>{item.etudiantPrenom}</td>
                                <td>{item.etudiantFiliere}</td>
                        <td>
                            <button>

                                
                            </button>
                        <Link to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: '#11a40a' }}>
  <i className="fas fa-eye"></i> 
  Voir
</Link>

          
            
           
        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
  };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '-45%', width: '80%', marginLeft: '16%' }}>
          

                {/* <h1 className="h3 mb-2 text-gray-800">Etudiants</h1> */}
                 
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Listes des Etudiants</h6>
                    </div>
                    
                    <div className="card-body">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="form-control mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTable searchTerm={searchTerm} />
                    </div>
                </div>
            </div>
        </div>
  )
}
