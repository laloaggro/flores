# Implementación de Server-Side Rendering (SSR)

## Introducción

Este documento describe cómo implementar Server-Side Rendering (SSR) en la aplicación web de Arreglos Victoria para mejorar el SEO y el rendimiento inicial.

## Beneficios del SSR

1. **Mejor SEO**: Los motores de búsqueda pueden indexar mejor el contenido
2. **Carga inicial más rápida**: El contenido se muestra antes de que se cargue JavaScript
3. **Mejor experiencia del usuario**: Contenido visible más rápido
4. **Compatibilidad con navegadores antiguos**: Funciona incluso si JavaScript está deshabilitado

## Opciones de Implementación

### Opción 1: Next.js (Recomendada)

Next.js es un framework de React que facilita la implementación de SSR.

#### Ventajas:
- Configuración mínima requerida
- Soporte integrado para SSR, SSG y ISR
- Optimización automática
- Sistema de rutas basado en archivos

#### Estructura del proyecto con Next.js:

```
src/
├── pages/                  # Páginas de la aplicación
│   ├── api/                # API routes
│   ├── _app.js             # Componente personalizado de la aplicación
│   ├── _document.js        # Documento HTML personalizado
│   ├── index.js            # Página de inicio
│   ├── products.js         # Página de productos
│   └── product/[id].js     # Página de detalle de producto
├── components/             # Componentes reutilizables
├── styles/                 # Estilos globales y módulos CSS
├── public/                 # Archivos estáticos
└── lib/                    # Funciones auxiliares
```

### Opción 2: Implementación personalizada con Node.js

Crear una implementación personalizada de SSR usando Express y un motor de plantillas.

#### Ventajas:
- Mayor control sobre la implementación
- Menos dependencias de frameworks
- Personalización completa

#### Desventajas:
- Más trabajo de configuración
- Necesidad de implementar funcionalidades manualmente

## Plan de Implementación

### Fase 1: Configuración del entorno

1. **Instalar dependencias**:
   ```bash
   npm install next react react-dom
   ```

2. **Actualizar package.json**:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```

3. **Crear estructura de directorios**:
   - Crear directorio `src/pages`
   - Migrar páginas existentes
   - Crear directorio `src/components`

### Fase 2: Migración de componentes

1. **Convertir componentes a React**:
   - Header
   - Footer
   - ProductCard
   - CartItem

2. **Crear páginas SSR**:
   - Página de inicio
   - Catálogo de productos
   - Detalle de producto
   - Carrito de compras

### Fase 3: Integración con backend

1. **Implementar llamadas a la API**:
   - Obtener datos en el servidor
   - Manejar errores apropiadamente
   - Implementar fallbacks

2. **Configurar rutas de API**:
   - Migrar rutas existentes a Next.js API routes

### Fase 4: Optimización

1. **Implementar optimizaciones**:
   - Code splitting
   - Image optimization
   - Font optimization

2. **Configurar despliegue**:
   - Configurar Vercel o servidor Node.js
   - Implementar CI/CD

## Ejemplo de implementación de página SSR

```jsx
// src/pages/index.js
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../lib/api';

// Esta función se ejecuta en el servidor
export async function getServerSideProps(context) {
  try {
    const products = await getFeaturedProducts();
    
    return {
      props: {
        products,
        initialTheme: 'light'
      }
    };
  } catch (error) {
    return {
      props: {
        products: [],
        initialTheme: 'light',
        error: 'Failed to load products'
      }
    };
  }
}

export default function Home({ products, initialTheme, error }) {
  useEffect(() => {
    // Código que solo se ejecuta en el cliente
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, [initialTheme]);

  return (
    <>
      <Header />
      
      <main>
        <section className="hero">
          <div className="container">
            <h1>Arreglos Victoria</h1>
            <p>La mejor florería de Recoleta</p>
          </div>
        </section>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <section className="featured-products">
          <div className="container">
            <h2>Productos Destacados</h2>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
```

## Consideraciones importantes

1. **Estado de la aplicación**:
   - Migrar el sistema de estado global a React Context o Redux
   - Implementar hidratación del estado del servidor al cliente

2. **SEO**:
   - Implementar meta tags dinámicos
   - Configurar sitemap.xml
   - Implementar structured data

3. **Rendimiento**:
   - Implementar carga diferida de componentes no críticos
   - Optimizar imágenes con next/image
   - Configurar preloading y prefetching

4. **Accesibilidad**:
   - Mantener atributos ARIA
   - Asegurar navegación por teclado
   - Implementar skip links

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 1-2 semanas | Configuración del entorno |
| Fase 2 | 2-3 semanas | Migración de componentes |
| Fase 3 | 1-2 semanas | Integración con backend |
| Fase 4 | 1-2 semanas | Optimización y pruebas |
| **Total** | **5-9 semanas** | **Tiempo estimado completo** |

## Recursos

1. [Documentación oficial de Next.js](https://nextjs.org/docs)
2. [Guía de migración de React](./migration-to-react.md)
3. [Documentación de React](https://reactjs.org/)