# Arquitectura del Sitio Web Victoria Florería

## Visión General

Victoria Florería utiliza una arquitectura de microservicios moderna con una API Gateway como punto de entrada único. Esta estructura permite una mejor escalabilidad, mantenibilidad y separación de responsabilidades en comparación con la arquitectura monolítica anterior.

## Componentes Principales

### 1. Frontend (Vite + Vanilla JavaScript)

El frontend está construido con Vite y utiliza JavaScript vanilla con una estructura modular basada en componentes. Se encuentra en el directorio [/frontend](file:///home/laloaggro/Proyectos/flores-1/frontend/).

#### Características:
- Desarrollo rápido con Vite
- Componentes reutilizables
- Gestión de estado con módulos JavaScript
- PWA para experiencias offline
- Optimización de imágenes y assets

### 2. API Gateway

Actúa como punto de entrada único para todas las solicitudes del cliente. Se encuentra en [/microservices/api-gateway](file:///home/laloaggro/Proyectos/flores-1/microservices/api-gateway/).

#### Funciones:
- Enrutamiento de solicitudes a microservicios
- Autenticación y autorización
- Rate limiting
- Logging y monitoreo
- Manejo de CORS

### 3. Microservicios

#### a) Auth Service
- **Directorio**: [/microservices/auth-service](file:///home/laloaggro/Proyectos/flores-1/microservices/auth-service/)
- **Puerto**: 3001
- **Base de datos**: MongoDB
- **Funciones**: Registro, login, gestión de tokens JWT, recuperación de contraseña

#### b) Product Service
- **Directorio**: [/microservices/product-service](file:///home/laloaggro/Proyectos/flores-1/microservices/product-service/)
- **Puerto**: 3002
- **Base de datos**: MongoDB
- **Funciones**: Gestión de productos, categorías, búsqueda y filtrado

#### c) Contact Service
- **Directorio**: [/microservices/contact-service](file:///home/laloaggro/Proyectos/flores-1/microservices/contact-service/)
- **Puerto**: 3003
- **Base de datos**: MongoDB
- **Funciones**: Gestión de formularios de contacto, envío de emails

#### d) Review Service
- **Directorio**: [/microservices/review-service](file:///home/laloaggro/Proyectos/flores-1/microservices/review-service/)
- **Puerto**: 3004
- **Base de datos**: MongoDB
- **Funciones**: Gestión de reseñas de productos, calificaciones

#### e) Order Service (Futuro)
- **Directorio**: [/microservices/order-service](file:///home/laloaggro/Proyectos/flores-1/microservices/order-service/)
- **Puerto**: 3005
- **Base de datos**: MongoDB
- **Funciones**: Gestión de pedidos, procesamiento de pagos

## Flujo de Datos

1. **Cliente** realiza una solicitud al frontend
2. **Frontend** envía solicitudes a la API Gateway
3. **API Gateway** autentica la solicitud (si es necesario)
4. **API Gateway** enruta la solicitud al microservicio correspondiente
5. **Microservicio** procesa la solicitud y accede a su base de datos
6. **Microservicio** devuelve la respuesta a la API Gateway
7. **API Gateway** devuelve la respuesta al frontend
8. **Frontend** actualiza la interfaz de usuario

## Comunicación entre Microservicios

- **Síncrona**: A través de la API Gateway
- **Asíncrona**: Mediante mensajería (RabbitMQ/Kafka - pendiente de implementación)

## Seguridad

- Autenticación con JWT
- Protección CSRF
- Rate limiting
- Validación de entrada en todos los servicios
- HTTPS (en producción)

## Despliegue

### Desarrollo
- Docker Compose para orquestación local
- Hot reloading para desarrollo frontend
- Recarga automática de servidores

### Producción
- Docker containers
- Balanceo de carga
- Monitoreo con Prometheus/Grafana
- Logging centralizado

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB
- Redis (caché)
- JWT para autenticación

### Frontend
- Vite
- JavaScript ES6+
- CSS3/HTML5
- PWA

### Infraestructura
- Docker
- Docker Compose
- Nginx (en producción)

## Directorio de Proyecto

```
flores-1/
├── frontend/                 # Aplicación frontend
├── microservices/            # Microservicios
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/         # Servicio de autenticación
│   ├── product-service/      # Servicio de productos
│   ├── contact-service/      # Servicio de contacto
│   └── review-service/       # Servicio de reseñas
├── config/                   # Configuraciones compartidas
├── scripts/                  # Scripts de utilidad
└── docs/                     # Documentación
```

## Escalabilidad

- Cada microservicio puede escalarse independientemente
- Balanceo de carga con Docker Compose
- Caché con Redis para datos frecuentes
- Base de datos optimizada por servicio

## Mantenibilidad

- Separación clara de responsabilidades
- Código modular y reutilizable
- Pruebas unitarias e integración
- Documentación completa
- Despliegue independiente de servicios