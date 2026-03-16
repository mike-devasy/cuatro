import { bonuses } from '../data/bonuses.js';

const getPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const patrickTexturePath = getPath('images/patrick/background-footer.webp');

export function initBonusModal() {
  const STORAGE_KEY = 'selected_bonus_id';
  let currentBonusId = localStorage.getItem(STORAGE_KEY) || bonuses[0].id;

  // Render Modal HTML
  const modalHTML = `
    <div class="modal" id="bonus-modal" aria-hidden="true">
      <div class="modal__backdrop"></div>
      <div class="modal__container">
        <div class="modal__content">
          <header class="modal__header">
            <h2 class="modal__title">TENEMOS UNA SORPRESA PARA TI</h2>
            <p class="modal__subtitle">Ofrecemos un bono para el primer depósito de la cuenta</p>
            <button class="modal__close" aria-label="Close modal">✕</button>
          </header>
          
          <div class="modal__list">
            ${bonuses.map(bonus => `
              <div class="bonus-option ${bonus.id === currentBonusId ? 'is-selected' : ''}" data-id="${bonus.id}">
                <img src="${bonus.icon}" srcset="${bonus.icon} 1x, ${bonus.icon2x} 2x" alt="" class="bonus-option__icon">
                <div class="bonus-option__content">
                  <p class="bonus-option__title">${bonus.title}</p>
                  <p class="bonus-option__text">${bonus.text}</p>
                </div>
                <div class="bonus-option__radio"></div>
              </div>
            `).join('')}
          </div>

          <footer class="modal__footer">
            <button class="modal__submit">CONTINUAR</button>
            <p class="modal__disclaimer">
              Al elegir un bono, confirmas que has leído y aceptas la política de la 
              <strong>Bono deportivo</strong> y de la <strong>Bono de casino</strong>
            </p>
          </footer>
        </div>
        <div class="modal__boxes-bg-wrapper">
          <img src="${patrickTexturePath}" alt="" class="modal__boxes-bg" />
        </div>
        <div class="modal__background-wrapper">
          <img src="${patrickTexturePath}" alt="" class="modal__background" />
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Elements
  const modal = document.getElementById('bonus-modal');
  const backdrop = modal.querySelector('.modal__backdrop');
  const closeBtn = modal.querySelector('.modal__close');
  const submitBtn = modal.querySelector('.modal__submit');
  const options = modal.querySelectorAll('.bonus-option');
  const mainCard = document.querySelector('.bonus-card');

  // Functions
  const updateMainCard = (bonusId) => {
    const bonus = bonuses.find(b => b.id === bonusId);
    if (!bonus || !mainCard) return;

    const iconImg = mainCard.querySelector('.bonus-card__icon');
    const badge = mainCard.querySelector('.bonus-card__badge');
    const topText = mainCard.querySelector('.bonus-card__top');
    const bodyText = mainCard.querySelector('.bonus-card__text');
    const bonusInput = document.getElementById('selected-bonus-input');

    if (iconImg) {
      iconImg.src = bonus.icon;
      iconImg.srcset = `${bonus.icon} 1x, ${bonus.icon2x} 2x`;
    }
    
    // Reconstruct top text safely preserving the badge
    if (topText) {
      topText.innerHTML = `<span class="bonus-card__badge">${bonus.badge}</span> ${bonus.title.replace(bonus.badge, '').trim()}`;
    }

    if (bodyText) {
      bodyText.innerHTML = bonus.text;
    }

    if (bonusInput) {
      bonusInput.value = bonusId;
    }
  };

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const selectOption = (id) => {
    currentBonusId = id;
    
    options.forEach(opt => {
      if (opt.dataset.id === id) {
        opt.classList.add('is-selected');
      } else {
        opt.classList.remove('is-selected');
      }
    });
  };

  const saveAndClose = () => {
    localStorage.setItem(STORAGE_KEY, currentBonusId);
    updateMainCard(currentBonusId);
    closeModal();
  };

  // Initial Update
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateMainCard(currentBonusId));
  } else {
    updateMainCard(currentBonusId);
  }

  // Listeners
  if (mainCard) {
    mainCard.addEventListener('click', openModal);
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  submitBtn.addEventListener('click', saveAndClose);

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      selectOption(opt.dataset.id);
      saveAndClose();
    });
  });
}
