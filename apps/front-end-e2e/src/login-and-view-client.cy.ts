/**
 * Teste E2E: Login e Chegada na Dashboard
 * 
 * Cenário: Login e Chegada na Dashboard
 * - Visita página de login
 * - Faz login com credenciais válidas
 * - Valida redirecionamento para o dashboard
 * - Valida que o dashboard carregou corretamente
 */
describe('Login e Chegada na Dashboard', () => {
  beforeEach(() => {
    // Limpar estado antes de cada teste
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('deve fazer login e chegar na dashboard com sucesso', () => {
    // Passo 1: Visitar /login
    cy.visit('/login');

    // Verificar que a página de login está visível
    cy.contains('Olá, seja bem-vindo!', { timeout: 5000 }).should('be.visible');
    cy.contains('Acesse sua conta').should('be.visible');

    // Passo 2: Digitar o e-mail e senha (usando credenciais do seed do backend)
    cy.get('input[placeholder*="email" i]')
      .should('be.visible')
      .clear()
      .type('admin@teddy.com.br');

    cy.get('input[placeholder*="senha" i]')
      .should('be.visible')
      .clear()
      .type('admin123');

    // Passo 3: Clicar no botão que contém o texto 'Entrar'
    cy.contains('button', 'Entrar')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    // Aguardar animação de login acontecer e requisição completar
    cy.wait(2000);

    // Verificar se há mensagem de erro (caso o backend não esteja rodando)
    cy.get('body').then(($body) => {
      // Se houver mensagem de erro visível, logar para debug
      if ($body.find('[role="alert"], .error, .alert-error').length > 0) {
        cy.get('[role="alert"], .error, .alert-error').then(($error) => {
          cy.log('Erro encontrado:', $error.text());
        });
      }
    });

    // Passo 4: Validar se a URL contém /dashboard
    // Aumentar timeout para dar tempo do backend responder
    cy.url({ timeout: 15000 }).should('include', '/dashboard');

    // Passo 5: Validar se o título 'Clientes' ou a lista de cards apareceu
    // Verificar se há contagem de clientes (ex: "X clientes encontrados" ou "X cliente encontrado")
    cy.contains(/clientes encontrados|cliente encontrado/i, { timeout: 10000 }).should('be.visible');
    
    // Alternativamente, verificar se há cards de clientes na tela
    // Se houver clientes, os cards devem aparecer
    cy.get('body').then(($body) => {
      if ($body.find('.shared-client-card').length > 0) {
        // Se houver cards, validar que pelo menos um está visível
        cy.get('.shared-client-card', { timeout: 10000 })
          .should('have.length.at.least', 1)
          .first()
          .should('be.visible');
      } else {
        // Se não houver cards, validar que a mensagem de "nenhum cliente" está presente
        cy.contains(/nenhum cliente|clientes aparecerão/i, { timeout: 5000 }).should('be.visible');
      }
    });
  });
});
