const API_BASE_URL = 'https://apg.cuatrobet.com/v0/identity';

const readEnv = (key, fallback) => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const landingConfig = {
  apiKey: readEnv('VITE_CUATROBET_API_KEY', 'f57361d7-f180-46d8-8b71-805288f3fb2a'),
  registrationUrl: readEnv('VITE_CUATROBET_REGISTRATION_URL', `${API_BASE_URL}/registration/byform`),
  redirectDomain: readEnv('VITE_CUATROBET_REDIRECT_DOMAIN', 'https://cuatrobet.com'),
  defaultCurrency: readEnv('VITE_CUATROBET_DEFAULT_CURRENCY', 'ARS'),
  selectedLanguage: readEnv('VITE_CUATROBET_SELECTED_LANGUAGE', 'es'),
  verificationLinkVersion: readEnv('VITE_CUATROBET_VERIFICATION_LINK_VERSION', '2'),
};
