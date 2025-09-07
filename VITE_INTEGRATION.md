# Integración de Vite con Arreglos Victoria Florería

Este documento explica cómo usar Vite para el desarrollo y construcción del frontend del proyecto.

## ¿Qué es Vite?

Vite es una herramienta de construcción moderna que proporciona un entorno de desarrollo más rápido y una compilación más eficiente para proyectos web. Ofrece:

- Servidor de desarrollo rápido con Hot Module Replacement (HMR)
- Compilación optimizada para producción
- Soporte para módulos ES modernos
- Configuración flexible

## Configuración del Proyecto

La configuración de Vite se encuentra en el archivo [vite.config.js](file:///home/laloaggro/Proyectos/flores-1/vite.config.js) en la raíz del proyecto. Esta configuración:

1. Establece el directorio `dev` como raíz del proyecto
2. Configura el servidor de desarrollo en el puerto 3006
3. Configura un proxy para las llamadas a la API del backend
4. Define las páginas de entrada para la construcción
5. Configura la salida de archivos optimizados en el directorio `dist`

## Scripts Disponibles

Se han añadido los siguientes scripts npm para trabajar con Vite:

### Desarrollo

```bash
npm run dev:vite
```

Inicia el servidor de desarrollo de Vite en el puerto 3006 con Hot Module Replacement (HMR) habilitado. El navegador se abrirá automáticamente.

### Construcción

```bash
npm run build:vite
```

Construye el proyecto para producción y genera archivos optimizados en el directorio `dist`.

### Vista Previa

```bash
npm run preview:vite
```

Inicia un servidor local para previsualizar la versión de producción en el puerto 3006.

## Estructura de Directorios con Vite

```
flores-1/
├── dev/                 # Código fuente del frontend (raíz de Vite)
│   ├── assets/          # Recursos estáticos (CSS, imágenes, JS)
│   ├── components/      # Componentes web
│   ├── pages/           # Páginas HTML
│   └── index.html       # Página principal
├── dist/                # Archivos compilados para producción
├── vite.config.js       # Configuración de Vite
└── package.json         # Scripts y dependencias
```

## Características Clave

### 1. Hot Module Replacement (HMR)

Durante el desarrollo, Vite actualiza automáticamente el navegador cuando se realizan cambios en el código, sin necesidad de recargar la página completa.

### 2. Proxy para API

La configuración incluye un proxy que redirige automáticamente las llamadas a `/api/*` al backend en `http://localhost:5000`, evitando problemas de CORS durante el desarrollo.

### 3. Optimización Automática

Vite optimiza automáticamente:
- Minificación de CSS y JavaScript
- Compresión de imágenes
- Agrupación de módulos
- Generación de hashes para cache busting

### 4. Alias de Importación

Se han configurado alias para facilitar las importaciones:
- `@` apunta a `/dev`
- `@assets` apunta a `/dev/assets`
- `@components` apunta a `/dev/components`
- `@pages` apunta a `/dev/pages`

Ejemplo de uso:
```javascript
import { initializeTheme } from '@assets/js/components/utils/theme.js';
import Header from '@components/header/Header.js';
```

## Flujo de Trabajo Recomendado

### Desarrollo

1. Iniciar el backend:
   ```bash
   npm run start:backend
   ```

2. En otra terminal, iniciar Vite:
   ```bash
   npm run dev:vite
   ```

3. Abrir el navegador en http://localhost:3006

### Producción

1. Construir el proyecto:
   ```bash
   npm run build:vite
   ```

2. Previsualizar la construcción:
   ```bash
   npm run preview:vite
   ```

## Ventajas de Usar Vite

1. **Desarrollo más rápido**: El servidor de desarrollo arranca en segundos
2. **Actualizaciones instantáneas**: HMR proporciona retroalimentación inmediata
3. **Compilación optimizada**: Construcciones más pequeñas y eficientes
4. **Soporte moderno**: Usa las últimas características de JavaScript y CSS
5. **Configuración flexible**: Fácil de personalizar para las necesidades del proyecto

## Solución de Problemas

### Problemas de CORS

Si encuentras problemas de CORS durante el desarrollo, verifica que:
1. El backend esté en ejecución
2. El proxy esté configurado correctamente en [vite.config.js](file:///home/laloaggro/Proyectos/flores-1/vite.config.js)
3. Las llamadas a la API usen rutas relativas (ej: `/api/products`)

### Problemas de Rutas

Si las rutas no funcionan correctamente:
1. Verifica que los archivos HTML estén correctamente definidos en `rollupOptions.input`
2. Asegúrate de que las rutas en el código sean relativas al servidor

### Problemas de Recursos

Si los recursos (CSS, imágenes) no se cargan:
1. Verifica la configuración de `assetFileNames` en [vite.config.js](file:///home/laloaggro/Proyectos/flores-1/vite.config.js)
2. Asegúrate de que las rutas en el HTML sean correctas

## Siguientes Pasos

1. **Prueba el entorno de desarrollo**:
   ```bash
   npm run dev:vite
   ```

2. **Construye para producción**:
   ```bash
   npm run build:vite
   ```

3. **Personaliza la configuración** según las necesidades específicas del proyecto

4. **Explora plugins adicionales** de Vite si necesitas funcionalidades específicas