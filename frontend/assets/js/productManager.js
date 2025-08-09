// productManager.js - Módulo unificado para la gestión de productos

import { showNotification, formatPrice } from './utils.js';

class ProductManager {
  constructor() {
    this.cachedProducts = null;
    this.isLoading = false;
    this.currentPage = 1;
    this.limit = 12;
    this.currentCategory = '';
    this.currentSearch = '';
  }

  // Función para cargar productos desde el backend
  async loadProducts(page = 1, limit = 8, category = '', search = '') {
    // Usar caché si está disponible y no hay filtros
    if (this.cachedProducts && !category && !search && page === 1) {
      console.log('Usando productos en caché');
      return { products: this.cachedProducts, totalPages: 1, currentPage: 1 };
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

  // Función para generar HTML de productos
  generateProductsHTML(products) {
    if (!products || products.length === 0) {
      return '<div class="no-products-message">No hay productos disponibles en este momento.</div>';
    }

    return products.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy">
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

// Exportar una instancia única
const productManager = new ProductManager();
export default productManager;