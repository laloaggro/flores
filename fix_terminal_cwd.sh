#!/bin/bash
# Script para corregir el directorio de trabajo del terminal

# Crear el directorio si no existe
if [ ! -d "/laloaggro/flores" ]; then
    echo "Creando directorio /laloaggro/flores"
    sudo mkdir -p /laloaggro/flores
fi

# Crear enlace simbólico al directorio del proyecto
if [ ! -L "/laloaggro/flores" ]; then
    echo "Creando enlace simbólico"
    sudo rm -rf /laloaggro/flores 2>/dev/null
    sudo ln -s /home/laloaggro/Proyectos/flores /laloaggro/flores
    echo "Enlace simbólico creado: /laloaggro/flores -> /home/laloaggro/Proyectos/flores"
fi

# Cambiar al directorio correcto
cd /home/laloaggro/Proyectos/flores
echo "Directorio de trabajo cambiado a: $(pwd)"

echo "Solución aplicada. El terminal ahora debería iniciar correctamente."