const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'database');

console.log('🧹 LIMPIANDO BACKUPS AUTOMÁTICOS');
console.log('================================');

try {
  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR);
    const backups = files.filter(name => name.startsWith('clientes.backup-auto-') && name.endsWith('.xlsx'));
    
    console.log(`📁 Encontrados ${backups.length} backups automáticos`);
    
    if (backups.length > 0) {
      backups.forEach(backup => {
        const backupPath = path.join(DATA_DIR, backup);
        try {
          fs.unlinkSync(backupPath);
          console.log(`🗑️  Eliminado: ${backup}`);
        } catch (error) {
          console.error(`❌ Error eliminando ${backup}:`, error.message);
        }
      });
      console.log('✅ Limpieza completada');
    } else {
      console.log('✅ No hay backups automáticos para limpiar');
    }
  } else {
    console.log('❌ Directorio de datos no encontrado');
  }
} catch (error) {
  console.error('❌ Error durante la limpieza:', error.message);
}

console.log('================================');
