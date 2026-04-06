import React from 'react';

const TextArea = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  labelClassName = '',
  rows = 4,
  ...props
}) => {
  const textareaClasses = `w-full px-4 py-3 bg-[rgba(23,21,45,0.7)] text-white border rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 disabled:bg-[rgba(255,255,255,0.05)] disabled:text-twilight-text-muted disabled:cursor-not-allowed transition-all duration-300 resize-vertical ${
    error
      ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
      : 'border-twilight-border focus:ring-[rgba(161,150,206,0.2)] focus:border-twilight-lavender hover:border-[rgba(205,186,226,0.3)]'
  } ${className}`;

  return (
    <div className={`mb-5 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-twilight-lavender mb-2 tracking-wide ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-red-400 font-medium tracking-wide">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-xs text-twilight-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default TextArea;