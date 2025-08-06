import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AnimatedInput = dynamic(() => import('./AnimatedInput'), {
  ssr: true,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-12 bg-slate-700 rounded-lg mb-2"></div>
    </div>
  )
});
import { 
  ContactFormData, 
  ContactFormErrors, 
  ContactFormState,
  SubmissionStatus 
} from '@/types/contact';
import { 
  validateField, 
  validateFormData, 
  hasFormErrors,
  createInitialFormData,
  sanitizeFormData,
  validationRules,
  prefersReducedMotion
} from '@/utils/validation';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<{ success: boolean; message: string }>;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>(createInitialFormData());
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion());
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for touched fields
    if (touchedFields.has(name)) {
      const rule = validationRules[name as keyof ContactFormData];
      if (rule) {
        const fieldError = validateField(
          name as keyof ContactFormData,
          value,
          rule
        );
        
        setErrors(prev => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    }
  };

  const handleInputFocus = (name: string) => {
    // Clear any previous error when user focuses on field
    if (errors[name as keyof ContactFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleInputBlur = (name: string) => {
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Validate field on blur
    const rule = validationRules[name as keyof ContactFormData];
    if (rule) {
      const fieldError = validateField(
        name as keyof ContactFormData,
        formData[name as keyof ContactFormData] || '',
        rule
      );
      
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Announce form submission to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = 'Form submitted, processing your request...';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
    
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouchedFields(new Set(allFields));
    
    // Validate entire form
    const formErrors = validateFormData(formData);
    setErrors(formErrors);
    
    if (hasFormErrors(formErrors)) {
      setSubmitMessage('Please fix the errors above and try again.');
      return;
    }

    setSubmissionStatus('submitting');
    setSubmitMessage('');

    try {
      // Sanitize data before submission
      const sanitizedData = sanitizeFormData(formData);
      
      // Use provided onSubmit function or default mock
      const result = onSubmit 
        ? await onSubmit(sanitizedData)
        : await mockSubmit(sanitizedData);

      if (result.success) {
        setSubmissionStatus('success');
        setSubmitMessage(result.message || 'Thank you! Your message has been sent successfully.');
        // Reset form on success
        setFormData(createInitialFormData());
        setTouchedFields(new Set());
        setErrors({});
      } else {
        setSubmissionStatus('error');
        setSubmitMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmissionStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    }
  };

  // Mock submit function for demo purposes
  const mockSubmit = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock success (90% success rate for demo)
    const success = Math.random() > 0.1;
    
    return {
      success,
      message: success 
        ? 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'
        : 'Something went wrong with our server. Please try again in a few minutes.'
    };
  };

  const budgetOptions = [
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+',
    'Not sure yet'
  ];

  const timelineOptions = [
    'ASAP',
    '1-2 months',
    '3-6 months',
    '6+ months',
    'Just exploring'
  ];

  const formFields = [
    {
      name: 'name' as keyof ContactFormData,
      label: 'Full Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      name: 'email' as keyof ContactFormData,
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'Enter your email address',
      required: true,
    },
    {
      name: 'company' as keyof ContactFormData,
      label: 'Company',
      type: 'text' as const,
      placeholder: 'Enter your company name',
      required: false,
    },
    {
      name: 'phone' as keyof ContactFormData,
      label: 'Phone Number',
      type: 'tel' as const,
      placeholder: 'Enter your phone number',
      required: false,
    },
    {
      name: 'subject' as keyof ContactFormData,
      label: 'Subject',
      type: 'text' as const,
      placeholder: 'What would you like to discuss?',
      required: true,
    },
    {
      name: 'budget' as keyof ContactFormData,
      label: 'Project Budget',
      type: 'select' as const,
      placeholder: 'Select your budget range',
      required: false,
      options: budgetOptions,
    },
    {
      name: 'timeline' as keyof ContactFormData,
      label: 'Timeline',
      type: 'select' as const,
      placeholder: 'Select your timeline',
      required: false,
      options: timelineOptions,
    },
    {
      name: 'message' as keyof ContactFormData,
      label: 'Message',
      type: 'textarea' as const,
      placeholder: 'Tell us about your project, goals, and any specific requirements...',
      required: true,
      rows: 6,
    },
  ];

  const getSubmitButtonText = () => {
    switch (submissionStatus) {
      case 'submitting':
        return 'Sending Message...';
      case 'success':
        return 'Message Sent!';
      case 'error':
        return 'Try Again';
      default:
        return 'Send Message';
    }
  };

  const getSubmitButtonVariant = () => {
    switch (submissionStatus) {
      case 'success':
        return 'primary';
      case 'error':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <div className={`max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.slice(0, 4).map((field) => (
            <div key={field.name} className={field.name === 'subject' ? 'md:col-span-2' : ''}>
              <AnimatedInput
                name={field.name}
                label={field.label}
                type={field.type}
                value={formData[field.name] || ''}
                placeholder={field.placeholder}
                error={errors[field.name]}
                required={field.required}
                options={field.options}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={submissionStatus === 'submitting'}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.slice(5, 7).map((field) => (
            <AnimatedInput
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={formData[field.name] || ''}
              placeholder={field.placeholder}
              error={errors[field.name]}
              required={field.required}
              options={field.options}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={submissionStatus === 'submitting'}
            />
          ))}
        </div>

        {/* Message field */}
        <AnimatedInput
          name="message"
          label="Message"
          type="textarea"
          value={formData.message}
          placeholder="Tell us about your project, goals, and any specific requirements..."
          error={errors.message}
          required={true}
          rows={6}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={submissionStatus === 'submitting'}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submissionStatus === 'submitting'}
            className={`
              w-full px-10 py-4 text-xl font-medium rounded-lg
              transition-all duration-300 ease-in-out transform
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
              ${submissionStatus === 'submitting' 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                : submissionStatus === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : submissionStatus === 'error'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:scale-105'
              }
              text-white shadow-lg hover:shadow-xl
            `}
          >
            {submissionStatus === 'submitting' && (
              <div className="inline-block w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {getSubmitButtonText()}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div 
            className={`
              mt-4 p-4 rounded-lg text-center
              ${shouldReduceMotion ? '' : 'transition-all duration-300 ease-out transform'}
              ${submissionStatus === 'success' 
                ? 'bg-green-900/50 border border-green-500 text-green-400' 
                : 'bg-red-900/50 border border-red-500 text-red-400'
              }
            `}
            role="alert"
            aria-live="polite"
          >
            {submitMessage}
          </div>
        )}

        {/* Form Footer */}
        <div className="pt-4 text-center text-sm text-purple-300">
          <p>We respect your privacy. Your information will never be shared with third parties.</p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;