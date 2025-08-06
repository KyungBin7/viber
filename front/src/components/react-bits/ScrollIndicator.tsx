import React, { useState, useEffect } from 'react';

interface ScrollIndicatorProps {
  className?: string;
  targetId?: string;
  onClick?: () => void;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className = '',
  targetId,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide scroll indicator after user starts scrolling
      if (scrollTop > windowHeight * 0.1) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Calculate scroll progress for animation
      const maxScroll = document.documentElement.scrollHeight - windowHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Default: scroll to next section
      window.scrollBy({ 
        top: window.innerHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`
        fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 
        transition-all duration-500 ease-in-out cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Scroll to next section"
    >
      {/* Animated scroll indicator */}
      <div className="flex flex-col items-center group">
        {/* Scroll text */}
        <span className="text-xs text-gray-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Scroll
        </span>
        
        {/* Animated arrow container */}
        <div className="relative flex flex-col items-center">
          {/* Main arrow with bounce animation */}
          <svg 
            className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
          
          {/* Secondary arrows for staggered effect */}
          <svg 
            className="w-4 h-4 text-gray-500 absolute top-2 animate-bounce" 
            style={{ animationDelay: '0.2s' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7" 
            />
          </svg>
          
          <svg 
            className="w-3 h-3 text-gray-600 absolute top-4 animate-bounce" 
            style={{ animationDelay: '0.4s' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7" 
            />
          </svg>
        </div>
        
        {/* Progress indicator line */}
        <div className="w-px h-12 bg-gray-700 mt-2 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-purple-500 transition-all duration-300"
            style={{ 
              height: `${scrollProgress * 100}%`,
              transform: `translateY(${isVisible ? 0 : -100}%)` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollIndicator;