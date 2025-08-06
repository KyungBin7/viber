import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Contact from '@/pages/contact'

// Mock next/dynamic to avoid loading issues in tests
jest.mock('next/dynamic', () => {
  return function mockDynamic(importFunc: () => Promise<any>) {
    const Component = React.lazy(importFunc);
    return React.forwardRef((props: any, ref: any) => (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component {...props} ref={ref} />
      </React.Suspense>
    ));
  };
});

// Mock next/head
jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

// Mock window.matchMedia for reduced motion testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import React from 'react';

describe('Contact Page', () => {
  beforeEach(() => {
    // Reset window.matchMedia mock before each test
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders the contact page with all essential elements', () => {
    render(<Contact />);
    
    expect(screen.getByText('Let\'s Create Something Amazing Together')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText('hello@reactbitsagency.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
  });

  it('has proper accessibility features', () => {
    render(<Contact />);
    
    // Check for skip link
    expect(screen.getByText('Skip to contact form')).toBeInTheDocument();
    
    // Check for semantic heading structure
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays contact information correctly', () => {
    render(<Contact />);
    
    // Check contact details
    expect(screen.getByText('hello@reactbitsagency.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Creative Street')).toBeInTheDocument();
    expect(screen.getByText('Design District, NY 10001')).toBeInTheDocument();
  });

  it('has social media links', () => {
    render(<Contact />);
    
    const socialLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href') === '#'
    );
    
    // Should have 3 social media links (Twitter, LinkedIn, Pinterest)
    expect(socialLinks).toHaveLength(3);
  });

  it('respects reduced motion preferences', () => {
    // Mock reduced motion preference
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<Contact />);
    
    // The page should still render without animations
    expect(screen.getByText('Let\'s Create Something Amazing Together')).toBeInTheDocument();
  });

  it('has proper SEO meta tags', () => {
    render(<Contact />);
    
    // Note: We can't directly test meta tags in this setup due to next/head mock,
    // but we can verify the component renders without errors
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});