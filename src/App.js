
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from './Nav/Nav';
import Home from './Home/Home';
import Filieres from './Filieres/Filieres';
import Semestres from './Semestres/Semestres';
import Etudiants from './Etudiants/Etudiants';
import Notes from './Notes/Notes';
import Details from './Details/Details';
function App() {
  return (
    <Router>
      <Routes>
        
      <Route path="/" element={
       <>
    <Nav />
    <Home />
    </>
} />

<Route path="/filieres" element={
       <>
    <Nav />
    <Filieres />
    </>
} />

<Route path="/semetres" element={
       <>
    <Nav />
    <Semestres />
    </>
} />

<Route path="/etudiants" element={
       <>
        <Nav />
    <Etudiants />
    </>
} />

<Route path="/notes" element={
       <>
        <Nav />
    <Notes />
    </>
} />

<Route path="/detail" element={
       <>
      <Nav />
    <Details />
    </>
} />


       
      </Routes>
    </Router>
  );
}

export default App;
