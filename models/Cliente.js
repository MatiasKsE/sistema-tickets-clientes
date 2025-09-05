class Cliente {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.nombreCompleto = data.nombreCompleto;
    this.telefono = data.telefono || '';
    this.iglesia = data.iglesia || '';
    this.cedula = data.cedula || '';
    this.pagado = data.pagado || false;
    this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
    this.creadoPor = data.creadoPor || 'Sistema';
  }

  // Generar ID único
  generateId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ID-${timestamp}-${random}`;
  }

  // Convertir a objeto para MongoDB
  toMongoObject() {
    return {
      _id: this.id,
      nombreCompleto: this.nombreCompleto,
      telefono: this.telefono,
      iglesia: this.iglesia,
      cedula: this.cedula,
      pagado: this.pagado,
      fechaCreacion: new Date(this.fechaCreacion),
      creadoPor: this.creadoPor,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Crear desde objeto de MongoDB
  static fromMongoObject(mongoObj) {
    return new Cliente({
      id: mongoObj._id,
      nombreCompleto: mongoObj.nombreCompleto,
      telefono: mongoObj.telefono,
      iglesia: mongoObj.iglesia,
      cedula: mongoObj.cedula,
      pagado: mongoObj.pagado,
      fechaCreacion: mongoObj.fechaCreacion.toISOString(),
      creadoPor: mongoObj.creadoPor
    });
  }

  // Validar datos
  validate() {
    const errors = [];
    
    if (!this.nombreCompleto || this.nombreCompleto.trim() === '') {
      errors.push('El nombre completo es requerido');
    }
    
    if (this.nombreCompleto && this.nombreCompleto.length > 100) {
      errors.push('El nombre completo no puede exceder 100 caracteres');
    }
    
    if (this.telefono && this.telefono.length > 20) {
      errors.push('El teléfono no puede exceder 20 caracteres');
    }
    
    if (this.iglesia && this.iglesia.length > 100) {
      errors.push('La iglesia no puede exceder 100 caracteres');
    }
    
    if (this.cedula && this.cedula.length > 20) {
      errors.push('La cédula no puede exceder 20 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Cliente;

