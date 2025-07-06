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

echo Instalando dependencias del servidor...
npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del servidor.
    pause
    exit /b 1
)

echo.
echo Instalando dependencias del cliente...
cd client
npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del cliente.
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Instalación completada exitosamente
echo ========================================
echo.
echo Para iniciar el sistema:
echo 1. Ejecuta: npm start
echo 2. En otra terminal: cd client && npm start
echo.
echo Usuarios disponibles:
echo - admin1 / admin123
echo - admin2 / admin123  
echo - admin3 / admin123
echo.
pause 