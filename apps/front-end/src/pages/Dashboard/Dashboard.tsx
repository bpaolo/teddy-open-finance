import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar, TopBar, ClientCard, Pagination } from '../../shared/components';
import { SummaryCards } from '../../components/Dashboard/SummaryCards/SummaryCards';
import { AnalyticsChart } from '../../components/Dashboard/AnalyticsChart/AnalyticsChart';
import { ClientEditModal } from '../../components/Clients/ClientEditModal';
import { useClients } from '../../hooks/useClients';
import { useSelectedClient } from '../../hooks/useSelectedClient';
import { useSelectedClients } from '../../hooks/useSelectedClients';
import { Client } from '../../types/client.types';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showSelected = searchParams.get('selected') === 'true';

  const {
    clients,
    loading,
    error,
    totalClients,
    totalViews,
    refreshClients,
    deleteClient,
  } = useClients();

  const { viewClient } = useSelectedClient();
  const { selectedClients, isSelected, toggleSelection, clearSelection } =
    useSelectedClients();

  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const displayedClients = useMemo(() => {
    const filtered = showSelected ? selectedClients : clients;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }, [clients, selectedClients, showSelected, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    const total = showSelected ? selectedClients.length : clients.length;
    return Math.ceil(total / itemsPerPage);
  }, [clients.length, selectedClients.length, showSelected, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, showSelected]);

  const handleViewClient = async (client: Client) => {
    const updated = await viewClient(client.id);
    if (updated) {
      await refreshClients();
    }
  };

  const handleEditClient = (client: Client) => {
    setEditClient(client);
  };

  const handleDeleteClient = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este cliente? Esta ação executará um Soft Delete.'
      )
    ) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteClient(id);
      toggleSelection({ id } as Client);
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir cliente. Tente novamente.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditModalClose = () => {
    setEditClient(null);
    refreshClients();
  };

  if (loading && clients.length === 0) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <TopBar />
          <div className="dashboard-loading">
            <p>Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  const clientsToDisplay = showSelected ? selectedClients : clients;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <TopBar />

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        <div className="dashboard-section">
          <SummaryCards totalClients={totalClients} totalViews={totalViews} />
        </div>

        <div className="dashboard-section">
          <AnalyticsChart clients={clients} />
        </div>

        <div className="dashboard-section">
          <div className="dashboard-clients-header">
            <h2 className="dashboard-clients-count">
              {clientsToDisplay.length} {clientsToDisplay.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}:
            </h2>
            {clientsToDisplay.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={clientsToDisplay.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>

          {clientsToDisplay.length === 0 ? (
            <div className="dashboard-empty">
              <p>
                {showSelected
                  ? 'Nenhum cliente selecionado ainda.'
                  : 'Nenhum cliente cadastrado ainda.'}
              </p>
              <p className="dashboard-empty-subtitle">
                {showSelected
                  ? 'Selecione clientes usando o botão + nos cards.'
                  : 'Os clientes aparecerão aqui quando forem cadastrados.'}
              </p>
            </div>
          ) : (
            <>
              <div className="client-cards-grid">
                {displayedClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onSelect={toggleSelection}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                    deleteLoading={deleteLoading}
                    isSelected={isSelected(client.id)}
                  />
                ))}
              </div>

              <div className="dashboard-create-client">
                <button className="btn-create-client" onClick={() => setEditClient({} as Client)}>
                  Criar cliente
                </button>
              </div>

              {clientsToDisplay.length > itemsPerPage && (
                <div className="dashboard-pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={clientsToDisplay.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {(editClient !== null) && (
        <ClientEditModal
          client={editClient}
          onClose={handleEditModalClose}
          onSave={handleEditModalClose}
        />
      )}
    </div>
  );
};
