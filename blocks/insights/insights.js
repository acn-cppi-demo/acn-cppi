export default function decorate(block) {
  // Add insights-specific styling class
  block.classList.add('insights-container');

  // Extract all data from the block into a JSON object
  const insightsData = {
    badge: null,
    title: null,
    description: null,
    keyInsightsPointsHeader: null,
    keyInsightsPoints: null,
    buttons: [],
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

    // Map to insightsData object
    if (propName === 'badge') {
      insightsData.badge = value;
    } else if (propName === 'title') {
      insightsData.title = value;
    } else if (propName === 'description') {
      insightsData.description = value;
    } else if (propName === 'keyInsightsPointsHeader') {
      insightsData.keyInsightsPointsHeader = value;
    } else if (propName === 'keyInsightsPoints') {
      insightsData.keyInsightsPoints = value;
    }
  });

  // Extract buttons (links)
  const buttons = block.querySelectorAll('a[data-aue-prop], a[href]');
  buttons.forEach((button) => {
    insightsData.buttons.push({
      text: button.textContent.trim(),
      href: button.getAttribute('href') || button.getAttribute('data-aue-prop'),
      title: button.getAttribute('title') || '',
    });
  });

  // Store the JSON object in a variable
  const insightsJson = JSON.stringify(insightsData, null, 2);

  // eslint-disable-next-line no-console
  console.log('Insights Data JSON:', insightsJson);
  // eslint-disable-next-line no-console
  console.log('Insights Data Object:', insightsData);

  // Parse keyInsightsPoints to extract list items
  let insightsList = [];
  if (insightsData.keyInsightsPoints) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = insightsData.keyInsightsPoints;
    const listItems = tempDiv.querySelectorAll('li, p');
    insightsList = Array.from(listItems)
      .map((item) => item.textContent.trim())
      .filter((text) => text);
  }

  // Parse title and description to extract plain text (remove HTML tags for display)
  const getPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent.trim();
  };

  const titleText = getPlainText(insightsData.title);
  const descriptionText = getPlainText(insightsData.description);

  // Build HTML structure
  const html = `
    <div class="insights-wrapper">
      <div class="insights-main">
        ${insightsData.badge ? `<div class="insights-badge">${insightsData.badge}</div>` : ''}
        ${insightsData.title ? `<h2 class="insights-title">${titleText}</h2>` : ''}
        ${insightsData.description ? `<div class="insights-description">${descriptionText}</div>` : ''}
        <div class="insights-buttons">
          ${insightsData.buttons.map((button, index) => {
    const buttonClass = index === 0 ? 'insights-button-primary' : 'insights-button-secondary';
    return `<a href="${button.href || '#'}" class="${buttonClass}" title="${button.title}">${button.text}</a>`;
  }).join('')}
        </div>
      </div>
      <div class="insights-card">
        <div class="insights-card-header">
          <svg class="insights-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" fill="currentColor"/>
            <path d="M10 6C9.45 6 9 6.45 9 7V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V7C11 6.45 10.55 6 10 6Z" fill="currentColor"/>
            <path d="M10 12C9.45 12 9 12.45 9 13C9 13.55 9.45 14 10 14C10.55 14 11 13.55 11 13C11 12.45 10.55 12 10 12Z" fill="currentColor"/>
          </svg>
          <span class="insights-card-label">Featured Research</span>
        </div>
        ${insightsData.keyInsightsPointsHeader ? `<h3 class="insights-card-title">${getPlainText(insightsData.keyInsightsPointsHeader)}</h3>` : '<h3 class="insights-card-title">Key Insights</h3>'}
        ${insightsList.length > 0 ? `
          <ul class="insights-list">
            ${insightsList.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
