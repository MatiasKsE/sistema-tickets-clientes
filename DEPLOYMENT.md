# 🚀 Guía de Despliegue - Sistema de Tickets y Clientes

## 📋 Pasos para Desplegar en Railway

### 1. Preparación del Proyecto

1. **Instalar Railway CLI** (opcional pero recomendado):
   ```bash
   npm install -g @railway/cli
   ```

2. **Crear cuenta en Railway**:
   - Ve a [railway.app](https://railway.app)
   - Regístrate con tu cuenta de GitHub

### 2. Desplegar en Railway

#### Opción A: Usando Railway Dashboard (Recomendado)

1. **Conectar repositorio**:
   - Ve a [railway.app](https://railway.app)
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio de GitHub

2. **Configurar variables de entorno**:
   - En el dashboard de Railway, ve a la pestaña "Variables"
   - Agrega las siguientes variables:
     ```
     NODE_ENV=production
     PORT=8002
     ```

3. **Desplegar**:
   - Railway detectará automáticamente que es una aplicación Node.js
   - El despliegue comenzará automáticamente

#### Opción B: Usando Railway CLI

1. **Iniciar sesión**:
   ```bash
   railway login
   ```

2. **Inicializar proyecto**:
   ```bash
   railway init
   ```

3. **Configurar variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=8002
   ```

4. **Desplegar**:
   ```bash
   railway up
   ```

### 3. Configurar Dominio Personalizado (Opcional)

1. **Obtener URL de Railway**:
   - En el dashboard de Railway, copia la URL generada
   - Ejemplo: `https://tu-app.railway.app`

2. **Configurar dominio personalizado**:
   - En Railway, ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado

### 4. Verificar el Despliegue

1. **Probar la API**:
   - Ve a `https://tu-app.railway.app/api/test`
   - Deberías ver: `{"message":"API funcionando correctamente"}`

2. **Probar la aplicación**:
   - Ve a `https://tu-app.railway.app`
   - Deberías ver la interfaz de login

### 5. Credenciales de Acceso

**Usuarios disponibles**:
- Usuario: `test` / Contraseña: `123456`
- Usuario: `admin1` / Contraseña: `123456`
- Usuario: `admin2` / Contraseña: `123456`
- Usuario: `admin3` / Contraseña: `123456`

### 6. Compartir con Amigos

Una vez desplegado, comparte la URL con tus amigos:
```
https://tu-app.railway.app
```

### 7. Monitoreo y Logs

- **Ver logs en tiempo real**:
  ```bash
  railway logs
  ```

- **Ver estado del servicio**:
  - En el dashboard de Railway, ve a la pestaña "Deployments"

### 8. Actualizaciones

Para actualizar la aplicación:
1. Haz push a tu repositorio de GitHub
2. Railway detectará los cambios y desplegará automáticamente

### 9. Solución de Problemas

#### Error: "Build failed"
- Verifica que todos los archivos estén en el repositorio
- Revisa los logs de build en Railway

#### Error: "Application error"
- Revisa los logs de la aplicación
- Verifica que las variables de entorno estén configuradas

#### Error: "CORS error"
- Verifica que la URL en `config.js` sea correcta
- Asegúrate de que el servidor esté configurado para producción

### 10. Costos

- **Railway Free Tier**: 500 horas/mes gratis
- **Para uso personal**: Generalmente suficiente
- **Para más uso**: $5/mes por 1000 horas

### 11. Alternativas de Despliegue

Si Railway no funciona, puedes usar:
- **Vercel**: Para frontend
- **Render**: Para backend
- **Heroku**: Para aplicación completa
- **DigitalOcean**: Para control total

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet y tus amigos podrán acceder desde cualquier lugar usando la URL de Railway. 