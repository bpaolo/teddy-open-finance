import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Normalizar email para lowercase
    const normalizedEmail = createClientDto.email.toLowerCase();

    // Verificar se o email já existe
    const existingClient = await this.clientsRepository.findOne({
      where: { email: normalizedEmail },
      withDeleted: true,
    });

    if (existingClient) {
      throw new ConflictException('Email já está em uso');
    }

    const client = this.clientsRepository.create({
      ...createClientDto,
      email: normalizedEmail,
      access_count: 0,
    });
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Incrementar access_count
    client.access_count += 1;
    await this.clientsRepository.save(client);

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Se está atualizando o email, normalizar para lowercase e verificar se já existe
    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const normalizedEmail = updateClientDto.email.toLowerCase();
      const existingClient = await this.clientsRepository.findOne({
        where: { email: normalizedEmail },
        withDeleted: true,
      });

      if (existingClient) {
        throw new ConflictException('Email já está em uso');
      }

      // Atualizar com email normalizado
      updateClientDto.email = normalizedEmail;
    }

    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}
