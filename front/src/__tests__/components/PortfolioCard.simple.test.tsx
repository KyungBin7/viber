import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PortfolioCard from '@/components/react-bits/PortfolioCard'
import { Portfolio } from '@/types/portfolio'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  disconnect: () => null
})
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})

const mockPortfolio: Portfolio = {
  id: '1',
  title: 'Simple Test Project',
  description: 'A simple test project',
  techStack: ['React'],
  heroImage: '/test.jpg',
  category: 'Web App',
  url: 'https://test.com'
}

describe('PortfolioCard - Simple Tests', () => {
  it('renders basic portfolio information', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    expect(screen.getByText('Simple Test Project')).toBeInTheDocument()
    expect(screen.getByText('A simple test project')).toBeInTheDocument()
    expect(screen.getByText('Web App')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label')
    expect(card).toHaveAttribute('tabIndex', '0')
  })
})