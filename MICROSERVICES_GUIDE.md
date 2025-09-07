# Guía de Microservicios - Arreglos Victoria

## Introducción

Este documento proporciona una guía completa para trabajar con la arquitectura de microservicios implementada en Arreglos Victoria Florería. La arquitectura incluye un API Gateway y múltiples microservicios especializados.

## Arquitectura

```
Arreglos Victoria Florería (Microservicios)
├── API Gateway (Puerto 3000)
├── Auth Service (Puerto 3001)
├── Product Service (Puerto 3002)
├── User Service (Puerto 3003)
├── Order Service (Puerto 3004)
├── Cart Service (Puerto 3005)
├── Wishlist Service (Puerto 3006)
├── Review Service (Puerto 3007)
├── Contact Service (Puerto 3008)
├── Bases de datos
│   ├── PostgreSQL (Puerto 5432)
│   ├── MongoDB (Puerto 27017)
│   └── Redis (Puerto 6379)
```

## Iniciar los Microservicios

### Requisitos Previos

- Docker y Docker Compose instalados
- Node.js versión 14 o superior

### Iniciar en Modo Desarrollo

```bash
# Opción 1: Usar el script dedicado
npm run start:microservices

# Opción 2: Usar el script concurrente (inicia microservicios y frontend)
npm run dev:microservices
```

### Iniciar Manualmente

```bash
cd microservices
docker compose up -d
```

## Puertos y Endpoints

| Servicio | Puerto | Endpoint Base |
|----------|--------|---------------|
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| Product Service | 3002 | http://localhost:3002 |
| User Service | 3003 | http://localhost:3003 |
| Order Service | 3004 | http://localhost:3004 |
| Cart Service | 3005 | http://localhost:3005 |
| Wishlist Service | 3006 | http://localhost:3006 |
| Review Service | 3007 | http://localhost:3007 |
| Contact Service | 3008 | http://localhost:3008 |

## Uso del API Gateway

El API Gateway es el punto de entrada único para todas las solicitudes de la aplicación frontend. Todas las llamadas a la API deben realizarse a través del gateway.

### Endpoints del API Gateway

- **Autenticación**: `/api/auth/*` → Auth Service
- **Productos**: `/api/products/*` → Product Service
- **Usuarios**: `/api/users/*` → User Service
- **Órdenes**: `/api/orders/*` → Order Service
- **Carrito**: `/api/cart/*` → Cart Service
- **Lista de deseos**: `/api/wishlist/*` → Wishlist Service
- **Reseñas**: `/api/reviews/*` → Review Service
- **Contacto**: `/api/contact/*` → Contact Service

### Ejemplo de uso en el frontend

```javascript
// En lugar de llamar directamente a los servicios individuales
// const response = await fetch('http://localhost:3002/api/products');

// Llamar a través del API Gateway
const response = await fetch('http://localhost:3000/api/products');
```

## Componentes Compartidos

Los microservicios utilizan componentes compartidos ubicados en el directorio `microservices/shared`:

- **Circuit Breaker**: Para manejo de fallos
- **HTTP Client**: Cliente HTTP con circuit breaker
- **Cache Manager**: Sistema de caching con Redis
- **Logging**: Sistema de logs con Winston
- **Monitoring**: Métricas para Prometheus
- **Compression**: Middleware de compresión
- **Security**: Middlewares de seguridad

## Variables de Entorno

Las variables de entorno se configuran en el archivo `microservices/.env`. Asegúrate de que este archivo exista con las configuraciones adecuadas.

## Detener los Microservicios

```bash
# Si se iniciaron con npm
# Presiona Ctrl+C en la terminal donde se ejecutaron

# Detener manualmente
cd microservices
docker compose down
```

## Verificación del Estado

Para verificar que todos los microservicios están funcionando correctamente:

```bash
cd microservices
docker compose ps
```

## Solución de Problemas

### Problemas Comunes

1. **Puertos ocupados**: Asegúrate de que los puertos no estén siendo utilizados por otras aplicaciones.

2. **Conectividad de bases de datos**: Verifica que las credenciales y configuraciones de las bases de datos sean correctas.

3. **Errores de dependencias**: Asegúrate de ejecutar `npm install` en los directorios de los servicios si hay errores.

### Logs

Para ver los logs de los microservicios:

```bash
cd microservices
docker compose logs -f
```

## Desarrollo

### Agregar un nuevo microservicio

1. Crear un nuevo directorio en `microservices/`
2. Implementar el servicio siguiendo la estructura de los servicios existentes
3. Agregar el servicio al `docker-compose.yml`
4. Actualizar la configuración del API Gateway si es necesario

### Modificar un microservicio existente

1. Realiza los cambios en el directorio del servicio correspondiente
2. Reinicia los contenedores: `docker compose restart <nombre-del-servicio>`

## Pruebas

Para ejecutar pruebas en los microservicios:

```bash
cd microservices/<nombre-del-servicio>
npm test
```