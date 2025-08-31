const PLACEHOLDER_IMAGE = 'assets/images/placeholder.svg';

class ProductCard extends HTMLElement {
    
    /**
     * Renderiza la imagen del producto con manejo de errores
     * @param {string} imageUrl - URL de la imagen
     * @param {string} altText - Texto alternativo
     * @returns {string} HTML de la imagen
     */
    static renderImage(imageUrl, altText) {
        return `
            <img 
                src="${imageUrl}" 
                alt="${altText}" 
                loading="lazy" 
                width="300" 
                height="200"
                onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror = null;">
        `;
    }
    
    /**
     * Se ejecuta cuando el elemento se conecta al DOM
     * Renderiza el contenido de la tarjeta de producto
     */
    connectedCallback() {
        // Verificar si ya se ha renderizado el contenido
        if (this.hasAttribute('rendered')) {
            return;
        }

        const product = this.product;
        
        // Marcar como renderizado
        this.setAttribute('rendered', '');

        // Si no hay producto, mostrar una tarjeta vacía o con contenido de carga
        if (!product) {
            this.innerHTML = `
                <div class="product-card">
                    <div class="product-image">
                        ${ProductCard.renderImage(PLACEHOLDER_IMAGE, 'Producto no disponible')}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">Producto no disponible</h3>
                        <p class="product-description">La información del producto no está disponible en este momento.</p>
                        <div class="product-price">-</div>
                        <button class="btn btn-primary add-to-cart" disabled>
                            <i class="fas fa-shopping-cart"></i> Agregar al carrito
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Renderizar el contenido del producto
        this.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    ${ProductCard.renderImage(
                        product.image_url || product.image || PLACEHOLDER_IMAGE,
                        product.name
                    )}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || 'Sin descripción disponible'}</p>
                    <div class="product-price">$${parseInt(product.price || 0).toLocaleString('es-CL')}</div>
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Agregar al carrito
                    </button>
                    <button class="btn btn-secondary add-to-wishlist" data-product-id="${product.id}">
                        <i class="far fa-heart"></i> Agregar a deseos
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Obtiene la información del producto
     * @returns {Object} Información del producto
     */
    get product() {
        return this._product;
    }

    /**
     * Establece la información del producto y actualiza la interfaz
     * @param {Object} value - Información del producto
     */
    set product(value) {
        this._product = value;
        this.connectedCallback();
    }
}

// Registrar el componente personalizado
customElements.define('product-card', ProductCard);

export default ProductCard;