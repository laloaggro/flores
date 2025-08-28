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
    
    // Función para formatear precios
    formatPrice(price) {
        // Formatear como moneda chilena sin decimales
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    },

    // Inicializar carrito
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
                image: product.image_url || product.image || './assets/images/placeholder.svg',
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
        
        // Disparar evento de actualización del carrito
        window.dispatchEvent(new CustomEvent('cartUpdated'));
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
            
            // Disparar evento de actualización del carrito
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    },

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        const item = this.cartItems.find(item => item.id == productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            saveCartToLocalStorage(this.cartItems);
            this.updateCartCount();
            
            // Actualizar solo la cantidad específica en la interfaz
            this.updateQuantityInUI(productId, newQuantity);
            
            console.log(`Cantidad actualizada para ${item.name}. Nueva cantidad: ${newQuantity}`);
            
            // Disparar evento de actualización del carrito
            window.dispatchEvent(new CustomEvent('cartUpdated'));
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
            
            // Actualizar solo la interfaz sin recargar todo el carrito
            this.updateSavedItemsInUI();
            this.updateCartItemsInUI();
            
            showNotification(`${item.name} guardado para más tarde`, 'success');
            console.log(`Producto ${item.name} guardado para más tarde`);
            
            // Disparar evento de actualización del carrito
            window.dispatchEvent(new CustomEvent('cartUpdated'));
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
            
            // Actualizar solo la interfaz sin recargar todo el carrito
            this.updateSavedItemsInUI();
            this.updateCartItemsInUI();
            
            showNotification(`${item.name} movido al carrito`, 'success');
            console.log(`Producto ${item.name} movido al carrito`);
            
            // Disparar evento de actualización del carrito
            window.dispatchEvent(new CustomEvent('cartUpdated'));
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

    // Eliminar items guardados para más tarde
    removeFromSaved(productId) {
        const itemIndex = this.savedForLater.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            const item = this.savedForLater.splice(itemIndex, 1)[0];
            this.saveSavedItems();
            
            // Actualizar solo la interfaz sin recargar todo el carrito
            this.updateSavedItemsInUI(() => {
                showNotification(`${item.name} eliminado de guardados para más tarde`, 'info');
                console.log(`Producto ${item.name} eliminado de guardados para más tarde`);
            });
            
            // Disparar evento de actualización del carrito
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    },

    // Vaciar el carrito
    clearCart() {
        this.cartItems = [];
        saveCartToLocalStorage(this.cartItems);
        this.updateCartCount();
        this.renderCart();
        showNotification('Carrito vaciado', 'info');
        console.log('Carrito vaciado');
        
        // Disparar evento de actualización del carrito
        window.dispatchEvent(new CustomEvent('cartUpdated'));
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
    renderCart(callback = null) {
        // Esta función será implementada en cart.js
        import('../../components/Cart.js').then((module) => {
            const Cart = module.default;
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.innerHTML = Cart(this.cartItems, this.savedForLater);
                // Adjuntar event listeners después de renderizar
                setTimeout(() => {
                    Cart.attachEventListeners();
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }, 0);
            }
        }).catch((error) => {
            console.error('Error al cargar el componente Cart:', error);
        });
    },

    // Actualizar solo la cantidad específica en la interfaz
    updateQuantityInUI(productId, newQuantity) {
        // Buscar el elemento de cantidad específico en la interfaz
        const quantityElements = document.querySelectorAll(`[data-id="${productId}"] .item-quantity .quantity`);
        quantityElements.forEach(element => {
            const itemElement = element.closest('[data-id]');
            if (itemElement && parseInt(itemElement.getAttribute('data-id')) === productId) {
                element.textContent = newQuantity;
                console.log(`[updateQuantityInUI] Cantidad actualizada en UI para producto ID ${productId}: ${newQuantity}`);
                
                // Actualizar también el total del item
                const item = this.cartItems.find(item => item.id == productId);
                if (item) {
                    const totalElement = itemElement.querySelector('.item-total span');
                    const price = item.price * newQuantity;

                    if (totalElement) {
                        totalElement.textContent = this.formatPrice(price);
                        console.log(`[updateQuantityInUI] Precio total actualizado en span para producto ID ${productId}`);
                    } else {
                        const directTotalElement = itemElement.querySelector('.item-total');
                        if (directTotalElement) {
                            directTotalElement.textContent = this.formatPrice(price);
                            console.log(`[updateQuantityInUI] Precio total actualizado directamente para producto ID ${productId}`);
                        }
                    }
                }
            }
        });

        // Solo actualizar el total general si hay cambios
        if (this.cartItems.some(item => item.id == productId && item.quantity !== newQuantity)) {
            this.updateCartTotal();
        }
    },
    
    // Actualizar el total general del carrito
    updateCartTotal() {
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const formattedTotal = this.formatPrice(total);

        const totalElement = document.querySelector('.cart-total-amount');
        const totalAmountElement = document.querySelector('.total-amount');

        // Actualizar total en el carrito (formato con clase .cart-total-amount)
        if (totalElement) {
            totalElement.textContent = formattedTotal;
            console.log(`[updateCartTotal] Total del carrito actualizado en .cart-total-amount: ${formattedTotal}`);
        }

        // Actualizar total en el carrito (formato con clase .total-amount)
        if (totalAmountElement) {
            totalAmountElement.textContent = formattedTotal;
            console.log(`[updateCartTotal] Total del carrito actualizado en .total-amount: ${formattedTotal}`);
        }

        // También actualizar en el contador del header
        this.updateCartCount();
    },

    // Actualizar solo la interfaz de items guardados
    updateSavedItemsInUI(callback = null) {
        // Importar el componente Cart para usar su función de renderizado
        import('../../components/Cart.js').then((module) => {
            const Cart = module.default;
            
            // Actualizar solo la sección de items guardados
            const savedItemsContainer = document.querySelector('.saved-items');
            if (savedItemsContainer) {
                savedItemsContainer.innerHTML = Cart.renderSavedItems ? 
                    Cart.renderSavedItems(this.savedForLater) : 
                    this.savedForLater.map(item => `
                        <div class="saved-item" data-id="${item.id}">
                            <div class="item-image">
                                <img src="${item.image || './assets/images/placeholder.svg'}" 
                                    alt="${item.name}" 
                                    onerror="this.src='./assets/images/placeholder.svg'">
                            </div>
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <p class="item-price">${this.formatPrice(item.price)}</p>
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
                
                // Si no hay items guardados, mostrar mensaje
                if (this.savedForLater.length === 0) {
                    savedItemsContainer.innerHTML = '<p class="empty-saved">No hay productos guardados para más tarde</p>';
                }
            }
            
            // Ejecutar callback si está definido
            if (callback && typeof callback === 'function') {
                callback();
            }
        }).catch((error) => {
            console.error('Error al actualizar items guardados:', error);
        });
    },
    
    // Actualizar solo la interfaz de items del carrito
    updateCartItemsInUI() {
        // Importar el componente Cart para usar su función de renderizado
        import('../../components/Cart.js').then((module) => {
            const Cart = module.default;
            
            // Actualizar solo la sección de items del carrito
            const cartItemsContainer = document.querySelector('.cart-items');
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = Cart.renderCartItems ? 
                    Cart.renderCartItems(this.cartItems) : 
                    this.cartItems.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="item-image">
                                <img src="${item.image || './assets/images/placeholder.svg'}" 
                                    alt="${item.name}" 
                                    onerror="this.src='./assets/images/placeholder.svg'">
                            </div>
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <p class="item-price">${this.formatPrice(item.price)}</p>
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
                                <span>${this.formatPrice(item.price * item.quantity)}</span>
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
                
                // Si no hay items en el carrito, mostrar mensaje
                if (this.cartItems.length === 0) {
                    cartItemsContainer.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart fa-3x"></i>
                            <h3>Tu carrito está vacío</h3>
                            <p>Agrega productos para comenzar</p>
                            <a href="products.html" class="btn btn-primary">Ver productos</a>
                        </div>
                    `;
                }
                
                // Actualizar el total del carrito
                this.updateCartTotal();
            }
        }).catch((error) => {
            console.error('Error al actualizar items del carrito:', error);
        });
    },

};

export default CartUtils;