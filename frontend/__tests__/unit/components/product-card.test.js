import ProductCard from '../../../frontend/components/product/ProductCard.js';
import { products } from '../../fixtures/products.js';

describe('ProductCard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render product information correctly', () => {
    const product = products[0];
    const productCard = new ProductCard(product);
    const element = productCard.render();
    
    expect(element.querySelector('h3').textContent).toBe(product.name);
    expect(element.querySelector('.product-price').textContent).toBe(`$${product.price}`);
    expect(element.querySelector('img').src).toContain(product.image);
    expect(element.querySelector('p').textContent).toBe(product.description);
  });

  test('should call addToCart when add to cart button is clicked', () => {
    const product = products[0];
    const mockAddToCart = jest.fn();
    
    // Mock the global addToCart function
    global.addToCart = mockAddToCart;
    
    const productCard = new ProductCard(product);
    const element = productCard.render();
    
    const addToCartButton = element.querySelector('.add-to-cart');
    addToCartButton.click();
    
    expect(mockAddToCart).toHaveBeenCalledWith(product.id);
  });

  test('should have correct product ID in data attributes', () => {
    const product = products[0];
    const productCard = new ProductCard(product);
    const element = productCard.render();
    
    expect(element.dataset.productId).toBe(product.id.toString());
  });

  test('should render product with special characters in name and description', () => {
    const productWithSpecialChars = {
      id: 4,
      name: 'Ramo de Rosas & Tulipanes',
      price: 32.99,
      image: '/frontend/assets/images/placeholder.svg',
      description: 'Hermoso ramo de rosas rojas & tulipanes blancos'
    };
    
    const productCard = new ProductCard(productWithSpecialChars);
    const element = productCard.render();
    
    expect(element.querySelector('h3').textContent).toBe(productWithSpecialChars.name);
    expect(element.querySelector('p').textContent).toBe(productWithSpecialChars.description);
  });

  test('should handle product with zero price', () => {
    const freeProduct = {
      id: 5,
      name: 'Muestra Gratuita',
      price: 0,
      image: '/frontend/assets/images/placeholder.svg',
      description: 'Muestra gratuita de nuestro trabajo'
    };
    
    const productCard = new ProductCard(freeProduct);
    const element = productCard.render();
    
    expect(element.querySelector('.product-price').textContent).toBe('$0');
  });
});