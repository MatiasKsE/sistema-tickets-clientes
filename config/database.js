const { MongoClient } = require('mongodb');

// Configuración de MongoDB
const mongodbConfig = require('./mongodb-config');
const MONGODB_URI = process.env.MONGODB_URI || mongodbConfig.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || mongodbConfig.DB_NAME;

let client = null;
let db = null;

// Conectar a MongoDB
async function connectToMongoDB() {
  try {
    if (!client) {
      console.log('🔌 Conectando a MongoDB...');
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Conectado a MongoDB exitosamente');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
      console.log(`📊 Usando base de datos: ${DB_NAME}`);
    }
    
    return { client, db };
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

// Obtener la base de datos
async function getDatabase() {
  if (!db) {
    await connectToMongoDB();
  }
  return db;
}

// Obtener colecciones
async function getCollections() {
  const database = await getDatabase();
  return {
    clientes: database.collection('clientes'),
    tickets: database.collection('tickets'),
    usuarios: database.collection('usuarios')
  };
}

// Cerrar conexión
async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Verificar conexión
async function checkConnection() {
  try {
    const { db } = await connectToMongoDB();
    await db.admin().ping();
    console.log('✅ MongoDB está funcionando correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión a MongoDB:', error);
    return false;
  }
}

module.exports = {
  connectToMongoDB,
  getDatabase,
  getCollections,
  closeConnection,
  checkConnection
};

