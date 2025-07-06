@echo off
echo ========================================
echo    🆓 OPCIONES GRATUITAS DE DESPLIEGUE
echo ========================================
echo.

echo ¿Cuál plataforma prefieres usar?
echo.
echo [1] Render (Recomendado - Más fácil)
echo [2] Vercel (Muy rápido)
echo [3] Netlify (Muy estable)
echo.
set /p choice="Elige una opción (1-3): "

if "%choice%"=="1" goto render
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto netlify
goto invalid

:render
echo.
echo ========================================
echo    🚀 DESPLIEGUE EN RENDER
echo ========================================
echo.
echo Pasos:
echo 1. Ve a https://render.com
echo 2. Registrarse con GitHub
echo 3. "New +" > "Web Service"
echo 4. Conecta tu repositorio
echo 5. Configura:
echo    - Name: sistema-tickets-clientes
echo    - Environment: Node
echo    - Build Command: npm install && cd client && npm install && npm run build
echo    - Start Command: node server.js
echo 6. Variables: NODE_ENV=production, PORT=8002
echo 7. "Create Web Service"
echo.
echo Tu URL será: https://tu-app.onrender.com
echo.
pause
goto end

:vercel
echo.
echo ========================================
echo    🚀 DESPLIEGUE EN VERCEL
echo ========================================
echo.
echo Pasos:
echo 1. Ve a https://vercel.com
echo 2. Registrarse con GitHub
echo 3. "New Project"
echo 4. Importa tu repositorio
echo 5. Configura:
echo    - Framework: Node.js
echo    - Build Command: npm install && cd client && npm install && npm run build
echo    - Output Directory: client/build
echo 6. Variables: NODE_ENV=production, PORT=8002
echo 7. "Deploy"
echo.
echo Tu URL será: https://tu-app.vercel.app
echo.
pause
goto end

:netlify
echo.
echo ========================================
echo    🚀 DESPLIEGUE EN NETLIFY
echo ========================================
echo.
echo Pasos:
echo 1. Ve a https://netlify.com
echo 2. Registrarse con GitHub
echo 3. "New site from Git"
echo 4. Conecta tu repositorio
echo 5. Configura:
echo    - Build command: npm install && cd client && npm install && npm run build
echo    - Publish directory: client/build
echo 6. Variables: NODE_ENV=production, PORT=8002
echo 7. "Deploy site"
echo.
echo Tu URL será: https://tu-app.netlify.app
echo.
pause
goto end

:invalid
echo.
echo ❌ Opción inválida. Elige 1, 2 o 3.
echo.
pause
goto end

:end
echo.
echo ========================================
echo    ✅ INSTRUCCIONES COMPLETAS
echo ========================================
echo.
echo También puedes ver las guías detalladas:
echo - DEPLOYMENT-RENDER.md
echo - DEPLOYMENT-VERCEL.md
echo - DEPLOYMENT-NETLIFY.md
echo.
echo ¡Todas son 100%% gratuitas!
echo. 