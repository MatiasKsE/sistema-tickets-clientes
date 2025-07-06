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

          <div className="navbar-nav">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {user?.username}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={onLogout}>
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 