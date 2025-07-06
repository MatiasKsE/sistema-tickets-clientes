# 🎫 Sistema de Gestión de Clientes y Tickets

Una aplicación web completa para gestionar clientes y generar tickets personalizados con imágenes.

## ✨ Características

- 🔐 **Sistema de autenticación** para 2-3 usuarios
- 👥 **Gestión de clientes** con datos completos
- 🆔 **Generación automática de IDs únicos**
- 🎫 **Generación de tickets personalizados** con imagen de fondo
- 📥 **Descarga de tickets** en formato PNG
- 📊 **Base de datos en Excel** para control de registros
- 🔍 **Búsqueda y filtrado** de clientes
- 📈 **Dashboard con estadísticas**
- 📋 **Reportes descargables** en Excel

## 📋 Datos del Cliente

- **Nombre Completo**
- **Teléfono**
- **Iglesia**
- **Cédula de Identidad**
- **ID Único** (generado automáticamente)

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Instalar Node.js**
   - Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)

2. **Instalar dependencias del servidor**
   ```bash
   npm install
   ```

3. **Instalar dependencias del cliente**
   ```bash
   cd client
   npm install
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

5. **Iniciar el cliente (en otra terminal)**
   ```bash
   cd client
   npm start
   ```

## 👤 Usuarios por defecto

| Usuario | Contraseña |
|---------|------------|
| admin1  | admin123   |
| admin2  | admin123   |
| admin3  | admin123   |

## 🎯 Cómo usar el sistema

### 1. Iniciar sesión
- Accede a `http://localhost:3000`
- Usa uno de los usuarios disponibles

### 2. Agregar clientes
- Ve a "Nuevo Cliente"
- Completa todos los campos requeridos
- El ID se genera automáticamente

### 3. Generar tickets
- Ve a "Generar Ticket"
- Selecciona un cliente
- Sube una imagen de fondo
- Genera y descarga el ticket

### 4. Ver reportes
- Ve a "Dashboard"
- Descarga el reporte Excel con todos los datos

## 📁 Estructura del proyecto

```
sistema-tickets/
├── server.js              # Servidor Express
├── package.json           # Dependencias del servidor
├── client/                # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── App.js         # Componente principal
│   │   └── index.js       # Punto de entrada
│   └── package.json       # Dependencias del cliente
├── uploads/               # Imágenes subidas
├── tickets/               # Tickets generados
├── database/              # Archivos Excel
└── README.md              # Este archivo
```

## 🔧 Configuración

### Cambiar contraseñas
Edita el archivo `server.js` y modifica las contraseñas hasheadas:

```javascript
const users = [
  {
    id: 1,
    username: 'admin1',
    password: '$2a$10$...', // Nueva contraseña hasheada
    role: 'admin'
  }
];
```

### Generar nueva contraseña
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('nueva_contraseña', 10);
```

## 🎨 Personalización de tickets

Los tickets se generan con:
- **Imagen de fondo** personalizada
- **Datos del cliente** en el centro
- **ID único** en la esquina inferior izquierda
- **Formato PNG** para descarga

## 📊 Base de datos

Los datos se almacenan en:
- **Memoria del servidor** (durante la sesión)
- **Archivo Excel** (`database/clientes.xlsx`)
- **Reportes descargables** con todas las estadísticas

## 🛠️ Tecnologías utilizadas

### Backend
- **Express.js** - Servidor web
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **multer** - Subida de archivos
- **xlsx** - Manejo de archivos Excel
- **canvas** - Generación de imágenes

### Frontend
- **React** - Interfaz de usuario
- **React Router** - Navegación
- **Axios** - Peticiones HTTP
- **Bootstrap** - Estilos CSS
- **React Bootstrap** - Componentes UI

## 🔒 Seguridad

- **Autenticación JWT** con tokens de 24 horas
- **Contraseñas encriptadas** con bcrypt
- **Validación de datos** en frontend y backend
- **CORS configurado** para desarrollo

## 📝 Notas importantes

1. **Imágenes de ticket**: Sube imágenes de buena calidad para mejores resultados
2. **IDs únicos**: Se generan automáticamente con timestamp y número aleatorio
3. **Base de datos**: Los datos se guardan en Excel para fácil acceso
4. **Reportes**: Descarga reportes completos desde el dashboard

## 🐛 Solución de problemas

### Error de puerto
Si el puerto 5000 está ocupado, cambia en `server.js`:
```javascript
const PORT = process.env.PORT || 5001;
```

### Error de dependencias
```bash
npm install --force
```

### Error de permisos
Ejecuta como administrador en Windows o usa `sudo` en Linux/Mac.

## 📞 Soporte

Para problemas o preguntas:
1. Verifica que Node.js esté instalado correctamente
2. Revisa los logs del servidor en la consola
3. Asegúrate de que todos los puertos estén disponibles

## 🎉 ¡Listo!

Tu sistema de gestión de clientes y tickets está listo para usar. ¡Disfruta gestionando tus clientes y generando tickets personalizados!

## 🚀 Despliegue en Vercel + Railway

### Frontend (Vercel)
1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar con GitHub** y subir el proyecto
3. **Configurar variables de entorno**:
   - `REACT_APP_API_URL=https://tu-backend-url.railway.app`

### Backend (Railway)
1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar con GitHub** y subir el backend
3. **Configurar variables de entorno**:
   - `PORT=8002`
   - `JWT_SECRET=tu-secreto-jwt`

## 📁 Estructura del Proyecto

```
Pagina de Prueba/
├── client/                 # Frontend React
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── server.js              # Backend Express
├── package.json
└── README.md
```

## 🔧 Instalación Local

### Backend
```bash
npm install
node server.js
```

### Frontend
```bash
cd client
npm install
npm start
```

## 🌐 URLs de Acceso

- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://tu-backend-url.railway.app

## 👤 Credenciales de Prueba

- **Usuario**: admin1
- **Contraseña**: 123456

## 📋 Funcionalidades

- ✅ Autenticación JWT
- ✅ Registro de clientes
- ✅ Carga de imágenes
- ✅ Generación de tickets PDF
- ✅ Exportación a Excel
- ✅ Interfaz moderna y responsive 