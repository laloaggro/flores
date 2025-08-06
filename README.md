# Arreglos Victoria Florería

Sitio web para la florería Arreglos Victoria, con funcionalidades de catálogo de productos y formulario de contacto.

## Estructura del proyecto

```
.
├── backend/
│   ├── config/
│   ├── routes/
│   ├── contact.php
│   ├── contact-enhanced.php
│   ├── server.js
│   └── ...
├── frontend/
│   ├── assets/
│   ├── components/
│   └── index.html
└── README.md
```

## Tecnologías utilizadas

- Frontend: HTML, CSS (Tailwind), JavaScript (ES6)
- Backend: Node.js con Express, PHP
- Correo: PHPMailer
- Gestión de dependencias: npm, Composer

## Configuración del entorno

1. Copiar el archivo de ejemplo de variables de entorno:
   ```
   cp backend/.env.example backend/.env
   ```

2. Configurar las variables de entorno en `backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=tu-correo@gmail.com
   SMTP_PASSWORD=tu-contraseña
   SMTP_ENCRYPTION=tls
   ```

3. Instalar dependencias del backend:
   ```
   cd backend
   npm install
   ```

4. Instalar PHPMailer y otras dependencias de PHP (requiere Composer):
   ```
   cd backend
   php composer.phar require phpmailer/phpmailer
   php composer.phar require vlucas/phpdotenv
   ```

## Ejecutar el servidor

```
cd backend
npm start
```

El servidor estará disponible en `http://localhost:5000`

## Desarrollo

Para desarrollo con reinicio automático:
```
cd backend
npm run dev
```

## Pruebas

Para probar la funcionalidad de contacto sin enviar correos reales:
```
cd backend
php dev-contact-test.php
```

## Configuración de VSCode

Este proyecto incluye configuraciones recomendadas para VSCode:
- Extensiones recomendadas
- Formato de código con Prettier
- Configuración de EditorConfig
- Configuración específica por tipo de archivo

### Extensiones recomendadas

El archivo `.vscode/extensions.json` contiene una lista de extensiones recomendadas y no recomendadas para este proyecto.

### Formato de código

El proyecto utiliza Prettier para mantener un formato consistente. La configuración se encuentra en `.prettierrc`.