import {
  validateField,
  validateFormData,
  hasFormErrors,
  getErrorCount,
  sanitizeFormData,
  createInitialFormData,
  prefersReducedMotion,
  validationRules
} from '@/utils/validation';
import { ContactFormData, ContactFormErrors } from '@/types/contact';

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

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('validates required fields', () => {
      const rule = { required: true };
      
      expect(validateField('name', '', rule)).toBe('Name is required');
      expect(validateField('name', '   ', rule)).toBe('Name is required');
      expect(validateField('name', 'John', rule)).toBeUndefined();
    });

    it('validates minimum length', () => {
      const rule = { minLength: 5 };
      
      expect(validateField('subject', 'Hi', rule)).toBe('Subject must be at least 5 characters');
      expect(validateField('subject', 'Hello', rule)).toBeUndefined();
      expect(validateField('subject', 'Hello World', rule)).toBeUndefined();
    });

    it('validates maximum length', () => {
      const rule = { maxLength: 10 };
      
      expect(validateField('name', 'This is a very long name', rule)).toBe('Name must not exceed 10 characters');
      expect(validateField('name', 'John', rule)).toBeUndefined();
      expect(validateField('name', 'John Smith', rule)).toBeUndefined();
    });

    it('validates email format', () => {
      const rule = { email: true };
      
      expect(validateField('email', 'invalid-email', rule)).toBe('Please enter a valid email address');
      expect(validateField('email', 'user@', rule)).toBe('Please enter a valid email address');
      expect(validateField('email', 'user@domain', rule)).toBe('Please enter a valid email address');
      expect(validateField('email', 'user@domain.com', rule)).toBeUndefined();
      expect(validateField('email', 'test.email+tag@example.co.uk', rule)).toBeUndefined();
    });

    it('validates phone numbers', () => {
      const rule = { phone: true };
      
      expect(validateField('phone', 'invalid', rule)).toBe('Please enter a valid phone number');
      expect(validateField('phone', '123', rule)).toBe('Please enter a valid phone number');
      expect(validateField('phone', '1234567890', rule)).toBeUndefined();
      expect(validateField('phone', '+1234567890', rule)).toBeUndefined();
    });

    it('skips validation for empty optional fields', () => {
      const rule = { minLength: 5 };
      
      expect(validateField('company', '', rule)).toBeUndefined();
      expect(validateField('company', '   ', rule)).toBeUndefined();
    });

    it('combines multiple validation rules', () => {
      const rule = { required: true, minLength: 5, maxLength: 20, email: true };
      
      expect(validateField('email', '', rule)).toBe('Email is required');
      expect(validateField('email', 'abc', rule)).toBe('Email must be at least 5 characters');
      expect(validateField('email', 'this-is-a-very-long-email-address@domain.com', rule))
        .toBe('Email must not exceed 20 characters');
      expect(validateField('email', 'invalid', rule)).toBe('Please enter a valid email address');
      expect(validateField('email', 'valid@test.com', rule)).toBeUndefined();
    });
  });

  describe('validateFormData', () => {
    it('validates all form fields according to rules', () => {
      const invalidData: ContactFormData = {
        name: '',
        email: 'invalid-email',
        company: '',
        phone: '',
        subject: 'Hi',
        message: 'Short',
        budget: '',
        timeline: '',
      };

      const errors = validateFormData(invalidData);
      
      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.subject).toBe('Subject must be at least 5 characters');
      expect(errors.message).toBe('Message must be at least 10 characters');
      expect(errors.company).toBeUndefined(); // Optional field
    });

    it('returns no errors for valid data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '1234567890',
        subject: 'Valid Subject',
        message: 'This is a valid message that meets the minimum length requirement.',
        budget: '$10,000 - $25,000',
        timeline: '3-6 months',
      };

      const errors = validateFormData(validData);
      
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('hasFormErrors', () => {
    it('returns true when there are errors', () => {
      const errors: ContactFormErrors = {
        name: 'Name is required',
        email: 'Invalid email',
      };

      expect(hasFormErrors(errors)).toBe(true);
    });

    it('returns false when there are no errors', () => {
      const errors: ContactFormErrors = {};
      expect(hasFormErrors(errors)).toBe(false);
    });

    it('returns false when errors are empty strings', () => {
      const errors: ContactFormErrors = {
        name: '',
        email: undefined,
      };

      expect(hasFormErrors(errors)).toBe(false);
    });
  });

  describe('getErrorCount', () => {
    it('counts the number of actual errors', () => {
      const errors: ContactFormErrors = {
        name: 'Name is required',
        email: 'Invalid email',
        subject: '',
        message: undefined,
      };

      expect(getErrorCount(errors)).toBe(2);
    });

    it('returns 0 for no errors', () => {
      const errors: ContactFormErrors = {};
      expect(getErrorCount(errors)).toBe(0);
    });
  });

  describe('sanitizeFormData', () => {
    it('trims whitespace from string values', () => {
      const data: ContactFormData = {
        name: '  John Doe  ',
        email: ' john@example.com ',
        company: '',
        phone: '',
        subject: '  Test Subject  ',
        message: '  Test message  ',
        budget: '',
        timeline: '',
      };

      const sanitized = sanitizeFormData(data);

      expect(sanitized.name).toBe('John Doe');
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.subject).toBe('Test Subject');
      expect(sanitized.message).toBe('Test message');
    });

    it('handles undefined values', () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
        company: undefined,
        phone: undefined,
        subject: 'Test',
        message: 'Test message',
        budget: undefined,
        timeline: undefined,
      } as ContactFormData;

      const sanitized = sanitizeFormData(data);

      expect(sanitized.company).toBe('');
      expect(sanitized.phone).toBe('');
      expect(sanitized.budget).toBe('');
      expect(sanitized.timeline).toBe('');
    });
  });

  describe('createInitialFormData', () => {
    it('creates form data with empty string values', () => {
      const initialData = createInitialFormData();

      expect(initialData).toEqual({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        budget: '',
        timeline: '',
      });
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns false when reduced motion is not preferred', () => {
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

      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
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

      expect(prefersReducedMotion()).toBe(true);
    });

    it('returns false in server-side environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(prefersReducedMotion()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('validationRules', () => {
    it('has rules for all required form fields', () => {
      expect(validationRules.name).toBeDefined();
      expect(validationRules.email).toBeDefined();
      expect(validationRules.subject).toBeDefined();
      expect(validationRules.message).toBeDefined();
    });

    it('marks required fields correctly', () => {
      expect(validationRules.name.required).toBe(true);
      expect(validationRules.email.required).toBe(true);
      expect(validationRules.subject.required).toBe(true);
      expect(validationRules.message.required).toBe(true);
      
      expect(validationRules.company.required).toBeUndefined();
      expect(validationRules.phone.required).toBeUndefined();
    });

    it('has appropriate length limits', () => {
      expect(validationRules.name.minLength).toBe(2);
      expect(validationRules.email.maxLength).toBe(254);
      expect(validationRules.subject.minLength).toBe(5);
      expect(validationRules.message.minLength).toBe(10);
      expect(validationRules.message.maxLength).toBe(2000);
    });
  });
});