// productManager.js - Módulo unificado para la gestión de productos

import { showNotification, formatPrice } from './utils.js';
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
      // Corregir la URL para apuntar correctamente al backend
      let url = `/api/products?page=${page}&limit=${limit}`;
      
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
    const localFlowerImages = [
      'assets/images/flowers/flower1.svg',
      'assets/images/flowers/flower2.svg',
      'assets/images/flowers/flower3.svg',
      'assets/images/flowers/flower4.svg',
      'assets/images/flowers/flower5.svg',
      'assets/images/flowers/flower6.svg',
      'assets/images/flowers/flower7.svg',
      'assets/images/flowers/flower8.svg',
      'assets/images/flowers/flower9.svg',
      'assets/images/flowers/flower10.svg'
    ];
    
    // Verificar que las imágenes locales existan y tengan tamaño > 0
    this.flowerImages = [];
    
    for (const imagePath of localFlowerImages) {
      try {
        // Verificar si la imagen existe y tiene contenido
        const response = await fetch(imagePath);
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            this.flowerImages.push(imagePath);
          } else {
            console.warn(`Imagen local ${imagePath} está vacía o corrupta`);
          }
        } else {
          console.warn(`Imagen local ${imagePath} no encontrada`);
        }
      } catch (error) {
        console.warn(`Error al verificar imagen local ${imagePath}:`, error);
      }
    }
    
    // Si no hay imágenes locales válidas, usar imágenes SVG como respaldo
    if (this.flowerImages.length === 0) {
      console.log('No se encontraron imágenes locales válidas, usando imágenes SVG de respaldo');
      this.flowerImages = [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="90" fill="%23ffcc80"/%3E%3Ccircle cx="120" cy="130" r="12" fill="%23ff9800"/%3E%3Ccircle cx="180" cy="130" r="12" fill="%23ff9800"/%3E%3Cpath d="M150 180 Q170 210 150 240 Q130 210 150 180" fill="%23ff9800"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="85" fill="%23ce93d8"/%3E%3Ccircle cx="130" cy="140" r="10" fill="%237b1fa2"/%3E%3Ccircle cx="170" cy="140" r="10" fill="%237b1fa2"/%3E%3Cpath d="M150 170 Q165 190 150 210 Q135 190 150 170" fill="%237b1fa2"/%3E%3C/svg%3E'
      ];
    }
    
    console.log(`Cargadas ${this.flowerImages.length} imágenes de flores`);
  }

  // Función para obtener la siguiente imagen de flor (rotando)
  getNextFlowerImage() {
    if (this.flowerImages.length === 0) {
      // Si no hay imágenes, devolver una imagen SVG por defecto
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23eeeeee"/%3E%3Ctext x="150" y="160" font-family="Arial" font-size="24" text-anchor="middle" fill="%23999999"%3ESin imagen%3C/text%3E%3C/svg%3E';
    }
    
    const image = this.flowerImages[this.lastImageIndex];
    this.lastImageIndex = (this.lastImageIndex + 1) % this.flowerImages.length;
    return image;
  }

  // Función para obtener todas las categorías
  async getCategories() {
    try {
      // Corregir la URL para apuntar correctamente al backend
      const response = await fetch('/api/products/categories');
      
      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categorías cargadas exitosamente:', data.categories.length);
      return data.categories;
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      throw error;
    }
  }

  // Función para formatear precios
  formatPrice(price) {
    return formatPrice(price);
  }

  // Función para mostrar notificaciones
  showNotification(message, type) {
    showNotification(message, type);
  }
}

// Crear una instancia global del ProductManager
const productManager = new ProductManager();

// Exportar la instancia y funciones necesarias
export default productManager;
export { productManager };