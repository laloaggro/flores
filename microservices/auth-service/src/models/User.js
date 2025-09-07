const bcrypt = require('bcryptjs');

/**
 * Modelo de usuario para el servicio de autenticación
 */
class User {
  constructor(db) {
    this.db = db;
  }

  /**
   * Crear un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {object} Usuario creado
   */
  create(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password } = userData;
      
      // Encriptar contraseña
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }
        
        const query = `
          INSERT INTO users (username, email, password)
          VALUES (?, ?, ?)
        `;
        
        this.db.run(query, [username, email, hashedPassword], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              username,
              email,
              created_at: new Date().toISOString()
            });
          }
        });
      });
    });
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {object|null} Usuario encontrado o null
   */
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      this.db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Buscar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {object|null} Usuario encontrado o null
   */
  findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Validar contraseña
   * @param {string} plainPassword - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña encriptada
   * @returns {boolean} Si la contraseña es válida
   */
  validatePassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Crear tabla de usuarios si no existe
   */
  createTable() {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = User;