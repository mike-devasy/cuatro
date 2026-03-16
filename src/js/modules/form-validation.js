import { handleFormSubmit } from './form-submit.js';

export function initFormValidation() {
  const form = document.querySelector('#register-form');

  if (!form) {
    return;
  }

  const email = form.elements.email;
  const password = form.elements.password;
  const confirmPassword = form.elements.confirm_password;
  const serverError = form.querySelector('#register-form-error');
  let hasAttemptedSubmit = false;

  const fieldInputs = [email, password, confirmPassword];

  const setErrorVisibility = (input, isValid, shouldShow = false) => {
    const field = input.closest('.field');
    const error = field?.querySelector('.field__error');

    if (!field) {
      return;
    }

    field.classList.toggle('field--invalid', shouldShow && !isValid);

    if (error) {
      error.classList.toggle('shown', shouldShow && !isValid);
    }
  };

  const validateInput = (input, shouldShow = false) => {
    let isValid = false;

    if (input === email) {
      const value = email.value.trim();
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (input === password) {
      isValid = password.value.trim().length >= 8;
    }

    if (input === confirmPassword) {
      isValid = confirmPassword.value.trim().length >= 8 && confirmPassword.value === password.value;
    }

    setErrorVisibility(input, isValid, shouldShow);

    return isValid;
  };

  const validateForm = (shouldShow = false) => {
    const fieldValidity = fieldInputs.map((input) => validateInput(input, shouldShow));
    return fieldValidity.every(Boolean);
  };

  fieldInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (serverError) {
        serverError.hidden = true;
        serverError.textContent = '';
      }
      validateForm(hasAttemptedSubmit);
    });

    input.addEventListener('blur', () => {
      validateForm(hasAttemptedSubmit);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hasAttemptedSubmit = true;
    const isFormValid = validateForm(true);

    if (!isFormValid) {
      return;
    }

    await handleFormSubmit(form);
  });

  validateForm();
}
