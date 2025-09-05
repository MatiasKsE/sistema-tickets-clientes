const { getCollections } = require('../config/database');
const Cliente = require('../models/Cliente');

class ClienteService {
  // Obtener todos los clientes
  static async getAllClientes() {
    try {
      const { clientes } = await getCollections();
      const mongoClientes = await clientes.find({}).toArray();
      return mongoClientes.map(cliente => Cliente.fromMongoObject(cliente));
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw error;
    }
  }

  // Obtener cliente por ID
  static async getClienteById(id) {
    try {
      const { clientes } = await getCollections();
      const mongoCliente = await clientes.findOne({ _id: id });
      return mongoCliente ? Cliente.fromMongoObject(mongoCliente) : null;
    } catch (error) {
      console.error('❌ Error obteniendo cliente por ID:', error);
      throw error;
    }
  }

  // Crear nuevo cliente
  static async createCliente(clienteData) {
    try {
      const cliente = new Cliente(clienteData);
      const validation = cliente.validate();
      
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      const { clientes } = await getCollections();
      const mongoObject = cliente.toMongoObject();
      
      // Verificar si ya existe un cliente con el mismo nombre
      const existingCliente = await clientes.findOne({ 
        nombreCompleto: cliente.nombreCompleto 
      });
      
      if (existingCliente) {
        throw new Error('Ya existe un cliente con ese nombre');
      }

      await clientes.insertOne(mongoObject);
      console.log(`✅ Cliente creado en MongoDB: ${cliente.nombreCompleto}`);
      return cliente;
    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      throw error;
    }
  }

  // Actualizar cliente
  static async updateCliente(id, updateData) {
    try {
      const { clientes } = await getCollections();
      
      // Obtener cliente existente
      const existingCliente = await clientes.findOne({ _id: id });
      if (!existingCliente) {
        throw new Error('Cliente no encontrado');
      }

      // Crear cliente actualizado
      const updatedCliente = new Cliente({
        ...Cliente.fromMongoObject(existingCliente),
        ...updateData,
        id: id // Mantener el ID original
      });

      const validation = updatedCliente.validate();
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Actualizar en MongoDB
      const updateResult = await clientes.updateOne(
        { _id: id },
        { 
          $set: {
            ...updatedCliente.toMongoObject(),
            updatedAt: new Date()
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error('No se pudo actualizar el cliente');
      }

      console.log(`✅ Cliente actualizado en MongoDB: ${updatedCliente.nombreCompleto}`);
      return updatedCliente;
    } catch (error) {
      console.error('❌ Error actualizando cliente:', error);
      throw error;
    }
  }

  // Eliminar cliente
  static async deleteCliente(id) {
    try {
      const { clientes } = await getCollections();
      
      const deleteResult = await clientes.deleteOne({ _id: id });
      
      if (deleteResult.deletedCount === 0) {
        throw new Error('Cliente no encontrado');
      }

      console.log(`✅ Cliente eliminado de MongoDB: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando cliente:', error);
      throw error;
    }
  }

  // Actualizar estado de pago
  static async updatePagoStatus(id, pagado) {
    try {
      const { clientes } = await getCollections();
      
      const updateResult = await clientes.updateOne(
        { _id: id },
        { 
          $set: {
            pagado: pagado,
            updatedAt: new Date()
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error('Cliente no encontrado');
      }

      console.log(`✅ Estado de pago actualizado en MongoDB: ${id} -> ${pagado}`);
      return true;
    } catch (error) {
      console.error('❌ Error actualizando estado de pago:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  static async getStats() {
    try {
      const { clientes } = await getCollections();
      
      const total = await clientes.countDocuments();
      const pagados = await clientes.countDocuments({ pagado: true });
      const pendientes = total - pagados;

      return {
        total,
        pagados,
        pendientes
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

module.exports = ClienteService;

