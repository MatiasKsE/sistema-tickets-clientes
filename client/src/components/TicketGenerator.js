import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const TicketGenerator = () => {
  const [searchParams] = useSearchParams();
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  const clienteIdFromUrl = searchParams.get('clienteId');

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteIdFromUrl && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === clienteIdFromUrl);
      if (cliente) {
        setSelectedCliente(cliente);
      }
    }
  }, [clienteIdFromUrl, clientes]);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${config.API_URL}/api/clientes`, axiosConfig);
      setClientes(response.data);
    } catch (error) {
      setError('Error al cargar los clientes');
      console.error('Error:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${config.API_URL}/api/upload-ticket-image`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedImage(response.data.filename);
      setSuccess('Imagen subida exitosamente');
    } catch (error) {
      setError('Error al subir la imagen');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTicket = async () => {
    if (!selectedCliente || !uploadedImage) {
      setError('Por favor selecciona un cliente y sube una imagen');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(`${config.API_URL}/api/generar-ticket`, {
        clienteId: selectedCliente.id,
        imagenTicket: uploadedImage
      }, axiosConfig);

      setGeneratedTicket(response.data.ticket);
      setSuccess('Ticket generado exitosamente');
    } catch (error) {
      setError('Error al generar el ticket');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (!generatedTicket) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/descargar-ticket/${generatedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Crear blob con tipo MIME correcto para PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${selectedCliente.nombreCompleto}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Limpiar memoria
    } catch (error) {
      setError('Error al descargar el ticket');
      console.error('Error:', error);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">🎫 Generar Ticket - Sistema Legado 2025</h3>
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

            <div className="mb-3">
              <label htmlFor="clienteSelect" className="form-label">
                👤 Seleccionar Cliente *
              </label>
              <select
                className="form-select"
                id="clienteSelect"
                value={selectedCliente?.id || ''}
                onChange={(e) => {
                  const cliente = clientes.find(c => c.id === e.target.value);
                  setSelectedCliente(cliente);
                }}
                required
                style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', border: '1px solid var(--color-accent)' }}
              >
                <option value="">Selecciona un cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombreCompleto} - {cliente.iglesia}
                  </option>
                ))}
              </select>
            </div>

            {selectedCliente && (
              <div className="card mb-3">
                <div className="card-body">
                  <h6>📋 Datos del Cliente Seleccionado:</h6>
                  <ul className="list-unstyled">
                    <li><strong>ID:</strong> {selectedCliente.id}</li>
                    <li><strong>Nombre:</strong> {selectedCliente.nombreCompleto}</li>
                    <li><strong>Teléfono:</strong> {selectedCliente.telefono}</li>
                    <li><strong>Iglesia:</strong> {selectedCliente.iglesia}</li>
                    <li><strong>Cédula:</strong> {selectedCliente.cedula}</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">
                🖼️ Subir Imagen de Ticket *
              </label>
              <input
                type="file"
                className="form-control"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
              <div className="form-text">
                Sube una imagen que servirá como fondo para el ticket
              </div>
            </div>

            {uploadedImage && (
              <div className="alert alert-info">
                ✅ Imagen subida: {uploadedImage}
              </div>
            )}

            <div className="d-grid gap-2">
              <button
                className="btn"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)', border: 'none' }}
                onClick={handleGenerateTicket}
                disabled={!selectedCliente || !uploadedImage || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generando Ticket...
                  </>
                ) : (
                  '🎫 Generar Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">📄 Vista Previa del Ticket</h3>
          </div>
          <div className="card-body">
            {generatedTicket ? (
              <div>
                <div className="alert alert-success">
                  ✅ Ticket generado exitosamente
                </div>
                
                <div className="ticket-preview mb-3">
                  <div className="alert alert-info text-center">
                    <h5>📄 Ticket PDF Generado</h5>
                    <p className="mb-2">El ticket se ha generado como archivo PDF</p>
                    <p className="mb-0">
                      <strong>Archivo:</strong> {generatedTicket.ticketPath.split('/').pop()}
                    </p>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn"
                    style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-bg-main)', border: 'none' }}
                    onClick={handleDownloadTicket}
                  >
                    📥 Descargar Ticket PDF
                  </button>
                </div>

                <div className="mt-3">
                  <h6>📋 Información del Ticket:</h6>
                  <ul className="list-unstyled">
                    <li><strong>ID Ticket:</strong> {generatedTicket.id}</li>
                    <li><strong>Cliente:</strong> {generatedTicket.cliente.nombreCompleto}</li>
                    <li><strong>Generado por:</strong> {generatedTicket.generadoPor}</li>
                    <li><strong>Fecha:</strong> {new Date(generatedTicket.fechaGeneracion).toLocaleString('es-ES')}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted">
                <div className="mb-3">
                  <h4>🎫</h4>
                  <p>Selecciona un cliente y sube una imagen para generar el ticket</p>
                </div>
                
                <div className="alert alert-info">
                  <h6>ℹ️ Instrucciones:</h6>
                  <ol className="text-start mb-0">
                    <li>Selecciona un cliente de la lista</li>
                    <li>Sube una imagen que servirá como fondo</li>
                    <li>Haz clic en "Generar Ticket"</li>
                    <li>Descarga el ticket generado</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator; 