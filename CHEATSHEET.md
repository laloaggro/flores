# Comandos útiles para el sitio web de la florería

Este archivo contiene una lista de comandos útiles para el desarrollo, prueba y despliegue del sitio web.

## Servidores

### Iniciar ambos servidores (frontend y backend)
```bash
node start-servers.js
```
Inicia ambos servidores en los puertos 3006 (frontend) y 5000 (backend).

### Iniciar solo el servidor backend
```bash
npm run start:backend
# o
node backend/server.js
```
Inicia el servidor backend en el puerto 5000.

### Iniciar solo el servidor frontend
```bash
npm run start:frontend
# o
node start-frontend.js
```
Inicia el servidor frontend en el puerto 3006.

### Iniciar el servidor de desarrollo de Vite
```bash
npm run dev:vite
# o
npx vite --port 5173 --host
```
Inicia el servidor de desarrollo de Vite en el puerto 5173 con recarga en caliente.

## Desarrollo

### Construir el proyecto para producción
```bash
npm run build
# o específicamente para Vite
npm run build:vite
```
Construye el proyecto para producción en el directorio [dist](file:///home/laloaggro/Proyectos/flores-1/frontend/dist).

### Previsualizar la construcción de producción
```bash
npm run preview
# o específicamente para Vite
npm run preview:vite
```
Inicia un servidor local para previsualizar la construcción de producción.

## Linting y calidad de código

### Verificar errores de estilo con ESLint
```bash
npm run lint
```
Ejecuta ESLint para verificar errores de estilo en los archivos JavaScript.

### Corregir automáticamente errores de estilo
```bash
npm run lint:fix
```
Ejecuta ESLint con la opción de corrección automática para problemas menores.

## Pruebas

### Ejecutar pruebas
```bash
npm test
# o
npm run test
```
Ejecuta las pruebas con Jest.

## Scripts personalizados

### Verificar páginas HTML
```bash
npm run verify:pages
```
Verifica la integridad de las páginas HTML.

### Corregir importaciones duplicadas
```bash
npm run fix:duplicates
```
Corrige importaciones duplicadas en los archivos JavaScript.

### Corregir todos los problemas
```bash
npm run fix:all
```
Ejecuta todos los scripts de corrección disponibles.

### Optimizar imágenes
```bash
npm run optimize:images
```
Optimiza las imágenes del proyecto.

### Corregir rutas de imágenes
```bash
npm run fix:images
```
Corrige las rutas de las imágenes en los archivos.

## Desarrollo concurrente

### Iniciar ambos servidores en modo desarrollo
```bash
npm run dev:both
```
Inicia ambos servidores (frontend y backend) simultáneamente en modo desarrollo.

## Otros comandos útiles

### Verificar puertos en uso
```bash
lsof -i :3006  # Verificar si el puerto 3006 está en uso
lsof -i :5000  # Verificar si el puerto 5000 está en uso
lsof -i :5173  # Verificar si el puerto 5173 está en uso
```

### Detener todos los procesos de Node
```bash
killall node
```

### Probar conectividad a un servidor
```bash
curl -I http://localhost:3006  # Probar el servidor frontend
curl -I http://localhost:5000  # Probar el servidor backend
curl -I http://localhost:5173  # Probar el servidor de Vite
```