// Simulación del carrito de compras
let cart = [];
let cartCount = 0;

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('arreglosVictoriaCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        }
    } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
        cart = [];
        cartCount = 0;
    }
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('arreglosVictoriaCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Función para agregar un producto al carrito
function addToCart(id, name, price) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartCount();
    saveCartToLocalStorage();
    
    // Mostrar mensaje de confirmación
    showFormMessage('success', `${name} agregado al carrito!`);
    
    // Opcional: Mostrar notificación visual del producto agregado
    showProductAddedNotification(name);
}

// Función para mostrar una notificación visual cuando se agrega un producto
function showProductAddedNotification(productName) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} agregado al carrito</span>
    `;
    
    // Añadir estilos básicos
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--success)';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '1000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Añadir al documento
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para mostrar mensajes en el formulario de contacto
function showFormMessage(type, message) {
    const messageElement = document.getElementById('formMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            messageElement.className = 'form-message';
        }, 5000);
    }
}

// Función para manejar el envío del formulario de contacto
async function handleContactFormSubmit(event) {
    console.log('Función handleContactFormSubmit llamada');
    event.preventDefault();
    console.log('Evento preventDefault ejecutado');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    console.log('Datos del formulario:', { name, email, phone, message });
    
    // Validar que todos los campos requeridos estén completos
    if (!name || !email || !message) {
        showFormMessage('error', 'Por favor, completa todos los campos requeridos.');
        return;
    }
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('error', 'Por favor, ingresa un correo electrónico válido.');
        return;
    }
    
    // Mostrar mensaje de carga
    const submitButton = document.querySelector('#contactForm .btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    try {
        // Enviar datos al backend PHP
        console.log('Enviando datos al backend PHP...');
        const response = await fetch('/backend/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, message })
        });
        
        console.log('Respuesta recibida del backend:', response);
        
        const result = await response.json();
        console.log('Datos de la respuesta:', result);
        
        if (response.ok) {
            showFormMessage('success', result.message);
            // Limpiar el formulario
            document.getElementById('contactForm').reset();
        } else {
            showFormMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        
        // Manejar errores de conexión
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showFormMessage('error', 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo nuevamente.');
        } else {
            showFormMessage('error', 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
        }
    } finally {
        // Restaurar botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Función para inicializar los event listeners
function initializeEventListeners() {
    console.log('Inicializando event listeners');
    
    // Event listeners para los botones "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(id, name, price);
        });
    });
    
    // Event listener para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    console.log('Formulario de contacto encontrado:', contactForm);
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        console.log('Event listener adjuntado al formulario de contacto');
    } else {
        console.log('No se encontró el formulario de contacto');
    }
}

// Función para verificar si el formulario existe y adjuntar event listener si es necesario
function checkAndAttachFormListener() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm && !contactForm.dataset.listenerAttached) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        contactForm.dataset.listenerAttached = 'true';
        console.log('Event listener adjuntado al formulario de contacto');
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    
    // Cargar carrito y actualizar contador
    loadCartFromLocalStorage();
    updateCartCount();
    
    // Inicializar event listeners con una pequeña demora
    setTimeout(function() {
        console.log('Inicializando aplicación después de la demora');
        initializeEventListeners();
    }, 100);
    
    // Verificar y adjuntar listener al formulario con intervalo
    const formCheckInterval = setInterval(() => {
        checkAndAttachFormListener();
    }, 500);
    
    // Limpiar intervalo después de 5 segundos
    setTimeout(() => {
        clearInterval(formCheckInterval);
    }, 5000);
    
    // Smooth scrolling para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Verificar también después de que la ventana se haya cargado completamente
window.addEventListener('load', function() {
    console.log('Ventana completamente cargada');
    setTimeout(() => {
        checkAndAttachFormListener();
    }, 100);
});