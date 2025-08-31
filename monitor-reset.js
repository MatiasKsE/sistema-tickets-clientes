const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8002';
const DATA_DIR = path.join(__dirname, 'database');
const CLIENTS_FILE = path.join(DATA_DIR, 'clientes.xlsx');

// Función para verificar el estado del servidor
function verificarServidor() {
  return new Promise((resolve, reject) => {
    const req = http.request(`${API_URL}/api/debug/estado-clientes`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Función para ejecutar prevención de reset
function ejecutarPrevencionReset() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});
    const options = {
      hostname: 'localhost',
      port: 8002,
      path: '/api/debug/prevenir-reset',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Bearer dummy-token' // Necesitarás un token válido
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Función para verificar archivo Excel
function verificarArchivoExcel() {
  try {
    if (!fs.existsSync(CLIENTS_FILE)) {
      console.log('❌ Archivo Excel no existe');
      return false;
    }
    
    const stats = fs.statSync(CLIENTS_FILE);
    console.log(`📁 Archivo Excel: ${stats.size} bytes, modificado: ${stats.mtime}`);
    
    // Si el archivo es muy pequeño, puede estar corrupto
    if (stats.size < 1000) {
      console.log('⚠️  Archivo Excel parece estar corrupto o vacío');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando archivo Excel:', error.message);
    return false;
  }
}

// Función principal de monitoreo
async function monitorearSistema() {
  console.log('🔍 MONITOREO DEL SISTEMA - Prevención de Resets');
  console.log('================================================');
  console.log(`⏰ ${new Date().toLocaleString()}`);
  
  try {
    // Verificar archivo Excel
    const archivoValido = verificarArchivoExcel();
    
    if (!archivoValido) {
      console.log('🛡️  Archivo Excel inválido detectado, ejecutando prevención...');
      try {
        await ejecutarPrevencionReset();
        console.log('✅ Prevención de reset ejecutada');
      } catch (error) {
        console.error('❌ Error ejecutando prevención:', error.message);
      }
    }
    
    // Verificar servidor
    try {
      const estado = await verificarServidor();
      console.log(`📊 Clientes en memoria: ${estado.clientesEnMemoria}`);
      
      if (estado.clientesEnMemoria === 0) {
        console.log('⚠️  No hay clientes en memoria, posible reset detectado');
        console.log('🛡️  Ejecutando prevención de reset...');
        try {
          await ejecutarPrevencionReset();
          console.log('✅ Prevención de reset ejecutada');
        } catch (error) {
          console.error('❌ Error ejecutando prevención:', error.message);
        }
      } else {
        console.log('✅ Sistema funcionando correctamente');
      }
    } catch (error) {
      console.log('⚠️  Servidor no disponible:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error en monitoreo:', error.message);
  }
  
  console.log('================================================\n');
}

// Ejecutar monitoreo cada 5 minutos
console.log('🚀 Iniciando monitoreo del sistema...');
monitorearSistema();

setInterval(monitorearSistema, 5 * 60 * 1000); // Cada 5 minutos

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Monitoreo detenido');
  process.exit(0);
});
