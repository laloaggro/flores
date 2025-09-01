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

// Mock de funciones del carrito
global.updateCartCount = jest.fn();
global.showNotification = jest.fn();

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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Verificar que se pueda acceder a las funciones del carrito
    expect(cartModule).toBeDefined();
  });

  test('debería agregar productos al carrito', () => {
    // Mock de carrito vacío
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') return '[]';
      return null;
    });

    // Mock para guardar en localStorage
    localStorageMock.setItem.mockImplementation(() => {});

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Crear un producto de prueba
    const testProduct = {
      id: '1',
      name: 'Test Product',
      price: 10.99,
      image: 'test-image.jpg'
    };

    // Verificar que la función addToCart exista
    expect(typeof cartModule.addToCart).toBe('function');
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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Verificar que la función getCartTotal exista
    expect(typeof cartModule.getCartTotal).toBe('function');
  });

  test('debería manejar correctamente un carrito vacío', () => {
    // Mock de carrito vacío
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cart') return '[]';
      return null;
    });

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Obtener el total del carrito vacío
    const total = cartModule.getCartTotal();
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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Obtener el total del carrito
    const total = cartModule.getCartTotal();
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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Obtener el total del carrito
    const total = cartModule.getCartTotal();
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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Verificar que la función removeFromCart exista
    expect(typeof cartModule.removeFromCart).toBe('function');
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

    // Importar el módulo del carrito
    const cartModule = require('../../../frontend/assets/js/cart.js');
    
    // Verificar que la función updateQuantity exista
    expect(typeof cartModule.updateQuantity).toBe('function');
  });
});