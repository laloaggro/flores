# Implementación de Internacionalización (i18n)

## Introducción

Este documento describe cómo implementar internacionalización (i18n) en la aplicación web de Arreglos Victoria para soportar múltiples idiomas.

## Beneficios de la Internacionalización

1. **Alcance global**: Acceder a mercados internacionales
2. **Mejor experiencia del usuario**: Contenido en el idioma preferido del usuario
3. **Cumplimiento legal**: Requisitos en ciertos mercados
4. **Ventaja competitiva**: Diferenciación frente a competidores locales

## Opciones de Implementación

### Opción 1: react-i18next (Recomendada)

react-i18next es una biblioteca popular para internacionalización en aplicaciones React.

#### Ventajas:
- Ampliamente utilizada y bien mantenida
- Soporte para carga diferida de traducciones
- Integración con herramientas de traducción
- Soporte para plurales, contextos y formatos

#### Configuración básica:

```javascript
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de traducción
const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido",
      "products": "Productos",
      "contact": "Contacto"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "products": "Products",
      "contact": "Contact"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Opción 2: Implementación personalizada

Crear un sistema de internacionalización personalizado.

#### Ventajas:
- Control total sobre la implementación
- Menos dependencias
- Personalización completa

#### Desventajas:
- Más trabajo de desarrollo
- Necesidad de implementar funcionalidades manualmente

## Plan de Implementación

### Fase 1: Configuración del sistema

1. **Instalar dependencias**:
   ```bash
   npm install i18next react-i18next
   ```

2. **Crear estructura de directorios**:
   ```
   src/
   └── locales/
       ├── es/
       │   ├── common.json
       │   ├── products.json
       │   └── checkout.json
       └── en/
           ├── common.json
           ├── products.json
           └── checkout.json
   ```

3. **Configurar i18n**:
   - Crear archivo de configuración
   - Implementar detección de idioma
   - Configurar fallback de idioma

### Fase 2: Crear recursos de traducción

1. **Identificar contenido traducible**:
   - Textos en componentes
   - Mensajes de error
   - Etiquetas de formularios
   - Contenido de páginas

2. **Crear archivos de traducción**:
   - common.json (textos comunes)
   - products.json (textos relacionados con productos)
   - checkout.json (textos del proceso de compra)

### Fase 3: Implementar en componentes

1. **Modificar componentes existentes**:
   - Reemplazar textos estáticos con funciones de traducción
   - Manejar plurales y contextos
   - Implementar cambio de idioma

2. **Crear componente de selector de idioma**:
   - Interfaz para cambiar entre idiomas
   - Persistencia de preferencia de idioma

### Fase 4: Optimización

1. **Implementar carga diferida**:
   - Cargar solo las traducciones necesarias
   - Implementar preloading estratégico

2. **Configurar herramientas de traducción**:
   - Integrar con servicios de traducción
   - Configurar flujos de trabajo de actualización

## Ejemplo de implementación

```jsx
// src/components/Header.js
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation('common');
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">{t('home')}</a></li>
          <li><a href="/products">{t('products')}</a></li>
          <li><a href="/contact">{t('contact')}</a></li>
        </ul>
      </nav>
      
      <div className="language-selector">
        <button onClick={() => changeLanguage('es')}>ES</button>
        <button onClick={() => changeLanguage('en')}>EN</button>
      </div>
    </header>
  );
}
```

```json
// src/locales/es/common.json
{
  "home": "Inicio",
  "products": "Productos",
  "contact": "Contacto",
  "welcome_message": "Bienvenido a Arreglos Victoria",
  "cart": "Carrito ({{count}} artículo)",
  "cart_plural": "Carrito ({{count}} artículos)"
}
```

```json
// src/locales/en/common.json
{
  "home": "Home",
  "products": "Products",
  "contact": "Contact",
  "welcome_message": "Welcome to Arreglos Victoria",
  "cart": "Cart ({{count}} item)",
  "cart_plural": "Cart ({{count}} items)"
}
```

## Consideraciones importantes

1. **Detección de idioma**:
   - Detectar idioma del navegador
   - Permitir selección manual
   - Persistir preferencia en localStorage

2. **Formatos**:
   - Fechas y horas
   - Números y monedas
   - Dirección del texto (RTL para idiomas como árabe)

3. **SEO**:
   - Implementar hreflang tags
   - Crear sitemaps por idioma
   - Configurar rutas por idioma

4. **Accesibilidad**:
   - Atributos lang en etiquetas HTML
   - Anuncios de cambio de idioma

5. **Rendimiento**:
   - Carga diferida de recursos de traducción
   - Cache de traducciones

## Idiomas iniciales recomendados

1. **Español (es)** - Idioma principal actual
2. **Inglés (en)** - Idioma internacional
3. **Portugués (pt)** - Para mercados de Brasil y otros países lusófonos

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 1 semana | Configuración del sistema |
| Fase 2 | 2-3 semanas | Creación de recursos de traducción |
| Fase 3 | 2 semanas | Implementación en componentes |
| Fase 4 | 1 semana | Optimización y pruebas |
| **Total** | **5-7 semanas** | **Tiempo estimado completo** |

## Recursos

1. [Documentación oficial de i18next](https://www.i18next.com/)
2. [Documentación de react-i18next](https://react.i18next.com/)
3. [Guía de migración a React](./migration-to-react.md)
4. [MDN Web Docs - Internacionalización](https://developer.mozilla.org/es/docs/Mozilla/Add-ons/WebExtensions/Internationalization)