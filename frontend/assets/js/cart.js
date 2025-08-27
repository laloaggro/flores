// cart.js - Funcionalidad del carrito de compras
import CartUtils from './cartUtils.js';
import Cart from '../../components/Cart.js';
import { isAuthenticated, showNotification } from './utils.js';

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
});

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
    
    // Crear el elemento del carrito si no existe
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
                } else {
                    console.error('No se pudo crear el carrito: HTML inválido');
                    return;
                }
            } else {
                console.error('No se pudo crear el carrito: componente no válido');
                return;
            }
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return;
        }
    }
    
    // Mostrar el carrito
    if (cartModal) {
        cartModal.style.display = 'block';
        
        // Adjuntar event listeners después de mostrar el carrito
        setTimeout(() => {
            // Re-adjuntar event listeners para los nuevos elementos
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.decrease').dataset.id);
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
            
            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.increase').dataset.id);
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
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.remove-item').dataset.id);
                    CartUtils.removeFromCart(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de guardar para más tarde
            document.querySelectorAll('.save-for-later').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.save-for-later').dataset.id);
                    CartUtils.saveForLater(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de mover al carrito (desde guardado para más tarde)
            document.querySelectorAll('.move-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.move-to-cart').dataset.id);
                    CartUtils.moveToCart(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botones de eliminar de guardado para más tarde
            document.querySelectorAll('.remove-saved-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(e.target.closest('.remove-saved-item').dataset.id);
                    CartUtils.removeFromSaved(productId);
                    showCart(); // Actualizar la vista del carrito
                });
            });
            
            // Botón de cerrar carrito
            const cartClose = document.querySelector('.cart-close');
            if (cartClose) {
                cartClose.addEventListener('click', function(e) {
                    e.preventDefault();
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.style.display = 'none';
                    }
                });
            }
            
            // Botón de checkout
            const checkoutButton = document.querySelector('.checkout-button');
            if (checkoutButton) {
                checkoutButton.addEventListener('click', function(e) {
                    e.preventDefault();
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
                clearCartButton.addEventListener('click', function(e) {
                    e.preventDefault();
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