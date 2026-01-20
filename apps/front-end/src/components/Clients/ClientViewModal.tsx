import React, { useEffect, useState } from 'react';
import { Client } from '../../types/client.types';
import { clientsService } from '../../services/clients.service';
import './Modal.css';

interface ClientViewModalProps {
  client: Client;
  onClose: () => void;
  onView: () => void;
}

export const ClientViewModal: React.FC<ClientViewModalProps> = ({
  client: initialClient,
  onClose,
  onView,
}) => {
  const [client, setClient] = useState<Client>(initialClient);

  useEffect(() => {
    // Sincronização do Contador: Ao abrir o modal, fazer GET /clients/:id
    // Isso incrementa o access_count no backend
    const incrementAccess = async () => {
      try {
        const updatedClient = await clientsService.getById(initialClient.id);
        // Atualizar dados do cliente exibidos no modal com o valor atualizado
        if (updatedClient) {
          setClient(updatedClient);
          // Após sucesso da chamada, recarregar a lista para atualizar gráfico
          onView();
        }
      } catch (error) {
        // Erro já tratado pelo hook useSelectedClient
      }
    };

    incrementAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClient.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes do Cliente</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Nome</label>
            <p>{client.nome}</p>
          </div>

          <div className="modal-field">
            <label>Email</label>
            <p>{client.email}</p>
          </div>

          <div className="modal-field">
            <label>Telefone</label>
            <p>{client.telefone}</p>
          </div>

          <div className="modal-field">
            <label>Total de Acessos</label>
            <p className="access-count-large">{client.access_count}</p>
          </div>

          <div className="modal-field">
            <label>Data de Cadastro</label>
            <p>{new Date(client.createdAt).toLocaleString('pt-BR')}</p>
          </div>

          <div className="modal-field">
            <label>Última Atualização</label>
            <p>{new Date(client.updatedAt).toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-close">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
