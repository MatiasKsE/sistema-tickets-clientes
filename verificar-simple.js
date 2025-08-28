const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8002,
  path: '/api/debug/estado-clientes',
  method: 'GET'
};

console.log('🔍 VERIFICANDO ESTADO DEL SERVIDOR');
console.log('==================================');

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n📊 ESTADO DE CLIENTES:');
      console.log('- Clientes en memoria:', response.clientesEnMemoria);
      console.log('- Archivo Excel existe:', response.archivoExcel.existe);
      console.log('- Tamaño del archivo:', response.archivoExcel.tamaño, 'bytes');
      
      if (response.archivoExcel.contenido) {
        console.log('- Contenido del Excel:', response.archivoExcel.contenido.length, 'filas');
        if (response.archivoExcel.contenido.length > 0) {
          console.log('- Primer cliente:', response.archivoExcel.contenido[0]);
        }
      }
      
      console.log('\n📋 CLIENTES EN MEMORIA:');
      if (response.clientes && response.clientes.length > 0) {
        response.clientes.forEach((cliente, index) => {
          console.log(`${index + 1}. ${cliente.nombreCompleto} (${cliente.id})`);
        });
      } else {
        console.log('No hay clientes en memoria');
      }
      
    } catch (error) {
      console.error('❌ Error parseando respuesta:', error.message);
      console.log('Respuesta raw:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error de conexión:', error.message);
});

req.end();
