# Guía de Mantenimiento del Proyecto Arreglos Victoria Florería

Este documento proporciona una guía completa para mantener y solucionar problemas comunes en el proyecto.

## Problemas Comunes y Soluciones

### 1. Errores de Importación

#### Síntomas:
- Errores de "Failed to resolve import" en Vite
- Componentes que no se renderizan
- Errores de "The symbol has already been declared"

#### Soluciones:
1. **Verificar rutas de componentes**:
   ```bash
   npm run verify:pages
   ```

2. **Corregir importaciones duplicadas**:
   ```bash
   npm run fix:duplicates
   ```

3. **Verificar estructura de directorios**:
   - Los componentes deben estar en `dev/components/[categoria]/[NombreComponente].js`
   - Las rutas de importación en `main.js` deben coincidir con esta estructura

### 2. Problemas de CSS

#### Síntomas:
- Estilos que no se aplican
- Errores de "Unclosed block" en CSS
- Diseño roto

#### Soluciones:
1. **Verificar sintaxis CSS**:
   - Asegurarse de que todos los bloques estén correctamente cerrados con `}`
   - Verificar que no haya propiedades incompletas

2. **Usar el CSS combinado**:
   - El proyecto está configurado para usar `combined.css`
   - Evitar cargar múltiples archivos CSS individuales

### 3. Problemas con Imágenes

#### Síntomas:
- Imágenes que no se muestran
- Mensajes de "Imagen no disponible"
- Errores 404 en imágenes

#### Soluciones:
1. **Corregir imágenes automáticamente**:
   ```bash
   npm run fix:images
   ```

2. **Verificar formato de imágenes**:
   - Asegurarse de que los archivos tengan el contenido correcto
   - Validar que las extensiones coincidan con el contenido

### 4. Problemas de Servidor

#### Síntomas:
- "Address already in use" al iniciar servidores
- Backend no responde
- Errores de conexión

#### Soluciones:
1. **Verificar puertos en uso**:
   ```bash
   netstat -tulpn | grep -E '(:3006|:5000)'
   ```

2. **Matar procesos conflictivos**:
   ```bash
   kill -9 $(lsof -t -i:3006)
   kill -9 $(lsof -t -i:5000)
   ```

3. **Reiniciar servidores**:
   ```bash
   npm run start:backend
   npm run dev:vite
   ```

## Scripts de Mantenimiento

### Corrección Automática de Problemas
```bash
npm run fix:all
```
Este script ejecuta todas las correcciones automáticas disponibles:
- Corrección de imágenes
- Eliminación de importaciones duplicadas
- Verificación de páginas

### Verificación de Páginas
```bash
npm run verify:pages
```
Verifica que todas las páginas HTML esperadas existan en el proyecto.

### Corrección de Importaciones Duplicadas
```bash
npm run fix:duplicates
```
Elimina importaciones duplicadas en archivos HTML.

### Corrección de Imágenes
```bash
npm run fix:images
```
Reemplaza imágenes falsas con versiones válidas.

## Flujo de Trabajo Recomendado

### 1. Inicio Diario
```bash
# Corregir problemas comunes
npm run fix:all

# Iniciar backend
npm run start:backend

# En otra terminal, iniciar frontend
npm run dev:vite
```

### 2. Antes de Commits
```bash
# Verificar que todo funcione correctamente
npm run verify:pages
```

### 3. Para Producción
```bash
# Construir para producción
npm run build:vite
```

## Estructura del Proyecto

```
flores-1/
├── dev/                    # Código fuente del frontend
│   ├── assets/             # Recursos estáticos
│   │   ├── css/            # Hojas de estilo
│   │   ├── images/         # Imágenes
│   │   └── js/             # JavaScript
│   ├── components/         # Componentes web
│   │   ├── cart/
│   │   ├── header/
│   │   └── product/
│   ├── pages/              # Páginas HTML
│   └── index.html          # Página principal
├── backend/                # Código del backend
├── dist/                   # Archivos compilados para producción
├── scripts/                # Scripts de utilidad
└── docs/                   # Documentación
```

## Buenas Prácticas

### 1. Gestión de Componentes
- Mantener una estructura de directorios clara y consistente
- Usar nombres descriptivos para los componentes
- Evitar importaciones circulares

### 2. Gestión de CSS
- Usar el archivo `combined.css` en lugar de múltiples archivos
- Verificar la sintaxis antes de hacer cambios
- Mantener una organización lógica de estilos

### 3. Gestión de Imágenes
- Asegurarse de que las imágenes sean archivos válidos
- Usar formatos adecuados (JPG, PNG, SVG)
- Optimizar el tamaño de las imágenes

### 4. Gestión de Páginas
- Mantener todas las páginas en `dev/pages/`
- Usar nombres de archivo consistentes
- Verificar que todas las páginas estén correctamente enlazadas

## Solución de Problemas Avanzada

### 1. Depuración de Vite
Si Vite muestra errores persistentes:
1. Limpiar la caché de Vite:
   ```bash
   rm -rf node_modules/.vite
   ```

2. Reiniciar el servidor de desarrollo:
   ```bash
   npm run dev:vite
   ```

### 2. Problemas de Dependencias
Si hay errores de dependencias:
1. Reinstalar dependencias:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 3. Problemas de Construcción
Si la construcción falla:
1. Verificar errores específicos en la consola
2. Asegurarse de que todas las páginas existan
3. Verificar rutas de importación
4. Validar sintaxis de CSS y JavaScript

## Verificaciones Regulares

### 1. Semanal
- Ejecutar `npm run fix:all` para mantener el proyecto limpio
- Verificar que todas las páginas carguen correctamente
- Confirmar que el backend responda a las llamadas API

### 2. Mensual
- Revisar la estructura del proyecto
- Actualizar dependencias si es necesario
- Verificar la documentación y mantenerla actualizada

## Contacto y Soporte

Para problemas que no se resuelven con esta guía:
1. Verificar los logs de los servidores
2. Consultar la documentación en `docs/`
3. Revisar issues anteriores en el repositorio
4. Contactar al equipo de desarrollo