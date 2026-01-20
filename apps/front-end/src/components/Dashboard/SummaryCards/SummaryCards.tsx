import React from 'react';
import { Card } from '../../ui/Card/Card';
import './SummaryCards.css';

interface SummaryCardsProps {
  totalClients: number;
  totalViews: number;
}

/**
 * Componente SummaryCards
 * Responsabilidade única: Exibir cards de resumo (Total de Clientes e Engajamento Total)
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalClients,
  totalViews,
}) => {
  return (
    <div className="summary-cards">
      <Card padding="lg" hover className="summary-card">
        <div className="summary-card-icon">👥</div>
        <div className="summary-card-content">
          <h3 className="summary-card-title">Total de Clientes</h3>
          <p className="summary-card-value">{totalClients}</p>
        </div>
      </Card>

      <Card padding="lg" hover className="summary-card summary-card-highlight">
        <div className="summary-card-icon">📊</div>
        <div className="summary-card-content">
          <h3 className="summary-card-title">Engajamento Total</h3>
          <p className="summary-card-value summary-card-value-highlight">
            {totalViews.toLocaleString('pt-BR')}
          </p>
        </div>
      </Card>
    </div>
  );
};
