# Proceso de Despliegue - Arreglos Victoria Florería

Este documento describe el proceso de despliegue de la aplicación web de florería.

## Entornos

1. **Desarrollo (development)**: Entorno local para desarrollo y pruebas
2. **Staging (staging)**: Entorno de pre-producción para pruebas finales
3. **Producción (production)**: Entorno en vivo accesible para los usuarios

## Requisitos Previos

- Node.js >= 14.x
- npm >= 6.x
- Git
- Cuenta en Render (para despliegue en producción)
- Variables de entorno configuradas

## Proceso de Despliegue

### 1. Despliegue en Desarrollo

```bash
# Asegúrate de estar en la rama development
git checkout development

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 2. Despliegue en Staging

```bash
# Ejecutar script de despliegue a staging
./deploy.sh staging
```

### 3. Despliegue en Producción

```bash
# Ejecutar script de despliegue a producción
./deploy.sh production
```

## Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` basado en `.env.example`:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según el entorno
nano .env
```

Variables importantes:
- `PORT`: Puerto del servidor
- `JWT_SECRET`: Secreto para JWT
- `CORS_ORIGIN`: Orígenes permitidos para CORS

## Configuración de Render

1. Conecta tu repositorio de GitHub a Render
2. Configura las variables de entorno en el dashboard de Render
3. Selecciona el tipo de servicio como "Web Service"
4. Configura el comando de inicio como `node server.js`
5. Establece el directorio de trabajo como `backend/`

## Monitoreo y Logs

- Verifica los logs de la aplicación en Render
- Configura alertas para errores críticos
- Monitorea el uso de recursos (CPU, memoria)

## Rollback

En caso de problemas en producción:

1. Identifica el commit estable anterior
2. Revierte a ese commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Mejores Prácticas

1. **Pruebas**: Siempre prueba en staging antes de producción
2. **Backups**: Realiza backups de la base de datos antes de desplegar cambios importantes
3. **Monitoreo**: Monitorea la aplicación después del despliegue
4. **Documentación**: Documenta cualquier cambio importante en el proceso de despliegue