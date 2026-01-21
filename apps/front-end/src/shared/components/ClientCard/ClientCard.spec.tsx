import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientCard } from './ClientCard';
import { Client } from '../../../types/client.types';

describe('ClientCard', () => {
  const mockClient: Client = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '+55 11 98765-4321',
    access_count: 5,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    deletedAt: null,
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('deve exibir o nome do cliente corretamente', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const nomeElement = screen.getByText('João Silva');
    expect(nomeElement).toBeInTheDocument();
    expect(nomeElement.tagName).toBe('H3');
  });

  it('deve exibir o email do cliente corretamente', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const emailElement = screen.getByText(/Email: joao@example.com/i);
    expect(emailElement).toBeInTheDocument();
    expect(emailElement.textContent).toBe('Email: joao@example.com');
  });

  it('deve exibir o telefone do cliente corretamente', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const telefoneElement = screen.getByText(/Telefone: \+55 11 98765-4321/i);
    expect(telefoneElement).toBeInTheDocument();
    expect(telefoneElement.textContent).toBe('Telefone: +55 11 98765-4321');
  });

  it('deve exibir todos os dados do cliente (Nome, Email, Telefone) na tela', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verificar que todos os dados estão presentes
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText(/Email: joao@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Telefone: \+55 11 98765-4321/i)).toBeInTheDocument();
  });

  it('deve exibir N/A quando email não está disponível', () => {
    const clientSemEmail: Client = {
      ...mockClient,
      email: '',
    };

    renderWithRouter(
      <ClientCard
        client={clientSemEmail}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const emailElement = screen.getByText(/Email: N\/A/i);
    expect(emailElement).toBeInTheDocument();
  });

  it('deve exibir N/A quando telefone não está disponível', () => {
    const clientSemTelefone: Client = {
      ...mockClient,
      telefone: '',
    };

    renderWithRouter(
      <ClientCard
        client={clientSemTelefone}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const telefoneElement = screen.getByText(/Telefone: N\/A/i);
    expect(telefoneElement).toBeInTheDocument();
  });

  it('deve chamar onEdit quando o botão de editar é clicado', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Editar');
    editButton.click();

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockClient);
  });

  it('deve chamar onDelete quando o botão de deletar é clicado', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Excluir (Soft Delete)');
    deleteButton.click();

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockClient.id);
  });

  it('deve chamar onSelect quando o checkbox de selecionar é clicado', () => {
    renderWithRouter(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const selectCheckbox = screen.getByLabelText(`Selecionar ${mockClient.nome}`);
    selectCheckbox.click();

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockClient);
  });
});
