/**
 * FormValidator.js - Componente para validación de formularios
 * 
 * Este componente implementa una validación robusta de formularios
 * con mensajes de error visuales y mejoras de accesibilidad.
 */

class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.rules = {};
    this.messages = {};
    this.errors = {};
    
    this.init();
  }

  /**
   * Inicializar el validador de formularios
   */
  init() {
    if (!this.form) {
      console.error('No se proporcionó un formulario válido');
      return;
    }
    
    // Añadir atributos ARIA para accesibilidad
    this.form.setAttribute('novalidate', 'true');
    
    // Adjuntar eventos de validación
    this.attachEvents();
  }

  /**
   * Adjuntar eventos de validación
   */
  attachEvents() {
    // Validar campos individuales al perder el foco
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input.name);
      });
      
      input.addEventListener('input', () => {
        // Limpiar errores al escribir
        if (this.errors[input.name]) {
          this.clearFieldError(input.name);
        }
      });
    });
    
    // Validar todo el formulario al enviar
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  /**
   * Añadir una regla de validación
   * @param {string} fieldName - Nombre del campo
   * @param {string} rule - Regla de validación
   * @param {string} message - Mensaje de error
   */
  addRule(fieldName, rule, message) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    
    this.rules[fieldName].push({
      rule,
      message
    });
  }

  /**
   * Validar un campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean} True si el campo es válido, false en caso contrario
   */
  validateField(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return true;
    
    const rules = this.rules[fieldName];
    if (!rules) return true;
    
    const value = field.value.trim();
    
    for (const ruleObj of rules) {
      const { rule, message } = ruleObj;
      
      // Validar según la regla
      if (!this.validateRule(value, rule, field)) {
        this.showFieldError(fieldName, message);
        return false;
      }
    }
    
    // Si pasó todas las validaciones, limpiar errores
    this.clearFieldError(fieldName);
    return true;
  }

  /**
   * Validar una regla específica
   * @param {string} value - Valor del campo
   * @param {string} rule - Regla de validación
   * @param {HTMLElement} field - Elemento del campo
   * @returns {boolean} True si pasa la validación, false en caso contrario
   */
  validateRule(value, rule, field) {
    switch (rule) {
      case 'required':
        return value !== '';
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
        
      case 'minLength':
        const minLength = parseInt(field.getAttribute('data-min-length') || '0');
        return value.length >= minLength;
        
      case 'maxLength':
        const maxLength = parseInt(field.getAttribute('data-max-length') || '9999');
        return value.length <= maxLength;
        
      case 'password':
        // Al menos 8 caracteres, una mayúscula, una minúscula y un número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(value);
        
      case 'phone':
        // Formato de teléfono chileno
        const phoneRegex = /^(\+56|56)?[\s\-]?(9\d{8}|2\d{7}|3\d{7}|4\d{7}|5\d{7}|6\d{7}|7\d{7})$/;
        return phoneRegex.test(value);
        
      case 'match':
        const matchField = field.getAttribute('data-match');
        const matchValue = this.form.querySelector(`[name="${matchField}"]`).value;
        return value === matchValue;
        
      default:
        return true;
    }
  }

  /**
   * Validar todo el formulario
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  validateForm() {
    let isValid = true;
    
    // Validar todos los campos con reglas
    Object.keys(this.rules).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    
    // Si hay errores, enfocar el primer campo con error
    if (!isValid) {
      const firstErrorField = this.form.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
    
    return isValid;
  }

  /**
   * Mostrar un error en un campo
   * @param {string} fieldName - Nombre del campo
   * @param {string} message - Mensaje de error
   */
  showFieldError(fieldName, message) {
    // Guardar el error
    this.errors[fieldName] = message;
    
    // Encontrar el campo
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Añadir clase de error
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    
    // Crear o actualizar el mensaje de error
    let errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'invalid-feedback';
      errorElement.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  /**
   * Limpiar el error de un campo
   * @param {string} fieldName - Nombre del campo
   */
  clearFieldError(fieldName) {
    // Eliminar el error
    delete this.errors[fieldName];
    
    // Encontrar el campo
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remover clase de error
    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');
    
    // Ocultar el mensaje de error
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  /**
   * Obtener todos los errores
   * @returns {Object} Objeto con todos los errores
   */
  getErrors() {
    return { ...this.errors };
  }

  /**
   * Limpiar todos los errores
   */
  clearAllErrors() {
    Object.keys(this.errors).forEach(fieldName => {
      this.clearFieldError(fieldName);
    });
    
    this.errors = {};
  }
}

// Exportar la clase
export default FormValidator;