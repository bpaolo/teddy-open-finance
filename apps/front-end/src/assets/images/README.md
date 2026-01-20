# Assets - Imagens

Este diretório é o local recomendado para guardar imagens que serão usadas nos componentes React.

## Estrutura Recomendada

```
src/assets/
├── images/
│   ├── logo.svg          # Logo da aplicação (formato vetorial recomendado)
│   ├── logo.png          # Logo alternativo (raster)
│   ├── logo-white.svg    # Versão branca do logo (para dark mode)
│   └── icons/            # Ícones específicos
└── fonts/                # Fontes customizadas (se necessário)
```

## Como Usar

### Importação no Componente:

```tsx
import logo from '../../assets/images/logo.svg';

function Header() {
  return <img src={logo} alt="Logo Teddy" />;
}
```

### Com CSS Modules:

```tsx
import logo from '../../assets/images/logo.svg';
import styles from './Header.module.css';

function Header() {
  return <img src={logo} alt="Logo Teddy" className={styles.logo} />;
}
```

## Vantagens

- ✅ Processamento automático pelo Vite (otimização, hash no nome)
- ✅ Validação em build (erro se arquivo não existir)
- ✅ Tree-shaking (inclui apenas o que é usado)
- ✅ TypeScript friendly
