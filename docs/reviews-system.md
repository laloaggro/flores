# Sistema de Comentarios y Reseñas de Productos

## Introducción

Este documento describe cómo implementar un sistema de comentarios y reseñas de productos en la aplicación web de Arreglos Victoria para permitir a los usuarios compartir sus experiencias y opiniones sobre los productos.

## Beneficios del Sistema de Reseñas

1. **Confianza del cliente**: Las reseñas aumentan la confianza de los nuevos clientes
2. **Mejora de productos**: Feedback valioso para mejorar los productos
3. **SEO**: Contenido generado por usuarios mejora el SEO
4. **Compromiso**: Aumenta el compromiso de los usuarios con la marca
5. **Social proof**: Evidencia social que puede aumentar las conversiones

## Estructura de la Base de Datos

### Tabla de Reseñas

```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabla de Votos de Reseñas

```sql
CREATE TABLE review_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  user_id INTEGER,
  vote INTEGER NOT NULL CHECK (vote IN (-1, 1)), -- -1 para no útil, 1 para útil
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(review_id, user_id)
);
```

## API Endpoints

### Obtener reseñas de un producto

```
GET /api/products/:productId/reviews
```

**Parámetros de consulta:**
- `page` (opcional): Número de página para paginación
- `limit` (opcional): Número de reseñas por página (por defecto 10)
- `sort` (opcional): Orden de las reseñas (por defecto "newest")
  - `newest`: Más recientes primero
  - `oldest`: Más antiguas primero
  - `highest`: Mayor calificación primero
  - `lowest`: Menor calificación primero
  - `helpful`: Más útiles primero

**Respuesta:**
```json
{
  "reviews": [
    {
      "id": 1,
      "product_id": 1,
      "user": {
        "id": 1,
        "name": "María González"
      },
      "rating": 5,
      "title": "¡Hermoso ramo!",
      "comment": "El ramo superó mis expectativas. Las flores estaban muy frescas y el arreglo era hermoso.",
      "verified_purchase": true,
      "helpful_count": 12,
      "created_at": "2023-05-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_reviews": 48,
    "per_page": 10
  },
  "average_rating": 4.6,
  "rating_distribution": {
    "5": 32,
    "4": 10,
    "3": 4,
    "2": 1,
    "1": 1
  }
}
```

### Crear una reseña

```
POST /api/products/:productId/reviews
```

**Cuerpo de la solicitud:**
```json
{
  "rating": 5,
  "title": "¡Hermoso ramo!",
  "comment": "El ramo superó mis expectativas. Las flores estaban muy frescas y el arreglo era hermoso.",
  "verified_purchase": true
}
```

**Respuesta:**
```json
{
  "id": 1,
  "product_id": 1,
  "user_id": 1,
  "rating": 5,
  "title": "¡Hermoso ramo!",
  "comment": "El ramo superó mis expectativas. Las flores estaban muy frescas y el arreglo era hermoso.",
  "verified_purchase": true,
  "helpful_count": 0,
  "created_at": "2023-05-15T10:30:00Z"
}
```

### Votar si una reseña es útil

```
POST /api/reviews/:reviewId/vote
```

**Cuerpo de la solicitud:**
```json
{
  "vote": 1 // 1 para útil, -1 para no útil
}
```

**Respuesta:**
```json
{
  "message": "Voto registrado correctamente",
  "helpful_count": 13
}
```

## Componente de Reseñas en el Frontend

### Componente de Lista de Reseñas

```jsx
// src/components/ReviewsList.js
import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews?sort=${sortBy}&page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
        setTotalPages(data.pagination.total_pages);
        setAverageRating(data.average_rating);
        setRatingDistribution(data.rating_distribution);
      } else {
        setError(data.message || 'Error al cargar las reseñas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="reviews-loading">Cargando reseñas...</div>;
  if (error) return <div className="reviews-error">Error: {error}</div>;

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3>Reseñas de Clientes</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas fa-star ${i < Math.floor(averageRating) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="review-count">({reviews.length} reseñas)</span>
          </div>
          
          <div className="rating-distribution">
            {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} estrellas</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguas</option>
          <option value="highest">Mejor calificadas</option>
          <option value="lowest">Peor calificadas</option>
          <option value="helpful">Más útiles</option>
        </select>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="no-reviews">
          <p>No hay reseñas para este producto todavía.</p>
          <ReviewForm productId={productId} onReviewSubmit={fetchReviews} />
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      <ReviewForm productId={productId} onReviewSubmit={fetchReviews} />
    </div>
  );
};

export default ReviewsList;
```

### Componente de Item de Reseña

```jsx
// src/components/ReviewItem.js
import React, { useState } from 'react';

const ReviewItem = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [userVote, setUserVote] = useState(null);

  const handleVote = async (vote) => {
    try {
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHelpfulCount(data.helpful_count);
        setUserVote(vote);
      }
    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <span className="reviewer-name">{review.user?.name || 'Cliente'}</span>
          {review.verified_purchase && (
            <span className="verified-badge">Compra verificada</span>
          )}
        </div>
        <div className="review-date">
          {formatDate(review.created_at)}
        </div>
      </div>
      
      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
          ></i>
        ))}
      </div>
      
      <h4 className="review-title">{review.title}</h4>
      
      <p className="review-comment">{review.comment}</p>
      
      <div className="review-actions">
        <span>¿Te parece útil esta reseña?</span>
        <button 
          className={`vote-button ${userVote === 1 ? 'voted' : ''}`}
          onClick={() => handleVote(1)}
        >
          <i className="fas fa-thumbs-up"></i>
          Sí ({helpfulCount})
        </button>
        <button 
          className={`vote-button ${userVote === -1 ? 'voted' : ''}`}
          onClick={() => handleVote(-1)}
        >
          <i className="fas fa-thumbs-down"></i>
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
```

### Componente de Formulario de Reseña

```jsx
// src/components/ReviewForm.js
import React, { useState } from 'react';

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }
    
    if (!title.trim()) {
      setError('Por favor, ingresa un título para tu reseña');
      return;
    }
    
    if (!comment.trim()) {
      setError('Por favor, ingresa tu comentario');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          title,
          comment,
          verified_purchase: true // En una implementación real, esto se verificaría en el backend
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setRating(0);
        setTitle('');
        setComment('');
        
        // Llamar a la función para actualizar la lista de reseñas
        if (onReviewSubmit) {
          onReviewSubmit();
        }
        
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(data.message || 'Error al enviar la reseña');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h4>Escribe tu reseña</h4>
      
      {success && (
        <div className="success-message">
          ¡Gracias por tu reseña! Ha sido enviada correctamente.
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Calificación:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              ></i>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="review-title">Título de la reseña:</label>
          <input
            type="text"
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Hermoso ramo, flores muy frescas"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="review-comment">Tu comentario:</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia con el producto..."
            rows="4"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
```

## Integración con la Página de Detalle de Producto

```jsx
// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import ReviewsList from '../components/ReviewsList';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  
  // ... lógica existente para cargar el producto ...
  
  return (
    <div className="product-detail">
      {/* ... sección de detalles del producto ... */}
      
      {/* Sección de reseñas */}
      <section className="product-reviews">
        <ReviewsList productId={productId} />
      </section>
    </div>
  );
};

export default ProductDetail;
```

## Consideraciones importantes

1. **Moderación**: Implementar un sistema de moderación para reseñas inapropiadas
2. **Autenticidad**: Verificar compras reales antes de mostrar "Compra verificada"
3. **Privacidad**: Proteger la información personal de los usuarios
4. **Accesibilidad**: Asegurar que el sistema de reseñas sea accesible
5. **SEO**: Implementar structured data para reseñas de productos
6. **Rendimiento**: Implementar paginación y carga diferida
7. **Internacionalización**: Soportar múltiples idiomas en reseñas

## Validación y Pruebas

1. **Pruebas unitarias**: Probar cada componente individualmente
2. **Pruebas de integración**: Verificar la interacción con la API
3. **Pruebas de usabilidad**: Evaluar la experiencia del usuario
4. **Pruebas de carga**: Verificar el rendimiento con muchas reseñas
5. **Pruebas de seguridad**: Asegurar que no se puedan inyectar scripts

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 2-3 días | Diseño de la base de datos y API |
| Fase 2 | 3-4 días | Implementación del backend |
| Fase 3 | 3-4 días | Implementación del frontend |
| Fase 4 | 1-2 días | Integración y pruebas |
| **Total** | **9-13 días** | **Tiempo estimado completo** |

## Recursos

1. [Schema.org Product Reviews](https://schema.org/Product)
2. [Google Reviews Guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
3. [React Documentation](https://reactjs.org/)
4. [Form Validation Best Practices](https://uxplanet.org/form-validation-essential-guide-for-designers-and-developers-2209d8dc2972)