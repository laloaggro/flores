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
      
      // Cargar imágenes de flores si no hay imágenes en caché
      if (this.flowerImages.length === 0) {
        await this.loadFlowerImages();
      }
      
      // Asignar imágenes de flores a los productos si no tienen imagen válida
      const productsWithImages = data.products.map(product => {
        // Si el producto no tiene una imagen válida, asignar una de la API de flores
        if (!product.image_url || product.image_url.includes('placeholder') || product.image_url.includes('product_')) {
          product.image_url = this.getNextFlowerImage();
        }
        return product;
      });
      
      // Actualizar los datos con los productos modificados
      const updatedData = {
        ...data,
        products: productsWithImages
      };
      
      // Guardar en caché solo si es la primera página sin filtros
      if (!category && !search && page === 1) {
        this.cachedProducts = updatedData.products;
      }
      
      this.isLoading = false;
      console.log('Productos cargados exitosamente:', updatedData.products.length);
      return updatedData;
    } catch (error) {
      this.isLoading = false;
      console.error('Error al cargar productos:', error);
      throw error;
    }
  }

  // Función para cargar imágenes de flores de una API externa
  async loadFlowerImages() {
    // Comenzar con un conjunto de imágenes locales verificadas
    this.flowerImages = [
      'https://images.unsplash.com/photo-1597221335472-6f87484f8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488953269-05061b49f8a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488952230-c25d5c9dcd25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1597221335472-6f87484f8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488953269-05061b49f8a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1593488952230-c25d5c9dcd25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
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