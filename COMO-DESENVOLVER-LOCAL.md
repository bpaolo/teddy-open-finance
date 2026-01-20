# 💻 Como Desenvolver Localmente

Guia rápido para desenvolver com backend e frontend rodando localmente, usando apenas o banco de dados no Docker.

## 🎯 Setup para Desenvolvimento Local

### Passo 1: Parar Aplicações no Docker

```bash
# No diretório apps/back-end
cd apps/back-end

# Parar apenas o backend (mantém o PostgreSQL rodando)
docker-compose stop backend

# Ou parar e remover o container do backend
docker-compose rm -f backend
```

**Verificar:** Apenas o PostgreSQL deve estar rodando:
```bash
docker-compose ps
# Deve mostrar apenas: teddy-postgres (Up)
```

### Passo 2: Verificar Banco de Dados

```bash
# Verificar se o PostgreSQL está saudável
docker-compose ps postgres
# Deve mostrar: (healthy)
```

### Passo 3: Iniciar Backend Localmente

**Terminal 1 - Backend:**
```bash
# Na raiz do projeto (teddy-open-finance/)
npx nx serve back-end
```

O backend estará disponível em:
- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/healthz
- **Métricas:** http://localhost:3000/metrics

### Passo 4: Iniciar Frontend Localmente

**Terminal 2 - Frontend:**
```bash
# Na raiz do projeto (teddy-open-finance/)
npx nx serve front-end
```

O frontend estará disponível em:
- **Frontend:** http://localhost:5173

## ✅ Verificação Final

### Status dos Serviços

```bash
# Verificar containers Docker (apenas PostgreSQL)
cd apps/back-end
docker-compose ps

# Verificar processos Node (backend e frontend)
# No Windows PowerShell:
Get-Process node | Select-Object Id, ProcessName, StartTime
```

### Testar Conexões

```bash
# Health Check do Backend
curl http://localhost:3000/healthz

# Frontend (abrir no navegador)
# http://localhost:5173
```

## 🔄 Comandos Úteis

### Parar Tudo

```bash
# Parar backend e frontend (Ctrl+C nos terminais)

# Parar PostgreSQL (se necessário)
cd apps/back-end
docker-compose down
```

### Reiniciar Apenas o Banco

```bash
cd apps/back-end
docker-compose restart postgres
```

### Ver Logs do Banco

```bash
cd apps/back-end
docker-compose logs -f postgres
```

## 🎯 Vantagens do Desenvolvimento Local

- ✅ **Hot-reload automático** - Mudanças refletem imediatamente
- ✅ **Debugging mais fácil** - Breakpoints no código
- ✅ **Build mais rápido** - Sem rebuild do Docker
- ✅ **Logs mais legíveis** - Formatação com pino-pretty
- ✅ **Menor uso de recursos** - Apenas o banco no Docker

## 🐛 Troubleshooting

### Backend não conecta ao banco

1. Verifique se o PostgreSQL está rodando:
   ```bash
   docker-compose ps postgres
   ```

2. Verifique as variáveis no `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. Teste a conexão:
   ```bash
   docker-compose exec postgres psql -U teddy -d teddy_db -c "SELECT 1;"
   ```

### Porta 3000 já em uso

Se o backend Docker ainda estiver rodando:
```bash
cd apps/back-end
docker-compose stop backend
docker-compose rm -f backend
```

### Porta 5173 já em uso

Altere no `vite.config.mts` ou pare o processo que está usando a porta.

## 📝 Resumo dos Comandos

```bash
# 1. Parar backend Docker
cd apps/back-end
docker-compose stop backend

# 2. Terminal 1 - Backend
npx nx serve back-end

# 3. Terminal 2 - Frontend  
npx nx serve front-end

# 4. Acessar
# Backend: http://localhost:3000/api
# Frontend: http://localhost:5173
```
