import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client } from '../types/client.types';

/**
 * Função que calcula o total de acessos dos clientes
 * Extraída de useClients.ts linha 82
 */
export const calculateTotalViews = (clients: Client[]): number => {
  return clients.reduce((sum, client) => sum + client.access_count, 0);
};

describe('calculateTotalViews - Função de cálculo de total de acessos', () => {
  it('deve retornar 0 quando não há clientes', () => {
    const clients: Client[] = [];
    const result = calculateTotalViews(clients);
    expect(result).toBe(0);
  });

  it('deve calcular corretamente o total de acessos com um cliente', () => {
    const clients: Client[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 5,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];

    const result = calculateTotalViews(clients);
    expect(result).toBe(5);
  });

  it('deve calcular corretamente o total de acessos com múltiplos clientes', () => {
    const clients: Client[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 5,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        telefone: '+55 11 98765-4322',
        access_count: 10,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '3',
        nome: 'Pedro Oliveira',
        email: 'pedro@example.com',
        telefone: '+55 11 98765-4323',
        access_count: 3,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];

    const result = calculateTotalViews(clients);
    expect(result).toBe(18); // 5 + 10 + 3
  });

  it('deve calcular corretamente quando alguns clientes têm access_count igual a 0', () => {
    const clients: Client[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 5,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        telefone: '+55 11 98765-4322',
        access_count: 0,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '3',
        nome: 'Pedro Oliveira',
        email: 'pedro@example.com',
        telefone: '+55 11 98765-4323',
        access_count: 10,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];

    const result = calculateTotalViews(clients);
    expect(result).toBe(15); // 5 + 0 + 10
  });

  it('deve calcular corretamente com números grandes', () => {
    const clients: Client[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 1000,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        telefone: '+55 11 98765-4322',
        access_count: 5000,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];

    const result = calculateTotalViews(clients);
    expect(result).toBe(6000); // 1000 + 5000
  });

  it('deve retornar um número quando há clientes', () => {
    const clients: Client[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 5,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];

    const result = calculateTotalViews(clients);
    expect(typeof result).toBe('number');
    expect(Number.isInteger(result)).toBe(true);
  });
});
