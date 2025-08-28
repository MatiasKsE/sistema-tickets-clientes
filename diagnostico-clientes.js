const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuración de rutas
const DATA_DIR = path.join(__dirname, 'database');
const CLIENTS_FILE = path.join(DATA_DIR, 'clientes.xlsx');

console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE CLIENTES');
console.log('=====================================');

// Verificar directorio de datos
console.log('\n📁 Directorio de datos:', DATA_DIR);
console.log('Existe:', fs.existsSync(DATA_DIR));

// Verificar archivo Excel
console.log('\n📊 Archivo Excel:', CLIENTS_FILE);
console.log('Existe:', fs.existsSync(CLIENTS_FILE));

if (fs.existsSync(CLIENTS_FILE)) {
  const stats = fs.statSync(CLIENTS_FILE);
  console.log('Tamaño:', stats.size, 'bytes');
  console.log('Última modificación:', stats.mtime);
  
  try {
    const workbook = XLSX.readFile(CLIENTS_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('\n📋 Contenido del archivo Excel:');
    console.log('Total de filas:', data.length);
    
    if (data.length > 0) {
      console.log('Primera fila:', data[0]);
      console.log('Última fila:', data[data.length - 1]);
      
      // Filtrar clientes válidos
      const clientesValidos = data.filter(row => row['Nombre Completo'] && row['Nombre Completo'].trim() !== '');
      console.log('\n✅ Clientes válidos:', clientesValidos.length);
      
      if (clientesValidos.length > 0) {
        console.log('Ejemplo de cliente válido:', clientesValidos[0]);
      }
    } else {
      console.log('⚠️  El archivo Excel está vacío');
    }
  } catch (error) {
    console.error('❌ Error leyendo archivo Excel:', error.message);
  }
} else {
  console.log('⚠️  El archivo Excel no existe');
}

// Verificar backups
console.log('\n💾 Backups disponibles:');
try {
  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR);
    const backups = files.filter(name => name.startsWith('clientes.backup-') && name.endsWith('.xlsx'));
    
    if (backups.length > 0) {
      backups.forEach(backup => {
        const backupPath = path.join(DATA_DIR, backup);
        const stats = fs.statSync(backupPath);
        console.log(`- ${backup} (${stats.size} bytes, ${stats.mtime})`);
      });
    } else {
      console.log('No hay backups disponibles');
    }
  }
} catch (error) {
  console.error('Error listando backups:', error.message);
}

console.log('\n🔍 DIAGNÓSTICO COMPLETADO');
