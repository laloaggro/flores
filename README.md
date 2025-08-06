# 🌸 Arreglos Victoria Florería

Proyecto completo de florería con delivery. Frontend React + Backend Node.js.

## 📁 Estructura del Proyecto

```
arreglos-victoria/
├── frontend/
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── components/
│   └── pages/
└── backend/
    ├── server.js
    ├── package.json
    ├── routes/
    ├── controllers/
    ├── models/
    ├── db/
    ├── middleware/
    ├── utils/
    └── config/
```

## 🚀 Iniciar el Proyecto

### Backend

1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor:
   ```bash
   npm start
   ```
   
   Para desarrollo con reinicio automático:
   ```bash
   npm run dev
   ```

### Frontend

1. Abrir el archivo `frontend/index.html` en un navegador, o
2. Usar un servidor local como Live Server en VS Code

## 🌐 API Endpoints

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID

### Órdenes

- `POST /api/orders` - Crear una nueva orden
- `GET /api/orders` - Obtener todas las órdenes

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL (configurable)
- **Otros**: CORS, DotEnv

## 📦 Dependencias

### Backend

- `express`: Framework web para Node.js
- `cors`: Middleware para habilitar CORS
- `dotenv`: Carga variables de entorno desde un archivo .env
- `mysql2`: Cliente MySQL para Node.js
- `sequelize`: ORM para Node.js

### Desarrollo

- `nodemon`: Herramienta para reiniciar automáticamente la aplicación al detectar cambios

## 📝 Notas de Desarrollo

1. La estructura del proyecto sigue el patrón MVC (Modelo-Vista-Controlador)
2. Los controladores manejan la lógica de negocio
3. Los modelos representan la estructura de datos
4. Las rutas definen los endpoints de la API
5. La configuración se maneja según el entorno (desarrollo/producción)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del proyecto
2. Crea una rama para tu función (`git checkout -b feature/NuevaFuncion`)
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva función'`)
4. Haz push a la rama (`git push origin feature/NuevaFuncion`)
5. Abre un Pull Request