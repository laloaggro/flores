const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'products.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos de productos');
  }
});

// Middleware para verificar el token y el rol de administrador
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto');
    
    // Verificar si el usuario es administrador
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Error al verificar el token' });
  }
};

// Ruta para obtener todas las categorías únicas
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

// Ruta para obtener todos los productos
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
  if (category) {
    query += ' WHERE category = ?';
    countQuery += ' WHERE category = ?';
    params.push(category);
    countParams.push(category);
  }
  
  if (search) {
    if (category) {
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
    
    // Contar el total de productos con los filtros aplicados
    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        console.error('Error al contar productos:', err.message);
        return res.status(500).json({ error: 'Error al contar productos' });
      }
      
      const total = countRow.total;
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        products: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    });
  });
});

// Ruta para obtener un producto por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Error al obtener producto:', err.message);
      return res.status(500).json({ error: 'Error al obtener producto' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(row);
  });
});

// Ruta para obtener productos por categoría
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  
  // Obtener productos por categoría con paginación
  db.all(`SELECT * FROM products WHERE category = ? LIMIT ? OFFSET ?`, [category, limit, offset], (err, rows) => {
    if (err) {
      console.error('Error al obtener productos por categoría:', err.message);
      return res.status(500).json({ error: 'Error al obtener productos por categoría' });
    }
    
    // Contar el total de productos en la categoría
    db.get(`SELECT COUNT(*) as total FROM products WHERE category = ?`, [category], (err, countRow) => {
      if (err) {
        console.error('Error al contar productos por categoría:', err.message);
        return res.status(500).json({ error: 'Error al contar productos por categoría' });
      }
      
      const total = countRow.total;
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        products: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    });
  });
});

// Ruta para buscar productos por nombre
router.get('/search/:query', (req, res) => {
  const query = `%${req.params.query}%`;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  
  // Buscar productos por nombre
  db.all(`SELECT * FROM products WHERE name LIKE ? LIMIT ? OFFSET ?`, [query, limit, offset], (err, rows) => {
    if (err) {
      console.error('Error al buscar productos:', err.message);
      return res.status(500).json({ error: 'Error al buscar productos' });
    }
    
    // Contar el total de productos encontrados
    db.get(`SELECT COUNT(*) as total FROM products WHERE name LIKE ?`, [query], (err, countRow) => {
      if (err) {
        console.error('Error al contar productos encontrados:', err.message);
        return res.status(500).json({ error: 'Error al contar productos encontrados' });
      }
      
      const total = countRow.total;
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        products: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    });
  });
});

// Ruta para crear un nuevo producto (solo para administradores)
router.post('/', authenticateAdmin, (req, res) => {
  const { name, description, price, category, image } = req.body;
  
  // Validar campos requeridos
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Los campos nombre, precio y categoría son obligatorios' 
    });
  }
  
  // Validar que el precio sea un número válido
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ 
      error: 'El precio debe ser un número válido mayor o igual a cero' 
    });
  }
  
  // Insertar nuevo producto
  const stmt = db.prepare(`INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`);
  stmt.run([name, description, parsedPrice, category, image], function(err) {
    if (err) {
      console.error('Error al crear producto:', err.message);
      return res.status(500).json({ error: 'Error al crear producto: ' + err.message });
    }
    
    // Devolver el producto creado con su ID
    res.status(201).json({
      id: this.lastID,
      name,
      description,
      price: parsedPrice,
      category,
      image
    });
  });
  stmt.finalize();
});

// Ruta para actualizar un producto (solo para administradores)
router.put('/:id', authenticateAdmin, (req, res) => {
  const id = req.params.id;
  const { name, description, price, category, image } = req.body;
  
  // Validar campos requeridos
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Los campos nombre, precio y categoría son obligatorios' 
    });
  }
  
  // Validar que el precio sea un número válido
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ 
      error: 'El precio debe ser un número válido mayor o igual a cero' 
    });
  }
  
  // Verificar si el producto existe
  db.get(`SELECT id FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Error al verificar producto:', err.message);
      return res.status(500).json({ error: 'Error al verificar producto: ' + err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Actualizar el producto
    const stmt = db.prepare(`UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?`);
    stmt.run([name, description, parsedPrice, category, image, id], function(err) {
      if (err) {
        console.error('Error al actualizar producto:', err.message);
        return res.status(500).json({ error: 'Error al actualizar producto: ' + err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      // Devolver el producto actualizado
      res.json({
        id,
        name,
        description,
        price: parsedPrice,
        category,
        image
      });
    });
    stmt.finalize();
  });
});

// Ruta para eliminar un producto (solo para administradores)
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = req.params.id;
  
  // Verificar si el producto existe
  db.get(`SELECT id FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Error al verificar producto:', err.message);
      return res.status(500).json({ error: 'Error al verificar producto' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Eliminar el producto
    db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error('Error al eliminar producto:', err.message);
        return res.status(500).json({ error: 'Error al eliminar producto' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json({ message: 'Producto eliminado correctamente' });
    });
  });
});

module.exports = router;