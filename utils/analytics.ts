// Utilidad centralizada de Analítica (Google Analytics 4 + Microsoft Clarity)

export const GA_MEASUREMENT_ID = 'G-T142ZNLG0C';
export const CLARITY_PROJECT_ID = 'ysm453nrza';

export interface AnalyticsItem {
  item_id: string | number;
  item_name: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
  item_category?: string;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: ((...args: any[]) => void) & { q?: any[] };
    __analyticsScriptsLoaded?: boolean;
    __analyticsQueueInitialized?: boolean;
  }
}

/**
 * Inicializa las colas en memoria (sin cargar scripts externos hasta tener consentimiento).
 * Esto evita que los eventos disparados en `onMounted` de las páginas se pierdan por orden de montaje.
 */
export function ensureAnalyticsQueues() {
  if (typeof window === 'undefined') return;

  if (!window.__analyticsQueueInitialized) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    });

    window.clarity = window.clarity || function () {
      // eslint-disable-next-line prefer-rest-params
      (window.clarity!.q = window.clarity!.q || []).push(arguments);
    };

    window.__analyticsQueueInitialized = true;
  }
}

/**
 * Inyecta los scripts de GA4 y Microsoft Clarity en el DOM una sola vez cuando hay consentimiento.
 */
export function loadAnalyticsScripts() {
  if (typeof window === 'undefined') return;

  ensureAnalyticsQueues();

  if (window.__analyticsScriptsLoaded) return;
  window.__analyticsScriptsLoaded = true;

  // 1. Microsoft Clarity
  const clarityScript = document.createElement('script');
  clarityScript.async = true;
  clarityScript.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(clarityScript);

  // 2. Google Analytics 4 (gtag.js)
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);
}

/**
 * Verifica si el usuario rechazó explícitamente las cookies.
 */
function isAnalyticsRejected(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem('cookie-consent') === 'rejected';
  } catch {
    return false;
  }
}

/**
 * Dispara un evento tanto en GA4 como en Microsoft Clarity.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
  clarityTags?: Record<string, string | number>
) {
  if (typeof window === 'undefined' || isAnalyticsRejected()) return;

  ensureAnalyticsQueues();

  // Si el usuario ya había aceptado cookies, aseguramos que los scripts estén cargados
  try {
    if (localStorage.getItem('cookie-consent') === 'accepted') {
      loadAnalyticsScripts();
    }
  } catch {
    // ignore storage errors
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (typeof window.clarity === 'function') {
    window.clarity('event', eventName);
    if (clarityTags) {
      for (const [key, val] of Object.entries(clarityTags)) {
        if (val !== undefined && val !== null && val !== '') {
          window.clarity('set', key, String(val));
        }
      }
    }
  }
}

/**
 * Eventos de Contacto / Cotización de Proyectos (Leads)
 */
export function trackProjectLead(
  method: 'email' | 'whatsapp_videocall' | 'whatsapp_support' | string,
  sourceLocation: string
) {
  // Evento estándar recomendado por GA4 para generación de prospectos
  trackEvent(
    'generate_lead',
    {
      currency: 'MXN',
      value: 1,
      method,
      lead_source: sourceLocation,
      event_category: 'engagement',
      event_label: `project_lead_${method}_${sourceLocation}`
    },
    {
      lead_method: method,
      lead_source: sourceLocation
    }
  );

  // Evento complementario de contacto directo
  trackEvent('contact', {
    method,
    content_type: 'project_inquiry',
    location: sourceLocation
  });
}

/**
 * Evento de intención de cotizar proyecto (clics en CTAs que llevan a la sección #contacto)
 */
export function trackProjectContactIntent(sourceLocation: string) {
  trackEvent(
    'project_quote_click',
    {
      location: sourceLocation,
      event_category: 'engagement',
      event_label: `cta_cotizar_${sourceLocation}`
    },
    {
      cta_intent: sourceLocation
    }
  );
}
