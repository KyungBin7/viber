import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { validateFormData, validateField, validationRules } from '@/utils/validation'
import { ContactFormData } from '@/types/contact'

// Test validation logic directly without the complex component
describe('Contact Form Validation Logic', () => {
  it('validates required fields correctly', () => {
    const invalidData: ContactFormData = {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      budget: '',
      timeline: '',
    };

    const errors = validateFormData(invalidData);
    
    expect(errors.name).toBe('Name is required');
    expect(errors.email).toBe('Email is required');
    expect(errors.subject).toBe('Subject is required');
    expect(errors.message).toBe('Message is required');
  });

  it('validates email format', () => {
    const rule = validationRules.email;
    
    expect(validateField('email', 'invalid-email', rule)).toBe('Please enter a valid email address');
    expect(validateField('email', 'user@', rule)).toBe('Please enter a valid email address');
    expect(validateField('email', 'user@domain', rule)).toBe('Please enter a valid email address');
    expect(validateField('email', 'user@domain.com', rule)).toBeUndefined();
  });

  it('validates phone numbers', () => {
    const rule = validationRules.phone;
    
    expect(validateField('phone', 'invalid', rule)).toBe('Please enter a valid phone number');
    expect(validateField('phone', '123', rule)).toBe('Please enter a valid phone number');
    expect(validateField('phone', '1234567890', rule)).toBeUndefined();
    expect(validateField('phone', '+1234567890', rule)).toBeUndefined();
  });

  it('validates minimum and maximum lengths', () => {
    const nameRule = validationRules.name;
    const messageRule = validationRules.message;
    
    expect(validateField('name', 'A', nameRule)).toBe('Name must be at least 2 characters');
    expect(validateField('message', 'Short', messageRule)).toBe('Message must be at least 10 characters');
    
    const longMessage = 'x'.repeat(2001);
    expect(validateField('message', longMessage, messageRule)).toBe('Message must not exceed 2000 characters');
  });

  it('accepts valid form data', () => {
    const validData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Test Company',
      phone: '1234567890',
      subject: 'Valid Subject',
      message: 'This is a valid message that meets all requirements.',
      budget: '$10,000 - $25,000',
      timeline: '3-6 months',
    };

    const errors = validateFormData(validData);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('handles optional fields correctly', () => {
    const validData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: '', // Optional
      phone: '', // Optional
      subject: 'Valid Subject',
      message: 'This is a valid message that meets all requirements.',
      budget: '', // Optional
      timeline: '', // Optional
    };

    const errors = validateFormData(validData);
    expect(Object.keys(errors).length).toBe(0);
  });
});