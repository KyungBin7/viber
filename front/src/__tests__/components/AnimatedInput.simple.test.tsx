import { render, screen } from '@testing-library/react'
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

describe('AnimatedInput Component - Basic Functionality', () => {
  const mockOnChange = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  const defaultProps = {
    name: 'test',
    label: 'Test Input',
    value: '',
    onChange: mockOnChange,
    onFocus: mockOnFocus,
    onBlur: mockOnBlur,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnFocus.mockClear();
    mockOnBlur.mockClear();
  });

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

  it('is disabled when disabled prop is true', () => {
    render(<AnimatedInput {...defaultProps} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('has correct id and name attributes', () => {
    render(<AnimatedInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test');
    expect(input).toHaveAttribute('name', 'test');
  });

  it('updates value prop correctly', () => {
    const { rerender } = render(<AnimatedInput {...defaultProps} value="" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');

    rerender(<AnimatedInput {...defaultProps} value="Updated value" />);
    expect(input.value).toBe('Updated value');
  });

  it('handles different input types correctly', () => {
    const { rerender } = render(<AnimatedInput {...defaultProps} type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<AnimatedInput {...defaultProps} type="tel" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'tel');
  });
});