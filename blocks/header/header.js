import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Parses megamenu data from HTML structure
 * Extracts headings with brackets () and their submenu links []
 * @param {Element} navSections The nav sections element
 * @returns {Object} Parsed megamenu data
 */
function parseMegamenuData(navSections) {
  const megamenuData = {
    menuItems: [],
    quickLinks: [],
  };

  if (!navSections) return megamenuData;

  const contentWrapper = navSections.querySelector('.default-content-wrapper');
  if (!contentWrapper) return megamenuData;

  let currentHeading = null;
  let quickLinksStart = false;

  // Iterate through all child nodes
  Array.from(contentWrapper.childNodes).forEach((node) => {
    // Skip empty text nodes
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
      return;
    }

    // Check for H2 headings with brackets
    if (node.tagName === 'H2') {
      const text = node.textContent || '';
      // Extract text inside brackets (e.g., "(The Fund" -> "The Fund")
      const match = text.match(/\(([^)]+)/);
      if (match) {
        const headingText = match[1].trim();
        // Remove arrow_forward if present in id
        const headingId = node.id || '';
        const cleanHeadingId = headingId.replace('-arrow_forward', '');

        currentHeading = {
          title: headingText,
          id: cleanHeadingId,
          links: [],
        };
        megamenuData.menuItems.push(currentHeading);
      }
      return;
    }

    // Check for P tags with Quick Links
    if (node.tagName === 'P') {
      const text = node.textContent || '';
      if (text.includes('{ Quick Links') || quickLinksStart) {
        quickLinksStart = true;
        // Skip the opening brace P tag
        if (text.trim() === '{ Quick Links' || text.includes('{ Quick Links')) {
          // Check if this is the closing brace
          if (text.includes('}')) {
            quickLinksStart = false;
          }
          return;
        }
        // Extract links from this P tag
        // Get full text content and extract items between brackets
        const pText = node.textContent.trim();
        const bracketMatch = pText.match(/\[(.+?)\]/);

        if (bracketMatch) {
          let linkText = bracketMatch[1].trim();
          // Remove HTML entities like &nbsp;
          linkText = linkText.replace(/&nbsp;/g, ' ').trim();

          // Find the anchor tag in this P
          const link = node.querySelector('a');
          if (link) {
            const linkHref = link.href || link.getAttribute('href') || '#';
            const linkTitle = link.getAttribute('title');

            // If link has text inside, use it; otherwise use the extracted text
            const linkInnerText = link.textContent.trim().replace(/[[\]]/g, '').trim();
            // Remove icon spans from the text
            const cleanText = linkText.replace(linkInnerText, '').trim() || linkInnerText;

            // Final text: prefer extracted bracket text, fallback to link text
            const finalText = cleanText || linkText;

            megamenuData.quickLinks.push({
              text: finalText,
              href: linkHref,
              title: linkTitle || finalText,
            });
          }
        }
        // Check if this is the closing brace
        if (text.includes('}')) {
          quickLinksStart = false;
        }
        return;
      }

      // Check for links after headings (submenu items)
      if (currentHeading) {
        const links = node.querySelectorAll('a');
        links.forEach((link) => {
          const linkText = link.textContent.trim().replace(/[[\]]/g, '').trim();
          const linkHref = link.href || link.getAttribute('href') || '#';
          const linkTitle = link.getAttribute('title') || linkText;

          // Only add if it's a valid link (not empty)
          if (linkText && linkText !== '') {
            currentHeading.links.push({
              text: linkText,
              href: linkHref,
              title: linkTitle,
            });
          }
        });
      }
    }
  });

  return megamenuData;
}

/**
 * Builds megamenu HTML as a single template string
 * @param {Object} megamenuData Parsed megamenu data
 * @returns {string} Megamenu HTML string
 */
function buildMegamenuHTML(megamenuData) {
  // Build desktop headings list HTML
  let headingsListHTML = '';
  let subLinksPanelsHTML = '';

  if (megamenuData.menuItems.length > 0) {
    megamenuData.menuItems.forEach((menuItem, index) => {
      // Heading item HTML
      headingsListHTML += `
      <li class="megamenu-heading-item">
        <button type="button" class="megamenu-heading-button" data-menu-index="${index}">
          <h2 class="megamenu-heading-title">${menuItem.title}</h2>
          <span class="icon icon-arrow_forward">
            <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16">
          </span>
        </button>
      </li>`;

      // Sub-links panel HTML
      if (menuItem.links.length > 0) {
        let subLinksHTML = '';
        menuItem.links.forEach((link) => {
          subLinksHTML += `
          <li>
            <a href="${link.href}" title="${link.title || link.text}">${link.text}</a>
          </li>`;
        });

        subLinksPanelsHTML += `
      <div class="megamenu-sublinks-panel" data-menu-index="${index}" style="display: none;">
        <h3 class="megamenu-sublinks-title">${menuItem.title}</h3>
        <ul class="megamenu-sublinks-list">${subLinksHTML}
        </ul>
      </div>`;
      }
    });
  }

  // Build Quick Links HTML
  let quickLinksHTML = '';
  if (megamenuData.quickLinks.length > 0) {
    megamenuData.quickLinks.forEach((link) => {
      quickLinksHTML += `
          <li>
            <a href="${link.href}" title="${link.title || link.text}">
              ${link.text}
              <span class="icon icon-arrow_forward">
                <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16">
              </span>
            </a>
          </li>`;
    });
  }

  // Build mobile accordion HTML
  let mobileAccordionHTML = '';
  if (megamenuData.menuItems.length > 0) {
    megamenuData.menuItems.forEach((menuItem) => {
      let mobileLinksHTML = '';
      if (menuItem.links.length > 0) {
        menuItem.links.forEach((link) => {
          mobileLinksHTML += `
            <li>
              <a href="${link.href}" title="${link.title || link.text}">${link.text}</a>
            </li>`;
        });
      }

      mobileAccordionHTML += `
      <details class="megamenu-accordion-item">
        <summary class="megamenu-accordion-summary">${menuItem.title}</summary>
        <div class="megamenu-accordion-body">
          <ul class="megamenu-mobile-links">${mobileLinksHTML}
          </ul>
        </div>
      </details>`;
    });
  }

  // Build mobile Quick Links HTML
  let mobileQuickLinksHTML = '';
  if (megamenuData.quickLinks.length > 0) {
    megamenuData.quickLinks.forEach((link) => {
      mobileQuickLinksHTML += `
          <li>
            <a href="${link.href}" title="${link.title || link.text}">
              ${link.text}
              <span class="icon icon-arrow_forward">
                <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16">
              </span>
            </a>
          </li>`;
    });
  }

  // Complete megamenu HTML template - easy to modify!
  const megamenuHTML = `
<div class="megamenu" aria-hidden="true">
  <!-- Desktop Megamenu -->
  <div class="megamenu-desktop">
    <div class="megamenu-desktop-content">
      <!-- Left Sidebar -->
      <div class="megamenu-desktop-left">
        <ul class="megamenu-headings-list">${headingsListHTML}
        </ul>
        ${megamenuData.quickLinks.length > 0 ? `
        <div class="megamenu-quick-links-separator"></div>
        <div class="megamenu-quick-links">
          <h3 class="megamenu-quick-links-title">Quick Links</h3>
          <ul class="megamenu-quick-links-list">${quickLinksHTML}
          </ul>
        </div>` : ''}
      </div>
      <!-- Right Content -->
      <div class="megamenu-desktop-right">${subLinksPanelsHTML}
      </div>
    </div>
  </div>
  <!-- Mobile Megamenu -->
  <div class="megamenu-mobile">
    <div class="megamenu-mobile-content">${mobileAccordionHTML}
      ${megamenuData.quickLinks.length > 0 ? `
      <div class="megamenu-mobile-quick-links">
        <h3 class="megamenu-mobile-quick-links-title">Quick Links</h3>
        <ul class="megamenu-mobile-quick-links-list">${mobileQuickLinksHTML}
        </ul>
      </div>` : ''}
    </div>
  </div>
</div>`;

  return megamenuHTML;
}

/**
 * Builds megamenu DOM structure from HTML string
 * @param {Object} megamenuData Parsed megamenu data
 * @returns {Element} Megamenu element
 */
function buildMegamenu(megamenuData) {
  // Get HTML string from template
  const megamenuHTML = buildMegamenuHTML(megamenuData);

  // Create container and insert HTML
  const container = document.createElement('div');
  container.innerHTML = megamenuHTML.trim();
  const megamenu = container.firstElementChild;

  // Add hover/click handlers for desktop megamenu
  const desktopMegamenu = megamenu.querySelector('.megamenu-desktop');
  if (desktopMegamenu) {
    const headingButtons = desktopMegamenu.querySelectorAll('.megamenu-heading-button');
    const subLinksPanels = desktopMegamenu.querySelectorAll('.megamenu-sublinks-panel');
    const leftSidebarEl = desktopMegamenu.querySelector('.megamenu-desktop-left');
    const rightContentEl = desktopMegamenu.querySelector('.megamenu-desktop-right');
    let hoverTimeout = null;

    const hideAllPanels = () => {
      desktopMegamenu.querySelectorAll('.megamenu-heading-item').forEach((item) => {
        item.classList.remove('active');
      });
      subLinksPanels.forEach((panel) => {
        panel.style.display = 'none';
      });
    };

    const showPanel = (headingItem, targetPanel) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      hideAllPanels();
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
      if (headingItem) {
        headingItem.classList.add('active');
      }
    };

    headingButtons.forEach((button) => {
      const menuIndex = button.getAttribute('data-menu-index');
      const headingItem = button.closest('.megamenu-heading-item');
      const targetPanel = desktopMegamenu.querySelector(`.megamenu-sublinks-panel[data-menu-index="${menuIndex}"]`);

      // Mouseenter handler on heading
      headingItem.addEventListener('mouseenter', () => {
        showPanel(headingItem, targetPanel);
      });

      // Mouseleave handler on heading - hide after delay
      headingItem.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          const isHoveringLeftSidebar = leftSidebarEl && leftSidebarEl.matches(':hover');
          const isHoveringRightContent = rightContentEl && rightContentEl.matches(':hover');
          if (!isHoveringLeftSidebar && !isHoveringRightContent) {
            hideAllPanels();
          }
        }, 200);
      });

      // Mouseenter handler on panel - keep it visible
      if (targetPanel) {
        targetPanel.addEventListener('mouseenter', () => {
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
          }
          showPanel(headingItem, targetPanel);
        });

        targetPanel.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            const isHoveringLeftSidebar = leftSidebarEl && leftSidebarEl.matches(':hover');
            const isHoveringRightContent = rightContentEl && rightContentEl.matches(':hover');
            if (!isHoveringLeftSidebar && !isHoveringRightContent) {
              hideAllPanels();
            }
          }, 200);
        });
      }

      // Click handler for keyboard accessibility
      button.addEventListener('click', () => {
        // Toggle behavior - click to open, click again to close
        const isActive = headingItem.classList.contains('active');
        hideAllPanels();
        if (!isActive && targetPanel) {
          targetPanel.style.display = 'block';
          headingItem.classList.add('active');
        }
      });
    });
  }

  return megamenu;
}

/**
 * Toggles megamenu visibility
 * @param {Element} megamenu The megamenu element
 * @param {Boolean} show Whether to show or hide the megamenu
 */
function toggleMegamenu(megamenu, show) {
  if (!megamenu) return;

  const isCurrentlyHidden = megamenu.getAttribute('aria-hidden') === 'true';
  const shouldShow = show !== undefined ? show : isCurrentlyHidden;

  megamenu.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  document.body.style.overflowY = shouldShow && !isDesktop.matches ? 'hidden' : '';
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Check if fragment loaded successfully
  if (fragment && fragment.firstElementChild) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  }
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // Handle tools section - clean up unwanted button classes and containers
  const navTools = nav.querySelector('.nav-tools');
  const navSections = nav.querySelector('.nav-sections');

  // Parse and build megamenu from nav-tools (where the megamenu HTML is located)
  let megamenu = null;
  if (navTools) {
    const megamenuData = parseMegamenuData(navTools);

    // Clean up nav-tools - remove megamenu HTML, keep only search, language links, and menu icon
    const contentWrapper = navTools.querySelector('.default-content-wrapper');
    if (contentWrapper) {
      // First, collect all nodes to remove
      const nodesToRemove = [];

      // Remove H2 headings with brackets and their associated P tags
      Array.from(contentWrapper.querySelectorAll('h2')).forEach((h2) => {
        const text = h2.textContent || '';
        if (text.includes('(')) {
          nodesToRemove.push(h2);
          // Find and mark following P tags for removal until we hit another H2, Quick Links, or end
          let nextSibling = h2.nextElementSibling;
          while (nextSibling) {
            // Stop if we hit another H2 or Quick Links section
            if (nextSibling.tagName === 'H2' || nextSibling.textContent?.includes('{ Quick Links')) {
              break;
            }
            // Only remove P tags that don't contain search or menu icons
            if (nextSibling.tagName === 'P') {
              const hasSearchIcon = nextSibling.querySelector('.icon-search');
              const hasMenuIcon = nextSibling.querySelector('.icon-menu, [class*="menu"]');
              if (!hasSearchIcon && !hasMenuIcon) {
                nodesToRemove.push(nextSibling);
              } else {
                // Stop if we hit a P tag with icons
                break;
              }
            }
            nextSibling = nextSibling.nextElementSibling;
          }
        }
      });

      // Remove Quick Links P tags (but not those with icons)
      Array.from(contentWrapper.querySelectorAll('p')).forEach((p) => {
        const text = p.textContent || '';
        const hasSearchIcon = p.querySelector('.icon-search');
        const hasMenuIcon = p.querySelector('.icon-menu, [class*="menu"]');

        // Remove if it's Quick Links related and doesn't have icons
        if (!hasSearchIcon && !hasMenuIcon
            && (text.includes('{ Quick Links') || text.includes('}')
                || (text.trim().startsWith('[') && text.includes(']') && !nodesToRemove.includes(p)))) {
          nodesToRemove.push(p);
        }
      });

      // Remove all collected nodes
      nodesToRemove.forEach((node) => {
        if (node.parentNode) {
          node.remove();
        }
      });
    }

    // Build megamenu if we have data
    if (megamenuData.menuItems.length > 0 || megamenuData.quickLinks.length > 0) {
      megamenu = buildMegamenu(megamenuData);
    }

    // Clean up nav-tools - remove button-container and button classes
    if (navTools) {
      // Remove button-container and button classes from tools section
      const buttonContainers = navTools.querySelectorAll('.button-container');
      buttonContainers.forEach((container) => {
        // Move the link out of button-container and remove button class
        const link = container.querySelector('a');
        if (link) {
          link.classList.remove('button');
          // Replace the button-container with just the link
          container.parentNode.replaceChild(link, container);
        }
      });

      // Also remove button class from any remaining links in tools
      const toolLinks = navTools.querySelectorAll('a.button');
      toolLinks.forEach((link) => {
        link.classList.remove('button');
      });

      // Hide any old menu toggle buttons
      const menuToggle = navTools.querySelector('.nav-menu-toggle');
      if (menuToggle) {
        menuToggle.style.display = 'none';
      }

      // Find menu icon/button and add click handler for megamenu
      const menuIcon = navTools.querySelector('.icon-menu, [class*="menu"]');
      if (menuIcon) {
        menuIcon.style.cursor = 'pointer';
        menuIcon.setAttribute('role', 'button');
        menuIcon.setAttribute('tabindex', '0');
        menuIcon.setAttribute('aria-label', 'Toggle menu');
      }
    }
  }

  // Keep existing nav sections functionality for non-megamenu items
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  // Add megamenu after nav
  if (megamenu) {
    navWrapper.appendChild(megamenu);

    // Add click handler to menu button
    const menuIcon = navTools?.querySelector('.icon-menu, [class*="menu"]');
    if (menuIcon) {
      menuIcon.addEventListener('click', () => {
        toggleMegamenu(megamenu);
      });
      menuIcon.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          toggleMegamenu(megamenu);
        }
      });
    }

    // Close megamenu on escape
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && megamenu.getAttribute('aria-hidden') === 'false') {
        toggleMegamenu(megamenu, false);
      }
    });
  }

  block.append(navWrapper);
}
