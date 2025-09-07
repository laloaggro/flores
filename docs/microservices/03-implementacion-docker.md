# Implementación con Docker - Microservicios

## Introducción

Este documento describe cómo implementar la arquitectura de microservicios utilizando Docker y Docker Compose como tecnologías gratuitas de código abierto.

## Requisitos Previos

1. Docker instalado
2. Docker Compose instalado
3. Node.js (para desarrollo local)

## Estructura de Directorios

```
/microservices
  /api-gateway
  /auth-service
  /product-service
  /user-service
  /order-service
  /cart-service
  /wishlist-service
  /review-service
  /contact-service
  /shared
  /docker-compose.yml
  /docker-compose.dev.yml
  /docker-compose.prod.yml
```

## Configuración de Docker Compose

### docker-compose.yml (Base)

```yaml
version: '3.8'

services:
  # Bases de datos
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-flores_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-flores_password}
      POSTGRES_DB: ${POSTGRES_DB:-flores_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  mongodb:
    image: mongo:4.4
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-flores_user}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-flores_password}
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # API Gateway
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - auth-service
      - product-service
      - user-service

  # Microservicios
  auth-service:
    build:
      context: ./auth-service
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://flores_user:flores_password@postgres:5432/flores_db
      - JWT_SECRET=${JWT_SECRET:-my_secret_key}
    depends_on:
      - postgres

  product-service:
    build:
      context: ./product-service
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - MONGODB_URI=mongodb://flores_user:flores_password@mongodb:27017/products_db
    depends_on:
      - mongodb

  user-service:
    build:
      context: ./user-service
      dockerfile: Dockerfile
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://flores_user:flores_password@postgres:5432/flores_db
    depends_on:
      - postgres

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

### docker-compose.dev.yml (Desarrollo)

```yaml
version: '3.8'

services:
  api-gateway:
    volumes:
      - ./api-gateway:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  auth-service:
    volumes:
      - ./auth-service:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  product-service:
    volumes:
      - ./product-service:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  user-service:
    volumes:
      - ./user-service:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

## Dockerfiles de Ejemplo

### API Gateway Dockerfile

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Microservicio Dockerfile (Ejemplo)

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del directorio `/microservices`:

```env
# PostgreSQL
POSTGRES_USER=flores_user
POSTGRES_PASSWORD=flores_password
POSTGRES_DB=flores_db

# MongoDB
MONGO_USER=flores_user
MONGO_PASSWORD=flores_password

# JWT
JWT_SECRET=my_secret_key

# Puertos
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
PRODUCT_SERVICE_PORT=3002
USER_SERVICE_PORT=3003
```

## Comandos de Docker Compose

### Iniciar todos los servicios

```bash
docker-compose up -d
```

### Iniciar servicios para desarrollo

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Detener todos los servicios

```bash
docker-compose down
```

### Ver logs de un servicio específico

```bash
docker-compose logs api-gateway
```

### Construir servicios

```bash
docker-compose build
```

## Configuración de Red

Docker Compose crea automáticamente una red bridge para que los servicios puedan comunicarse entre sí usando sus nombres de servicio como hostnames.

Por ejemplo, desde el api-gateway, se puede acceder al auth-service en `http://auth-service:3001`.

## Volúmenes de Datos

Los volúmenes definidos en el docker-compose.yml persisten los datos de las bases de datos entre reinicios de contenedores:

- `postgres_data`: Datos de PostgreSQL
- `mongodb_data`: Datos de MongoDB
- `redis_data`: Datos de Redis

## Estrategia de Desarrollo

1. **Desarrollo local**: Usar docker-compose.dev.yml con volúmenes para recarga en caliente
2. **Pruebas**: Usar docker-compose.yml con datos de prueba
3. **Producción**: Usar docker-compose.prod.yml con configuraciones optimizadas

## Mejores Prácticas

1. **Un proceso por contenedor**: Cada microservicio debe ejecutar un solo proceso principal
2. **Variables de entorno**: Configurar servicios mediante variables de entorno
3. **Volúmenes para datos persistentes**: Usar volúmenes para bases de datos
4. **Redes definidas**: Aprovechar la red automática de Docker Compose
5. **Multi-stage builds**: Usar construcciones multi-etapa para imágenes más pequeñas
6. **Health checks**: Implementar verificaciones de salud en los contenedores

## Próximos Pasos

1. Crear la estructura de directorios para microservicios
2. Implementar el API Gateway básico
3. Migrar la funcionalidad de autenticación al auth-service
4. Configurar bases de datos en contenedores
5. Implementar comunicación entre servicios