const http = require('http');

const BASE_URL = 'http://localhost:8002';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3NTQzNjEyOTYsImV4cCI6MTc1NDQ0NzY5Nn0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // Token de prueba

console.log('🧪 TEST AGREGAR CLIENTES Y VERIFICAR ESTABILIDAD');
console.log('🌐 Servidor:', BASE_URL);
console.log('⏰ Iniciado:', new Date().toISOString());
console.log('');

// Función para agregar un cliente de prueba
function agregarCliente(nombre, telefono, iglesia, cedula) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      nombreCompleto: nombre,
      telefono: telefono,
      iglesia: iglesia,
      cedula: cedula
    });

    const options = {
      hostname: 'localhost',
      port: 8002,
      path: '/api/clientes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 201) {
            console.log(`✅ Cliente agregado: ${nombre} (ID: ${response.cliente.id})`);
            resolve(response.cliente);
          } else {
            console.log(`❌ Error agregando cliente ${nombre}:`, response.message);
            reject(new Error(response.message));
          }
        } catch (error) {
          console.log(`❌ Error parseando respuesta para ${nombre}:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de conexión para ${nombre}:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Función para verificar estado de clientes
function verificarClientes() {
  return new Promise((resolve, reject) => {
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
          console.log(`📊 Estado actual: ${response.clientesEnMemoria} clientes en memoria`);
          console.log(`📋 Lista:`, response.clientes.map(c => c.nombreCompleto));
          resolve(response);
        } catch (error) {
          console.log(`❌ Error parseando estado:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de conexión:`, error.message);
      reject(error);
    });

    req.end();
  });
}

// Función principal de prueba
async function ejecutarPrueba() {
  try {
    console.log('🔍 Verificando estado inicial...');
    await verificarClientes();
    
    console.log('\n➕ Agregando clientes de prueba...');
    
    // Agregar varios clientes
    await agregarCliente('Juan Pérez', '0981234567', 'Iglesia Central', '1234567');
    await agregarCliente('María García', '0987654321', 'Iglesia del Sur', '7654321');
    await agregarCliente('Carlos López', '0981111111', 'Iglesia del Norte', '1111111');
    
    console.log('\n🔍 Verificando estado después de agregar...');
    await verificarClientes();
    
    console.log('\n⏰ Esperando 2 minutos para verificar estabilidad...');
    console.log('📝 Monitoreando cada 30 segundos...');
    
    let verificaciones = 0;
    const intervalo = setInterval(async () => {
      verificaciones++;
      console.log(`\n[${new Date().toISOString()}] 🔍 Verificación #${verificaciones}`);
      await verificarClientes();
      
      if (verificaciones >= 4) { // 2 minutos (4 x 30 segundos)
        clearInterval(intervalo);
        console.log('\n✅ Prueba completada. Verificando estado final...');
        await verificarClientes();
        console.log('\n🎯 Si los clientes se mantienen, el problema está resuelto!');
        process.exit(0);
      }
    }, 30000); // 30 segundos
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    process.exit(1);
  }
}

// Ejecutar prueba después de 3 segundos para que el servidor inicie
setTimeout(ejecutarPrueba, 3000);

// Manejar cierre del script
process.on('SIGINT', () => {
  console.log('\n🛑 Test detenido por usuario');
  process.exit(0);
});

