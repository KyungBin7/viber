import { ContactFormData, ContactFormErrors, ValidationRule } from '@/types/contact';

// Email validation regex - requires domain with TLD
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Phone validation regex (supports various formats) - requires at least 10 digits
const PHONE_REGEX = /^[\+]?[1-9][\d]{9,15}$/;

// Validation rules for each field
export const validationRules: { [K in keyof ContactFormData]: ValidationRule } = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    email: true,
    maxLength: 254,
  },
  company: {
    maxLength: 100,
  },
  phone: {
    phone: true,
    maxLength: 20,
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  budget: {
    maxLength: 50,
  },
  timeline: {
    maxLength: 100,
  },
};

/**
 * Validates a single field value
 */
export const validateField = (
  name: keyof ContactFormData,
  value: string,
  rule: ValidationRule
): string | undefined => {
  // Required field validation
  if (rule.required && (!value || value.trim().length === 0)) {
    return `${capitalizeFirstLetter(name)} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  const trimmedValue = value.trim();

  // Minimum length validation
  if (rule.minLength && trimmedValue.length < rule.minLength) {
    return `${capitalizeFirstLetter(name)} must be at least ${rule.minLength} characters`;
  }

  // Maximum length validation
  if (rule.maxLength && trimmedValue.length > rule.maxLength) {
    return `${capitalizeFirstLetter(name)} must not exceed ${rule.maxLength} characters`;
  }

  // Email validation
  if (rule.email && !EMAIL_REGEX.test(trimmedValue)) {
    return 'Please enter a valid email address';
  }

  // Phone validation
  if (rule.phone && trimmedValue && !PHONE_REGEX.test(trimmedValue.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(trimmedValue)) {
    return `${capitalizeFirstLetter(name)} format is invalid`;
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(trimmedValue);
  }

  return undefined;
};

/**
 * Validates all form data
 */
export const validateFormData = (data: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  (Object.keys(validationRules) as Array<keyof ContactFormData>).forEach(field => {
    const rule = validationRules[field];
    if (rule) {
      const error = validateField(field, data[field] || '', rule);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return errors;
};

/**
 * Checks if form has any errors
 */
export const hasFormErrors = (errors: ContactFormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};

/**
 * Gets the total number of errors
 */
export const getErrorCount = (errors: ContactFormErrors): number => {
  return Object.values(errors).filter(error => error !== undefined && error !== '').length;
};

/**
 * Capitalizes the first letter of a string
 */
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Sanitizes form data before submission
 */
export const sanitizeFormData = (data: ContactFormData): ContactFormData => {
  const sanitized: ContactFormData = {} as ContactFormData;

  (Object.keys(data) as Array<keyof ContactFormData>).forEach(key => {
    const value = data[key];
    sanitized[key] = typeof value === 'string' ? value.trim() : (value || '');
  });

  return sanitized;
};

/**
 * Creates initial form data with empty values
 */
export const createInitialFormData = (): ContactFormData => ({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  budget: '',
  timeline: '',
});

/**
 * Checks if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};