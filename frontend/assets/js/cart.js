// cart.js - Funcionalidad del carrito de compras
import CartUtils from './cartUtils.js';
import Cart, { showCart as showCartComponent } from '../../components/Cart.js';
import { isAuthenticated, showNotification } from './utils.js';

// Funcionalidad del carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartIcon = document.querySelector('.cart-icon');
    const cartClose = document.querySelector('.cart-close');
    const checkoutButton = document.querySelector('.checkout-button');
    
    // Mostrar/ocultar carrito - solo si los elementos existen
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCart();
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
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
        checkoutButton.addEventListener('click', function() {
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
    
    // Función para calcular el total del carrito
    function CalculateCartTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Función para formatear precios
    function formatPrice(price) {
        return `$${price.toLocaleString()}`;
    }
    
    // Función para renderizar items del carrito
    function renderCartItems(cart) {
        if (cart.length === 0) {
            return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega productos para comenzar</p>
                </div>
            `;
        }
        
        return cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image || './assets/images/placeholder.svg'}" 
                         alt="${item.name}" 
                         onerror="this.src='./assets/images/placeholder.svg'">
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
                <div class="item-actions">
                    <button class="save-for-later" data-id="${item.id}">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Función para renderizar items guardados para más tarde
    function renderSavedForLater(savedForLater) {
        if (savedForLater.length === 0) {
            return '';
        }
        
        return `
            <h3>Guardado para más tarde</h3>
            ${savedForLater.map(item => `
                <div class="saved-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image || './assets/images/placeholder.svg'}" 
                             alt="${item.name}" 
                             onerror="this.src='./assets/images/placeholder.svg'">
                    </div>
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <div class="item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="item-actions">
                        <button class="move-to-cart" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i> Mover al carrito
                        </button>
                        <button class="remove-saved-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    // Función para adjuntar event listeners
    function attachEventListeners() {
        // Botones de aumentar/disminuir cantidad
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const item = CartUtils.getCartItems().find(item => item.id === productId);
                if (item) {
                    CartUtils.updateQuantity(productId, item.quantity - 1);
                    showCart(); // Actualizar la vista del carrito
                }
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const item = CartUtils.getCartItems().find(item => item.id === productId);
                if (item) {
                    CartUtils.updateQuantity(productId, item.quantity + 1);
                    showCart(); // Actualizar la vista del carrito
                }
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                CartUtils.removeFromCart(productId);
                showCart(); // Actualizar la vista del carrito
            });
        });
        
        // Botones de guardar para más tarde
        document.querySelectorAll('.save-for-later').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                CartUtils.saveForLater(productId);
                showCart(); // Actualizar la vista del carrito
            });
        });
        
        // Botones de mover al carrito (desde guardado para más tarde)
        document.querySelectorAll('.move-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                CartUtils.moveToCart(productId);
                showCart(); // Actualizar la vista del carrito
            });
        });
        
        // Botones de eliminar de guardado para más tarde
        document.querySelectorAll('.remove-saved-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                CartUtils.removeFromSaved(productId);
                showCart(); // Actualizar la vista del carrito
            });
        });
    }
});

// Función para mostrar el carrito (exportada para uso externo)
function showCart() {
    const cart = CartUtils.getCartItems();
    const savedForLater = CartUtils.getSavedItems();
    
    // Crear el elemento del carrito si no existe
    let cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        const cartHTML = showCartComponent(cart, savedForLater);
        // Verificar que cartHTML no sea undefined
        if (cartHTML && typeof cartHTML === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cartHTML.trim(); // Eliminar espacios en blanco
            
            // Verificar que haya contenido antes de intentar adjuntar
            if (tempDiv.firstElementChild) {
                document.body.appendChild(tempDiv.firstElementChild);
                cartModal = document.getElementById('cartModal');
            } else {
                console.error('No se pudo crear el carrito: HTML inválido');
                return;
            }
        } else {
            console.error('No se pudo crear el carrito: componente no válido');
            return;
        }
    }
    
    // Mostrar el carrito
    if (cartModal) {
        cartModal.style.display = 'block';
        
        // Adjuntar event listeners después de mostrar el carrito
        setTimeout(() => {
            // Re-adjuntar event listeners para los nuevos elementos
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const item = CartUtils.getCartItems().find(item => item.id === productId);
                    if (item && item.quantity > 1) {
                        CartUtils.updateQuantity(productId, item.quantity - 1);
                        showCart(); // Actualizar la vista del carrito
                    } else if (item) {
                        CartUtils.removeFromCart(productId);
                        showCart(); // Actualizar la vista del carrito
                    }
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const item = CartUtils.getCartItems().find(item => item.id === productId);
                    if (item) {
                        CartUtils.updateQuantity(productId, item.quantity + 1);
                        showCart(); // Actualizar la vista del carrito
                    }
                });
            });
            
            // Botones de eliminar
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    CartUtils.removeFromCart(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de guardar para más tarde
            document.querySelectorAll('.save-for-later').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    CartUtils.saveForLater(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de mover al carrito (desde guardado para más tarde)
            document.querySelectorAll('.move-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    CartUtils.moveToCart(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de eliminar de guardado para más tarde
            document.querySelectorAll('.remove-saved-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    CartUtils.removeFromSaved(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botón de cerrar carrito
            const cartClose = document.querySelector('.cart-close');
            if (cartClose) {
                cartClose.addEventListener('click', function() {
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.style.display = 'none';
                    }
                });
            }
            
            // Botón de checkout
            const checkoutButton = document.querySelector('.checkout-button');
            if (checkoutButton) {
                checkoutButton.addEventListener('click', function() {
                    const cart = CartUtils.getCartItems();
                    
                    if (cart.length === 0) {
                        showNotification('Tu carrito está vacío', 'error');
                        return;
                    }
                    
                    // Verificar si el usuario está logueado
                    if (!isAuthenticated()) {
                        showNotification('Debes iniciar sesión para continuar con el pedido', 'error');
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
            
            // Botón para vaciar carrito
            const clearCartButton = document.querySelector('.clear-cart');
            if (clearCartButton) {
                clearCartButton.addEventListener('click', function() {
                    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                        CartUtils.clearCart();
                        showCart(); // Actualizar la vista del carrito
                    }
                });
            }
        }, 100);
    }
}

// Escuchar evento personalizado para mostrar el carrito
document.addEventListener('showCart', function() {
    showCart();
});

export { showCart };