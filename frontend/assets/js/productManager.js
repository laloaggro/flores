// productManager.js - Gestión de productos y reseñas

// Función para obtener productos
async function getProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

// Función para obtener reseñas de un producto
async function getProductReviews(productId) {
    try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        if (!response.ok) {
            throw new Error('Error al obtener reseñas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        return [];
    }
}

// Función para agregar una reseña
async function addProductReview(productId, reviewData) {
    try {
        const response = await fetch(`/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
            throw new Error('Error al agregar reseña');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al agregar reseña:', error);
        throw error;
    }
}

// Función para calcular el promedio de calificaciones
function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
}

// Función para mostrar reseñas en la página de producto
function displayProductReviews(productId) {
    getProductReviews(productId)
        .then(reviews => {
            const reviewsContainer = document.getElementById('productReviews');
            if (!reviewsContainer) return;
            
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p>No hay reseñas para este producto aún.</p>';
                return;
            }
            
            const averageRating = calculateAverageRating(reviews);
            
            reviewsContainer.innerHTML = `
                <div class="reviews-header">
                    <h3>Reseñas del producto</h3>
                    <div class="average-rating">
                        <span class="rating-value">${averageRating}</span>
                        <div class="stars">${renderStars(averageRating)}</div>
                        <span class="review-count">(${reviews.length} reseñas)</span>
                    </div>
                </div>
                <div class="reviews-list">
                    ${reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <strong>${review.userName}</strong>
                                <div class="stars">${renderStars(review.rating)}</div>
                                <span class="review-date">${formatDate(review.date)}</span>
                            </div>
                            <p class="review-comment">${review.comment}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al mostrar reseñas:', error);
        });
}

// Función para renderizar estrellas de calificación
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Exportar funciones
export { 
    getProducts, 
    getProductReviews, 
    addProductReview, 
    displayProductReviews,
    calculateAverageRating
};