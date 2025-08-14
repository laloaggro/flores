// productManager.js - Gestión de productos y carga de datos
import { API_BASE_URL } from './utils.js';
import CartUtils from './cartUtils.js';

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

  // Función para cargar una imagen usando un proxy
  async loadImageWithProxy(url) {
    try {
      // Usar el proxy local para evitar problemas de CORS
      const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(url)}`;
      
      // Aplicar un timeout de 5 segundos a la solicitud
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error al cargar imagen: ${response.status}`);
      }
      
      // Devolver la URL de la imagen procesada por el proxy
      return proxyUrl;
    } catch (error) {
      console.error('Error al cargar imagen con proxy:', error);
      
      // Si hay un error, devolver una imagen de marcador de posición
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E';
    }
  }

  // Función para obtener la siguiente imagen de flor en la secuencia
  async getNextFlowerImage() {
    if (this.flowerImages.length === 0) {
      // Si no hay imágenes, usar una imagen de marcador de posición
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E';
    }
    
    const image = this.flowerImages[this.imageIndex];
    this.imageIndex = (this.imageIndex + 1) % this.flowerImages.length;
    
    // Usar el proxy para cargar la imagen
    return this.loadImageWithProxy(image);
  }

  // Función para renderizar productos en la página
  async renderProducts(products, container) {
    if (!container) return;
    
    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
      return;
    }
    
    // Crear una copia de los productos con imágenes procesadas
    const processedProducts = await Promise.all(products.map(async product => {
      if (!product.image_url || product.image_url.includes('placeholder') || product.image_url.includes('product_')) {
        product.image_url = await this.getNextFlowerImage();
      }
      return product;
    }));
    
    container.innerHTML = processedProducts.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22 viewBox=%220 0 300 300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23e0e0e0%22/%3E%3Ccircle cx=%22150%22 cy=%22150%22 r=%2280%22 fill=%22%23a5d6a7%22/%3E%3Ccircle cx=%22110%22 cy=%22120%22 r=%2215%22 fill=%22%234caf50%22/%3E%3Ccircle cx=%22190%22 cy=%22120%22 r=%2215%22 fill=%22%234caf50%22/%3E%3Cpath d=%22M150 170 Q170 200 150 230 Q130 200 150 170%22 fill=%22%234caf50%22/%3E%3C/svg%3E'; this.onerror=null;">
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