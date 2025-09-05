const { getCollections } = require('../config/database');
const Ticket = require('../models/Ticket');

class TicketService {
  // Obtener todos los tickets
  static async getAllTickets() {
    try {
      const { tickets } = await getCollections();
      const mongoTickets = await tickets.find({}).sort({ fechaCreacion: -1 }).toArray();
      return mongoTickets.map(ticket => Ticket.fromMongoObject(ticket));
    } catch (error) {
      console.error('❌ Error obteniendo tickets:', error);
      throw error;
    }
  }

  // Obtener ticket por ID
  static async getTicketById(id) {
    try {
      const { tickets } = await getCollections();
      const mongoTicket = await tickets.findOne({ _id: id });
      return mongoTicket ? Ticket.fromMongoObject(mongoTicket) : null;
    } catch (error) {
      console.error('❌ Error obteniendo ticket por ID:', error);
      throw error;
    }
  }

  // Crear nuevo ticket
  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      const validation = ticket.validate();
      
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      const { tickets } = await getCollections();
      const mongoObject = ticket.toMongoObject();
      
      await tickets.insertOne(mongoObject);
      console.log(`✅ Ticket creado en MongoDB: ${ticket.id}`);
      return ticket;
    } catch (error) {
      console.error('❌ Error creando ticket:', error);
      throw error;
    }
  }

  // Actualizar ticket
  static async updateTicket(id, updateData) {
    try {
      const { tickets } = await getCollections();
      
      // Obtener ticket existente
      const existingTicket = await tickets.findOne({ _id: id });
      if (!existingTicket) {
        throw new Error('Ticket no encontrado');
      }

      // Crear ticket actualizado
      const updatedTicket = new Ticket({
        ...Ticket.fromMongoObject(existingTicket),
        ...updateData,
        id: id // Mantener el ID original
      });

      const validation = updatedTicket.validate();
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Actualizar en MongoDB
      const updateResult = await tickets.updateOne(
        { _id: id },
        { 
          $set: {
            ...updatedTicket.toMongoObject(),
            updatedAt: new Date()
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error('No se pudo actualizar el ticket');
      }

      console.log(`✅ Ticket actualizado en MongoDB: ${updatedTicket.id}`);
      return updatedTicket;
    } catch (error) {
      console.error('❌ Error actualizando ticket:', error);
      throw error;
    }
  }

  // Eliminar ticket
  static async deleteTicket(id) {
    try {
      const { tickets } = await getCollections();
      
      const deleteResult = await tickets.deleteOne({ _id: id });
      
      if (deleteResult.deletedCount === 0) {
        throw new Error('Ticket no encontrado');
      }

      console.log(`✅ Ticket eliminado de MongoDB: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando ticket:', error);
      throw error;
    }
  }

  // Obtener tickets por cliente
  static async getTicketsByCliente(clienteId) {
    try {
      const { tickets } = await getCollections();
      const mongoTickets = await tickets.find({ clienteId }).sort({ fechaCreacion: -1 }).toArray();
      return mongoTickets.map(ticket => Ticket.fromMongoObject(ticket));
    } catch (error) {
      console.error('❌ Error obteniendo tickets por cliente:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  static async getStats() {
    try {
      const { tickets } = await getCollections();
      
      const total = await tickets.countDocuments();
      const generados = await tickets.countDocuments({ estado: 'generado' });
      const entregados = await tickets.countDocuments({ estado: 'entregado' });

      return {
        total,
        generados,
        entregados
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de tickets:', error);
      throw error;
    }
  }
}

module.exports = TicketService;

