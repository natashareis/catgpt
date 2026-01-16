// Form validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'contactModal.validation.nameRequired';
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'contactModal.validation.emailRequired';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'contactModal.validation.emailInvalid';
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'contactModal.validation.messageRequired';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
