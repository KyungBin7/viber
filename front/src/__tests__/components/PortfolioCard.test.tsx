import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

// Mock matchMedia for reduced motion testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})

const mockPortfolio: Portfolio = {
  id: '1',
  title: 'Test Portfolio Project',
  description: 'This is a test portfolio project with a detailed description that showcases various technologies and approaches.',
  techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  heroImage: '/test-hero-image.jpg',
  category: 'Web Application',
  url: 'https://test-portfolio.com',
  githubUrl: 'https://github.com/test/portfolio'
}

describe('PortfolioCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders portfolio card with correct information', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    expect(screen.getByText('Test Portfolio Project')).toBeInTheDocument()
    expect(screen.getByText(/This is a test portfolio project/)).toBeInTheDocument()
    expect(screen.getByText('Web Application')).toBeInTheDocument()
    
    // Tech stack items appear in main section, may also appear in hover overlay
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Next.js').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Tailwind CSS').length).toBeGreaterThanOrEqual(1)
  })

  it('renders project links correctly', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    const viewLiveLink = screen.getByRole('link', { name: /view live/i })
    expect(viewLiveLink).toBeInTheDocument()
    expect(viewLiveLink).toHaveAttribute('href', 'https://test-portfolio.com')
    expect(viewLiveLink).toHaveAttribute('target', '_blank')
    expect(viewLiveLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    const githubLink = screen.getByRole('link', { name: /view github repository/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/portfolio')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles portfolio without optional URLs', () => {
    const portfolioWithoutUrls: Portfolio = {
      ...mockPortfolio,
      url: undefined,
      githubUrl: undefined
    }
    
    render(<PortfolioCard portfolio={portfolioWithoutUrls} />)
    
    expect(screen.queryByRole('link', { name: /view live/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view github repository/i })).not.toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    const card = screen.getByRole('button', { name: /view.*project/i })
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('aria-label', 'View Test Portfolio Project project')
  })

  it('calls onHover callback when mouse enters', () => {
    const mockOnHover = jest.fn()
    render(<PortfolioCard portfolio={mockPortfolio} onHover={mockOnHover} />)
    
    const card = screen.getByRole('button', { name: /view.*project/i })
    fireEvent.mouseEnter(card)
    
    expect(mockOnHover).toHaveBeenCalledWith(mockPortfolio)
  })

  it('does not call onHover when mouse leaves', () => {
    const mockOnHover = jest.fn()
    render(<PortfolioCard portfolio={mockPortfolio} onHover={mockOnHover} />)
    
    const card = screen.getByRole('button', { name: /view.*project/i })
    
    // Enter and then leave
    fireEvent.mouseEnter(card)
    fireEvent.mouseLeave(card)
    
    // Should only be called once (on enter)
    expect(mockOnHover).toHaveBeenCalledTimes(1)
  })

  it('displays tech stack with overflow handling', () => {
    const portfolioWithManyTechs: Portfolio = {
      ...mockPortfolio,
      techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Jest', 'Node.js', 'Express', 'MongoDB']
    }
    
    render(<PortfolioCard portfolio={portfolioWithManyTechs} />)
    
    // Should display all tech stack items (some appear in overlay, some in main section)
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('MongoDB').length).toBeGreaterThanOrEqual(1)
  })

  it('renders with custom delay', async () => {
    render(<PortfolioCard portfolio={mockPortfolio} delay={500} />)
    
    // The card should render but animations might be delayed
    expect(screen.getByText('Test Portfolio Project')).toBeInTheDocument()
  })

  it('stops event propagation on link clicks', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    const viewLiveLink = screen.getByRole('link', { name: /view live/i })
    const clickEvent = new MouseEvent('click', { bubbles: true })
    
    // Mock stopPropagation to verify it's called
    const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation')
    
    fireEvent(viewLiveLink, clickEvent)
    
    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  it('respects reduced motion preference', () => {
    // Mock reduced motion preference
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
      }))
    })
    
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    // Component should still render
    expect(screen.getByText('Test Portfolio Project')).toBeInTheDocument()
  })

  it('displays category badge', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />)
    
    const categoryBadge = screen.getByText('Web Application')
    expect(categoryBadge).toBeInTheDocument()
    expect(categoryBadge).toHaveClass('text-blue-300')
  })

  it('truncates long descriptions', () => {
    const portfolioWithLongDesc: Portfolio = {
      ...mockPortfolio,
      description: 'This is a very long description that should be truncated after a certain number of lines to maintain good visual hierarchy and prevent the cards from becoming too tall and disrupting the grid layout.'
    }
    
    render(<PortfolioCard portfolio={portfolioWithLongDesc} />)
    
    const description = screen.getByText(/This is a very long description/)
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('line-clamp-3')
  })
})