export interface CTAButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  backgroundType?: 'gradient' | 'particles' | 'custom';
  animationDelay?: number;
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
}