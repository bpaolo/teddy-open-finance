/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login a user
     * @example cy.login('admin@teddy.com.br', 'admin123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}
