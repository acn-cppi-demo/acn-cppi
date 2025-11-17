export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const insightsData = {
    badge: null,
    title: null,
    description: null,
    keyInsightsPointsHeader: null,
    keyInsightsPoints: null,
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

    // Map to insightsData object
    if (propName === 'badge') {
      insightsData.badge = value;
    } else if (propName === 'title') {
      insightsData.title = value;
    } else if (propName === 'description') {
      insightsData.description = value;
    } else if (propName === 'button1Label') {
      buttonData.button1Label = value;
    } else if (propName === 'button1Link') {
      buttonData.button1Link = element.getAttribute('href') || element.textContent.trim() || value;
    } else if (propName === 'button2Label') {
      buttonData.button2Label = value;
    } else if (propName === 'button2Link') {
      buttonData.button2Link = element.getAttribute('href') || element.textContent.trim() || value;
    } else if (propName === 'keyInsightsPointsHeader') {
      insightsData.keyInsightsPointsHeader = value;
    } else if (propName === 'keyInsightsPoints') {
      insightsData.keyInsightsPoints = value;
    }
  });

  // Add button1 and button2 to buttons array
  if (buttonData.button1Label && buttonData.button1Link) {
    insightsData.buttons.push({
      text: buttonData.button1Label,
      href: buttonData.button1Link,
      title: '',
    });
  }
  if (buttonData.button2Label && buttonData.button2Link) {
    insightsData.buttons.push({
      text: buttonData.button2Label,
      href: buttonData.button2Link,
      title: '',
    });
  }

  // Extract other buttons (links) from DOM
  const buttons = block.querySelectorAll('a[data-aue-prop]:not([data-aue-prop="button1Link"]):not([data-aue-prop="button2Link"]), a[href]:not([data-aue-prop])');
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

  // Parse keyInsightsPoints to extract heading and list items
  let insightsList = [];
  let extractedHeading = null;
  if (insightsData.keyInsightsPoints) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = insightsData.keyInsightsPoints;

    // Extract heading tags (h1-h6) from keyInsightsPoints
    const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      extractedHeading = heading.textContent.trim();
      // Remove the heading from the DOM so it doesn't appear in the list
      heading.remove();
    }

    // Extract list items (excluding headings)
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
    return `<a href="${button.href || '#'}" class="${buttonClass}">${button.text}</a>`;
  }).join('')}
        </div>
      </div>
      <div class="insights-card">
        <div class="insights-card-header">
          <div class="insights-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29625 19.5C8.13208 19.5 7.97883 19.4606 7.8365 19.3818C7.69416 19.3029 7.58458 19.1866 7.50775 19.0328L5.654 15.7115H7.00775L7.96925 17.596H10.125V16.7115H8.502L7.5405 14.827H5.1615L3.8135 12.452C3.78016 12.375 3.75258 12.2997 3.73075 12.226C3.70891 12.1523 3.698 12.077 3.698 12C3.698 11.9462 3.7365 11.7955 3.8135 11.548L5.1615 9.173H7.5405L8.502 7.2885H10.125V6.404H7.96925L7.00775 8.2885H5.654L7.50775 4.96725C7.58458 4.81342 7.69416 4.69708 7.8365 4.61825C7.97883 4.53942 8.13208 4.5 8.29625 4.5H10.6537C10.9116 4.5 11.1267 4.58625 11.299 4.75875C11.4715 4.93108 11.5577 5.14617 11.5577 5.404V9.2115H10.048L9.1635 10.0962H11.5577V12.9615H9.473L8.53075 11.0865H6.452L5.56725 11.9713H7.998L8.9405 13.8463H11.5577V18.596C11.5577 18.8538 11.4715 19.0689 11.299 19.2413C11.1267 19.4138 10.9116 19.5 10.6537 19.5H8.29625ZM13.3462 19.5C13.0884 19.5 12.8733 19.4138 12.701 19.2413C12.5285 19.0689 12.4422 18.8538 12.4422 18.596V13.8463H15.0595L16.002 11.9713H18.4327L17.548 11.0865H15.4692L14.5172 12.9615H12.4422V10.0962H14.8365L13.952 9.2115H12.4422V5.404C12.4422 5.14617 12.5285 4.93108 12.701 4.75875C12.8733 4.58625 13.0884 4.5 13.3462 4.5H15.7038C15.8679 4.5 16.0212 4.53942 16.1635 4.61825C16.3058 4.69708 16.4154 4.81342 16.4922 4.96725L18.346 8.2885H16.9922L16.0307 6.404H13.875V7.2885H15.498L16.45 9.173H18.8385L20.1865 11.548C20.2198 11.625 20.2474 11.7003 20.2693 11.774C20.2911 11.8477 20.302 11.923 20.302 12C20.302 12.0538 20.2635 12.2045 20.1865 12.452L18.8385 14.827H16.45L15.498 16.7115H13.875V17.596H16.0307L16.9922 15.7115H18.346L16.4922 19.0328C16.4154 19.1866 16.3058 19.3029 16.1635 19.3818C16.0212 19.4606 15.8679 19.5 15.7038 19.5H13.3462Z" fill="white"/>
            </svg>
          </div>
          <span class="insights-card-label">Featured Research</span>
        </div>
        ${extractedHeading || insightsData.keyInsightsPointsHeader ? `<h3 class="insights-card-title">${extractedHeading || getPlainText(insightsData.keyInsightsPointsHeader)}</h3>` : '<h3 class="insights-card-title">Key Insights</h3>'}
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
