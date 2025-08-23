const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear la tabla de usuarios si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT,
    google_id TEXT,
    role TEXT DEFAULT 'user',
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios verificada/creada exitosamente');
    }
  });
  
  // Añadir la columna google_id si no existe (para bases de datos existentes)
  db.run(`ALTER TABLE users ADD COLUMN google_id TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error al añadir la columna google_id:', err.message);
    } else if (!err) {
      console.log('Columna google_id añadida exitosamente');
    }
  });
  
  // Añadir la columna image_url si no existe (para bases de datos existentes)
  db.run(`ALTER TABLE users ADD COLUMN image_url TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error al añadir la columna image_url:', err.message);
    } else if (!err) {
      console.log('Columna image_url añadida exitosamente');
    }
  });
  
  // Crear la tabla de registros de inicio de sesión
  db.run(`CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    login_method TEXT NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de registros de inicio de sesión:', err.message);
    } else {
      console.log('Tabla de registros de inicio de sesión verificada/creada exitosamente');
    }
  });
});

// Cerrar la conexión
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Base de datos cerrada correctamente');
  }
});