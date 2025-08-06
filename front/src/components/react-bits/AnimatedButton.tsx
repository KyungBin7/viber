import React, { useState, useRef, useEffect } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ariaLabel
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-lg',
    lg: 'px-10 py-4 text-xl'
  };

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
    ${sizeClasses[size]}
  `;

  const variantClasses = {
    primary: `
      text-white bg-gradient-to-r from-blue-500 to-purple-600 
      hover:from-blue-600 hover:to-purple-700 hover:scale-105
      focus:ring-purple-500 shadow-lg hover:shadow-xl
      border-2 border-transparent
    `,
    secondary: `
      text-white bg-gradient-to-r from-gray-700 to-gray-800
      hover:from-gray-600 hover:to-gray-700 hover:scale-105
      focus:ring-gray-500 shadow-lg hover:shadow-xl
      border-2 border-transparent
    `,
    outline: `
      text-white border-2 border-gray-600 bg-transparent
      hover:border-gray-400 hover:bg-gray-800 hover:scale-105
      focus:ring-gray-500 backdrop-blur-sm
    `
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  const buttonContent = (
    <>
      {/* Background gradient overlay for hover effect */}
      <div 
        className={`
          absolute inset-0 rounded-lg transition-opacity duration-300
          ${variant === 'primary' 
            ? 'bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100' 
            : variant === 'secondary'
            ? 'bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100'
            : 'bg-gray-800 opacity-0 hover:opacity-100'
          }
        `}
      />
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s linear'
          }}
        />
      ))}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        
        {/* Hover animation arrow */}
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${
            isHovered ? 'translate-x-1' : ''
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </>
  );

  // Add ripple animation to CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (href && !disabled) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`group ${baseClasses} ${variantClasses[variant]} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        role="button"
        tabIndex={0}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className={`group ${baseClasses} ${variantClasses[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {buttonContent}
    </button>
  );
};

export default AnimatedButton;