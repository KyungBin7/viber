import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnimatedButton from '@/components/react-bits/AnimatedButton'

describe('AnimatedButton', () => {
  it('renders button text', () => {
    render(<AnimatedButton>Test Button</AnimatedButton>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('renders as button by default', () => {
    render(<AnimatedButton>Button</AnimatedButton>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as link when href provided', () => {
    render(<AnimatedButton href="/test">Link Button</AnimatedButton>)
    const link = screen.getByRole('button')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<AnimatedButton onClick={handleClick}>Click me</AnimatedButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    const { rerender } = render(<AnimatedButton variant="primary">Primary</AnimatedButton>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('from-blue-500')
    
    rerender(<AnimatedButton variant="secondary">Secondary</AnimatedButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('from-gray-700')
    
    rerender(<AnimatedButton variant="outline">Outline</AnimatedButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border-2', 'border-gray-600')
  })

  it('respects disabled state', () => {
    const handleClick = jest.fn()
    render(<AnimatedButton disabled onClick={handleClick}>Disabled</AnimatedButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<AnimatedButton className="custom-class">Button</AnimatedButton>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('uses aria-label when provided', () => {
    render(<AnimatedButton ariaLabel="Custom Label">Button</AnimatedButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom Label')
  })
})