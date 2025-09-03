// Configuración para las pruebas

// Mock de customElements
global.customElements = {
  define: jest.fn(),
  get: jest.fn(() => class MockElement extends HTMLElement {})
};

// Mock de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true
  })
);

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;

// Mock de DOM
document.createElement = jest.fn((tagName) => {
  return {
    tagName: tagName.toUpperCase(),
    innerHTML: '',
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn()
    },
    addEventListener: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    querySelector: jest.fn(() => ({
      addEventListener: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
    })),
    querySelectorAll: jest.fn(() => [])
  };
});