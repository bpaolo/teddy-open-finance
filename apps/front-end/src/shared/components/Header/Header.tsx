import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../Button/Button';
import './Header.css';

export interface HeaderProps {
  className?: string;
}

/**
 * Componente Header (Atomic Design - Organism)
 * Single Responsibility: Exibir cabeçalho com nome do usuário e logout
 * Dependency Inversion: Usa hooks, não conhece implementação
 */
export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.nome || user?.email || 'Usuário';

  return (
    <header className={`shared-header ${className}`}>
      <div className="header-content">
        <div className="header-user">
          <div className="header-user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="header-user-name">{displayName}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} icon={<span>🚪</span>}>
          Logout
        </Button>
      </div>
    </header>
  );
};
