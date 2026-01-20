# Serviços de API

## api.ts

Configuração centralizada do Axios para comunicação com o backend.

### Características:

- **Base URL**: `http://localhost:3000/api`
- **Interceptor de Request**: Adiciona automaticamente o token JWT do localStorage no header `Authorization`
- **Interceptor de Response**: Trata erros 401 (Unauthorized) removendo token inválido

### Uso:

```typescript
import api from './services/api';

// GET request
const response = await api.get('/clients');

// POST request
const response = await api.post('/clients', {
  nome: 'João Silva',
  email: 'joao@example.com',
  telefone: '+55 11 98765-4321'
});

// PUT request
const response = await api.put('/clients/:id', {
  nome: 'João Santos'
});

// DELETE request
const response = await api.delete('/clients/:id');
```

O token JWT será adicionado automaticamente em todas as requisições se estiver presente no localStorage.
