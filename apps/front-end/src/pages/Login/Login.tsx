import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../../shared/components';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    // Limpar qualquer estado residual ao entrar na página de login
    // Garantir que não há dados sensíveis em cache
    const token = localStorage.getItem('token');
    if (!token) {
      // Se não há token, garantir que localStorage está limpo
      localStorage.removeItem('user');
      sessionStorage.clear();
    }

    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      // Erro já tratado pelo AuthContext
    }
  };

  if (authLoading) {
    return (
      <div className="login-container">
        <div className="login-loading">Carregando...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-welcome">Olá, seja bem-vindo!</h1>
        <h2 className="login-subtitle">Acesse sua conta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <Input
            {...register('email', {
              required: 'Por favor, digite o seu email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            type="email"
            placeholder="Digite o seu email"
            disabled={isSubmitting}
            error={errors.email?.message}
            className="input-login"
          />

          <Input
            {...register('password', {
              required: 'Por favor, digite a sua senha',
              minLength: {
                value: 6,
                message: 'A senha deve ter pelo menos 6 caracteres',
              },
            })}
            type="password"
            placeholder="Digite a sua senha"
            disabled={isSubmitting}
            error={errors.password?.message}
            className="input-login"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="btn-login"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};
