# Tareas pendientes y mejoras

## Problemas identificados

### 1. Problemas de carga de productos
- Se demora en mostrar los productos desde la BD
- En inicio se muestran "Nuestros Productos" pero no hace relación con los productos de la BD
- El Boton Ver productos envia a "Nuestros Productos" pero no hace relación con los productos de la BD

### 2. Formulario de contacto
- No se esta enviando el formulario al correo

### 3. Sistema de usuarios
- Se requiere que el usuario se registre para poder solicitar comprar
- Registrar todos los usuarios en una BD

## Soluciones implementadas

### Productos dinámicos
- Se ha implementado la carga dinámica de productos desde la base de datos
- Se muestra un mensaje de carga mientras se obtienen los productos
- Se utiliza un sistema de caché para mejorar el rendimiento

### Formulario de contacto
- Se ha creado un script JavaScript para manejar el envío del formulario
- Se conecta con el backend a través de una API REST
- Se muestran mensajes de éxito o error al usuario

### Sistema de usuarios
- Se ha implementado un sistema de registro e inicio de sesión
- Se almacenan los usuarios en una base de datos SQLite
- Se utiliza bcrypt para el hashing seguro de contraseñas

## Próximos pasos

1. Mejorar el sistema de paginación de productos
2. Implementar filtros por categoría
3. Añadir funcionalidad de búsqueda
4. Mejorar el panel de administración
5. Implementar pasarela de pago