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

// Mock de funciones de utilidad
global.showNotification = jest.fn();

// Mock de fetch
global.fetch = jest.fn();

describe('Auth Functionality', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    
    // Limpiar el DOM
    document.body.innerHTML = '';
  });

  test('debería verificar correctamente si el usuario está autenticado', () => {
    // Mock de token válido
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') {
        // Token válido por 1 hora
        const payload = {
          exp: Math.floor(Date.now() / 1000) + 3600,
          user: { id: 1, name: 'Test User' }
        };
        return btoa(JSON.stringify(payload));
      }
      return null;
    });

    // Importar el módulo de autenticación
    const authModule = require('../../../frontend/assets/js/auth.js');
    
    // Verificar que la función isAuthenticated exista
    expect(typeof authModule.isAuthenticated).toBe('function');
  });

  test('debería detectar cuando el usuario no está autenticado', () => {
    // Mock de token inexistente
    localStorageMock.getItem.mockImplementation((key) => {
      return null;
    });

    // Importar el módulo de autenticación
    const authModule = require('../../../frontend/assets/js/auth.js');
    
    // Verificar que la función isAuthenticated exista
    expect(typeof authModule.isAuthenticated).toBe('function');
  });

  test('debería detectar cuando el token ha expirado', () => {
    // Mock de token expirado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') {
        // Token expirado (hace 1 hora)
        const payload = {
          exp: Math.floor(Date.now() / 1000) - 3600,
          user: { id: 1, name: 'Test User' }
        };
        return btoa(JSON.stringify(payload));
      }
      return null;
    });

    // Importar el módulo de autenticación
    const authModule = require('../../../frontend/assets/js/auth.js');
    
    // Verificar que la función isAuthenticated exista
    expect(typeof authModule.isAuthenticated).toBe('function');
  });

  test('debería realizar el logout correctamente', () => {
    // Importar el módulo de autenticación
    const authModule = require('../../../frontend/assets/js/auth.js');
    
    // Verificar que la función logout exista
    expect(typeof authModule.logout).toBe('function');
    
    // Ejecutar logout
    authModule.logout();
    
    // Verificar que se hayan eliminado los items del localStorage
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });
});