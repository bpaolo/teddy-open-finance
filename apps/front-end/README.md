# Frontend - Teddy Open Finance

Aplicação React desenvolvida com Vite para a plataforma Teddy Open Finance.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **TypeScript** - Superset JavaScript com tipagem estática
- **React Router** - Roteamento client-side
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js v20+ (recomendado LTS)
- npm ou yarn
- Backend API rodando (ver `apps/back-end/README.md`)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Principais variáveis:
- `API_URL` - URL da API backend (padrão: http://localhost:3000/api)
- `FRONTEND_PORT` - Porta para Docker (padrão: 80)

### 2. Instalar Dependências

Na raiz do monorepo:

```bash
npm install
```

### 3. Executar em Desenvolvimento (Recomendado)

**Pré-requisito:** Certifique-se de que o backend está rodando primeiro.

#### Passo 1: Iniciar o Backend

```bash
# Terminal 1 - Banco de dados
cd apps/back-end
docker-compose up -d postgres
cd ../..

# Terminal 2 - Backend API
npx nx serve back-end
```

#### Passo 2: Iniciar o Frontend

```bash
# Terminal 3 - Frontend (na raiz do projeto)
npx nx serve front-end
```

A aplicação estará disponível em: **http://localhost:5173**

**Vantagens do desenvolvimento local:**
- ✅ Hot-reload automático
- ✅ Debugging mais fácil
- ✅ Build mais rápido
- ✅ Melhor para desenvolvimento

### 4. Executar com Docker

O `docker-compose.yml` inclui a aplicação servida via Nginx:

```bash
# No diretório apps/front-end
docker-compose build --no-cache frontend
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f frontend
```

Isso iniciará o frontend na porta 80 (ou a porta configurada em `FRONTEND_PORT`).

**Acessos:**
- **Frontend:** http://localhost:80 (ou porta configurada)
- **Backend API:** Deve estar acessível em http://localhost:3000/api

**Parar o serviço:**
```bash
docker-compose down
```

## 📁 Estrutura do Projeto

```
apps/front-end/
├── src/
│   ├── app/              # Componente principal e rotas
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Clients/      # Componentes relacionados a clientes
│   │   ├── Dashboard/    # Componentes do dashboard
│   │   ├── Layout/       # Componentes de layout
│   │   └── ui/           # Componentes UI básicos
│   ├── contexts/         # Context API (Auth, Sidebar)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   │   ├── Login/        # Página de login
│   │   └── Dashboard/    # Página principal
│   ├── services/         # Serviços de API
│   ├── shared/           # Componentes e utilitários compartilhados
│   └── types/            # Definições TypeScript
├── public/               # Arquivos estáticos
└── dist/                 # Build de produção
```

## 🎯 Principais Funcionalidades

### Autenticação

- Login com email e senha
- Armazenamento de token JWT no localStorage
- Proteção de rotas com `ProtectedRoute`
- Interceptor Axios para adicionar token automaticamente

### Dashboard

- Visualização de clientes em tabela
- Estatísticas de clientes (total, acessos)
- Gráficos de análise (Recharts)
- Cards de resumo

### Gestão de Clientes

- Listagem de clientes
- Visualização de detalhes (incrementa access_count)
- Criação de novos clientes
- Edição de clientes existentes
- Exclusão de clientes (soft delete)

## 🧪 Testes

Execute os testes unitários:

```bash
# A partir da raiz do projeto
npx nx test front-end
```

O projeto possui testes cobrindo:
- Componentes (Login, ClientCard)
- Hooks customizados (useClients)
- Validação de formulários
- Renderização de componentes

## 🏗️ Build de Produção

```bash
# A partir da raiz do projeto
npx nx build front-end
```

O build será gerado em `apps/front-end/dist/`.

### Servir Build Localmente

```bash
# Após o build
cd apps/front-end
npx serve dist
```

## 🐳 Docker

### Build da imagem:

```bash
docker build -f apps/front-end/Dockerfile -t teddy-frontend:latest ../..
```

### Executar container:

```bash
docker run -p 80:80 teddy-frontend:latest
```

O Nginx servirá os arquivos estáticos do build.

## 📝 Scripts Disponíveis

- `npx nx serve front-end` - Iniciar em modo desenvolvimento
- `npx nx build front-end` - Build de produção
- `npx nx test front-end` - Executar testes unitários
- `nx lint front-end` - Executar linter

## 🔧 Configuração do Nginx

O arquivo `nginx.conf` está configurado para:
- Servir arquivos estáticos
- Roteamento SPA (todas as rotas servem `index.html`)
- Compressão Gzip
- Cache de assets estáticos
- Headers de segurança

## 🔌 Integração com API

A aplicação se conecta ao backend através de:
- **Base URL:** Configurável via `API_URL` (padrão: http://localhost:3000/api)
- **Autenticação:** Token JWT enviado no header `Authorization: Bearer <token>`
- **Interceptors:** Axios interceptors para adicionar token e tratar erros 401

### Exemplo de uso:

```typescript
import api from './services/api';

// GET request (token adicionado automaticamente)
const clients = await api.get('/clients');

// POST request
const newClient = await api.post('/clients', {
  nome: 'João Silva',
  email: 'joao@example.com',
  telefone: '+55 11 98765-4321'
});
```

## 🐛 Troubleshooting

### Erro de conexão com API

**Sintomas:** Frontend não consegue conectar ao backend

**Soluções:**
1. Verifique se o backend está rodando:
   ```bash
   curl http://localhost:3000/healthz
   # Deve retornar: {"status":"ok",...}
   ```

2. Verifique a variável `API_URL` no `.env`:
   ```env
   API_URL=http://localhost:3000/api
   ```

3. Verifique o CORS no backend:
   - No backend `.env`, certifique-se de que `FRONTEND_URL=http://localhost:5173`
   - Reinicie o backend após alterar

4. Se estiver usando Docker:
   - Certifique-se de que ambos estão na mesma rede Docker
   - Use `http://backend:3000/api` se estiverem no mesmo docker-compose
   - Ou use `http://host.docker.internal:3000/api` para acessar host do Docker

### Erro de porta já em uso

**Desenvolvimento local:**
Altere a porta no `vite.config.mts`:
```typescript
server: {
  port: 5174,
}
```

**Docker:**
Altere a porta no `.env`:
```env
FRONTEND_PORT=8080
```

### Frontend não carrega no navegador

1. Verifique se o processo está rodando: `npx nx serve front-end`
2. Verifique os logs no terminal
3. Limpe o cache do navegador (Ctrl+Shift+R)
4. Verifique se a porta está correta: http://localhost:5173

### Build falha

1. Limpe o cache:
   ```bash
   # Windows
   rmdir /s node_modules\.vite
   
   # Linux/Mac
   rm -rf node_modules/.vite
   ```

2. Reinstale dependências:
   ```bash
   npm install
   ```

3. Tente novamente:
   ```bash
   npx nx build front-end
   ```

### Problemas com Docker Build

Se o build do Docker falhar:
1. Verifique os logs: `docker-compose logs frontend`
2. Rebuild completo: `docker-compose build --no-cache frontend`
3. Use desenvolvimento local como alternativa (mais rápido)

### Autenticação não funciona

1. Verifique se o token está sendo salvo no localStorage
2. Verifique se o backend está retornando o token corretamente
3. Verifique os headers da requisição no DevTools (Network tab)
4. Certifique-se de que o `API_URL` está correto

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)
