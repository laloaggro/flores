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