export function initHeaderScroll() {
  const header = document.querySelector('[data-fls-header-scroll]');

  if (!header) {
    return;
  }

  const toggleHeaderState = () => {
    header.classList.toggle('--header-scroll', window.scrollY >= 1);
  };

  toggleHeaderState();
  document.addEventListener('scroll', toggleHeaderState, { passive: true });
}
