import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Proteção contra navegação de volta após logout
  useEffect(() => {
    // Verificar se o token ainda existe no localStorage
    const token = localStorage.getItem('token');
    
    if (!token && !loading) {
      // Se não há token e não está carregando, forçar logout e redirecionar
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Interceptar tentativas de navegação de volta após logout
  useEffect(() => {
    // Adicionar estado ao histórico quando entrar em rota protegida
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      const token = localStorage.getItem('token');
      
      // Se não há token, redirecionar para login e limpar histórico
      if (!token) {
        // Limpar qualquer estado residual
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirecionar e substituir histórico
        navigate('/login', { replace: true });
        
        // Adicionar novo estado ao histórico para prevenir voltar novamente
        window.history.pushState(null, '', '/login');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: 'var(--color-text-secondary)'
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Limpar qualquer estado residual antes de redirecionar
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
