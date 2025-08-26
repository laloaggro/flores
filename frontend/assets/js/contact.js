// Función para obtener el token CSRF de las cookies
function getCSRFToken() {
    const cookieString = document.cookie;
    const csrfToken = cookieString
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    
    return csrfToken ? decodeURIComponent(csrfToken) : null;
}

// Función para agregar el token CSRF a un formulario
function addCSRFTokenToForm(form) {
    const csrfToken = getCSRFToken();
    
    if (csrfToken) {
        // Crear un campo oculto para el token CSRF
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfToken;
        
        // Agregar el campo al formulario
        form.appendChild(csrfInput);
    } else {
        console.warn('No se encontró el token CSRF');
    }
}

// Función para agregar el token CSRF a todos los formularios
function addCSRFTokenToForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(addCSRFTokenToForm);
}

// Función para manejar el envío de formularios con protección CSRF
function handleFormSubmission(form, submitHandler) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Agregar token CSRF antes de enviar
        addCSRFTokenToForm(form);
        
        // Crear objeto FormData con los datos del formulario
        const formData = new FormData(form);
        
        // Llamar al manejador de envío con los datos
        submitHandler(formData);
    });
}

// Exportar funciones (para usar con módulos)
export { addCSRFTokenToForms, handleFormSubmission };
// Importar funciones de utilidad
import { handleFormSubmission, addCSRFTokenToForms } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // Añadir token CSRF a los formularios
  addCSRFTokenToForms();
  
  // Obtener elementos del DOM
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  // Verificar que el formulario exista en la página
  if (!contactForm) {
    console.log('Formulario de contacto no encontrado en esta página');
    return;
  }
  
  // Manejar el envío del formulario con protección CSRF
  handleFormSubmission(contactForm, submitContactForm);
});

// Función para enviar el formulario de contacto
async function submitContactForm(formData) {
  try {
    // Mostrar mensaje de envío
    showFormMessage('Enviando mensaje...', 'info');
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error al enviar el mensaje: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    showSuccessMessage(result.message);
    contactForm.reset();
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    showErrorMessage('No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
  }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
  const messageElement = document.getElementById('formMessage');
  if (messageElement) {
    messageElement.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
      </div>
    `;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      messageElement.innerHTML = '';
    }, 5000);
  }
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
  const messageElement = document.getElementById('formMessage');
  if (messageElement) {
    messageElement.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      messageElement.innerHTML = '';
    }, 5000);
  }
}