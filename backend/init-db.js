const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Conectar a la base de datos de usuarios
const dbPath = path.join(__dirname, 'users.db');
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
    password TEXT,
    google_id TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios verificada o creada');
    }
  });

  // Crear la tabla de productos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err.message);
    } else {
      console.log('Tabla de productos creada o ya existente');
    }
  });

  // Generar 100 productos de ejemplo
  const stmt = db.prepare(`INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)`);
  
  // Lista de categorías
  const categories = ['Ramos', 'Arreglos', 'Bodas', 'Cumpleaños', 'Condolencias', 'Especiales'];
  
  // Lista de adjetivos para generar nombres de productos
  const adjectives = ['Hermoso', 'Elegante', 'Colorido', 'Exótico', 'Fresco', 'Brillante', 'Encantador', 'Precioso', 'Espléndido', 'Magnífico'];
  
  // Lista de tipos de productos
  const productTypes = ['Ramo', 'Arreglo', 'Bouquet', 'Centro de mesa', 'Cesta', 'Corona', 'Guirnalda'];
  
  // Lista de descripciones
  const descriptions = [
    'Diseño único con flores frescas de temporada',
    'Arreglo floral especial para ocasiones importantes',
    'Composición floral con las mejores flores de la temporada',
    'Creación artística con flores seleccionadas cuidadosamente',
    'Diseño exclusivo elaborado con materiales de primera calidad',
    'Arreglo floral personalizado según tus preferencias',
    'Combinación perfecta de colores y fragancias naturales',
    'Creación floral que transmite emociones y sentimientos'
  ];
  
  // Lista de URLs de imágenes reales que funcionan
  const imageUrls = [
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490112167366-98580e1f53d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490750967426-833c871113d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597146743874-18b555153880?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598193920002-b6ba1031a2d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548772562-0bf1973fb041?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  
  // Generar 100 productos
  for (let i = 1; i <= 100; i++) {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    const name = `${randomAdjective} ${randomType} ${i}`;
    const price = (Math.random() * 10000 + 3000).toFixed(0); // Precio entre 3000 y 13000
    
    stmt.run(name, randomDescription, price, randomImageUrl, randomCategory, function(err) {
      if (err) {
        console.error('Error al insertar producto:', err.message);
      } else {
        console.log(`Producto insertado: ${name} - $${price}`);
      }
    });
  }
  
  stmt.finalize();
});

// Conectar a la base de datos de productos
const productsDbPath = path.join(__dirname, 'products.db');
const productsDb = new sqlite3.Database(productsDbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos de productos:', err.message);
  } else {
    console.log('Conectado a la base de datos de productos');
  }
});

// Crear la tabla de productos si no existe
productsDb.serialize(() => {
  productsDb.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla de productos:', err.message);
    } else {
      console.log('Tabla de productos verificada o creada');
    }
  });
});

// Cerrar las conexiones a las bases de datos después de un tiempo
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos de usuarios:', err.message);
    } else {
      console.log('Conexión a la base de datos de usuarios cerrada');
    }
  });
  
  productsDb.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos de productos:', err.message);
    } else {
      console.log('Conexión a la base de datos de productos cerrada');
    }
  });
}, 2000);