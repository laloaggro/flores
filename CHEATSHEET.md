# Cheatsheet - Comandos más utilizados para el manejo del sitio

## Desarrollo

### Iniciar el entorno de desarrollo completo

```bash
# Iniciar todos los microservicios con Docker Compose
npm run dev:services

# Iniciar el frontend con Vite en modo desarrollo
npm run dev

# Iniciar ambos al mismo tiempo (en terminales separados o con herramienta de gestión)
npm run dev:all
```

### Trabajar con microservicios individualmente

```bash
# Iniciar un microservicio específico
npm run dev:auth        # Servicio de autenticación
npm run dev:products    # Servicio de productos
npm run dev:contact     # Servicio de contacto
npm run dev:reviews     # Servicio de reseñas
npm run dev:api         # API Gateway

# Iniciar frontend
npm run dev:frontend
```

### Docker Compose

```bash
# Iniciar todos los servicios con Docker Compose
docker-compose -f microservices/docker-compose.yml up

# Iniciar en modo detach (background)
docker-compose -f microservices/docker-compose.yml up -d

# Detener todos los servicios
docker-compose -f microservices/docker-compose.yml down

# Ver logs de un servicio específico
docker-compose -f microservices/docker-compose.yml logs auth-service

# Reconstruir servicios
docker-compose -f microservices/docker-compose.yml up --build
```

## Pruebas

### Ejecutar todas las pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Pruebas específicas

```bash
# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Pruebas de un archivo específico
npx jest frontend/__tests__/unit/auth.test.js
```

## Base de datos

### MongoDB (desarrollo local)

```bash
# Conectar a MongoDB local
mongosh mongodb://localhost:27017/flores_dev

# Conectar a un servicio específico
mongosh mongodb://localhost:27018/auth_dev      # Auth service
mongosh mongodb://localhost:27019/products_dev  # Product service
mongosh mongodb://localhost:27020/contact_dev   # Contact service
mongosh mongodb://localhost:27021/reviews_dev   # Review service
```

## Frontend

### Vite

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Gestión de dependencias

```bash
# Instalar todas las dependencias
npm install

# Instalar dependencias de desarrollo
npm install --save-dev <package-name>

# Instalar dependencias de producción
npm install --save <package-name>
```

## Despliegue

### Construcción de imágenes Docker

```bash
# Construir imagen de API Gateway
docker build -t flores-api-gateway microservices/api-gateway

# Construir imagen de Auth Service
docker build -t flores-auth-service microservices/auth-service

# Construir imagen de Product Service
docker build -t flores-product-service microservices/product-service

# Construir imagen de Contact Service
docker build -t flores-contact-service microservices/contact-service

# Construir imagen de Review Service
docker build -t flores-review-service microservices/review-service
```

### Etiquetado y publicación de imágenes

```bash
# Etiquetar imagen para registro
docker tag flores-api-gateway usuario/imagen:version

# Publicar imagen en registro
docker push usuario/imagen:version
```

## Monitoreo y Logs

### Docker

```bash
# Ver logs de contenedores
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs api-gateway

# Seguir logs en tiempo real
docker-compose logs -f

# Ver estadísticas de contenedores
docker stats
```

### Desarrollo

```bash
# Ver logs del servidor de desarrollo
npm run dev -- --log
```

## Utilidades

### Limpieza

```bash
# Limpiar módulos node
rm -rf node_modules && npm install

# Limpiar caché de Vite
rm -rf frontend/node_modules/.vite

# Limpiar contenedores y volúmenes de Docker no utilizados
docker system prune -a
docker volume prune
```

### Generación de código

```bash
# Generar inputs para Vite
node scripts/generate-vite-inputs.js

# Verificar páginas HTML
node scripts/verify-html-pages.js

# Optimizar imágenes
node scripts/optimize-images.js
```

### Git

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit con mensaje
git commit -m "Mensaje descriptivo"

# Push a rama remota
git push origin nombre-de-la-rama

# Pull de cambios
git pull origin nombre-de-la-rama

# Ver historial de commits
git log --oneline
```

## Variables de Entorno

### Archivo .env

```bash
# Crear archivo .env desde ejemplo
cp .env.example .env

# Variables importantes:
JWT_SECRET=tu_secreto_jwt
MONGODB_URI=mongodb://localhost:27017/flores_dev
PORT=5173
```

### Variables por microservicio

```bash
# Auth Service (.env en microservices/auth-service)
PORT=3001
MONGODB_URI=mongodb://mongo-auth:27017/auth_dev

# Product Service (.env en microservices/product-service)
PORT=3002
MONGODB_URI=mongodb://mongo-products:27017/products_dev

# Contact Service (.env en microservices/contact-service)
PORT=3003
MONGODB_URI=mongodb://mongo-contact:27017/contact_dev

# Review Service (.env en microservices/review-service)
PORT=3004
MONGODB_URI=mongodb://mongo-reviews:27017/reviews_dev

# API Gateway (.env en microservices/api-gateway)
PORT=3000
AUTH_SERVICE_URL=http://auth-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
CONTACT_SERVICE_URL=http://contact-service:3003
REVIEW_SERVICE_URL=http://review-service:3004
```

## Scripts personalizados

```bash
# Iniciar todos los servidores con un solo comando
node start-servers.js

# Iniciar microservicios
node start-microservices.js

# Verificar y corregir problemas comunes
node scripts/fix-all-issues.js

# Corregir imports duplicados
node scripts/fix-duplicate-imports.js

# Corregir problemas con imágenes
node scripts/fix-images.js
```

## Atajos útiles

### Terminal

```bash
# Limpiar terminal
Ctrl + L

# Interrumpir proceso
Ctrl + C

# Suspender proceso
Ctrl + Z

# Autocompletar
Tab

# Historial de comandos
Flecha arriba/abajo
```

### Desarrollo

```bash
# Recargar servidor (si soportado)
rs

# Detener todos los procesos en ejecución
killall node
```

Este cheatsheet proporciona una referencia rápida para las tareas más comunes en el desarrollo y mantenimiento del sitio web Victoria Florería.