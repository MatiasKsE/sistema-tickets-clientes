const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const XLSX = require('xlsx');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
// Removemos image-size ya que causa problemas

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://legado2025.netlify.app',
        'http://localhost:3000'
      ]
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Servir archivos estáticos de uploads y tickets
app.use('/uploads', express.static('uploads'));
app.use('/tickets', express.static('tickets'));

// Servir archivos estáticos del cliente en producción
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, 'client/build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
  } else {
    console.log('⚠️  Cliente build no encontrado, sirviendo solo API');
  }
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Crear directorio uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Base de datos simulada (en producción usarías una base de datos real)
const users = [
  {
    id: 1,
    username: 'test',
    password: '$2a$10$C1Nw83ifGBK4EnfKec4D7uzeif6rRzd8QNtWviK7F9E9WhujzgfNe', // 123456
    role: 'admin'
  },
  {
    id: 2,
    username: 'Rparedes',
    password: '$2a$10$C1Nw83ifGBK4EnfKec4D7uzeif6rRzd8QNtWviK7F9E9WhujzgfNe', // rparedes
    role: 'admin'
  },
  {
    id: 3,
    username: 'admin2',
    password: '$2a$10$C1Nw83ifGBK4EnfKec4D7uzeif6rRzd8QNtWviK7F9E9WhujzgfNe', // 123456
    role: 'admin'
  },
  {
    id: 4,
    username: 'admin3',
    password: '$2a$10$C1Nw83ifGBK4EnfKec4D7uzeif6rRzd8QNtWviK7F9E9WhujzgfNe', // 123456
    role: 'admin'
  }
];

// Para generar nuevas contraseñas hasheadas, puedes usar esta función:
// const bcrypt = require('bcryptjs');
// const hashedPassword = await bcrypt.hash('tu_nueva_contraseña', 10);
// console.log(hashedPassword);

// Ejemplos de contraseñas hasheadas:
// 'admin123' = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
// 'password123' = '$2a$10$rQZ8K9mP2nL1vX3yW4zA5bC6dE7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7z'
// '123456' = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

let clientes = [];
let ticketsGenerados = [];

// Función para generar ID único
function generarIDUnico() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ID-${timestamp}-${random}`;
}

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'tu_secreto_jwt_aqui', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`Intento de login - Usuario: ${username}, Contraseña: ${password}`);

  const user = users.find(u => u.username === username);
  if (!user) {
    console.log(`Usuario no encontrado: ${username}`);
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  console.log(`Usuario encontrado: ${user.username}, Hash: ${user.password}`);

  const validPassword = await bcrypt.compare(password, user.password);
  console.log(`Contraseña válida: ${validPassword}`);

  if (!validPassword) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, 'tu_secreto_jwt_aqui', { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Ruta para cargar imagen de ticket
app.post('/api/upload-ticket-image', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  
  res.json({ 
    message: 'Imagen subida exitosamente',
    filename: req.file.filename,
    path: req.file.path 
  });
});

// Ruta para crear cliente
app.post('/api/clientes', authenticateToken, (req, res) => {
  const { nombreCompleto, telefono, iglesia, cedula } = req.body;
  
  if (!nombreCompleto || !telefono || !iglesia || !cedula) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const nuevoCliente = {
    id: generarIDUnico(),
    nombreCompleto,
    telefono,
    iglesia,
    cedula,
    fechaCreacion: new Date().toISOString(),
    creadoPor: req.user.username
  };

  clientes.push(nuevoCliente);
  
  // Guardar en Excel
  guardarEnExcel();
  
  res.json({ 
    message: 'Cliente creado exitosamente',
    cliente: nuevoCliente 
  });
});

// Ruta para obtener todos los clientes
app.get('/api/clientes', authenticateToken, (req, res) => {
  res.json(clientes);
});

// Ruta de prueba para healthcheck
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

// Ruta para generar ticket
app.post('/api/generar-ticket', authenticateToken, async (req, res) => {
  const { clienteId, imagenTicket } = req.body;
  
  const cliente = clientes.find(c => c.id === clienteId);
  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  try {
    const ticketPath = await generarTicket(cliente, imagenTicket);
    
    const ticketInfo = {
      id: generarIDUnico(),
      clienteId: cliente.id,
      cliente: cliente,
      ticketPath: ticketPath,
      fechaGeneracion: new Date().toISOString(),
      generadoPor: req.user.username
    };
    
    ticketsGenerados.push(ticketInfo);
    
    res.json({
      message: 'Ticket generado exitosamente',
      ticket: ticketInfo
    });
  } catch (error) {
    console.error('Error generando ticket:', error);
    res.status(500).json({ message: 'Error generando ticket' });
  }
});

// Ruta para descargar ticket
app.get('/api/descargar-ticket/:ticketId', authenticateToken, (req, res) => {
  const ticket = ticketsGenerados.find(t => t.id === req.params.ticketId);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }
  // Agregar header CORS manualmente
  res.setHeader('Access-Control-Allow-Origin', 'https://legado2025.netlify.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.download(ticket.ticketPath);
});

// Ruta para obtener reporte Excel
app.get('/api/reporte-excel', authenticateToken, (req, res) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Hoja de clientes
    const clientesData = clientes.map(cliente => ({
      ID: cliente.id,
      'Nombre Completo': cliente.nombreCompleto,
      'Teléfono': cliente.telefono,
      'Iglesia': cliente.iglesia,
      'Cédula': cliente.cedula,
      'Fecha Creación': cliente.fechaCreacion,
      'Creado Por': cliente.creadoPor
    }));
    
    const clientesSheet = XLSX.utils.json_to_sheet(clientesData);
    XLSX.utils.book_append_sheet(workbook, clientesSheet, 'Clientes');
    
    // Hoja de tickets
    const ticketsData = ticketsGenerados.map(ticket => ({
      'ID Ticket': ticket.id,
      'ID Cliente': ticket.clienteId,
      'Nombre Cliente': ticket.cliente.nombreCompleto,
      'Fecha Generación': ticket.fechaGeneracion,
      'Generado Por': ticket.generadoPor
    }));
    
    const ticketsSheet = XLSX.utils.json_to_sheet(ticketsData);
    XLSX.utils.book_append_sheet(workbook, ticketsSheet, 'Tickets');
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-clientes.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ message: 'Error generando reporte' });
  }
});

// Ruta de debug para verificar usuarios
app.get('/api/debug/users', (req, res) => {
  const userList = users.map(user => ({
    id: user.id,
    username: user.username,
    role: user.role,
    passwordHash: user.password
  }));
  res.json(userList);
});

// Ruta para generar contraseñas hasheadas
app.get('/api/debug/generate-password/:password', async (req, res) => {
  try {
    const password = req.params.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json({
      originalPassword: password,
      hashedPassword: hashedPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generando contraseña' });
  }
});

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    users: users.length
  });
});

// Reemplazar la función generarTicket para PDF
async function generarTicket(cliente, imagenTicket) {
  try {
    // Crear directorio tickets si no existe
    if (!fs.existsSync('tickets')) {
      fs.mkdirSync('tickets');
    }

    // Verificar que la imagen existe
    const imagePath = `uploads/${imagenTicket}`;
    if (!fs.existsSync(imagePath)) {
      throw new Error(`La imagen ${imagenTicket} no existe`);
    }

    // Usar dimensiones fijas para el PDF (A4 landscape)
    const width = 842; // A4 landscape width en puntos
    const height = 595; // A4 landscape height en puntos
    console.log('Usando dimensiones fijas:', { width, height });

    // Crear PDF
    const ticketPath = `tickets/ticket-${cliente.id}-${Date.now()}.pdf`;
    console.log('Creando PDF en:', ticketPath);
    
    const doc = new PDFDocument({ size: [width, height] });
    const stream = fs.createWriteStream(ticketPath);
    doc.pipe(stream);

    // Fondo: imagen centrada y escalada
    doc.image(imagePath, 0, 0, { width, height, fit: [width, height] });

    // Texto en blanco con fuentes más pequeñas, posición más alta y centrado horizontalmente
    doc.fillColor('white');
    doc.fontSize(20).font('Helvetica-Bold');
    doc.text(cliente.nombreCompleto, 150, height/7 - 30, { width: width - 300, align: 'left' });
    doc.fontSize(14).font('Helvetica');
    doc.text(`Teléfono: ${cliente.telefono}`, 150, height/7 + 10, { width: width - 300, align: 'left' });
    doc.text(`Iglesia: ${cliente.iglesia}`, 150, height/7 + 40, { width: width - 300, align: 'left' });
    doc.text(`Cédula: ${cliente.cedula}`, 150, height/7 + 70, { width: width - 300, align: 'left' });

    // ID en la esquina inferior izquierda con fuente más pequeña
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`ID: ${cliente.id}`, 20, height - 350, { align: 'left', width: 200 });

    doc.end();

    // Esperar a que el PDF se termine de escribir
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    console.log('PDF generado exitosamente:', ticketPath);
    return ticketPath;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
}

// Función para guardar en Excel
function guardarEnExcel() {
  try {
    const workbook = XLSX.utils.book_new();
    const clientesData = clientes.map(cliente => ({
      ID: cliente.id,
      'Nombre Completo': cliente.nombreCompleto,
      'Teléfono': cliente.telefono,
      'Iglesia': cliente.iglesia,
      'Cédula': cliente.cedula,
      'Fecha Creación': cliente.fechaCreacion,
      'Creado Por': cliente.creadoPor
    }));
    
    const sheet = XLSX.utils.json_to_sheet(clientesData);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Clientes');
    
    XLSX.writeFile(workbook, 'database/clientes.xlsx');
  } catch (error) {
    console.error('Error guardando en Excel:', error);
  }
}

// Crear directorio database si no existe
if (!fs.existsSync('database')) {
  fs.mkdirSync('database');
}

// Ruta catch-all para el cliente React en producción
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'client/build', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ 
        message: 'API funcionando correctamente', 
        note: 'Cliente React no disponible, solo API activa',
        endpoints: {
          test: '/api/test',
          login: '/api/login',
          clientes: '/api/clientes'
        }
      });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}); 