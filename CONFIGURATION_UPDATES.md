# Actualizaciones de Configuración

Este documento describe las nuevas configuraciones añadidas al proyecto para mejorar la calidad del código, pruebas y proceso de desarrollo.

## Configuraciones de Pruebas

### Jest (Unit & Integration Tests)
- Ubicación: [jest.config.js](file:///home/laloaggro/Proyectos/flores-1/jest.config.js)
- Configuración para pruebas unitarias e integración
- Incluye setup de mocks para DOM y APIs globales
- Configuración de cobertura de código

### Cypress (E2E Tests)
- Ubicación: [cypress.config.js](file:///home/laloaggro/Proyectos/flores-1/cypress.config.js)
- Configuración básica para pruebas end-to-end
- URL base configurada a `http://localhost:5000`

## Configuraciones de Calidad de Código

### ESLint
- Ubicación: [.eslintrc.json](file:///home/laloaggro/Proyectos/flores-1/.eslintrc.json)
- Reglas para JavaScript/ES6
- Configuración para entornos browser, node y es2021
- Patrones ignorados (vendor libraries, node_modules, etc.)

### Stylelint
- Ubicación: [.stylelintrc.json](file:///home/laloaggro/Proyectos/flores-1/.stylelintrc.json)
- Configuración extendida de `stylelint-config-standard`
- Reglas específicas para CSS (indentación, comillas, selectores, etc.)

### Prettier
- Ubicación: [.prettierrc](file:///home/laloaggro/Proyectos/flores-1/.prettierrc)
- Configuración de formateo automático de código
- Consistencia en el estilo de código entre desarrolladores

## Configuración de Integración Continua

### GitHub Actions
- Ubicación: [.github/workflows/ci.yml](file:///home/laloaggro/Proyectos/flores-1/.github/workflows/ci.yml)
- Workflow que ejecuta en ramas `main` y `improvements-deployment`
- Pruebas en múltiples versiones de Node.js (16.x y 18.x)
- Jobs separados para pruebas y construcción
- Almacenamiento de artefactos de construcción

## Comandos Nuevos en package.json

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest frontend/__tests__/unit/*.test.js",
    "test:integration": "jest frontend/__tests__/integration/*.test.js",
    "test:e2e": "cypress run",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint:css": "stylelint frontend/assets/css/**/*.css",
    "lint:js": "eslint frontend/assets/js/**/*.js frontend/components/**/*.js"
  }
}
```

## Estructura de Directorios para Pruebas

```
frontend/
├── __tests__/
│   ├── setupTests.js
│   ├── unit/
│   │   ├── header.test.js
│   │   ├── cart.test.js
│   │   └── auth.test.js
│   └── integration/
│       └── checkout-flow.test.js
cypress/
├── e2e/
│   ├── navigation.cy.js
│   └── cart-flow.cy.js
└── fixtures/
```

## Instrucciones de Uso

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar pruebas unitarias:
```bash
npm run test:unit
```

### Ejecutar pruebas de integración:
```bash
npm run test:integration
```

### Ejecutar pruebas E2E:
```bash
npm run test:e2e
```

### Ejecutar linters:
```bash
# Para JavaScript
npm run lint:js

# Para CSS
npm run lint:css
```

### Generar reporte de cobertura:
```bash
npm run test:coverage
```

## Beneficios de las Nuevas Configuraciones

1. **Mejor calidad de código**: Linting automático ayuda a mantener un estilo de código consistente
2. **Detección temprana de errores**: Pruebas automatizadas en múltiples niveles
3. **Integración continua**: Validación automática en cada push/PR
4. **Formateo consistente**: Prettier asegura que todo el código tenga el mismo estilo
5. **Cobertura de pruebas**: Medición de cuánto código está cubierto por pruebas