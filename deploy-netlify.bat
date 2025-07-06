@echo off
echo ========================================
echo    🚀 DESPLIEGUE EN NETLIFY (MÁS FÁCIL)
echo ========================================
echo.

echo [1/4] Verificando archivos...
if not exist "netlify.toml" (
    echo ❌ Error: No se encontró netlify.toml
    pause
    exit /b 1
)

echo [2/4] Verificando Git...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: No es un repositorio Git
    pause
    exit /b 1
)

echo [3/4] Subiendo cambios a GitHub...
git add .
git commit -m "Configuración para Netlify"
git push

echo [4/4] Instrucciones para Netlify...
echo.
echo ========================================
echo    ✅ CÓDIGO SUBIDO A GITHUB
echo ========================================
echo.
echo Pasos para desplegar en Netlify:
echo.
echo 1. Ve a https://netlify.com
echo 2. Registrarse con GitHub
echo 3. "New site from Git"
echo 4. Selecciona tu repositorio
echo 5. Configura:
echo    - Build command: cd client && npm install && npm run build
echo    - Publish directory: client/build
echo 6. Variables de entorno:
echo    - REACT_APP_API_URL=https://sistema-tickets-clientes.onrender.com
echo 7. "Deploy site"
echo.
echo Tu app estará en: https://tu-app.netlify.app
echo.
echo ¡Netlify es más confiable que Vercel!
echo.
pause 