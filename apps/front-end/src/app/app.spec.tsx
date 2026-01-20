import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './app';

// Mock do AuthContext para garantir que não está autenticado
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  }),
}));

// Mock do SidebarContext
vi.mock('../contexts/SidebarContext', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSidebar: () => ({
    isOpen: false,
    toggle: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
  }),
}));

describe('App', () => {
  it('should render successfully', () => {
    // O App já possui BrowserRouter interno, não precisa envolver novamente
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('should display login page with greeting "Olá, seja bem-vindo!" when not authenticated', async () => {
    // O App já possui BrowserRouter interno, não precisa envolver novamente
    // O App redireciona para /dashboard por padrão, mas ProtectedRoute redireciona para /login
    // quando não autenticado
    render(<App />);
    
    // Aguardar o redirecionamento para a tela de login
    // Verificar que o título da tela de login está presente
    await waitFor(() => {
      const greeting = screen.getByText('Olá, seja bem-vindo!');
      expect(greeting).toBeInTheDocument();
    });
  });
});
