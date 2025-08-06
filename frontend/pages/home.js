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
        <title>Arreglos Victoria Florería</title>
        <link rel="stylesheet" href="assets/css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
        
        <script src="assets/js/main.js"></script>
    </body>
    </html>
  `;
};

export default Home;