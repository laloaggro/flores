/**
 * Clase para manejar errores de manera centralizada
 */
class ErrorHandler {
    /**
     * Maneja errores de red
     * @param {Error} error - El error de red
     * @param {string} operation - La operación que causó el error
     */
    static handleNetworkError(error, operation) {
        console.error(`Error de red en ${operation}:`, error);
        this.showNotification(`Error de conexión en ${operation}. Por favor, verifica tu conexión a internet.`, 'error');
    }

    /**
     * Maneja errores de la API
     * @param {Response} response - La respuesta de error de la API
     * @param {string} operation - La operación que causó el error
     */
    static async handleAPIError(response, operation) {
        let message = `Error en ${operation}: ${response.status} ${response.statusText}`;
        
        try {
            const errorData = await response.json();
            if (errorData.message) {
                message = errorData.message;
            }
        } catch (e) {
            // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        
        console.error(message);
        this.showNotification(message, 'error');
    }

    /**
     * Maneja errores genéricos
     * @param {Error} error - El error
     * @param {string} operation - La operación que causó el error
     */
    static handleGenericError(error, operation) {
        console.error(`Error en ${operation}:`, error);
        this.showNotification(`Ocurrió un error inesperado en ${operation}. Por favor, inténtalo de nuevo.`, 'error');
    }

    /**
     * Muestra una notificación al usuario
     * @param {string} message - El mensaje a mostrar
     * @param {string} type - El tipo de notificación (error, success, info, warning)
     */
    static showNotification(message, type = 'info') {
        // Verificar si ya existe una función de notificación en utils.js
        if (typeof window !== 'undefined' && window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Implementación básica de notificación si no existe la función
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            background-color: ${type === 'error' ? '#dc3545' : 
                               type === 'success' ? '#28a745' : 
                               type === 'warning' ? '#ffc107' : '#17a2b8'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Maneja errores de validación
     * @param {Array} errors - Array de errores de validación
     */
    static handleValidationErrors(errors) {
        if (Array.isArray(errors) && errors.length > 0) {
            const message = errors.map(err => err.message || err).join(', ');
            this.showNotification(`Errores de validación: ${message}`, 'error');
        } else {
            this.showNotification('Error de validación en los datos ingresados', 'error');
        }
    }
}

// Exportar la clase
export default ErrorHandler;