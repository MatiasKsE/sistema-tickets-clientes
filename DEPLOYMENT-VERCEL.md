# 🚀 Despliegue Gratuito en Vercel

## 📋 Pasos para Desplegar en Vercel (100% Gratuito)

### 1. Crear Cuenta en Vercel

1. **Ir a Vercel**: https://vercel.com
2. **Registrarse** con tu cuenta de GitHub
3. **Confirmar email** (importante)

### 2. Desplegar la Aplicación

1. **Importar proyecto**:
   - En Vercel, haz clic en "New Project"
   - Selecciona "Import Git Repository"
   - Conecta tu repositorio de GitHub
   - Selecciona tu repositorio `sistema-tickets-clientes`

2. **Configurar el proyecto**:
   - **Framework Preset**: `Node.js`
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

3. **Variables de entorno**:
   - Haz clic en "Environment Variables"
   - Agrega estas variables:
     ```
     NODE_ENV=production
     PORT=8002
     ```

4. **Desplegar**:
   - Haz clic en "Deploy"
   - Vercel comenzará el despliegue automáticamente

### 3. Obtener la URL

- Vercel te dará una URL como: `https://tu-app.vercel.app`
- Esta URL estará disponible en 1-2 minutos

### 4. Verificar el Despliegue

1. **Probar la API**:
   - Ve a `https://tu-app.vercel.app/api/test`
   - Deberías ver: `{"message":"API funcionando correctamente"}`

2. **Probar la aplicación**:
   - Ve a `https://tu-app.vercel.app`
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
https://tu-app.vercel.app
```

## 🆓 Ventajas de Vercel

- ✅ **Completamente gratuito**
- ✅ **Sin límite de tiempo**
- ✅ **HTTPS automático**
- ✅ **Dominio personalizado gratuito**
- ✅ **Despliegue automático**
- ✅ **CDN global**

## 🔧 Configuración Avanzada

### Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Ve a "Settings" > "Domains"
3. Agrega tu dominio personalizado

### Variables de Entorno Adicionales

Si necesitas más configuración, agrega en "Environment Variables":
```
NODE_ENV=production
PORT=8002
JWT_SECRET=tu-secreto-super-seguro
```

## 📊 Monitoreo

- **Logs**: En Vercel, ve a "Functions" para ver logs
- **Métricas**: Ve a "Analytics" para ver uso
- **Estado**: El servicio se reinicia automáticamente si falla

## 🔄 Actualizaciones

Para actualizar la aplicación:
1. Haz push a tu repositorio de GitHub
2. Vercel detectará los cambios automáticamente
3. Desplegará la nueva versión

## 🆘 Solución de Problemas

### Error: "Build failed"
- Verifica que todos los archivos estén en GitHub
- Revisa los logs de build en Vercel

### Error: "Function timeout"
- Vercel tiene límite de 10 segundos para funciones
- Es normal para aplicaciones pequeñas

### Error: "404 Not Found"
- Verifica que las rutas estén configuradas en `vercel.json`

## 💰 Costos

- **Vercel Free Tier**: Completamente gratuito
- **Sin límite de tiempo**
- **100GB/mes de ancho de banda**
- **Perfecto para uso personal**

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet de forma completamente gratuita usando Vercel. 