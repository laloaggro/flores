// cartUtils.js - Utilidades para el carrito de compras
import { showNotification } from './utils.js';

/**
 * Funciones para guardar y cargar el carrito desde localStorage
 */

function saveCartToLocalStorage(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
}

// Utilidades para el carrito de compras
const CartUtils = {
    cartItems: [],
    savedForLater: [],
    
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

    // Guardar para más tarde
    saveForLater(productId) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item) {
            // Eliminar del carrito
            this.cartItems = this.cartItems.filter(item => item.id != productId);
            
            // Agregar a guardados para más tarde
            this.savedForLater.push(item);
            
            // Guardar en localStorage
            saveCartToLocalStorage(this.cartItems);
            this.saveSavedItems();
            
            // Actualizar interfaz
            this.updateCartCount();
            this.renderCart();
            
            showNotification(`${item.name} guardado para más tarde`, 'success');
        }
    },

    // Mover de guardado para más tarde al carrito
    moveToCart(productId) {
        const item = this.savedForLater.find(item => item.id == productId);
        if (item) {
            // Eliminar de guardados para más tarde
            this.savedForLater = this.savedForLater.filter(item => item.id != productId);
            
            // Agregar al carrito
            this.cartItems.push(item);
            
            // Guardar en localStorage
            saveCartToLocalStorage(this.cartItems);
            this.saveSavedItems();
            
            // Actualizar interfaz
            this.updateCartCount();
            this.renderCart();
            
            showNotification(`${item.name} movido al carrito`, 'success');
        }
    },

    // Eliminar de guardado para más tarde
    removeFromSaved(productId) {
        const item = this.savedForLater.find(item => item.id == productId);
        if (item) {
            this.savedForLater = this.savedForLater.filter(item => item.id != productId);
            this.saveSavedItems();
            this.renderCart();
            showNotification(`${item.name} eliminado`, 'info');
        }
    },

    // Actualizar contador del carrito
    updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    },

    // Renderizar carrito
    renderCart() {
        // Esta función será implementada en cart.js
    },

    // Cargar items guardados para más tarde
    loadSavedItems() {
        const savedItems = localStorage.getItem('savedForLater');
        return savedItems ? JSON.parse(savedItems) : [];
    },

    // Guardar items guardados para más tarde
    saveSavedItems() {
        localStorage.setItem('savedForLater', JSON.stringify(this.savedForLater));
    },

    // Obtener items guardados para más tarde
    getSavedItems() {
        return this.savedForLater;
    }
};

// Exportar CartUtils y funciones auxiliares
export default CartUtils;
export { saveCartToLocalStorage, loadCartFromLocalStorage };