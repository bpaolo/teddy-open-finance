export interface Client {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  salario?: number;
  empresa?: string | number;
  access_count: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateClientDto {
  nome: string;
  email: string;
  telefone: string;
}

export interface UpdateClientDto {
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface DashboardStats {
  totalClients: number;
  totalAccessCount: number;
}
