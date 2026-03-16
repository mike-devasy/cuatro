import { landingConfig } from '../config.js';
import { normalizePhone } from './phone-utils.js';

const FINGERPRINT_SCRIPT_URL = 'https://openfpcdn.io/fingerprintjs/v4';
const REGISTRATION_ERROR_MESSAGE = 'Algo salió mal.';
const BONUS_TO_CODE = {
  casino: '1',
  sports: '2',
  live: '3',
};

let fingerprintVisitorIdPromise;

const getHostnameFromUrl = (value) => {
  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
};

const getApexCuatrobetDomain = () => {
  const { hostname } = window.location;

  if (hostname === 'cuatrobet.com' || hostname.endsWith('.cuatrobet.com')) {
    return 'cuatrobet.com';
  }

  return '';
};

const canSetCookieForDomain = (targetHostname) => {
  if (!targetHostname) {
    return false;
  }

  const currentHostname = window.location.hostname;
  return currentHostname === targetHostname || currentHostname.endsWith(`.${targetHostname}`);
};

const getCookieDomain = (targetHostname) => (canSetCookieForDomain(targetHostname) ? `; domain=${targetHostname}` : '');

const isStandalonePwa = () =>
  ('standalone' in window.navigator && window.navigator.standalone) ||
  window.matchMedia('(display-mode: standalone)').matches;

const isWebView = () => {
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android',
  ];

  return new RegExp(`(${rules.join('|')})`, 'i').test(window.navigator.userAgent)
    && !window.navigator.userAgent.toLowerCase().includes('build');
};

const getXChannel = () => {
  if (isWebView()) {
    return 'MOBILE_WEB';
  }

  if (isStandalonePwa()) {
    return 'PWA';
  }

  return window.innerWidth >= 1280 ? 'DESKTOP_AIR_PM' : 'MOBILE_WEB';
};

const readCookie = (name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const collectMarketingMeta = () => {
  if (window.MTFEF && typeof window.MTFEF.collectSources === 'function') {
    try {
      const sources = window.MTFEF.collectSources();
      if (sources) {
        return sources;
      }
    } catch {
      // Fall back to cookie and query extraction below.
    }
  }

  const query = new URLSearchParams(window.location.search);
  const cookieMap = {
    adtag: readCookie('adtag'),
    btag: readCookie('pm_btag'),
    siteid: readCookie('pm_siteid'),
    qtag: readCookie('qtag'),
    adtag_t: readCookie('adtag_t'),
    btag_t: readCookie('btag_t'),
    qtag_t: readCookie('qtag_t'),
    org: readCookie('org'),
    org_t: readCookie('org_t'),
    sourceURL: readCookie('sourceUrl'),
    iohash: readCookie('iohash'),
  };

  const queryMap = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
    .reduce((accumulator, key) => {
      const value = query.get(key);
      if (value) {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});

  return Object.entries({ ...cookieMap, ...queryMap }).reduce((accumulator, [key, value]) => {
    if (typeof value === 'string' && value.trim()) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});
};

const getFingerprintVisitorId = async () => {
  if (!fingerprintVisitorIdPromise) {
    fingerprintVisitorIdPromise = import(/* @vite-ignore */ FINGERPRINT_SCRIPT_URL)
      .then((module) => module.default.load())
      .then((agent) => agent.get())
      .then((result) => result.visitorId)
      .catch(() => '');
  }

  return fingerprintVisitorIdPromise;
};

const buildHeaders = async () => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-Api-Key': landingConfig.apiKey,
    'X-Channel': getXChannel(),
    'X-Response-Error': 'true',
    'X-Landing': 'true',
    'X-VerificationLinkVersion': landingConfig.verificationLinkVersion,
  });

  const visitorId = await getFingerprintVisitorId();
  if (visitorId) {
    headers.set('X-ClientId', visitorId);
  }

  return headers;
};

const parseErrorResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
};

const resolveRedirectDomain = (apiResponse) => {
  const apexDomain = getApexCuatrobetDomain();
  if (apexDomain) {
    return `https://${apexDomain}`;
  }

  if (typeof apiResponse?.redirectDomain === 'string' && apiResponse.redirectDomain.trim()) {
    return apiResponse.redirectDomain;
  }

  return landingConfig.redirectDomain;
};

const persistAuthToken = (token, redirectDomain) => {
  if (!token) {
    return;
  }

  const targetHostname = getHostnameFromUrl(redirectDomain);
  const cookieDomain = getCookieDomain(targetHostname);
  const secureSuffix = window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `thirdPartyAuthToken=${token}; path=/; SameSite=Lax${cookieDomain}${secureSuffix}`;
  document.cookie = `airToken=${token}; path=/; SameSite=Lax${cookieDomain}${secureSuffix}`;
};

const buildRedirectUrl = (redirectDomain, bonusCode) => {
  const baseUrl = new URL('/deposit/', redirectDomain);
  const currentParams = new URLSearchParams(window.location.search);
  const parts = ['promo', 'landing', `bonus=${encodeURIComponent(bonusCode)}`];

  currentParams.forEach((value, key) => {
    if (key !== 'promo' && key !== 'landing' && key !== 'bonus') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return `${baseUrl.toString()}?${parts.join('&')}`;
};

const sanitizePayload = (formData) => {
  const payload = {
    ...formData,
    defaultCurrency: formData.defaultCurrency || landingConfig.defaultCurrency,
    selectedLanguage: formData.selectedLanguage || landingConfig.selectedLanguage,
    phone: normalizePhone(formData.phone),
    isPlayerAgree: true,
    formName: 'SHORTREGISTRATIONBYPHONE',
    marketingMeta: collectMarketingMeta(),
  };

  delete payload.isAdult;
  delete payload.selectedBonus;

  if (!payload.email || !payload.email.trim()) {
    delete payload.email;
  }

  return payload;
};

export const getBonusCode = (bonusId) => BONUS_TO_CODE[bonusId] || BONUS_TO_CODE.casino;

export async function submitRegistration(formData) {
  const headers = await buildHeaders();
  const payload = sanitizePayload(formData);
  let response;

  try {
    response = await fetch(landingConfig.registrationUrl, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Registration request failed', error);
    throw new Error(REGISTRATION_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const errorPayload = await parseErrorResponse(response);
    console.error('Registration request failed', {
      status: response.status,
      statusText: response.statusText,
      payload: errorPayload,
    });
    throw new Error(REGISTRATION_ERROR_MESSAGE);
  }

  const data = await response.json();
  const redirectDomain = resolveRedirectDomain(data);
  const bonusCode = payload.nnBonus || getBonusCode(formData.selectedBonus);

  persistAuthToken(data?.token, redirectDomain);

  if (window.MTFEF && typeof window.MTFEF.registerCallback === 'function') {
    try {
      window.MTFEF.registerCallback();
    } catch {
      // Do not break the registration flow on tracking callback failure.
    }
  }

  return {
    redirectUrl: buildRedirectUrl(redirectDomain, bonusCode),
  };
}
