#!/bin/bash
# Script para crear un nuevo branch con el número de versión actual

# Obtener el número de versión actual desde package.json
VERSION=$(node -p "require('../backend/package.json').version")

# Verificar si se obtuvo una versión válida
if [ -z "$VERSION" ]; then
    echo "No se pudo obtener el número de versión del package.json"
    exit 1
fi

# Nombre del nuevo branch
BRANCH_NAME="version-$VERSION"

# Crear y cambiar al nuevo branch
git checkout -b $BRANCH_NAME

# Añadir todos los cambios
git add .

# Comprobar si hay cambios para commit
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "No hay cambios para commit en este branch."
else
    # Realizar commit de los cambios
    git commit -m "Backup: Versión $VERSION"
    echo "Branch '$BRANCH_NAME' creado y cambios commitados."
fi

# Mostrar el estado actual de git
git status