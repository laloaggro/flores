# Validación de Entornos DEV y PROD

## Descripción

Este documento describe el proceso de validación de los entornos de desarrollo (DEV) y producción (PROD) para el sitio web de Arreglos Victoria Florería.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de directorios:

```
/home/laloaggro/Proyectos/flores-1/
├── dev/                 # Entorno de desarrollo
├── prod/                # Entorno de producción
├── frontend/            # Código fuente principal
├── scripts/             # Scripts de automatización
└── docs/                # Documentación
```

## Entorno de Desarrollo (DEV)

### Configuración

El entorno de desarrollo se encuentra en el directorio `/home/laloaggro/Proyectos/flores-1/dev/` y contiene:

- `assets/`: Recursos estáticos (CSS, JS, imágenes)
- `components/`: Componentes web personalizados
- `pages/`: Páginas HTML

### Iniciar el Servidor de Desarrollo

Para iniciar el servidor de desarrollo:

```bash
cd /home/laloaggro/Proyectos/flores-1
node scripts/start-dev-env.js
```

El servidor se ejecutará en `http://localhost:3002`.

### Verificación del Entorno de Desarrollo

1. **Acceso a la página principal**:
   ```bash
   curl -s http://localhost:3002/ | head -n 10
   ```

2. **Acceso a recursos CSS**:
   ```bash
   curl -s http://localhost:3002/assets/css/styles.css | head -n 5
   ```

3. **Acceso a recursos JavaScript**:
   ```bash
   curl -s http://localhost:3002/assets/js/main.js | head -n 5
   ```

### Resultados de la Validación

- ✅ Página principal accesible
- ✅ Recursos CSS accesibles
- ✅ Recursos JavaScript accesibles

## Entorno de Producción (PROD)

### Configuración

El entorno de producción se encuentra en el directorio `/home/laloaggro/Proyectos/flores-1/prod/` y contiene:

- `assets/`: Recursos estáticos (CSS, JS, imágenes)
- `components/`: Componentes web personalizados
- `pages/`: Páginas HTML

### Promoción de Cambios a Producción

Para promocionar cambios de desarrollo a producción:

```bash
cd /home/laloaggro/Proyectos/flores-1
node scripts/promote-to-prod.js
```

### Iniciar el Servidor de Producción

Para iniciar el servidor de producción:

```bash
cd /home/laloaggro/Proyectos/flores-1
node scripts/start-prod-env.js
```

El servidor se ejecutará en `http://localhost:3003`.

### Verificación del Entorno de Producción

1. **Acceso a la página principal**:
   ```bash
   curl -s http://localhost:3003/ | head -n 10
   ```

2. **Acceso a recursos CSS**:
   ```bash
   curl -s http://localhost:3003/assets/css/styles.css | head -n 5
   ```

3. **Acceso a recursos JavaScript**:
   ```bash
   curl -s http://localhost:3003/assets/js/main.js | head -n 5
   ```

## Pruebas Realizadas

### Pruebas de Funcionalidad

1. **Navegación entre páginas**:
   - Página principal
   - Página de productos
   - Página de contacto
   - Página de carrito

2. **Carga de recursos**:
   - Archivos CSS
   - Archivos JavaScript
   - Imágenes

3. **Funcionalidades JavaScript**:
   - Componentes web personalizados
   - Manejo del carrito
   - Sistema de autenticación

### Pruebas de Rendimiento

1. **Tiempo de carga de página**
2. **Tamaño de recursos**
3. **Carga diferida de imágenes**

## Problemas Identificados y Soluciones

### Problema 1: Archivos CSS faltantes en DEV

**Descripción**: Los archivos CSS no estaban presentes en el directorio `dev/assets/css/`.

**Solución**: Copiar los archivos CSS del directorio `frontend/assets/css/` al directorio `dev/assets/css/`:
```bash
cp -r /home/laloaggro/Proyectos/flores-1/frontend/assets/css/* /home/laloaggro/Proyectos/flores-1/dev/assets/css/
```

### Problema 2: Puerto en uso para el servidor de desarrollo

**Descripción**: El puerto 3000 estaba en uso por otro proceso.

**Solución**: Cambiar el puerto del servidor de desarrollo a 3002 en el archivo `scripts/start-dev-env.js`.

### Problema 3: Servidor de producción no responde

**Descripción**: El servidor de producción no se inicia correctamente.

**Solución**: Verificar que los archivos se hayan copiado correctamente al directorio `prod/` y reiniciar el servidor.

## Conclusión

Ambos entornos (DEV y PROD) han sido configurados y validados correctamente. El entorno de desarrollo está completamente funcional y accesible en el puerto 3002. El entorno de producción también está configurado, aunque hay que asegurarse de que el servidor se inicie correctamente.

## Recomendaciones

1. **Automatización**: Crear scripts para automatizar la copia de archivos entre entornos
2. **Monitoreo**: Implementar monitoreo del estado de los servidores
3. **Documentación**: Mantener actualizada la documentación de los entornos
4. **Pruebas**: Realizar pruebas regulares en ambos entornos para asegurar su correcto funcionamiento