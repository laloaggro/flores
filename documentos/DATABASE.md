# Documentación de la Base de Datos de Productos

## Estructura de la Base de Datos

La base de datos de productos se almacena en un archivo SQLite llamado `products.db` ubicado en el directorio `backend`. La base de datos contiene una única tabla llamada `products` con la siguiente estructura:

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Descripción de los campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único del producto (clave primaria autoincremental) |
| name | TEXT | Nombre del producto (requerido) |
| description | TEXT | Descripción detallada del producto |
| price | REAL | Precio del producto en CLP (requerido) |
| image_url | TEXT | URL de la imagen del producto |
| category | TEXT | Categoría del producto |
| created_at | DATETIME | Fecha y hora de creación del producto (se establece automáticamente) |

## Generación de datos de ejemplo

El sistema incluye un script para generar datos de ejemplo automáticamente. Este script crea 100 productos con datos realistas para facilitar las pruebas de funcionalidades como paginación, filtrado y búsqueda.

### Categorías de productos

Los productos se generan en las siguientes categorías:
- Arreglos
- Condolencias
- Coronas
- Ramos
- Jardinería

### Ejecutar el script de generación

Para regenerar los datos de ejemplo, ejecuta el siguiente comando desde el directorio `backend`:

```bash
node generate-sample-data.js
```

## Consultas API disponibles

La API proporciona endpoints para acceder a los productos:

1. `GET /api/products` - Obtiene todos los productos con paginación
2. `GET /api/products/:id` - Obtiene un producto específico por ID
3. `GET /api/products/category/:category` - Obtiene productos por categoría
4. `GET /api/products/search/:query` - Busca productos por nombre

### Parámetros de paginación

Todos los endpoints que devuelven listas de productos soportan los siguientes parámetros de consulta:
- `page` - Número de página (por defecto: 1)
- `limit` - Cantidad de productos por página (por defecto: 12)

## Solución de problemas de carga de productos

Si los productos no se cargan correctamente en el sitio web:

1. Verifica que el archivo `products.db` exista en el directorio `backend`
2. Asegúrate de que el servidor backend esté en ejecución
3. Comprueba que no haya errores en la consola del navegador
4. Verifica que la base de datos tenga datos ejecutando:
   ```bash
   sqlite3 backend/products.db "SELECT COUNT(*) FROM products;"
   ```
5. Si la base de datos está vacía, ejecuta el script de generación de datos de ejemplo

## Mantenimiento de la base de datos

Para realizar mantenimiento en la base de datos, puedes usar el comando sqlite3 directamente:

```bash
# Ver el esquema de la base de datos
sqlite3 backend/products.db ".schema"

# Contar productos
sqlite3 backend/products.db "SELECT COUNT(*) FROM products;"

# Ver algunos productos de ejemplo
sqlite3 backend/products.db "SELECT id, name, price, category FROM products LIMIT 5;"
```