const { connectToMongoDB, checkConnection, getCollections } = require('./config/database');
const ClienteService = require('./services/ClienteService');
const TicketService = require('./services/TicketService');

async function testMongoDB() {
  console.log('🧪 Iniciando pruebas de MongoDB...');
  
  try {
    // 1. Probar conexión
    console.log('1️⃣ Probando conexión a MongoDB...');
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a MongoDB');
    }
    console.log('✅ Conexión exitosa');
    
    // 2. Probar colecciones
    console.log('2️⃣ Probando acceso a colecciones...');
    const { clientes, tickets } = await getCollections();
    console.log('✅ Colecciones accesibles');
    
    // 3. Probar ClienteService
    console.log('3️⃣ Probando ClienteService...');
    
    // Crear un cliente de prueba
    const clienteTest = await ClienteService.createCliente({
      nombreCompleto: 'Cliente Test MongoDB',
      telefono: '0987654321',
      iglesia: 'Test Iglesia',
      cedula: '1234567',
      pagado: false,
      creadoPor: 'Test'
    });
    console.log('✅ Cliente creado:', clienteTest.nombreCompleto);
    
    // Obtener todos los clientes
    const todosClientes = await ClienteService.getAllClientes();
    console.log(`✅ Total de clientes: ${todosClientes.length}`);
    
    // Obtener cliente por ID
    const clienteObtenido = await ClienteService.getClienteById(clienteTest.id);
    console.log('✅ Cliente obtenido por ID:', clienteObtenido.nombreCompleto);
    
    // Actualizar cliente
    const clienteActualizado = await ClienteService.updateCliente(clienteTest.id, {
      pagado: true
    });
    console.log('✅ Cliente actualizado, pagado:', clienteActualizado.pagado);
    
    // Obtener estadísticas
    const stats = await ClienteService.getStats();
    console.log('✅ Estadísticas:', stats);
    
    // 4. Probar TicketService
    console.log('4️⃣ Probando TicketService...');
    
    // Crear un ticket de prueba
    const ticketTest = await TicketService.createTicket({
      clienteId: clienteTest.id,
      clienteNombre: clienteTest.nombreCompleto,
      clienteTelefono: clienteTest.telefono,
      clienteIglesia: clienteTest.iglesia,
      clienteCedula: clienteTest.cedula,
      creadoPor: 'Test'
    });
    console.log('✅ Ticket creado:', ticketTest.id);
    
    // Obtener todos los tickets
    const todosTickets = await TicketService.getAllTickets();
    console.log(`✅ Total de tickets: ${todosTickets.length}`);
    
    // Obtener estadísticas de tickets
    const ticketStats = await TicketService.getStats();
    console.log('✅ Estadísticas de tickets:', ticketStats);
    
    // 5. Limpiar datos de prueba
    console.log('5️⃣ Limpiando datos de prueba...');
    await ClienteService.deleteCliente(clienteTest.id);
    await TicketService.deleteTicket(ticketTest.id);
    console.log('✅ Datos de prueba eliminados');
    
    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar pruebas
testMongoDB();

