import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ClienteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    iglesia: '',
    cedula: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(`${config.API_URL}/api/clientes`, formData, config);
      
      setSuccess('Cliente creado exitosamente');
      setFormData({
        nombreCompleto: '',
        telefono: '',
        iglesia: '',
        cedula: ''
      });

      // Mostrar información del cliente creado
      setTimeout(() => {
        alert(`Cliente creado exitosamente!\n\nID: ${response.data.cliente.id}\nNombre: ${response.data.cliente.nombreCompleto}\nTeléfono: ${response.data.cliente.telefono}\nIglesia: ${response.data.cliente.iglesia}\nCédula: ${response.data.cliente.cedula}`);
      }, 100);

    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">➕ Agregar Nuevo Cliente</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombreCompleto" className="form-label">
                  📝 Nombre Completo *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Carlos Pérez González"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  📞 Teléfono *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 0412-123-4567"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="iglesia" className="form-label">
                  ⛪ Iglesia *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="iglesia"
                  name="iglesia"
                  value={formData.iglesia}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Iglesia Bautista Central"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cedula" className="form-label">
                  🆔 Cédula de Identidad *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                  placeholder="Ej: V-12.345.678"
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando Cliente...
                    </>
                  ) : (
                    '✅ Crear Cliente'
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/clientes')}
                >
                  👥 Ver Todos los Clientes
                </button>
              </div>
            </form>

            <div className="mt-4">
              <div className="alert alert-info">
                <h6>ℹ️ Información:</h6>
                <ul className="mb-0">
                  <li>El ID será generado automáticamente de forma única</li>
                  <li>Todos los campos son obligatorios</li>
                  <li>Los datos se guardarán en la base de datos</li>
                  <li>Podrás generar tickets para este cliente después</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm; 