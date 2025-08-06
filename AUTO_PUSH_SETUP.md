# Configuración de Auto-Push Automático

## Descripción

Este documento explica cómo se ha configurado el sistema para que los cambios se suban automáticamente al repositorio remoto cada vez que se realiza un commit.

## Configuración Implementada

Se ha creado un hook de Git `post-commit` que se ejecuta automáticamente después de cada commit. Este hook realiza las siguientes acciones:

1. Obtiene el nombre de la rama actual
2. Ejecuta `git push origin <nombre-de-la-rama>` para subir los cambios
3. Muestra un mensaje indicando si el push fue exitoso o si ocurrió un error

## Archivo de Hook

El hook se encuentra en `.git/hooks/post-commit` y tiene el siguiente contenido:

```bash
#!/bin/bash

# Hook post-commit para subir automáticamente los cambios al repositorio remoto

echo "Ejecutando hook post-commit: git push origin $(git branch --show-current)"

# Obtener la rama actual
current_branch=$(git branch --show-current)

# Subir los cambios al repositorio remoto
git push origin "$current_branch"

# Verificar si hubo errores en el push
if [ $? -eq 0 ]; then
    echo "Push completado exitosamente a origin/$current_branch"
else
    echo "Error al hacer push. Por favor, verifica tu conexión y configuración de Git."
fi
```

## Cómo funciona

1. Cada vez que realizas un commit con `git commit`, el hook post-commit se ejecuta automáticamente
2. El hook identifica la rama actual en la que estás trabajando
3. Ejecuta `git push origin <nombre-de-la-rama>` para subir los cambios a esa rama en el repositorio remoto
4. Muestra un mensaje de éxito o error en la terminal

## Beneficios

1. **Ahorro de tiempo**: No necesitas ejecutar manualmente `git push` después de cada commit
2. **Sincronización continua**: Los cambios se mantienen sincronizados con el repositorio remoto
3. **Menos pasos**: Reduce el proceso de trabajo a solo `git add` y `git commit`

## Consideraciones importantes

1. **Conectividad**: Necesitas tener conexión a Internet para que el push automático funcione
2. **Permisos**: Tu cuenta debe tener permisos de escritura en el repositorio remoto
3. **Conflictos**: Si hay conflictos en el repositorio remoto, el push puede fallar y tendrás que resolverlos manualmente
4. **Autenticación**: Asegúrate de que tu configuración de Git tenga la autenticación adecuada (SSH keys o credenciales HTTPS)

## Solución de problemas

### Si el push falla:
1. Verifica tu conexión a Internet
2. Confirma que tienes permisos de escritura en el repositorio
3. Verifica tu configuración de autenticación de Git
4. Intenta hacer push manualmente con `git push origin <nombre-de-la-rama>`

### Si el hook no se ejecuta:
1. Verifica que el archivo `.git/hooks/post-commit` exista
2. Confirma que tenga permisos de ejecución con `ls -l .git/hooks/post-commit`
3. Asegúrate de que el contenido del archivo sea correcto

## Desactivar el auto-push

Si en algún momento deseas desactivar esta funcionalidad, puedes:

1. Eliminar el archivo del hook:
   ```bash
   rm .git/hooks/post-commit
   ```

2. O renombrarlo:
   ```bash
   mv .git/hooks/post-commit .git/hooks/post-commit.disabled
   ```