// Error Boundary Component
// Handles JavaScript errors in the application and reports them

import sentry from './sentry.js';

class ErrorBoundary {
  constructor() {
    this.init();
  }
  
  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Global unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        message: 'Unhandled Promise Rejection',
        promise: event.promise
      });
    });
    
    console.log('Error boundary initialized');
  }
  
  handleError(error, additionalInfo = {}) {
    // Log error to console
    console.error('Application error:', error);
    
    // Report to Sentry
    sentry.captureException(error);
    
    // Additional error handling logic can be added here
    // For example, showing user-friendly error messages
    this.showErrorMessage(error, additionalInfo);
  }
  
  showErrorMessage(error, additionalInfo) {
    // Create error message element
    const errorContainer = document.createElement('div');
    errorContainer.className = 'global-error-message';
    errorContainer.innerHTML = `
      <div class="error-content">
        <h3>¡Ups! Algo salió mal</h3>
        <p>Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.</p>
        <button class="error-close-btn">Cerrar</button>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(errorContainer);
    
    // Add close functionality
    const closeBtn = errorContainer.querySelector('.error-close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(errorContainer);
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.body.contains(errorContainer)) {
        document.body.removeChild(errorContainer);
      }
    }, 10000);
  }
}

// Initialize error boundary
const errorBoundary = new ErrorBoundary();

export default errorBoundary;