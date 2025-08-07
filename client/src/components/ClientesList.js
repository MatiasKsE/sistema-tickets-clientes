import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_URL}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    obtenerClientes();
  }, []);

  const handleEliminar = async (clienteId) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este cliente?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`${config.API_URL}/api/clientes/${clienteId}`, axiosConfig);
      setClientes(clientes.filter(cliente => cliente.id !== clienteId));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("Hubo un error al intentar eliminar el cliente.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-light mb-4">📋 Lista de Clientes</h2>
      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered align-middle">
          <thead>
            <tr className="table-success text-center">
              <th>Nombre</th>
              <th>Modelo</th>
              <th>Tipo de Celdas</th>
              <th>Cantidad de Celdas</th>
              <th>Observación</th>
              <th>Monto a Pagar</th>
              <th>Pagado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.modelo}</td>
                <td>{cliente.tipo_celdas}</td>
                <td>{cliente.cantidad_celdas}</td>
                <td>{cliente.observacion}</td>
                <td>${cliente.monto}</td>
                <td>{cliente.pagado ? '✅' : '❌'}</td>
                <td className="text-center">
                  <Link
                    to={`/generar-ticket?clienteId=${cliente.id}`}
                    className="btn btn-sm"
                    style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-bg-main)', border: 'none', marginRight: '5px' }}
                    title="Generar Ticket"
                  >
                    🎫 Ticket
                  </Link>

                  <Link
                    to={`/editar-cliente/${cliente.id}`}
                    className="btn btn-sm btn-warning"
                    style={{ marginRight: '5px' }}
                    title="Editar Cliente"
                  >
                    ✏️ Editar
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(cliente.id)}
                    title="Eliminar Cliente"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientesList;
