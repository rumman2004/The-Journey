import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--color-twilight-lavender)] to-[var(--color-twilight-indigo)] text-white hover:scale-[1.02] shadow-[0_4px_15px_rgba(161,150,206,0.2)] hover:shadow-[0_6px_20px_rgba(161,150,206,0.4)] border-none',
    secondary: 'bg-[rgba(255,255,255,0.05)] backdrop-blur-xl text-[var(--color-twilight-lavender)] border border-[var(--color-twilight-border)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[var(--color-twilight-lavender)]',
    outline: 'border border-[var(--color-twilight-lavender)] bg-transparent hover:bg-[rgba(205,186,226,0.1)] text-[var(--color-twilight-lavender)]',
    danger: 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 text-red-200',
    glass: 'bg-white/10 border border-white/20 text-white backdrop-blur-xl shadow-lg shadow-white/5 hover:bg-white/20'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;