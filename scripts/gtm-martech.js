// eslint-disable-next-line import/no-relative-packages
import GtmMartech from '../plugins/gtm-martech/src/index.js';

// For DA Preview support.
const disabled = window.location.search.includes('martech=off');

// Consent check function
async function checkConsent() {
  return new Promise((resolve) => {
    // Basic consent implementation - can be enhanced with proper CMP
    resolve({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted',
    });
  });
}

// Decorate callback for sections and blocks
function decorateEvents(el) {
  if (el.classList.contains('block')) {
    // Add event tracking for specific blocks
    if (el.classList.contains('fund-performance')) {
      // Track fund performance interactions
      const ctaButtons = el.querySelectorAll('a');
      ctaButtons.forEach((button) => {
        button.addEventListener('click', () => {
          martech.pushToDataLayer({
            event: 'fund_performance_cta_click',
            block_name: 'fund-performance',
            cta_text: button.textContent.trim(),
            cta_url: button.href,
          });
        });
      });
    }
    
    if (el.classList.contains('cpp-hero-chart')) {
      // Track hero chart interactions
      martech.pushToDataLayer({
        event: 'hero_chart_view',
        block_name: 'cpp-hero-chart',
      });
    }
  } else if (el.classList.contains('section')) {
    // Track section views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          martech.pushToDataLayer({
            event: 'section_view',
            section_name: entry.target.className,
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
  }
}

const martech = new GtmMartech({
  analytics: !disabled,
  tags: ['GTM-WMZ6CQRX'], // Your GTM Container ID
  containers: {
    lazy: [], // Add lazy GTM containers if needed
    delayed: [], // Add delayed GTM containers if needed
  },
  pageMetadata: {
    page_title: document.title,
    page_location: window.location.href,
    content_group1: 'CPP Investments',
  },
  consent: !disabled,
  consentCallback: checkConsent,
  decorateCallback: decorateEvents,
});

export default martech;
