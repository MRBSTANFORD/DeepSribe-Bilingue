// Utility to handle Google Analytics 4 Injection and Event Tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    google_tag_manager?: any; // Indicator that the script actually executed
  }
}

export const initGA = (measurementId: string) => {
  if (!measurementId) return;
  if (window.gtag) return; // Already initialized

  // Inject the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true, 
    send_page_view: true
  });
  
  console.log(`DeepScribe Analytics Initialized: ${measurementId}`);
};

export const getTrackingStatus = (configuredId?: string) => {
  if (!configuredId) return 'missing';
  if (typeof window.gtag !== 'function') return 'blocked';
  const gaScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${configuredId}"]`);
  if (!gaScript) return 'blocked';
  if (window.google_tag_manager && window.google_tag_manager[configuredId]) {
      return 'active';
  }
  if (window.dataLayer && window.dataLayer.length > 0) {
      return 'active';
  }
  return 'initializing';
};

// Track specific features and increment lifetime counters for historical monitor
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // 1. External Send to GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // 2. Lifetime Compilation (Across all sessions on this device)
  const lifetimeCountKey = `ga_lifetime_count_${eventName}`;
  const currentLifetime = parseInt(localStorage.getItem(lifetimeCountKey) || '0');
  localStorage.setItem(lifetimeCountKey, (currentLifetime + 1).toString());

  // 3. Pulse Log Update (Session-based)
  const now = new Date().toLocaleTimeString();
  const rawPulse = localStorage.getItem('ga_session_pulse') || '[]';
  const pulse = JSON.parse(rawPulse);
  pulse.unshift({ name: eventName, time: now });
  localStorage.setItem('ga_session_pulse', JSON.stringify(pulse.slice(0, 20)));
};

// Pre-defined tracked actions for consistency
export const ANALYTICS_EVENTS = {
  UPLOAD_AUDIO: 'feature_upload_audio',
  START_LIVE: 'feature_start_live_session',
  GENERATE_DOC: 'feature_generate_doc',
  DEEP_ANALYSIS: 'feature_deep_analysis',
  TTS_PLAY: 'feature_tts_play',
  EXPORT_DOCS: 'feature_export_google_docs',
  EXPORT_DOWNLOAD: 'feature_download_file',
  TEST_EVENT: 'admin_test_click'
};