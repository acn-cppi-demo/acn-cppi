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

  // Combine linkLabel and link into a single link with icon
  ul.querySelectorAll('li').forEach((li) => {
    const linkLabelElement = li.querySelector('[data-aue-prop="linkLabel"]');
    const linkElement = li.querySelector('a[href]');
    const linkLabelBody = linkLabelElement?.closest('.cards-card-body');
    const linkBody = linkElement?.closest('.cards-card-body');

    if (linkLabelElement && linkElement) {
      const linkLabelText = linkLabelElement.textContent.trim();
      const linkHref = linkElement.getAttribute('href');
      const linkTitle = linkElement.getAttribute('title') || linkHref;

      // Create combined link HTML using template literal
      const linkHtml = `
        <p>
          <a href="${linkHref}" 
             title="${linkTitle}" 
             class="cards-link">
            ${linkLabelText}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/>
            </svg>
          </a>
        </p>
      `;

      // Replace linkLabel body with new combined link
      if (linkLabelBody) {
        linkLabelBody.innerHTML = linkHtml;
        // Remove the separate link body if it exists
        if (linkBody && linkBody !== linkLabelBody) {
          linkBody.remove();
        }
      } else if (linkBody) {
        // If no linkLabel body, just update the link body
        linkBody.innerHTML = linkHtml;
      }
    }
  });

  block.textContent = '';
  block.append(ul);
}
