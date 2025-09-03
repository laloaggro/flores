#!/bin/bash

# Script para iniciar el servidor de desarrollo
# Este script inicia tanto el servidor backend como el frontend de desarrollo

echo "🚀 Iniciando servidor de desarrollo..."

# Verificar si el puerto 5000 está en uso
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 5000 está en uso. Deteniendo proceso..."
    lsof -ti:5000 | xargs kill -9
fi

# Verificar si el puerto 3000 está en uso
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3000 está en uso. Deteniendo proceso..."
    lsof -ti:3000 | xargs kill -9
fi

# Iniciar el servidor backend en segundo plano
echo "🔧 Iniciando servidor backend..."
cd backend
node server.js & 
BACKEND_PID=$!
cd ..

# Iniciar el servidor frontend de desarrollo
echo "🎨 Iniciando servidor frontend de desarrollo..."
npx vite

# Detener el servidor backend cuando se detenga el frontend
kill $BACKEND_PID
echo "🛑 Servidores detenidos."