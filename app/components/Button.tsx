import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'disabled';
}

export default function Button({ children, variant = 'primary', className = '', disabled, ...props }: ButtonProps) {
  const baseClasses = 'px-4 py-2 text-white rounded-full transition-opacity uppercase font-bold cursor-pointer';
  
  const variantClasses = disabled || variant === 'disabled'
    ? 'bg-[#c4c4c4] cursor-not-allowed opacity-60'
    : 'bg-[var(--green-teal)] hover:opacity-90';
  
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

