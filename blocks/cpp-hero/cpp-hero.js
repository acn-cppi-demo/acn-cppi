export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const cppHeroData = {
    badge: null,
    title: null,
    description: null,
    buttons: [],
  };

  // Temporary storage for button data
  const buttonData = {
    button1Label: null,
    button1Link: null,
    button2Label: null,
    button2Link: null,
  };

  // Find all elements with data-aue-prop attributes
  const propElements = block.querySelectorAll('[data-aue-prop]');
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
    } else {
      // Fallback to textContent
      value = element.textContent.trim();
    }

    // Map to cppHeroData object
    if (propName === 'badge') {
      cppHeroData.badge = value;
    } else if (propName === 'title') {
      cppHeroData.title = value;
    } else if (propName === 'description') {
      cppHeroData.description = value;
    } else if (propName === 'button1Label') {
      buttonData.button1Label = value;
    } else if (propName === 'button1Link') {
      buttonData.button1Link = element.getAttribute('href') || element.textContent.trim() || value;
    } else if (propName === 'button2Label') {
      buttonData.button2Label = value;
    } else if (propName === 'button2Link') {
      buttonData.button2Link = element.getAttribute('href') || element.textContent.trim() || value;
    }
  });

  // Add button1 and button2 to buttons array
  if (buttonData.button1Label) {
    cppHeroData.buttons.push({
      text: buttonData.button1Label,
      href: buttonData.button1Link || '#',
      title: '',
    });
  }
  if (buttonData.button2Label) {
    cppHeroData.buttons.push({
      text: buttonData.button2Label,
      href: buttonData.button2Link || '#',
      title: '',
    });
  }

  // Extract any other links from the block as fallback buttons
  if (cppHeroData.buttons.length === 0) {
    const allLinks = block.querySelectorAll('a[href]');
    allLinks.forEach((link) => {
      if (link.textContent.trim()) {
        cppHeroData.buttons.push({
          text: link.textContent.trim(),
          href: link.getAttribute('href'),
          title: '',
        });
      }
    });
  }

  // Store the JSON object in a variable
  const cppHeroJson = JSON.stringify(cppHeroData, null, 2);

  // eslint-disable-next-line no-console
  console.log('CPP Hero Data JSON:', cppHeroJson);
  // eslint-disable-next-line no-console
  console.log('CPP Hero Data Object:', cppHeroData);

  // Parse title and description to extract plain text (remove HTML tags for display)
  const getPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent.trim();
  };

  const titleText = getPlainText(cppHeroData.title);
  const descriptionText = getPlainText(cppHeroData.description);

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
        ${cppHeroData.title ? `<h2 class="cpp-hero-title" id="${titleId}">${titleText}</h2>` : ''}
        ${cppHeroData.description ? `<div class="cpp-hero-description" id="${descriptionId}">${descriptionText}</div>` : ''}
        ${buttonsHtml}
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
