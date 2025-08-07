import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const axiosConfig = {
        headers: { Authorization: Bearer ${token} }
      };

      const response = await axios.get(${config.API_URL}/api/clientes, axiosConfig);
      setClientes(response.data);
    } catch (error) {
      setError('Error al cargar los clientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.iglesia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h2>👥 Lista de Clientes - Sistema Legado 2025</h2>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/nuevo-cliente" className="btn" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)', border: 'none' }}>
            ➕ Agregar Cliente
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, iglesia, cédula o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Total: {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {filteredClientes.length === 0 ? (
        <div className="text-center">
          <div className="card">
            <div className="card-body">
              <h5 className="text-muted">No se encontraron clientes</h5>
              <p className="text-muted">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no hay clientes registrados'}
              </p>
              {!searchTerm && (
                <Link to="/nuevo-cliente" className="btn" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)', border: 'none' }}>
                  ➕ Agregar Primer Cliente
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>🔢 ID</th>
                <th>📝 Nombre Completo</th>
                <th>📞 Teléfono</th>
                <th>⛪ Iglesia</th>
                <th>🆔 Cédula</th>
                <th>📅 Fecha Creación</th>
                <th>👤 Creado Por</th>
                <th>🎫 Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)' }}>{cliente.id}</span>
                  </td>
                  <td>
                    <strong>{cliente.nombreCompleto}</strong>
                  </td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.iglesia}</td>
                  <td>{cliente.cedula}</td>
                  <td>
                    {new Date(cliente.fechaCreacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-bg-main)' }}>{cliente.creadoPor}</span>
                  </td>
                  <td>
                    <Link
                      to={/generar-ticket?clienteId=${cliente.id}}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-bg-main)', border: 'none' }}
                      title="Generar Ticket"
                    >
                      🎫 Ticket
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">📊 Estadísticas</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="text-center">
                  <h4 style={{ color: 'var(--color-accent)' }}>{clientes.length}</h4>
                  <small style={{ color: 'var(--color-text-secondary)' }}>Total Clientes</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 style={{ color: 'var(--color-primary-hover)' }}>
                    {clientes.filter(c => c.iglesia.toLowerCase().includes('bautista')).length}
                  </h4>
                  <small style={{ color: 'var(--color-text-secondary)' }}>Iglesias Bautistas</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 style={{ color: 'var(--color-accent)' }}>
                    {new Set(clientes.map(c => c.iglesia)).size}
                  </h4>
                  <small style={{ color: 'var(--color-text-secondary)' }}>Iglesias Únicas</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 style={{ color: 'var(--color-accent)' }}>
                    {clientes.filter(c => {
                      const fecha = new Date(c.fechaCreacion);
                      const hoy = new Date();
                      const diffTime = Math.abs(hoy - fecha);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length}
                  </h4>
                  <small style={{ color: 'var(--color-text-secondary)' }}>Últimos 7 días</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
