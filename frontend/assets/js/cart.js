// cart.js - Funcionalidad del carrito de compras
import CartUtils from './cartUtils.js';
import Cart from '../../components/Cart.js';
import { isAuthenticated, showNotification, formatPrice } from './utils.js';

// Variable para rastrear si los eventos ya han sido adjuntados
let cartEventsAttached = false;

// Inicializar CartUtils cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar CartUtils
    CartUtils.init();
    
    // Elementos del DOM
    const cartIcon = document.querySelector('.cart-icon');
    const cartClose = document.querySelector('.cart-close');
    const checkoutButton = document.querySelector('.checkout-button');
    
    // Mostrar/ocultar carrito - solo si los elementos existen
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showCart();
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideCart();
        });
    }
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && event.target === cartModal) {
            hideCart();
        }
    });
    
    // Agregar funcionalidad al botón 'Proceder al pedido'
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const cart = CartUtils.getCartItems();
            
            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }
            
            // Verificar si el usuario está logueado
            if (!isAuthenticated()) {
                showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
                // Mostrar información de depuración
                console.log('Usuario no autenticado, redirigiendo a login');
                
                // Redirigir a la página de login/registro
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }
            
            // Redirigir a la página de checkout
            window.location.href = 'checkout.html';
        });
    }
    
    // Función para ocultar el carrito
    function hideCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.style.display = 'none';
        }
    }
});

// Función para adjuntar eventos del carrito una sola vez
function attachCartEvents() {
    // Adjuntar event listeners para los botones de disminución
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', handleDecreaseQuantity);
    });
    
    // Adjuntar event listeners para los botones de aumento
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', handleIncreaseQuantity);
    });
    
    // Botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
    
    // Botones de guardar para más tarde
    document.querySelectorAll('.save-for-later').forEach(button => {
        button.addEventListener('click', handleSaveForLater);
    });
    
    // Botones de mover al carrito (desde guardado para más tarde)
    document.querySelectorAll('.move-to-cart').forEach(button => {
        button.addEventListener('click', handleMoveToCart);
    });
    
    // Botones de eliminar de guardado para más tarde
    document.querySelectorAll('.remove-saved-item').forEach(button => {
        button.addEventListener('click', handleRemoveSavedItem);
    });
    
    // Botón de cerrar carrito
    const cartClose = document.querySelector('.cart-close');
    if (cartClose) {
        cartClose.addEventListener('click', handleCloseCart);
    }
    
    // Botón para vaciar carrito
    const clearCartButton = document.querySelector('.clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', handleClearCart);
    }
    
    // Botón de checkout
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
    
    cartEventsAttached = true;
}

// Manejador para disminuir cantidad
function handleDecreaseQuantity(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    const item = CartUtils.getCartItems().find(item => item.id === productId);
    if (item && item.quantity > 1) {
        CartUtils.updateQuantity(productId, item.quantity - 1);
        updateCartUI(); // Actualizar solo la UI sin recrear todo el carrito
    } else if (item) {
        CartUtils.removeFromCart(productId);
        updateCartUI(); // Actualizar solo la UI sin recrear todo el carrito
    }
}

// Manejador para aumentar cantidad
function handleIncreaseQuantity(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    const item = CartUtils.getCartItems().find(item => item.id === productId);
    if (item) {
        CartUtils.updateQuantity(productId, item.quantity + 1);
        updateCartUI(); // Actualizar solo la UI sin recrear todo el carrito
    }
}

// Manejador para eliminar item
function handleRemoveItem(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    CartUtils.removeFromCart(productId);
    showCart(); // Actualizar la vista del carrito
}

// Manejador para guardar para más tarde
function handleSaveForLater(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    CartUtils.saveForLater(productId);
    showCart(); // Actualizar la vista del carrito
}

// Manejador para mover al carrito
function handleMoveToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    CartUtils.moveToCart(productId);
    showCart(); // Actualizar la vista del carrito
}

// Manejador para eliminar item guardado
function handleRemoveSavedItem(e) {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(e.currentTarget.dataset.id);
    CartUtils.removeFromSaved(productId);
    showCart(); // Actualizar la vista del carrito
}

// Manejador para cerrar carrito
function handleCloseCart(e) {
    e.preventDefault();
    e.stopPropagation();
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Manejador para vaciar carrito
function handleClearCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        CartUtils.clearCart();
        updateCartUI(); // Actualizar la vista del carrito sin cerrarlo
    }
}

// Manejador para checkout
function handleCheckout(e) {
    e.preventDefault();
    e.stopPropagation();
    const cart = CartUtils.getCartItems();
    
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Verificar si el usuario está logueado
    if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
        // Mostrar información de depuración
        console.log('Usuario no autenticado, redirigiendo a login');
        
        // Redirigir a la página de login/registro
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Redirigir a la página de checkout
    window.location.href = 'checkout.html';
}

// Función para mostrar el carrito (exportada para uso externo)
function showCart() {
    // Asegurarse de que CartUtils esté inicializado
    if (!CartUtils.cartItems) {
        CartUtils.init();
    }
    
    const cart = CartUtils.getCartItems();
    const savedForLater = CartUtils.getSavedItems();
    
    console.log('Mostrando carrito con items:', cart);
    console.log('Items guardados para más tarde:', savedForLater);
    
    // Crear el elemento del carrito si no existe o si existe pero no está visible
    let cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        try {
            // Generar HTML del carrito usando el componente
            const cartHTML = Cart(cart, savedForLater);
            
            // Verificar que cartHTML no sea undefined
            if (cartHTML && typeof cartHTML === 'string') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cartHTML.trim(); // Eliminar espacios en blanco
                
                // Verificar que haya contenido antes de intentar adjuntar
                if (tempDiv.firstElementChild) {
                    document.body.appendChild(tempDiv.firstElementChild);
                    cartModal = document.getElementById('cartModal');
                    
                    // Adjuntar event listeners
                    Cart.attachEventListeners();
                } else {
                    console.error('Cart component returned invalid HTML');
                    return;
                }
            } else {
                console.error('Cart component returned invalid HTML:', cartHTML);
                return;
            }
        } catch (error) {
            console.error('Error creating cart component:', error);
            return;
        }
    }
    
    // Mostrar el carrito si existe
    if (cartModal) {
        cartModal.style.display = 'block';
        
        // Actualizar el contenido del carrito
        const cartContent = cartModal.querySelector('.cart-content');
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="cart-header">
                    <h2>Carrito de Compras</h2>
                    <button class="btn btn-icon cart-close" aria-label="Cerrar carrito">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-body">
                    <div class="cart-items-section">
                        <h3>Tus Productos (${cart.length} ${cart.length === 1 ? 'item' : 'items'})</h3>
                        <div class="cart-items">
                            ${renderCartItems(cart)}
                        </div>
                    </div>
                    
                    <div class="saved-for-later-section">
                        <h3>Guardados para más tarde</h3>
                        <div class="saved-items">
                            ${renderSavedItems(savedForLater)}
                        </div>
                    </div>
                </div>
                
                <div class="cart-footer">
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Total:</span>
                            <span class="total-amount">${formatPrice(calculateCartTotal(cart))}</span>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-secondary clear-cart">Vaciar carrito</button>
                        <button class="btn btn-primary checkout-button" ${cart.length === 0 ? 'disabled' : ''}>
                            Proceder al pedido
                        </button>
                    </div>
                </div>
            `;
            
            // Volver a adjuntar event listeners después de actualizar el contenido
            Cart.attachEventListeners();
        }
    }
}

// Función para actualizar solo la UI del carrito sin recrearlo
function updateCartUI() {
    const cart = CartUtils.getCartItems();
    const savedForLater = CartUtils.getSavedItems();
    
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    // Asegurarse de que el carrito permanezca visible
    cartModal.style.display = 'block';
    
    // Actualizar sección de items del carrito
    const cartItemsSection = cartModal.querySelector('.cart-items');
    if (cartItemsSection) {
        cartItemsSection.innerHTML = renderCartItems(cart);
    }
    
    // Actualizar contador de items
    const itemsHeader = cartModal.querySelector('.cart-items-section h3');
    if (itemsHeader) {
        itemsHeader.textContent = `Tus Productos (${cart.length} ${cart.length === 1 ? 'item' : 'items'})`;
    }
    
    // Actualizar items guardados para más tarde
    const savedItemsSection = cartModal.querySelector('.saved-items');
    if (savedItemsSection) {
        savedItemsSection.innerHTML = renderSavedItems(savedForLater);
    }
    
    // Actualizar total
    const totalAmount = cartModal.querySelector('.total-amount');
    if (totalAmount) {
        totalAmount.textContent = formatPrice(calculateCartTotal(cart));
    }
    
    // Actualizar estado del botón de checkout
    const checkoutButton = cartModal.querySelector('.checkout-button');
    if (checkoutButton) {
        if (cart.length === 0) {
            checkoutButton.setAttribute('disabled', 'disabled');
        } else {
            checkoutButton.removeAttribute('disabled');
        }
    }
    
    // Volver a adjuntar event listeners
    Cart.attachEventListeners();
}

// Hacer que updateCartUI esté disponible globalmente
window.updateCartUI = updateCartUI;

// Función para renderizar items del carrito
function renderCartItems(items) {
    if (items.length === 0) {
        return `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar</p>
                <a href="products.html" class="btn btn-primary">Ver productos</a>
            </div>
        `;
    }

    return items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image || './assets/images/placeholder.svg'}" 
                     alt="${item.name}" 
                     onerror="this.src='./assets/images/placeholder.svg'">
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-quantity">
                <button class="btn btn-quantity decrease" data-id="${item.id}" aria-label="Disminuir cantidad">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="btn btn-quantity increase" data-id="${item.id}" aria-label="Aumentar cantidad">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-total">
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-icon save-for-later" data-id="${item.id}" aria-label="Guardar para más tarde">
                    <i class="fas fa-save"></i>
                </button>
                <button class="btn btn-icon remove-item" data-id="${item.id}" aria-label="Eliminar del carrito">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Función para renderizar items guardados para más tarde
function renderSavedItems(items) {
    if (items.length === 0) {
        return '<p class="empty-saved">No hay productos guardados para más tarde</p>';
    }

    return items.map(item => `
        <div class="saved-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image || './assets/images/placeholder.svg'}" 
                     alt="${item.name}" 
                     onerror="this.src='./assets/images/placeholder.svg'">
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary move-to-cart" data-id="${item.id}">
                    <i class="fas fa-shopping-cart"></i> Mover al carrito
                </button>
                <button class="btn btn-danger remove-saved-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Función para calcular el total del carrito
function calculateCartTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Hacer que estas funciones estén disponibles globalmente
window.renderCartItems = renderCartItems;
window.renderSavedItems = renderSavedItems;

// Escuchar evento personalizado para mostrar el carrito
document.addEventListener('showCart', function() {
    showCart();
});

// Escuchar evento de actualización del carrito
document.addEventListener('cartUpdated', function() {
    // Si el carrito está abierto, actualizar su vista pero manteniendo su visibilidad
    const cartModal = document.getElementById('cartModal');
    const wasVisible = cartModal && cartModal.style.display === 'block';
    
    // Actualizar la vista del carrito
    if (wasVisible) {
        // Ya no es necesario volver a mostrar todo el carrito
        // La actualización de la cantidad se hace directamente en la UI
        // Solo aseguramos que el carrito permanezca visible
        const updatedCartModal = document.getElementById('cartModal');
        if (updatedCartModal) {
            updatedCartModal.style.display = 'block';
        }
    }
});

export { showCart };