import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.setAttribute('role', 'list');
  ul.setAttribute('aria-label', 'Card list');
  const totalCards = block.children.length;
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'article');
    li.setAttribute('aria-label', `Card ${index + 1} of ${totalCards}`);
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
    } else if (img.alt) {
      // Preserve existing alt text
      optimizedImg.setAttribute('alt', img.alt);
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
          'dollar-sign': '<svg width="9" height="18" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64225 17.5V15.4078C2.77175 15.2526 2.02208 14.9125 1.39325 14.3875C0.764416 13.8625 0.3 13.1283 0 12.1848L1.3885 11.6077C1.65767 12.3821 2.04125 12.9744 2.53925 13.3848C3.03742 13.7949 3.7025 14 4.5345 14C5.25633 14 5.89325 13.8283 6.44525 13.4848C6.99708 13.1411 7.273 12.5962 7.273 11.85C7.273 11.2025 7.06567 10.6855 6.651 10.299C6.23617 9.9125 5.37817 9.509 4.077 9.0885C2.71417 8.65767 1.76767 8.15383 1.2375 7.577C0.707333 7 0.44225 6.27433 0.44225 5.4C0.44225 4.39367 0.7955 3.60167 1.502 3.024C2.20833 2.4465 2.92175 2.12567 3.64225 2.0615V0H5.14225V2.0615C5.90508 2.16283 6.54608 2.41092 7.06525 2.80575C7.58458 3.20058 7.98842 3.71408 8.27675 4.34625L6.90775 4.973C6.68842 4.491 6.38258 4.11667 5.99025 3.85C5.59808 3.58333 5.08208 3.45 4.44225 3.45C3.68975 3.45 3.08492 3.63333 2.62775 4C2.17075 4.36667 1.94225 4.83333 1.94225 5.4C1.94225 5.982 2.17625 6.44742 2.64425 6.79625C3.11208 7.14492 3.98192 7.51025 5.25375 7.89225C6.43575 8.25125 7.31783 8.76283 7.9 9.427C8.482 10.091 8.773 10.8884 8.773 11.8193C8.773 12.9128 8.42142 13.7614 7.71825 14.3652C7.01508 14.9692 6.15642 15.327 5.14225 15.4385V17.5H3.64225Z" fill="white"/></svg>',
          chart: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.80775 17.5C1.30258 17.5 0.875 17.325 0.525 16.975C0.175 16.625 0 16.1974 0 15.6923V0H1.5V15.6923C1.5 15.7692 1.53208 15.8398 1.59625 15.9038C1.66025 15.9679 1.73075 16 1.80775 16H17.5V17.5H1.80775ZM3.44225 14.25V6.09625H6.44225V14.25H3.44225ZM8.19225 14.25V1.09625H11.1923V14.25H8.19225ZM12.9423 14.25V10.0963H15.9423V14.25H12.9423Z" fill="white"/></svg>',
          user: '<svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.75 6.95C12.1755 6.48717 12.4902 5.95575 12.6943 5.35575C12.8981 4.75575 13 4.13717 13 3.5C13 2.86283 12.8981 2.24425 12.6943 1.64425C12.4902 1.04425 12.1755 0.512833 11.75 0.05C12.6282 0.151333 13.3573 0.5305 13.9375 1.1875C14.5175 1.84467 14.8075 2.6155 14.8075 3.5C14.8075 4.38467 14.5175 5.1555 13.9375 5.8125C13.3573 6.4695 12.6282 6.84867 11.75 6.95ZM17 14.6155V12.2692C17 11.7241 16.8891 11.2054 16.6672 10.7133C16.4454 10.2211 16.1307 9.79875 15.723 9.44625C16.4897 9.70142 17.1954 10.0457 17.8403 10.479C18.4851 10.9123 18.8075 11.5091 18.8075 12.2692V14.6155H17ZM18.8075 8.05775V6.05775H16.8075V4.55775H18.8075V2.55775H20.3075V4.55775H22.3075V6.05775H20.3075V8.05775H18.8075ZM7.5 7C6.5375 7 5.7135 6.65733 5.028 5.972C4.34267 5.2865 4 4.4625 4 3.5C4 2.5375 4.34267 1.71358 5.028 1.02825C5.7135 0.34275 6.5375 0 7.5 0C8.4625 0 9.28642 0.34275 9.97175 1.02825C10.6573 1.71358 11 2.5375 11 3.5C11 4.4625 10.6573 5.2865 9.97175 5.972C9.28642 6.65733 8.4625 7 7.5 7ZM0 14.6155V12.3923C0 11.9026 0.133 11.4491 0.399 11.0317C0.665 10.6144 1.02042 10.2936 1.46525 10.0693C2.45375 9.58475 3.45092 9.22133 4.45675 8.979C5.46242 8.73667 6.47683 8.6155 7.5 8.6155C8.523 8.6155 9.53742 8.73667 10.5433 8.979C11.5489 9.22133 12.546 9.58475 13.5345 10.0693C13.9793 10.2936 14.3348 10.6144 14.6008 11.0317C14.8669 11.4491 15 11.9026 15 12.3923V14.6155H0ZM7.5 5.5C8.05 5.5 8.52083 5.30417 8.9125 4.9125C9.30417 4.52083 9.5 4.05 9.5 3.5C9.5 2.95 9.30417 2.47917 8.9125 2.0875C8.52083 1.69583 8.05 1.5 7.5 1.5C6.95 1.5 6.47917 1.69583 6.0875 2.0875C5.69583 2.47917 5.5 2.95 5.5 3.5C5.5 4.05 5.69583 4.52083 6.0875 4.9125C6.47917 5.30417 6.95 5.5 7.5 5.5ZM1.5 13.1155H13.5V12.3923C13.5 12.1898 13.4413 12.0023 13.324 11.8298C13.2067 11.6574 13.0473 11.5168 12.846 11.4078C11.9845 10.9834 11.1061 10.6619 10.2107 10.4433C9.31525 10.2248 8.41167 10.1155 7.5 10.1155C6.58817 10.1155 5.68458 10.2248 4.78925 10.4433C3.89375 10.6619 3.01525 10.9834 2.15375 11.4078C1.95242 11.5168 1.79317 11.6574 1.676 11.8298C1.55867 12.0023 1.5 12.1898 1.5 12.3923V13.1155Z" fill="white"/></svg>',
          bag: '<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 12.25C9.98583 12.25 10.399 12.0798 10.7395 11.7395C11.0798 11.399 11.25 10.9858 11.25 10.5C11.25 10.0142 11.0798 9.601 10.7395 9.2605C10.399 8.92017 9.98583 8.75 9.5 8.75C9.01417 8.75 8.601 8.92017 8.2605 9.2605C7.92017 9.601 7.75 10.0142 7.75 10.5C7.75 10.9858 7.92017 11.399 8.2605 11.7395C8.601 12.0798 9.01417 12.25 9.5 12.25ZM1.80775 17.5C1.30258 17.5 0.875 17.325 0.525 16.975C0.175 16.625 0 16.1974 0 15.6923V5.30775C0 4.80258 0.175 4.375 0.525 4.025C0.875 3.675 1.30258 3.5 1.80775 3.5H6V1.80775C6 1.30258 6.175 0.875 6.525 0.525C6.875 0.175 7.30258 0 7.80775 0H11.1923C11.6974 0 12.125 0.175 12.475 0.525C12.825 0.875 13 1.30258 13 1.80775V3.5H17.1923C17.6974 3.5 18.125 3.675 18.475 4.025C18.825 4.375 19 4.80258 19 5.30775V15.6923C19 16.1974 18.825 16.625 18.475 16.975C18.125 17.325 17.6974 17.5 17.1923 17.5H1.80775ZM1.80775 16H17.1923C17.2693 16 17.3398 15.9679 17.4038 15.9038C17.4679 15.8398 17.5 15.7692 17.5 15.6923V5.30775C17.5 5.23075 17.4679 5.16025 17.4038 5.09625C17.3398 5.03208 17.2693 5 17.1923 5H1.80775C1.73075 5 1.66025 5.03208 1.59625 5.09625C1.53208 5.16025 1.5 5.23075 1.5 5.30775V15.6923C1.5 15.7692 1.53208 15.8398 1.59625 15.9038C1.66025 15.9679 1.73075 16 1.80775 16ZM7.5 3.5H11.5V1.80775C11.5 1.73075 11.4679 1.66025 11.4038 1.59625C11.3398 1.53208 11.2692 1.5 11.1923 1.5H7.80775C7.73075 1.5 7.66025 1.53208 7.59625 1.59625C7.53208 1.66025 7.5 1.73075 7.5 1.80775V3.5Z" fill="white"/></svg>',
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
        // Update aria-label to be more descriptive with heading text
        const headingText = firstHeading.textContent.trim();
        li.setAttribute('aria-label', headingText);

        // Find description paragraph and link it with aria-describedby
        const paragraphs = bodyDiv.querySelectorAll('p');
        const descriptionParagraphs = Array.from(paragraphs).filter((p) => {
          const link = p.querySelector('a');
          return !link && p.textContent.trim() && p.textContent.trim().length > 20;
        });

        if (descriptionParagraphs.length > 0) {
          const firstDesc = descriptionParagraphs[0];
          const descId = firstDesc.id || `card-desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          if (!firstDesc.id) {
            firstDesc.id = descId;
          }
          li.setAttribute('aria-describedby', descId);
        }
      } else {
        // If no heading, try to use first paragraph as label
        const firstParagraph = bodyDiv.querySelector('p');
        if (firstParagraph && firstParagraph.textContent.trim()) {
          const paraText = firstParagraph.textContent.trim().substring(0, 50);
          li.setAttribute('aria-label', paraText);
        }
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
