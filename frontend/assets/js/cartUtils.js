import Cart, { saveCartToLocalStorage, loadCartFromLocalStorage } from '../components/Cart.js';
import { showNotification } from './utils.js';

// Utilidades para el carrito de compras
const CartUtils = {
    // Inicializar el carrito
    init() {
        this.cartItems = loadCartFromLocalStorage();
        this.savedForLater = this.loadSavedItems();
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
            showNotification(`${product.name} cantidad actualizada en el carrito`, 'success');
        } else {
            // Agregar nuevo item al carrito
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
            showNotification(`${product.name} agregado al carrito`, 'success');
        }
        
        // Guardar en localStorage y actualizar la interfaz
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
        this.renderCart();
    },

    // Eliminar un producto del carrito
    removeFromCart(productId) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item) {
            this.cartItems = this.cartItems.filter(item => item.id != productId);
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            this.renderCart();
            showNotification(`${item.name} eliminado del carrito`, 'info');
        }
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
                this.renderCart();
                showNotification(`Cantidad de ${item.name} actualizada`, 'success');
            }
        }
    },

    // Vaciar el carrito
    clearCart() {
        this.cartItems = [];
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
        this.renderCart();
        showNotification('Carrito vaciado', 'info');
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
            
            // Si se abre el carrito, renderizar su contenido
            if (cartModal.classList.contains('show')) {
                this.renderCart();
            }
        }
    },

    // Renderizar el contenido del carrito
    renderCart() {
        const cartContainer = document.getElementById('cartContainer');
        if (cartContainer) {
            cartContainer.innerHTML = Cart(this.cartItems, this.savedForLater);
            this.attachCartEventListeners();
        }
    },

    // Adjuntar event listeners al carrito
    attachCartEventListeners() {
        // Remover event listeners previos para evitar fugas de memoria
        this.removeCartEventListeners();
        
        // Cerrar el carrito
        const closeCartButton = document.querySelector('.cart-close');
        if (closeCartButton) {
            // Usar funciones con nombre para permitir eliminación
            closeCartButton._toggleCart = () => {
                this.toggleCartModal();
            };
            
            // Permitir cerrar con tecla Enter
            closeCartButton._keydownHandler = (e) => {
                if (e.key === 'Enter') {
                    this.toggleCartModal();
                }
            };
            
            closeCartButton.addEventListener('click', closeCartButton._toggleCart);
            closeCartButton.addEventListener('keydown', closeCartButton._keydownHandler);
        }

        // Manejar clics en botones de cantidad
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const item = this.cartItems.find(item => item.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                const item = this.cartItems.find(item => item.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Manejar eliminación de productos
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeFromCart(productId);
            });
        });

        // Manejar guardar para más tarde
        document.querySelectorAll('.save-for-later-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.saveForLater(productId);
            });
        });

        // Manejar mover al carrito desde guardados
        document.querySelectorAll('.move-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.saved-item').dataset.id;
                this.moveToCart(productId);
            });
        });

        // Manejar eliminación de items guardados
        document.querySelectorAll('.remove-saved-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.saved-item').dataset.id;
                this.removeSavedItem(productId);
            });
        });

        // Manejar el botón de checkout
        const checkoutButton = document.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.cartItems.length > 0) {
                    // Aquí iría la lógica de checkout
                    showNotification('Procediendo al pedido...', 'info');
                    // Por ahora solo mostramos un mensaje
                }
            });
        }

        // Cerrar el carrito al hacer clic fuera del contenido
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.toggleCartModal();
                }
            });
        }
    },


    // Guardar un producto para más tarde
    saveForLater(productId) {
        const itemIndex = this.cartItems.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            const item = this.cartItems.splice(itemIndex, 1)[0];
            this.savedForLater.push(item);
            saveCartToLocalStorage(this.cartItems);
            this.saveSavedItems();
            this.updateCartCount();
            this.renderCart();
            showNotification(`${item.name} guardado para más tarde`, 'success');
        }
    },

    // Mover un producto de guardado para más tarde al carrito
    moveToCart(productId) {
        const itemIndex = this.savedForLater.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            const item = this.savedForLater.splice(itemIndex, 1)[0];
            this.cartItems.push(item);
            saveCartToLocalStorage(this.cartItems);
            this.saveSavedItems();
            this.updateCartCount();
            this.renderCart();
            showNotification(`${item.name} movido al carrito`, 'success');
        }
    },

    // Eliminar un producto guardado para más tarde
    removeSavedItem(productId) {
        this.savedForLater = this.savedForLater.filter(item => item.id != productId);
        this.saveSavedItems();
        this.renderCart();
        showNotification('Producto eliminado de guardados', 'info');
    },

    // Cargar items guardados para más tarde
    loadSavedItems() {
        try {
            const savedItems = localStorage.getItem('savedForLater');
            return savedItems ? JSON.parse(savedItems) : [];
        } catch (error) {
            console.error('Error al cargar items guardados:', error);
            return [];
        }
    },

    // Guardar items guardados para más tarde
    saveSavedItems() {
        try {
            localStorage.setItem('savedForLater', JSON.stringify(this.savedForLater));
        } catch (error) {
            console.error('Error al guardar items guardados:', error);
        }
    }
};

// Inicializar el carrito cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    CartUtils.init();
    return CartUtils;
});

export default CartUtils;