const API_BASE_URL = 'http://localhost:3000'; // o la URL de tu API

export { API_BASE_URL };
import { API_BASE_URL } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  // Obtener el formulario de contacto
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  // Verificar que el formulario exista en la página
  if (!contactForm) {
    console.log('Formulario de contacto no encontrado en esta página');
    return;
  }
  
  // Agregar evento de envío al formulario
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Crear objeto con los datos del formulario
    const formData = {
      name: name,
      email: email,
      phone: phone,
      message: message
    };
    
    // Mostrar mensaje de envío
    showFormMessage('Enviando mensaje...', 'info');
    
    // Enviar datos al servidor
    fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showFormMessage(data.message, 'success');
        contactForm.reset(); // Limpiar el formulario
      } else {
        showFormMessage(data.message, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showFormMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    });
  });
  
  // Función para mostrar mensajes en el formulario
  function showFormMessage(message, type) {
    // Verificar que el elemento formMessage exista
    if (!formMessage) {
      console.warn('Elemento formMessage no encontrado');
      return;
    }
    
    // Eliminar clases previas
    formMessage.className = 'form-message';
    
    // Agregar clase según el tipo de mensaje
    if (type === 'success') {
      formMessage.classList.add('success');
    } else if (type === 'error') {
      formMessage.classList.add('error');
    } else {
      formMessage.classList.add('info');
    }
    
    // Establecer el texto del mensaje
    formMessage.textContent = message;
    
    // Mostrar información en la consola
    console.log('Mensaje de formulario:', message, 'Tipo:', type);
  }
});