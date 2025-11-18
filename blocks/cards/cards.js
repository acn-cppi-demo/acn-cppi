import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Extract all data from the block into a JSON array
  const cardsData = [];

  // Process each row (card) in the block
  [...block.children].forEach((row) => {
    const cardData = {
      image: null,
      imageAlt: null,
      text: null,
      linkLabel: null,
      link: null,
    };

    // Find all elements with data-aue-prop attributes within this row
    const propElements = row.querySelectorAll('[data-aue-prop]');
    propElements.forEach((element) => {
      const propName = element.getAttribute('data-aue-prop');
      const propType = element.getAttribute('data-aue-type');
      let value = null;

      // Extract value based on type
      if (propType === 'richtext') {
        // For richtext, get the innerHTML or textContent
        value = element.innerHTML.trim() || element.textContent.trim();
      } else if (propType === 'text') {
        // For text, get textContent
        value = element.textContent.trim();
      } else if (propType === 'media') {
        // For media (image), get the src
        const img = element.querySelector('img');
        if (img) {
          value = img.src || img.getAttribute('src');
          cardData.imageAlt = img.getAttribute('alt') || '';
        }
      } else {
        // Fallback to textContent
        value = element.textContent.trim();
      }

      // Map to cardData object
      if (propName === 'image') {
        const img = element.querySelector('img');
        if (img) {
          cardData.image = img.src || img.getAttribute('src');
          cardData.imageAlt = img.getAttribute('alt') || '';
        }
      } else if (propName === 'text') {
        cardData.text = value;
      } else if (propName === 'linkLabel') {
        cardData.linkLabel = value;
      } else if (propName === 'link') {
        // For link, try to get href from anchor tag or textContent
        const anchor = element.querySelector('a');
        if (anchor) {
          cardData.link = anchor.getAttribute('href') || anchor.textContent.trim();
        } else {
          cardData.link = value;
        }
      }
    });

    // Also check for link in anchor tags that might not have data-aue-prop="link"
    const anchors = row.querySelectorAll('a');
    anchors.forEach((anchor) => {
      if (!cardData.link && anchor.getAttribute('href')) {
        cardData.link = anchor.getAttribute('href');
        if (!cardData.linkLabel && anchor.textContent.trim()) {
          cardData.linkLabel = anchor.textContent.trim();
        }
      }
    });

    cardsData.push(cardData);
  });

  // Store the JSON object in a variable
  const cardsJson = JSON.stringify(cardsData, null, 2);

  // eslint-disable-next-line no-console
  console.log('Cards Data JSON:', cardsJson);
  // eslint-disable-next-line no-console
  console.log('Cards Data Object:', cardsData);

  // Helper function to get plain text from HTML
  const getPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent.trim();
  };

  // Build HTML structure
  const html = `
    <ul role="list" aria-label="Cards list">
      ${cardsData.map((card, index) => {
    // Create optimized picture for image
    let imageHtml = '';
    const isDecorative = !card.imageAlt || card.imageAlt.trim() === '';

    if (card.image) {
      const optimizedPic = createOptimizedPicture(
        card.image,
        isDecorative ? '' : card.imageAlt,
        false,
        [{ width: '750' }],
      );

      // Add aria-hidden for decorative images
      if (isDecorative) {
        optimizedPic.setAttribute('aria-hidden', 'true');
      }

      imageHtml = optimizedPic.outerHTML;
    }

    // Extract heading from text for accessibility
    let cardTitle = '';
    if (card.text) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = card.text;
      const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        cardTitle = heading.textContent.trim();
      }
    }

    const cardId = `card-${Date.now()}-${index}`;
    const linkLabel = card.linkLabel || getPlainText(card.link) || 'Learn more';
    const linkAriaLabel = card.link ? `${linkLabel}: ${getPlainText(card.text) || 'Card'}` : '';
    const cardAriaLabel = cardTitle || getPlainText(card.text) || `Card ${index + 1}`;

    return `
        <li role="article" aria-label="${cardAriaLabel}">
          ${imageHtml ? `<div class="cards-card-image">${imageHtml}</div>` : ''}
          ${card.text ? `
            <div class="cards-card-body">
              <div data-aue-prop="text" data-aue-label="Text" data-aue-filter="text" data-aue-type="richtext" id="${cardId}-content">
                ${card.text}
              </div>
            </div>
          ` : ''}
          ${card.linkLabel ? `
            <div class="cards-card-body">
              <p data-aue-prop="linkLabel" data-aue-label="Link Label" data-aue-type="text" id="${cardId}-label">${card.linkLabel}</p>
            </div>
          ` : ''}
          ${card.link ? `
            <div class="cards-card-body">
              <p>
                <a href="${card.link}" 
                   title="${card.link}" 
                   aria-label="${linkAriaLabel || linkLabel}"
                   ${!linkAriaLabel ? `aria-describedby="${cardId}-content"` : ''}
                   class="cards-link">
                  ${card.link}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"/>
                  </svg>
                </a>
              </p>
            </div>
          ` : ''}
        </li>
      `;
  }).join('')}
    </ul>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
