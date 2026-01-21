import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar, TopBar } from '../../shared/components';
import { clientsService } from '../../services/clients.service';
import { Client } from '../../types/client.types';
import './ClientDetails.css';

// Lock por ID para evitar múltiplas requisições simultâneas do mesmo cliente
const requestLocks = new Map<string, Promise<Client>>();

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef<boolean>(true);
  const currentIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    mountedRef.current = true;
    currentIdRef.current = id;

    const fetchClient = async () => {
      if (!id) {
        if (mountedRef.current) {
          setError('ID do cliente não fornecido');
          setLoading(false);
        }
        return;
      }

      // Verificar se já existe uma requisição em andamento para este ID
      let requestPromise = requestLocks.get(id);

      if (!requestPromise) {
        // Criar nova requisição e armazenar no lock
        requestPromise = clientsService.getById(id);
        requestLocks.set(id, requestPromise);

        // Limpar o lock após a requisição completar (sucesso ou erro)
        requestPromise
          .catch(() => {
            // Erros serão tratados no catch abaixo, apenas ignorar aqui
          })
          .finally(() => {
            // Só remover se ainda for a mesma requisição
            if (requestLocks.get(id) === requestPromise) {
              requestLocks.delete(id);
            }
          });
      }

      try {
        if (mountedRef.current && currentIdRef.current === id) {
          setLoading(true);
          setError(null);
        }

        const clientData = await requestPromise;

        // Só atualizar se o componente ainda estiver montado e o ID não mudou
        if (mountedRef.current && currentIdRef.current === id) {
          setClient(clientData);
          setLoading(false);
        }
      } catch (err: any) {
        if (mountedRef.current && currentIdRef.current === id) {
          setError(err.response?.data?.message || 'Erro ao carregar detalhes do cliente');
          setLoading(false);
        }
      }
    };

    fetchClient();

    // Cleanup: marcar como desmontado
    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="client-details-container">
        <Sidebar />
        <div className="client-details-content">
          <TopBar />
          <div className="client-details-loading">
            <p>Carregando detalhes do cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="client-details-container">
        <Sidebar />
        <div className="client-details-content">
          <TopBar />
          <div className="client-details-error">
            <p>{error || 'Cliente não encontrado'}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-details-container">
      <Sidebar />
      <div className="client-details-content">
        <TopBar />
        <div className="client-details-section">
          <div className="client-details-header">
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              ← Voltar
            </button>
            <h1 className="client-details-title">Detalhes do Cliente</h1>
          </div>

          <div className="client-details-card">
            <div className="client-details-field">
              <label className="client-details-label">Nome</label>
              <p className="client-details-value">{client.nome}</p>
            </div>

            <div className="client-details-field">
              <label className="client-details-label">Email</label>
              <p className="client-details-value">{client.email || 'N/A'}</p>
            </div>

            <div className="client-details-field">
              <label className="client-details-label">Telefone</label>
              <p className="client-details-value">{client.telefone || 'N/A'}</p>
            </div>

            {client.salario !== undefined && (
              <div className="client-details-field">
                <label className="client-details-label">Salário</label>
                <p className="client-details-value">
                  {client.salario.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
            )}

            {client.empresa && (
              <div className="client-details-field">
                <label className="client-details-label">Empresa</label>
                <p className="client-details-value">{client.empresa}</p>
              </div>
            )}

            <div className="client-details-field">
              <label className="client-details-label">Total de Acessos</label>
              <p className="client-details-value client-details-access-count">
                {client.access_count || 0}
              </p>
            </div>

            <div className="client-details-field">
              <label className="client-details-label">Data de Criação</label>
              <p className="client-details-value">
                {new Date(client.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="client-details-field">
              <label className="client-details-label">Última Atualização</label>
              <p className="client-details-value">
                {new Date(client.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
