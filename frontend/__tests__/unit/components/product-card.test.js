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
});