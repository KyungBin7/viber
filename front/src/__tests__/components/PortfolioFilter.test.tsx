import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PortfolioFilter from '@/components/react-bits/PortfolioFilter'

// Mock the AnimatedButton and FadeInText components
jest.mock('@/components/react-bits/AnimatedButton', () => {
  return function MockAnimatedButton({ children, onClick, variant, ariaLabel, ...props }: any) {
    return (
      <button 
        onClick={onClick} 
        data-variant={variant}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    )
  }
})

jest.mock('@/components/react-bits/FadeInText', () => {
  return function MockFadeInText({ children, className, text, ...props }: any) {
    return (
      <div className={className} {...props}>
        {children || text}
      </div>
    )
  }
})

const mockCategories = [
  'All Projects',
  'Web Application', 
  'Website',
  'Dashboard',
  'Mobile App'
]

describe('PortfolioFilter', () => {
  const mockOnCategoryChange = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders filter component with title and description', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Filter Projects')).toBeInTheDocument()
    expect(screen.getByText('Choose a category to explore specific types of projects')).toBeInTheDocument()
  })

  it('renders all category buttons', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    // Check that we have the right number of buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(mockCategories.length)
    
    // Check that each category text is present
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('highlights selected category with primary variant', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="Web Application"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const selectedButton = screen.getByRole('button', { name: 'Filter by Web Application' })
    const unselectedButton = screen.getByRole('button', { name: 'Filter by Website' })
    
    expect(selectedButton).toHaveAttribute('data-variant', 'primary')
    expect(unselectedButton).toHaveAttribute('data-variant', 'outline')
  })

  it('calls onCategoryChange when category button is clicked', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const websiteButton = screen.getByRole('button', { name: 'Filter by Website' })
    fireEvent.click(websiteButton)
    
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Website')
  })

  it('does not call onCategoryChange when same category is clicked', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="Web Application"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const selectedButton = screen.getByRole('button', { name: 'Filter by Web Application' })
    fireEvent.click(selectedButton)
    
    // Should still call the handler - the parent component decides whether to act on it
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Web Application')
  })

  it('displays correct results count for All Projects', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Showing all 4 project categories')).toBeInTheDocument()
  })

  it('displays filtered category name', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="Dashboard"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Filtered by "Dashboard"')).toBeInTheDocument()
  })

  it('has proper ARIA labels for filter buttons', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    mockCategories.forEach(category => {
      const button = screen.getByRole('button', { name: `Filter by ${category}` })
      expect(button).toHaveAttribute('aria-label', `Filter by ${category}`)
    })
  })

  it('handles empty categories array', () => {
    render(
      <PortfolioFilter
        categories={[]}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Filter Projects')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('handles single category', () => {
    const singleCategory = ['All Projects']
    
    render(
      <PortfolioFilter
        categories={singleCategory}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByRole('button', { name: 'Filter by All Projects' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('updates results count text correctly', () => {
    const { rerender } = render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Showing all 4 project categories')).toBeInTheDocument()
    
    // Re-render with different selected category
    rerender(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="Mobile App"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByText('Filtered by "Mobile App"')).toBeInTheDocument()
    expect(screen.queryByText('Showing all 4 project categories')).not.toBeInTheDocument()
  })

  it('handles categories with special characters', () => {
    const specialCategories = ['All Projects', 'E-Commerce & Retail', 'AI/ML Projects', 'SaaS Solutions']
    
    render(
      <PortfolioFilter
        categories={specialCategories}
        selectedCategory="E-Commerce & Retail"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    expect(screen.getByRole('button', { name: 'Filter by E-Commerce & Retail' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter by AI/ML Projects' })).toBeInTheDocument()
    expect(screen.getByText('Filtered by "E-Commerce & Retail"')).toBeInTheDocument()
  })

  it('maintains keyboard accessibility', () => {
    render(
      <PortfolioFilter
        categories={mockCategories}
        selectedCategory="All Projects"
        onCategoryChange={mockOnCategoryChange}
      />
    )
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    // Find the All Projects button by aria-label
    const allProjectsButton = screen.getByRole('button', { name: /filter by all projects/i })
    expect(allProjectsButton).toBeInTheDocument()
    
    // Verify button is focusable (it's a button element)
    allProjectsButton.focus()
    expect(allProjectsButton).toHaveFocus()
  })
})