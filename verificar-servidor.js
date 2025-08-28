const axios = require('axios');

const API_URL = 'http://localhost:8002';

async function verificarServidor() {
  console.log('🔍 VERIFICANDO ESTADO DEL SERVIDOR');
  console.log('==================================');
  
  try {
    // Verificar si el servidor está funcionando
    console.log('\n1️⃣ Verificando conexión al servidor...');
    const testResponse = await axios.get(`${API_URL}/api/test`);
    console.log('✅ Servidor funcionando:', testResponse.data);
    
    // Verificar estado de clientes
    console.log('\n2️⃣ Verificando estado de clientes...');
    const estadoResponse = await axios.get(`${API_URL}/api/debug/estado-clientes`);
    console.log('📊 Estado de clientes:');
    console.log('- Clientes en memoria:', estadoResponse.data.clientesEnMemoria);
    console.log('- Archivo Excel existe:', estadoResponse.data.archivoExcel.existe);
    console.log('- Tamaño del archivo:', estadoResponse.data.archivoExcel.tamaño, 'bytes');
    
    if (estadoResponse.data.archivoExcel.contenido) {
      console.log('- Contenido del Excel:', estadoResponse.data.archivoExcel.contenido.length, 'filas');
      if (estadoResponse.data.archivoExcel.contenido.length > 0) {
        console.log('- Primer cliente:', estadoResponse.data.archivoExcel.contenido[0]);
      }
    }
    
    // Intentar obtener clientes (necesitarás autenticarte)
    console.log('\n3️⃣ Intentando obtener clientes...');
    try {
      const clientesResponse = await axios.get(`${API_URL}/api/clientes`);
      console.log('✅ Clientes obtenidos:', clientesResponse.data.length);
      if (clientesResponse.data.length > 0) {
        console.log('- Primer cliente:', clientesResponse.data[0]);
      }
    } catch (error) {
      console.log('⚠️  No se pudieron obtener clientes (probablemente necesita autenticación):', error.response?.status);
    }
    
  } catch (error) {
    console.error('❌ Error verificando servidor:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 El servidor no está corriendo. Ejecuta "npm start" para iniciarlo.');
    }
  }
}

verificarServidor();
