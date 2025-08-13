const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../database/connection');

const router = express.Router();

// Registro de usuario
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (row) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Encriptar contraseña
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Crear nuevo usuario con rol por defecto 'user'
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, 'user'],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error al registrar usuario' });
          }

          // Crear token
          const token = jwt.sign(
            { userId: this.lastID, email, role: 'user' },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '24h' }
          );

          // Enviar respuesta sin la contraseña
          res.status(201).json({
            token,
            user: {
              id: this.lastID,
              name,
              email,
              role: 'user'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Inicio de sesión
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (!row) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const validPassword = bcrypt.compareSync(password, row.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Crear token con información del rol
      const token = jwt.sign(
        { userId: row.id, email: row.email, role: row.role },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '24h' }
      );

      // Enviar respuesta sin la contraseña
      res.json({
        token,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Obtener información del usuario actual
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    
    // Buscar usuario
    db.get("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.userId], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (!row) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role
        }
      });
    });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

module.exports = router;