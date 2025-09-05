const http = require('http');

console.log('🌐 Monitor del servidor de producción iniciado');
console.log('⏰ Iniciado en:', new Date().toISOString());
console.log('🎯 Monitoreando: https://sistema-tickets-clientes.onrender.com');

let contador = 0;
let ultimoEstado = null;

function verificarServidorProduccion() {
  contador++;
  const timestamp = new Date().toISOString();
  
  const options = {
    hostname: 'sistema-tickets-clientes.onrender.com',
    port: 443,
    path: '/api/debug/estado-clientes',
    method: 'GET',
    headers: {
      'User-Agent': 'Monitor-Production/1.0'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const estado = JSON.parse(data);
        
        if (ultimoEstado === null) {
          ultimoEstado = estado;
          console.log(`[${timestamp}] 📊 Verificación #${contador} - Estado inicial: ${estado.clientesEnMemoria} clientes`);
          return;
        }
        
        // Detectar cambios
        if (estado.clientesEnMemoria !== ultimoEstado.clientesEnMemoria) {
          console.log(`🚨 [${timestamp}] CAMBIO DETECTADO EN PRODUCCIÓN!`);
          console.log(`   📉 Clientes: ${ultimoEstado.clientesEnMemoria} → ${estado.clientesEnMemoria}`);
          console.log(`   📋 Clientes actuales:`, estado.clientes.map(c => c.nombreCompleto));
        } else {
          console.log(`[${timestamp}] 📊 Verificación #${contador} - Estable: ${estado.clientesEnMemoria} clientes`);
        }
        
        ultimoEstado = estado;
        
      } catch (error) {
        console.log(`❌ [${timestamp}] Error parseando respuesta #${contador}:`, error.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ [${timestamp}] Error en verificación #${contador}:`, error.message);
  });
  
  req.setTimeout(10000, () => {
    console.log(`⏰ [${timestamp}] Timeout en verificación #${contador}`);
    req.destroy();
  });
  
  req.end();
}

// Verificar cada 2 minutos
setInterval(verificarServidorProduccion, 120000);

// Verificación inicial
verificarServidorProduccion();

console.log('✅ Monitor configurado para verificar cada 2 minutos');
console.log('🔄 Presiona Ctrl+C para detener');
