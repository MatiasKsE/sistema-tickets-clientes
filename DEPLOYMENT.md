# 🚀 Guía de Despliegue - Vercel + Railway

## 📋 Pasos para hacer tu aplicación pública

### **Paso 1: Preparar el repositorio GitHub**

1. **Crear cuenta en GitHub** (si no tienes): https://github.com
2. **Crear un nuevo repositorio** llamado `sistema-tickets-clientes`
3. **Subir tu código** al repositorio:
   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/sistema-tickets-clientes.git
   git push -u origin main
   ```

### **Paso 2: Desplegar el Backend en Railway**

1. **Ir a Railway**: https://railway.app
2. **Crear cuenta** con GitHub
3. **Crear nuevo proyecto** → "Deploy from GitHub repo"
4. **Seleccionar tu repositorio**
5. **Configurar variables de entorno**:
   - `PORT=8002`
   - `JWT_SECRET=tu-secreto-super-seguro-123`
   - `NODE_ENV=production`
6. **Esperar a que se despliegue** y copiar la URL (ej: `https://tu-backend.railway.app`)

### **Paso 3: Desplegar el Frontend en Vercel**

1. **Ir a Vercel**: https://vercel.com
2. **Crear cuenta** con GitHub
3. **Importar proyecto** desde GitHub
4. **Configurar variables de entorno**:
   - `REACT_APP_API_URL=https://tu-backend.railway.app`
5. **Deploy** y copiar la URL (ej: `https://tu-app.vercel.app`)

### **Paso 4: Actualizar configuración**

1. **Actualizar vercel.json** con la URL correcta del backend
2. **Actualizar CORS** en server.js con la URL correcta del frontend
3. **Redeploy** ambos servicios

## 🔧 Configuración Final

### **URLs de Acceso:**
- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://tu-backend.railway.app

### **Credenciales:**
- **Usuario**: admin1
- **Contraseña**: 123456

## 📱 Compartir con otros

Una vez desplegado, puedes compartir la URL del frontend:
```
https://tu-app.vercel.app
```

Cualquier persona podrá acceder desde cualquier lugar del mundo.

## 🔒 Seguridad

- ✅ **HTTPS automático** en Vercel y Railway
- ✅ **CORS configurado** para producción
- ✅ **Variables de entorno** seguras
- ✅ **JWT tokens** para autenticación

## 💰 Costos

- **Vercel**: Gratis (hasta 100GB/mes)
- **Railway**: Gratis (hasta $5/mes de crédito)

¡Tu aplicación estará disponible 24/7 para todos! 