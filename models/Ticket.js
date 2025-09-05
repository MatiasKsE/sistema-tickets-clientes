class Ticket {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.clienteId = data.clienteId;
    this.clienteNombre = data.clienteNombre;
    this.clienteTelefono = data.clienteTelefono;
    this.clienteIglesia = data.clienteIglesia;
    this.clienteCedula = data.clienteCedula;
    this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
    this.creadoPor = data.creadoPor || 'Sistema';
    this.estado = data.estado || 'generado';
    this.tipo = data.tipo || 'entrada';
    this.archivoPath = data.archivoPath || '';
    this.archivoUrl = data.archivoUrl || '';
  }

  // Generar ID único
  generateId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ticket-${timestamp}-${random}`;
  }

  // Convertir a objeto para MongoDB
  toMongoObject() {
    return {
      _id: this.id,
      clienteId: this.clienteId,
      clienteNombre: this.clienteNombre,
      clienteTelefono: this.clienteTelefono,
      clienteIglesia: this.clienteIglesia,
      clienteCedula: this.clienteCedula,
      fechaCreacion: new Date(this.fechaCreacion),
      creadoPor: this.creadoPor,
      estado: this.estado,
      tipo: this.tipo,
      archivoPath: this.archivoPath,
      archivoUrl: this.archivoUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Crear desde objeto de MongoDB
  static fromMongoObject(mongoObj) {
    return new Ticket({
      id: mongoObj._id,
      clienteId: mongoObj.clienteId,
      clienteNombre: mongoObj.clienteNombre,
      clienteTelefono: mongoObj.clienteTelefono,
      clienteIglesia: mongoObj.clienteIglesia,
      clienteCedula: mongoObj.clienteCedula,
      fechaCreacion: mongoObj.fechaCreacion.toISOString(),
      creadoPor: mongoObj.creadoPor,
      estado: mongoObj.estado,
      tipo: mongoObj.tipo,
      archivoPath: mongoObj.archivoPath,
      archivoUrl: mongoObj.archivoUrl
    });
  }

  // Validar datos
  validate() {
    const errors = [];
    
    if (!this.clienteId) {
      errors.push('El ID del cliente es requerido');
    }
    
    if (!this.clienteNombre || this.clienteNombre.trim() === '') {
      errors.push('El nombre del cliente es requerido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Ticket;

