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

  // Process content for styling
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.classList.contains('badge')) {
        cell.classList.add('insights-badge');
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        cell.classList.add('insights-heading');
      } else if (cell.querySelector('a')) {
        cell.classList.add('insights-button');
      } else if (cell.textContent.trim()) {
        cell.classList.add('insights-text');
      }
    });
  });

  // Make insightsData available globally for use in design
  // eslint-disable-next-line no-param-reassign
  block.insightsData = insightsData;
}
