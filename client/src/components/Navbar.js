<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container">
    <Link className="navbar-brand" to="/">
      🎫 Sistema Legado 2025
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
            🏠 Inicio
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

      {/* 🔥 Usuario + Cerrar sesión alineados a la derecha */}
      <div className="d-flex align-items-center ms-auto gap-3">
        <span className="navbar-text text-light">
          👤 {user?.username}
        </span>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={onLogout}
          style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</nav>

  );
};

export default Navbar; 
