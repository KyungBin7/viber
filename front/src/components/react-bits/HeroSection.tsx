import React, { useEffect, useState } from 'react';
import TypewriterText from './TypewriterText';
import FadeInText from './FadeInText';
import ParticleSystem from './ParticleSystem';
import AnimatedButton from './AnimatedButton';
import ScrollIndicator from './ScrollIndicator';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Creative Web Agency",
  subtitle = "We create stunning digital experiences that captivate and convert",
  primaryCTA = { text: "View Our Work", href: "/portfolio" },
  secondaryCTA = { text: "Get In Touch", href: "/contact" }
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Enhanced Particle System Background - Responsive particle count */}
      <ParticleSystem
        particleCount={60} // Will be reduced on mobile in component
        colors={['#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24']}
        minSize={1}
        maxSize={4}
        speed={0.3}
        className="opacity-40"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Title with Typewriter Effect */}
        <h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          aria-label={title}
        >
          <TypewriterText
            text={title}
            speed={100}
            delay={500}
            className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          />
        </h1>

        {/* Animated Subtitle with Fade In */}
        <div className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          <FadeInText
            text={subtitle}
            delay={2000}
            duration={1000}
            splitByWords={true}
            staggerDelay={50}
            className="leading-relaxed"
          />
        </div>

        {/* Enhanced Interactive CTA Buttons */}
        <FadeInText 
          text="" 
          delay={3500} 
          duration={800}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <AnimatedButton
            href={primaryCTA.href}
            variant="primary"
            size="lg"
            ariaLabel={primaryCTA.text}
          >
            {primaryCTA.text}
          </AnimatedButton>
          
          <AnimatedButton
            href={secondaryCTA.href}
            variant="outline"
            size="lg"
            ariaLabel={secondaryCTA.text}
          >
            {secondaryCTA.text}
          </AnimatedButton>
        </FadeInText>
      </div>

      {/* Enhanced Scroll Indicator with Animations */}
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;