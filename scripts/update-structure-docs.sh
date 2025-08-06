#!/bin/bash
# Script para actualizar automáticamente la documentación de la estructura del proyecto

echo "🔄 Actualizando documentación de la estructura del proyecto..."

# Crear directorio de scripts si no existe
mkdir -p scripts

# Actualizar FRONTEND_STRUCTURE.md
cat > FRONTEND_STRUCTURE.md << 'EOF'
# 🌐 Estructura del Sitio Web - Arreglos Victoria Florería

Este documento describe la estructura actualizada del frontend del sitio web. Se actualizará con cada cambio en la estructura del proyecto.

## 📁 Estructura de Directorios Actual

```
frontend/
├── index.html                    # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css           # Estilos principales
│   ├── images/                  # Imágenes del sitio
│   └── js/                      # Scripts JavaScript
│       ├── main.js              # Archivo principal de JavaScript
│       ├── components/          # Componentes reutilizables
│       ├── utils/               # Funciones auxiliares
│       └── modules/             # Módulos específicos
├── components/                  # Componentes HTML reutilizables
└── pages/                       # Páginas adicionales del sitio
```

## 📄 Página Principal (index.html)

### Secciones Principales
1. **Encabezado (Header)**
   - Logo de la florería
   - Menú de navegación
   - Carrito de compras

2. **Hero Banner**
   - Imagen principal atractiva
   - Mensaje de bienvenida
   - Llamada a la acción

3. **Productos Destacados**
   - Galería de arreglos florales populares
   - Precios y descripciones breves

4. **Sobre Nosotros**
   - Historia de la florería
   - Valores y compromisos

5. **Servicios**
   - Delivery
   - Diseño personalizado
   - Eventos especiales

6. **Testimonios**
   - Reseñas de clientes

7. **Contacto**
   - Formulario de contacto
   - Información de ubicación
   - Redes sociales

8. **Pie de Página (Footer)**
   - Enlaces importantes
   - Información de contacto
   - Derechos reservados

## 🎨 Componentes Reutilizables

### Header
- Navegación responsiva
- Carrito de compras con contador
- Menú desplegable en móviles

### Product Cards
- Imagen del producto
- Nombre y precio
- Botón de agregar al carrito

### Formulario de Contacto
- Campos de nombre, email y mensaje
- Validación de datos
- Envío de mensajes

### Footer
- Enlaces a páginas importantes
- Información de contacto
- Redes sociales

## 📱 Estructura Responsiva

### Desktop (> 1024px)
- Diseño de varias columnas
- Navegación horizontal
- Imágenes de tamaño completo

### Tablet (768px - 1024px)
- Diseño semicolumnar
- Menú colapsable
- Ajuste de tamaños de fuente

### Móvil (< 768px)
- Diseño de una sola columna
- Menú tipo hamburguesa
- Botones táctiles optimizados

## 🎯 Tecnologías Frontend

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y animaciones
- **JavaScript**: Interactividad y dinamismo
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografía personalizada

## 🔄 Flujo de Usuario

1. **Inicio**: El usuario llega a la página principal
2. **Navegación**: Explora productos a través de la galería
3. **Selección**: Elige productos y los agrega al carrito
4. **Compra**: Procede al checkout
5. **Pedido**: Completa la información y envía la orden
6. **Confirmación**: Recibe confirmación del pedido

## 📈 Optimizaciones Implementadas

- **Carga rápida**: Optimización de imágenes y recursos
- **SEO**: Etiquetas meta y estructura semántica
- **Accesibilidad**: ARIA labels y navegación por teclado
- **Compatibilidad**: Soporte para navegadores modernos

---

*Última actualización: $(date +"%d de %B, %Y")*
*Este documento se mantiene actualizado con los cambios en la estructura del sitio web.*
EOF

echo "✅ Documentación de frontend actualizada"

# Actualizar STRUCTURE_IMPROVEMENTS.md
cat > STRUCTURE_IMPROVEMENTS.md << 'EOF'
# Mejoras de Estructura para Arreglos Victoria Florería

## Estructura Frontend Actualizada

```
frontend/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   └── js/
│       ├── main.js
│       ├── components/
│       ├── utils/
│       └── modules/
├── pages/
└── components/
```

## Estructura Backend Actualizada

```
backend/
├── server.js
├── package.json
├── routes/
│   ├── products.js
│   └── orders.js
├── controllers/
│   ├── productController.js
│   └── orderController.js
├── models/
│   ├── Product.js
│   └── Order.js
├── db/
│   └── database.js
├── middleware/
├── utils/
└── config/
```

## Beneficios de esta reestructuración

1. **Separación clara de responsabilidades**
2. **Código más mantenible**
3. **Mejor organización de archivos**
4. **Escalabilidad mejorada**
5. **Facilidad para trabajar en equipo**
EOF

echo "✅ Documentación de estructura general actualizada"

echo "🎉 Todas las documentaciones de estructura han sido actualizadas exitosamente"