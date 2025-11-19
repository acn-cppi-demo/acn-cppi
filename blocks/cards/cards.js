import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
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
    moveInstrumentation(img, optimizedPic.querySelector('img'));
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

        // Create icon div
        const iconDiv = document.createElement('div');
        iconDiv.className = 'card-icon';

        if (picture) {
          // Move the picture element to icon div (don't clone, move it)
          iconDiv.appendChild(picture);
        }

        // Insert icon div as the first element in li
        li.insertBefore(iconDiv, li.firstChild);

        // Remove the image div if it's now empty
        if (imageDiv && imageDiv.children.length === 0) {
          imageDiv.remove();
        }

        // Remove the "Icon" paragraph from body
        firstP.remove();
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
          // Create combined link HTML using template literal
          const linkHtml = `
            <p>
              <a href="${linkHref}"
                 title="${linkTitle}"
                 class="cards-link link-primary">
                ${linkLabelText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  });

  block.textContent = '';
  block.append(ul);
}
