import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../types/client.types';
import api from '../services/api';
import { clientsService } from '../services/clients.service';

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  totalClients: number;
  totalViews: number;
  refreshClients: () => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
}

/**
 * Custom Hook para gerenciar dados de clientes
 * Isola toda a lógica de busca, cálculos e mutações
 */
export const useClients = (): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para buscar todos os clientes
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Client[]>('/clients');
      setClients(response.data);
    } catch (err: any) {
      // Tratamento de erros: redireciona para login se token expirado
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setError('Erro ao carregar clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Função para recarregar clientes
  const refreshClients = useCallback(async () => {
    await fetchClients();
  }, [fetchClients]);

  // Função para deletar cliente (soft delete)
  const deleteClient = useCallback(
    async (id: string) => {
      try {
        await clientsService.delete(id);
        await refreshClients();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Erro ao excluir cliente');
      }
    },
    [refreshClients]
  );

  // Função para atualizar cliente
  const updateClient = useCallback(
    async (id: string, data: Partial<Client>) => {
      try {
        await clientsService.update(id, data);
        await refreshClients();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Erro ao atualizar cliente');
      }
    },
    [refreshClients]
  );

  // Cálculo de totais
  const totalClients = clients.length;
  const totalViews = clients.reduce((sum, client) => sum + client.access_count, 0);

  // Carregar clientes na montagem do componente
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    totalClients,
    totalViews,
    refreshClients,
    deleteClient,
    updateClient,
  };
};
