# 🚀 Despliegue Gratuito en Render

## 📋 Pasos para Desplegar en Render (100% Gratuito)

### 1. Crear Cuenta en Render

1. **Ir a Render**: https://render.com
2. **Registrarse** con tu cuenta de GitHub
3. **Confirmar email** (importante)

### 2. Desplegar la Aplicación

1. **Crear nuevo servicio**:
   - En Render, haz clic en "New +"
   - Selecciona "Web Service"

2. **Conectar repositorio**:
   - Selecciona "Connect a repository"
   - Conecta tu repositorio de GitHub
   - Selecciona tu repositorio `sistema-tickets-clientes`

3. **Configurar el servicio**:
   - **Name**: `sistema-tickets-clientes`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `node server.js`

4. **Variables de entorno**:
   - Haz clic en "Environment"
   - Agrega estas variables:
     ```
     NODE_ENV=production
     PORT=8002
     ```

5. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Render comenzará el despliegue automáticamente

### 3. Obtener la URL

- Render te dará una URL como: `https://tu-app.onrender.com`
- Esta URL estará disponible en 2-5 minutos

### 4. Verificar el Despliegue

1. **Probar la API**:
   - Ve a `https://tu-app.onrender.com/api/test`
   - Deberías ver: `{"message":"API funcionando correctamente"}`

2. **Probar la aplicación**:
   - Ve a `https://tu-app.onrender.com`
   - Deberías ver la interfaz de login

### 5. Credenciales de Acceso

**Usuarios disponibles**:
- Usuario: `test` / Contraseña: `123456`
- Usuario: `admin1` / Contraseña: `123456`
- Usuario: `admin2` / Contraseña: `123456`
- Usuario: `admin3` / Contraseña: `123456`

### 6. Compartir con Amigos

Una vez desplegado, comparte la URL:
```
https://tu-app.onrender.com
```

## 🆓 Ventajas de Render

- ✅ **Completamente gratuito**
- ✅ **Sin límite de tiempo**
- ✅ **HTTPS automático**
- ✅ **Dominio personalizado gratuito**
- ✅ **Despliegue automático**

## 🔧 Configuración Avanzada

### Dominio Personalizado (Opcional)

1. En Render, ve a tu servicio
2. Ve a "Settings" > "Custom Domains"
3. Agrega tu dominio personalizado

### Variables de Entorno Adicionales

Si necesitas más configuración, agrega en "Environment":
```
NODE_ENV=production
PORT=8002
JWT_SECRET=tu-secreto-super-seguro
```

## 📊 Monitoreo

- **Logs**: En Render, ve a "Logs" para ver logs en tiempo real
- **Métricas**: Ve a "Metrics" para ver uso de recursos
- **Estado**: El servicio se reinicia automáticamente si falla

## 🔄 Actualizaciones

Para actualizar la aplicación:
1. Haz push a tu repositorio de GitHub
2. Render detectará los cambios automáticamente
3. Desplegará la nueva versión

## 🆘 Solución de Problemas

### Error: "Build failed"
- Verifica que todos los archivos estén en GitHub
- Revisa los logs de build en Render

### Error: "Application error"
- Revisa los logs de la aplicación
- Verifica que las variables de entorno estén configuradas

### Error: "Service unavailable"
- Render puede tardar 30 segundos en responder
- Es normal en el plan gratuito

## 💰 Costos

- **Render Free Tier**: Completamente gratuito
- **Sin límite de tiempo**
- **750 horas/mes gratis**
- **Perfecto para uso personal**

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet de forma completamente gratuita usando Render. 