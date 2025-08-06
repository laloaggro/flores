# Solución al problema del directorio de trabajo del terminal

## Problema
El terminal muestra el error: `Error del proceso del terminal al iniciarse: El directorio de inicio (cwd) "/laloaggro/flores" no existe.`

## Causa
El terminal está configurado para iniciar en un directorio que no existe físicamente en el sistema de archivos. El proyecto real se encuentra en `/home/laloaggro/Proyectos/flores`.

## Soluciones propuestas

### Solución 1: Ejecutar el script de corrección
```bash
chmod +x fix_terminal_cwd.sh
./fix_terminal_cwd.sh
```

### Solución 2: Configurar el terminal manualmente
Agrega la siguiente línea al final de tu archivo `~/.bashrc`:
```bash
cd /home/laloaggro/Proyectos/flores
```

### Solución 3: Crear enlace simbólico (requiere sudo)
```bash
sudo mkdir -p /laloaggro
sudo ln -s /home/laloaggro/Proyectos/flores /laloaggro/flores
```

### Solución 4: Cambiar la configuración del IDE
Si estás usando VS Code u otro IDE, asegúrate de que el directorio de trabajo esté configurado correctamente:
1. Abre las configuraciones del terminal
2. Cambia el directorio de inicio a `/home/laloaggro/Proyectos/flores`

## Verificación
Después de aplicar cualquiera de estas soluciones, abre un nuevo terminal y verifica que se inicie en el directorio correcto:
```bash
pwd
```

Deberías ver: `/home/laloaggro/Proyectos/flores`