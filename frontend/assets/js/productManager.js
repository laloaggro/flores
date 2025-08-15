// productManager.js - Módulo unificado para la gestión de productos

import { showNotification, formatPrice, API_BASE_URL } from './utils.js';
import CartUtils from './cartUtils.js';

class ProductManager {
  constructor() {
    this.cachedProducts = null;
    this.isLoading = false;
    this.currentPage = 1;
    this.limit = 12;
    this.currentCategory = '';
    this.currentSearch = '';
    this.flowerImages = []; // Caché para imágenes de flores
    this.lastImageIndex = 0; // Índice para rotar imágenes
  }

  // Función para cargar productos desde el backend
  async loadProducts(page = 1, limit = 12, category = '', search = '') {
    // Usar caché si está disponible y no hay filtros
    if (this.cachedProducts && !category && !search && page === 1) {
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

    // Mostrar mensaje de carga si ya está en progreso
    if (this.isLoading) {
      console.log('Carga de productos en progreso');
      return null;
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

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar en caché si es la primera página sin filtros
      if (!category && !search && page === 1) {
        this.cachedProducts = data.products || data;
      }
      
      this.isLoading = false;
      return data;
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.isLoading = false;
      throw error;
    }
  }

  // Inicializar las imágenes de flores
  async initFlowerImages() {
    // Comenzar con un conjunto de imágenes locales verificadas
    this.flowerImages = [
      'https://images.unsplash.com/photo-1597221335472-6f87484f8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488952230-c25d5c9dcd25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488953269-05061b49f8a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1496632237219-0439069605d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488952230-c25d5c9dcd25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1597221335472-6f87484f8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    ];
    
    // Intentar cargar imágenes adicionales de la API de Unsplash
    try {
      const response = await fetch('https://api.unsplash.com/photos/random?query=flowers&count=6&client_id=YOUR_UNSPLASH_ACCESS_KEY');
      if (response.ok) {
        const data = await response.json();
        const newImages = data.map(photo => photo.urls.small);
        this.flowerImages = [...this.flowerImages, ...newImages];
      }
    } catch (error) {
      console.warn('No se pudieron cargar imágenes adicionales de la API de Unsplash:', error);
      // Usar las imágenes locales como respaldo
    }
  }

  // Función para obtener la siguiente imagen de flores en rotación
  getNextFlowerImage() {
    if (this.flowerImages.length === 0) {
      return 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23eee\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23aaa\' font-size=\'30\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    
    const image = this.flowerImages[this.lastImageIndex];
    this.lastImageIndex = (this.lastImageIndex + 1) % this.flowerImages.length;
    return image;
  }

  // Función para cargar un producto específico por ID
  async loadProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar el producto: ${response.status}`);
      }
      
      const product = await response.json();
      
      // Asignar imagen de flor si no tiene una imagen válida
      if (!product.image_url || product.image_url.includes('placeholder') || product.image_url.includes('product_')) {
        product.image_url = this.getNextFlowerImage();
      }
      
      return product;
    } catch (error) {
      console.error('Error al cargar producto por ID:', error);
      throw error;
    }
  }

  // Función para crear un nuevo producto
  async createProduct(productData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto');
      }
      
      const newProduct = await response.json();
      
      // Limpiar caché para forzar recarga
      this.cachedProducts = null;
      
      return newProduct;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Función para actualizar un producto existente
  async updateProduct(id, productData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el producto');
      }
      
      const updatedProduct = await response.json();
      
      // Limpiar caché para forzar recarga
      this.cachedProducts = null;
      
      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Función para eliminar un producto
  async deleteProduct(id) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el producto');
      }
      
      // Limpiar caché para forzar recarga
      this.cachedProducts = null;
      
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Función para cargar categorías
  async loadCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`);
      }
      
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      throw error;
    }
  }

  // Función para inicializar los event listeners para los botones de agregar al carrito
  initCartEventListeners() {
    // Usar event delegation para manejar los clics en botones de agregar al carrito
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        
        // Obtener datos del producto del botón
        const product = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: parseFloat(button.dataset.price),
          image: button.dataset.image
        };
        
        // Agregar al carrito
        CartUtils.addToCart(product);
        
        // Mostrar notificación visual en la tarjeta del producto
        const notification = document.getElementById(`notification-${product.id}`);
        if (notification) {
          notification.style.display = 'block';
          
          // Ocultar la notificación después de 3 segundos
          setTimeout(() => {
            notification.style.display = 'none';
          }, 3000);
        }
        
        // Mostrar notificación global
        showNotification(`${product.name} agregado al carrito`, 'success');
        
        // Actualizar contador del carrito en la UI
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
          const currentCount = parseInt(cartCount.textContent) || 0;
          cartCount.textContent = currentCount + 1;
        }
      }
    });
  }
}

// Crear una instancia única del ProductManager
const productManager = new ProductManager();

// Función para manejar errores de imagen (exportada para uso global)
function handleImageError(img) {
  img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23eee\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23aaa\' font-size=\'30\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E';
}

// Exportar la instancia y la función
export default productManager;
export { handleImageError };