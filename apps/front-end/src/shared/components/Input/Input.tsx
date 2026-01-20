import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

/**
 * Componente Input (Atomic Design - Atom)
 * Princípio Open/Closed: Aceita props sem modificar código interno
 * Responsabilidade única: Renderizar input com label e validação
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="shared-input-wrapper">
        {label && (
          <label htmlFor={inputId} className="shared-input-label">
            {label}
          </label>
        )}
        <div className="shared-input-container">
          {icon && <span className="shared-input-icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`shared-input ${hasError ? 'shared-input-error' : ''} ${className}`}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <span id={`${inputId}-error`} className="shared-input-error-message" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className="shared-input-helper-text">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
