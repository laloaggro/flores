# Arreglos Florales Victoria 🌹

¡Bienvenido a Arreglos Florales Victoria! Somos una florería familiar con más de 10 años de experiencia en Recoleta, Región Metropolitana, especializados en crear hermosos arreglos florales para todas las ocasiones.

## Características del Sitio Web

### ✅ Funcionalidades Principales

- **Visualización de productos**: Catálogo completo de arreglos florales, ramos, plantas y accesorios
- **Sistema de autenticación**: Registro e inicio de sesión de usuarios
- **Carrito de compras**: Agregar productos y proceder al checkout
- **Panel de administración**: Gestión de productos, pedidos, usuarios y reseñas
- **Sistema de reseñas**: Los usuarios pueden dejar reseñas y calificaciones de productos
- **Lista de deseos**: Guardar productos favoritos para comprarlos más tarde
- **Búsqueda y filtrado**: Buscar productos por nombre, categoría o precio
- **Responsive design**: Diseño adaptable a dispositivos móviles y de escritorio

### ✅ Mejoras de UX/UI

- **Interfaz intuitiva**: Navegación clara y sencilla
- **Carga optimizada**: Implementación de lazy loading y preloading de recursos
- **Feedback visual**: Notificaciones para acciones del usuario
- **Accesibilidad**: Soporte para lectores de pantalla y navegación por teclado

### ✅ Optimizaciones Técnicas

- **Rendimiento**: Optimización de carga de imágenes y recursos
- **SEO**: Meta etiquetas y estructura semántica para mejor posicionamiento
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Manejo de errores**: Sistema centralizado de manejo de errores

## Estructura del Proyecto

```
frontend/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   └── js/
│       ├── admin.js
│       ├── auth.js
│       ├── checkout.js
│       ├── errorHandler.js
│       ├── home.js
│       ├── mobile-menu.js
│       ├── productManager.js
│       ├── products.js
│       ├── profile.js
│       ├── utils.js
│       └── wishlist.js
├── components/
├── pages/
│   └── admin.html
├── index.html
├── products.html
├── product-detail.html
├── wishlist.html
├── profile.html
├── checkout.html
├── login.html
├── register.html
└── sitemap.html

backend/
├── middleware/
├── routes/
├── server.js
└── init-db.js
```

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js con Express
- **Base de datos**: SQLite
- **Autenticación**: JWT (JSON Web Tokens)
- **Despliegue**: Render
- **Herramientas**: Git, GitHub

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/arreglos-victoria.git
```

2. Navegar al directorio del proyecto:
```bash
cd arreglos-victoria
```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

5. Abrir el navegador en `http://localhost:5000`

## Despliegue

El sitio web está configurado para desplegarse automáticamente en Render. Para desplegar manualmente:

```bash
./deploy.sh
```

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre un issue primero para discutir lo que te gustaría cambiar.

## Licencia

Derechos reservados © 2025 Arreglos Florales Victoria

## Contacto

- 📞 Teléfono: +569 6360 3177
- 📍 Dirección: Av. Valdivieso 593, Recoleta, Región Metropolitana
- 🌐 Sitio web: https://arreglos-victoria-backend.onrender.com
- 📧 Email: contacto@arreglosvictoria.cl

---

Desarrollado con ❤️ para Arreglos Florales Victoria