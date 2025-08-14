import Cart, { saveCartToLocalStorage, loadCartFromLocalStorage } from '../../components/Cart.js';

// Utilidades para el carrito de compras
const CartUtils = {
    // Inicializar el carrito
    init() {
        this.cartItems = loadCartFromLocalStorage();
        this.updateCartCount();
    },

    // Obtener items del carrito
    getCartItems() {
        return this.cartItems || [];
    },

    // Agregar un producto al carrito
    addToCart(product) {
        // Verificar si el producto ya está en el carrito
        const existingItem = this.cartItems.find(item => item.id == product.id);
        
        if (existingItem) {
            // Incrementar la cantidad si ya existe
            existingItem.quantity += 1;
        } else {
            // Agregar nuevo item al carrito
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }
        
        // Guardar en localStorage y actualizar la interfaz
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
        
        // Mostrar mensaje de confirmación
        this.showMessage(`${product.name} agregado al carrito`, 'success');
    },

    // Eliminar un producto del carrito
    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.id != productId);
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
    },

    // Actualizar la cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                saveCartToLocalStorage(this.cartItems);
            }
        }
    },

    // Vaciar el carrito
    clearCart() {
        this.cartItems = [];
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
    },

    // Actualizar el contador del carrito en la interfaz
    updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    },

    // Mostrar/ocultar el modal del carrito
    toggleCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.toggle('show');
            document.body.classList.toggle('cart-open');
        }
    },

    // Renderizar el contenido del carrito
    renderCart() {
        const cartContainer = document.getElementById('cartContainer');
        if (cartContainer) {
            cartContainer.innerHTML = Cart(this.cartItems);
            this.attachCartEventListeners();
        }
    },

    // Adjuntar event listeners al carrito
    attachCartEventListeners() {
        // Cerrar el carrito
        const closeCartButton = document.querySelector('.cart-close');
        if (closeCartButton) {
            closeCartButton.addEventListener('click', () => this.toggleCartModal());
        }

        // Botones de aumentar/disminuir cantidad
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const item = this.cartItems.find(item => item.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                    this.renderCart();
                }
            });
        });

        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const item = this.cartItems.find(item => item.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                    this.renderCart();
                }
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeFromCart(productId);
                this.renderCart();
            });
        });

        // Botón de proceder al pedido
        const checkoutButton = document.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.cartItems.length > 0) {
                    window.location.href = 'checkout.html';
                }
            });
        }
    },

    // Mostrar mensajes al usuario
    showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type}`;
        messageElement.textContent = message;
        
        // Agregar al body
        document.body.appendChild(messageElement);
        
        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    },

    // Calcular el total del carrito
    calculateTotal() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
};

// Inicializar el carrito cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    CartUtils.init();
});

export default CartUtils;