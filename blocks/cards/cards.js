import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.setAttribute('role', 'list');
  ul.setAttribute('aria-label', 'Cards');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'article');
    li.setAttribute('aria-label', `Card ${index + 1}`);
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    moveInstrumentation(img, optimizedImg);
    // Ensure alt text is preserved or set to empty for decorative images
    if (!optimizedImg.getAttribute('alt') && !img.alt) {
      optimizedImg.setAttribute('alt', '');
      optimizedImg.setAttribute('aria-hidden', 'true');
    }
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Process each card
  ul.querySelectorAll('li').forEach((li) => {
    // Combine all cards-card-body divs into a single one
    const bodyDivs = Array.from(li.querySelectorAll('.cards-card-body'));
    if (bodyDivs.length > 1) {
      // Create a new single body div
      const singleBody = document.createElement('div');
      singleBody.className = 'cards-card-body';

      // Append all content from existing body divs
      bodyDivs.forEach((bodyDiv) => {
        while (bodyDiv.firstChild) {
          singleBody.appendChild(bodyDiv.firstChild);
        }
      });

      // Replace the first body div with the combined one
      bodyDivs[0].replaceWith(singleBody);

      // Remove the remaining body divs
      bodyDivs.slice(1).forEach((bodyDiv) => {
        if (bodyDiv.parentNode) {
          bodyDiv.remove();
        }
      });
    }

    // Handle icon: if first p is "Icon", create icon div
    const cardBody = li.querySelector('.cards-card-body');
    let iconDiv = li.querySelector('.card-icon');
    if (cardBody) {
      const firstP = cardBody.querySelector('p:first-of-type');
      if (firstP && firstP.textContent.trim().toLowerCase() === 'icon') {
        // Find picture element - check in cards-card-image first, then siblings
        let picture = null;
        const imageDiv = li.querySelector('.cards-card-image');
        if (imageDiv) {
          picture = imageDiv.querySelector('picture');
        }

        // If not found in image div, check next sibling elements
        if (!picture) {
          let nextSibling = firstP.nextElementSibling;
          while (nextSibling && !picture) {
            picture = nextSibling.querySelector('picture') || (nextSibling.tagName === 'PICTURE' ? nextSibling : null);
            if (!picture) {
              nextSibling = nextSibling.nextElementSibling;
            }
          }
        }

        // If not found, check previous sibling
        if (!picture) {
          let prevSibling = firstP.previousElementSibling;
          while (prevSibling && !picture) {
            picture = prevSibling.querySelector('picture') || (prevSibling.tagName === 'PICTURE' ? prevSibling : null);
            if (!picture) {
              prevSibling = prevSibling.previousElementSibling;
            }
          }
        }

        // If still not found, check within the paragraph
        if (!picture) {
          picture = firstP.querySelector('picture');
        }

        // Create icon div if it doesn't exist
        if (!iconDiv) {
          iconDiv = document.createElement('div');
          iconDiv.className = 'card-icon';
          iconDiv.setAttribute('aria-hidden', 'true');
        }

        if (picture) {
          // Move the picture element to icon div (don't clone, move it)
          const pictureImg = picture.querySelector('img');
          if (pictureImg && !pictureImg.getAttribute('alt')) {
            pictureImg.setAttribute('alt', '');
            pictureImg.setAttribute('aria-hidden', 'true');
          }
          iconDiv.appendChild(picture);
        }

        // Insert icon div after image div if it exists, otherwise as first element
        if (imageDiv) {
          if (!iconDiv.parentNode) {
            imageDiv.insertAdjacentElement('afterend', iconDiv);
          }
        } else if (!iconDiv.parentNode) {
          li.insertBefore(iconDiv, li.firstChild);
        }

        // Remove the image div if it's now empty
        if (imageDiv && imageDiv.children.length === 0) {
          imageDiv.remove();
        }

        // Remove the "Icon" paragraph from body
        firstP.remove();
      }
    }

    // Handle icon SVG replacement if card-icon exists
    if (iconDiv && cardBody) {
      const firstP = cardBody.querySelector('p:first-of-type');
      if (firstP) {
        const iconName = firstP.textContent.trim().toLowerCase();
        const iconMap = {
          'moving-arrow': '<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.054 11.4038L0 10.35L5.127 5.223C5.6655 4.691 6.3145 4.42342 7.074 4.42025C7.83367 4.41708 8.48275 4.68467 9.02125 5.223L10.1712 6.373C10.4226 6.62433 10.7193 6.74842 11.0615 6.74525C11.4038 6.74208 11.7007 6.618 11.952 6.373L16.8348 1.5H13.904V0H19.404V5.5H17.904V2.56925L13.0058 7.44225C12.4674 7.97425 11.8168 8.24192 11.054 8.24525C10.2912 8.24842 9.64375 7.984 9.11175 7.452L7.93675 6.277C7.69558 6.03583 7.40292 5.91692 7.05875 5.92025C6.71442 5.92342 6.42175 6.04233 6.18075 6.277L1.054 11.4038Z" fill="white"/></svg>',
          'energy-proragm-icon': '<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.80775 19.25C1.31058 19.25 0.885 19.073 0.531 18.719C0.177 18.365 0 17.9394 0 17.4423V4.05775C0 3.56058 0.177 3.135 0.531 2.781C0.885 2.427 1.31058 2.25 1.80775 2.25H9.75V3.75H1.80775C1.71792 3.75 1.64417 3.77883 1.5865 3.8365C1.52883 3.89417 1.5 3.96792 1.5 4.05775V17.4423C1.5 17.5321 1.52883 17.6058 1.5865 17.6635C1.64417 17.7212 1.71792 17.75 1.80775 17.75H15.1923C15.2821 17.75 15.3558 17.7212 15.4135 17.6635C15.4712 17.6058 15.5 17.5321 15.5 17.4423V11.5H17V17.4423C17 17.9394 16.823 18.365 16.469 18.719C16.115 19.073 15.6894 19.25 15.1923 19.25H1.80775ZM3.8655 15.5H5.36525V9H3.8655V15.5ZM7.75 15.5H9.25V6H7.75V15.5ZM11.6348 15.5H13.1345V12H11.6348V15.5ZM16.5 9.5C15.9872 9.5 15.4891 9.41925 15.0057 9.25775C14.5224 9.09608 14.0724 8.86275 13.6557 8.55775L13.127 9.04225C12.9718 9.18075 12.792 9.25158 12.5875 9.25475C12.383 9.25792 12.2115 9.19033 12.073 9.052C11.9282 8.907 11.8558 8.73133 11.8558 8.525C11.8558 8.31867 11.9282 8.143 12.073 7.998L12.6173 7.4635C12.3443 7.057 12.1314 6.62567 11.9788 6.1695C11.8263 5.71317 11.75 5.24 11.75 4.75C11.75 3.43583 12.2132 2.31567 13.1395 1.3895C14.0657 0.463167 15.1858 0 16.5 0H21.25V4.75C21.25 6.06417 20.7868 7.18433 19.8605 8.1105C18.9343 9.03683 17.8142 9.5 16.5 9.5ZM16.5 8C17.4028 8 18.1702 7.684 18.802 7.052C19.434 6.42017 19.75 5.65283 19.75 4.75V1.5H16.5C15.5972 1.5 14.8298 1.816 14.198 2.448C13.566 3.07983 13.25 3.84717 13.25 4.75C13.25 5.03867 13.2933 5.31633 13.3798 5.583C13.4663 5.8495 13.5737 6.11158 13.702 6.36925L16.523 3.548C16.668 3.40317 16.8437 3.33075 17.05 3.33075C17.2563 3.33075 17.4312 3.4025 17.5748 3.546C17.7313 3.7025 17.8095 3.883 17.8095 4.0875C17.8095 4.292 17.732 4.47183 17.577 4.627L14.7653 7.4385C15.0204 7.61533 15.2964 7.75317 15.5932 7.852C15.8899 7.95067 16.1922 8 16.5 8Z" fill="white"/></svg>',
          thunderstorm: '<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.598 15.5943L10.773 9.39425H6.773L7.498 3.71925L2.873 10.3943H6.348L5.598 15.5943ZM3.625 18.8365L4.625 11.8943H0L8.24025 0H9.471L8.48075 7.89425H13.9805L4.85575 18.8365H3.625Z" fill="white"/></svg>',
        };

        if (iconMap[iconName]) {
          iconDiv.innerHTML = iconMap[iconName];
          // Ensure icon is marked as decorative
          iconDiv.setAttribute('aria-hidden', 'true');
          const svg = iconDiv.querySelector('svg');
          if (svg) {
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
          }
          // Remove the icon name paragraph from body
          firstP.remove();
        }
      }
    }

    // Handle link based on last two p tags
    if (cardBody) {
      // Find all paragraphs in the card body
      const allParagraphs = Array.from(cardBody.querySelectorAll('p'));

      // Find the last two paragraphs that are link-related
      let lastP = null;
      let secondLastP = null;

      // Walk backwards through all paragraphs to find the last two that are link-related
      for (let i = allParagraphs.length - 1; i >= 0; i -= 1) {
        const p = allParagraphs[i];
        const anchor = p.querySelector('a[href]');

        if (anchor && !lastP) {
          lastP = p;
        } else if (lastP && !secondLastP && i < allParagraphs.length - 1) {
          secondLastP = p;
          break;
        }
      }

      // If we found both paragraphs
      if (lastP && secondLastP && lastP.querySelector('a[href]')) {
        const anchor = lastP.querySelector('a[href]');
        const linkHref = anchor.getAttribute('href');
        const linkTitle = anchor.getAttribute('title') || linkHref;
        const linkLabelText = secondLastP.textContent.trim();

        if (linkLabelText && linkHref) {
          // Get card title for better aria-label context
          const cardTitle = cardBody.querySelector('h1, h2, h3, h4, h5, h6');
          const cardTitleText = cardTitle ? cardTitle.textContent.trim() : '';
          const ariaLabel = cardTitleText
            ? `${linkLabelText}, ${cardTitleText}`
            : linkLabelText;

          // Create combined link HTML using template literal
          const linkHtml = `
            <p>
              <a href="${linkHref}"
                 title="${linkTitle}"
                 class="cards-link link-primary"
                 aria-label="${ariaLabel}">
                ${linkLabelText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/>
                </svg>
              </a>
            </p>
          `;

          // Replace the second-to-last paragraph with combined link
          secondLastP.outerHTML = linkHtml;

          // Remove the last paragraph (the one with anchor tag)
          lastP.remove();
        }
      }
    }

    // Ensure correct order: cards-card-image first, then card-icon, then cards-card-body
    const imageDiv = li.querySelector('.cards-card-image');
    if (!iconDiv) {
      iconDiv = li.querySelector('.card-icon');
    }
    const bodyDiv = li.querySelector('.cards-card-body');

    // Add accessibility attributes to image div
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img && !img.getAttribute('alt') && !img.getAttribute('aria-hidden')) {
        // If no alt text, mark as decorative
        img.setAttribute('alt', '');
        img.setAttribute('aria-hidden', 'true');
      }
    }

    // Ensure icon div has aria-hidden if it exists
    if (iconDiv && !iconDiv.getAttribute('aria-hidden')) {
      iconDiv.setAttribute('aria-hidden', 'true');
    }

    // Add proper structure to card body
    if (bodyDiv) {
      // Ensure heading hierarchy is maintained
      const headings = bodyDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length > 0) {
        const firstHeading = headings[0];
        // Set aria-labelledby to link card to its heading
        const headingId = firstHeading.id || `card-heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!firstHeading.id) {
          firstHeading.id = headingId;
        }
        li.setAttribute('aria-labelledby', headingId);
      }
    }

    // Collect elements in correct order
    const orderedElements = [];
    if (imageDiv) orderedElements.push(imageDiv);
    if (iconDiv) orderedElements.push(iconDiv);
    if (bodyDiv) orderedElements.push(bodyDiv);

    // Reorder if needed
    if (orderedElements.length > 1) {
      orderedElements.forEach((el) => {
        li.appendChild(el);
      });
    }
  });

  block.textContent = '';
  block.append(ul);
}
