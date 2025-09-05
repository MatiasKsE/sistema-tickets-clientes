const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Importar configuración y servicios de MongoDB
const { connectToMongoDB, getCollections, checkConnection } = require('./config/database');
const ClienteService = require('./services/ClienteService');
const TicketService = require('./services/TicketService');

const app = express();
const PORT = process.env.PORT || 8002;

// Configuración de directorios para archivos
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'database');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const TICKETS_DIR = path.join(DATA_DIR, 'tickets');

// Asegurar directorios
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TICKETS_DIR)) fs.mkdirSync(TICKETS_DIR, { recursive: true });

// Middleware
app.use(cors({
  origin: [
    'https://legado2025.netlify.app',
    'http://localhost:3000',
    'http://localhost:8002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// Middleware para manejar solicitudes OPTIONS (preflight CORS)
app.options('*', cors());

// Servir archivos estáticos de uploads y tickets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/tickets', express.static(TICKETS_DIR));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen y PDF'));
    }
  }
});

// Usuarios del sistema (mantener en memoria por ahora)
const users = [
  {
    id: 1,
    username: 'Nformigli',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
    role: 'admin'
  },
  {
    id: 2,
    username: 'Rparedes',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
    role: 'admin'
  },
  {
    id: 3,
    username: 'Admin',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
    role: 'admin'
  },
  {
    id: 4,
    username: 'Erolon',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
    role: 'admin'
  },
  {
    id: 5,
    username: 'Mvillagra',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
    role: 'admin'
  }
];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Intento de login - Usuario: ${username}, Contraseña: ${password}`);

    const user = users.find(u => u.username === username);
    if (!user) {
      console.log(`Usuario no encontrado: ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log(`Usuario encontrado: ${user.username}, Hash: ${user.password}`);
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(`Contraseña válida: ${validPassword}`);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rutas de clientes con MongoDB
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const clientes = await ClienteService.getAllClientes();
    res.json(clientes);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ message: 'Error obteniendo clientes' });
  }
});

app.post('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const clienteData = {
      ...req.body,
      creadoPor: req.user.username
    };
    
    const cliente = await ClienteService.createCliente(clienteData);
    res.json({ message: 'Cliente creado exitosamente', cliente });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const cliente = await ClienteService.updateCliente(id, updateData);
    res.json({ message: 'Cliente actualizado exitosamente', cliente });
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await ClienteService.deleteCliente(id);
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/clientes/:id/pago', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { pagado } = req.body;
    
    await ClienteService.updatePagoStatus(id, pagado);
    res.json({ 
      message: `Estado de pago actualizado a ${pagado ? 'Pagado' : 'Pendiente'}`,
      pagado 
    });
  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    res.status(400).json({ message: error.message });
  }
});

// Rutas de tickets con MongoDB
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await TicketService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({ message: 'Error obteniendo tickets' });
  }
});

app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      creadoPor: req.user.username
    };
    
    const ticket = await TicketService.createTicket(ticketData);
    res.json({ message: 'Ticket creado exitosamente', ticket });
  } catch (error) {
    console.error('Error creando ticket:', error);
    res.status(400).json({ message: error.message });
  }
});

// Ruta para generar PDF de ticket
app.post('/api/tickets/generar-pdf', authenticateToken, async (req, res) => {
  try {
    const { clienteId, clienteNombre, clienteTelefono, clienteIglesia, clienteCedula } = req.body;
    
    // Crear ticket en MongoDB
    const ticketData = {
      clienteId,
      clienteNombre,
      clienteTelefono,
      clienteIglesia,
      clienteCedula,
      creadoPor: req.user.username
    };
    
    const ticket = await TicketService.createTicket(ticketData);
    
    // Generar PDF
    const pdfPath = await generarPDFTicket(ticket);
    
    // Actualizar ticket con la ruta del archivo
    await TicketService.updateTicket(ticket.id, { archivoPath: pdfPath });
    
    res.json({ 
      message: 'Ticket generado exitosamente', 
      ticket,
      pdfUrl: `/tickets/${path.basename(pdfPath)}`
    });
  } catch (error) {
    console.error('Error generando ticket PDF:', error);
    res.status(500).json({ message: 'Error generando ticket' });
  }
});

// Función para generar PDF de ticket
async function generarPDFTicket(ticket) {
  try {
    const doc = new PDFDocument({ size: 'A4' });
    const fileName = `ticket-${ticket.id}.pdf`;
    const filePath = path.join(TICKETS_DIR, fileName);
    
    doc.pipe(fs.createWriteStream(filePath));
    
    // Contenido del PDF
    doc.fontSize(20).text('TICKET DE ENTRADA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`ID: ${ticket.id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Cliente: ${ticket.clienteNombre}`);
    doc.text(`Teléfono: ${ticket.clienteTelefono}`);
    doc.text(`Iglesia: ${ticket.clienteIglesia}`);
    doc.text(`Cédula: ${ticket.clienteCedula}`);
    doc.moveDown();
    doc.text(`Fecha: ${new Date(ticket.fechaCreacion).toLocaleDateString()}`);
    doc.text(`Generado por: ${ticket.creadoPor}`);
    
    doc.end();
    
    return filePath;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
}

// Ruta de estadísticas
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [clienteStats, ticketStats] = await Promise.all([
      ClienteService.getStats(),
      TicketService.getStats()
    ]);
    
    res.json({
      clientes: clienteStats,
      tickets: ticketStats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error obteniendo estadísticas' });
  }
});

// Ruta de debug para MongoDB
app.get('/api/debug/mongodb-status', async (req, res) => {
  try {
    const isConnected = await checkConnection();
    const { clientes, tickets } = await getCollections();
    
    const clienteCount = await clientes.countDocuments();
    const ticketCount = await tickets.countDocuments();
    
    res.json({
      mongodb: {
        connected: isConnected,
        clienteCount,
        ticketCount
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Error verificando estado de MongoDB:', error);
    res.status(500).json({ 
      mongodb: { connected: false },
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await connectToMongoDB();
    
    // Verificar conexión
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a MongoDB');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 MongoDB: Conectado exitosamente`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

