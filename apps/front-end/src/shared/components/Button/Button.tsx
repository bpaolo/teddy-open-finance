import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Componente Button (Atomic Design - Atom)
 * Princípio Open/Closed: Aceita variantes via props sem modificar código interno
 * Responsabilidade única: Renderizar botão estilizado
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClass = 'shared-btn';
  const variantClass = `shared-btn-${variant}`;
  const sizeClass = `shared-btn-${size}`;
  const widthClass = fullWidth ? 'shared-btn-full-width' : '';
  const disabledClass = disabled ? 'shared-btn-disabled' : '';

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {icon && <span className="shared-btn-icon">{icon}</span>}
      {children}
    </button>
  );
};
