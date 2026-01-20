import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Tipos
export interface User {
  id: string;
  email?: string;
  nome?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithName: (nome: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;

      // Salvar token no localStorage
      localStorage.setItem('token', access_token);

      // Criar objeto user básico (a API pode retornar mais dados no futuro)
      const userData: User = {
        id: '', // Será preenchido quando a API retornar
        email,
      };

      // Salvar user no localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Atualizar estado
      setToken(access_token);
      setUser(userData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  };

  // Função de login simulado (usando apenas o nome)
  const loginWithName = async (nome: string): Promise<void> => {
    // Gerar um token simulado
    const simulatedToken = `simulated_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Criar objeto user com nome
    const userData: User = {
      id: `user_${Date.now()}`,
      nome,
    };

    // Salvar token simulado no localStorage
    localStorage.setItem('token', simulatedToken);

    // Salvar user no localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Atualizar estado
    setToken(simulatedToken);
    setUser(userData);
  };

  // Função de logout completa
  const logout = (): void => {
    // Limpar todos os dados sensíveis do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Limpar sessionStorage se houver dados sensíveis
    sessionStorage.clear();

    // Limpar estado de autenticação
    setToken(null);
    setUser(null);

    // Limpar cache do navegador relacionado à autenticação
    // Isso garante que dados sensíveis não fiquem em cache
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    loginWithName,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
