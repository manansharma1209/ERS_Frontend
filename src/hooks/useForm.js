import { useState, useCallback } from 'react';

export function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldValues = values) => {
    const validationErrors = {};

    Object.keys(validationRules).forEach(key => {
      const value = fieldValues[key];
      const rules = validationRules[key];

      if (rules.required && !value) {
        validationErrors[key] = rules.required === true 
          ? 'This field is required' 
          : rules.required;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        validationErrors[key] = rules.message || 'Invalid format';
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        validationErrors[key] = `Minimum length is ${rules.minLength}`;
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        validationErrors[key] = `Maximum length is ${rules.maxLength}`;
      }

      if (rules.min && value && Number(value) < rules.min) {
        validationErrors[key] = `Minimum value is ${rules.min}`;
      }

      if (rules.max && value && Number(value) > rules.max) {
        validationErrors[key] = `Maximum value is ${rules.max}`;
      }

      if (rules.custom) {
        const customError = rules.custom(value, fieldValues);
        if (customError) {
          validationErrors[key] = customError;
        }
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [validationRules, values]);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setValues(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (validationRules[name]) {
      validate({ ...values, [name]: value });
    }
  }, [validate, validationRules, values]);

  const handleSubmit = useCallback(async (onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (validate()) {
        try {
          await onSubmit(values);
          return true;
        } catch (error) {
          setErrors(prev => ({
            ...prev,
            submit: error.message
          }));
          return false;
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
        return false;
      }
    };
  }, [validate, values]);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    if (validationRules[field]) {
      validate({ ...values, [field]: value });
    }
  }, [validate, validationRules, values]);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validate
  };
}