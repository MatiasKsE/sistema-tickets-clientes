const fs = require('fs');
const path = require('path');

const CLIENTS_FILE = path.join(__dirname, 'database', 'clientes.xlsx');
const LOG_FILE = path.join(__dirname, 'monitor-reset.log');

console.log('🔍 MONITOR DE RESET ACTIVADO');
console.log('📁 Monitoreando archivo:', CLIENTS_FILE);
console.log('📝 Log guardado en:', LOG_FILE);
console.log('⏰ Iniciado:', new Date().toISOString());
console.log('');

let lastSize = 0;
let lastModified = null;
let checkCount = 0;

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Guardar en archivo de log
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

function checkFile() {
  checkCount++;
  
  try {
    if (fs.existsSync(CLIENTS_FILE)) {
      const stats = fs.statSync(CLIENTS_FILE);
      const currentSize = stats.size;
      const currentModified = stats.mtime;
      
      if (lastSize === 0) {
        // Primera verificación
        lastSize = currentSize;
        lastModified = currentModified;
        log(`✅ Primera verificación - Tamaño: ${currentSize} bytes, Modificado: ${currentModified}`);
      } else {
        // Verificaciones posteriores
        if (currentSize !== lastSize) {
          log(`🚨 CAMBIO DETECTADO - Tamaño cambió de ${lastSize} a ${currentSize} bytes`);
          log(`   ⚠️  POSIBLE RESET AUTOMÁTICO DETECTADO`);
        }
        
        if (currentModified.getTime() !== lastModified.getTime()) {
          log(`🔄 Archivo modificado - De: ${lastModified} a: ${currentModified}`);
        }
        
        lastSize = currentSize;
        lastModified = currentModified;
      }
      
      log(`📊 Verificación #${checkCount} - Tamaño: ${currentSize} bytes, OK`);
    } else {
      log(`❌ ERROR: Archivo Excel no encontrado`);
    }
  } catch (error) {
    log(`💥 ERROR en verificación: ${error.message}`);
  }
}

// Verificar cada 5 minutos
const INTERVAL = 5 * 60 * 1000; // 5 minutos

log(`⏱️  Configurado para verificar cada ${INTERVAL/1000/60} minutos`);

// Primera verificación inmediata
checkFile();

// Verificación periódica
setInterval(checkFile, INTERVAL);

// Manejar cierre del script
process.on('SIGINT', () => {
  log('🛑 Monitor detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('🛑 Monitor detenido por sistema');
  process.exit(0);
});
