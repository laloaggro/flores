# Arreglos Victoria Florería

Florería en línea con catálogo de productos, carrito de compras y panel de administración.

## Descripción

Este proyecto es una tienda en línea para una florería llamada "Arreglos Victoria". Permite a los usuarios navegar por productos, agregar artículos al carrito, realizar pedidos y gestionar su cuenta. También incluye un panel de administración para gestionar productos y pedidos.

**Para una documentación completa y unificada del proyecto, consulte [ARREGLOS_VICTORIA_DOCUMENTACION_UNIFICADA.md](ARREGLOS_VICTORIA_DOCUMENTACION_UNIFICADA.md)**

## Estado del Proyecto

Actualmente el proyecto está en proceso de migración de una arquitectura monolítica a una arquitectura de microservicios. Se ha implementado una arquitectura completa basada en microservicios con API Gateway y múltiples servicios especializados.

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Web Components
- Vite (para empaquetado y desarrollo)

### Backend (Monolítico - Legacy)
- Node.js
- Express
- SQLite (para almacenamiento de datos)

### Microservicios (Arquitectura Actual)
- Node.js
- Express
- Docker y Docker Compose
- MongoDB
- Redis

### Middleware y Componentes Compartidos
- Circuit Breaker para manejo de fallos
- HTTP Client con circuit breaker
- Sistema de caching con Redis
- Sistema de logs con Winston
- Métricas para Prometheus
- Middleware de compresión
- Middlewares de seguridad

### Herramientas de Desarrollo
- Git para control de versiones
- npm para gestión de paquetes
- ESLint y Prettier para linting y formateo
- Jest para pruebas unitarias

## Estructura del Proyecto

```
flores-1/
├── backend/                 # Código del servidor (monolítico - legacy)
├── frontend/                # Código del cliente con Vite
├── dev/                     # Entorno de desarrollo principal
│   ├── assets/              # Recursos para desarrollo
│   │   ├── css/             # Hojas de estilo
│   │   ├── images/          # Imágenes del sitio
│   │   └── js/              # Código JavaScript
│   ├── components/          # Componentes web reutilizables
│   │   ├── cart/            # Componentes del carrito de compras
│   │   ├── header/          # Componentes de encabezado y pie de página
│   │   ├── product/         # Componentes de productos
│   │   └── utils/           # Utilidades y funciones auxiliares
│   ├── pages/               # Páginas HTML individuales
│   └── index.html           # Página principal
├── microservices/           # Arquitectura de microservicios (actual)
│   ├── api-gateway/         # API Gateway (Puerto 3000)
│   ├── auth-service/        # Servicio de autenticación (Puerto 3001)
│   ├── product-service/     # Servicio de productos (Puerto 3002)
│   ├── contact-service/     # Servicio de contacto (Puerto 3003)
│   ├── review-service/      # Servicio de reseñas (Puerto 3004)
│   ├── order-service/       # Servicio de órdenes (Puerto 3005 - Futuro)
│   ├── shared/              # Componentes compartidos entre microservicios
│   └── docker-compose.yml   # Orquestación de microservicios
├── dist/                    # Archivos compilados para producción
├── docs/                    # Documentación del proyecto
└── scripts/                 # Scripts de utilidad

## Arquitectura de Microservicios

La arquitectura actual del proyecto se basa en microservicios con las siguientes características:

### Componentes Principales
1. **API Gateway** - Punto de entrada único para todas las solicitudes (Puerto 3000)
2. **Servicios Especializados** - Cada servicio maneja una funcionalidad específica
3. **Bases de Datos** - MongoDB y Redis para diferentes necesidades
4. **Componentes Compartidos** - Librerías y utilidades reutilizables

### Flujo de Datos

```
Frontend (dev/) 
    ↓ (HTTP)
API Gateway (Puerto 3000)
    ↓ (Enrutamiento)
Servicios Especializados
    ↓ (Comunicación con BD)
Bases de Datos (MongoDB, Redis)
```

## Cambios Recientes y Mejoras

### Mejoras en la Arquitectura de Microservicios
- Se ha optimizado la estructura de microservicios eliminando servicios redundantes
- Se ha mejorado la comunicación entre servicios a través de la API Gateway
- Se han corregido problemas de configuración en todos los servicios

### Frontend con Vite
- Se ha implementado Vite para mejorar el desarrollo y empaquetado del frontend
- Se ha mejorado la estructura de componentes
- Se ha optimizado la carga de recursos

### Documentación Completa
- Se ha creado documentación detallada en múltiples archivos markdown
- Se ha generado un cheatsheet con comandos útiles
- Se ha documentado la arquitectura del sitio web

### Pruebas
- Se han corregido las configuraciones de pruebas
- Se han creado nuevos archivos de prueba y fixtures
- Se ha mejorado el entorno de pruebas

## Iniciar la Aplicación

### Opción 1: Backend Monolítico (tradicional - legacy)

```bash
# Iniciar backend y frontend
npm run start:both

# O solo el backend
npm run start:backend

# O solo el frontend
npm run start:frontend
```

### Opción 2: Microservicios (recomendado - actual)

```bash
# Iniciar todos los microservicios con Docker Compose
npm run dev:services

# Iniciar el frontend con Vite en modo desarrollo
npm run dev

# Iniciar ambos al mismo tiempo
npm run dev:all
```

## Configuración

### Variables de Entorno
Las variables de entorno se configuran en el archivo `microservices/.env`. Asegúrate de que este archivo exista con las configuraciones adecuadas.

### Puertos y Endpoints

| Servicio | Puerto | Endpoint Base |
|----------|--------|---------------|
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| Product Service | 3002 | http://localhost:3002 |
| Contact Service | 3003 | http://localhost:3003 |
| Review Service | 3004 | http://localhost:3004 |
| Order Service | 3005 | http://localhost:3005 (Futuro) |
| MongoDB | - | mongodb://localhost:27017 |
| Redis | 6379 | - |

## Documentación Adicional

- [Documentación Unificada](ARREGLOS_VICTORIA_DOCUMENTACION_UNIFICADA.md)
- [Guía de Microservicios](MICROSERVICES_GUIDE.md)
- [Documentación de la API](backend/README.md)
- [Guía de Desarrollo](docs/DEVELOPMENT_GUIDE.md)
- [Arquitectura del Sitio Web](WEB_ARCHITECTURE.md)
- [Cheatsheet de Comandos](CHEATSHEET.md)

## Estado de Desarrollo

El proyecto se encuentra en un estado avanzado con una arquitectura de microservicios moderna. Se recomienda utilizar la arquitectura de microservicios para nuevas funcionalidades y el frontend con Vite para una mejor experiencia de desarrollo.

## Licencia

MIT