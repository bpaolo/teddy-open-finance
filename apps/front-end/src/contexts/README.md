# AuthContext

Contexto React para gerenciamento de autenticação.

## Funcionalidades

- **Estado de autenticação**: Gerencia user, token e isAuthenticated
- **Login**: Função para autenticar usuário e salvar token
- **Logout**: Função para limpar autenticação
- **Persistência**: Salva token e user no localStorage
- **Loading state**: Indica quando está carregando dados do localStorage

## Uso

### 1. O AuthProvider já está configurado no App.tsx

### 2. Usar o hook useAuth em qualquer componente:

```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin@teddy.com.br', 'admin123');
      console.log('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <div>Bem-vindo, {user?.email}!</div>;
  }

  return (
    <button onClick={handleLogin}>Fazer Login</button>
  );
}
```

### 3. Exemplo de componente protegido:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedComponent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Conteúdo protegido</div>;
}
```

### 4. Logout:

```typescript
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Sair</button>
  );
}
```

## Propriedades disponíveis

- `user`: User | null - Dados do usuário autenticado
- `token`: string | null - Token JWT
- `isAuthenticated`: boolean - Indica se está autenticado
- `login(email, password)`: Promise<void> - Função para fazer login
- `logout()`: void - Função para fazer logout
- `loading`: boolean - Indica se está carregando dados do localStorage
