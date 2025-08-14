const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos de usuarios:', err.message);
  } else {
    console.log('Conectado a la base de datos de usuarios');
  }
});

// Crear la tabla de usuarios si no existe y actualizarla si es necesario
db.serialize(() => {
  // Crear la tabla si no existe
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios verificada o creada');
    }
  });
  
  // Añadir la columna role si no existe
  db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error al añadir la columna role:', err.message);
    } else if (!err) {
      console.log('Columna role añadida a la tabla de usuarios');
    }
  });
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // Validaciones básicas
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }
  
  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  
  try {
    // Verificar si el email ya está registrado
    const existingUser = await new Promise((resolve, reject) => {
      db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insertar nuevo usuario
    const result = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`);
      stmt.run(name, email, phone, hashedPassword, 'user', function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
      stmt.finalize();
    });
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.lastID
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  
  try {
    // Buscar usuario por email
    const user = await new Promise((resolve, reject) => {
      db.get(`SELECT id, name, email, phone, password, role FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role || 'user'
      }, 
      process.env.JWT_SECRET || 'secreto_por_defecto',
      { expiresIn: '24h' }
    );
    
    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token: token,
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.role || 'user'
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para obtener todos los usuarios (solo para pruebas)
router.get('/', (req, res) => {
  db.all(`SELECT id, name, email, phone, role, created_at FROM users`, (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err.message);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    
    res.json({ users: rows });
  });
});

module.exports = router;