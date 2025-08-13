const Header = () => {
  return `
    <header>
      <div class="container">
        <nav class="navbar" role="navigation" aria-label="Menú principal">
          <a href="index.html" class="logo"><i class="fas fa-leaf" aria-hidden="true"></i> Arreglos Victoria</a>
          <ul class="nav-links">
            <li><a href="index.html">Inicio</a></li>
            <li><a href="products.html">Productos</a></li>
            <li><a href="index.html#about">Nosotros</a></li>
            <li><a href="index.html#contacto">Contacto</a></li>
          </ul>
          <div class="user-menu" id="userMenu">
            <div class="user-info" id="userInfo">
              <span id="userName"></span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-dropdown" id="userDropdown">
              <a href="profile.html"><i class="fas fa-user"></i> Mi Perfil</a>
              <a href="admin.html" id="adminLink" style="display: none;"><i class="fas fa-cog"></i> Administración</a>
              <a href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            </div>
          </div>
          <a href="login.html" class="login-link" id="loginLink">
            <i class="fas fa-user"></i> Iniciar Sesión
          </a>
          <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras">
            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            <span class="cart-count">0</span>
          </div>
        </nav>
      </div>
    </header>
  `;
};

export default Header;