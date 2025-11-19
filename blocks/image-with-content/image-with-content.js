import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const contentData = {
    image: null,
    date: null,
    title: null,
    description: null,
    linkLabel: null,
    link: null,
  };

  // Get all direct child divs
  const children = Array.from(block.children);
  let currentIndex = 0;

  // Optimize images first
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '2000', media: '(min-width: 600px)' },
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Extract image (first div with picture)
  if (children[currentIndex]) {
    const picture = children[currentIndex].querySelector('picture');
    if (picture) {
      contentData.image = picture.outerHTML;
      currentIndex += 1;
    }
  }

  // Extract date (second div with paragraph)
  if (children[currentIndex]) {
    const dateText = children[currentIndex].textContent.trim();
    if (dateText) {
      contentData.date = dateText;
      currentIndex += 1;
    }
  }

  // Extract title and description (third div with h4 and p)
  if (children[currentIndex]) {
    const titleElement = children[currentIndex].querySelector('h4');
    const descElement = children[currentIndex].querySelector('p');
    if (titleElement) {
      contentData.title = titleElement.outerHTML;
    }
    if (descElement) {
      // Preserve HTML in description
      let descHtml = descElement.innerHTML.trim();
      // Decode escaped HTML entities
      descHtml = descHtml.replace(/&lt;br\/&gt;/g, '<br/>');
      contentData.description = `<p>${descHtml}</p>`;
    }
    currentIndex += 1;
  }

  // Extract link label (fourth div with "Read more")
  if (children[currentIndex]) {
    const linkLabelText = children[currentIndex].textContent.trim();
    if (linkLabelText) {
      contentData.linkLabel = linkLabelText;
      currentIndex += 1;
    }
  }

  // Extract link URL (fifth div with anchor)
  if (children[currentIndex]) {
    const anchor = children[currentIndex].querySelector('a[href]');
    if (anchor) {
      contentData.link = {
        href: anchor.getAttribute('href'),
        title: anchor.getAttribute('title') || anchor.getAttribute('href'),
      };
    }
  }

  // Generate unique IDs for accessibility
  const titleId = `image-content-title-${Date.now()}`;
  const descriptionId = `image-content-description-${Date.now()}`;

  // Calendar icon SVG
  const calendarIcon = `
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M1.80775 19.1152C1.30258 19.1152 0.875 18.9403 0.525 18.5903C0.175 18.2402 0 17.8127 0 17.3075V3.923C0 3.41783 0.175 2.99025 0.525 2.64025C0.875 2.29025 1.30258 2.11525 1.80775 2.11525H3.19225V0H4.73075V2.11525H12.3077V0H13.8077V2.11525H15.1923C15.6974 2.11525 16.125 2.29025 16.475 2.64025C16.825 2.99025 17 3.41783 17 3.923V17.3075C17 17.8127 16.825 18.2402 16.475 18.5903C16.125 18.9403 15.6974 19.1152 15.1923 19.1152H1.80775ZM1.80775 17.6152H15.1923C15.2692 17.6152 15.3398 17.5832 15.4038 17.519C15.4679 17.455 15.5 17.3845 15.5 17.3075V7.923H1.5V17.3075C1.5 17.3845 1.53208 17.455 1.59625 17.519C1.66025 17.5832 1.73075 17.6152 1.80775 17.6152ZM1.5 6.423H15.5V3.923C15.5 3.846 15.4679 3.7755 15.4038 3.7115C15.3398 3.64733 15.2692 3.61525 15.1923 3.61525H1.80775C1.73075 3.61525 1.66025 3.64733 1.59625 3.7115C1.53208 3.7755 1.5 3.846 1.5 3.923V6.423Z" fill="#6F7176"/>
    </svg>
  `;

  // Arrow icon SVG
  const arrowIcon = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/>
    </svg>
  `;

  // Build aria-label for link
  const linkAriaLabel = contentData.title
    ? `${contentData.linkLabel || 'Read more'}, ${contentData.title.replace(/<[^>]*>/g, '')}`
    : contentData.linkLabel || 'Read more';

  // Build HTML structure
  const html = `
    <div class="image-with-content-wrapper" role="region" aria-labelledby="${titleId}">
      <div class="image-with-content-image">
        ${contentData.image || ''}
      </div>
      <div class="image-with-content-content">
        <div class="image-with-content-content-inner">

          ${contentData.date ? `
            <div class="image-with-content-date" role="text" aria-label="Date: ${contentData.date}">
              ${calendarIcon}
              <span>${contentData.date}</span>
            </div>
          ` : ''}
          ${contentData.title ? `<div class="image-with-content-title" id="${titleId}">${contentData.title}</div>` : ''}
          ${contentData.description ? `<div class="image-with-content-description" id="${descriptionId}" role="text">${contentData.description}</div>` : ''}
          ${contentData.link && contentData.link.href ? `
            <div class="image-with-content-link">
              <a href="${contentData.link.href}"
                title="${contentData.link.title}"
                class="image-with-content-link-primary link-primary"
                aria-label="${linkAriaLabel}">
                ${contentData.linkLabel || 'Read more'}
                ${arrowIcon}
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
