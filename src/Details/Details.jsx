import React, {useState} from 'react'

const DataTable = ({ searchTerm }) => {
    const data = [
        { id: 1, semestre: 'S1' },
       
    ];

    const filteredData = data.filter(item =>
        item.semestre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="table-responsive">

        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Semestre</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.semestre}</td>
                        
                        <td>
            <button onclick="modifier()">
                <i class="fas fa-edit" style={{color: 'green'}}></i>
            </button>
            
            <button onclick="supprimer()">
                <i class="fas fa-trash-alt" style={{color: 'red'}}></i> 
            </button>
        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default function Details() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '-45%', width: '80%', marginLeft: '15%' }}>
              <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <select name="" id="" className="form-control">Semestre 
                <option>S1</option>
                <option>S1</option>
              </select>
            </div>
            <div className="form-group">
  <label htmlFor="file">Choisir un ficher</label>
  <input type="file" id="file" className="form-control" />
</div>
            
           
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
  {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" style={{marginLeft:'85%'}}> Ajouter une filière</button> */}
  
              {/* <Link to='/add-fieliere' style={{ textDecoration: 'none', color: 'inherit' }}> */}
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" style={{marginLeft:'85%'}} onclick='#add'> Ajouter Etudiants</button>
              {/* </Link> */}
                  <h1 className="h3 mb-2 text-gray-800">Awa Doumbia</h1>
                   
                  <div className="card shadow mb-4">
                      <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary">Semestres</h6>
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
