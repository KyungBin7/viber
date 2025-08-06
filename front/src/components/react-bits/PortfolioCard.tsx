import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Portfolio, PortfolioCardProps } from '@/types/portfolio';

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  delay = 0,
  onHover
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    intersectionRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    intersectionRef.current.observe(card);

    return () => {
      if (intersectionRef.current) {
        intersectionRef.current.disconnect();
      }
    };
  }, [delay]);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) {
      onHover(portfolio);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <article
      ref={cardRef}
      className={`
        relative group cursor-pointer
        transition-all duration-700 ease-out transform
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
        }
        ${isHovered 
          ? 'scale-105 -translate-y-2' 
          : 'scale-100 translate-y-0'
        }
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`View ${portfolio.title} project`}
    >
      {/* Card Container */}
      <div className="
        relative overflow-hidden rounded-xl
        bg-gray-800/40 backdrop-blur-sm
        border border-gray-700/50 
        transition-all duration-300
        hover:border-gray-600/70 hover:bg-gray-800/60
        shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
      ">
        
        {/* Hero Image Container */}
        <div className="relative aspect-video overflow-hidden">
          {/* Placeholder gradient for image */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30" />
          
          {/* Overlay that appears on hover */}
          <div className={`
            absolute inset-0 
            bg-gradient-to-t from-gray-900/80 via-transparent to-transparent
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-60'}
          `} />

          {/* Tech stack overlay on hover */}
          <div className={`
            absolute top-4 left-4 right-4
            transition-all duration-300 transform
            ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
          `}>
            <div className="flex flex-wrap gap-2">
              {portfolio.techStack.slice(0, 3).map((tech) => (
                <span 
                  key={tech}
                  className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                >
                  {tech}
                </span>
              ))}
              {portfolio.techStack.length > 3 && (
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                  +{portfolio.techStack.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons that appear on hover */}
          <div className={`
            absolute bottom-4 right-4
            transition-all duration-300 transform
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="flex gap-2">
              {portfolio.url && (
                <a
                  href={portfolio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                    text-white text-sm font-medium rounded-lg
                    hover:from-blue-600 hover:to-purple-700
                    transition-all duration-200 transform hover:scale-105
                    shadow-lg backdrop-blur-sm
                  "
                  onClick={(e) => e.stopPropagation()}
                >
                  View Live
                </a>
              )}
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg
                    hover:bg-black/70 transition-all duration-200 transform hover:scale-105
                    shadow-lg
                  "
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View GitHub repository"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="
              px-3 py-1 text-xs font-medium rounded-full
              bg-gradient-to-r from-blue-500/20 to-purple-500/20
              text-blue-300 border border-blue-500/30
            ">
              {portfolio.category}
            </span>
          </div>

          {/* Title with hover animation */}
          <h3 className={`
            text-xl font-bold mb-3 transition-all duration-300
            ${isHovered ? 'text-white' : 'text-gray-100'}
          `}>
            {portfolio.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {portfolio.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2">
            {portfolio.techStack.map((tech) => (
              <span 
                key={tech}
                className={`
                  px-3 py-1 text-xs rounded-full transition-all duration-300
                  ${isHovered 
                    ? 'bg-gray-700/70 text-gray-200 border border-gray-600' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                  }
                `}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Animated border glow effect */}
        <div className={`
          absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
          bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />
      </div>
    </article>
  );
};

export default PortfolioCard;