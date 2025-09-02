# Sistema de Temas (Modo Claro y Oscuro)

## Descripción General

El sitio web de Arreglos Victoria utiliza un sistema de temas que permite alternar entre modo claro y modo oscuro. Este sistema está basado en CSS personalizado y JavaScript para la gestión del estado del tema.

## Archivos Involucrados

1. **CSS**:
   - `frontend/assets/css/consistent-theme.css` - Archivo principal de temas
   - `frontend/assets/css/theme.css` - Archivo de temas heredado (obsoleto)

2. **JavaScript**:
   - `frontend/assets/js/theme.js` - Manejo del cambio entre temas

3. **HTML**:
   - Todos los archivos HTML que incluyen el botón de cambio de tema

## Funcionamiento del Sistema

### 1. Variables CSS

El sistema utiliza variables CSS para definir los colores y estilos de ambos modos:

#### Modo Claro
```css
:root {
  --bg-color: #ffffff;           /* Fondo principal */
  --text-color: #212121;         /* Texto principal */
  --primary: #388e3c;            /* Verde principal */
  --heading-color: #188e44;      /* Color de encabezados */
}
```

#### Modo Oscuro
```css
[data-theme="dark"] {
  --bg-color: #0f172a;           /* Fondo principal */
  --text-color: #f1f5f9;         /* Texto principal */
  --primary: #4ade80;            /* Verde principal */
  --heading-color: #4ade80;      /* Color de encabezados */
}
```

### 2. Cambio de Tema

El cambio entre temas se maneja mediante JavaScript:

1. **Detección de Preferencia**: El sistema verifica si el usuario ya ha seleccionado un tema previamente guardado en `localStorage`.

2. **Aplicación del Tema**: Se aplica el tema seleccionado añadiendo el atributo `data-theme` al elemento `body`:
   ```html
   <body data-theme="light"> <!-- Modo claro -->
   <body data-theme="dark">  <!-- Modo oscuro -->
   ```

3. **Guardado de Preferencia**: La preferencia del usuario se guarda en `localStorage` para mantenerla entre sesiones.

4. **Actualización de UI**: El ícono del botón de cambio de tema se actualiza para reflejar el tema actual.

### 3. Botón de Cambio de Tema

El botón de cambio de tema se encuentra en el encabezado del sitio:

```html
<button id="theme-toggle" class="theme-toggle" aria-label="Cambiar a modo oscuro">
  <i class="fas fa-moon"></i>
</button>
```

## Personalización de Colores

### Modo Claro
- **Fondo**: Blanco (#ffffff)
- **Texto**: Gris muy oscuro (#212121)
- **Encabezados**: Verde (#188e44)
- **Elementos principales**: Verde medio (#388e3c)

### Modo Oscuro
- **Fondo**: Azul muy oscuro (#0f172a)
- **Texto**: Gris muy claro (#f1f5f9)
- **Encabezados**: Verde claro (#4ade80)
- **Elementos principales**: Verde claro (#4ade80)

## Implementación Técnica

### Cambio Manual de Tema
Para cambiar el tema manualmente en código JavaScript:
```javascript
// Cambiar a modo oscuro
document.body.setAttribute('data-theme', 'dark');

// Cambiar a modo claro
document.body.setAttribute('data-theme', 'light');
```

### Verificación del Tema Actual
```javascript
const currentTheme = document.body.getAttribute('data-theme');
```

## Patrones de Diseño

### 1. Variables Semánticas
Las variables CSS están organizadas en categorías semánticas:
- `--bg-color`: Color de fondo principal
- `--text-color`: Color de texto principal
- `--primary`: Color principal de marca
- `--border-color`: Color de bordes

### 2. Transiciones Suaves
Todos los cambios de color incluyen transiciones CSS para una experiencia visual suave:
```css
transition: background-color 0.3s cubic-bezier(0.4, 0.2, 0.2, 1), 
            color 0.3s cubic-bezier(0.4, 0.2, 0.2, 1);
```

## Accesibilidad

### 1. Contraste Adecuado
Ambos temas cumplen con los estándares WCAG para contraste de colores:
- Modo claro: Contraste alto entre texto y fondo
- Modo oscuro: Contraste adecuado para lectura prolongada

### 2. Etiquetas ARIA
El botón de cambio de tema incluye atributos ARIA para accesibilidad:
```html
aria-label="Cambiar a modo oscuro"
```

## Persistencia

La preferencia de tema del usuario se almacena en `localStorage`:
```javascript
// Guardar preferencia
localStorage.setItem('theme', 'dark');

// Recuperar preferencia
const savedTheme = localStorage.getItem('theme');
```

## Personalización

Para personalizar los colores del tema:

1. **Modificar `consistent-theme.css`**:
   - Cambiar valores de variables CSS en las secciones `:root` (modo claro) y `[data-theme="dark"]` (modo oscuro)

2. **Actualizar colores de encabezados**:
   - Modificar `--heading-color` en ambos temas

3. **Añadir nuevos colores**:
   - Definir nuevas variables CSS en ambas secciones de tema

## Problemas Comunes

### 1. Tema no se aplica
Verificar que:
- El atributo `data-theme` se aplique correctamente al elemento `body`
- Las variables CSS estén definidas en ambos temas
- No haya conflictos con otros archivos CSS

### 2. Transiciones no suaves
Asegurar que:
- Las propiedades que cambian tengan transiciones definidas
- Los selectores CSS sean específicos suficientes

### 3. Preferencias no se guardan
Verificar que:
- `localStorage` esté disponible en el navegador
- El código JavaScript se ejecute correctamente