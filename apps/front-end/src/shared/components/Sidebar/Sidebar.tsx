import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useSelectedClients } from '../../../hooks/useSelectedClients';
import logo from '../../../assets/images/teddy-logo.png';
import './Sidebar.css';

export interface SidebarProps {
  className?: string;
}

/**
 * Componente Sidebar (Atomic Design - Organism)
 * Single Responsibility: Renderizar navegação lateral
 * Dependency Inversion: Usa hooks para lógica, não conhece implementação
 */
export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedClients } = useSelectedClients();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  if (!isOpen) return null;

  // Determinar qual rota está ativa
  const isDashboardActive = location.pathname === '/dashboard' && !location.search.includes('selected');
  const isClientesSelecionadosActive = location.pathname === '/dashboard' && location.search.includes('selected');
  const isClientDetailsActive = location.pathname.startsWith('/dashboard/clients/');

  return (
    <aside
      className={`shared-sidebar ${className} ${isOpen ? 'sidebar-open' : ''}`}
      onMouseLeave={close}
    >
      <div className="sidebar-header">
        <img src={logo} alt="Logo Teddy" className="sidebar-logo" />
        <button className="sidebar-close-btn" onClick={close} aria-label="Fechar menu">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${isDashboardActive ? 'active' : ''}`}
          onClick={() => handleNavigate('/dashboard')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H9M19 10L21 12M19 10V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H15M9 22C9.53043 22 10.0391 21.7893 10.4142 21.4142C10.7893 21.0391 11 20.5304 11 20V16C11 15.4696 11.2107 14.9609 11.5858 14.5858C11.9609 14.2107 12.4696 14 13 14H15C15.5304 14 16.0391 14.2107 16.4142 14.5858C16.7893 14.9609 17 15.4696 17 16V20C17 20.5304 17.2107 21.0391 17.5858 21.4142C17.9609 21.7893 18.4696 22 19 22M9 22H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Home</span>
        </button>

        <button
          className={`sidebar-nav-item ${(isDashboardActive || isClientDetailsActive) && !isClientesSelecionadosActive ? 'active' : ''}`}
          onClick={() => handleNavigate('/dashboard')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Clientes</span>
        </button>

        <button
          className={`sidebar-nav-item ${isClientesSelecionadosActive ? 'active' : ''}`}
          onClick={() => handleNavigate('/dashboard?selected=true')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M5 21C5 18.2386 7.23858 16 10 16H14C16.7614 16 19 18.2386 19 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="18"
              cy="5"
              r="3"
              fill="currentColor"
            />
            <path
              d="M16.5 5L17.5 6L19.5 4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Clientes selecionados
            {selectedClients.length > 0 && (
              <span className="sidebar-badge"> ({selectedClients.length})</span>
            )}
          </span>
        </button>
      </nav>
    </aside>
  );
};
