import Header from '../components/Header.js';
import Hero from '../components/Hero.js';
import Products from '../components/Products.js';
import About from '../components/About.js';
import Contact from '../components/Contact.js';
import Footer from '../components/Footer.js';

const Home = () => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Arreglos Victoria - Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta name="keywords" content="florería, arreglos florales, flores, regalos, entrega a domicilio, Santiago, Chile, rosas, orquídeas">
        <meta name="author" content="Arreglos Victoria">
        <title>Arreglos Victoria Florería - Flores Frescas en Santiago</title>
        <link rel="stylesheet" href="assets/css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://arreglosvictoria.cl/">
        <meta property="og:title" content="Arreglos Victoria Florería - Flores Frescas en Santiago">
        <meta property="og:description" content="Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta property="og:image" content="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://arreglosvictoria.cl/">
        <meta property="twitter:title" content="Arreglos Victoria Florería - Flores Frescas en Santiago">
        <meta property="twitter:description" content="Flores frescas y hermosos arreglos florales para cada ocasión especial. Entrega a domicilio en toda la Región Metropolitana.">
        <meta property="twitter:image" content="https://images.unsplash.com/photo-1593617133396-03503508724d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80">
    </head>
    <body>
        ${Header()}
        ${Hero()}
        <main>
          ${Products()}
          ${About()}
          ${Contact()}
        </main>
        ${Footer()}
        
        <script src="assets/js/app.js"></script>
    </body>
    </html>
  `;
};

export default Home;