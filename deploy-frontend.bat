@echo off
echo ========================================
echo    🚀 DESPLIEGUE DEL FRONTEND EN VERCEL
echo ========================================
echo.

echo [1/4] Verificando archivos...
if not exist "client\package.json" (
    echo ❌ Error: No se encontró client/package.json
    pause
    exit /b 1
)

echo [2/4] Verificando configuración...
if not exist "vercel-frontend.json" (
    echo ❌ Error: No se encontró vercel-frontend.json
    pause
    exit /b 1
)

echo [3/4] Construyendo frontend...
cd client
npm run build
cd ..

echo [4/4] Instrucciones para Vercel...
echo.
echo ========================================
echo    ✅ FRONTEND LISTO PARA DESPLEGAR
echo ========================================
echo.
echo Pasos para desplegar en Vercel:
echo.
echo 1. Ve a https://vercel.com
echo 2. Registrarse con GitHub
echo 3. "New Project"
echo 4. Importa tu repositorio
echo 5. Configura:
echo    - Framework: Create React App
echo    - Root Directory: client
echo    - Build Command: npm run build
echo    - Output Directory: build
echo 6. Variables de entorno:
echo    - REACT_APP_API_URL=https://sistema-tickets-clientes.onrender.com
echo 7. "Deploy"
echo.
echo Tu frontend estará en: https://tu-app.vercel.app
echo.
echo ¡Todos los datos irán a la misma base de datos!
echo.
pause 