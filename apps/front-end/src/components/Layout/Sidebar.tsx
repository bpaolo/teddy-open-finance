import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Teddy Open Finance</h2>
      </div>

      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
    </aside>
  );
};
