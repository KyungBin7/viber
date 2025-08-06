import React, { useState, useEffect, useRef } from 'react';

interface FadeInTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  splitByWords?: boolean;
  staggerDelay?: number;
}

const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  delay = 0,
  duration = 1000,
  className = '',
  children,
  splitByWords = false,
  staggerDelay = 100
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // For intersection observer-based animation (scroll trigger)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (splitByWords) {
    const words = text.split(' ');
    return (
      <div ref={elementRef} className={className}>
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block transition-all ease-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-4'
            }`}
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: `${index * staggerDelay}ms`
            }}
          >
            {word}
            {index < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className} ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children || text}
    </div>
  );
};

export default FadeInText;