import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get(`${config.API_URL}/api/clientes`, config);
      setStats({
        totalClientes: response.data.length,
        totalTickets: 0 // Esto se actualizaría cuando implementes tickets
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/reporte-excel`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-clientes.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error descargando reporte:', error);
      alert('Error al descargar el reporte');
    }
  };

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
        <div className="col-12">
          <h1 className="mb-4">📊 Dashboard - Sistema Legado 2025</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">👥 Total Clientes</h5>
              <h2 style={{ color: 'var(--color-accent)' }}>{stats.totalClientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">🎫 Total Tickets</h5>
              <h2 style={{ color: 'var(--color-accent)' }}>{stats.totalTickets}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🚀 Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/nuevo-cliente" className="btn" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)', border: 'none' }}>
                  ➕ Agregar Nuevo Cliente
                </Link>
                <Link to="/generar-ticket" className="btn" style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-bg-main)', border: 'none' }}>
                  🎫 Generar Ticket
                </Link>
                <Link to="/clientes" className="btn" style={{ backgroundColor: 'var(--color-navbar)', color: 'var(--color-accent)', border: 'none' }}>
                  👥 Ver Todos los Clientes
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📊 Reportes</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button onClick={downloadReport} className="btn" style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>
                  📥 Descargar Reporte Excel
                </button>
                <p className="small mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Descarga un reporte completo con todos los clientes y tickets generados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">ℹ️ Información del Sistema</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Funcionalidades Disponibles:</h6>
                  <ul>
                    <li>✅ Gestión de clientes con datos completos</li>
                    <li>✅ Generación automática de IDs únicos</li>
                    <li>✅ Creación de tickets personalizados</li>
                    <li>✅ Descarga de tickets en formato PNG</li>
                    <li>✅ Base de datos en Excel</li>
                    <li>✅ Sistema de autenticación seguro</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Datos del Cliente:</h6>
                  <ul>
                    <li>📝 Nombre Completo</li>
                    <li>📞 Teléfono</li>
                    <li>⛪ Iglesia</li>
                    <li>🆔 Cédula de Identidad</li>
                    <li>🔢 ID Único (generado automáticamente)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 