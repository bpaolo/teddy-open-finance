import React, { useState, useEffect } from 'react';
import { Client, CreateClientDto, UpdateClientDto } from '../../types/client.types';
import { clientsService } from '../../services/clients.service';
import './Modal.css';

interface ClientEditModalProps {
  client: Client | null;
  onClose: () => void;
  onSave: () => void;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
  client,
  onClose,
  onSave,
}) => {
  const isCreate = !client || !client.id;
  
  const [formData, setFormData] = useState<CreateClientDto>({
    nome: '',
    email: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client && client.id) {
      setFormData({
        nome: client.nome || '',
        email: client.email || '',
        telefone: client.telefone || '',
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isCreate) {
        await clientsService.create(formData);
      } else {
        const updateData: UpdateClientDto = {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
        };
        await clientsService.update(client!.id, updateData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || `Erro ao ${isCreate ? 'criar' : 'atualizar'} cliente`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isCreate ? 'Criar cliente:' : 'Editar cliente:'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="nome">Digite o nome:</label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Digite o nome:"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Digite o email:</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Digite o email:"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Digite o telefone:</label>
              <input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="Digite o telefone:"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (isCreate ? 'Criando...' : 'Salvando...') : (isCreate ? 'Criar cliente' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
