import Products from '../../../frontend/components/product/Products.js';
import { products } from '../../fixtures/products.js';

// Mock the ProductCard class
jest.mock('../../../frontend/components/product/ProductCard.js', () => {
  return jest.fn().mockImplementation((product) => {
    return {
      render: () => {
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="product-card" data-product-id="${product.id}">
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <button class="add-to-cart">Agregar al Carrito</button>
          </div>
        `;
        return div;
      }
    };
  });
});

describe('Products', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render all products', () => {
    const productsComponent = new Products(products);
    const element = productsComponent.render();
    
    const productCards = element.querySelectorAll('.product-card');
    expect(productCards.length).toBe(products.length);
    
    products.forEach((product, index) => {
      expect(productCards[index].dataset.productId).toBe(product.id.toString());
    });
  });

  test('should render empty state when no products', () => {
    const productsComponent = new Products([]);
    const element = productsComponent.render();
    
    const productCards = element.querySelectorAll('.product-card');
    expect(productCards.length).toBe(0);
    
    const emptyMessage = element.querySelector('.no-products-message');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toBe('No hay productos disponibles en este momento.');
  });

  test('should have correct class name', () => {
    const productsComponent = new Products(products);
    const element = productsComponent.render();
    
    expect(element.className).toBe('products-container');
  });

  test('should handle large number of products', () => {
    // Create a large array of products
    const manyProducts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: (i + 1) * 10,
      image: `/frontend/assets/images/placeholder-${i + 1}.svg`,
      description: `Description for product ${i + 1}`
    }));
    
    const productsComponent = new Products(manyProducts);
    const element = productsComponent.render();
    
    const productCards = element.querySelectorAll('.product-card');
    expect(productCards.length).toBe(manyProducts.length);
  });

  test('should handle products with special characters', () => {
    const productsWithSpecialChars = [
      {
        id: 1,
        name: 'Ramo de Rosas & Tulipanes',
        price: 32.99,
        image: '/frontend/assets/images/placeholder.svg',
        description: 'Hermoso ramo de rosas rojas & tulipanes blancos'
      }
    ];
    
    const productsComponent = new Products(productsWithSpecialChars);
    const element = productsComponent.render();
    
    const productCards = element.querySelectorAll('.product-card');
    expect(productCards.length).toBe(1);
    expect(productCards[0].dataset.productId).toBe('1');
  });
});