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

    // Handle link based on last two p tags
    const cardBody = li.querySelector('.cards-card-body');
    if (cardBody) {
      const paragraphs = Array.from(cardBody.querySelectorAll('p'));

      // Check if last paragraph contains an anchor tag
      if (paragraphs.length >= 2) {
        const lastP = paragraphs[paragraphs.length - 1];
        const secondLastP = paragraphs[paragraphs.length - 2];
        const anchor = lastP.querySelector('a[href]');

        if (anchor) {
          // Get link from last paragraph
          const linkHref = anchor.getAttribute('href');
          const linkTitle = anchor.getAttribute('title') || linkHref;

          // Get link label text from second-to-last paragraph
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
    }
  });

  block.textContent = '';
  block.append(ul);
}
