import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/client.types';
import './ClientsTable.css';

interface ClientsTableProps {
  clients: Client[];
  selectedClients: Client[];
  onToggleSelect: (client: Client) => void;
  onToggleSelectAll: () => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  deleteLoading?: string | null;
  isAllSelected: boolean;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  selectedClients,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  deleteLoading,
  isAllSelected,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (clientId: string) => {
    navigate(`/dashboard/clients/${clientId}`);
  };

  const isSelected = (id: string) => {
    return selectedClients.some((c) => c.id === id);
  };

  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th className="clients-table-checkbox">
              <input
                type="checkbox"
                checked={isAllSelected && clients.length > 0}
                onChange={onToggleSelectAll}
                aria-label="Selecionar todos os clientes"
              />
            </th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Acessos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={6} className="clients-table-empty">
                Nenhum cliente encontrado.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr
                key={client.id}
                className={isSelected(client.id) ? 'clients-table-row-selected' : ''}
              >
                <td className="clients-table-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected(client.id)}
                    onChange={() => onToggleSelect(client)}
                    aria-label={`Selecionar ${client.nome}`}
                  />
                </td>
                <td className="clients-table-name">{client.nome}</td>
                <td className="clients-table-email">{client.email || 'N/A'}</td>
                <td className="clients-table-phone">{client.telefone || 'N/A'}</td>
                <td className="clients-table-access">{client.access_count || 0}</td>
                <td className="clients-table-actions">
                  <button
                    className="clients-table-action-btn clients-table-view-btn"
                    onClick={() => handleViewDetails(client.id)}
                    title="Ver detalhes"
                  >
                    👁️
                  </button>
                  <button
                    className="clients-table-action-btn clients-table-edit-btn"
                    onClick={() => onEdit(client)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="clients-table-action-btn clients-table-delete-btn"
                    onClick={() => onDelete(client.id)}
                    title="Excluir (Soft Delete)"
                    disabled={deleteLoading === client.id}
                  >
                    {deleteLoading === client.id ? '⏳' : '🗑️'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
