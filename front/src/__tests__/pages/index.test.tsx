import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/pages/index'

// Mock Next.js components
jest.mock('next/head', () => {
  return function MockHead({ children }: any) {
    return <div data-testid="head">{children}</div>
  }
})

jest.mock('next/dynamic', () => {
  return function mockDynamic(importFunc: any, options: any) {
    const Component = () => <div data-testid="hero-section">Mocked HeroSection</div>
    Component.displayName = 'MockedDynamicComponent'
    return Component
  }
})

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  it('contains proper meta tags', () => {
    render(<Home />)
    
    const head = screen.getByTestId('head')
    expect(head).toBeInTheDocument()
  })

  it('renders main element', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('renders hero section', () => {
    render(<Home />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })
})