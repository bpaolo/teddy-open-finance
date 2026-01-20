import { useState, useCallback } from 'react';
import { Client } from '../types/client.types';
import { clientsService } from '../services/clients.service';

interface UseSelectedClientReturn {
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  selectClient: (client: Client) => void;
  clearSelection: () => void;
  viewClient: (clientId: string) => Promise<Client | null>;
}

/**
 * Custom Hook para gerenciar cliente selecionado
 * Dependency Inversion: Isola lógica de negócio, facilita testes
 * Single Responsibility: Gerenciar estado e ações de cliente selecionado
 */
export const useSelectedClient = (): UseSelectedClientReturn => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedClient(null);
    setError(null);
  }, []);

  /**
   * Visualizar cliente (incrementa access_count no backend)
   * Dependency Inversion: Usa clientsService, não conhece implementação
   */
  const viewClient = useCallback(async (clientId: string): Promise<Client | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedClient = await clientsService.getById(clientId);
      setSelectedClient(updatedClient);
      return updatedClient;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao visualizar cliente';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    selectedClient,
    loading,
    error,
    selectClient,
    clearSelection,
    viewClient,
  };
};
