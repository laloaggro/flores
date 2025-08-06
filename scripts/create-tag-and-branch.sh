#!/bin/bash
# Script para crear tags y actualizar branches con la versión actual

# Obtener la versión del package.json
VERSION=$(node -p "require('./backend/package.json').version")

# Verificar si se obtuvo una versión válida
if [ -z "$VERSION" ]; then
    echo "No se pudo obtener el número de versión del package.json"
    exit 1
fi

# Crear un tag con la versión actual
echo "Creando tag v$VERSION"
git tag -a "v$VERSION" -m "Versión $VERSION - Actualización de imágenes y mejoras visuales"

# Crear y cambiar al nuevo branch con el número de versión
BRANCH_NAME="version-$VERSION"
echo "Creando branch $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Añadir todos los cambios
git add .

# Comprobar si hay cambios para commit
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "No hay cambios para commit en este branch."
else
    # Realizar commit de los cambios
    git commit -m "Versión $VERSION - Actualización de imágenes y mejoras visuales"
    echo "Cambios commitados en el branch '$BRANCH_NAME'."
fi

# Volver al branch principal
git checkout main

# Merge del nuevo branch al main
git merge $BRANCH_NAME

# Eliminar el branch temporal
git branch -d $BRANCH_NAME

# Mostrar el estado actual de git
echo "Estado actual del repositorio:"
git status

echo "Tag v$VERSION creado y cambios aplicados al branch principal."