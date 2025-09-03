# Sistema de Recomendaciones Personalizadas

## Introducción

Este documento describe cómo implementar un sistema de recomendaciones personalizadas en la aplicación web de Arreglos Victoria para sugerir productos relevantes a los usuarios basados en su comportamiento, preferencias y datos demográficos.

## Beneficios del Sistema de Recomendaciones

1. **Aumento de ventas**: Sugerir productos relevantes puede aumentar las conversiones
2. **Mejora de la experiencia del usuario**: Productos personalizados mejoran la experiencia de compra
3. **Fidelización de clientes**: Recomendaciones relevantes mantienen a los usuarios comprometidos
4. **Descubrimiento de productos**: Ayuda a los usuarios a descubrir productos que podrían interesarles
5. **Análisis de comportamiento**: Datos valiosos sobre preferencias y patrones de compra

## Tipos de Recomendaciones

### 1. Basadas en el contenido (Content-Based)

Recomiendan productos similares a los que el usuario ha mostrado interés.

**Ejemplo:**
- Si un usuario ve muchos ramos de rosas, se le recomiendan otros productos con rosas
- Si un usuario compra arreglos para bodas, se le recomiendan otros productos nupciales

### 2. Basadas en filtrado colaborativo (Collaborative Filtering)

Recomiendan productos basados en el comportamiento de usuarios similares.

**Ejemplo:**
- Usuarios que compraron el Ramo A y el Ramo B también compraron el Ramo C
- Usuarios con perfiles similares tienen intereses similares

### 3. Basadas en popularidad (Popularity-Based)

Recomiendan productos populares entre todos los usuarios o segmentos específicos.

**Ejemplo:**
- Productos más vendidos del mes
- Tendencias estacionales

### 4. Basadas en contexto (Context-Based)

Recomiendan productos basados en el contexto actual del usuario.

**Ejemplo:**
- Productos para San Valentín en febrero
- Ramos de flores para el Día de la Madre en mayo

## Estructura de la Base de Datos

### Tabla de Interacciones del Usuario

```sql
CREATE TABLE user_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  interaction_type TEXT NOT NULL, -- 'view', 'cart_add', 'purchase', 'wishlist_add', 'review'
  interaction_value REAL DEFAULT 1.0, -- Peso de la interacción (ej: compra = 5.0, vista = 1.0)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Tabla de Recomendaciones

```sql
CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  recommendation_type TEXT NOT NULL, -- 'content_based', 'collaborative', 'popular', 'contextual'
  score REAL NOT NULL, -- Puntaje de recomendación (0.0 - 1.0)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME, -- Fecha de expiración de la recomendación
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Tabla de Perfiles de Usuario

```sql
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  preferred_categories TEXT, -- Categorías preferidas (JSON array)
  preferred_price_range TEXT, -- Rango de precios preferido (JSON object)
  last_interaction_date DATETIME,
  total_interactions INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  avg_purchase_value REAL DEFAULT 0.0,
  favorite_colors TEXT, -- Colores preferidos (JSON array)
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Obtener recomendaciones para un usuario

```
GET /api/recommendations
```

**Parámetros de consulta:**
- `type` (opcional): Tipo de recomendación (por defecto "mixed")
  - `mixed`: Combinación de todos los tipos
  - `personalized`: Basadas en el usuario
  - `popular`: Basadas en popularidad
  - `trending`: Tendencias actuales
- `limit` (opcional): Número de recomendaciones (por defecto 10)

**Respuesta:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "product": {
        "id": 15,
        "name": "Ramo de Tulipanes Multicolor",
        "price": 12000,
        "image": "/assets/images/tulipanes.jpg",
        "discount_price": 9500,
        "rating": 4.7,
        "category": "Ramos"
      },
      "reason": "Basado en tu interés en flores de primavera",
      "score": 0.95,
      "type": "content_based"
    },
    {
      "id": 2,
      "product": {
        "id": 22,
        "name": "Arreglo de Orquídeas Blancas",
        "price": 25000,
        "image": "/assets/images/orquideas.jpg",
        "rating": 4.9,
        "category": "Arreglos Especiales"
      },
      "reason": "Popular entre usuarios con intereses similares",
      "score": 0.88,
      "type": "collaborative"
    }
  ]
}
```

### Registrar interacción del usuario

```
POST /api/recommendations/interaction
```

**Cuerpo de la solicitud:**
```json
{
  "product_id": 15,
  "interaction_type": "view", // 'view', 'cart_add', 'purchase', 'wishlist_add', 'review'
  "interaction_value": 1.0
}
```

**Respuesta:**
```json
{
  "message": "Interacción registrada correctamente"
}
```

## Algoritmos de Recomendación

### 1. Sistema de Puntuación Basado en Interacciones

```javascript
// algorithms/interactionScoring.js
class InteractionScoring {
  // Pesos para diferentes tipos de interacciones
  static INTERACTION_WEIGHTS = {
    'view': 1.0,
    'cart_add': 3.0,
    'wishlist_add': 2.5,
    'purchase': 5.0,
    'review': 4.0
  };

  // Calcular puntuación de un producto para un usuario
  static calculateProductScore(userId, productId) {
    // Obtener todas las interacciones del usuario con el producto
    const interactions = getUserInteractions(userId, productId);
    
    // Calcular puntuación ponderada
    let totalScore = 0;
    let totalWeight = 0;
    
    interactions.forEach(interaction => {
      const weight = this.INTERACTION_WEIGHTS[interaction.interaction_type] || 1.0;
      totalScore += interaction.interaction_value * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
}
```

### 2. Recomendaciones Basadas en Contenido

```javascript
// algorithms/contentBased.js
class ContentBasedRecommendations {
  // Calcular similitud entre productos basada en categorías y características
  static calculateProductSimilarity(product1, product2) {
    let similarity = 0;
    
    // Similitud de categoría (peso 0.4)
    if (product1.category === product2.category) {
      similarity += 0.4;
    }
    
    // Similitud de colores (peso 0.3)
    const colorSimilarity = this.calculateColorSimilarity(
      product1.colors || [], 
      product2.colors || []
    );
    similarity += colorSimilarity * 0.3;
    
    // Similitud de precio (peso 0.2)
    const priceSimilarity = this.calculatePriceSimilarity(
      product1.price, 
      product2.price
    );
    similarity += priceSimilarity * 0.2;
    
    // Similitud de rating (peso 0.1)
    const ratingSimilarity = this.calculateRatingSimilarity(
      product1.rating || 0, 
      product2.rating || 0
    );
    similarity += ratingSimilarity * 0.1;
    
    return similarity;
  }
  
  static calculateColorSimilarity(colors1, colors2) {
    if (colors1.length === 0 || colors2.length === 0) return 0;
    
    const commonColors = colors1.filter(color => colors2.includes(color));
    return commonColors.length / Math.max(colors1.length, colors2.length);
  }
  
  static calculatePriceSimilarity(price1, price2) {
    const diff = Math.abs(price1 - price2);
    const maxPrice = Math.max(price1, price2);
    return maxPrice > 0 ? 1 - (diff / maxPrice) : 0;
  }
  
  static calculateRatingSimilarity(rating1, rating2) {
    return 1 - (Math.abs(rating1 - rating2) / 5);
  }
}
```

### 3. Filtrado Colaborativo

```javascript
// algorithms/collaborativeFiltering.js
class CollaborativeFiltering {
  // Encontrar usuarios similares basados en interacciones
  static findSimilarUsers(targetUserId, limit = 10) {
    // Obtener perfiles de todos los usuarios
    const allUsers = getAllUsers();
    
    // Calcular similitud con cada usuario
    const similarities = allUsers
      .filter(user => user.id !== targetUserId)
      .map(user => ({
        user: user,
        similarity: this.calculateUserSimilarity(targetUserId, user.id)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
    
    return similarities;
  }
  
  // Calcular similitud entre dos usuarios
  static calculateUserSimilarity(userId1, userId2) {
    // Obtener productos interactuados por ambos usuarios
    const user1Products = getUserInteractedProducts(userId1);
    const user2Products = getUserInteractedProducts(userId2);
    
    // Encontrar productos en común
    const commonProducts = user1Products.filter(p1 => 
      user2Products.some(p2 => p2.id === p1.id)
    );
    
    if (commonProducts.length === 0) return 0;
    
    // Calcular correlación de preferencias
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
    
    commonProducts.forEach(product => {
      const score1 = getProductScore(userId1, product.id);
      const score2 = getProductScore(userId2, product.id);
      
      sum1 += score1;
      sum2 += score2;
      sum1Sq += Math.pow(score1, 2);
      sum2Sq += Math.pow(score2, 2);
      pSum += score1 * score2;
    });
    
    const n = commonProducts.length;
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) * (sum2Sq - Math.pow(sum2, 2) / n));
    
    return den === 0 ? 0 : num / den;
  }
  
  // Recomendar productos basados en usuarios similares
  static recommendFromSimilarUsers(userId, limit = 10) {
    const similarUsers = this.findSimilarUsers(userId);
    
    // Obtener productos que usuarios similares han interactuado pero el usuario objetivo no
    const recommendations = [];
    
    similarUsers.forEach(({ user, similarity }) => {
      const userProducts = getUserInteractedProducts(user.id);
      const targetProducts = getUserInteractedProducts(userId);
      
      userProducts.forEach(product => {
        if (!targetProducts.some(p => p.id === product.id)) {
          const existingRec = recommendations.find(r => r.product.id === product.id);
          
          if (existingRec) {
            existingRec.score += getProductScore(user.id, product.id) * similarity;
            existingRec.sources.push(user.id);
          } else {
            recommendations.push({
              product: product,
              score: getProductScore(user.id, product.id) * similarity,
              sources: [user.id],
              type: 'collaborative'
            });
          }
        }
      });
    });
    
    // Ordenar por puntuación y limitar resultados
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
```

## Componente de Recomendaciones en el Frontend

### Componente de Sección de Recomendaciones

```jsx
// src/components/RecommendationsSection.js
import React, { useState, useEffect } from 'react';
import RecommendationItem from './RecommendationItem';
import { useRecommendations } from '../hooks/useRecommendations';

const RecommendationsSection = ({ title = "Recomendaciones para ti", type = "mixed" }) => {
  const { recommendations, loading, error, refreshRecommendations } = useRecommendations(type);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    refreshRecommendations();
  }, [type]);

  const showMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  if (loading) return <div className="recommendations-loading">Cargando recomendaciones...</div>;
  if (error) return <div className="recommendations-error">Error: {error}</div>;
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="recommendations-section">
      <div className="section-header">
        <h2>{title}</h2>
        <button 
          className="btn btn-link refresh-button"
          onClick={refreshRecommendations}
          title="Actualizar recomendaciones"
        >
          <i className="fas fa-sync"></i>
        </button>
      </div>
      
      <div className="recommendations-grid">
        {recommendations.slice(0, visibleCount).map((recommendation, index) => (
          <RecommendationItem 
            key={`${recommendation.product.id}-${index}`} 
            recommendation={recommendation} 
          />
        ))}
      </div>
      
      {visibleCount < recommendations.length && (
        <div className="show-more-container">
          <button className="btn btn-outline" onClick={showMore}>
            Ver más recomendaciones
          </button>
        </div>
      )}
    </section>
  );
};

export default RecommendationsSection;
```

### Componente de Item de Recomendación

```jsx
// src/components/RecommendationItem.js
import React from 'react';
import { formatPrice } from '../utils/helpers';

const RecommendationItem = ({ recommendation }) => {
  const { product, reason, type } = recommendation;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'content_based':
        return 'fas fa-tag';
      case 'collaborative':
        return 'fas fa-users';
      case 'popular':
        return 'fas fa-fire';
      case 'contextual':
        return 'fas fa-calendar';
      default:
        return 'fas fa-star';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'content_based':
        return 'Basado en tus intereses';
      case 'collaborative':
        return 'Popular entre usuarios similares';
      case 'popular':
        return 'Tendencia';
      case 'contextual':
        return 'Recomendación especial';
      default:
        return 'Recomendado para ti';
    }
  };

  return (
    <div className="recommendation-item">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="recommendation-badge" title={getTypeLabel(type)}>
          <i className={getTypeIcon(type)}></i>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">
          <a href={`/product/${product.id}`}>{product.name}</a>
        </h3>
        
        <div className="product-price">
          {product.discount_price && product.discount_price < product.price ? (
            <>
              <span className="price-original">{formatPrice(product.price)}</span>
              <span className="price-discount">{formatPrice(product.discount_price)}</span>
            </>
          ) : (
            <span className="price-regular">{formatPrice(product.price)}</span>
          )}
        </div>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`fas fa-star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
            ></i>
          ))}
          <span className="rating-value">{product.rating?.toFixed(1) || 'Sin rating'}</span>
        </div>
        
        {reason && (
          <div className="recommendation-reason">
            <i className="fas fa-lightbulb"></i>
            <span>{reason}</span>
          </div>
        )}
        
        <div className="product-actions">
          <button className="btn btn-small btn-primary">
            <i className="fas fa-shopping-cart"></i>
            Agregar al carrito
          </button>
          <button className="btn btn-small btn-outline">
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationItem;
```

### Hook personalizado para Recomendaciones

```jsx
// src/hooks/useRecommendations.js
import { useState, useEffect } from 'react';
import { trackUserInteraction } from '../utils/analytics';

export const useRecommendations = (type = 'mixed') => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/recommendations?type=${type}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        setError(data.message || 'Error al cargar recomendaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (productId, interactionType, value = 1.0) => {
    try {
      // Registrar interacción en el backend
      await fetch('/api/recommendations/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: productId,
          interaction_type: interactionType,
          interaction_value: value
        })
      });
      
      // Registrar en analytics local
      trackUserInteraction('product_interaction', {
        product_id: productId,
        interaction_type: interactionType,
        value: value
      });
    } catch (error) {
      console.error('Error al registrar interacción:', error);
    }
  };

  const refreshRecommendations = () => {
    fetchRecommendations();
  };

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    trackInteraction,
    refreshRecommendations
  };
};
```

## Integración en diferentes partes de la aplicación

### En la página de inicio

```jsx
// src/pages/Home.js
import React from 'react';
import RecommendationsSection from '../components/RecommendationsSection';

const Home = () => {
  return (
    <div className="home-page">
      {/* ... otros componentes ... */}
      
      <RecommendationsSection 
        title="Recomendado para ti" 
        type="personalized" 
      />
      
      <RecommendationsSection 
        title="Tendencias" 
        type="trending" 
      />
    </div>
  );
};
```

### En la página de detalle de producto

```jsx
// src/pages/ProductDetail.js
import React from 'react';
import RecommendationsSection from '../components/RecommendationsSection';

const ProductDetail = ({ product }) => {
  return (
    <div className="product-detail">
      {/* ... detalles del producto ... */}
      
      <RecommendationsSection 
        title="Productos similares" 
        type="content_based" 
      />
      
      <RecommendationsSection 
        title="Otros clientes compraron" 
        type="collaborative" 
      />
    </div>
  );
};
```

## Consideraciones importantes

1. **Privacidad**: Proteger los datos de los usuarios y cumplir con regulaciones de privacidad
2. **Transparencia**: Explicar claramente por qué se recomiendan ciertos productos
3. **Diversidad**: Evitar la burbuja de filtro mostrando productos diversos
4. **Actualización**: Mantener las recomendaciones frescas y relevantes
5. **Rendimiento**: Optimizar algoritmos para tiempos de respuesta rápidos
6. **A/B Testing**: Probar diferentes algoritmos y enfoques
7. **Feedback del usuario**: Permitir a los usuarios indicar si las recomendaciones son útiles
8. **Fallback**: Tener recomendaciones por defecto cuando no hay suficientes datos

## Validación y Pruebas

1. **Pruebas unitarias**: Probar cada algoritmo individualmente
2. **Pruebas de integración**: Verificar la interacción con la API
3. **Pruebas A/B**: Comparar diferentes algoritmos de recomendación
4. **Pruebas de carga**: Verificar el rendimiento con grandes volúmenes de datos
5. **Pruebas de calidad**: Evaluar la relevancia de las recomendaciones
6. **Pruebas de usabilidad**: Evaluar la experiencia del usuario con las recomendaciones

## Métricas de éxito

1. **CTR (Click-Through Rate)**: Porcentaje de recomendaciones clickeadas
2. **Conversion Rate**: Porcentaje de recomendaciones que resultan en compras
3. **Engagement**: Tiempo de interacción con las recomendaciones
4. **User Satisfaction**: Feedback directo de los usuarios sobre las recomendaciones
5. **Diversity**: Variedad de productos recomendados
6. **Novelty**: Productos nuevos o no descubiertos recomendados

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 2-3 días | Diseño de la base de datos y API |
| Fase 2 | 3-4 días | Implementación de algoritmos de recomendación |
| Fase 3 | 3-4 días | Implementación del frontend |
| Fase 4 | 2-3 días | Integración, pruebas y optimización |
| **Total** | **10-14 días** | **Tiempo estimado completo** |

## Recursos

1. [Recommender Systems Handbook](https:// Recommender Systems Handbook)
2. [Machine Learning for Recommender Systems](https://cs229.stanford.edu/proj2018/poster/157.pdf)
3. [Netflix Recommendation System](https://dl.acm.org/doi/10.1145/388283.388287)
4. [Collaborative Filtering Techniques](https://en.wikipedia.org/wiki/Collaborative_filtering)