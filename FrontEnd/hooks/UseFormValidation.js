import { useState, useCallback } from 'react';

/*
 Hook customizado: useFormValidation
 Abstrai a lógica de validação de formulários
 Baseado em padrões encontrados em login.js e cadastro.js
 */
const useFormValidation = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Limpar erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validar se função validate foi fornecida
      if (validate) {
        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsSubmitting(false);
          return;
        }
      }

      await onSubmit(values);

      // Limpar form após sucesso
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setSubmitError(error.message || 'Erro ao enviar formulário');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validate, initialValues]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors
  };
};

export default useFormValidation;