import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    nombreCompleto: '',
    telefono: '',
    iglesia: '',
    cedula: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${config.API_URL}/api/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormValues({
          nombreCompleto: data.nombreCompleto || '',
          telefono: data.telefono || '',
          iglesia: data.iglesia || '',
          cedula: data.cedula || ''
        });
      } catch (err) {
        setError('No se pudo cargar el cliente');
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { nombreCompleto, telefono, iglesia, cedula } = formValues;
    if (!nombreCompleto || !telefono || !iglesia || !cedula) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
      if (id) {
        await axios.put(`${config.API_URL}/api/clientes/${id}`, formValues, axiosConfig);
        setSuccess('✅ Cliente actualizado exitosamente');
      } else {
        await axios.post(`${config.API_URL}/api/clientes`, formValues, axiosConfig);
        setSuccess('✅ Cliente creado exitosamente');
      }
      navigate('/clientes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="mb-0">➕ Nuevo Cliente</h5>
            <Link to="/clientes" className="btn btn-sm btn-outline-secondary">Volver</Link>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombreCompleto" className="form-label">Nombre Completo *</label>
                <input
                  id="nombreCompleto"
                  name="nombreCompleto"
                  type="text"
                  className="form-control"
                  value={formValues.nombreCompleto}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono *</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="form-control"
                  value={formValues.telefono}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 0991234567"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="iglesia" className="form-label">Iglesia *</label>
                <input
                  id="iglesia"
                  name="iglesia"
                  type="text"
                  className="form-control"
                  value={formValues.iglesia}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Iglesia Príncipe de Paz"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cedula" className="form-label">Cédula *</label>
                <input
                  id="cedula"
                  name="cedula"
                  type="text"
                  className="form-control"
                  value={formValues.cedula}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 1234567890"
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)', border: 'none' }}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : '💾 Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;
