// productManager.js - Gestión de productos y carga de datos
import { loadImageWithProxy } from './utils.js';

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

    // Función para cargar productos con paginación
    async loadProducts(page = 1, category = '', search = '', limit = 8) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log(`Cargando productos - Página: ${page}, Categoría: ${category}, Búsqueda: ${search}`);
        
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
                } else {
                    // Usar el proxy para todas las imágenes externas
                    product.image_url = loadImageWithProxy(product.image_url);
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

    // Función para obtener las categorías de productos
    async getCategories() {
        try {
            const response = await fetch('/api/products/categories');
            
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

    // Función para cargar imágenes de flores de una API externa
    async loadFlowerImages() {
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
        
        // Verificar que las imágenes locales existan y tengan tamaño > 0
        const verifiedLocalImages = [];
              
        for (const imagePath of localImages) {
            try {
                // Verificar si la imagen existe y tiene contenido
                const response = await fetch(imagePath);
                if (response.ok) {
                    const blob = await response.blob();
                    if (blob.size > 0) {
                        verifiedLocalImages.push(imagePath);
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

    // Función para obtener la siguiente imagen de flor en la secuencia
    getNextFlowerImage() {
        if (this.flowerImages.length === 0) {
            // Si no hay imágenes, usar una imagen de marcador de posición
            return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23e0e0e0"/%3E%3Ccircle cx="150" cy="150" r="80" fill="%23a5d6a7"/%3E%3Ccircle cx="110" cy="120" r="15" fill="%234caf50"/%3E%3Ccircle cx="190" cy="120" r="15" fill="%234caf50"/%3E%3Cpath d="M150 170 Q170 200 150 230 Q130 200 150 170" fill="%234caf50"/%3E%3C/svg%3E';
        }
        
        const image = this.flowerImages[this.imageIndex];
        this.imageIndex = (this.imageIndex + 1) % this.flowerImages.length;
        return loadImageWithProxy(image);
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
}

// Crear una instancia global
const productManager = new ProductManager();

// Exportar la instancia y la clase
export { productManager, ProductManager };