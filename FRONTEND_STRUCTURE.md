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
   - Galería de arreglos florales populares con imágenes únicas
   - Precios y descripciones breves

4. **Sobre Nosotros**
   - Historia de la florería
   - Valores y compromisos

5. **Galería de Flores**
   - **Colección visual de flores y arreglos florales**
   - **Imágenes de alta calidad de diferentes tipos de flores**
   - **Diseño de cuadrícula responsiva**
   - **Efectos hover para interacción mejorada**

6. **Contacto**
   - Información de contacto
   - **Botón de llamada directa**
   - **Botón de WhatsApp**
   - **Redes sociales unificadas**
   - **Mapa de Google Maps con ubicación**
   - Formulario de pedido mejorado con validación

7. **Pie de Página (Footer)**
   - Enlaces importantes
   - Información de contacto
   - Dirección física: Av. Valdivieso 593, 8441510 Recoleta, Región Metropolitana
   - Derechos reservados

## 🎨 Componentes Reutilizables

### Header
- Navegación responsiva
- Carrito de compras con contador
- Menú desplegable en móviles

### Product Cards
- Imagen del producto (única para cada producto)
- Nombre y precio
- Botón de agregar al carrito

### Formulario de Contacto
- **Campos mejorados con identificadores únicos**
- **Validación de datos en el frontend**
- **Estilo consistente con el diseño general**
- **Campos requeridos claramente marcados**
- **Feedback visual al usuario**
- Envío de mensajes

### Botón de Llamada
- **Diseño consistente con otros botones del sitio**
- **Icono de teléfono para mejor reconocimiento**
- **Funcionalidad de marcado directo**
- **Responsive y accesible**

### Botón de WhatsApp
- **Diseño con colores reconocibles de WhatsApp**
- **Icono distintivo de WhatsApp**
- **Enlace directo al chat de WhatsApp**
- **Abre en nueva pestaña**

### Mapa de Google Maps
- **Ubicación exacta en Av. Valdivieso 593, Recoleta**
- **Vista satelital e interactiva**
- **Integración responsiva**
- **Carga optimizada con lazy loading**

### Galería de Flores
- **Cuadrícula responsiva con imágenes de alta calidad**
- **Efectos hover para interacción mejorada**
- **Diseño consistente con el tema del sitio**
- **Imágenes optimizadas para carga rápida**
- **Seis imágenes representativas de diferentes tipos de flores**

### Redes Sociales
- **Sección con íconos de redes sociales**
- **Enlaces unificados a perfiles sociales reales**
- **Facebook: https://www.facebook.com/profile.php?id=61578999845743**
- **Instagram: https://www.instagram.com/arreglosvictoria/**
- **Botón de WhatsApp directo al número**
- **Efectos hover para mejor interacción**

### Footer
- Enlaces a páginas importantes
- Información de contacto
- Dirección física: Av. Valdivieso 593, 8441510 Recoleta, Región Metropolitana
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
- **Google Maps**: Integración de mapas interactivos

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
- **Formulario mejorado**: Validación en tiempo real, estilo consistente y feedback al usuario
- **Botón de llamada**: Acceso directo para contactar por teléfono
- **Botón de WhatsApp**: Comunicación directa mediante WhatsApp
- **Redes sociales unificadas**: Todos los enlaces apuntan a tus perfiles reales
- **Dirección física actualizada**: Av. Valdivieso 593, 8441510 Recoleta, Región Metropolitana
- **Mapa interactivo**: Google Maps integrado para facilitar la localización
- **Galería visual**: Colección de imágenes de flores para embellecer el sitio
- **Imágenes únicas**: Todas las imágenes del sitio son ahora únicas y representativas

---

*Última actualización: Agosto 5, 2024*
*Este documento se mantiene actualizado con los cambios en la estructura del sitio web.*