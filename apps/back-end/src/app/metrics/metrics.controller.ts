import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { register, collectDefaultMetrics } from 'prom-client';

// Coleta métricas padrão do Node.js
collectDefaultMetrics({ register });

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor() {
    // As métricas já foram inicializadas acima
  }

  @Public()
  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Exportar métricas no formato Prometheus' })
  @ApiResponse({
    status: 200,
    description: 'Métricas no formato Prometheus',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
