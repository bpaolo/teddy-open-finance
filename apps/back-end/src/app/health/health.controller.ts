import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Health')
@Controller('healthz')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ 
    summary: 'Verifica a saúde da aplicação, banco de dados e uso de memória' 
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está saudável',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          example: '2024-01-01T12:00:00.000Z',
        },
        uptime: {
          type: 'number',
          example: 3600.5,
        },
        info: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            memory_heap: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
        details: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            memory_heap: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicação, banco de dados ou memória não estão saudáveis',
  })
  async check() {
    // Limite de memória heap: 150MB (threshold)
    // Limite de memória RSS: 300MB (threshold)
    const healthResult = await this.health.check([
      // Verificar saúde do banco de dados
      () => this.db.pingCheck('database'),
      // Verificar uso de memória heap (limite de 150MB)
      () =>
        this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Verificar uso de memória RSS (limite de 300MB)
      () =>
        this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);

    // Adicionar informações básicas de status
    return {
      ...healthResult,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
