@echo off
echo ========================================
echo    Instalando Sistema de Tickets
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado. Continuando...
echo.

echo [1/4] Instalando dependencias del servidor...
npm install

echo.
echo [2/4] Instalando dependencias del cliente...
cd client
npm install
cd ..

echo.
echo [3/4] Construyendo aplicación para producción...
cd client
npm run build
cd ..

echo.
echo [4/4] Verificando archivos...
if exist "client\build" (
    echo ✅ Cliente construido correctamente
) else (
    echo ❌ Error: No se pudo construir el cliente
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ Instalación Completada
echo ========================================
echo.
echo Para iniciar en desarrollo:
echo   npm run dev
echo.
echo Para desplegar en Railway:
echo   1. Sube tu código a GitHub
echo   2. Ve a railway.app
echo   3. Conecta tu repositorio
echo   4. Configura las variables de entorno
echo.
echo Ver DEPLOYMENT.md para instrucciones detalladas
echo.
pause 