const http = require('http');

console.log('🔍 Monitor de llamadas a rutas de debug iniciado');
console.log('⏰ Iniciado en:', new Date().toISOString());
console.log('🎯 Monitoreando llamadas que pueden causar resets...');

let contador = 0;
let ultimoEstado = null;

function verificarEstado() {
  contador++;
  const timestamp = new Date().toISOString();
  
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
        const estado = JSON.parse(data);
    
    if (ultimoEstado === null) {
      ultimoEstado = estado;
      console.log(`[${timestamp}] 📊 Verificación #${contador} - Estado inicial: ${estado.clientesEnMemoria} clientes`);
      return;
    }
    
    // Detectar cambios
    if (estado.clientesEnMemoria !== ultimoEstado.clientesEnMemoria) {
      console.log(`🚨 [${timestamp}] CAMBIO DETECTADO!`);
      console.log(`   📉 Clientes: ${ultimoEstado.clientesEnMemoria} → ${estado.clientesEnMemoria}`);
      console.log(`   📋 Clientes actuales:`, estado.clientes.map(c => c.nombreCompleto));
      
      // Verificar si hay algún proceso ejecutándose
      const { exec } = require('child_process');
      exec('tasklist | findstr node', (error, stdout) => {
        if (stdout) {
          console.log('   🔍 Procesos Node.js activos:', stdout.trim());
        }
      });
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
  
  req.end();
}

// Verificar cada 30 segundos
setInterval(verificarEstado, 30000);

// Verificación inicial
verificarEstado();

console.log('✅ Monitor configurado para verificar cada 30 segundos');
console.log('🔄 Presiona Ctrl+C para detener');
