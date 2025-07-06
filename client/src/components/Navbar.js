import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🎫 Sistema de Tickets
        </Link>

        <button
          className="btn btn-outline-light btn-sm me-2"
          onClick={onLogout}
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          🚪 Salir
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive('/')} to="/">
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/nuevo-cliente')} to="/nuevo-cliente">
                ➕ Nuevo Cliente
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/clientes')} to="/clientes">
                👥 Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/generar-ticket')} to="/generar-ticket">
                🎫 Generar Ticket
              </Link>
            </li>
          </ul>

          <div className="navbar-nav align-items-center">
            <div className="nav-item">
              <span className="navbar-text text-light">
                👤 {user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 