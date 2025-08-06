export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  subject?: string;
  message?: string;
  budget?: string;
  timeline?: string;
  general?: string;
}

export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
  focused: boolean;
  animating: boolean;
}

export interface ContactFormState {
  data: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitSuccess: boolean;
  submitError?: string;
  fields: {
    [K in keyof ContactFormData]: FormFieldState;
  };
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  reducedMotion: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: string) => string | undefined;
}

export interface FormFieldConfig {
  name: keyof ContactFormData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  validation: ValidationRule;
  options?: string[]; // for select fields
  rows?: number; // for textarea
  animation: {
    focusScale: number;
    errorShake: boolean;
    successGlow: boolean;
  };
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface SubmitResponse {
  success: boolean;
  message: string;
  errors?: ContactFormErrors;
}