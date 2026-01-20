import { useState, useCallback } from 'react';
import { Client } from '../types/client.types';

interface UseSelectedClientsReturn {
  selectedClients: Client[];
  isSelected: (id: string) => boolean;
  toggleSelection: (client: Client) => void;
  clearSelection: () => void;
  selectAll: (clients: Client[]) => void;
}

export const useSelectedClients = (): UseSelectedClientsReturn => {
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const isSelected = useCallback(
    (id: string) => {
      return selectedClients.some((client) => client.id === id);
    },
    [selectedClients]
  );

  const toggleSelection = useCallback((client: Client) => {
    setSelectedClients((prev) => {
      const isAlreadySelected = prev.some((c) => c.id === client.id);
      if (isAlreadySelected) {
        return prev.filter((c) => c.id !== client.id);
      }
      return [...prev, client];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedClients([]);
  }, []);

  const selectAll = useCallback((clients: Client[]) => {
    setSelectedClients(clients);
  }, []);

  return {
    selectedClients,
    isSelected,
    toggleSelection,
    clearSelection,
    selectAll,
  };
};
