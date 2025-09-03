/**
 * stateManager.js - Sistema de estado global para la aplicación
 * 
 * Este módulo proporciona un sistema de estado global simple que permite
 * a los componentes compartir y reaccionar a cambios en el estado de la aplicación.
 */

class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = {};
  }

  /**
   * Obtener el valor de una propiedad del estado
   * @param {string} key - Clave de la propiedad
   * @returns {*} Valor de la propiedad
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Establecer el valor de una propiedad del estado
   * @param {string} key - Clave de la propiedad
   * @param {*} value - Valor de la propiedad
   */
  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  /**
   * Actualizar múltiples propiedades del estado
   * @param {Object} newState - Objeto con las nuevas propiedades
   */
  update(newState) {
    Object.keys(newState).forEach(key => {
      this.state[key] = newState[key];
      this.notify(key, newState[key]);
    });
  }

  /**
   * Suscribirse a cambios en una propiedad del estado
   * @param {string} key - Clave de la propiedad
   * @param {Function} callback - Función a ejecutar cuando cambie la propiedad
   * @returns {Function} Función para cancelar la suscripción
   */
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    
    this.listeners[key].push(callback);
    
    // Retornar función para cancelar la suscripción
    return () => {
      const index = this.listeners[key].indexOf(callback);
      if (index > -1) {
        this.listeners[key].splice(index, 1);
      }
    };
  }

  /**
   * Notificar a los suscriptores de un cambio en una propiedad
   * @param {string} key - Clave de la propiedad
   * @param {*} value - Nuevo valor de la propiedad
   */
  notify(key, value) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Error en callback de estado:', error);
        }
      });
    }
  }

  /**
   * Obtener una copia del estado actual
   * @returns {Object} Copia del estado actual
   */
  getState() {
    return { ...this.state };
  }
}

// Crear una instancia global del StateManager
const stateManager = new StateManager({
  user: null,
  cart: [],
  wishlist: [],
  theme: 'light',
  notifications: []
});

// Exportar la instancia y la clase
export { StateManager, stateManager };
export default stateManager;