const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();
const isAdmin = require('../middleware/admin');

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'products.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos de productos');
  }
});

// Ruta para obtener todas las categorías únicas (sin autenticación requerida)
router.get('/categories', (req, res) => {
  // Obtener categorías únicas
  db.all(`SELECT DISTINCT category FROM products ORDER BY category`, (err, rows) => {
    if (err) {
      console.error('Error al obtener categorías:', err.message);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
    
    const categories = rows.map(row => row.category);
    res.json({ categories });
  });
});

// Ruta para obtener todos los productos (sin autenticación requerida)
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;
  
  let query = 'SELECT * FROM products';
  let countQuery = 'SELECT COUNT(*) as total FROM products';
  const params = [];
  const countParams = [];
  
  // Agregar filtros si existen
  // Solo aplicar filtro de categoría si no es una cadena vacía
  if (category && category !== '') {
    query += ' WHERE category = ?';
    countQuery += ' WHERE category = ?';
    params.push(category);
    countParams.push(category);
  }
  
  if (search) {
    if (category && category !== '') {
      query += ' AND name LIKE ?';
      countQuery += ' AND name LIKE ?';
    } else {
      query += ' WHERE name LIKE ?';
      countQuery += ' WHERE name LIKE ?';
    }
    params.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }
  
  // Agregar orden y paginación
  query += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  // Obtener productos con filtros y paginación
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error al obtener productos:', err.message);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    
    // Procesar las imágenes de los productos para usar rutas locales por defecto
    const processedRows = rows.map(row => {
      // Si no tiene imagen o la imagen es de placeholder, usar una imagen local
      if (!row.image_url || row.image_url.includes('placeholder') || row.image_url.includes('product_')) {
        // Asignar una imagen local basada en el ID del producto para variedad
        const imageNumber = (row.id % 10) + 1;
        row.image_url = `/assets/images/flowers/flower${Math.min(imageNumber, 10)}.svg`;
      }
      return row;
    });
    
    // Contar el total de productos con los filtros aplicados
    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        console.error('Error al contar productos:', err.message);
        return res.status(500).json({ error: 'Error al contar productos' });
      }
      
      const total = countRow.total;
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        products: processedRows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total
        }
      });
    });
  });
});

// Ruta para obtener un producto por ID (sin autenticación requerida)
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      console.error('Error al obtener producto:', err.message);
      return res.status(500).json({ error: 'Error al obtener producto' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Procesar la imagen del producto para usar rutas locales por defecto
    if (!row.image_url || row.image_url.includes('placeholder') || row.image_url.includes('product_')) {
      const imageNumber = (row.id % 10) + 1;
      row.image_url = `/assets/images/flowers/flower${Math.min(imageNumber, 10)}.svg`;
    }
    
    res.json(row);
  });
});

// Ruta para crear un nuevo producto (solo administradores)
router.post('/', isAdmin, (req, res) => {
  const { name, description, price, category, size, image_url } = req.body;
  
  // Validaciones básicas
  if (!name || !description || !price || !category) {
    return res.status(400).json({ 
      error: 'Los campos nombre, descripción, precio y categoría son obligatorios' 
    });
  }
  
  // Validar que el precio sea un número
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    return res.status(400).json({ 
      error: 'El precio debe ser un número válido mayor que cero' 
    });
  }
  
  // Insertar nuevo producto
  const stmt = db.prepare(`INSERT INTO products 
    (name, description, price, category, size, image_url) 
    VALUES (?, ?, ?, ?, ?, ?)`);
    
  stmt.run([name, description, priceNumber, category, size || null, image_url || null], function(err) {
    if (err) {
      console.error('Error al crear producto:', err.message);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      productId: this.lastID
    });
  });
  
  stmt.finalize();
});

// Ruta para actualizar un producto (solo administradores)
router.put('/:id', isAdmin, (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category, size, image_url } = req.body;
  
  // Validaciones básicas
  if (!name || !description || !price || !category) {
    return res.status(400).json({ 
      error: 'Los campos nombre, descripción, precio y categoría son obligatorios' 
    });
  }
  
  // Validar que el precio sea un número
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    return res.status(400).json({ 
      error: 'El precio debe ser un número válido mayor que cero' 
    });
  }
  
  // Verificar si el producto existe
  db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      console.error('Error al verificar producto:', err.message);
      return res.status(500).json({ error: 'Error al verificar producto' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Actualizar producto
    const stmt = db.prepare(`UPDATE products SET 
      name = ?, description = ?, price = ?, category = ?, size = ?, image_url = ?
      WHERE id = ?`);
      
    stmt.run([name, description, priceNumber, category, size || null, image_url || null, productId], function(err) {
      if (err) {
        console.error('Error al actualizar producto:', err.message);
        return res.status(500).json({ error: 'Error al actualizar producto' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json({
        message: 'Producto actualizado exitosamente'
      });
    });
    
    stmt.finalize();
  });
});

// Ruta para eliminar un producto (solo administradores)
router.delete('/:id', isAdmin, (req, res) => {
  const productId = req.params.id;
  
  // Verificar si el producto existe
  db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      console.error('Error al verificar producto:', err.message);
      return res.status(500).json({ error: 'Error al verificar producto' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Eliminar producto
    db.run('DELETE FROM products WHERE id = ?', [productId], function(err) {
      if (err) {
        console.error('Error al eliminar producto:', err.message);
        return res.status(500).json({ error: 'Error al eliminar producto' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json({
        message: 'Producto eliminado exitosamente'
      });
    });
  });
});

module.exports = router;