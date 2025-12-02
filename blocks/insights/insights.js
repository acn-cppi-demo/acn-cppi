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

  // Get all direct child divs
  const children = Array.from(block.children);
  let currentIndex = 0;

  // Extract badge (first div with text)
  if (children[currentIndex]) {
    const badgeText = children[currentIndex].textContent.trim();
    if (badgeText) {
      insightsData.badge = badgeText;
      currentIndex += 1;
    }
  }

  // Extract title (next div with h2)
  if (children[currentIndex]) {
    const titleElement = children[currentIndex].querySelector('h2');
    if (titleElement) {
      insightsData.title = titleElement.outerHTML;
      currentIndex += 1;
    }
  }

  // Extract description (next div with paragraphs)
  if (children[currentIndex]) {
    const descDiv = children[currentIndex];
    const paragraphs = descDiv.querySelectorAll('p');
    if (paragraphs.length > 0) {
      // Combine all paragraphs, handling escaped <br/>
      const descHtml = Array.from(paragraphs)
        .map((p) => {
          let html = p.innerHTML.trim();
          // Decode escaped HTML entities
          html = html.replace(/&lt;br\/&gt;/g, '<br/>');
          return `<p>${html}</p>`;
        })
        .join('');
      insightsData.description = descHtml;
      currentIndex += 1;
    }
  }

  // Extract buttons and links (they come in pairs: label, then link)
  const buttonPairs = [];
  while (currentIndex < children.length) {
    const labelDiv = children[currentIndex];
    const linkDiv = children[currentIndex + 1];

    // Check if this is the key insights section (has h2 and ul)
    if (labelDiv && labelDiv.querySelector('h2, ul')) {
      break;
    }

    if (labelDiv && linkDiv) {
      const labelText = labelDiv.textContent.trim();
      const linkText = linkDiv.textContent.trim();

      if (labelText && linkText) {
        // Only create valid href if linkText is a proper URL or path
        let href = '#';
        if (linkText && linkText !== '/') {
          href = linkText.startsWith('http') ? linkText : `https://${linkText}`;
          // Validate the URL has a proper domain
          if (href === 'https://' || href === 'https:///') {
            href = '#';
          }
        }
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

  insightsData.buttons = buttonPairs;

  // Extract key insights (remaining div with h2 and ul)
  if (children[currentIndex]) {
    const insightsDiv = children[currentIndex];
    const heading = insightsDiv.querySelector('h2');
    const list = insightsDiv.querySelector('ul');

    if (heading) {
      insightsData.keyInsightsPointsHeader = heading.textContent.trim();
    }

    if (list) {
      insightsData.keyInsightsPoints = list.outerHTML;
    }
  }

  // Parse keyInsightsPoints to extract list items
  let insightsList = [];
  const extractedHeading = insightsData.keyInsightsPointsHeader || 'Key Insights';

  if (insightsData.keyInsightsPoints) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = insightsData.keyInsightsPoints;

    // Extract list items
    const listItems = tempDiv.querySelectorAll('li');
    insightsList = Array.from(listItems)
      .map((item) => item.textContent.trim())
      .filter((text) => text);
  }

  // Description already contains HTML, so use it directly
  const descriptionHtml = insightsData.description || '';

  // Generate unique IDs for accessibility
  const titleId = `insights-title-${Date.now()}`;
  const descriptionId = `insights-description-${Date.now()}`;
  const cardId = `insights-card-${Date.now()}`;
  const badgeIcon = `<svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 19.077C6.49483 19.077 6.05925 18.902 5.69325 18.552C5.32725 18.202 5.12825 17.7744 5.09625 17.2693H8.90375C8.87175 17.7744 8.67275 18.202 8.30675 18.552C7.94075 18.902 7.50517 19.077 7 19.077ZM3.25 15.8845V14.3845H10.75V15.8845H3.25ZM3.40375 13C2.35642 12.3487 1.52733 11.4977 0.9165 10.447C0.3055 9.3965 0 8.2475 0 7C0 5.05133 0.6795 3.3975 2.0385 2.0385C3.3975 0.6795 5.05133 0 7 0C8.94867 0 10.6025 0.6795 11.9615 2.0385C13.3205 3.3975 14 5.05133 14 7C14 8.2475 13.6945 9.3965 13.0835 10.447C12.4727 11.4977 11.6436 12.3487 10.5962 13H3.40375ZM3.85 11.5H10.15C10.9 10.9667 11.4792 10.3083 11.8875 9.525C12.2958 8.74167 12.5 7.9 12.5 7C12.5 5.46667 11.9667 4.16667 10.9 3.1C9.83333 2.03333 8.53333 1.5 7 1.5C5.46667 1.5 4.16667 2.03333 3.1 3.1C2.03333 4.16667 1.5 5.46667 1.5 7C1.5 7.9 1.70417 8.74167 2.1125 9.525C2.52083 10.3083 3.1 10.9667 3.85 11.5Z" fill="#F5F7FA"/>
</svg>
`;

  // Build HTML structure
  const html = `
    <div class="insights-wrapper" role="region" aria-labelledby="${titleId}">
      <div class="insights-main">
        ${insightsData.badge ? `<div class="insights-badge" aria-label="Badge: ${insightsData.badge}"> <span class="badge-icon" aria-hidden="true">${badgeIcon}</span> <span class="badge-text">${insightsData.badge}</span></div>` : ''}
        ${insightsData.title ? `<div class="insights-title" id="${titleId}">${insightsData.title}</div>` : ''}
        ${descriptionHtml ? `<div class="insights-description" id="${descriptionId}">${descriptionHtml}</div>` : ''}
        <nav class="insights-buttons" aria-label="Action buttons">
          ${insightsData.buttons.map((button, index) => {
    const buttonClass = index === 0 ? 'button-primary' : 'button-secondary';
    const buttonLabel = button.text || (index === 0 ? 'Primary action' : 'Secondary action');
    const ariaLabel = button.title || buttonLabel;
    return `<a href="${button.href || '#'}" class="${buttonClass} button" aria-label="${ariaLabel}"${button.href === '#' ? ' aria-disabled="true" tabindex="-1"' : ''}>${button.text}</a>`;
  }).join('')}
        </nav>
      </div>
      <aside class="insights-card" id="${cardId}" role="complementary" aria-labelledby="${cardId}-title">
        <div class="insights-card-header">
          <div class="insights-card-icon card-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8.29625 19.5C8.13208 19.5 7.97883 19.4606 7.8365 19.3818C7.69416 19.3029 7.58458 19.1866 7.50775 19.0328L5.654 15.7115H7.00775L7.96925 17.596H10.125V16.7115H8.502L7.5405 14.827H5.1615L3.8135 12.452C3.78016 12.375 3.75258 12.2997 3.73075 12.226C3.70891 12.1523 3.698 12.077 3.698 12C3.698 11.9462 3.7365 11.7955 3.8135 11.548L5.1615 9.173H7.5405L8.502 7.2885H10.125V6.404H7.96925L7.00775 8.2885H5.654L7.50775 4.96725C7.58458 4.81342 7.69416 4.69708 7.8365 4.61825C7.97883 4.53942 8.13208 4.5 8.29625 4.5H10.6537C10.9116 4.5 11.1267 4.58625 11.299 4.75875C11.4715 4.93108 11.5577 5.14617 11.5577 5.404V9.2115H10.048L9.1635 10.0962H11.5577V12.9615H9.473L8.53075 11.0865H6.452L5.56725 11.9713H7.998L8.9405 13.8463H11.5577V18.596C11.5577 18.8538 11.4715 19.0689 11.299 19.2413C11.1267 19.4138 10.9116 19.5 10.6537 19.5H8.29625ZM13.3462 19.5C13.0884 19.5 12.8733 19.4138 12.701 19.2413C12.5285 19.0689 12.4422 18.8538 12.4422 18.596V13.8463H15.0595L16.002 11.9713H18.4327L17.548 11.0865H15.4692L14.5172 12.9615H12.4422V10.0962H14.8365L13.952 9.2115H12.4422V5.404C12.4422 5.14617 12.5285 4.93108 12.701 4.75875C12.8733 4.58625 13.0884 4.5 13.3462 4.5H15.7038C15.8679 4.5 16.0212 4.53942 16.1635 4.61825C16.3058 4.69708 16.4154 4.81342 16.4922 4.96725L18.346 8.2885H16.9922L16.0307 6.404H13.875V7.2885H15.498L16.45 9.173H18.8385L20.1865 11.548C20.2198 11.625 20.2474 11.7003 20.2693 11.774C20.2911 11.8477 20.302 11.923 20.302 12C20.302 12.0538 20.2635 12.2045 20.1865 12.452L18.8385 14.827H16.45L15.498 16.7115H13.875V17.596H16.0307L16.9922 15.7115H18.346L16.4922 19.0328C16.4154 19.1866 16.3058 19.3029 16.1635 19.3818C16.0212 19.4606 15.8679 19.5 15.7038 19.5H13.3462Z" fill="white"/>
            </svg>
          </div>
          <span class="insights-card-label" aria-label="Featured Research">Featured Research</span>
        </div>
        <h3 class="insights-card-title" id="${cardId}-title">${extractedHeading}</h3>
        ${insightsList.length > 0 ? `
          <ul class="insights-list" aria-label="Key insights list">
            ${insightsList.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        ` : ''}
      </aside>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
