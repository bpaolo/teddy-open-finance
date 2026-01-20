import React from 'react';
import { Client } from '../../../types/client.types';
import { Button } from '../Button/Button';
import minusIcon from '../../../assets/images/minus-svgrepo-com.png';
import './ClientCard.css';

interface ClientCardProps {
  client: Client;
  onSelect?: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  deleteLoading?: string | null;
  isSelected?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onSelect,
  onEdit,
  onDelete,
  deleteLoading,
  isSelected = false,
}) => {
  return (
    <div className={`shared-client-card ${isSelected ? 'client-card-selected' : ''}`}>
      <h3 className="client-card-name">{client.nome}</h3>

      <div className="client-card-body">
        <p className="client-card-info-line">
          Email: {client.email || 'N/A'}
        </p>
        <p className="client-card-info-line">
          Telefone: {client.telefone || 'N/A'}
        </p>
      </div>

      <div className="client-card-actions">
        {onSelect && (
          <button
            className={`client-card-action-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(client)}
            title={isSelected ? 'Remover dos selecionados' : 'Adicionar aos selecionados'}
          >
            {isSelected ? (
              <img src={minusIcon} alt="Remover" className="action-icon" />
            ) : (
              <span>+</span>
            )}
          </button>
        )}
        <button
          className="client-card-action-btn client-card-edit-btn"
          onClick={() => onEdit(client)}
          title="Editar"
        >
          ✏️
        </button>
        <button
          className="client-card-action-btn client-card-delete-btn"
          onClick={() => onDelete(client.id)}
          title="Excluir (Soft Delete)"
          disabled={deleteLoading === client.id}
        >
          {deleteLoading === client.id ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
};
