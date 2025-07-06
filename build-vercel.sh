#!/bin/bash

echo "Instalando dependencias del cliente..."
cd client
npm install

echo "Construyendo aplicación React..."
npx react-scripts build

echo "Build completado exitosamente!" 