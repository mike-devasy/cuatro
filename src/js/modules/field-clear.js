import { getPhoneLocalDigits } from './phone-utils.js';

const shouldShowClear = (input) => {
  if (!input) {
    return false;
  }

  if (input.name === 'phone') {
    return getPhoneLocalDigits(input.value).length > 0;
  }

  return input.value.trim().length > 0;
};

export function initFieldClear() {
  const fields = document.querySelectorAll('.field');

  fields.forEach((field) => {
    const input = field.querySelector('input');
    const clearButton = field.querySelector('.field__clear');

    if (!input || !clearButton) {
      return;
    }

    const syncClearButton = () => {
      clearButton.hidden = !shouldShowClear(input);
    };

    clearButton.addEventListener('click', () => {
      if (input.name === 'phone' && input._imask) {
        input._imask.value = '';
      } else {
        input.value = '';
      }

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.focus();
      syncClearButton();
    });

    input.addEventListener('input', syncClearButton);
    input.addEventListener('focus', syncClearButton);
    input.addEventListener('blur', syncClearButton);

    syncClearButton();
  });
}
