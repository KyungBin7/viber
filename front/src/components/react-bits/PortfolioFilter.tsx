import React, { useState, useEffect } from 'react';
import { PortfolioFilterProps } from '@/types/portfolio';
import AnimatedButton from './AnimatedButton';
import FadeInText from './FadeInText';

const PortfolioFilter: React.FC<PortfolioFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeInText
          text=""
          delay={0}
          duration={600}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Filter Projects</h2>
          <p className="text-gray-300">Choose a category to explore specific types of projects</p>
        </FadeInText>

        <FadeInText
          text=""
          delay={300}
          duration={600}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category, index) => (
            <div
              key={category}
              className={`
                transition-all duration-300 transform
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <AnimatedButton
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="md"
                onClick={() => handleCategoryClick(category)}
                className={`
                  transition-all duration-300 transform
                  ${selectedCategory === category 
                    ? 'shadow-lg shadow-purple-500/25' 
                    : 'hover:shadow-lg hover:shadow-blue-500/20'
                  }
                `}
                ariaLabel={`Filter by ${category}`}
              >
                {category}
              </AnimatedButton>
            </div>
          ))}
        </FadeInText>

        {/* Results count with animation */}
        <FadeInText
          text=""
          delay={800}
          duration={400}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            {selectedCategory === 'All Projects' 
              ? `Showing all ${categories.length - 1} project categories`
              : `Filtered by "${selectedCategory}"`
            }
          </p>
        </FadeInText>
      </div>
    </section>
  );
};

export default PortfolioFilter;