import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  return (
    <div id="wrapper">
      {/* Sidebar */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" style={{ height: '100%' }}>

        {/* Sidebar - Brand */}
        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
        </Link>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        {/* Nav Item - Dashboard */}
        <li className="nav-item active">
          <Link className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Nav Item - Filieres */}
        <li className="nav-item">
          <Link className="nav-link" to="/filieres">
            <i className="fas fa-fw fa-cog"></i>
            <span>Filieres</span>
          </Link>
        </li>

        {/* Nav Item - Semestres */}
        {/* <li className="nav-item">
          <Link className="nav-link" to="/semetres">
            <i className="fas fa-fw fa-folder"></i>
            <span>Semestres</span>
          </Link>
        </li> */}

        {/* Nav Item - Etudiants */}
        <li className="nav-item">
          <Link className="nav-link" to="/etudiants">
            <i className="fas fa-fw fa-users"></i>
            <span>Etudiants</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Nav Item - Notes */}
        <li className="nav-item">
          <Link className="nav-link" to="/notes">
            <i className="fas fa-fw fa-clipboard"></i>
            <span>Notes</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />
      </ul>
    </div>
  )
}
