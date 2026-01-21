import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;
  let mockRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    softDelete: jest.Mock;
    increment: jest.Mock;
  };

  const createMockClient = (overrides: Partial<Client> = {}): Client => {
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '+55 11 98765-4321',
      access_count: 0,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
      deletedAt: null,
      ...overrides,
    };
  };

  beforeEach(async () => {
    // Usar Fake Timers para controlar o tempo nos testes
    jest.useFakeTimers();
    
    // Criar mock limpo para cada teste
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  afterEach(() => {
    // Resetar todos os mocks após cada teste (ISOLAMENTO DE ESTADO)
    jest.clearAllMocks();
    jest.resetAllMocks();
    
    // Restaurar timers reais após cada teste
    jest.useRealTimers();
  });

  describe('create', () => {
    it('deve criar um cliente com access_count iniciando em 0', async () => {
      const createClientDto: CreateClientDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      };

      const mockClient = createMockClient({
        ...createClientDto,
        access_count: 0, // Garantir que sempre começa em 0
      });

      // Mock: email não existe
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      expect(result).toBeDefined();
      expect(result.nome).toBe(createClientDto.nome);
      expect(result.email).toBe(createClientDto.email);
      expect(result.telefone).toBe(createClientDto.telefone);
      
      // CRÍTICO: Verificar que access_count começa em 0
      expect(result.access_count).toBe(0);
      expect(result.access_count).not.toBe(1);
      expect(result.access_count).not.toBeUndefined();
      expect(result.access_count).not.toBeNull();
      
      // Verificar que create foi chamado com access_count: 0
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createClientDto,
        email: 'joao@example.com', // lowercase
        access_count: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockClient);
    });

    it('deve criar um cliente com campos de auditoria (createdAt, updatedAt)', async () => {
      const createClientDto: CreateClientDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T10:00:00Z');

      const mockClient = createMockClient({
        ...createClientDto,
        createdAt,
        updatedAt,
      });

      // Mock: email não existe
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      expect(result).toBeDefined();
      expect(result.nome).toBe(createClientDto.nome);
      expect(result.email).toBe(createClientDto.email);
      expect(result.telefone).toBe(createClientDto.telefone);
      expect(result.access_count).toBe(0);
      
      // Verificar que os campos de auditoria foram gerados
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.createdAt instanceof Date).toBe(true);
      expect(result.updatedAt instanceof Date).toBe(true);
      
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createClientDto,
        email: 'joao@example.com', // lowercase
        access_count: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockClient);
    });

    it('deve salvar o email em lowercase', async () => {
      const createClientDto: CreateClientDto = {
        nome: 'João Silva',
        email: 'JOAO@EXAMPLE.COM', // Email em uppercase
        telefone: '+55 11 98765-4321',
      };

      const normalizedEmail = 'joao@example.com'; // Email em lowercase
      const mockClient = createMockClient({
        nome: createClientDto.nome,
        email: normalizedEmail,
        telefone: createClientDto.telefone,
      });

      // Mock: email não existe (verificar com email em lowercase)
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      // Verificar que o email foi salvo em lowercase
      expect(result.email).toBe(normalizedEmail);
      expect(result.email).not.toBe('JOAO@EXAMPLE.COM');
      expect(result.email).toBe('joao@example.com');
      
      // Verificar que findOne foi chamado com email em lowercase
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: normalizedEmail },
        withDeleted: true,
      });
      
      // Verificar que o create foi chamado com email em lowercase
      expect(mockRepository.create).toHaveBeenCalledWith({
        nome: createClientDto.nome,
        email: normalizedEmail,
        telefone: createClientDto.telefone,
        access_count: 0,
      });
    });

    it('deve lançar ConflictException se o email já existir (unicidade)', async () => {
      const createClientDto: CreateClientDto = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      };

      const existingClient = createMockClient({
        ...createClientDto,
      });

      // Mock: email já existe
      mockRepository.findOne.mockResolvedValue(existingClient);

      await expect(service.create(createClientDto)).rejects.toThrow(
        ConflictException
      );
      await expect(service.create(createClientDto)).rejects.toThrow(
        'Email já está em uso'
      );
      
      // Verificar que foi verificado o email em lowercase
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' }, // lowercase
        withDeleted: true,
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve bloquear criação de cliente com email duplicado (regra de unicidade)', async () => {
      const createClientDto: CreateClientDto = {
        nome: 'Maria Santos',
        email: 'joao@example.com', // Mesmo email
        telefone: '+55 11 99999-8888',
      };

      // Cliente existente com o mesmo email
      const existingClient = createMockClient({
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      });

      // Mock: email já existe
      mockRepository.findOne.mockResolvedValue(existingClient);

      // Deve lançar exceção mesmo com nome diferente
      await expect(service.create(createClientDto)).rejects.toThrow(
        ConflictException
      );
      await expect(service.create(createClientDto)).rejects.toThrow(
        'Email já está em uso'
      );
      
      // Verificar que a busca foi feita pelo email (não pelo nome)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' },
        withDeleted: true,
      });
      
      // Garantir que não foi criado
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve verificar unicidade de email em lowercase', async () => {
      const existingClient = createMockClient({
        email: 'joao@example.com', // Email em lowercase no banco
      });

      // Tentar criar com email em uppercase (deve ser normalizado)
      const createClientDto: CreateClientDto = {
        nome: 'João Silva',
        email: 'JOAO@EXAMPLE.COM', // Email em uppercase
        telefone: '+55 11 98765-4321',
      };

      // Mock: email já existe (busca em lowercase)
      mockRepository.findOne.mockResolvedValue(existingClient);

      await expect(service.create(createClientDto)).rejects.toThrow(
        ConflictException
      );
      await expect(service.create(createClientDto)).rejects.toThrow(
        'Email já está em uso'
      );
      
      // Verificar que foi buscado em lowercase
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' }, // lowercase
        withDeleted: true,
      });
    });
  });

  describe('validação de email', () => {
    it('deve rejeitar email com formato inválido', async () => {
      const invalidEmails = [
        'email-sem-arroba',
        '@semdominio.com',
        'semdominio@',
        'email..com@example.com',
        'email @example.com',
        'email@',
        'email@example',
        'email@@example.com',
      ];

      for (const invalidEmail of invalidEmails) {
        const createClientDto = plainToClass(CreateClientDto, {
          nome: 'João Silva',
          email: invalidEmail,
          telefone: '+55 11 98765-4321',
        });

        const errors = await validate(createClientDto);
        
        // Verificar que há erros de validação
        expect(errors.length).toBeGreaterThan(0);
        
        // Verificar que o erro é relacionado ao email
        const emailError = errors.find((error) => error.property === 'email');
        expect(emailError).toBeDefined();
        expect(emailError?.constraints).toBeDefined();
      }
    });

    it('deve aceitar emails com formato válido', async () => {
      const validEmails = [
        'joao@example.com',
        'joao.silva@example.com',
        'joao_silva@example.com',
        'joao123@example.com',
        'joao+tag@example.com',
        'joao@example.co.uk',
        'joao@subdomain.example.com',
      ];

      for (const validEmail of validEmails) {
        const createClientDto = plainToClass(CreateClientDto, {
          nome: 'João Silva',
          email: validEmail,
          telefone: '+55 11 98765-4321',
        });

        const errors = await validate(createClientDto);
        
        // Verificar que não há erros de validação do email
        const emailError = errors.find((error) => error.property === 'email');
        expect(emailError).toBeUndefined();
      }
    });
  });

  describe('findOne (Visualizar Detalhes)', () => {
    it('deve incrementar access_count de 0 para 1 ao buscar um cliente pelo ID', async () => {
      // ISOLAMENTO: Garantir que access_count começa em 0 (não 7 de teste anterior)
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      
      // Criar cliente limpo com access_count: 0 (resetado)
      const mockClient = createMockClient({
        id: clientId,
        access_count: 0, // Garantir que sempre começa em 0
      });

      // Cliente após incremento
      const updatedClient = createMockClient({
        id: clientId,
        access_count: 1, // Incrementado para 1
      });

      // Mock do primeiro findOne (verificação de existência)
      mockRepository.findOne
        .mockResolvedValueOnce(mockClient) // Primeira chamada: cliente existe
        .mockResolvedValueOnce(updatedClient); // Segunda chamada: após incremento

      // Mock do increment (operação SQL direta)
      mockRepository.increment.mockResolvedValue(undefined);

      const result = await service.findOne(clientId);

      // Verificar que o cliente foi retornado
      expect(result).toBeDefined();
      expect(result.id).toBe(clientId);
      
      // CRÍTICO: Verificar que access_count foi incrementado de 0 para 1
      expect(result.access_count).toBe(1);
      expect(result.access_count).not.toBe(7);
      expect(result.access_count).not.toBe(0);
      
      // Verificar que findOne foi chamado duas vezes (verificação + busca após incremento)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: clientId },
      });
      expect(mockRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: clientId },
      });
      
      // Verificar que increment foi chamado corretamente
      expect(mockRepository.increment).toHaveBeenCalledTimes(1);
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: clientId },
        'access_count',
        1
      );
      
      // Verificar que save NÃO foi chamado (usamos increment em vez de save)
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve incrementar access_count ao buscar um cliente', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const initialAccessCount = 5;
      
      // Criar cliente inicial com access_count: 5
      const mockClient = createMockClient({
        id: clientId,
        access_count: initialAccessCount,
      });

      // Cliente após incremento
      const updatedClient = createMockClient({
        id: clientId,
        access_count: initialAccessCount + 1, // Incrementado para 6
      });

      // Mock do primeiro findOne (verificação de existência)
      mockRepository.findOne
        .mockResolvedValueOnce(mockClient) // Primeira chamada: cliente existe
        .mockResolvedValueOnce(updatedClient); // Segunda chamada: após incremento

      // Mock do increment (operação SQL direta)
      mockRepository.increment.mockResolvedValue(undefined);

      const result = await service.findOne(clientId);

      // CRÍTICO: Verificar que o access_count foi incrementado de 5 para 6
      expect(result.access_count).toBe(6);
      expect(result.access_count).toBe(initialAccessCount + 1);
      
      // Verificar que increment foi chamado corretamente
      expect(mockRepository.increment).toHaveBeenCalledTimes(1);
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: clientId },
        'access_count',
        1
      );
      
      // Verificar que findOne foi chamado duas vezes
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      
      // Verificar que save NÃO foi chamado (usamos increment em vez de save)
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';

      // Mock retornando null (cliente não encontrado)
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(clientId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne(clientId)).rejects.toThrow(
        `Cliente com ID ${clientId} não encontrado`
      );
      
      // Verificar que increment não foi chamado (cliente não existe)
      expect(mockRepository.increment).not.toHaveBeenCalled();
      // Verificar que save não foi chamado
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove (Soft Delete)', () => {
    it('deve executar soft delete preenchendo o campo deletedAt sem apagar fisicamente', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      
      // Criar cliente antes do soft delete
      const clientBeforeDelete = createMockClient({
        id: clientId,
        deletedAt: null, // Cliente não estava deletado
      });

      // Mock: cliente existe antes do soft delete
      mockRepository.findOne = jest.fn().mockResolvedValue(clientBeforeDelete);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(clientId);

      // CRÍTICO: Verificar que softDelete foi chamado (não delete físico)
      expect(mockRepository.softDelete).toHaveBeenCalledWith(clientId);
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
      
      // CRÍTICO: Verificar que o método NÃO tentou fazer delete físico
      // (softDelete preenche o deletedAt, não remove fisicamente)
      expect(repository.delete).toBeUndefined();
      
      // Verificar que não foi usado método de delete físico
      expect(mockRepository.softDelete).toHaveBeenCalled();
      expect(mockRepository['delete']).toBeUndefined(); // Garantir que delete físico não existe
    });

    it('deve garantir que deletedAt é preenchido após soft delete', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const deletedAt = new Date('2024-01-02T10:00:00Z');

      // Simular que após softDelete, o cliente terá deletedAt preenchido
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });
      
      // Mock para simular busca após soft delete (com deletedAt preenchido)
      mockRepository.findOne = jest.fn().mockResolvedValue({
        ...createMockClient({ id: clientId }),
        deletedAt, // deletedAt foi preenchido
      });

      await service.remove(clientId);

      // Verificar que softDelete foi executado
      expect(mockRepository.softDelete).toHaveBeenCalledWith(clientId);
      
      // Verificar que o cliente ainda existe no banco (soft delete não remove fisicamente)
      // A linha não foi apagada, apenas o campo deletedAt foi preenchido
      expect(mockRepository.softDelete).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o cliente não for encontrado para deletar', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';

      mockRepository.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(clientId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.remove(clientId)).rejects.toThrow(
        `Cliente com ID ${clientId} não encontrado`
      );
    });

    it('não deve remover fisicamente o cliente do banco de dados', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';

      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(clientId);

      // Verificar que foi usado softDelete (não delete)
      expect(mockRepository.softDelete).toHaveBeenCalled();
      
      // Verificar que não foi usado delete físico
      expect(repository.delete).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de clientes ordenada por createdAt DESC', async () => {
      const mockClients: Client[] = [
        {
          id: '1',
          nome: 'Cliente 1',
          email: 'cliente1@example.com',
          telefone: '123456789',
          access_count: 0,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
          deletedAt: null,
        },
        {
          id: '2',
          nome: 'Cliente 2',
          email: 'cliente2@example.com',
          telefone: '987654321',
          access_count: 0,
          createdAt: new Date('2024-01-02T10:00:00Z'),
          updatedAt: new Date('2024-01-02T10:00:00Z'),
          deletedAt: null,
        },
      ];

      mockRepository.find.mockResolvedValue(mockClients);

      const result = await service.findAll();

      expect(result).toEqual(mockClients);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente existente', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const updateClientDto: UpdateClientDto = {
        nome: 'João Silva Atualizado',
      };

      const existingClient: Client = {
        id: clientId,
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 5,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        deletedAt: null,
      };

      const updatedClient = {
        ...existingClient,
        ...updateClientDto,
      };

      mockRepository.findOne.mockResolvedValue(existingClient);
      mockRepository.save.mockResolvedValue(updatedClient);

      const result = await service.update(clientId, updateClientDto);

      expect(result.nome).toBe(updateClientDto.nome);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const updateClientDto: UpdateClientDto = {
        nome: 'João Silva Atualizado',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(clientId, updateClientDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
