// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  // Visitar a página de login
  cy.visit('/login');
  
  // Verificar que a página de login está visível
  cy.contains('Olá, seja bem-vindo!', { timeout: 5000 }).should('be.visible');
  
  // Preencher email
  cy.get('input[placeholder*="email" i]')
    .should('be.visible')
    .clear()
    .type(email);
  
  // Preencher senha
  cy.get('input[placeholder*="senha" i]')
    .should('be.visible')
    .clear()
    .type(password);
  
  // Clicar no botão 'Entrar' usando cy.contains para garantir que encontra o botão correto
  cy.contains('button', 'Entrar')
    .should('be.visible')
    .should('not.be.disabled')
    .click();
  
  // Aguardar animação de login acontecer
  cy.wait(1000);
  
  // Verificar redirecionamento para o dashboard
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
  
  // Aguardar que o dashboard carregue completamente
  cy.contains(/clientes encontrados|cliente encontrado/i, { timeout: 10000 }).should('be.visible');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
