// Configuración para desarrollo y producción
const config = {
  // URL del backend - cambiar según el entorno
  API_URL: process.env.REACT_APP_API_URL || 'https://tu-app.onrender.com',
  
  // Configuración de la aplicación
  APP_NAME: 'Sistema de Tickets y Clientes',
  
  // Configuración de archivos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
};

export default config; 