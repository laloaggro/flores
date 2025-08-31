// contact.js - Manejo del formulario de contacto

// Importar UserMenu
import UserMenu from './userMenu.js';

// Función para manejar el envío del formulario de contacto
function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Deshabilitar botón y mostrar carga
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Enviando...';
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Agregar token CSRF si existe
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfTokenMeta) {
        data._token = csrfTokenMeta.getAttribute('content');
    }
    
    // Enviar datos (simulación)
    setTimeout(() => {
        // Simular éxito
        showNotification('Mensaje enviado correctamente. Nos pondremos en contacto pronto.', 'success');
        form.reset();
        
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }, 1500);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Agregar estilo
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'opacity 0.3s, transform 0.3s'
    });
    
    // Estilos por tipo
    if (type === 'success') {
        notification.style.backgroundColor = '#2e7d32';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#c62828';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ef6c00';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para validar el formulario
function validateContactForm(form) {
    // Limpiar errores previos
    clearContactFormErrors(form);
    
    let isValid = true;
    const errors = [];
    
    // Validar nombre
    const name = form.querySelector('#contactName');
    if (name && !name.value.trim()) {
        errors.push({ field: name, message: 'El nombre es obligatorio' });
        isValid = false;
    }
    
    // Validar email
    const email = form.querySelector('#contactEmail');
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            errors.push({ field: email, message: 'El email es obligatorio' });
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            errors.push({ field: email, message: 'El email no es válido' });
            isValid = false;
        }
    }
    
    // Validar asunto
    const subject = form.querySelector('#contactSubject');
    if (subject && !subject.value.trim()) {
        errors.push({ field: subject, message: 'El asunto es obligatorio' });
        isValid = false;
    }
    
    // Validar mensaje
    const message = form.querySelector('#contactMessage');
    if (message && !message.value.trim()) {
        errors.push({ field: message, message: 'El mensaje es obligatorio' });
        isValid = false;
    }
    
    // Mostrar errores si los hay
    if (!isValid) {
        errors.forEach(error => {
            showContactFieldError(error.field, error.message);
        });
    }
    
    return isValid;
}

// Función para mostrar errores en campos
function showContactFieldError(field, message) {
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.id = field.id + '-error';
    
    // Insertar después del campo
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Marcar campo como inválido
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('invalid');
}

// Función para limpiar errores del formulario
function clearContactFormErrors(form) {
    // Eliminar mensajes de error
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    // Limpiar estado de campos
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('invalid');
    });
}

// Función para agregar token CSRF a formularios
function addCSRFTokenToForms() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (!csrfTokenMeta) return;
    
    const csrfToken = csrfTokenMeta.getAttribute('content');
    if (!csrfToken) return;
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Verificar si el formulario ya tiene un token CSRF
        const existingToken = form.querySelector('input[name="_token"]');
        if (!existingToken) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        }
    });
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar UserMenu
    UserMenu.init();
    
    // Añadir token CSRF a los formularios
    addCSRFTokenToForms();
    
    // Agregar evento al formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Validar formulario
            if (!validateContactForm(contactForm)) {
                e.preventDefault();
                return;
            }
            
            // Manejar envío
            handleContactFormSubmission(e);
        });
    }
});