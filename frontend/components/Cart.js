const Cart = () => {
  return `
    <div id="cartModal" class="cart-modal">
      <div class="cart-content">
        <div class="cart-header">
          <h2>Tu Carrito</h2>
          <span class="cart-close">&times;</span>
        </div>
        <div class="cart-body">
          <div class="cart-items">
            <!-- Los items del carrito se cargarán aquí dinámicamente -->
            <p class="empty-cart-message">Tu carrito está vacío</p>
          </div>
          <div class="cart-summary">
            <div class="cart-total">
              <span>Total:</span>
              <span class="total-amount">$0.00</span>
            </div>
            <button class="btn btn-primary checkout-button" disabled>Proceder al Pedido</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Cart;