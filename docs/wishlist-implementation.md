# Implementación del Sistema de Lista de Deseos

## Introducción

Este documento describe cómo implementar un sistema de lista de deseos en la aplicación web de Arreglos Victoria para permitir a los usuarios guardar productos que les interesan para futuras compras.

## Beneficios del Sistema de Lista de Deseos

1. **Mejora de la experiencia del usuario**: Permite a los usuarios guardar productos interesantes
2. **Aumento de conversiones**: Facilita futuras compras recordando productos de interés
3. **Compromiso del cliente**: Mantiene a los usuarios interactuando con la plataforma
4. **Marketing oportunidad**: Posibilidad de notificar sobre productos en la lista de deseos
5. **Análisis de intereses**: Datos sobre preferencias de productos de los usuarios

## Estructura de la Base de Datos

### Tabla de Lista de Deseos

```sql
CREATE TABLE wishlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT DEFAULT 'Mi Lista de Deseos',
  is_public BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, name)
);

CREATE TABLE wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wishlist_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(wishlist_id, product_id)
);
```

## API Endpoints

### Obtener la lista de deseos del usuario

```
GET /api/wishlist
```

**Respuesta:**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Mi Lista de Deseos",
  "is_public": false,
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "added_at": "2023-05-15T10:30:00Z",
      "notes": "Para el cumpleaños de mamá",
      "product": {
        "id": 1,
        "name": "Ramo de Rosas Rojas",
        "price": 15000,
        "image": "/assets/images/rosas-rojas.jpg",
        "discount_price": 12000,
        "rating": 4.5
      }
    }
  ],
  "item_count": 1
}
```

### Agregar un producto a la lista de deseos

```
POST /api/wishlist/items
```

**Cuerpo de la solicitud:**
```json
{
  "product_id": 1,
  "notes": "Para el cumpleaños de mamá"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "wishlist_id": 1,
  "product_id": 1,
  "added_at": "2023-05-15T10:30:00Z",
  "notes": "Para el cumpleaños de mamá"
}
```

### Eliminar un producto de la lista de deseos

```
DELETE /api/wishlist/items/:itemId
```

**Respuesta:**
```json
{
  "message": "Producto eliminado de la lista de deseos"
}
```

### Actualizar notas de un producto en la lista de deseos

```
PUT /api/wishlist/items/:itemId
```

**Cuerpo de la solicitud:**
```json
{
  "notes": "Para el cumpleaños de mamá - rojas preferidas"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "wishlist_id": 1,
  "product_id": 1,
  "added_at": "2023-05-15T10:30:00Z",
  "notes": "Para el cumpleaños de mamá - rojas preferidas"
}
```

### Mover producto de la lista de deseos al carrito

```
POST /api/wishlist/items/:itemId/move-to-cart
```

**Respuesta:**
```json
{
  "message": "Producto movido al carrito exitosamente"
}
```

## Componente de Lista de Deseos en el Frontend

### Componente de Vista de Lista de Deseos

```jsx
// src/components/WishlistView.js
import React, { useState, useEffect } from 'react';
import WishlistItem from './WishlistItem';
import { useWishlist } from '../hooks/useWishlist';

const WishlistView = () => {
  const { wishlist, loading, error, removeFromWishlist, moveToCart } = useWishlist();
  const [editingItemId, setEditingItemId] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const handleEditNotes = (item) => {
    setEditingItemId(item.id);
    setEditNotes(item.notes || '');
  };

  const handleSaveNotes = async (itemId) => {
    try {
      // En una implementación real, esto llamaría a la API para actualizar las notas
      setEditingItemId(null);
      setEditNotes('');
    } catch (error) {
      console.error('Error al guardar notas:', error);
    }
  };

  const handleMoveToCart = async (itemId) => {
    try {
      await moveToCart(itemId);
    } catch (error) {
      console.error('Error al mover al carrito:', error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId);
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
    }
  };

  if (loading) return <div className="wishlist-loading">Cargando lista de deseos...</div>;
  if (error) return <div className="wishlist-error">Error: {error}</div>;

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Mi Lista de Deseos</h1>
        <p>{wishlist?.item_count || 0} artículo(s)</p>
      </div>

      {wishlist?.items?.length === 0 ? (
        <div className="wishlist-empty">
          <i className="fas fa-heart"></i>
          <h3>Tu lista de deseos está vacía</h3>
          <p>Guarda productos que te gusten para encontrarlos fácilmente más tarde</p>
          <a href="/products" className="btn btn-primary">Explorar productos</a>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlist?.items?.map(item => (
            <WishlistItem
              key={item.id}
              item={item}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemove}
              onEditNotes={handleEditNotes}
              isEditing={editingItemId === item.id}
              editNotes={editNotes}
              setEditNotes={setEditNotes}
              onSaveNotes={handleSaveNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;
```

### Componente de Item de Lista de Deseos

```jsx
// src/components/WishlistItem.js
import React from 'react';
import { formatPrice } from '../utils/helpers';

const WishlistItem = ({ 
  item, 
  onMoveToCart, 
  onRemove, 
  onEditNotes, 
  isEditing, 
  editNotes, 
  setEditNotes, 
  onSaveNotes 
}) => {
  const product = item.product;

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;

  return (
    <div className="wishlist-item">
      <div className="wishlist-item-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="wishlist-item-details">
        <h3 className="product-name">
          <a href={`/product/${product.id}`}>{product.name}</a>
        </h3>

        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="price-original">{formatPrice(product.price)}</span>
              <span className="price-discount">{formatPrice(displayPrice)}</span>
            </>
          ) : (
            <span className="price-regular">{formatPrice(displayPrice)}</span>
          )}
        </div>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
            ></i>
          ))}
          <span className="rating-value">{product.rating}</span>
        </div>

        <div className="wishlist-item-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => onMoveToCart(item.id)}
          >
            <i className="fas fa-shopping-cart"></i>
            Mover al carrito
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => onRemove(item.id)}
          >
            <i className="fas fa-trash"></i>
            Eliminar
          </button>
        </div>
      </div>

      <div className="wishlist-item-notes">
        {isEditing ? (
          <div className="notes-edit">
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Añade notas sobre este producto..."
              rows="3"
            />
            <div className="notes-actions">
              <button 
                className="btn btn-small btn-primary"
                onClick={() => onSaveNotes(item.id)}
              >
                Guardar
              </button>
              <button 
                className="btn btn-small btn-outline"
                onClick={() => {
                  setEditingItemId(null);
                  setEditNotes('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-display">
            {item.notes ? (
              <>
                <p>{item.notes}</p>
                <button 
                  className="btn btn-small btn-link"
                  onClick={() => onEditNotes(item)}
                >
                  Editar notas
                </button>
              </>
            ) : (
              <button 
                className="btn btn-small btn-link"
                onClick={() => onEditNotes(item)}
              >
                Añadir notas
              </button>
            )}
          </div>
        )}
      </div>

      <div className="wishlist-item-date">
        Añadido el {new Date(item.added_at).toLocaleDateString('es-ES')}
      </div>
    </div>
  );
};

export default WishlistItem;
```

### Hook personalizado para la Lista de Deseos

```jsx
// src/hooks/useWishlist.js
import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (response.ok) {
        setWishlist(data);
      } else {
        setError(data.message || 'Error al cargar la lista de deseos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, notes = '') => {
    try {
      const response = await fetch('/api/wishlist/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, notes })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Actualizar la lista de deseos localmente
        await fetchWishlist();
        return data;
      } else {
        throw new Error(data.message || 'Error al añadir a la lista de deseos');
      }
    } catch (err) {
      throw err;
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Actualizar la lista de deseos localmente
        await fetchWishlist();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar de la lista de deseos');
      }
    } catch (err) {
      throw err;
    }
  };

  const moveToCart = async (itemId) => {
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}/move-to-cart`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Actualizar la lista de deseos localmente
        await fetchWishlist();
        return data;
      } else {
        throw new Error(data.message || 'Error al mover al carrito');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart
  };
};
```

### Botón para añadir a la lista de deseos

```jsx
// src/components/AddToWishlistButton.js
import React, { useState } from 'react';
import { useWishlist } from '../hooks/useWishlist';

const AddToWishlistButton = ({ productId, className = '' }) => {
  const { addToWishlist, wishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Verificar si el producto ya está en la lista de deseos
  const isInWishlist = wishlist?.items?.some(item => item.product_id === productId);

  useEffect(() => {
    setAdded(isInWishlist);
  }, [isInWishlist]);

  const handleAddToWishlist = async () => {
    if (isInWishlist) return;

    try {
      setAdding(true);
      await addToWishlist(productId);
      setAdded(true);
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error al añadir a la lista de deseos:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      className={`btn-wishlist ${className} ${added ? 'added' : ''}`}
      onClick={handleAddToWishlist}
      disabled={adding || added}
      title={added ? 'En tu lista de deseos' : 'Añadir a la lista de deseos'}
    >
      {adding ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : added ? (
        <i className="fas fa-heart"></i>
      ) : (
        <i className="far fa-heart"></i>
      )}
      <span className="btn-text">
        {added ? 'Añadido' : 'Lista de deseos'}
      </span>
    </button>
  );
};

export default AddToWishlistButton;
```

## Integración con otros componentes

### En la tarjeta de producto

```jsx
// src/components/ProductCard.js
import React from 'react';
import AddToWishlistButton from './AddToWishlistButton';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {/* ... otros elementos del producto ... */}
      
      <div className="product-actions">
        <AddToWishlistButton productId={product.id} />
        {/* ... otros botones ... */}
      </div>
    </div>
  );
};
```

## Consideraciones importantes

1. **Sincronización**: Mantener sincronizada la lista de deseos entre diferentes dispositivos
2. **Privacidad**: Opción para hacer listas de deseos públicas o privadas
3. **Límites**: Establecer límites en el número de productos en la lista de deseos
4. **Notificaciones**: Opción para notificar cuando productos en la lista de deseos estén en oferta
5. **Exportación**: Permitir exportar la lista de deseos
6. **Compartir**: Permitir compartir listas de deseos con amigos
7. **Accesibilidad**: Asegurar que el sistema sea accesible para todos los usuarios
8. **Rendimiento**: Optimizar la carga y visualización de listas grandes

## Validación y Pruebas

1. **Pruebas unitarias**: Probar cada componente individualmente
2. **Pruebas de integración**: Verificar la interacción con la API
3. **Pruebas de usabilidad**: Evaluar la experiencia del usuario
4. **Pruebas de carga**: Verificar el rendimiento con listas grandes
5. **Pruebas de seguridad**: Asegurar que solo los usuarios autorizados puedan acceder a las listas

## Cronograma estimado

| Fase | Duración | Descripción |
|------|----------|-------------|
| Fase 1 | 2 días | Diseño de la base de datos y API |
| Fase 2 | 2-3 días | Implementación del backend |
| Fase 3 | 3-4 días | Implementación del frontend |
| Fase 4 | 1-2 días | Integración y pruebas |
| **Total** | **8-11 días** | **Tiempo estimado completo** |

## Recursos

1. [Wishlist Design Patterns](https://uxdesign.cc/wishlist-design-patterns-7d4c9f8b8e7f)
2. [E-commerce Wishlist Best Practices](https://www.nngroup.com/articles/wish-lists/)
3. [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
4. [Shopping Cart vs Wishlist UX](https://baymard.com/blog/shopping-cart-vs-wishlist)