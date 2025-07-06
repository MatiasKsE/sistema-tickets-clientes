@echo off
echo ========================================
echo    Iniciando Sistema de Tickets
echo ========================================
echo.

echo Iniciando servidor backend...
start "Servidor Backend" cmd /k "npm start"

echo Esperando 5 segundos para que el servidor inicie...
timeout /t 5 /nobreak >nul

echo Iniciando cliente frontend...
start "Cliente Frontend" cmd /k "cd client && npm start"

echo.
echo ========================================
echo    Sistema iniciado correctamente
echo ========================================
echo.
echo El sistema estará disponible en:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo.
echo Usuarios disponibles:
echo - admin1 / admin123
echo - admin2 / admin123
echo - admin3 / admin123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul 