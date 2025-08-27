// cartUtils.js - Utilidades para el carrito de compras
import { showNotification } from './utils.js';

/**
 * Funciones para guardar y cargar el carrito desde localStorage
 */

function saveCartToLocalStorage(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Carrito guardado en localStorage:', cart);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        showNotification('Error al guardar el carrito', 'error');
    }
}

function loadCartFromLocalStorage() {
    try {
        const cart = localStorage.getItem('cart');
        const parsedCart = cart ? JSON.parse(cart) : [];
        console.log('Carrito cargado de localStorage:', parsedCart);
        return parsedCart;
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        showNotification('Error al cargar el carrito', 'error');
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
        console.log('Carrito inicializado con', this.cartItems.length, 'items');
    },

    // Obtener items del carrito
    getCartItems() {
        // Si cartItems está vacío, intentar cargar desde localStorage
        if (!this.cartItems || this.cartItems.length === 0) {
            this.cartItems = loadCartFromLocalStorage();
        }
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
            console.log(`Cantidad actualizada para ${product.name}. Nueva cantidad: ${existingItem.quantity}`);
        } else {
            // Agregar nuevo item al carrito
            const newItem = {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            };
            this.cartItems.push(newItem);
            showNotification(`${product.name} agregado al carrito`, 'success');
            console.log(`Producto agregado al carrito:`, newItem);
            
            // Mostrar notificación en la tarjeta del producto
            const notification = document.getElementById(`notification-${product.id}`);
            if (notification) {
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            }
        }
        
        // Guardar carrito y actualizar contador
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
    },

    // Eliminar un producto del carrito
    removeFromCart(productId) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item) {
            this.cartItems = this.cartItems.filter(item => item.id != productId);
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            this.renderCart();
            showNotification('Producto eliminado del carrito', 'info');
            console.log(`Producto ${productId} eliminado del carrito`);
        }
    },

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            this.renderCart();
            console.log(`Cantidad actualizada para ${item.name}. Nueva cantidad: ${newQuantity}`);
        } else if (item && newQuantity <= 0) {
            this.removeFromCart(productId);
        }
    },

    // Guardar item para más tarde
    saveForLater(productId) {
        const itemIndex = this.cartItems.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            const item = this.cartItems.splice(itemIndex, 1)[0];
            this.savedForLater.push(item);
            this.saveSavedItems();
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            this.renderCart();
            showNotification(`${item.name} guardado para más tarde`, 'success');
            console.log(`Producto ${item.name} guardado para más tarde`);
        }
    },

    // Mover item de guardado para más tarde al carrito
    moveToCart(productId) {
        const itemIndex = this.savedForLater.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            const item = this.savedForLater.splice(itemIndex, 1)[0];
            this.cartItems.push(item);
            this.saveSavedItems();
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            this.renderCart();
            showNotification(`${item.name} movido al carrito`, 'success');
            console.log(`Producto ${item.name} movido al carrito`);
        }
    },

    // Cargar items guardados para más tarde
    loadSavedItems() {
        try {
            const saved = localStorage.getItem('savedForLater');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved items:', error);
            return [];
        }
    },

    // Guardar items guardados para más tarde
    saveSavedItems() {
        try {
            localStorage.setItem('savedForLater', JSON.stringify(this.savedForLater));
        } catch (error) {
            console.error('Error saving saved items:', error);
        }
    },

    // Obtener items guardados para más tarde
    getSavedItems() {
        return this.savedForLater;
    },

    // Vaciar el carrito
    clearCart() {
        this.cartItems = [];
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
        this.renderCart();
        showNotification('Carrito vaciado', 'info');
        console.log('Carrito vaciado');
    },

    // Actualizar contador del carrito
    updateCartCount() {
        const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        console.log('Contador del carrito actualizado:', totalItems);
    },

    // Renderizar carrito
    renderCart() {
        // Esta función será implementada en cart.js
    }
};

export default CartUtils;