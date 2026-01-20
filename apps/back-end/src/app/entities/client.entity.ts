import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('clients')
export class Client {
  @ApiProperty({ description: 'ID único do cliente' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome completo do cliente', example: 'João Silva' })
  @Column()
  nome: string;

  @ApiProperty({ description: 'Email do cliente', example: 'joao@example.com' })
  @Column({ unique: true })
  @Index()
  email: string;

  @ApiProperty({ description: 'Telefone do cliente', example: '+55 11 98765-4321' })
  @Column()
  telefone: string;

  @ApiProperty({ description: 'Contador de acessos ao cliente', example: 0, default: 0 })
  @Column({ type: 'int', default: 0 })
  access_count: number;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Data de exclusão lógica (soft delete)', nullable: true })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
