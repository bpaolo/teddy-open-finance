import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import logo from '../../../assets/images/teddy-logo.png';
import './TopBar.css';

export interface TopBarProps {
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userName = user?.nome || user?.email || 'Usuário';
  const isSelectedPage = location.search.includes('selected');

  return (
    <div className={`shared-topbar ${className}`}>
      <div className="topbar-left">
        <button
          className="topbar-menu-button"
          onClick={toggle}
          aria-label="Abrir menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <img src={logo} alt="Logo Teddy" className="topbar-logo" />
      </div>
      <nav className="topbar-nav">
        <button
          className={`topbar-nav-link ${!isSelectedPage ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Clientes
        </button>
        <button
          className={`topbar-nav-link ${isSelectedPage ? 'active' : ''}`}
          onClick={() => navigate('/dashboard?selected=true')}
        >
          Clientes selecionados
        </button>
        <button
          className="topbar-nav-link"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Sair
        </button>
      </nav>
      <div className="topbar-right">
        <span className="topbar-greeting">Olá, {userName}!</span>
      </div>
    </div>
  );
};
