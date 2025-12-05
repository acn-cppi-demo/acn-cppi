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
    buttons: [],
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
      // Always convert to h1 for SEO, but keep original heading level class for styling
      const h1 = document.createElement('h1');
      h1.className = `content-block-heading content-block-heading-${headingLevel}`;
      Array.from(headingElement.attributes).forEach((attr) => {
        // Skip id if it exists, we'll use our own
        if (attr.name !== 'id') {
          h1.setAttribute(attr.name, attr.value);
        }
      });
      h1.innerHTML = headingElement.innerHTML;
      data.heading = h1.outerHTML;
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

  // Extract description and links (div with paragraphs and links)
  // All links in description should be link-primary (even if in button-container)
  if (children[currentIndex]) {
    const paragraphs = children[currentIndex].querySelectorAll('p:not(.button-container)');
    const linksInDescription = children[currentIndex].querySelectorAll('a[href]');

    if (paragraphs.length > 0) {
      let descHtml = '';
      paragraphs.forEach((p) => {
        descHtml += `<p>${p.innerHTML.trim()}</p>`;
      });
      data.description = descHtml;
    }

    // Extract all links from description as link-primary
    linksInDescription.forEach((anchor) => {
      data.links.push({
        text: anchor.textContent.trim(),
        href: anchor.getAttribute('href'),
        title: anchor.getAttribute('title') || anchor.textContent.trim(),
      });
    });
    currentIndex += 1;
  }

  // Extract buttons (last two links in button-container)
  // Look for remaining divs with button-container
  // If previous div has text, use that as button label
  const buttonDivs = [];
  while (currentIndex < children.length) {
    const currentDiv = children[currentIndex];
    const buttonContainer = currentDiv.querySelector('.button-container');
    if (buttonContainer) {
      const anchor = buttonContainer.querySelector('a[href]');
      if (anchor) {
        // Check if previous div has text (button label)
        let buttonText = anchor.textContent.trim();
        if (currentIndex > 0) {
          const prevDiv = children[currentIndex - 1];
          const prevText = prevDiv.textContent.trim();
          // If previous div has text and no links, use it as button label
          if (prevText && !prevDiv.querySelector('a[href]') && !prevDiv.querySelector('.button-container')) {
            buttonText = prevText;
          }
        }
        buttonDivs.push({
          text: buttonText,
          href: anchor.getAttribute('href'),
          title: anchor.getAttribute('title') || buttonText,
        });
      }
    }
    currentIndex += 1;
  }

  // Last two button-container links become buttons (primary and secondary)
  if (buttonDivs.length >= 2) {
    data.buttons = [
      {
        text: buttonDivs[buttonDivs.length - 2].text,
        href: buttonDivs[buttonDivs.length - 2].href,
        title: buttonDivs[buttonDivs.length - 2].title,
        type: 'primary',
      },
      {
        text: buttonDivs[buttonDivs.length - 1].text,
        href: buttonDivs[buttonDivs.length - 1].href,
        title: buttonDivs[buttonDivs.length - 1].title,
        type: 'secondary',
      },
    ];
  } else if (buttonDivs.length === 1) {
    data.buttons = [
      {
        text: buttonDivs[0].text,
        href: buttonDivs[0].href,
        title: buttonDivs[0].title,
        type: 'primary',
      },
    ];
  }

  // Step 3: Build HTML from JSON using single template literal
  const arrowIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/></svg>';

  const linksHTML = data.links.length > 0
    ? `<div class="content-block-links">${data.links.map((link) => {
      const ariaLabel = data.headingText ? `${link.text}, ${data.headingText}` : link.text;
      return `<a href="${link.href}" title="${link.title}" class="link-primary" aria-label="${ariaLabel}">${link.text}${arrowIcon}</a>`;
    }).join('')}</div>`
    : '';

  const buttonsHTML = data.buttons.length > 0
    ? `<div class="content-block-buttons">${data.buttons.map((button) => {
      const buttonClass = button.type === 'primary' ? 'button button-primary' : 'button button-secondary';
      const href = button.href === '#go-back' ? '#' : button.href;
      const onClick = button.href === '#go-back' ? ' onclick="if(document.referrer) { window.history.back(); return false; }"' : '';
      const ariaLabel = data.headingText ? `${button.text}, ${data.headingText}` : button.text;
      return `<a href="${href}" title="${button.title}" class="${buttonClass}" aria-label="${ariaLabel}"${onClick}>${button.text}</a>`;
    }).join('')}</div>`
    : '';

  const html = `<div class="content-block-wrapper">
  ${data.heading ? `<div class="content-block-heading-wrapper" id="${data.ids.heading}">${data.heading}</div>` : ''}
  ${data.image ? `<div class="content-block-image">${data.image}</div>` : ''}
  <div class="content-block-content">
    ${data.description ? `<div class="content-block-description" id="${data.ids.description}">${data.description}</div>` : ''}
    ${linksHTML}
    ${buttonsHTML}
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
