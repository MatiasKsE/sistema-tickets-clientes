const http = require('http');

const BASE_URL = 'http://localhost:8002';
const TEST_INTERVAL = 1 * 60 * 1000; // 1 minuto para pruebas rápidas

console.log('🧪 TEST DE ESTABILIDAD DE CLIENTES ACTIVADO');
console.log('🌐 Servidor:', BASE_URL);
console.log('⏱️  Verificando cada 1 minuto');
console.log('⏰ Iniciado:', new Date().toISOString());
console.log('');

let testCount = 0;
let lastClientCount = 0;
let lastClientList = [];

function checkClientStability() {
  testCount++;
  
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 🧪 Test #${testCount}`);
  
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
        const currentClientList = response.clientes.map(c => c.nombreCompleto);
        
        console.log(`📊 Clientes en memoria: ${currentClientCount}`);
        console.log(`📋 Lista de clientes:`, currentClientList);
        
        if (lastClientCount === 0) {
          lastClientCount = currentClientCount;
          lastClientList = [...currentClientList];
          console.log(`✅ Primera verificación - ${currentClientCount} clientes`);
        } else if (currentClientCount !== lastClientCount) {
          console.log(`🚨 CAMBIO EN CANTIDAD DETECTADO!`);
          console.log(`   Antes: ${lastClientCount} clientes`);
          console.log(`   Ahora: ${currentClientCount} clientes`);
          
          if (currentClientCount === 0) {
            console.log(`   ⚠️  LISTA VACIADA COMPLETAMENTE!`);
          } else if (currentClientCount < lastClientCount) {
            console.log(`   ⚠️  CLIENTES PERDIDOS!`);
          } else {
            console.log(`   ⚠️  CLIENTES AGREGADOS!`);
          }
        } else if (JSON.stringify(currentClientList) !== JSON.stringify(lastClientList)) {
          console.log(`🚨 CAMBIO EN LISTA DETECTADO!`);
          console.log(`   Misma cantidad pero lista diferente`);
          console.log(`   Antes:`, lastClientList);
          console.log(`   Ahora:`, currentClientList);
        } else {
          console.log(`✅ Sin cambios - ${currentClientCount} clientes mantenidos`);
        }
        
        lastClientCount = currentClientCount;
        lastClientList = [...currentClientList];
        
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
setTimeout(checkClientStability, 3000); // Esperar 3 segundos para que el servidor inicie

// Verificación periódica
setInterval(checkClientStability, TEST_INTERVAL);

// Manejar cierre del script
process.on('SIGINT', () => {
  console.log('\n🛑 Test de estabilidad detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test de estabilidad detenido por sistema');
  process.exit(0);
});

