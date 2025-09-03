# Configuración del Entorno de Desarrollo

## Descripción

Este documento describe cómo configurar y ejecutar el entorno de desarrollo completo para el sitio web de Arreglos Victoria Florería, incluyendo tanto el frontend como el backend.

## Estructura del Proyecto

```
/home/laloaggro/Proyectos/flores-1/
├── dev/                 # Entorno de desarrollo frontend
├── backend/             # Código del backend
├── start-dev-env.js     # Script para iniciar ambos servidores
├── check-frontend.js    # Script para verificar el frontend
└── ...
```

## Configuración Inicial

### 1. Crear estructura de desarrollo

La estructura de desarrollo se crea copiando los archivos del directorio `frontend` al directorio `dev`:

```bash
# Eliminar directorio dev existente
rm -rf /home/laloaggro/Proyectos/flores-1/dev

# Crear nuevo directorio dev
mkdir -p /home/laloaggro/Proyectos/flores-1/dev

# Copiar archivos del frontend
cp -r /home/laloaggro/Proyectos/flores-1/frontend/* /home/laloaggro/Proyectos/flores-1/dev/
```

### 2. Instalar dependencias

```bash
cd /home/laloaggro/Proyectos/flores-1
npm install mime-types
```

## Iniciar el Entorno de Desarrollo

### Usando el script principal

```bash
cd /home/laloaggro/Proyectos/flores-1
node start-dev-env.js
```

Este comando iniciará ambos servidores:
- **Frontend**: http://localhost:3005
- **Backend**: http://localhost:5000 (puerto por defecto)

### Detener los servidores

Para detener ambos servidores, presiona `Ctrl+C` en la terminal donde se ejecutó el script.

## Verificación del Frontend

### Usando el script de verificación

```bash
cd /home/laloaggro/Proyectos/flores-1
node check-frontend.js
```

### Verificación manual

Puedes verificar manualmente accediendo a las siguientes URLs:

1. **Página principal**: http://localhost:3005/
2. **CSS**: http://localhost:3005/assets/css/styles.css
3. **JavaScript**: http://localhost:3005/assets/js/main.js
4. **Imágenes**: http://localhost:3005/assets/images/logo.png
5. **Otras páginas**: 
   - Productos: http://localhost:3005/pages/products.html
   - Contacto: http://localhost:3005/pages/contact.html

## Estado Actual

### Frontend
- ✅ Servidor ejecutándose en http://localhost:3005
- ✅ Archivos CSS cargando correctamente
- ✅ Archivos JavaScript cargando correctamente
- ✅ Imágenes cargando correctamente
- ✅ Todas las páginas accesibles

### Backend
- ⚠️ Hay problemas con las dependencias del backend
- ⚠️ El backend no se inicia correctamente debido a errores de módulos

## Solución de Problemas

### Problemas comunes del Frontend

#### 1. Puerto en uso
Si el puerto 3005 está en uso, cambia el puerto en el archivo `start-dev-env.js`:
```javascript
const PORT = 3006; // Cambiar a otro puerto disponible
```

#### 2. Archivos no encontrados
Verifica que todos los archivos estén en el directorio `dev`:
```bash
ls -la /home/laloaggro/Proyectos/flores-1/dev/
```

### Problemas comunes del Backend

#### 1. Errores de módulos
El backend tiene problemas con dependencias faltantes:
```
Error: Cannot find module './template-item'
```

Para solucionar este problema, intenta reinstalar las dependencias del backend:
```bash
cd /home/laloaggro/Proyectos/flores-1/backend
npm install
```

## Recomendaciones

1. **Mantener el directorio dev sincronizado**: Asegúrate de que el directorio `dev` tenga los mismos archivos que `frontend` después de hacer cambios.

2. **Verificar regularmente**: Ejecuta el script `check-frontend.js` regularmente para asegurarte de que todo funciona correctamente.

3. **Resolver problemas del backend**: Trabaja en la resolución de los problemas de dependencias del backend para tener un entorno de desarrollo completo.

4. **Documentar cambios**: Mantén este documento actualizado con cualquier cambio en la configuración del entorno de desarrollo.

## Acceso al Sitio

Una vez que ambos servidores estén ejecutándose, puedes acceder al sitio en:
- **Frontend**: http://localhost:3005/
- **Backend API**: http://localhost:5000/api/

## Próximos Pasos

1. Resolver los problemas de dependencias del backend
2. Configurar variables de entorno para el backend
3. Verificar la conectividad entre frontend y backend
4. Implementar pruebas automatizadas