# API Gateway

## Introducción

El API Gateway es el punto de entrada único para todos los clientes. Enruta las solicitudes a los microservicios apropiados, maneja la autenticación, el rate limiting y otras preocupaciones transversales.

## Funcionalidades

1. **Enrutamiento**: Dirige las solicitudes a los microservicios correctos
2. **Autenticación**: Valida tokens JWT
3. **Rate Limiting**: Limita las solicitudes por cliente
4. **Logging**: Registra todas las solicitudes
5. **Monitoreo**: Mide el rendimiento de las APIs
6. **Compresión**: Comprime respuestas para mejorar el rendimiento

## Tecnología

- Node.js con Express.js
- Middleware de seguridad (Helmet, CORS)
- JWT para autenticación
- Express-rate-limit para rate limiting

## Estructura de Directorios

```
/api-gateway
  /src
    /middleware
    /routes
    /utils
    app.js
    server.js
  Dockerfile
  package.json
```

## Implementación Básica

### package.json

```json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "description": "API Gateway para microservicios de Arreglos Victoria",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "axios": "^1.3.0",
    "winston": "^3.8.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### server.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json());

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway funcionando' });
});

// Enrutamiento a microservicios
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', authenticateToken, require('./routes/users'));

app.listen(PORT, () => {
  console.log(`API Gateway corriendo en puerto ${PORT}`);
});
```

## Enrutamiento

El API Gateway enruta las solicitudes a los microservicios apropiados:

- `/api/auth/*` → Auth Service
- `/api/products/*` → Product Service
- `/api/users/*` → User Service
- `/api/orders/*` → Order Service
- `/api/cart/*` → Cart Service
- `/api/wishlist/*` → Wishlist Service
- `/api/reviews/*` → Review Service
- `/api/contact/*` → Contact Service

## Futuras Mejoras con Tecnologías de Pago

### API Gateway Empresarial
**Cuándo migrar**: Cuando necesite funcionalidades avanzadas de gestión de APIs

**Opciones de pago**:
1. **AWS API Gateway**
2. **Google Cloud API Gateway**
3. **Azure API Management**
4. **Kong Gateway**
5. **Apigee**

**Beneficios**:
- Monitoreo avanzado
- Análisis de uso
- Control de versiones
- Transformación de mensajes
- Soporte empresarial

### Service Mesh
**Cuándo migrar**: Cuando tenga 10+ microservicios que necesiten comunicación compleja

**Opciones**:
1. **Istio**
2. **Linkerd**
3. **Consul Connect**

**Beneficios**:
- Observabilidad detallada
- Control de tráfico avanzado
- Seguridad de servicio a servicio
- Resiliencia automática