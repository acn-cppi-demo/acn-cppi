/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Loads a fragment with optional sessionStorage caching.
 * @param {string} path The path to the fragment
 * @param {boolean} [useCache=false] Whether to use sessionStorage cache
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path, useCache = false) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');

    const cacheKey = `fragment_${path}`;
    const cacheTimestampKey = `fragment_timestamp_${path}`;

    // Check cache first if enabled
    if (useCache && typeof sessionStorage !== 'undefined') {
      try {
        const cachedHTML = sessionStorage.getItem(cacheKey);
        const cachedTimestamp = sessionStorage.getItem(cacheTimestampKey);
        const now = Date.now();
        // Cache valid for 1 hour (3600000 ms) - can be adjusted
        const cacheMaxAge = 3600000;

        if (cachedHTML && cachedTimestamp) {
          const age = now - parseInt(cachedTimestamp, 10);
          if (age < cacheMaxAge) {
            // Use cached version
            const main = document.createElement('main');
            main.innerHTML = cachedHTML;

            // reset base path for media to fragment base
            const resetAttributeBase = (tag, attr) => {
              main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
                elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
              });
            };
            resetAttributeBase('img', 'src');
            resetAttributeBase('source', 'srcset');

            decorateMain(main);
            await loadSections(main);
            return main;
          }
          // Cache expired, remove it
          sessionStorage.removeItem(cacheKey);
          sessionStorage.removeItem(cacheTimestampKey);
        }
      } catch (error) {
        // If sessionStorage fails (quota exceeded, etc.), continue with fetch
        // eslint-disable-next-line no-console
        console.warn('Failed to read from sessionStorage cache:', error);
      }
    }

    // Fetch from API
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const html = await resp.text();
      const main = document.createElement('main');
      main.innerHTML = html;

      // Store in cache if enabled
      if (useCache && typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.setItem(cacheKey, html);
          sessionStorage.setItem(cacheTimestampKey, Date.now().toString());
        } catch (error) {
          // If sessionStorage fails (quota exceeded, etc.), continue without caching
          // eslint-disable-next-line no-console
          console.warn('Failed to store in sessionStorage cache:', error);
        }
      }

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
}
