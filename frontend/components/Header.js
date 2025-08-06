const Header = () => {
  return `
    <header role="banner">
      <div class="container">
        <nav class="navbar" role="navigation" aria-label="Menú principal">
          <a href="#home" class="logo" aria-label="Arreglos Victoria - Ir al inicio"><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Victoria</a>
          <ul class="nav-links">
            <li><a href="#home" aria-current="page">Inicio</a></li>
            <li><a href="#products">Productos</a></li>
            <li><a href="#about">Nosotros</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
          <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras">
            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            <span class="cart-count" aria-label="Número de productos en el carrito">0</span>
          </div>
        </nav>
      </div>
    </header>
  `;
};

export default Header;