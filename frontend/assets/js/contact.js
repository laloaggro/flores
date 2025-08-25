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
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessageText').value;
    
    // Crear objeto con los datos del formulario
    const formData = {
      name: name,
      email: email,
      subject: subject,
      message: message
    };
    
    // Mostrar mensaje de envío
    showFormMessage('Enviando mensaje...', 'info');
    
    // Enviar datos al servidor
    fetch('/api/contact', {
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