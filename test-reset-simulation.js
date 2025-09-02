const http = require('http');

const BASE_URL = 'http://localhost:8002';
const TEST_INTERVAL = 2 * 60 * 1000; // 2 minutos para pruebas rápidas

console.log('🧪 SIMULADOR DE RESET ACTIVADO');
console.log('🌐 Servidor:', BASE_URL);
console.log('⏱️  Verificando cada 2 minutos');
console.log('⏰ Iniciado:', new Date().toISOString());
console.log('');

let testCount = 0;
let lastClientCount = 0;

function checkServerStatus() {
  testCount++;
  
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 🧪 Prueba #${testCount}`);
  
  // Verificar estado de clientes
  const options = {
    hostname: 'localhost',
    port: 8002,
    path: '/api/debug/estado-clientes',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        const currentClientCount = response.clientesEnMemoria;
        
        console.log(`📊 Clientes en memoria: ${currentClientCount}`);
        console.log(`📋 Lista de clientes:`, response.clientes.map(c => c.nombreCompleto));
        
        if (lastClientCount === 0) {
          lastClientCount = currentClientCount;
          console.log(`✅ Primera verificación - ${currentClientCount} clientes`);
        } else if (currentClientCount !== lastClientCount) {
          console.log(`🚨 CAMBIO DETECTADO!`);
          console.log(`   Antes: ${lastClientCount} clientes`);
          console.log(`   Ahora: ${currentClientCount} clientes`);
          console.log(`   ⚠️  POSIBLE RESET DETECTADO!`);
        } else {
          console.log(`✅ Sin cambios - ${currentClientCount} clientes mantenidos`);
        }
        
        lastClientCount = currentClientCount;
        
      } catch (error) {
        console.log(`❌ Error parseando respuesta:`, error.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Error de conexión:`, error.message);
  });
  
  req.end();
}

// Primera verificación inmediata
checkServerStatus();

// Verificación periódica
setInterval(checkServerStatus, TEST_INTERVAL);

// Manejar cierre del script
process.on('SIGINT', () => {
  console.log('\n🛑 Simulador detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Simulador detenido por sistema');
  process.exit(0);
});
