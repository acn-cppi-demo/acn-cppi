import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Step 1: Optimize images first
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '2000', media: '(min-width: 600px)' },
      { width: '750' },
    ]);
    const optimizedImg = optimizedPic.querySelector('img');
    moveInstrumentation(img, optimizedImg);
    if (!optimizedImg.getAttribute('alt') && !img.alt) {
      optimizedImg.setAttribute('alt', '');
      optimizedImg.setAttribute('aria-hidden', 'true');
    } else if (img.alt) {
      optimizedImg.setAttribute('alt', img.alt);
    }
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Step 2: Extract all data into JSON object
  const children = Array.from(block.children);
  let currentIndex = 0;

  const data = {
    heading: null,
    headingText: '',
    headingLevel: null,
    image: null,
    description: null,
    links: [],
    ids: {
      heading: `content-block-heading-${Date.now()}`,
      description: `content-block-description-${Date.now()}`,
    },
  };

  // Extract heading (first div with h1-h6)
  if (children[currentIndex]) {
    const headingElement = children[currentIndex].querySelector('h1, h2, h3, h4, h5, h6');
    if (headingElement) {
      const headingLevel = headingElement.tagName.toLowerCase();
      const p = document.createElement('p');
      p.className = `content-block-heading content-block-heading-${headingLevel}`;
      Array.from(headingElement.attributes).forEach((attr) => {
        p.setAttribute(attr.name, attr.value);
      });
      p.innerHTML = headingElement.innerHTML;
      data.heading = p.outerHTML;
      data.headingText = headingElement.textContent.trim();
      data.headingLevel = headingLevel;
      currentIndex += 1;
    }
  }

  // Extract image (div with picture)
  if (children[currentIndex]) {
    const picture = children[currentIndex].querySelector('picture');
    if (picture) {
      data.image = picture.outerHTML;
      currentIndex += 1;
    }
  }

  // Extract description (div with paragraphs, no links)
  if (children[currentIndex]) {
    const paragraphs = children[currentIndex].querySelectorAll('p');
    const hasLinks = children[currentIndex].querySelector('a[href]');
    if (paragraphs.length > 0 && !hasLinks) {
      let descHtml = '';
      paragraphs.forEach((p) => {
        descHtml += `<p>${p.innerHTML.trim()}</p>`;
      });
      data.description = descHtml;
      currentIndex += 1;
    }
  }

  // Extract links (remaining divs with anchors)
  while (currentIndex < children.length) {
    const anchor = children[currentIndex].querySelector('a[href]');
    if (anchor) {
      data.links.push({
        text: anchor.textContent.trim(),
        href: anchor.getAttribute('href'),
        title: anchor.getAttribute('title') || anchor.textContent.trim(),
        type: anchor.getAttribute('data-link-type') || '',
      });
    }
    currentIndex += 1;
  }

  // Step 3: Build HTML from JSON using single template literal
  const arrowIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/></svg>';

  const linksHTML = data.links.length > 0
    ? `<div class="content-block-links">${data.links.map((link) => {
      const isPrimaryLink = link.type === 'primary-link';
      const linkClass = isPrimaryLink ? 'link-primary' : 'content-block-link';
      const ariaLabel = data.headingText ? `${link.text}, ${data.headingText}` : link.text;
      return `<a href="${link.href}" title="${link.title}" class="${linkClass}" aria-label="${ariaLabel}">${link.text}${isPrimaryLink ? arrowIcon : ''}</a>`;
    }).join('')}</div>`
    : '';

  const html = `<div class="content-block-wrapper" role="article"${data.headingText ? ` aria-labelledby="${data.ids.heading}"` : ''}${data.description ? ` aria-describedby="${data.ids.description}"` : ''}>
  ${data.image ? `<div class="content-block-image">${data.image}</div>` : ''}
  <div class="content-block-content">
    ${data.heading ? `<div class="content-block-heading-wrapper" id="${data.ids.heading}">${data.heading}</div>` : ''}
    ${data.description ? `<div class="content-block-description" id="${data.ids.description}">${data.description}</div>` : ''}
    ${linksHTML}
  </div>
</div>`;

  // Step 4: Replace block content
  block.innerHTML = html;

  // Step 5: Post-process for accessibility
  const imageContainer = block.querySelector('.content-block-image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img && (!img.getAttribute('alt') || img.getAttribute('alt') === '')) {
      img.setAttribute('alt', '');
      img.setAttribute('aria-hidden', 'true');
    }
  }
}
