const { exec } = require('child_process');

console.log('🌐 Monitor de llamadas HTTP iniciado');
console.log('⏰ Iniciado en:', new Date().toISOString());
console.log('🎯 Monitoreando conexiones al puerto 8002...');

let conexionesAnteriores = new Set();

function monitorearConexiones() {
  const timestamp = new Date().toISOString();
  
  exec('netstat -an | findstr :8002', (error, stdout) => {
    if (error) {
      console.log(`❌ [${timestamp}] Error en netstat:`, error.message);
      return;
    }
    
    const lineas = stdout.split('\n').filter(line => line.trim());
    const conexionesActuales = new Set(lineas);
    
    // Detectar nuevas conexiones
    for (const conexion of conexionesActuales) {
      if (!conexionesAnteriores.has(conexion)) {
        console.log(`🔗 [${timestamp}] NUEVA CONEXIÓN DETECTADA:`);
        console.log(`   ${conexion}`);
        
        // Verificar si es una llamada a rutas de debug
        if (conexion.includes('ESTABLISHED')) {
          console.log('   ⚠️  Conexión establecida - posible llamada a API');
        }
      }
    }
    
    // Detectar conexiones cerradas
    for (const conexion of conexionesAnteriores) {
      if (!conexionesActuales.has(conexion)) {
        console.log(`🔌 [${timestamp}] CONEXIÓN CERRADA:`);
        console.log(`   ${conexion}`);
      }
    }
    
    conexionesAnteriores = conexionesActuales;
  });
}

// Monitorear cada 10 segundos
setInterval(monitorearConexiones, 10000);

// Monitoreo inicial
monitorearConexiones();

console.log('✅ Monitor HTTP configurado para verificar cada 10 segundos');
console.log('🔄 Presiona Ctrl+C para detener');
