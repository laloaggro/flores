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
- PostgreSQL
- MongoDB Atlas
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
├── frontend/                # Código del cliente original
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
│   ├── user-service/        # Servicio de usuarios (Puerto 3003)
│   ├── order-service/       # Servicio de órdenes (Puerto 3004)
│   ├── cart-service/        # Servicio de carrito (Puerto 3005)
│   ├── contact-service/     # Servicio de contacto (Puerto 3006)
│   ├── wishlist-service/    # Servicio de lista de deseos (Puerto 3007)
│   ├── review-service/      # Servicio de reseñas (Puerto 3008)
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
3. **Bases de Datos** - PostgreSQL, MongoDB Atlas y Redis para diferentes necesidades
4. **Componentes Compartidos** - Librerías y utilidades reutilizables

### Flujo de Datos
```
Frontend (dev/) 
    ↓ (HTTP)
API Gateway (Puerto 3000)
    ↓ (Enrutamiento)
Servicios Especializados
    ↓ (Comunicación con BD)
Bases de Datos (PostgreSQL en puerto 5433, MongoDB Atlas, Redis en puerto 6380)
```

## Cambios Recientes y Mejoras

### Corrección de Problemas de Conectividad
- Se resolvieron problemas de conexión con MongoDB Atlas eliminando opciones de configuración conflictivas de TLS
- Se corrigió la configuración de todos los servicios que utilizan MongoDB para asegurar la conectividad

### Mejoras en el Servicio de Autenticación
- Se migró el servicio de autenticación de PostgreSQL a SQLite para simplificar la implementación
- Se corrigieron errores en el modelo de usuarios y en la inicialización de la base de datos
- Se agregó la dependencia `dotenv` faltante

### Actualizaciones en la Configuración de Docker
- Se resolvieron conflictos de puertos al iniciar los contenedores
- Se mejoró el proceso de construcción de imágenes Docker

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
# Iniciar microservicios y frontend simultáneamente
npm run dev:microservices

# O solo los microservicios
npm run start:microservices
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
| User Service | 3003 | http://localhost:3003 |
| Order Service | 3004 | http://localhost:3004 |
| Cart Service | 3005 | http://localhost:3005 |
| Contact Service | 3006 | http://localhost:3006 |
| Wishlist Service | 3007 | http://localhost:3007 |
| Review Service | 3008 | http://localhost:3008 |
| PostgreSQL | 5433 | - |
| MongoDB Atlas | - | mongodb+srv:// |
| Redis | 6380 | - |

## Documentación Adicional

- [Documentación Unificada](ARREGLOS_VICTORIA_DOCUMENTACION_UNIFICADA.md)
- [Guía de Microservicios](MICROSERVICES_GUIDE.md)
- [Documentación de la API](backend/README.md)
- [Guía de Desarrollo](docs/DEVELOPMENT_GUIDE.md)

## Estado de Desarrollo

El proyecto se encuentra en un estado de transición entre la arquitectura monolítica tradicional y la arquitectura de microservicios moderna. Se recomienda utilizar la arquitectura de microservicios para nuevas funcionalidades.

## Licencia

MIT