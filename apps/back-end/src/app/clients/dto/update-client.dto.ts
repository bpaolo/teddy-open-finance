import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    description: 'Nome completo do cliente',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  nome?: string;

  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone do cliente',
    example: '+55 11 99999-8888',
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  telefone?: string;
}
