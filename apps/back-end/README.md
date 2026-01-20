# Backend - Teddy Open Finance API

API REST desenvolvida com NestJS para a plataforma Teddy Open Finance.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **Swagger** - Documentação interativa da API
- **Terminus** - Health checks
- **nestjs-pino** - Logs estruturados em JSON
- **prom-client** - Métricas Prometheus
- **class-validator** - Validação de DTOs
- **JWT** - Autenticação baseada em tokens

## 📋 Pré-requisitos

- Node.js v20+ (recomendado LTS)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Principais variáveis:
- `DB_HOST` - Host do PostgreSQL (padrão: localhost)
- `DB_PORT` - Porta do PostgreSQL (padrão: 5432)
- `DB_USERNAME` - Usuário do banco (padrão: teddy)
- `DB_PASSWORD` - Senha do banco (padrão: teddy)
- `DB_DATABASE` - Nome do banco (padrão: teddy_db)
- `JWT_SECRET` - Chave secreta para JWT (⚠️ **OBRIGATÓRIO em produção**)
- `JWT_EXPIRES_IN` - Tempo de expiração do token (padrão: 1d)
- `PORT` - Porta da aplicação (padrão: 3000)
- `LOG_LEVEL` - Nível de log (padrão: info)
- `FRONTEND_URL` - URL do frontend para CORS (padrão: http://localhost:5173)
  - O backend aceita automaticamente: `http://localhost:5173` (dev), `http://localhost` (Docker) e qualquer `localhost` em desenvolvimento

### 2. Iniciar com Docker Compose

O `docker-compose.yml` inclui o PostgreSQL e a aplicação backend:

```bash
# Build e iniciar os serviços
docker-compose build --no-cache backend
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f backend
```

Isso iniciará:
- **PostgreSQL** na porta 5432
- **Backend API** na porta 3000

**Acessos após iniciar:**
- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/healthz
- **Métricas:** http://localhost:3000/metrics

**Parar os serviços:**
```bash
docker-compose down
```

### 3. Iniciar sem Docker (Desenvolvimento - Recomendado)

#### 3.1. Iniciar apenas o banco de dados:

```bash
# No diretório apps/back-end
docker-compose up -d postgres

# Verificar se está rodando
docker-compose ps
```

#### 3.2. Instalar dependências (na raiz do monorepo):

```bash
# Na raiz do projeto (teddy-open-finance/)
npm install
```

#### 3.3. Executar a aplicação:

```bash
# Na raiz do projeto
npx nx serve back-end
```

A aplicação estará disponível em:
- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/healthz
- **Métricas:** http://localhost:3000/metrics

**Nota:** Esta é a forma recomendada para desenvolvimento, pois permite hot-reload e debugging mais fácil.

## 📚 Principais Endpoints

### Autenticação

- `POST /api/auth/login` - Autenticar usuário e obter JWT
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "access_token": "string", "token_type": "Bearer" }`

### Clientes

- `GET /api/clients` - Listar todos os clientes (requer autenticação)
- `GET /api/clients/:id` - Obter cliente por ID (incrementa access_count)
- `POST /api/clients` - Criar novo cliente (requer autenticação)
  - Body: `{ "nome": "string", "email": "string", "telefone": "string" }`
- `PUT /api/clients/:id` - Atualizar cliente (requer autenticação)
- `DELETE /api/clients/:id` - Excluir cliente (soft delete, requer autenticação)

### Health & Observabilidade

- `GET /healthz` - Health check (público)
  - Verifica: banco de dados, memória heap (150MB), memória RSS (300MB)
  - Retorna `200` quando saudável, `503` quando há problemas
- `GET /metrics` - Métricas Prometheus (público)
- `GET /docs` - Documentação Swagger (público)

## 🧪 Testes

Execute os testes unitários:

```bash
# A partir da raiz do projeto
npx nx test back-end
```

O projeto possui **32 testes unitários** cobrindo:
- Criação de clientes
- Validação de DTOs
- Soft delete
- Incremento de access_count
- Validação de email
- Tratamento de erros

## 🏗️ Build de Produção

```bash
# A partir da raiz do projeto
npx nx build back-end
```

O build será gerado em `apps/back-end/dist/`.

## 🐳 Docker

### Build e Execução com Docker Compose

**Opção 1: Build e start juntos (recomendado)**
```bash
# No diretório apps/back-end
docker-compose build --no-cache backend
docker-compose up -d
```

**Opção 2: Build manual da imagem**
```bash
# Na raiz do projeto
docker build -f apps/back-end/Dockerfile -t teddy-backend:latest .
```

**Opção 3: Executar container manualmente**
```bash
# Certifique-se de que o PostgreSQL está rodando primeiro
docker-compose up -d postgres

# Execute o backend
docker run -p 3000:3000 \
  --env-file apps/back-end/.env \
  --network back-end_teddy-network \
  -e DB_HOST=postgres \
  teddy-backend:latest
```

### Verificar Status

```bash
# Ver status dos containers
docker-compose ps

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do PostgreSQL
docker-compose logs -f postgres
```

### Parar e Limpar

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpa dados do banco)
docker-compose down -v
```

## 📊 Observabilidade

### Logs Estruturados (JSON)

Todos os logs são gerados em formato JSON estruturado:
- **Desenvolvimento:** Formatados com `pino-pretty` para legibilidade
- **Produção:** JSON puro para integração com sistemas de log aggregation

Cada requisição possui um ID único para rastreamento.

### Health Check

O endpoint `/healthz` verifica:
- Conectividade com PostgreSQL
- Uso de memória heap (threshold: 150MB)
- Uso de memória RSS (threshold: 300MB)

### Métricas Prometheus

O endpoint `/metrics` expõe métricas no formato Prometheus:
- Métricas padrão do Node.js (CPU, memória, event loop)
- Métricas HTTP (quando configurado)

## 🔒 Segurança

- Todos os endpoints (exceto `/healthz`, `/metrics`, `/docs` e `/api/auth/login`) requerem autenticação JWT
- Validação de DTOs com `class-validator`
- CORS configurável via `FRONTEND_URL` (aceita múltiplas origens automaticamente)
- Soft delete para preservar dados históricos

## 📝 Scripts Disponíveis

- `npx nx serve back-end` - Iniciar em modo desenvolvimento
- `npx nx build back-end` - Build de produção
- `npx nx test back-end` - Executar testes unitários
- `nx lint back-end` - Executar linter

## 🐛 Troubleshooting

### Backend não inicia no Docker

**Problema:** Container reinicia constantemente

**Solução:**
1. Verifique os logs: `docker-compose logs backend`
2. Se houver erro de "require is not defined", o build pode estar com problema
3. Rebuild completo: `docker-compose build --no-cache backend`
4. Se persistir, use desenvolvimento local (mais confiável)

### Erro de conexão com banco de dados

1. Verifique se o PostgreSQL está rodando: `docker-compose ps`
2. Verifique se o PostgreSQL está saudável: `docker-compose logs postgres`
3. Verifique as variáveis de ambiente no `.env`
4. Certifique-se de que `DB_HOST=postgres` no Docker (não `localhost`)

### Erro de porta já em uso

Altere a porta no `.env`:
```env
PORT=3001
```

Depois atualize o docker-compose.yml ou use:
```bash
PORT=3001 docker-compose up -d
```

### Backend não acessa o Swagger/Metrics

1. Verifique se o backend está rodando: `docker-compose ps`
2. Verifique os logs: `docker-compose logs backend`
3. Teste o health check: `curl http://localhost:3000/healthz`
4. Se o health check funcionar, o problema pode ser no navegador (cache, CORS)

### Logs não aparecem

Verifique o nível de log no `.env`:
```env
LOG_LEVEL=debug
```

### Problemas com Build do Docker

Se o build falhar:
1. Limpe o cache: `docker-compose build --no-cache backend`
2. Verifique se o `.dockerignore` está correto
3. Verifique se o `nx.json` está válido (sem BOM)
4. Use desenvolvimento local como alternativa: `npx nx serve back-end`

### Desenvolvimento Local vs Docker

**Recomendado para desenvolvimento:**
- Use `npx nx serve back-end` (desenvolvimento local)
- Mais rápido para iterar
- Hot-reload automático
- Debugging mais fácil

**Use Docker quando:**
- Testar ambiente de produção
- CI/CD
- Deploy em servidor
