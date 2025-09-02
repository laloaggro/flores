import { formatPrice } from '../assets/js/utils.js';

/**
 * Componente para mostrar una tarjeta de producto
 * Muestra la imagen, nombre, descripción y precio de un producto
 * Incluye un botón para agregar al carrito
 * 
 * Puede usarse como elemento personalizado <product-card></product-card>
 * o programáticamente creando una instancia de la clase ProductCard
 */
class ProductCard extends HTMLElement {
  constructor() {
    super();
    this._product = null;
  }

  /**
   * Método llamado cuando el elemento es conectado al DOM
   * Renderiza el contenido del producto si está disponible
   */
  connectedCallback() {
    // Si no hay producto definido, mostrar un mensaje de error
    if (!this._product) {
      this.innerHTML = `
        <div class="product-card error">
          <p>Error: No se ha definido un producto para mostrar</p>
        </div>
      `;
      return;
    }

    // Renderizar el contenido del producto
    this.innerHTML = `
      <div class="product-card">
        <div class="product-image">
          ${ProductCard.renderImage(
            this._product.image_url || this._product.image,
            this._product.name
          )}
        </div>
        <div class="product-info" style="background-color: white;">
          <h3 class="product-title">${this._product.name}</h3>
          <p class="product-description">${this._product.description || 'Sin descripción disponible'}</p>
          <div class="product-price">${formatPrice(parseFloat(this._product.price || 0))}</div>
          <button class="btn btn-primary add-to-cart" data-product-id="${this._product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza la imagen del producto con fallback
   * @param {string} imageUrl - URL de la imagen del producto
   * @param {string} productName - Nombre del producto (para el atributo alt)
   * @returns {string} HTML de la imagen del producto
   */
  static renderImage(imageUrl, productName) {
    // Determinar la URL de la imagen con fallback
    let finalImageUrl = './assets/images/placeholder.svg';
    
    if (imageUrl) {
      // Asegurarse de que la ruta de la imagen sea correcta
      if (imageUrl.startsWith('/assets/images/')) {
        finalImageUrl = `.${imageUrl}`;
      } else if (imageUrl.startsWith('assets/images/')) {
        finalImageUrl = `./${imageUrl}`;
      } else if (imageUrl.startsWith('./assets/images/') || imageUrl.startsWith('http')) {
        finalImageUrl = imageUrl;
      }
    }
    
    return `<img src="${finalImageUrl}" alt="${productName}" style="background-color: transparent;" onerror="this.src='./assets/images/placeholder.svg'">`;
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