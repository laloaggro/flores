const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Crear limitador de tasa para prevenir ataques de fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos por ventana
  message: {
    error: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos de usuarios:', err.message);
  } else {
    console.log('Conectado a la base de datos de usuarios');
  }
});

// Crear la tabla de usuarios si no existe
db.serialize(() => {
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
  
  // Validar formato de teléfono
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: 'Formato de teléfono inválido. Debe contener al menos 8 dígitos numéricos' 
    });
  }
  
  try {
    // Verificar si el email ya está registrado
    const existingUser = await new Promise((resolve, reject) => {
      db.get(`SELECT id, email FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    if (existingUser) {
      console.log(`Intento de registro con email ya existente: ${email}`);
      return res.status(400).json({ 
        error: `El email ${email} ya está registrado. Por favor, inicie sesión o use otro email.` 
      });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insertar nuevo usuario
    const result = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`);
      stmt.run(name, email, phone, hashedPassword, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
      stmt.finalize();
    });
    
    console.log(`Nuevo usuario registrado: ${name} (${email})`);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.lastID
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ 
        error: 'El email ya está registrado. Por favor, use otro email o inicie sesión.' 
      });
    }
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario. Por favor, inténtelo más tarde.' });
  }
});

// Ruta para iniciar sesión
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  
  try {
    // Buscar usuario por email (sin incluir la contraseña en la primera consulta)
    const user = await new Promise((resolve, reject) => {
      db.get(`SELECT id, name, email, phone FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña (obtener el hash de la contraseña solo si el usuario existe)
    const userWithPassword = await new Promise((resolve, reject) => {
      db.get(`SELECT password FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({
      message: 'Inicio de sesión exitoso',
      user: user
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para obtener todos los usuarios (solo para pruebas)
router.get('/', (req, res) => {
  db.all(`SELECT id, name, email, phone, created_at FROM users`, (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err.message);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    
    res.json({ users: rows });
  });
});

module.exports = router;