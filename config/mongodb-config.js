// Configuración de MongoDB para el sistema de tickets
module.exports = {
  // Cadena de conexión de MongoDB Atlas
  MONGODB_URI: 'mongodb+srv://Mattkse:Legado2025-.@legado2025.g5eosx6.mongodb.net/?retryWrites=true&w=majority&appName=legado2025',
  
  // Nombre de la base de datos
  DB_NAME: 'sistema_tickets_clientes',
  
  // Configuración adicional
  OPTIONS: {
    retryWrites: true,
    w: 'majority',
    appName: 'legado2025'
  }
};
