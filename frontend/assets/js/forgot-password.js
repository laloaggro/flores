import { showNotification, API_BASE_URL } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado en forgot-password.js');
    
    // Obtener el formulario y el botón
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const sendResetButton = document.getElementById('sendResetButton');
    
    if (forgotPasswordForm) {
        console.log('Formulario de recuperación de contraseña encontrado');
        
        // Agregar evento de envío al formulario
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    } else {
        console.warn('Formulario de recuperación de contraseña no encontrado');
    }
    
    console.log('Inicialización de recuperación de contraseña completada');
});

/**
 * Manejar el envío del formulario de recuperación de contraseña
 * @param {Event} event - El evento de envío del formulario
 */
async function handleForgotPassword(event) {
    event.preventDefault();
    
    console.log('Manejando envío de formulario de recuperación de contraseña');
    
    // Obtener el email del formulario
    const email = document.getElementById('email').value.trim();
    
    // Validar email
    if (!email) {
        showNotification('Por favor ingresa tu correo electrónico', 'error');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingresa un correo electrónico válido', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    const originalText = sendResetButton.innerHTML;
    sendResetButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    sendResetButton.disabled = true;
    
    try {
        console.log('Enviando solicitud de recuperación de contraseña para:', email);
        
        // Enviar solicitud al backend
        const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (response.ok) {
            // Éxito
            showNotification(data.message || 'Instrucciones enviadas a tu correo electrónico', 'success');
            
            // Limpiar formulario
            document.getElementById('forgotPasswordForm').reset();
        } else {
            // Error del servidor
            showNotification(data.message || 'Error al enviar instrucciones de recuperación', 'error');
        }
    } catch (error) {
        console.error('Error al enviar solicitud de recuperación de contraseña:', error);
        showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
    } finally {
        // Restaurar botón
        sendResetButton.innerHTML = originalText;
        sendResetButton.disabled = false;
    }
}

// Exportar funciones necesarias
export { handleForgotPassword };