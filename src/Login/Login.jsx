import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConf';
import { useNavigate } from 'react-router-dom';
import './Login.css'


export default function Login() {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authentifier avec Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Rediriger vers la page admin après succès
      navigate('/home');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };
  return (
    <div className="container">

        {/* <!-- Outer Row --> */}
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                        {/* <!-- Nested Row within Card Body --> */}
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image">
                            <img src={require('./img/aeeig.png')} alt="" style={{width:'500px', height:'500px'}}/>
                            </div>
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="titre">Association des Étudiants Ivoiriens en Guinée</h1>
                                    </div>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <form className="user" onSubmit={handleLogin}>
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user"
                                                id="exampleInputEmail" aria-describedby="emailHelp"
                                                placeholder="Enter Email Address..."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                
                                                />
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user"
                                                id="exampleInputPassword" placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required/>
                                        </div>
                                        <div className="form-group">
                                            {/* <div className="custom-control custom-checkbox small">
                                                <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                                <label className="custom-control-label" for="customCheck">Remember
                                                    Me</label>
                                            </div> */}
                                        </div>
                                        {/* <Link to='/home'> */}
                                        <button type='submit'  className="btn btn-primary btn-user btn-block">
                                            Login

                                        </button>
                                        
                                        {/* </Link> */}
                                       
                                        <hr/>
                                      
                                       
                                    </form>
                                    <hr/>
                                    {/* <div className="text-center">
                                        <a className="small" href="forgot-password.html">Forgot Password?</a>
                                    </div>
                                    <div className="text-center">
                                        <a className="small" href="register.html">Create an Account!</a>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
  )
}
