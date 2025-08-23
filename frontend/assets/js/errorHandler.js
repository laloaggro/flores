/**
 * Error Handler - Sistema centralizado de manejo de errores
 */
class ErrorHandler {
    /**
     * Maneja errores de red
     * @param {Error} error - Error de red
     * @param {string} operation - Operación que causó el error
     */
    static handleNetworkError(error, operation) {
        console.error(`Error de conexión en ${operation}:`, error);
        this.showNotification(`Error de conexión en ${operation}. Por favor, verifica tu conexión a internet.`, 'error');
    }

    /**
     * Maneja errores de la API
     * @param {Response} response - Respuesta HTTP
     * @param {string} operation - Operación que causó el error
     */
    static async handleApiError(response, operation) {
        let errorMessage = `Error en ${operation}: ${response.status} ${response.statusText}`;
        
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
            console.warn('No se pudo parsear la respuesta de error:', parseError);
        }
        
        console.error(errorMessage);
        this.showNotification(errorMessage, 'error');
    }

    /**
     * Maneja errores generales
     * @param {Error} error - Error
     * @param {string} operation - Operación que causó el error
     */
    static handleGenericError(error, operation) {
        console.error(`Error en ${operation}:`, error);
        this.showNotification(`Ocurrió un error en ${operation}. Por favor, inténtalo de nuevo.`, 'error');
    }

    /**
     * Muestra una notificación de error
     * @param {string} message - Mensaje de error
     * @param {string} type - Tipo de notificación
     */
    static showNotification(message, type = 'error') {
        // Intentar usar la función showNotification existente
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }

        // Fallback: mostrar alerta en consola
        console[type](message);
        
        // Crear notificación en la página si no existe showNotification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="
                position: fixed; 
                top: 20px; 
                right: 20px; 
                background: ${type === 'error' ? '#e53e3e' : type === 'success' ? '#38a169' : '#3182ce'}; 
                color: white; 
                padding: 15px; 
                border-radius: 5px; 
                z-index: 10000; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 300px;
            ">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Maneja errores de forma centralizada
     * @param {Error} error - Error
     * @param {string} operation - Operación que causó el error
     * @param {Response} response - Respuesta HTTP (opcional)
     */
    static handleError(error, operation, response = null) {
        if (response) {
            this.handleApiError(response, operation);
        } else if (error instanceof TypeError && error.message.includes('fetch')) {
            this.handleNetworkError(error, operation);
        } else {
            this.handleGenericError(error, operation);
        }
    }
}

export default ErrorHandler;