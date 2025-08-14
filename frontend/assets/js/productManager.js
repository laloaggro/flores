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
    const localImages = [
      '/assets/images/products/product_1.jpg',
      '/assets/images/products/product_2.jpg',
      '/assets/images/products/product_3.jpg',
      '/assets/images/products/product_4.jpg',
      '/assets/images/products/product_5.jpg'
    ];
    
    // Filtrar solo las imágenes locales que existen y tienen tamaño válido
    const verifiedLocalImages = localImages.filter(image => {
      // Excluir imágenes que sabemos que tienen tamaño 0KB
      const zeroSizeImages = [
        '/assets/images/products/product_6.jpg'
      ];
      return !zeroSizeImages.includes(image);
    });
    
    this.flowerImages = verifiedLocalImages;
    
    try {
      // Intentar cargar solo unas pocas imágenes de la API de Unsplash
      const flowerImageUrls = [];
      
      // Generar solo 3 URLs de imágenes de flores de Unsplash para reducir solicitudes
      for (let i = 0; i < 3; i++) {
        // Usar parámetros aleatorios para obtener diferentes imágenes
        const randomParam = Math.random().toString(36).substring(2, 15);
        flowerImageUrls.push(`https://source.unsplash.com/300x300/?flower,arrangement&sig=${randomParam}`);
      }
      
      // Verificar si las imágenes se pueden cargar antes de agregarlas
      const verifiedUrls = [];
      for (const url of flowerImageUrls) {
        try {
          // Crear una promesa para verificar si la imagen se puede cargar
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          // Si llegamos aquí, la imagen se cargó correctamente
          verifiedUrls.push(url);
        } catch (error) {
          // Si hay un error, simplemente no agregamos la URL
          // Silenciar estos mensajes para reducir el ruido en la consola
        }
      }
      
      // Agregar las imágenes verificadas al conjunto existente solo si hay al menos una
      if (verifiedUrls.length > 0) {
        this.flowerImages = [...this.flowerImages, ...verifiedUrls];
      }
      
      console.log('Imágenes de flores preparadas:', this.flowerImages.length);
    } catch (error) {
      // Silenciar errores de la API para reducir el ruido en la consola
      // Mantener las imágenes locales verificadas como fallback
    }
  }

  // Función para obtener la siguiente imagen de flor en rotación
  getNextFlowerImage() {
    if (this.flowerImages.length === 0) {
      // Fallback absoluto si no hay imágenes disponibles
      return '/assets/images/default-avatar.svg';
    }
    
    const image = this.flowerImages[this.lastImageIndex];
    this.lastImageIndex = (this.lastImageIndex + 1) % this.flowerImages.length;
    return image;
  }

  // Función para generar HTML de productos
  generateProductsHTML(products) {
    if (!products || products.length === 0) {
      return '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
    }

    return products.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="handleImageError(this)">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-details">
            <span class="detail-item"><i class="fas fa-tag"></i> ${product.category}</span>
            <span class="detail-item"><i class="fas fa-calendar-alt"></i> ${new Date(product.created_at).toLocaleDateString('es-CL')}</span>
          </div>
          <span class="price">$${parseInt(product.price).toLocaleString('es-CL')}</span>
          <button class="btn btn-secondary add-to-cart" 
                  data-id="${product.id}" 
                  data-name="${product.name}" 
                  data-price="${product.price}"
                  data-image="${product.image_url}">
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

  // Función para obtener categorías únicas de productos
  async getCategories() {
    try {
      const response = await fetch('/api/products/categories');
      
      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`);
      }
      
      const data = await response.json();
      return data.categories; // Devolver directamente el array de categorías
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      return [];
    }
  }

  // Función para limpiar la caché
  clearCache() {
    this.cachedProducts = null;
  }
}

// Función para manejar errores de carga de imágenes
function handleImageError(imgElement) {
  console.debug('Error al cargar imagen:', imgElement.src);
  
  // Intentar con una imagen de respaldo verificada
  const fallbackImages = [
    '/assets/images/products/product_2.jpg',
    '/assets/images/products/product_1.jpg',
    '/assets/images/products/product_3.jpg'
  ];
  
  // Encontrar una imagen de respaldo que no sea la que falló
  const workingFallback = fallbackImages.find(img => img !== imgElement.src);
  
  if (workingFallback) {
    imgElement.src = workingFallback;
  } else {
    // Fallback absoluto
    imgElement.src = '/assets/images/default-avatar.svg';
  }
  
  imgElement.alt = 'Imagen no disponible';
  imgElement.onerror = null; // Prevenir bucle infinito si también falla la imagen de marcador de posición
}

// Exportar una instancia única
const productManager = new ProductManager();
export default productManager;
export { handleImageError };