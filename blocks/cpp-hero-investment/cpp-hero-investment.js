export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const heroData = {
    title: null,
    description: null,
    button: null,
  };

  // Get all direct child divs
  const children = Array.from(block.children);
  let currentIndex = 0;

  // Extract title (first div with paragraph)
  if (children[currentIndex]) {
    const titleDiv = children[currentIndex];
    const titleParagraph = titleDiv.querySelector('p');
    if (titleParagraph) {
      heroData.title = titleParagraph.innerHTML.trim();
      currentIndex += 1;
    }
  }

  // Extract description (next div with paragraph)
  if (children[currentIndex]) {
    const descDiv = children[currentIndex];
    const descParagraph = descDiv.querySelector('p');
    if (descParagraph) {
      heroData.description = descParagraph.innerHTML.trim();
      currentIndex += 1;
    }
  }

  // Extract button (label and link pair)
  if (children[currentIndex] && children[currentIndex + 1]) {
    const labelDiv = children[currentIndex];
    const linkDiv = children[currentIndex + 1];

    const labelText = labelDiv.textContent.trim();
    const linkText = linkDiv.textContent.trim();

    if (labelText && linkText) {
      heroData.button = {
        text: labelText,
        href: linkText,
      };
    }
  }

  // Generate unique IDs for accessibility
  const titleId = `cpp-hero-investment-title-${Date.now()}`;
  const descriptionId = `cpp-hero-investment-description-${Date.now()}`;

  // Build button HTML
  let buttonHtml = '';
  if (heroData.button) {
    const hasHref = heroData.button.href && heroData.button.href !== '#';
    if (hasHref) {
      buttonHtml = `
        <nav class="cpp-hero-investment-buttons" aria-label="Hero actions">
          <a href="${heroData.button.href}" class="button button-secondary">${heroData.button.text}</a>
        </nav>
      `;
    } else {
      buttonHtml = `
        <nav class="cpp-hero-investment-buttons" aria-label="Hero actions">
          <button type="button" class="button button-secondary" disabled aria-disabled="true">${heroData.button.text}</button>
        </nav>
      `;
    }
  }

  // Build HTML structure
  const descAttr = heroData.description ? ` aria-describedby="${descriptionId}"` : '';

  const html = `
    <div class="cpp-hero-investment-wrapper" role="region" aria-labelledby="${titleId}"${descAttr}>
      <div class="cpp-hero-investment-main">
        ${heroData.title ? `<h2 class="cpp-hero-investment-title" id="${titleId}">${heroData.title}</h2>` : ''}
        ${heroData.description ? `<div class="cpp-hero-investment-description" id="${descriptionId}">${heroData.description}</div>` : ''}
        ${buttonHtml}
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
