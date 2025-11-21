import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Extract content from the footer fragment
 * @param {Element} fragment The footer fragment element
 * @returns {Object} Extracted content object
 */
function extractFooterContent(fragment) {
  const sections = fragment.querySelectorAll('.section');
  const firstSection = sections[0];
  const secondSection = sections[1];

  // Extract logo - look for picture element or img
  const logoPicture = firstSection.querySelector('picture');
  const logoImg = firstSection.querySelector('img');
  let logo = '';

  if (logoPicture) {
    logo = logoPicture.outerHTML;
  } else if (logoImg) {
    logo = logoImg.outerHTML;
  } else {
    // Fallback logo
    logo = '<img src="/icons/cppib-logo-white.svg" alt="CPP Investments" width="151" height="26">';
  }

  // Extract newsletter content dynamically
  const paragraphs = firstSection.querySelectorAll('p:not(.button-container)');
  const headings = firstSection.querySelectorAll('h6');

  let newsletterTitle = '';
  let newsletterDescription = '';

  // Extract newsletter title - find the first non-empty paragraph that's not an image
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    const hasImage = p.querySelector('picture, img');
    if (text && !hasImage && !newsletterTitle) {
      newsletterTitle = text;
    }
  });

  // Extract newsletter description from h6 heading
  if (headings.length > 0) {
    newsletterDescription = headings[0].textContent.trim();
  }

  // Fallbacks if content not found
  if (!newsletterTitle) {
    newsletterTitle = 'Get the latest from CPP Investments';
  }
  if (!newsletterDescription) {
    newsletterDescription = 'Get the latest investment insights, performance updates, and thought leadership delivered to your inbox.';
  }

  // Extract buttons from first section
  const firstSectionButtons = firstSection.querySelectorAll('.button-container a');
  let subscribeButton = '';
  const navigationLinks = [];

  firstSectionButtons.forEach((button) => {
    const title = button.getAttribute('title') || button.textContent.trim();
    const href = button.getAttribute('href');

    if (title.toLowerCase().includes('subscribe')) {
      subscribeButton = `<a href="${href}" class="footer-cta-button">
        ${title}
        <span class="icon icon-arrow_forward">
          <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="14" height="14">
        </span>
      </a>`;
    } else {
      navigationLinks.push(`<a href="${href}">${title}</a>`);
    }
  });

  // Extract copyright and legal links from second section
  let copyright = '';
  const legalLinks = [];

  if (secondSection) {
    // Find copyright text - first paragraph that's not a button container
    const copyrightP = secondSection.querySelector('p:not(.button-container)');
    if (copyrightP) {
      copyright = copyrightP.textContent.trim();
    }

    // Extract legal links from buttons
    const legalButtons = secondSection.querySelectorAll('.button-container a');
    legalButtons.forEach((button) => {
      const title = button.getAttribute('title') || button.textContent.trim();
      const href = button.getAttribute('href');
      legalLinks.push(`<a href="${href}">${title}</a>`);
    });
  }

  // Fallback if copyright not found
  if (!copyright) {
    copyright = '2025 CPP Investments | All Rights Reserved';
  }

  return {
    logo,
    newsletterTitle,
    newsletterDescription,
    subscribeButton,
    navigationLinks,
    copyright,
    legalLinks,
  };
}

/**
 * Clean up AEM button classes from footer elements
 * @param {Element} footer The footer element
 */
function cleanupButtonClasses(footer) {
  // Remove button-container and button classes
  const buttonContainers = footer.querySelectorAll('.button-container');
  buttonContainers.forEach((container) => {
    container.classList.remove('button-container');
  });

  const buttons = footer.querySelectorAll('.button');
  buttons.forEach((button) => {
    button.classList.remove('button');
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Clear existing content
  block.textContent = '';

  // Extract content from fragment
  const extractedContent = extractFooterContent(fragment);

  // Create footer HTML using extracted content
  const footerHTML = `
    <div class="footer-content">
      <!-- Left Section: Newsletter Signup -->
      <div class="footer-left">
        <div class="footer-logo">
          ${extractedContent.logo}
        </div>
        <div class="footer-newsletter">
          <h3>${extractedContent.newsletterTitle}</h3>
          <p>${extractedContent.newsletterDescription}</p>
          ${extractedContent.subscribeButton}
        </div>
      </div>

      <!-- Center Divider -->
      <div class="footer-divider"></div>

      <!-- Right Section: Navigation Links -->
      <div class="footer-right">
        <div class="footer-nav">
          ${extractedContent.navigationLinks.join('')}
        </div>
        <div class="footer-social">
          <a href="#" aria-label="LinkedIn">
            <span class="icon icon-linkedin">
              <img data-icon-name="linkedin" src="/icons/linkedin.svg" alt="" loading="lazy" width="24" height="24">
            </span>
          </a>
          <a href="#" aria-label="Twitter">
            <span class="icon icon-twitter">
              <img data-icon-name="twitter" src="/icons/twitter.svg" alt="" loading="lazy" width="24" height="24">
            </span>
          </a>
          <a href="#" aria-label="YouTube">
            <span class="icon icon-youtube">
              <img data-icon-name="youtube" src="/icons/youtube.svg" alt="" loading="lazy" width="24" height="24">
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="footer-copyright">
          <p>${extractedContent.copyright}</p>
        </div>
        <div class="footer-legal">
          ${extractedContent.legalLinks.join('')}
        </div>
      </div>
    </div>
  `;

  // Create footer container and set innerHTML
  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.innerHTML = footerHTML;

  // Clean up AEM button classes
  cleanupButtonClasses(footer);

  // Append to block
  block.append(footer);
}
