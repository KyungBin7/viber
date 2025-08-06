import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AnimatedInput from '@/components/react-bits/AnimatedInput'

// Mock window.matchMedia
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
  })),
});

describe('AnimatedInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnFocus.mockClear();
    mockOnBlur.mockClear();
  });

  const defaultProps = {
    name: 'test',
    label: 'Test Input',
    value: '',
    onChange: mockOnChange,
    onFocus: mockOnFocus,
    onBlur: mockOnBlur,
  };

  it('renders a text input correctly', () => {
    render(<AnimatedInput {...defaultProps} />);

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(<AnimatedInput {...defaultProps} required />);

    expect(screen.getByLabelText('required')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<AnimatedInput {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(<AnimatedInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');

    expect(mockOnChange).toHaveBeenCalledTimes(5); // Once for each character
    expect(mockOnChange).toHaveBeenLastCalledWith('test', 'Hello');
  });

  it('calls onFocus when input gains focus', async () => {
    const user = userEvent.setup();
    render(<AnimatedInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(mockOnFocus).toHaveBeenCalledWith('test');
  });

  it('calls onBlur when input loses focus', async () => {
    const user = userEvent.setup();
    render(<AnimatedInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalledWith('test');
  });

  it('renders as textarea when type is textarea', () => {
    render(<AnimatedInput {...defaultProps} type="textarea" rows={4} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('renders as select when type is select', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(
      <AnimatedInput 
        {...defaultProps} 
        type="select" 
        options={options}
        placeholder="Select an option"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select.tagName).toBe('SELECT');
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders email input when type is email', () => {
    render(<AnimatedInput {...defaultProps} type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders phone input when type is tel', () => {
    render(<AnimatedInput {...defaultProps} type="tel" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('is disabled when disabled prop is true', () => {
    render(<AnimatedInput {...defaultProps} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <AnimatedInput 
        {...defaultProps} 
        required 
        error="This field has an error"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-error');
    expect(input).toHaveAttribute('aria-labelledby', 'test-label');
  });

  it('has correct id and name attributes', () => {
    render(<AnimatedInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test');
    expect(input).toHaveAttribute('name', 'test');
  });

  it('shows placeholder only when focused', async () => {
    const user = userEvent.setup();
    render(<AnimatedInput {...defaultProps} placeholder="Enter your name" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    // Placeholder should not be visible when not focused
    expect(input.placeholder).toBe('');

    // Focus the input
    await user.click(input);
    
    // Now placeholder should be visible
    expect(input.placeholder).toBe('Enter your name');
  });

  it('applies custom className', () => {
    render(<AnimatedInput {...defaultProps} className="custom-class" />);

    const container = screen.getByRole('textbox').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('handles reduced motion preference', () => {
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

    render(<AnimatedInput {...defaultProps} />);

    // Component should still render correctly with reduced motion
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('updates value prop correctly', () => {
    const { rerender } = render(<AnimatedInput {...defaultProps} value="" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');

    rerender(<AnimatedInput {...defaultProps} value="Updated value" />);
    expect(input.value).toBe('Updated value');
  });

  it('handles tabIndex correctly when disabled', () => {
    render(<AnimatedInput {...defaultProps} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('tabIndex', '-1');
  });
});