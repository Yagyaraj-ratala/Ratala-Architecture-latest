"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ // ✅ Changed to named export
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  animated = false
}) => {
  const baseClasses = `
    font-semibold rounded-lg transition-all duration-300 transform 
    border border-white/20 relative overflow-hidden
  `;

  const variantClasses = {
    primary: `bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 hover:shadow-lg`,
    secondary: `bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:scale-105 hover:shadow-lg`,
    outline: `bg-transparent border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white`
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const animationClass = animated ? 'float-3d' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${animationClass}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 hover:bg-white/5 transition-colors" />
    </button>
  );
};

// Remove: export default Button;