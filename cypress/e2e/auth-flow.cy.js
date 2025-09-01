describe('Authentication Flow Tests', () => {
  it('should navigate to login page from header', () => {
    cy.visit('/');
    cy.get('.login-link').click();
    cy.url().should('include', '/login.html');
  });

  it('should display login form', () => {
    cy.visit('/login.html');
    cy.get('form').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should display error for invalid credentials', () => {
    cy.visit('/login.html');
    
    cy.get('input[name="username"]').type('invaliduser');
    cy.get('input[name="password"]').type('invalidpassword');
    cy.get('button[type="submit"]').click();
    
    cy.get('.error-message').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.visit('/login.html');
    
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('.user-menu').should('be.visible');
  });

  it('should logout successfully', () => {
    // First login
    cy.visit('/login.html');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    
    // Then logout
    cy.get('.user-menu').click();
    cy.get('.logout-link').click();
    
    // Should redirect to home page and show login link
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('.login-link').should('be.visible');
  });

  it('should navigate to register page from login page', () => {
    cy.visit('/login.html');
    cy.get('.register-link').click();
    cy.url().should('include', '/register.html');
  });

  it('should register a new user', () => {
    cy.visit('/register.html');
    
    cy.get('input[name="username"]').type('newtestuser');
    cy.get('input[name="email"]').type('newtestuser@example.com');
    cy.get('input[name="password"]').type('newtestpassword');
    cy.get('input[name="confirmPassword"]').type('newtestpassword');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to login page
    cy.url().should('include', '/login.html');
    cy.get('.success-message').should('be.visible');
  });
});