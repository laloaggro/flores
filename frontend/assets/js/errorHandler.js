// errorHandler.js - Centralized error handling for the application

class ErrorHandler {
  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   */
  static handleApiError(error, context) {
    console.error(`API Error in ${context}:`, error);
    
    // Log error to analytics service (in a real app)
    // analytics.logError(error, context);
    
    // Show user-friendly error message
    let message = 'Ocurrió un error inesperado. Por favor, inténtelo más tarde.';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      message = 'Error de conexión. Por favor, verifique su conexión a internet.';
    } else if (error.message) {
      message = error.message;
    }
    
    // Show notification to user
    this.showNotification(message, 'error');
  }
  
  /**
   * Handle network errors
   * @param {Error} error - The network error
   * @param {string} context - Context where the error occurred
   */
  static handleNetworkError(error, context) {
    console.error(`Network Error in ${context}:`, error);
    
    const message = 'Error de conexión. Por favor, verifique su conexión a internet.';
    this.showNotification(message, 'error');
  }
  
  /**
   * Show notification to user
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (error, warning, info, success)
   */
  static showNotification(message, type = 'info') {
    // Check if we have the showNotification function from utils
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification(message, type);
      return;
    }
    
    // Fallback to simple alert for critical errors
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  }
  
  /**
   * Log error information for debugging
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   * @param {Object} additionalInfo - Additional information about the error
   */
  static logError(error, context, additionalInfo = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
      additionalInfo
    };
    
    console.error('Error logged:', errorInfo);
    
    // In a production environment, you might send this to an error tracking service
    // sendToErrorTrackingService(errorInfo);
  }
}

// Make ErrorHandler available globally
if (typeof window !== 'undefined') {
  window.ErrorHandler = ErrorHandler;
}

export default ErrorHandler;