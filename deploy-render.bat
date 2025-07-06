@echo off
echo ========================================
echo    Despliegue en Render (GRATUITO)
echo ========================================
echo.

echo [1/4] Verificando archivos...
if not exist "render.yaml" (
    echo ❌ Error: No se encontró render.yaml
    echo Ejecuta install.bat primero
    pause
    exit /b 1
)

echo [2/4] Verificando Git...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: No es un repositorio Git
    echo Ejecuta estos comandos:
    echo   git init
    echo   git add .
    echo   git commit -m "Primer commit"
    pause
    exit /b 1
)

echo [3/4] Verificando repositorio remoto...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Advertencia: No hay repositorio remoto configurado
    echo.
    echo Para continuar:
    echo 1. Crea un repositorio en GitHub
    echo 2. Ejecuta: git remote add origin TU_URL_DEL_REPO
    echo 3. Ejecuta: git push -u origin main
    echo.
    pause
    exit /b 1
)

echo [4/4] Subiendo cambios a GitHub...
git add .
git commit -m "Actualización para Render"
git push

echo.
echo ========================================
echo    ✅ Código subido a GitHub
echo ========================================
echo.
echo Ahora sigue estos pasos:
echo.
echo 1. Ve a https://render.com
echo 2. Crea cuenta con GitHub
echo 3. "New +" > "Web Service"
echo 4. Conecta tu repositorio
echo 5. Configura:
echo    - Name: sistema-tickets-clientes
echo    - Environment: Node
echo    - Build Command: npm install && cd client && npm install && npm run build
echo    - Start Command: node server.js
echo 6. Variables de entorno:
echo    - NODE_ENV=production
echo    - PORT=8002
echo 7. "Create Web Service"
echo.
echo Tu app estará en: https://tu-app.onrender.com
echo.
pause 