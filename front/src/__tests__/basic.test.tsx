import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Basic test to verify test setup works
describe('Basic Test Suite', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello World</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    const ButtonComponent = () => (
      <button onClick={handleClick}>Click me</button>
    )
    
    render(<ButtonComponent />)
    const button = screen.getByRole('button')
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply CSS classes', () => {
    const StyledComponent = () => (
      <div className="text-blue-500 font-bold">Styled Text</div>
    )
    
    render(<StyledComponent />)
    const element = screen.getByText('Styled Text')
    expect(element).toHaveClass('text-blue-500', 'font-bold')
  })

  it('should handle accessibility attributes', () => {
    const AccessibleComponent = () => (
      <button aria-label="Close dialog" type="button">
        X
      </button>
    )
    
    render(<AccessibleComponent />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should render responsive classes', () => {
    const ResponsiveComponent = () => (
      <div className="text-sm sm:text-lg lg:text-xl">
        Responsive Text
      </div>
    )
    
    render(<ResponsiveComponent />)
    const element = screen.getByText('Responsive Text')
    expect(element).toHaveClass('text-sm', 'sm:text-lg', 'lg:text-xl')
  })
})