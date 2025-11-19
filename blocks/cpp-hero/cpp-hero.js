export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const cppHeroData = {
    badge: null,
    title: null,
    description: null,
    buttons: [],
  };

  // Get all direct child divs
  const children = Array.from(block.children);
  let currentIndex = 0;

  // Extract badge (first div with text)
  if (children[currentIndex]) {
    const badgeText = children[currentIndex].textContent.trim();
    if (badgeText) {
      cppHeroData.badge = badgeText;
      currentIndex += 1;
    }
  }

  // Extract title (next div with paragraph containing strong or text)
  if (children[currentIndex]) {
    const titleDiv = children[currentIndex];
    const titleParagraph = titleDiv.querySelector('p');
    if (titleParagraph) {
      cppHeroData.title = titleParagraph.innerHTML.trim();
      currentIndex += 1;
    }
  }

  // Extract description (next div with paragraph)
  if (children[currentIndex]) {
    const descDiv = children[currentIndex];
    const descParagraph = descDiv.querySelector('p');
    if (descParagraph) {
      cppHeroData.description = descParagraph.innerHTML.trim();
      currentIndex += 1;
    }
  }

  // Extract buttons and links (they come in pairs: label, then link)
  const buttonPairs = [];
  while (currentIndex < children.length) {
    const labelDiv = children[currentIndex];
    const linkDiv = children[currentIndex + 1];

    if (labelDiv && linkDiv) {
      const labelText = labelDiv.textContent.trim();
      const linkText = linkDiv.textContent.trim();

      if (labelText && linkText) {
        // Handle relative paths - if it doesn't start with http, treat as relative
        const href = linkText.startsWith('http') ? linkText : linkText;
        buttonPairs.push({
          text: labelText,
          href,
        });
        currentIndex += 2;
      } else {
        currentIndex += 1;
      }
    } else {
      currentIndex += 1;
    }
  }

  cppHeroData.buttons = buttonPairs;

  // Generate unique IDs for accessibility
  const titleId = `cpp-hero-title-${Date.now()}`;
  const descriptionId = `cpp-hero-description-${Date.now()}`;

  // Build button HTML: render <a> for valid hrefs and <button disabled> for missing links
  let buttonsHtml = '';
  if (cppHeroData.buttons.length > 0) {
    buttonsHtml = `
        <nav class="cpp-hero-buttons" aria-label="Hero actions">
          ${cppHeroData.buttons.map((button, index) => {
    const buttonClass = index === 0 ? 'button-primary' : 'button-secondary';
    const hasHref = button.href && button.href !== '#';
    if (hasHref) {
      return `<a href="${button.href}" class="button ${buttonClass}">${button.text}</a>`;
    }
    // render a disabled button when there's no valid href
    // this shows a non-clickable control to keyboard users
    return `<button type="button" class="button ${buttonClass}" disabled aria-disabled="true">${button.text}</button>`;
  }).join('')}
        </nav>
      `;
  }

  // Build HTML structure; include aria-describedby if a description exists
  const descAttr = cppHeroData.description ? ` aria-describedby="${descriptionId}"` : '';

  const html = `
    <div class="cpp-hero-wrapper" role="region" aria-labelledby="${titleId}"${descAttr}>
      <div class="cpp-hero-main">
        ${cppHeroData.badge ? `<div class="cpp-hero-badge">${cppHeroData.badge}</div>` : ''}
        ${cppHeroData.title ? `<h2 class="cpp-hero-title" id="${titleId}">${cppHeroData.title}</h2>` : ''}
        ${cppHeroData.description ? `<div class="cpp-hero-description" id="${descriptionId}">${cppHeroData.description}</div>` : ''}
        ${buttonsHtml}
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
