# Guía de Uso de Vite para Arreglos Victoria Florería

Esta guía explica cómo probar y usar Vite con el proyecto, incluyendo configuraciones, comandos y mejores prácticas.

## Prerrequisitos

Antes de comenzar, asegúrate de tener:
1. Node.js instalado (versión 14 o superior)
2. El proyecto clonado y las dependencias instaladas

## Iniciar el Entorno de Desarrollo

### 1. Iniciar el Backend

Primero, inicia el servidor backend en una terminal:

```bash
npm run start:backend
```

Esto iniciará el servidor Express en el puerto 5000.

### 2. Iniciar Vite (Frontend)

En otra terminal, inicia el servidor de desarrollo de Vite:

```bash
npm run dev:vite
```

Esto iniciará el servidor de desarrollo en el puerto 3006 y abrirá automáticamente el navegador.

## Comandos Disponibles

### Desarrollo

- `npm run dev:vite` - Inicia el servidor de desarrollo de Vite
- `npm run verify:pages` - Verifica que todas las páginas HTML existen

### Construcción

- `npm run build:vite` - Construye el proyecto para producción
- `npm run preview:vite` - Previsualiza la versión de producción

## Características Clave de la Configuración

### 1. Detección Automática de Páginas

La configuración de Vite detecta automáticamente todas las páginas HTML en:
- El directorio raíz `dev/` (index.html principal)
- El subdirectorio `dev/pages/` (todas las demás páginas)

Esto significa que no necesitas actualizar manualmente la configuración cada vez que agregues una nueva página.

### 2. Proxy para API

Todas las llamadas a rutas que comienzan con `/api` se redirigen automáticamente al backend en `http://localhost:5000`, evitando problemas de CORS.

### 3. Alias de Importación

Se han configurado los siguientes alias para facilitar las importaciones:

- `@` - Apunta a `/dev`
- `@assets` - Apunta a `/dev/assets`
- `@components` - Apunta a `/dev/components`
- `@pages` - Apunta a `/dev/pages`
- `@utils` - Apunta a `/dev/assets/js/components/utils`

Ejemplo de uso:
```javascript
import { initializeTheme } from '@utils/theme.js';
import Header from '@components/header/Header.js';
```

### 4. Organización de Recursos de Salida

En la construcción para producción, los recursos se organizan de la siguiente manera:
- JavaScript: `assets/js/[nombre].[hash].js`
- CSS: `assets/css/[nombre].[hash].css`
- Imágenes: `assets/images/[nombre].[hash].[ext]`

## Pruebas Recomendadas

### 1. Verificar que todas las páginas se cargan

Abre las siguientes URLs en tu navegador:
- http://localhost:3006/ - Página principal
- http://localhost:3006/products.html - Página de productos
- http://localhost:3006/contact.html - Página de contacto
- http://localhost:3006/about.html - Página "Acerca de"
- http://localhost:3006/cart.html - Carrito de compras

### 2. Verificar la carga de estilos

Asegúrate de que todas las páginas tienen los estilos aplicados correctamente.

### 3. Verificar componentes web

Confirma que los componentes web como el header y footer se renderizan correctamente.

### 4. Verificar llamadas a la API

Prueba que las llamadas a la API del backend funcionan correctamente:
```bash
curl http://localhost:3006/api/products
```

## Solución de Problemas Comunes

### 1. "No se puede acceder al sitio"

- Verifica que el backend esté en ejecución
- Asegúrate de que el puerto 3006 no esté ocupado
- Reinicia el servidor de Vite

### 2. Estilos no se aplican

- Verifica que los archivos CSS estén en la ubicación correcta
- Confirma que los enlaces a CSS en HTML sean correctos
- Revisa la consola del navegador en busca de errores de carga

### 3. Componentes web no se renderizan

- Verifica las rutas de importación en `main.js`
- Confirma que los archivos de componentes existan
- Revisa la consola del navegador en busca de errores de JavaScript

### 4. Problemas con llamadas a la API

- Verifica que el backend esté en ejecución en el puerto 5000
- Confirma que la configuración del proxy en `vite.config.js` sea correcta
- Revisa la consola del navegador en busca de errores de red

## Mejores Prácticas

### 1. Desarrollo

- Usa los alias de importación para mantener rutas consistentes
- Aprovecha el Hot Module Replacement (HMR) para una experiencia de desarrollo más rápida
- Verifica regularmente la consola del navegador en busca de errores o advertencias

### 2. Construcción

- Ejecuta `npm run build:vite` antes de hacer deploy a producción
- Usa `npm run preview:vite` para previsualizar la versión de producción localmente
- Verifica que todos los recursos se carguen correctamente en la versión de previsualización

### 3. Organización del Código

- Mantén las páginas HTML en el directorio `dev/pages/`
- Organiza los componentes en `dev/components/` por funcionalidad
- Usa nombres descriptivos para los archivos

## Flujo de Trabajo Recomendado

1. **Inicio del día**:
   ```bash
   # En una terminal
   npm run start:backend
   
   # En otra terminal
   npm run dev:vite
   ```

2. **Desarrollo**:
   - Realiza cambios en los archivos
   - Observa los cambios en tiempo real en el navegador
   - Verifica la consola del navegador en busca de errores

3. **Pruebas finales**:
   ```bash
   npm run build:vite
   npm run preview:vite
   ```

4. **Verificación de páginas**:
   ```bash
   npm run verify:pages
   ```

## Personalización Adicional

### Agregar nuevas páginas

Simplemente crea un nuevo archivo HTML en el directorio `dev/pages/`. Vite lo detectará automáticamente en la próxima ejecución.

### Modificar alias

Edita la sección `resolve.alias` en `vite.config.js` para agregar o modificar alias.

### Cambiar configuración de salida

Modifica la sección `build.rollupOptions.output` en `vite.config.js` para cambiar cómo se organizan los archivos de salida.