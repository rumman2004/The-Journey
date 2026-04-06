import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  ...props
}) => {
  // Use our new twilight glass card pattern
  const baseClasses = 'glass-card text-[var(--color-twilight-text)] relative overflow-hidden';

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-lg',
    large: 'shadow-2xl'
  };

  const roundedClasses = {
    none: '',
    small: 'rounded-lg',
    medium: 'rounded-[1.25rem]',
    large: 'rounded-3xl',
    full: 'rounded-full'
  };

  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 relative z-10 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold tracking-tight text-[var(--color-twilight-lavender)] ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`relative z-10 text-[var(--color-twilight-text-muted)] leading-relaxed ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-[var(--color-twilight-border)] relative z-10 ${className}`} {...props}>
    {children}
  </div>
);

export { CardHeader, CardTitle, CardContent, CardFooter };
export default Card;