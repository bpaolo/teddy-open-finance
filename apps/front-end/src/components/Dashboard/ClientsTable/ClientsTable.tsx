import React, { useState } from 'react';
import { Client } from '../../../types/client.types';
import { ClientViewModal } from '../../Clients/ClientViewModal';
import { ClientEditModal } from '../../Clients/ClientEditModal';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import './ClientsTable.css';

interface ClientsTableProps {
  clients: Client[];
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Componente ClientsTable
 * Responsabilidade única: Exibir tabela de clientes com ações
 */
export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onRefresh,
  onDelete,
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
      await onDelete(id);
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      alert(error.message || 'Erro ao excluir cliente. Tente novamente.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <Card padding="lg" className="clients-table-container">
        <h3 className="clients-table-title">Lista de Clientes</h3>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(client)}
                          title="Visualizar (incrementa contador)"
                        >
                          👁️
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          title="Editar"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                          title="Excluir (Soft Delete)"
                          disabled={deleteLoading === client.id}
                        >
                          {deleteLoading === client.id ? '⏳' : '🗑️'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
