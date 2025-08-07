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
            console.log('Carrito cargado desde localStorage:', cart);
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
        console.log('Carrito guardado en localStorage:', cart);
    } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        console.log('Contador del carrito actualizado:', cartCount);
    }
}

// Función para calcular el total del carrito
function calculateCartTotal() {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Total del carrito calculado:', total);
    return total;
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(price);
}

// Función para renderizar los items del carrito en el modal
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.total-amount');
    const checkoutButton = document.querySelector('.checkout-button');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar</p>
                <button class="btn btn-primary continue-shopping">Continuar comprando</button>
            </div>
        `;
        if (cartTotalElement) cartTotalElement.textContent = formatPrice(0);
        if (checkoutButton) checkoutButton.disabled = true;
        console.log('Carrito vacío renderizado');
        
        // Añadir evento al botón de continuar comprando
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                const cartModal = document.getElementById('cartModal');
                if (cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        }
        return;
    }
    
    let cartItemsHTML = '';
    cart.forEach(item => {
        cartItemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <div class="item-price">${formatPrice(item.price)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    if (cartTotalElement) cartTotalElement.textContent = formatPrice(calculateCartTotal());
    if (checkoutButton) checkoutButton.disabled = false;
    
    // Añadir event listeners a los botones de cantidad y eliminar
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            console.log('Disminuyendo cantidad para item ID:', id);
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            console.log('Aumentando cantidad para item ID:', id);
            updateQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            console.log('Eliminando item ID:', id);
            removeFromCart(id);
        });
    });
    
    console.log('Items del carrito renderizados:', cart);
}

// Función para actualizar la cantidad de un item en el carrito
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            cartCount += change;
            updateCartCount();
            saveCartToLocalStorage();
            renderCartItems();
            console.log('Cantidad actualizada para item ID:', id, 'Nueva cantidad:', item.quantity);
        }
    }
}

// Función para eliminar un item del carrito
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartCount();
        saveCartToLocalStorage();
        renderCartItems();
        console.log('Item eliminado del carrito. ID:', id);
        
        // Mostrar notificación de eliminación
        showNotification('Producto eliminado del carrito', 'success');
    }
}

// Función para agregar un producto al carrito
function addToCart(id, name, price, image = null) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Producto ya existente en carrito. Incrementando cantidad. ID:', id);
        showNotification(`${name} actualizado en el carrito`, 'success');
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1,
            image: image
        });
        console.log('Nuevo producto agregado al carrito. ID:', id, 'Nombre:', name);
        showNotification(`${name} agregado al carrito`, 'success');
    }
    
    cartCount++;
    updateCartCount();
    saveCartToLocalStorage();
    
    // Mostrar notificación visual del producto agregado
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
        <button class="view-cart-btn">Ver carrito</button>
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
    notification.style.maxWidth = '300px';
    
    // Añadir al documento
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Añadir evento al botón de ver carrito
    const viewCartBtn = notification.querySelector('.view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.style.display = 'block';
                renderCartItems();
            }
            // Eliminar notificación
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para mostrar notificaciones generales
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Añadir estilos
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)';
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
    notification.style.maxWidth = '300px';
    
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
        console.log('Mensaje mostrado en formulario:', type, message);
        
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
        console.log('Enviando datos al backend...');
        const url = '/api/contact';
        console.log('URL de la solicitud:', url);
        
        const formData = { name, email, phone, message };
        console.log('Datos a enviar:', formData);
        
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };
        
        console.log('Opciones de fetch:', fetchOptions);
        
        const response = await fetch(url, fetchOptions);
        
        console.log('Respuesta recibida del backend:', response);
        console.log('Estado de la respuesta:', response.status);
        console.log('Texto de estado:', response.statusText);
        
        // Verificar si la respuesta es válida
        if (!response.ok) {
            // Intentar obtener el mensaje de error del cuerpo de la respuesta
            let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorResult = await response.json();
                console.log('Resultado de error del servidor:', errorResult);
                if (errorResult && errorResult.message) {
                    errorMessage = errorResult.message;
                }
            } catch (parseError) {
                console.error('Error al parsear la respuesta de error:', parseError);
                // Si no se puede parsear la respuesta como JSON, usar el texto
                try {
                    const errorText = await response.text();
                    console.log('Texto de error del servidor:', errorText);
                    if (errorText) {
                        errorMessage = errorText;
                    }
                } catch (textError) {
                    console.error('Error al obtener el texto de error:', textError);
                    // Si tampoco se puede obtener el texto, usar mensaje genérico
                }
            }
            
            console.error('Error del servidor:', response.status, response.statusText);
            showFormMessage('error', errorMessage);
            return;
        }
        
        const result = await response.json();
        console.log('Datos de la respuesta:', result);
        
        if (result.status === 'success') {
            showFormMessage('success', result.message);
            // Limpiar el formulario
            document.getElementById('contactForm').reset();
            
            // Limpiar el carrito si se envió un pedido
            if (message.includes('estoy interesado en los siguientes productos')) {
                cart = [];
                cartCount = 0;
                updateCartCount();
                saveCartToLocalStorage();
                renderCartItems();
            }
        } else {
            showFormMessage('error', result.message || 'Error al procesar el formulario. Por favor, inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        console.error('Nombre del error:', error.name);
        console.error('Mensaje del error:', error.message);
        console.error('Stack trace:', error.stack);
        
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
    console.log('Botones "Agregar al carrito" encontrados:', addToCartButtons.length);
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const image = this.closest('.product-card').querySelector('.product-image img')?.src || null;
            console.log('Botón "Agregar al carrito" presionado. ID:', id, 'Nombre:', name, 'Precio:', price);
            addToCart(parseInt(id), name, price, image);
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
    
    // Event listeners para el carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            console.log('Icono del carrito presionado');
            if (cartModal) {
                cartModal.style.display = 'block';
                renderCartItems();
            }
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            console.log('Botón cerrar carrito presionado');
            if (cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Cerrar el modal al hacer clic fuera de él
    if (cartModal) {
        cartModal.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                console.log('Clic fuera del modal del carrito');
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Event listener para el botón de checkout
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            console.log('Botón "Proceder al Pedido" presionado');
            if (cartModal) {
                cartModal.style.display = 'none';
            }
            // Scroll al formulario de contacto
            const contactoSection = document.getElementById('contacto');
            if (contactoSection) {
                contactoSection.scrollIntoView({ behavior: 'smooth' });
                // Mostrar los productos del carrito en el mensaje
                const cartSummary = cart.map(item => 
                    `${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`
                ).join('\n');
                
                const messageArea = document.getElementById('message');
                if (messageArea) {
                    messageArea.value = `Hola, estoy interesado en los siguientes productos:\n${cartSummary}\n\nTotal: ${formatPrice(calculateCartTotal())}\n\nMe gustaría obtener más información sobre estos productos.`;
                    console.log('Mensaje pre-rellenado con productos del carrito');
                }
            }
        });
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