import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock do AuthContext
const mockLogin = vi.fn();
const mockAuthContext = {
  login: mockLogin,
  logout: vi.fn(),
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => mockAuthContext,
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('deve renderizar o formulário de login', () => {
    renderLogin();

    expect(screen.getByText('Olá, seja bem-vindo!')).toBeInTheDocument();
    expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o seu email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('não deve permitir enviar o formulário sem email', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Digite o seu email');
    const passwordInput = screen.getByPlaceholderText('Digite a sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher apenas a senha, deixar email vazio
    await user.type(passwordInput, 'senha123');

    // Tentar submeter o formulário
    await user.click(submitButton);

    // Verificar que o erro de validação aparece
    await waitFor(() => {
      expect(screen.getByText(/por favor, digite o seu email/i)).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não deve permitir enviar o formulário sem senha', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Digite o seu email');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher apenas o email, deixar senha vazia
    await user.type(emailInput, 'joao@example.com');

    // Tentar submeter o formulário
    await user.click(submitButton);

    // Verificar que o erro de validação aparece
    await waitFor(() => {
      expect(screen.getByText(/por favor, digite a sua senha/i)).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não deve permitir enviar o formulário sem email e senha', async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Tentar submeter o formulário vazio
    await user.click(submitButton);

    // Verificar que os erros de validação aparecem
    await waitFor(() => {
      expect(screen.getByText(/por favor, digite o seu email/i)).toBeInTheDocument();
      expect(screen.getByText(/por favor, digite a sua senha/i)).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('deve validar formato de email inválido', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Digite o seu email');
    const passwordInput = screen.getByPlaceholderText('Digite a sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher com email inválido
    await user.type(emailInput, 'email-invalido');
    await user.type(passwordInput, 'senha123');

    // Tentar submeter o formulário
    await user.click(submitButton);

    // Verificar que o erro de validação de email aparece
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('deve validar senha com menos de 6 caracteres', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Digite o seu email');
    const passwordInput = screen.getByPlaceholderText('Digite a sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher com senha muito curta
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, '12345'); // Apenas 5 caracteres

    // Tentar submeter o formulário
    await user.click(submitButton);

    // Verificar que o erro de validação de senha aparece
    await waitFor(() => {
      expect(screen.getByText(/a senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('deve permitir enviar o formulário com email e senha válidos', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Digite o seu email');
    const passwordInput = screen.getByPlaceholderText('Digite a sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Preencher com dados válidos
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'senha123');

    // Submeter o formulário
    await user.click(submitButton);

    // Verificar que o login foi chamado com os dados corretos
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('joao@example.com', 'senha123');
    });
  });
});
