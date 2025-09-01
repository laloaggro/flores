describe('Cart Flow Tests', () => {
  beforeEach(() => {
    cy.visit('/products.html');
  });

  it('debería agregar un producto al carrito', () => {
    cy.get('.product-card').first().within(() => {
      cy.get('.add-to-cart').click();
    });
    
    cy.get('.cart-count').should('contain', '1');
  });

  it('debería mostrar el carrito al hacer clic en el icono del carrito', () => {
    cy.get('.cart-icon').click();
    cy.get('.cart-modal').should('be.visible');
  });

  it('debería actualizar la cantidad de productos en el carrito', () => {
    cy.get('.product-card').first().within(() => {
      cy.get('.add-to-cart').click();
    });
    
    cy.get('.cart-icon').click();
    cy.get('.cart-modal').should('be.visible');
    
    cy.get('.cart-item').first().within(() => {
      cy.get('.quantity-input').clear().type('2');
      cy.get('.update-quantity').click();
    });
    
    cy.get('.cart-total').should('be.visible');
  });
});