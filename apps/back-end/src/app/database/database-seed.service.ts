import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Iniciando Database Seed...');
    await this.seedAdminUser();
    await this.seedClients();
    this.logger.log('✅ Database Seed executado com sucesso!');
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@teddy.com.br';
    const adminPassword = 'admin123';

    try {
      const existingAdmin = await this.usersRepository.findOne({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = this.usersRepository.create({
          email: adminEmail,
          password: hashedPassword,
        });

        await this.usersRepository.save(adminUser);
        this.logger.log(`👤 Usuário Admin criado: ${adminEmail}`);
      } else {
        this.logger.log(`👤 Usuário Admin já existe: ${adminEmail}`);
      }
    } catch (error) {
      this.logger.error(`❌ Erro ao criar usuário Admin: ${error.message}`);
    }
  }

  private async seedClients() {
    const clientsToCreate = [
      {
        nome: 'Maria Silva',
        email: 'maria.silva@example.com',
        telefone: '+55 11 98765-4321',
        access_count: 0,
      },
      {
        nome: 'João Santos',
        email: 'joao.santos@example.com',
        telefone: '+55 11 97654-3210',
        access_count: 0,
      },
      {
        nome: 'Ana Costa',
        email: 'ana.costa@example.com',
        telefone: '+55 11 96543-2109',
        access_count: 0,
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const clientData of clientsToCreate) {
      try {
        const existingClient = await this.clientsRepository.findOne({
          where: { email: clientData.email },
          withDeleted: true,
        });

        if (!existingClient) {
          const client = this.clientsRepository.create(clientData);
          await this.clientsRepository.save(client);
          createdCount++;
          this.logger.log(`📋 Cliente criado: ${clientData.nome} (${clientData.email})`);
        } else {
          skippedCount++;
          this.logger.log(`⏭️  Cliente já existe: ${clientData.email}`);
        }
      } catch (error) {
        this.logger.error(
          `❌ Erro ao criar cliente ${clientData.email}: ${error.message}`
        );
      }
    }

    this.logger.log(
      `📊 Resumo: ${createdCount} cliente(s) criado(s), ${skippedCount} já existente(s)`
    );
  }
}
