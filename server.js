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

// Configuración de persistencia estable en disco
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'database');
const CLIENTS_FILE = path.join(DATA_DIR, 'clientes.xlsx');
const TICKETS_JSON_FILE = path.join(DATA_DIR, 'tickets.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const TICKETS_DIR = path.join(DATA_DIR, 'tickets');

// Asegurar directorios
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TICKETS_DIR)) fs.mkdirSync(TICKETS_DIR, { recursive: true });

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
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/tickets', express.static(TICKETS_DIR));

// Servir archivos estáticos del cliente en producción
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, 'client/build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
  } else {
    console.log('⚠️  Cliente build no encontrado, sirviendo solo API');
  }
}

// Middleware de autenticación (mover antes de las rutas)
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

// Configuración de multer para subir archivos (simplificada)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});

const upload = multer({ storage: storage });

// Ruta para cargar imagen de ticket (simplificada y con logs)
app.post('/api/upload-ticket-image', authenticateToken, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('❌ Error en subida de imagen:', err);
      return res.status(500).json({ message: 'Error al subir la imagen: ' + err.message });
    }
    if (!req.file) {
      console.log('❌ No se subió ningún archivo');
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }
    console.log('✅ Imagen subida exitosamente:', req.file.filename);
    res.json({
      message: 'Imagen subida exitosamente',
      filename: req.file.filename,
      path: req.file.path
    });
  });
});

// Base de datos simulada (en producción usarías una base de datos real)
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
  }
   {
    id: 5,
    username: 'Mvillagra',
    password: '$2a$10$cdiikVIiDq6R8V2TSzB6rOReikHNQlXrqjorisoeB9URKDph7h5Tu', // Legado2025-.
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
console.log('Clientes al iniciar:', clientes.length);
let ticketsGenerados = [];

// Función para generar ID único
function generarIDUnico() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ID-${timestamp}-${random}`;
}

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
  console.log(`📊 API: Devolviendo ${clientes.length} clientes`);
  console.log('📋 Clientes actuales:', clientes);
  res.json(clientes);
});

// Obtener un cliente por ID
app.get('/api/clientes/:id', authenticateToken, (req, res) => {
  const cliente = clientes.find(c => c.id === req.params.id);
  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }
  res.json(cliente);
});

// Actualizar cliente
app.put('/api/clientes/:id', authenticateToken, (req, res) => {
  const { nombreCompleto, telefono, iglesia, cedula } = req.body;
  const clienteIndex = clientes.findIndex(c => c.id === req.params.id);

  if (clienteIndex === -1) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  if (!nombreCompleto || !telefono || !iglesia || !cedula) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const clienteActual = clientes[clienteIndex];
  const clienteActualizado = {
    ...clienteActual,
    nombreCompleto,
    telefono,
    iglesia,
    cedula
  };

  clientes[clienteIndex] = clienteActualizado;
  guardarEnExcel();
  res.json({ message: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
});

// Eliminar cliente
app.delete('/api/clientes/:id', authenticateToken, (req, res) => {
  const clienteIndex = clientes.findIndex(c => c.id === req.params.id);
  if (clienteIndex === -1) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }
  const [eliminado] = clientes.splice(clienteIndex, 1);
  guardarEnExcel();
  res.json({ message: 'Cliente eliminado exitosamente', cliente: eliminado });
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
    if (!imagenTicket) {
      return res.status(400).json({ message: 'imagenTicket es requerido' });
    }
    const expectedPath = require('path').join(TICKETS_DIR, `ticket-${cliente.id}-${Date.now()}.pdf`);
    console.log('🧪 Generar ticket para:', { clienteId, imagenTicket, UPLOADS_DIR, TICKETS_DIR });
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
    guardarTickets();
    
    res.json({
      message: 'Ticket generado exitosamente',
      ticket: ticketInfo
    });
  } catch (error) {
    console.error('Error generando ticket:', error);
    res.status(500).json({ message: 'Error generando ticket', detail: error.message });
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

// Ruta para obtener estadísticas (clientes y tickets)
app.get('/api/stats', authenticateToken, (req, res) => {
  res.json({
    totalClientes: clientes.length,
    totalTickets: ticketsGenerados.length,
    timestamp: new Date().toISOString()
  });
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

// Ruta temporal para borrar todos los clientes (¡bórrala después de usarla!)
app.post('/api/debug/vaciar-clientes', (req, res) => {
  clientes = [];
  guardarEnExcel();
  res.json({ message: 'Todos los clientes han sido eliminados.' });
});

// Ruta para recargar clientes desde Excel
app.post('/api/debug/recargar-clientes', authenticateToken, (req, res) => {
  cargarDesdeExcel();
  res.json({ 
    message: 'Clientes recargados desde Excel',
    clientesCargados: clientes.length 
  });
});

// Ruta para verificar estado actual de clientes
app.get('/api/debug/estado-clientes', (req, res) => {
  res.json({
    clientesEnMemoria: clientes.length,
    clientes: clientes,
    archivoExcel: fs.existsSync(CLIENTS_FILE),
    dataDir: DATA_DIR,
    ticketsJson: fs.existsSync(TICKETS_JSON_FILE),
    timestamp: new Date().toISOString()
  });
});

// Helpers de backups
function listarBackupsClientes() {
  try {
    const files = fs.readdirSync(DATA_DIR);
    return files
      .filter(name => name.startsWith('clientes.backup-') && name.endsWith('.xlsx'))
      .map(name => {
        const full = path.join(DATA_DIR, name);
        const stat = fs.statSync(full);
        return { filename: name, size: stat.size, mtime: stat.mtime.toISOString() };
      })
      .sort((a, b) => (a.mtime < b.mtime ? 1 : -1));
  } catch (e) {
    console.error('Error listando backups:', e);
    return [];
  }
}

// Administración: exportar y backups (protegido)
app.get('/api/admin/export/clientes', authenticateToken, (req, res) => {
  if (!fs.existsSync(CLIENTS_FILE)) {
    return res.status(404).json({ message: 'Archivo clientes.xlsx no existe' });
  }
  res.download(CLIENTS_FILE, 'clientes.xlsx');
});

app.get('/api/admin/export/tickets', authenticateToken, (req, res) => {
  if (!fs.existsSync(TICKETS_JSON_FILE)) {
    return res.status(404).json({ message: 'Archivo tickets.json no existe' });
  }
  res.download(TICKETS_JSON_FILE, 'tickets.json');
});

app.get('/api/admin/backups', authenticateToken, (req, res) => {
  res.json({ backups: listarBackupsClientes() });
});

app.post('/api/admin/backup-now', authenticateToken, (req, res) => {
  try {
    if (!fs.existsSync(CLIENTS_FILE)) {
      return res.status(404).json({ message: 'No existe clientes.xlsx para respaldar' });
    }
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(DATA_DIR, `clientes.backup-${ts}.xlsx`);
    fs.copyFileSync(CLIENTS_FILE, backupPath);
    return res.json({ message: 'Backup creado', backup: path.basename(backupPath) });
  } catch (e) {
    console.error('Error creando backup:', e);
    return res.status(500).json({ message: 'Error creando backup' });
  }
});

app.post('/api/admin/backups/restore', authenticateToken, (req, res) => {
  try {
    const { filename } = req.body || {};
    if (!filename || !filename.startsWith('clientes.backup-') || !filename.endsWith('.xlsx')) {
      return res.status(400).json({ message: 'filename inválido' });
    }
    const src = path.join(DATA_DIR, filename);
    if (!fs.existsSync(src)) {
      return res.status(404).json({ message: 'Backup no encontrado' });
    }
    fs.copyFileSync(src, CLIENTS_FILE);
    cargarDesdeExcel();
    return res.json({ message: 'Restaurado desde backup y recargado en memoria' });
  } catch (e) {
    console.error('Error restaurando backup:', e);
    return res.status(500).json({ message: 'Error restaurando backup' });
  }
});

app.delete('/api/admin/backups/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename || !filename.startsWith('clientes.backup-') || !filename.endsWith('.xlsx')) {
      return res.status(400).json({ message: 'filename inválido' });
    }
    const target = path.join(DATA_DIR, filename);
    if (!fs.existsSync(target)) {
      return res.status(404).json({ message: 'Backup no encontrado' });
    }
    fs.unlinkSync(target);
    return res.json({ message: 'Backup eliminado' });
  } catch (e) {
    console.error('Error eliminando backup:', e);
    return res.status(500).json({ message: 'Error eliminando backup' });
  }
});

// Debug: verificar si un archivo subido existe por nombre
app.get('/api/debug/exists-upload/:filename', (req, res) => {
  const { filename } = req.params;
  const fullPath = path.join(UPLOADS_DIR, filename);
  const exists = fs.existsSync(fullPath);
  return res.json({ exists, path: fullPath, dataDir: DATA_DIR });
});

// Reemplazar la función generarTicket para PDF
async function generarTicket(cliente, imagenTicket) {
  try {
    // Crear directorio tickets si no existe
    if (!fs.existsSync(TICKETS_DIR)) {
      fs.mkdirSync(TICKETS_DIR, { recursive: true });
    }

    // Verificar que la imagen existe
    const imagePath = path.join(UPLOADS_DIR, imagenTicket);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`La imagen ${imagenTicket} no existe`);
    }

    // Usar dimensiones fijas para el PDF (A4 landscape)
    const width = 842; // A4 landscape width en puntos
    const height = 595; // A4 landscape height en puntos
    console.log('Usando dimensiones fijas:', { width, height });

    // Crear PDF
    const ticketPath = path.join(TICKETS_DIR, `ticket-${cliente.id}-${Date.now()}.pdf`);
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

// Función para cargar clientes desde Excel
function cargarDesdeExcel() {
  try {
    const filePath = CLIENTS_FILE;
    console.log('🔍 Intentando cargar desde:', filePath);
    
    if (fs.existsSync(filePath)) {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('📊 Datos raw del Excel:', data);
      
      // Filtrar solo registros válidos (con ID y nombre)
      const clientesValidos = data.filter(row => row.ID && row['Nombre Completo']);
      
      clientes = clientesValidos.map(row => ({
        id: row.ID,
        nombreCompleto: row['Nombre Completo'],
        telefono: row['Teléfono'] || '',
        iglesia: row['Iglesia'] || '',
        cedula: row['Cédula'] || '',
        fechaCreacion: row['Fecha Creación'] || new Date().toISOString(),
        creadoPor: row['Creado Por'] || 'Sistema'
      }));
      
      console.log(`✅ Cargados ${clientes.length} clientes válidos desde Excel`);
      console.log('📋 Clientes procesados:', clientes);
      
      // Si no hay clientes válidos, crear uno de ejemplo
      if (clientes.length === 0) {
        console.log('⚠️  No hay clientes válidos, creando cliente de ejemplo...');
        const clienteEjemplo = {
          id: generarIDUnico(),
          nombreCompleto: 'Cliente de Ejemplo',
          telefono: '1234567890',
          iglesia: 'Iglesia de Ejemplo',
          cedula: '123456789',
          fechaCreacion: new Date().toISOString(),
          creadoPor: 'Sistema'
        };
        clientes.push(clienteEjemplo);
        guardarEnExcel(); // Guardar el cliente de ejemplo
        console.log('✅ Cliente de ejemplo creado y guardado');
      }
    } else {
      console.log('⚠️  Archivo de clientes no encontrado, creando archivo con cliente de ejemplo...');
      const clienteEjemplo = {
        id: generarIDUnico(),
        nombreCompleto: 'Cliente de Ejemplo',
        telefono: '1234567890',
        iglesia: 'Iglesia de Ejemplo',
        cedula: '123456789',
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'Sistema'
      };
      clientes = [clienteEjemplo];
      guardarEnExcel();
      console.log('✅ Archivo creado con cliente de ejemplo');
    }
  } catch (error) {
    console.error('❌ Error cargando clientes desde Excel:', error);
    console.log('🛠️  Creando cliente de respaldo...');
    const clienteRespaldo = {
      id: generarIDUnico(),
      nombreCompleto: 'Cliente de Respaldo',
      telefono: '1234567890',
      iglesia: 'Iglesia de Respaldo',
      cedula: '123456789',
      fechaCreacion: new Date().toISOString(),
      creadoPor: 'Sistema'
    };
    clientes = [clienteRespaldo];
    guardarEnExcel();
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
    
    // Guardado atómico con backup
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const tmp = `${CLIENTS_FILE}.tmp`;
    // Backup si existe
    if (fs.existsSync(CLIENTS_FILE)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(CLIENTS_FILE, path.join(DATA_DIR, `clientes.backup-${ts}.xlsx`));
    }
    fs.writeFileSync(tmp, buffer);
    fs.renameSync(tmp, CLIENTS_FILE);
    console.log(`💾 Guardados ${clientes.length} clientes en Excel (${CLIENTS_FILE})`);
  } catch (error) {
    console.error('❌ Error guardando en Excel:', error);
  }
}

// Persistir tickets generados en JSON
function guardarTickets() {
  try {
    const payload = JSON.stringify(ticketsGenerados, null, 2);
    fs.writeFileSync(TICKETS_JSON_FILE, payload, 'utf-8');
    console.log(`💾 Guardados ${ticketsGenerados.length} tickets en ${TICKETS_JSON_FILE}`);
  } catch (error) {
    console.error('❌ Error guardando tickets:', error);
  }
}

// Cargar datos al iniciar
cargarDesdeExcel();
// Intentar cargar tickets persistidos
try {
  if (fs.existsSync(TICKETS_JSON_FILE)) {
    const raw = fs.readFileSync(TICKETS_JSON_FILE, 'utf-8');
    ticketsGenerados = JSON.parse(raw);
  }
} catch (_) {
  // ignorar
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
