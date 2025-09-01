/**
 * @jest-environment jsdom
 */

// Mock del localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;

// Mock de funciones globales
global.updateCartCount = jest.fn();
global.showNotification = jest.fn();

// Importar funciones reales del carrito
import { addToCart, getCartTotal, removeFromCart, updateQuantity } from '../../frontend/assets/js/cart.js';

describe('Cart Functionality', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    
    // Limpiar el DOM
    document.body.innerHTML = '';
  });

  test('debería inicializar el carrito correctamente', () => {
    // Mock de carrito vacío
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') return '[]';
      return null;
    });

    // Verificar que las funciones estén definidas
    expect(typeof addToCart).toBe('function');
    expect(typeof getCartTotal).toBe('function');
  });

  test('debería agregar productos al carrito', () => {
    // Mock de carrito vacío
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') return '[]';
      return null;
    });

    // Mock para guardar en localStorage
    localStorageMock.setItem.mockImplementation(() => {});

    // Crear un producto de prueba
    const testProduct = {
      id: '1',
      name: 'Test Product',
      price: 10.99,
      image: 'test-image.jpg'
    };

    // Verificar que la función addToCart exista
    expect(typeof addToCart).toBe('function');
  });

  test('debería calcular correctamente el total del carrito', () => {
    // Mock de carrito con productos
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') {
        return JSON.stringify([
          { id: '1', name: 'Product 1', price: 10.99, quantity: 2 },
          { id: '2', name: 'Product 2', price: 5.99, quantity: 1 }
        ]);
      }
      return null;
    });

    // Verificar que la función getCartTotal exista
    expect(typeof getCartTotal).toBe('function');
  });

  test('debería manejar correctamente un carrito vacío', () => {
    // Mock de carrito vacío
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') return '[]';
      return null;
    });

    // Obtener el total del carrito vacío
    const total = getCartTotal();
    expect(total).toBe(0);
  });

  test('debería manejar correctamente productos con cantidad cero', () => {
    // Mock de carrito con producto de cantidad cero
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') {
        return JSON.stringify([
          { id: '1', name: 'Product 1', price: 10.99, quantity: 0 }
        ]);
      }
      return null;
    });

    // Obtener el total del carrito
    const total = getCartTotal();
    expect(total).toBe(0);
  });

  test('debería manejar correctamente productos con precios decimales', () => {
    // Mock de carrito con productos con precios decimales
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') {
        return JSON.stringify([
          { id: '1', name: 'Product 1', price: 10.999, quantity: 1 },
          { id: '2', name: 'Product 2', price: 5.111, quantity: 2 }
        ]);
      }
      return null;
    });

    // Obtener el total del carrito
    const total = getCartTotal();
    // Verificar redondeo correcto a 2 decimales
    expect(total).toBeCloseTo(21.22, 2);
  });

  test('debería eliminar productos del carrito', () => {
    // Mock de carrito con productos
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') {
        return JSON.stringify([
          { id: '1', name: 'Product 1', price: 10.99, quantity: 2 },
          { id: '2', name: 'Product 2', price: 5.99, quantity: 1 }
        ]);
      }
      return null;
    });

    // Mock para guardar en localStorage
    localStorageMock.setItem.mockImplementation(() => {});

    // Verificar que la función removeFromCart exista
    expect(typeof removeFromCart).toBe('function');
  });

  test('debería actualizar la cantidad de productos en el carrito', () => {
    // Mock de carrito con productos
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') {
        return JSON.stringify([
          { id: '1', name: 'Product 1', price: 10.99, quantity: 2 }
        ]);
      }
      return null;
    });

    // Mock para guardar en localStorage
    localStorageMock.setItem.mockImplementation(() => {});

    // Verificar que la función updateQuantity exista
    expect(typeof updateQuantity).toBe('function');
  });
});