describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería navegar a la página de productos', () => {
    cy.get('nav a[href="/products.html"]').click();
    cy.url().should('include', '/products.html');
    cy.get('h1').should('contain', 'Nuestros Productos');
  });

  it('debería navegar a la página de contacto', () => {
    cy.get('footer a[href="/contact.html"]').click();
    cy.url().should('include', '/contact.html');
    cy.get('h1').should('contain', 'Contáctanos');
  });

  it('debería navegar a la página "Acerca de"', () => {
    cy.get('footer a[href="/about.html"]').click();
    cy.url().should('include', '/about.html');
    cy.get('h1').should('contain', 'Sobre Nosotros');
  });
});