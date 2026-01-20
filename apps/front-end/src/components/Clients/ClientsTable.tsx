import React, { useState } from 'react';
import { Client } from '../../types/client.types';
import { ClientViewModal } from './ClientViewModal';
import { ClientEditModal } from './ClientEditModal';
import './ClientsTable.css';

interface ClientsTableProps {
  clients: Client[];
  onRefresh: () => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onRefresh,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleView = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação executará um Soft Delete.')) {
      return;
    }

    setDeleteLoading(id);
    try {
      const { clientsService } = await import('../../services/clients.service');
      await clientsService.delete(id);
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <div className="clients-table-container">
        <h3>Lista de Clientes</h3>
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Acessos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    Nenhum cliente cadastrado
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.nome}</td>
                    <td>{client.email}</td>
                    <td>
                      <span className="access-count">{client.access_count}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleView(client)}
                          className="btn-view"
                          title="Visualizar (incrementa contador)"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="btn-delete"
                          title="Excluir (Soft Delete)"
                          disabled={deleteLoading === client.id}
                        >
                          {deleteLoading === client.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <ClientViewModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onView={() => {
            onRefresh();
            setSelectedClient(null);
          }}
        />
      )}

      {editClient && (
        <ClientEditModal
          client={editClient}
          onClose={() => setEditClient(null)}
          onSave={() => {
            onRefresh();
            setEditClient(null);
          }}
        />
      )}
    </>
  );
};
