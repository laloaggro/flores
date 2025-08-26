class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <div class="navbar">
          <a href="index.html" class="logo">
            <span class="logo-text">Arreglos Victoria</span>
          </a>
          
          <nav>
            <ul>
              <li><a href="index.html" id="nav-home">Inicio</a></li>
              <li><a href="products.html" id="nav-products">Productos</a></li>
              <li><a href="contact.html" id="nav-contact">Contacto</a></li>
            </ul>
          </nav>
          
          <div class="user-actions">
            <button id="theme-toggle" class="theme-toggle" aria-label="Cambiar modo de tema">
              <i class="fas fa-moon"></i>
            </button>
            <a href="login.html" id="loginLink" class="btn-login" aria-label="Iniciar sesión" style="display: none;">
              <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
              <span>Iniciar sesión</span>
            </a>
            <div class="user-menu" id="userMenu" role="navigation" aria-label="Menú de usuario" style="display: none;">
              <button class="user-info" aria-haspopup="true" aria-expanded="false">
                <span id="userNameDisplay"></span>
                <i class="fas fa-user" aria-hidden="true"></i>
                <i class="fas fa-caret-down" aria-hidden="true"></i>
              </button>
              <ul class="user-dropdown" role="menu">
                <li><a href="profile.html" role="menuitem"><i class="fas fa-user-circle" aria-hidden="true"></i> Perfil</a></li>
                <li><a href="#" id="logoutLink" role="menuitem"><i class="fas fa-sign-out-alt" aria-hidden="true"></i> Cerrar sesión</a></li>
              </ul>
            </div>
            <div class="cart-icon" role="button" tabindex="0" aria-label="Carrito de compras" aria-expanded="false">
              <i class="fas fa-shopping-cart" aria-hidden="true"></i>
              <span class="cart-count" id="cartCount">0</span>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', Header);