import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ContactForm from '@/components/react-bits/ContactForm'
import { ContactFormData } from '@/types/contact'

// Mock next/dynamic to avoid loading issues in tests
jest.mock('next/dynamic', () => {
  return function mockDynamic(importFunc: () => Promise<any>) {
    return function DynamicComponent(props: any) {
      const React = require('react');
      const [Component, setComponent] = React.useState(null);
      
      React.useEffect(() => {
        importFunc().then((mod) => {
          setComponent(() => mod.default || mod);
        });
      }, []);
      
      if (!Component) {
        return React.createElement('div', null, 'Loading...');
      }
      
      return React.createElement(Component, props);
    };
  };
});

// Mock window.matchMedia for reduced motion testing
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

import React from 'react';

describe('ContactForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all form fields correctly', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/project budget/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/timeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Blur the field to trigger validation

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates minimum length requirements', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, 'A');
    await user.tab();

    await user.type(subjectInput, 'Hi');
    await user.tab();

    await user.type(messageInput, 'Short');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('clears errors when user focuses on field', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/full name/i);
    
    // Trigger validation error
    await user.click(nameInput);
    await user.tab(); // Blur to trigger validation

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });

    // Focus back on field should clear error
    await user.click(nameInput);

    await waitFor(() => {
      expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    mockOnSubmit.mockResolvedValueOnce({
      success: true,
      message: 'Thank you! Your message has been sent.'
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out valid form data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Check loading state
    expect(screen.getByText(/sending message.../i)).toBeInTheDocument();

    // Fast forward through the mock submission delay
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message that is long enough.'
    }));
  });

  it('handles form submission errors', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    mockOnSubmit.mockResolvedValueOnce({
      success: false,
      message: 'Something went wrong. Please try again.'
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out valid form data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Fast forward through the mock submission delay
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText(/something went wrong. please try again/i)).toBeInTheDocument();
    });

    // Button text should change to "Try Again"
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('handles network errors', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    mockOnSubmit.mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out valid form data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Fast forward through the mock submission delay
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    mockOnSubmit.mockResolvedValueOnce({
      success: true,
      message: 'Thank you! Your message has been sent.'
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;

    // Fill out form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Fast forward through submission
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });

    // Form should be reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);

      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    // Mock a slow submission
    mockOnSubmit.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Success' }), 3000);
    }));

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out valid form data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough.');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Check that inputs are disabled during submission
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email address/i)).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});