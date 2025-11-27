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
    quickLinksTitle: null,
  };

  if (!navSections) return megamenuData;

  const contentWrapper = navSections.querySelector('.default-content-wrapper');
  if (!contentWrapper) return megamenuData;

  let currentHeading = null;
  let specialSectionStart = false;
  let lastHeadingBeforeSpecialSection = null;

  // Iterate through all child nodes
  Array.from(contentWrapper.childNodes).forEach((node) => {
    // Skip empty text nodes
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
      return;
    }

    // Check for H2 headings with brackets (menu items)
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
        // Store as potential special section title if it comes before special section
        if (!specialSectionStart) {
          lastHeadingBeforeSpecialSection = node;
        }
      } else if (!specialSectionStart) {
        // H2 without brackets might be special section title
        lastHeadingBeforeSpecialSection = node;
      }
      return;
    }

    // Check for H3 headings that might be special section title
    if ((node.tagName === 'H3' || node.tagName === 'H4') && !specialSectionStart) {
      lastHeadingBeforeSpecialSection = node;
    }

    // Check for P tags with special sections (dynamic - any section starting with {)
    if (node.tagName === 'P') {
      const text = node.textContent || '';
      const trimmedText = text.trim();

      // Check if this is the opening of a special section (starts with {)
      if (trimmedText.startsWith('{') && !specialSectionStart) {
        // Found opening of a special section
        specialSectionStart = true;

        // Extract section name and title from the opening tag
        // Pattern: { SectionName } or { SectionName: Title } or
        // { SectionName (without closing brace)
        let sectionName = '';
        let explicitTitle = null;

        // Try to match with closing brace in same line:
        // { SectionName } or { SectionName: Title }
        const sectionMatchWithBrace = trimmedText.match(/\{\s*([^:}]+)(?::\s*(.+?))?\s*\}/);
        if (sectionMatchWithBrace) {
          sectionName = sectionMatchWithBrace[1].trim();
          if (sectionMatchWithBrace[2]) {
            explicitTitle = sectionMatchWithBrace[2].trim();
          }
        } else {
          // Match without closing brace: { SectionName or { SectionName: Title
          const sectionMatchWithoutBrace = trimmedText.match(/\{\s*([^:]+)(?::\s*(.+?))?\s*$/);
          if (sectionMatchWithoutBrace) {
            sectionName = sectionMatchWithoutBrace[1].trim();
            if (sectionMatchWithoutBrace[2]) {
              explicitTitle = sectionMatchWithoutBrace[2].trim();
            }
          }
        }

        // Set the title based on priority
        if (explicitTitle) {
          megamenuData.quickLinksTitle = explicitTitle;
        } else if (lastHeadingBeforeSpecialSection) {
          // Use the heading before the section if available
          const headingText = lastHeadingBeforeSpecialSection.textContent.trim();
          // Only use if it's not a menu item heading (doesn't have brackets)
          if (!headingText.includes('(')) {
            megamenuData.quickLinksTitle = headingText;
          } else {
            // Fallback to section name if heading is a menu item
            megamenuData.quickLinksTitle = sectionName;
          }
        } else {
          // Use section name as title if no heading before it
          megamenuData.quickLinksTitle = sectionName;
        }

        // If closing brace is in same tag, continue to process links in this tag
        if (trimmedText.includes('}')) {
          // Section closes in same tag, but continue processing this tag for links
          // Don't return yet - process links below
        } else {
          // Opening tag only, return to skip this tag (no links in opening tag)
          return;
        }
      }

      // If we're inside a special section, extract links
      if (specialSectionStart) {
        // Extract links from this P tag
        // Get full text content and extract items between brackets
        const pText = node.textContent.trim();
        const bracketMatch = pText.match(/\[(.+?)\]/);

        if (bracketMatch) {
          let linkText = bracketMatch[1].trim();
          // Remove HTML entities like &nbsp;
          linkText = linkText.replace(/&nbsp;/g, ' ').trim();
          // Remove :arrow_forward: or similar icon markers
          linkText = linkText.replace(/:\s*arrow_forward\s*:?/gi, '').trim();

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

        // Check if this is the closing brace (ends the section)
        // Closing brace can be in opening tag (if { } in same tag) or standalone
        if (trimmedText.includes('}')) {
          specialSectionStart = false;
        }

        // If we're in a special section, don't process as regular menu item link
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
        <a href="#" class="megamenu-heading-button" data-menu-index="${index}">
          <h2 class="megamenu-heading-title">${menuItem.title}</h2>
          <span class="icon icon-arrow_forward">
            <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16">
          </span>
        </a>
      </li>`;

      // Sub-links panel HTML
      if (menuItem.links.length > 0) {
        let subLinksHTML = '';
        menuItem.links.forEach((link) => {
          subLinksHTML += `
          <li>
            <a href="${link.href}" title="${link.title || link.text}">
              ${link.text}
              <span class="icon icon-arrow_forward">
                <img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16">
              </span>
            </a>
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
        <summary class="megamenu-accordion-summary">
          ${menuItem.title}
          <span class="megamenu-accordion-arrow">
            <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.40375 4.40375L0 0H8.8075L4.40375 4.40375Z" fill="#0273CF"/>
            </svg>
          </span>
        </summary>
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
        <div class="megamenu-quick-links">
          <p class="megamenu-quick-links-title">${megamenuData.quickLinksTitle || 'Quick Links'}</h3>
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
        <h3 class="megamenu-mobile-quick-links-title">${megamenuData.quickLinksTitle || 'Quick Links'}</h3>
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
 * Opens the first megamenu panel by default (desktop only)
 * @param {Element} megamenu The megamenu element
 */
function openFirstMegamenuPanel(megamenu) {
  if (!megamenu || !isDesktop.matches) return;

  const desktopMegamenu = megamenu.querySelector('.megamenu-desktop');
  if (!desktopMegamenu) return;

  // Check if any panel is already active
  const hasActivePanel = desktopMegamenu.querySelector('.megamenu-heading-item.active');
  if (hasActivePanel) return;

  // Open the first panel
  const firstHeadingItem = desktopMegamenu.querySelector('.megamenu-heading-item');
  const firstPanel = desktopMegamenu.querySelector('.megamenu-sublinks-panel[data-menu-index="0"]');
  if (firstHeadingItem && firstPanel) {
    firstPanel.style.display = 'block';
    firstHeadingItem.classList.add('active');
  }
}

/**
 * Updates menu icon and text based on megamenu state
 * @param {Element} menuIcon The menu icon element
 * @param {Boolean} isOpen Whether megamenu is open
 */
function updateMenuIcon(menuIcon, isOpen) {
  if (!menuIcon) return;

  const closeSvg = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.05375 13.3075L0 12.2538L5.6 6.65375L0 1.05375L1.05375 0L6.65375 5.6L12.2537 0L13.3075 1.05375L7.7075 6.65375L13.3075 12.2538L12.2537 13.3075L6.65375 7.7075L1.05375 13.3075Z" fill="#0273CF"/>
</svg>
`;

  if (isOpen) {
    // Store original content if not already stored
    if (!menuIcon.dataset.originalContent) {
      menuIcon.dataset.originalContent = menuIcon.innerHTML;
    }
    // Update to close icon and text
    menuIcon.innerHTML = `<span class="menu-close-text">Close</span>${closeSvg}`;
    menuIcon.setAttribute('aria-label', 'Close menu');
  } else {
    // Restore original content
    if (menuIcon.dataset.originalContent) {
      menuIcon.innerHTML = menuIcon.dataset.originalContent;
    }
    menuIcon.setAttribute('aria-label', 'Toggle menu');
  }
}

/**
 * Toggles megamenu visibility
 * @param {Element} megamenu The megamenu element
 * @param {Boolean} show Whether to show or hide the megamenu
 * @param {Element} menuIcon Optional menu icon element to update
 */
function toggleMegamenu(megamenu, show, menuIcon = null) {
  if (!megamenu) return;

  const isCurrentlyHidden = megamenu.getAttribute('aria-hidden') === 'true';
  const shouldShow = show !== undefined ? show : isCurrentlyHidden;

  megamenu.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  document.body.style.overflowY = shouldShow && !isDesktop.matches ? 'hidden' : '';

  // Update menu icon if provided
  if (menuIcon) {
    updateMenuIcon(menuIcon, shouldShow);
  }

  // Open first panel by default when megamenu is shown (desktop only)
  if (shouldShow) {
    openFirstMegamenuPanel(megamenu);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment with sessionStorage caching enabled
  // Cache persists for browser tab session and clears when tab is closed
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath, true); // Enable caching for header

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
  if (navBrand) {
    // Find the brand link - could be .button or a direct link
    let brandLink = navBrand.querySelector('.button');
    if (!brandLink) {
      brandLink = navBrand.querySelector('a');
    }

    // If no link exists, wrap the content (picture) in a link
    if (!brandLink) {
      const contentWrapper = navBrand.querySelector('.default-content-wrapper');
      if (contentWrapper) {
        // Create a new link element
        brandLink = document.createElement('a');
        brandLink.href = '/';
        brandLink.setAttribute('aria-label', 'Home');
        // Move all content from wrapper into the link
        while (contentWrapper.firstChild) {
          brandLink.appendChild(contentWrapper.firstChild);
        }
        // Replace wrapper with link
        contentWrapper.parentNode.replaceChild(brandLink, contentWrapper);
      }
    }

    if (brandLink) {
      // Remove button class but keep it as a clickable link
      brandLink.classList.remove('button');
      // Remove button-container wrapper if it exists, but preserve the link
      const buttonContainer = brandLink.closest('.button-container');
      if (buttonContainer && buttonContainer.parentNode) {
        // Move the link out of button-container
        buttonContainer.parentNode.insertBefore(brandLink, buttonContainer);
        buttonContainer.remove();
      }
      // Ensure the link is clickable
      brandLink.style.pointerEvents = 'auto';
      brandLink.style.cursor = 'pointer';
    }

    // Optimize header logo images with high fetch priority (above the fold)
    const brandImages = navBrand.querySelectorAll('img, picture img');
    brandImages.forEach((img) => {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    });
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
          // Find and mark following P tags for removal until we hit another H2,
          // special section, or end
          let nextSibling = h2.nextElementSibling;
          while (nextSibling) {
            // Stop if we hit another H2 or special section (starts with {)
            const nextText = nextSibling.textContent || '';
            const isSpecialSection = nextText.trim().startsWith('{');
            if (nextSibling.tagName === 'H2' || isSpecialSection) {
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

      // Remove special section P tags (any section starting with {) but not those with icons
      Array.from(contentWrapper.querySelectorAll('p')).forEach((p) => {
        const text = p.textContent || '';
        const hasSearchIcon = p.querySelector('.icon-search');
        const hasMenuIcon = p.querySelector('.icon-menu, [class*="menu"]');

        // Remove if it's part of a special section (starts with { or contains })
        // and doesn't have icons
        const startsWithBrace = text.trim().startsWith('{');
        const hasClosingBrace = text.includes('}') && !nodesToRemove.includes(p);
        const hasBrackets = text.trim().startsWith('[') && text.includes(']') && !nodesToRemove.includes(p);
        if (!hasSearchIcon && !hasMenuIcon && (startsWithBrace || hasClosingBrace || hasBrackets)) {
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

    // Open first megamenu panel by default on page load (desktop only)
    openFirstMegamenuPanel(megamenu);

    // Mobile accordion: close other accordions when one is opened
    const mobileAccordionItems = megamenu.querySelectorAll('.megamenu-accordion-item');
    mobileAccordionItems.forEach((accordion) => {
      accordion.addEventListener('toggle', () => {
        if (accordion.open) {
          // Close all other accordions
          mobileAccordionItems.forEach((otherAccordion) => {
            if (otherAccordion !== accordion && otherAccordion.open) {
              otherAccordion.open = false;
            }
          });
        }
      });
    });

    // Add click handler to menu button
    const menuIcon = navTools?.querySelector('.icon-menu, [class*="menu"]');
    if (menuIcon) {
      menuIcon.addEventListener('click', () => {
        toggleMegamenu(megamenu, undefined, menuIcon);
      });
      menuIcon.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          toggleMegamenu(megamenu, undefined, menuIcon);
        }
      });
    }

    // Close megamenu on escape
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && megamenu.getAttribute('aria-hidden') === 'false') {
        toggleMegamenu(megamenu, false, menuIcon);
      }
    });
  }

  block.append(navWrapper);
}
