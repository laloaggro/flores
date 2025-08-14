const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos de usuarios:', err.message);
    process.exit(1);
  } else {
    console.log('Conectado a la base de datos de usuarios');
  }
});

// Añadir columna role si no existe
db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error al añadir columna role:', err.message);
  } else if (!err) {
    console.log('Columna role añadida a la tabla users');
  } else {
    console.log('La columna role ya existe');
  }
  
  // Crear usuario administrador
  createAdminUser();
});

function createAdminUser() {
  const adminEmail = 'admin@arreglosvictoria.com';
  const adminPassword = 'admin123';
  const adminName = 'Administrador';
  const adminPhone = '+56963603177';
  
  // Verificar si el usuario ya existe
  db.get(`SELECT id FROM users WHERE email = ?`, [adminEmail], (err, row) => {
    if (err) {
      console.error('Error al verificar usuario existente:', err.message);
      db.close();
      return;
    }
    
    if (row) {
      console.log('El usuario administrador ya existe. Actualizando su rol a admin...');
      
      // Actualizar el rol del usuario existente
      db.run(`UPDATE users SET role = 'admin' WHERE email = ?`, [adminEmail], function(err) {
        if (err) {
          console.error('Error al actualizar el rol del usuario:', err.message);
        } else {
          console.log('Rol de administrador asignado correctamente');
        }
        db.close();
      });
      return;
    }
    
    // Hashear la contraseña
    bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error al hashear la contraseña:', err.message);
        db.close();
        return;
      }
      
      // Insertar nuevo usuario administrador
      const stmt = db.prepare(`INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`);
      stmt.run(adminName, adminEmail, adminPhone, hashedPassword, 'admin', function(err) {
        if (err) {
          console.error('Error al crear usuario administrador:', err.message);
        } else {
          console.log(`Usuario administrador creado exitosamente con ID: ${this.lastID}`);
          console.log('Credenciales:');
          console.log(`Email: ${adminEmail}`);
          console.log(`Contraseña: ${adminPassword}`);
        }
        stmt.finalize();
        db.close();
      });
    });
  });
}