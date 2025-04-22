import { API_CONFIG } from './constants';

export const validators = {
  required: (value) => {
    if (!value) return 'This field is required';
    if (typeof value === 'string' && !value.trim()) return 'This field is required';
    return '';
  },

  email: (value) => {
    if (!value) return '';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? '' : 'Invalid email address';
  },

  password: (value) => {
    if (!value) return '';
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < minLength) return `Password must be at least ${minLength} characters`;
    if (!hasUppercase) return 'Password must contain at least one uppercase letter';
    if (!hasLowercase) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecial) return 'Password must contain at least one special character';
    return '';
  },

  wissenId: (value) => {
    if (!value) return '';
    const wissenIdRegex = /^WCS\d{3}$/;
    return wissenIdRegex.test(value) ? '' : 'Invalid Wissen ID format (e.g., WCS001)';
  },

  amount: (value) => {
    if (!value) return '';
    const amount = Number(value);
    if (isNaN(amount)) return 'Amount must be a number';
    if (amount <= 0) return 'Amount must be greater than 0';
    return '';
  },

  file: (file) => {
    if (!file) return '';
    
    const { UPLOAD_MAX_SIZE, ALLOWED_FILE_TYPES } = API_CONFIG;
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`;
    }
    
    if (file.size > UPLOAD_MAX_SIZE) {
      return `File size must be less than ${Math.floor(UPLOAD_MAX_SIZE / 1024 / 1024)}MB`;
    }
    
    return '';
  },

  date: (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    if (date > new Date()) return 'Date cannot be in the future';
    return '';
  },

  reportees: (value) => {
    if (!value) return '';
    const reportees = value.split(',').map(id => id.trim());
    const wissenIdRegex = /^WCS\d{3}$/;
    const invalidIds = reportees.filter(id => !wissenIdRegex.test(id));
    
    if (invalidIds.length > 0) {
      return `Invalid Wissen ID format for: ${invalidIds.join(', ')}`;
    }
    return '';
  }
};

export function validateForm(values, rules) {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (Array.isArray(fieldRules)) {
      for (const rule of fieldRules) {
        const error = validators[rule](value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else if (typeof fieldRules === 'function') {
      const error = fieldRules(value, values);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
}