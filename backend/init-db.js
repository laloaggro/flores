const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/conectar a la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'products.db'), (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear la tabla de productos
db.serialize(() => {
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

// Cerrar la conexión
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la conexión:', err.message);
  } else {
    console.log('Conexión a la base de datos cerrada');
  }
});