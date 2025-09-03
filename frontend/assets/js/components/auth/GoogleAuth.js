/**
 * GoogleAuth.js - Componente para autenticación con Google
 * 
 * Este componente implementa la función de inicio de sesión con Google
 * utilizando la API de Google Identity Services.
 */

class GoogleAuth extends HTMLElement {
  constructor() {
    super();
    this.clientId = null;
    this.callback = null;
  }

  connectedCallback() {
    this.clientId = this.getAttribute('client-id');
    this.callback = this.getAttribute('callback');
    
    if (!this.clientId) {
      console.error('GoogleAuth: Se requiere el atributo client-id');
      return;
    }
    
    this.render();
    this.initializeGoogleAuth();
  }

  render() {
    this.innerHTML = `
      <div class="google-auth-container">
        <button id="google-login-button" class="btn btn-google">
          <i class="fab fa-google"></i>
          Iniciar sesión con Google
        </button>
      </div>
    `;
  }

  initializeGoogleAuth() {
    // Cargar la biblioteca de Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn() {
    const button = this.querySelector('#google-login-button');
    if (button) {
      button.addEventListener('click', () => {
        this.handleGoogleSignIn();
      });
    }
  }

  handleGoogleSignIn() {
    // Mostrar indicador de carga
    const button = this.querySelector('#google-login-button');
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
    button.disabled = true;

    try {
      // Inicializar el cliente de Google
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          this.handleCredentialResponse(response);
          // Restaurar botón
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      });

      // Crear el prompt de inicio de sesión
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback a la ventana emergente
          google.accounts.id.signIn();
        }
      });
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      // Restaurar botón en caso de error
      button.innerHTML = originalContent;
      button.disabled = false;
      this.showNotification('Error al conectar con Google. Por favor, inténtelo de nuevo.', 'error');
    }
  }

  async handleCredentialResponse(response) {
    try {
      // Enviar el token de credenciales al backend
      const res = await fetch('/api/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar el token de autenticación
        localStorage.setItem('authToken', data.token);
        
        // Ejecutar callback si está definido
        if (this.callback) {
          try {
            eval(this.callback)(data);
          } catch (e) {
            console.error('Error al ejecutar callback:', e);
          }
        }
        
        // Disparar evento personalizado
        this.dispatchEvent(new CustomEvent('google-login-success', {
          detail: data,
          bubbles: true
        }));
        
        this.showNotification('¡Inicio de sesión exitoso!', 'success');
      } else {
        throw new Error(data.message || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      this.showNotification('Error en la autenticación. Por favor, inténtelo de nuevo.', 'error');
      
      // Disparar evento de error
      this.dispatchEvent(new CustomEvent('google-login-error', {
        detail: error.message,
        bubbles: true
      }));
    }
  }

  showNotification(message, type) {
    // Crear contenedor de notificaciones si no existe
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999999999;
        width: 300px;
      `;
      document.body.appendChild(notificationContainer);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      background-color: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
      border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
      color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
      position: relative;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    notification.innerHTML = `
      ${message}
      <button style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        color: inherit;
      ">&times;</button>
    `;

    // Añadir botón de cierre
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });

    notificationContainer.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto cerrar después de 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }
}

// Registrar el componente
if (!customElements.get('google-auth')) {
  customElements.define('google-auth', GoogleAuth);
}

export default GoogleAuth;