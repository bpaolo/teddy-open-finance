import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/client.types';
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
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/dashboard/clients/${client.id}`);
  };

  return (
    <div className={`shared-client-card ${isSelected ? 'client-card-selected' : ''}`}>
      <div className="client-card-header">
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(client)}
            className="client-card-checkbox"
            aria-label={`Selecionar ${client.nome}`}
          />
        )}
        <h3 className="client-card-name">{client.nome}</h3>
      </div>

      <div className="client-card-body">
        <p className="client-card-info-line">
          Email: {client.email || 'N/A'}
        </p>
        <p className="client-card-info-line">
          Telefone: {client.telefone || 'N/A'}
        </p>
        <p className="client-card-info-line">
          Acessos: {client.access_count || 0}
        </p>
      </div>

      <div className="client-card-actions">
        <button
          className="client-card-action-btn client-card-view-btn"
          onClick={handleViewDetails}
          title="Ver detalhes"
        >
          👁️
        </button>
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
