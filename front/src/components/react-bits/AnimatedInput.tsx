import React, { useState, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/utils/validation';

interface AnimatedInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  value: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: string[]; // for select fields
  rows?: number; // for textarea
  disabled?: boolean;
  className?: string;
  onChange: (name: string, value: string) => void;
  onFocus?: (name: string) => void;
  onBlur?: (name: string) => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  name,
  label,
  type = 'text',
  value,
  placeholder = '',
  error,
  required = false,
  options = [],
  rows = 4,
  disabled = false,
  className = '',
  onChange,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion());
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus(name);
    
    if (!shouldReduceMotion) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur(name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  };

  // Animation classes
  const containerClasses = `
    relative
    ${shouldReduceMotion ? '' : 'transition-all duration-300 ease-out'}
    ${isAnimating && !shouldReduceMotion ? 'transform scale-105' : ''}
    ${className}
  `;

  const labelClasses = `
    absolute left-3 transition-all duration-200 ease-out pointer-events-none
    ${isFocused || value
      ? '-top-2 text-xs bg-slate-900 px-2 text-purple-400'
      : 'top-3 text-base text-purple-300'
    }
    ${error ? 'text-red-400' : ''}
    ${shouldReduceMotion ? '' : 'transform'}
  `;

  const inputClasses = `
    w-full px-4 py-3 bg-slate-800 border-2 rounded-lg
    text-white placeholder-purple-400
    focus:outline-none focus:ring-0
    transition-all duration-200 ease-out
    ${isFocused
      ? 'border-purple-500 shadow-lg shadow-purple-500/25'
      : 'border-slate-700 hover:border-slate-600'
    }
    ${error
      ? 'border-red-500 shadow-lg shadow-red-500/25'
      : ''
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${shouldReduceMotion ? '' : 'transform hover:scale-[1.01]'}
  `;

  const errorClasses = `
    absolute -bottom-6 left-0 text-sm text-red-400
    ${shouldReduceMotion ? '' : 'transition-all duration-200 ease-out'}
    ${error
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-1'
    }
  `;

  // Error shake animation
  useEffect(() => {
    if (error && !shouldReduceMotion && inputRef.current) {
      const element = inputRef.current;
      element.classList.add('animate-shake');
      setTimeout(() => {
        if (element) element.classList.remove('animate-shake');
      }, 500);
    }
  }, [error, shouldReduceMotion]);

  const renderInput = () => {
    const commonProps = {
      ref: inputRef as any,
      id: name,
      name,
      value,
      placeholder: isFocused ? placeholder : '',
      disabled,
      className: inputClasses,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-label': label,
      'aria-labelledby': `${name}-label`,
      'aria-required': required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
      tabIndex: disabled ? -1 : 0,
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${inputClasses} resize-none`}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="" disabled>
              {placeholder || `Select ${label.toLowerCase()}`}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <div className={containerClasses}>
      <div className="relative">
        <label 
          htmlFor={name} 
          id={`${name}-label`}
          className={labelClasses}
        >
          {label}
          {required && (
            <span className="text-red-400 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        {renderInput()}
      </div>
      
      {/* Error Message */}
      <div 
        id={`${name}-error`}
        className={errorClasses}
        role="alert"
        aria-live="polite"
      >
        {error}
      </div>

      {/* Focus Ring Animation */}
      {isFocused && !shouldReduceMotion && (
        <div className="absolute inset-0 border-2 border-purple-500 rounded-lg animate-pulse pointer-events-none opacity-50" />
      )}
    </div>
  );
};

export default AnimatedInput;