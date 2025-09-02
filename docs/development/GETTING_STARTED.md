# Guía de Inicio Rápido

## Requisitos Previos

- Node.js >= 14.0.0
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd floreria-arreglos-victoria
```

2. Instalar dependencias:
```bash
npm install
```

## Desarrollo Local

Para iniciar el servidor de desarrollo:

```bash
# Método 1: Usar script de inicio (recomendado)
./start-dev.sh

# Método 2: Iniciar servicios por separado
# Terminal 1: Iniciar backend
cd backend && node server.js

# Terminal 2: Iniciar frontend
npx vite
```

Esto iniciará:
- El servidor backend en el puerto 5000
- El servidor de desarrollo de Vite con recarga en caliente en el puerto 3000

## Estructura del Proyecto

```
floreria-arreglos-victoria/
├── backend/              # Servidor Express
├── frontend/             # Aplicación frontend
├── docs/                 # Documentación
├── dist/                 # Archivos de producción (generados)
├── node_modules/         # Dependencias (generado)
├── package.json          # Configuración del proyecto
└── README.md             # Documentación principal
```

## Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo (ambos servicios)
./start-dev.sh

# Iniciar solo el frontend con Vite
npx vite

# Construir para producción
npm run build

# Previsualizar versión de producción
npm run preview
```

### Backend

```bash
# Iniciar servidor en modo producción
npm start

# Iniciar servidor con nodemon para desarrollo
npm run dev
```

## Estructura de Componentes

Los componentes se organizan en:

- `frontend/components/` - Componentes web reutilizables
- `frontend/assets/js/components/` - Componentes JavaScript

### Crear un nuevo componente JavaScript

1. Crear archivo en `frontend/assets/js/components/[categoria]/[nombre].js`
2. Exportar funciones necesarias
3. Importar en `main.js` si es necesario

### Crear un nuevo componente web

1. Crear archivo en `frontend/components/[nombre]/[Nombre]Component.js`
2. Registrar el componente en la página donde se usará

## Estilos

Los estilos se encuentran en `frontend/assets/css/` y se organizan por:

- `base/` - Estilos base y variables
- `components/` - Estilos de componentes
- `layouts/` - Estilos de layouts
- `pages/` - Estilos específicos de páginas

## Contribuciones

1. Crear una rama para la nueva funcionalidad:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Realizar cambios y commits:
```bash
git add .
git commit -m "Agregar nueva funcionalidad"
```

3. Subir cambios y crear pull request:
```bash
git push origin feature/nueva-funcionalidad
```

## Solución de Problemas

### Problemas comunes con Vite

El proceso de empaquetado con Vite puede encontrar problemas con las rutas relativas de los componentes web. Esto es normal ya que los componentes web personalizados no se procesan de la misma manera que los módulos ES6.

Si encuentras errores durante el empaquetado:
1. Verifica que las rutas en los HTML sean correctas
2. Asegúrate de que los componentes web estén correctamente registrados
3. Considera migrar componentes web a módulos ES6 si es posible

### Problemas de puertos

Si los puertos 5000 o 3000 están en uso:
1. El script `start-dev.sh` intentará detener los procesos automáticamente
2. También puedes detenerlos manualmente:
```bash
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```