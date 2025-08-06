const Header = () => {
  return `
    <header>
      <div class="container">
        <nav class="navbar">
          <a href="#home" class="logo"><i class="fas fa-leaf"></i> Arreglos Victoria</a>
          <ul class="nav-links">
            <li><a href="#home">Inicio</a></li>
            <li><a href="#products">Productos</a></li>
            <li><a href="#about">Nosotros</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
          <div class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
          </div>
        </nav>
      </div>
    </header>
  `;
};

export default Header;