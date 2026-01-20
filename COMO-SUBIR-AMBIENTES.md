# 🚀 Como Subir os Ambientes

Guia rápido para iniciar o backend e frontend do projeto Teddy Open Finance.

## 📋 Pré-requisitos

- Node.js v20+ instalado
- Docker e Docker Compose instalados
- npm ou yarn instalado

## 🐳 Opção 1: Docker Compose (Recomendado)

### Backend (PostgreSQL + API)

```bash
# 1. Navegar para o diretório do backend
cd apps/back-end

# 2. Subir os serviços (PostgreSQL + Backend)
docker-compose up -d

# 3. Verificar se está rodando
docker-compose ps

# 4. Ver logs (opcional)
docker-compose logs -f
```

**Acessos:**
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/docs
- Health Check: http://localhost:3000/healthz
- Métricas: http://localhost:3000/metrics

### Frontend (Nginx)

```bash
# 1. Navegar para o diretório do frontend
cd apps/front-end

# 2. Subir o serviço
docker-compose up -d

# 3. Verificar se está rodando
docker-compose ps
```

**Acesso:**
- Frontend: http://localhost:80 (ou porta configurada no .env)

### Parar os serviços

```bash
# Backend
cd apps/back-end
docker-compose down

# Frontend
cd apps/front-end
docker-compose down
```

---

## 💻 Opção 2: Desenvolvimento Local (Sem Docker)

### Passo 1: Instalar Dependências

```bash
# Na raiz do projeto
npm install
```

### Passo 2: Subir o Banco de Dados (Docker)

```bash
# Apenas o PostgreSQL via Docker
cd apps/back-end
docker-compose up -d postgres

# Verificar se está rodando
docker-compose ps
```

### Passo 3: Subir o Backend

```bash
# Na raiz do projeto
npx nx serve back-end
```

O backend estará disponível em: http://localhost:3000/api

### Passo 4: Subir o Frontend

Em outro terminal:

```bash
# Na raiz do projeto
npx nx serve front-end
```

O frontend estará disponível em: http://localhost:5173

---

## 🎯 Opção 3: Usando Nx Run-Many (Tudo Junto)

### Subir Backend e Frontend em Paralelo

```bash
# 1. Subir apenas o banco de dados
cd apps/back-end
docker-compose up -d postgres
cd ../..

# 2. Subir backend e frontend juntos
npx nx run-many --target=serve --projects=back-end,front-end --parallel=2
```

Isso iniciará ambos os serviços simultaneamente.

---

## ✅ Verificar se Está Funcionando

### Backend

```bash
# Health Check
curl http://localhost:3000/healthz

# Deve retornar:
# {"status":"ok","info":{...},"timestamp":"...","uptime":...}
```

### Frontend

Abra no navegador: http://localhost:5173 (dev) ou http://localhost:80 (Docker)

---

## 🔧 Troubleshooting

### Erro: Porta já em uso

**Backend:**
```bash
# Altere a porta no apps/back-end/.env
PORT=3001
```

**Frontend:**
```bash
# Altere a porta no apps/front-end/.env
FRONTEND_PORT=8080
```

### Erro: Banco de dados não conecta

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar o banco
docker-compose restart postgres
```

### Erro: Dependências não instaladas

```bash
# Na raiz do projeto
npm install
```

### Limpar tudo e recomeçar

```bash
# Parar todos os containers
cd apps/back-end
docker-compose down -v  # Remove volumes também

cd ../front-end
docker-compose down

# Reinstalar dependências
cd ../..
npm install
```

---

## 📝 Resumo Rápido

### Docker (Mais Simples)

```bash
# Terminal 1 - Backend
cd apps/back-end
docker-compose up -d

# Terminal 2 - Frontend
cd apps/front-end
docker-compose up -d
```

### Desenvolvimento Local

```bash
# Terminal 1 - Banco
cd apps/back-end
docker-compose up -d postgres
cd ../..

# Terminal 2 - Backend
npx nx serve back-end

# Terminal 3 - Frontend
npx nx serve front-end
```

### Tudo Junto (Nx)

```bash
# Terminal 1 - Banco
cd apps/back-end
docker-compose up -d postgres
cd ../..

# Terminal 2 - Backend + Frontend
npx nx run-many --target=serve --projects=back-end,front-end --parallel=2
```

---

## 🌐 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend (Dev) | http://localhost:5173 | Aplicação React |
| Frontend (Docker) | http://localhost:80 | Aplicação React via Nginx |
| Backend API | http://localhost:3000/api | API REST |
| Swagger | http://localhost:3000/docs | Documentação da API |
| Health Check | http://localhost:3000/healthz | Status da aplicação |
| Métricas | http://localhost:3000/metrics | Métricas Prometheus |
