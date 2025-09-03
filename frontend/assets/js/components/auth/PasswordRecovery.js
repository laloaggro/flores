/**
 * PasswordRecovery.js - Componente para recuperación de contraseña
 * 
 * Este componente implementa la función de recuperación de contraseña
 * permitiendo a los usuarios restablecer su contraseña mediante su correo electrónico.
 */

class PasswordRecovery extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="password-recovery-container">
        <form id="password-recovery-form" class="password-recovery-form">
          <h2>Recuperar Contraseña</h2>
          <p>Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.</p>
          
          <div class="form-group">
            <label for="recovery-email">Correo Electrónico</label>
            <input 
              type="email" 
              id="recovery-email" 
              name="email" 
              required 
              placeholder="Ingrese su correo electrónico"
            >
            <div class="error-message" id="email-error" style="display: none;"></div>
          </div>
          
          <button type="submit" class="btn btn-primary" id="recovery-submit">
            <span class="btn-text">Enviar Enlace de Recuperación</span>
            <span class="btn-spinner" style="display: none;">
              <i class="fas fa-spinner fa-spin"></i> Enviando...
            </span>
          </button>
          
          <div class="form-footer">
            <a href="/login.html">Volver al inicio de sesión</a>
          </div>
        </form>
        
        <div class="recovery-success" id="recovery-success" style="display: none;">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>¡Correo Enviado!</h3>
          <p>Hemos enviado un enlace de recuperación a su correo electrónico. Por favor, revise su bandeja de entrada.</p>
          <a href="/login.html" class="btn btn-primary">Volver al inicio de sesión</a>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#password-recovery-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleRecoverySubmit(e));
    }
  }

  async handleRecoverySubmit(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('#recovery-email');
    const email = emailInput.value.trim();
    const submitButton = this.querySelector('#recovery-submit');
    const btnText = this.querySelector('.btn-text');
    const btnSpinner = this.querySelector('.btn-spinner');
    
    // Validar correo electrónico
    if (!this.validateEmail(email)) {
      this.showFieldError('email-error', 'Por favor, ingrese un correo electrónico válido.');
      return;
    } else {
      this.hideFieldError('email-error');
    }
    
    // Mostrar indicador de carga
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';
    submitButton.disabled = true;
    
    try {
      // Enviar solicitud de recuperación de contraseña
      const response = await fetch('/api/users/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        this.showSuccessMessage();
      } else {
        // Mostrar error
        this.showFieldError('email-error', data.message || 'Error al enviar el correo de recuperación. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar solicitud de recuperación:', error);
      this.showFieldError('email-error', 'Error de conexión. Por favor, verifique su conexión a internet e inténtelo de nuevo.');
    } finally {
      // Ocultar indicador de carga
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
      submitButton.disabled = false;
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(elementId, message) {
    const errorElement = this.querySelector(`#${elementId}`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  hideFieldError(elementId) {
    const errorElement = this.querySelector(`#${elementId}`);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  showSuccessMessage() {
    const form = this.querySelector('#password-recovery-form');
    const successMessage = this.querySelector('#recovery-success');
    
    if (form && successMessage) {
      form.style.display = 'none';
      successMessage.style.display = 'block';
    }
  }
}

// Registrar el componente
if (!customElements.get('password-recovery')) {
  customElements.define('password-recovery', PasswordRecovery);
}

export default PasswordRecovery;