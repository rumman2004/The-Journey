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
  const textareaClasses = `w-full box-border px-4 py-3 bg-[rgba(0,0,0,0.02)] text-[#1f1f1f] border rounded-md focus:outline-none focus:ring-0 disabled:bg-[rgba(0,0,0,0.05)] disabled:text-[rgba(31,31,31,0.5)] disabled:cursor-not-allowed transition-colors duration-200 resize-vertical font-sans text-[0.85rem] ${
    error
      ? 'border-[rgba(220,80,80,0.4)]'
      : 'border-[rgba(0,0,0,0.08)] focus:border-[rgba(139,105,20,0.4)]'
  } ${className}`;

  return (
    <div className={`mb-5 ${containerClassName}`}>
      {label && (
        <label className={`block font-sans text-[0.65rem] font-bold text-[rgba(31,31,31,0.6)] uppercase tracking-[0.18em] mb-1.5 ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1.5 font-sans text-[0.72rem] text-[#dc2626] m-0">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 font-sans text-[0.72rem] text-[rgba(31,31,31,0.5)] m-0">{helperText}</p>
      )}
    </div>
  );
};

export default TextArea;