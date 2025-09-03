# Flores Style Guide

## Overview

This document outlines the coding standards and best practices for the Flores e-commerce project. Consistent code style improves readability, maintainability, and collaboration.

## JavaScript Style Guide

### General Principles

1. Use modern ES6+ features when possible
2. Prefer functional programming patterns over imperative ones
3. Write self-documenting code with meaningful variable and function names
4. Keep functions small and focused on a single responsibility
5. Avoid global variables when possible

### Naming Conventions

- Use camelCase for variables and functions: `userName`, `calculateTotal`
- Use PascalCase for constructors and classes: `UserManager`, `ProductCard`
- Use UPPER_SNAKE_CASE for constants: `MAX_RETRY_ATTEMPTS`, `API_BASE_URL`
- Use descriptive names that explain the purpose of variables and functions

### Code Structure

#### Functions

```javascript
// Good
function calculateCartTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Avoid
function calc(items) {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    t += items[i].p * items[i].q;
  }
  return t;
}
```

#### Classes

```javascript
class ProductManager {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.cache = new Map();
  }

  async getProduct(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const product = await this.apiClient.fetchProduct(id);
      this.cache.set(id, product);
      return product;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }
}
```

#### Error Handling

```javascript
// Good
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Unable to retrieve user information');
  }
}

// Avoid
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`).then(r => r.json());
}
```

### Modules and Imports

- Use ES6 import/export syntax
- Group imports logically (external libraries, then internal modules)
- Use descriptive import names

```javascript
// Good
import { formatCurrency } from './utils/currency.js';
import { apiClient } from './services/api.js';
import ProductCard from './components/ProductCard.js';

// Avoid
import ProductCard, { formatCurrency, apiClient } from 'various-modules';
```

## CSS Style Guide

### Naming Conventions

- Use BEM (Block Element Modifier) methodology
- Use kebab-case for class names: `.product-card`, `.product-card__title`, `.product-card--featured`

```css
/* Good */
.product-card {
  padding: 1rem;
  border: 1px solid #ddd;
}

.product-card__title {
  font-size: 1.2rem;
  font-weight: bold;
}

.product-card--featured {
  border-color: #ff6b6b;
}

/* Avoid */
.productCard {
  padding: 1rem;
}

.product-card-title {
  font-size: 1.2rem;
}
```

### Organization

- Organize CSS properties alphabetically or by type (positioning, display, colors, typography, etc.)
- Use comments to separate sections
- Group related styles together

```css
/* Good */
.product-card {
  /* Positioning */
  position: relative;
  
  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  
  /* Colors */
  background-color: #fff;
  
  /* Typography */
  font-family: Arial, sans-serif;
}
```

### Responsive Design

- Use mobile-first approach with min-width media queries
- Use relative units (rem, em, %) instead of fixed pixels when possible
- Use CSS Grid and Flexbox for layouts

```css
/* Good */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
```

## HTML Style Guide

### Semantic Markup

- Use semantic HTML elements appropriately
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Use alt attributes for images
- Use proper form labels

```html
<!-- Good -->
<article class="product-card">
  <header class="product-card__header">
    <h2 class="product-card__title">Ramo de Rosas</h2>
  </header>
  <figure class="product-card__image">
    <img src="roses.jpg" alt="Ramo de rosas rojas frescas">
  </figure>
  <div class="product-card__details">
    <p class="product-card__description">Hermoso ramo de rosas rojas recién cortadas</p>
    <span class="product-card__price">$25.99</span>
  </div>
  <footer class="product-card__footer">
    <button class="button button--primary add-to-cart">Agregar al Carrito</button>
  </footer>
</article>
```

## Git Workflow

### Branch Naming

- Use descriptive branch names with prefixes:
  - `feature/` for new features
  - `bugfix/` for bug fixes
  - `hotfix/` for urgent fixes
  - `release/` for releases

Examples:
- `feature/product-filtering`
- `bugfix/cart-calculation-error`
- `hotfix/security-patch`
- `release/v2.3.0`

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
```
Add product filtering by category

Implement client-side filtering for products based on selected category.
This improves user experience by allowing quick product discovery.

Closes #123
```

## Testing

### Unit Tests

- Write tests for all business logic functions
- Use descriptive test names that explain the expected behavior
- Test edge cases and error conditions

```javascript
// Good
describe('calculateCartTotal', () => {
  test('should calculate total for multiple items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 15, quantity: 1 }
    ];
    expect(calculateCartTotal(items)).toBe(35);
  });

  test('should return 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});
```

### E2E Tests

- Test critical user flows (login, checkout, etc.)
- Test both happy paths and error scenarios
- Use realistic test data

## Performance

### JavaScript

- Minimize DOM manipulation
- Use event delegation for multiple elements
- Debounce or throttle expensive operations (scrolling, resizing)
- Lazy load non-critical resources

### CSS

- Minimize the use of expensive selectors (:nth-child, attribute selectors)
- Use transform and opacity for animations
- Avoid layout thrashing

### Images

- Use appropriate image formats (WebP when supported)
- Optimize images for web use
- Implement lazy loading for images below the fold

## Accessibility

- Use semantic HTML
- Provide sufficient color contrast
- Use ARIA attributes when necessary
- Ensure keyboard navigation works properly
- Add alt text to images
- Associate form labels with inputs

This style guide is a living document and should be updated as the project evolves. All team members should follow these guidelines to ensure consistency across the codebase.