describe('Admin Functionality Tests', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('/login.html');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('adminpassword');
    cy.get('button[type="submit"]').click();
  });

  it('should access admin dashboard', () => {
    cy.visit('/admin.html');
    cy.get('h1').should('contain', 'Panel de Administración');
    cy.get('.admin-menu').should('be.visible');
  });

  it('should view orders in admin panel', () => {
    cy.visit('/admin-orders.html');
    cy.get('h1').should('contain', 'Gestión de Pedidos');
    cy.get('.orders-table').should('be.visible');
  });

  it('should add a new product', () => {
    cy.visit('/admin.html');
    
    // Fill product form
    cy.get('input[name="productName"]').type('Nuevo Producto de Prueba');
    cy.get('input[name="productPrice"]').type('19.99');
    cy.get('textarea[name="productDescription"]').type('Descripción del producto de prueba');
    cy.get('input[name="productImage"]').type('test-image.jpg');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Check for success message
    cy.get('.success-message').should('be.visible');
  });

  it('should edit an existing product', () => {
    cy.visit('/admin.html');
    
    // Click edit button on first product
    cy.get('.edit-product').first().click();
    
    // Modify product name
    cy.get('input[name="productName"]').clear().type('Producto Editado');
    
    // Save changes
    cy.get('button[type="submit"]').click();
    
    // Check for success message
    cy.get('.success-message').should('be.visible');
  });

  it('should delete a product', () => {
    cy.visit('/admin.html');
    
    // Click delete button on first product
    cy.get('.delete-product').first().click();
    
    // Confirm deletion
    cy.on('window:confirm', () => true);
    
    // Check for success message
    cy.get('.success-message').should('be.visible');
  });
});