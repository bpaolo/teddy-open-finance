# Shared Components - Atomic Design

Esta pasta contém componentes reutilizáveis seguindo os princípios **SOLID** e **Atomic Design**.

## Estrutura

```
shared/
├── components/
│   ├── Button/          # Atom - Botão reutilizável
│   ├── Input/           # Atom - Input reutilizável
│   ├── ClientCard/      # Molecule - Card de cliente
│   ├── Sidebar/         # Organism - Navegação lateral
│   ├── Header/          # Organism - Cabeçalho
│   └── index.ts         # Barrel export
```

## Princípios SOLID Aplicados

### S (Single Responsibility)
- Cada componente tem **uma única responsabilidade**
- `Button`: Renderizar botão estilizado
- `Input`: Renderizar input com validação
- `ClientCard`: Exibir card de cliente com ações

### O (Open/Closed)
- Componentes aceitam **variantes via props** sem modificar código interno
- `Button`: Variantes `primary`, `outline`, `ghost`
- `Input`: Suporta label, error, helperText via props

### D (Dependency Inversion)
- Componentes dependem de **abstrações** (props), não de implementações
- Lógica de negócio isolada em **custom hooks** (`useClients`, `useSelectedClient`)
- Componentes apenas renderizam, não conhecem APIs ou serviços

## Como Usar

```tsx
// Importar componentes
import { Button, Input, ClientCard, Sidebar, Header } from '../../shared/components';

// Usar componentes
<Button variant="primary" size="md" onClick={handleClick}>
  Clique aqui
</Button>

<Input
  label="Email"
  placeholder="Digite seu email"
  error={errors.email}
/>
```

## Custom Hooks (Lógica de Dados)

### `useClients`
Gerencia lista de clientes, loading, error, CRUD operations.

```tsx
const {
  clients,
  loading,
  error,
  totalClients,
  totalViews,
  refreshClients,
  deleteClient,
  updateClient,
} = useClients();
```

### `useSelectedClient`
Gerencia cliente selecionado e visualização (incrementa access_count).

```tsx
const {
  selectedClient,
  loading,
  error,
  selectClient,
  clearSelection,
  viewClient,
} = useSelectedClient();
```

## Design Tokens

Todos os componentes usam **CSS Variables** definidas em `src/styles/design-tokens.css`:

- Cores: `--color-primary` (#EC6724), `--color-background` (#F5F5F5)
- Espaçamento: `--spacing-xs` até `--spacing-2xl`
- Bordas: `--radius-sm` (4px)
- Tipografia: `--font-size-*`, `--font-weight-*`
