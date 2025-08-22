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

// Crear la tabla de usuarios si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios verificada o creada');
    }
  });
  
  // Crear un usuario administrador por defecto si no existe ninguno
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (!err && row.count === 0) {
      const defaultAdminPassword = 'admin123';
      bcrypt.hash(defaultAdminPassword, 10, (err, hashedPassword) => {
        if (!err) {
          db.run(`INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
            ['Administrador', 'admin@arreglosvictoria.com', '+56963603177', hashedPassword, 'admin'],
            (err) => {
              if (err) {
                console.error('Error al crear usuario administrador:', err.message);
              } else {
                console.log('Usuario administrador creado por defecto');
              }
            }
          );
        }
      });
    }
  });
});

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar si es administrador
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// Ruta para registrar un nuevo usuario (público)
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
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.lastID
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para crear un nuevo usuario (solo administradores)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, email, phone, password, role = 'user' } = req.body;
  
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
      stmt.run(name, email, phone, hashedPassword, role, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
      stmt.finalize();
    });
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      userId: result.lastID
    });
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ error: 'Error al crear usuario' });
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definida en las variables de entorno');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      }, 
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para iniciar sesión con Google
router.post('/google-login', async (req, res) => {
  try {
    const { googleId, email, name, imageUrl } = req.body;
    
    // Validaciones básicas
    if (!googleId || !email || !name) {
      return res.status(400).json({ 
        error: 'Se requieren googleId, email y name para iniciar sesión con Google' 
      });
    }
    
    // Buscar usuario por email o googleId
    let user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, phone, role FROM users WHERE email = ? OR google_id = ?`, 
        [email, googleId], 
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
    
    // Si no existe el usuario, crear uno nuevo
    if (!user) {
      const newUser = await new Promise((resolve, reject) => {
        const stmt = db.prepare(
          `INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)`
        );
        
        stmt.run([name, email, googleId, 'user'], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
              role: 'user'
            });
          }
        });
        
        stmt.finalize();
      });
      
      user = newUser;
    } else if (!user.google_id) {
      // Si el usuario existe pero no tiene google_id, actualizarlo
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE users SET google_id = ? WHERE id = ?`,
          [googleId, user.id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }
    
    // Generar token JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definida en las variables de entorno');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      }, 
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Inicio de sesión con Google exitoso',
      user,
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión con Google' });
  }
});

// Ruta para obtener el perfil del usuario (verificación de token)
router.get('/profile', authenticateToken, (req, res) => {
  const { id, email, name, role } = req.user;
  
  res.json({
    id,
    email,
    name,
    role
  });
});

// Ruta para obtener todos los usuarios (solo administradores)
router.get('/', authenticateToken, isAdmin, (req, res) => {
  db.all(`SELECT id, name, email, phone, role, created_at FROM users`, (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err.message);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    
    res.json({ users: rows });
  });
});

// Ruta para obtener un usuario específico por ID (solo administradores)
router.get('/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = req.params.id;
  
  db.get(`SELECT id, name, email, phone, role FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      console.error('Error al obtener usuario:', err.message);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(row);
  });
});

// Ruta para actualizar un usuario (solo administradores)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, password, role } = req.body;
  
  // Validaciones básicas
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Nombre, email y teléfono son obligatorios' });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }
  
  try {
    // Verificar si el usuario existe
    const existingUser = await new Promise((resolve, reject) => {
      db.get(`SELECT id, email FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Si se está cambiando el email, verificar que no esté en uso por otro usuario
    if (email !== existingUser.email) {
      const emailInUse = await new Promise((resolve, reject) => {
        db.get(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, userId], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      
      if (emailInUse) {
        return res.status(400).json({ error: 'El email ya está registrado por otro usuario' });
      }
    }
    
    // Preparar consulta de actualización
    let query = `UPDATE users SET name = ?, email = ?, phone = ?`;
    const params = [name, email, phone];
    
    // Si se proporciona una nueva contraseña, hashearla y agregarla a la consulta
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      params.push(hashedPassword);
    }
    
    // Si se proporciona un rol, agregarlo a la consulta
    if (role) {
      query += `, role = ?`;
      params.push(role);
    }
    
    query += ` WHERE id = ?`;
    params.push(userId);
    
    // Actualizar usuario
    await new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Ruta para eliminar un usuario (solo administradores)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = req.params.id;
  
  // Evitar que un administrador se elimine a sí mismo
  if (userId == req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
  }
  
  db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
    if (err) {
      console.error('Error al eliminar usuario:', err.message);
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

module.exports = router;