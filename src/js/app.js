import { initFormValidation } from './modules/form-validation.js';
import { initFieldClear } from './modules/field-clear.js';
import { initPasswordToggle } from './modules/password-toggle.js';
import { initHeaderScroll } from './modules/header-scroll.js';

export function initApp() {
  initHeaderScroll();
  initFieldClear();
  initPasswordToggle();
  initFormValidation();
}
