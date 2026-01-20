import React from 'react';
import './StatsCards.css';

interface StatsCardsProps {
  totalClients: number;
  totalAccessCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalClients,
  totalAccessCount,
}) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>Total de Clientes</h3>
          <p className="stat-value">{totalClients}</p>
        </div>
      </div>

      <div className="stat-card stat-card-access">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Engajamento Total</h3>
          <p className="stat-value stat-value-access">{totalAccessCount.toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};
