// productManager.js - Gestión de productos y carga de datos
import { showNotification, updateCartCount } from './utils.js';

// Determinar la URL base del API según el entorno
const getApiBaseUrl = () => {
  // En producción, usar la URL del backend en Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Cambia esta URL por la URL real de tu backend en Render
    return 'https://arreglos-victoria-backend.onrender.com';
  }
  
  // En desarrollo, usar localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

class ProductManager {
  constructor() {
    this.currentPage = 1;
    this.currentCategory = '';
    this.currentSearch = '';
    this.isLoading = false;
    this.cachedProducts = [];
    this.flowerImages = [];
    this.imageIndex = 0;
  }

  // Función para cargar productos desde el backend
  async loadProducts(page = 1, category = '', search = '', limit = 8) {
    // Si ya hay una solicitud en curso, esperar un momento para evitar múltiples solicitudes
    if (this.isLoading) {
      // Esperar un momento y luego continuar
      console.log('Ya hay una solicitud en curso, esperando...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Si hay productos en caché y no hay filtros, usarlos
    if (this.cachedProducts.length > 0 && !category && !search && page === 1) {
      console.log('Usando productos en caché');
      return {
        products: this.cachedProducts,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: this.cachedProducts.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }

    // Iniciar carga
    this.isLoading = true;
    console.log('Iniciando carga de productos desde la base de datos');

    try {
      let url = `${API_BASE_URL}/api/products?page=${page}&limit=${limit}`;
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      console.log('URL de solicitud:', url);
      
      // Aplicar un timeout de 5 segundos a la solicitud
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cargar imágenes de flores si no hay imágenes en caché
      if (this.flowerImages.length === 0) {
        // Comenzar con un conjunto de imágenes locales verificadas
        const localImages = [
          '/assets/images/flowers/flower1.svg',
          '/assets/images/flowers/flower2.svg',
          '/assets/images/flowers/flower3.svg',
          '/assets/images/flowers/flower4.svg',
          '/assets/images/flowers/flower5.svg',
          '/assets/images/flowers/flower6.svg',
          '/assets/images/flowers/flower7.svg',
          '/assets/images/flowers/flower8.svg',
          '/assets/images/flowers/flower9.svg',
          '/assets/images/flowers/flower10.svg'
        ];
        
        // Usar todas las imágenes locales como válidas sin verificar (para mejorar el rendimiento)
        // Las imágenes locales ya fueron verificadas previamente
        this.flowerImages = localImages;
      }
      
      
      // Guardar en caché solo si es la primera página sin filtros
      if (!category && !search && page === 1) {
        this.cachedProducts = data.products;
      }
      
      this.isLoading = false;
      console.log('Productos cargados exitosamente:', data.products.length);
      return data;
    } catch (error) {
      this.isLoading = false;
      console.error('Error al cargar productos:', error);
      throw error;
    }
  }


  // Función para obtener la siguiente imagen de flor en la secuencia
  getNextFlowerImage() {
    if (this.flowerImages.length === 0) {
      // Si no hay imágenes, usar una imagen de marcador de posición
      return '/assets/images/default-avatar.svg';
    }
    
    const image = this.flowerImages[this.imageIndex];
    this.imageIndex = (this.imageIndex + 1) % this.flowerImages.length;
    return image;
  }

  // Función para renderizar productos en la página
  renderProducts(products, container) {
    if (!container) return;
    
    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
      return;
    }
    
    container.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='/assets/images/default-avatar.svg'; this.onerror=null;">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-details">
            <span class="detail-item"><i class="fas fa-tag"></i> ${product.category}</span>
            <span class="detail-item"><i class="fas fa-ruler-combined"></i> ${product.size || 'Tamaño estándar'}</span>
          </div>
          <span class="price">$${parseFloat(product.price).toLocaleString('es-CL')}</span>
          <button class="btn btn-secondary add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
            <i class="fas fa-shopping-cart"></i> Agregar
          </button>
        </div>
      </div>
    `).join('');
  }

  // Función para agregar producto al carrito
  addToCart(product) {
    CartUtils.addToCart(product);
  }

  // Función para obtener las categorías de productos
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`);
      }
      
      const data = await response.json();
      const categories = data.categories || [];
      console.log('Categorías cargadas exitosamente:', categories.length);
      return categories;
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      throw error;
    }
  }

  // Función para limpiar la caché
  clearCache() {
    this.cachedProducts = null;
  }
}

// Exportar una instancia única
const productManager = new ProductManager();
export default productManager;