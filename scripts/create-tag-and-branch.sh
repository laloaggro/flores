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

# Generar mensaje detallado de cambios
CHANGELOG_MESSAGE="Versión $VERSION

Cambios realizados:
- Actualización de imágenes en la sección de productos con imágenes únicas para cada producto
- Actualización de imágenes en la galería con imágenes únicas para cada flor
- Mejora visual del sitio web con contenido más diverso y atractivo
- Creación de script automatizado para gestión de versiones
- Implementación de sistema de tags y branches para mejor control de versiones

Archivos modificados:
- frontend/index.html (actualización de URLs de imágenes)
- frontend/assets/css/styles.css (posibles ajustes de estilo)
- scripts/create-tag-and-branch.sh (mejoras en el script de versionado)
- FRONTEND_STRUCTURE.md (actualización de documentación)"

# Crear tag con mensaje detallado
git tag -a "v$VERSION" -m "$CHANGELOG_MESSAGE"

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
    # Realizar commit de los cambios con mensaje detallado
    git commit -m "$CHANGELOG_MESSAGE"
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