/**
 * Clean up AEM button classes
 * @param {Element} container The container element
 */
function cleanupButtonClasses(container) {
  // Remove button-container and button classes
  const buttonContainers = container.querySelectorAll('.button-container');
  buttonContainers.forEach((buttonContainer) => {
    buttonContainer.classList.remove('button-container');
  });

  const buttons = container.querySelectorAll('.button');
  buttons.forEach((button) => {
    button.classList.remove('button');
  });
}

// Badge icon SVG
const badgeIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.76925 13.25H8.23075V11.75H2.76925V13.25ZM5.76925 9.25H11.2308V7.75H5.76925V9.25ZM8.76925 5.25H14.2308V3.75H8.76925V5.25ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2692 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2692 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2692 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2692 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5Z" fill="#2C3D50"/>
</svg>`;

/**
 * Parse performance content and structure it properly
 * @param {string} content The HTML content to parse
 * @returns {string} Structured HTML
 */
function parsePerformanceContent(content) {
  // Create a temporary div to parse the content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const h2 = tempDiv.querySelector('h2');
  const paragraphs = tempDiv.querySelectorAll('p');

  let structuredHTML = '';

  if (h2) {
    structuredHTML += `<h2>${h2.textContent}</h2>`;
  }

  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    // Parse format: "1 Year [{00.0%(Net Return)} {00.0%(Benchmark)}]"
    const match = text.match(/^(.+?)\s*\[\{(.+?)\(Net Return\)\}\s*\{(.+?)\(Benchmark\)\}\]$/);

    if (match) {
      const period = match[1].trim();
      const netReturn = match[2].trim();
      const benchmark = match[3].trim();

      structuredHTML += `
        <div class="performance-row">
          <div class="period-column">
            <span class="period-text">${period}</span>
          </div>
          <div class="performance-data">
            <div class="performance-column">
              <span class="performance-value">${netReturn}</span>
              <span class="performance-label">Net Return</span>
            </div>
            <div class="column-divider"></div>
            <div class="performance-column">
              <span class="performance-value">${benchmark}</span>
              <span class="performance-label">Benchmark</span>
            </div>
          </div>
        </div>
      `;
    } else {
      structuredHTML += `<p>${text}</p>`;
    }
  });

  return structuredHTML;
}

/**
 * loads and decorates the fund performance block
 * @param {Element} block The fund performance block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Build JSON object first
  const layoutData = {
    fundPerformanceCard: {
      title: '',
      description: '',
      cta: '',
      image: '',
    },
    rightSideContent: [],
  };

  // Extract fund performance data (first 3 rows)
  rows.forEach((row, index) => {
    const cells = [...row.children];

    if (index === 0 && cells.length > 0) {
      // Extract title and icon
      layoutData.fundPerformanceCard.title = cells[0].innerHTML;
    } else if (index === 1 && cells.length > 0) {
      // Extract description and CTA
      const cellContent = cells[0];
      const paragraphs = cellContent.querySelectorAll('p');

      paragraphs.forEach((p) => {
        const link = p.querySelector('a');
        if (link) {
          layoutData.fundPerformanceCard.cta = p.innerHTML;
        } else {
          layoutData.fundPerformanceCard.description = p.innerHTML;
        }
      });
    } else if (index === 2 && cells.length > 0) {
      // Extract image/chart
      layoutData.fundPerformanceCard.image = cells[0].innerHTML;
    } else if (index >= 3) {
      // All remaining rows go to right side
      layoutData.rightSideContent.push(cells[0].innerHTML);
    }
  });

  // Extract and clean badge text from first right-side content
  const [badgeContent, ...remainingContent] = layoutData.rightSideContent;
  let badgeText = '';
  if (badgeContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = badgeContent;
    badgeText = tempDiv.textContent.trim() || tempDiv.innerText.trim();
  }

  // Clear existing content
  block.textContent = '';

  // Build HTML structure
  const htmlTemplate = `
    <div class="fund-overview-layout">
      <div class="fund-overview-left">
        <div class="fund-performance-card">
          <div class="fund-performance-content">
            <div class="fund-performance-header">
              ${layoutData.fundPerformanceCard.title}
            </div>

            <div class="fund-performance-description">
              <p>${layoutData.fundPerformanceCard.description}</p>
            </div>

            <div class="fund-performance-cta">
              ${layoutData.fundPerformanceCard.cta}
            </div>
          </div>

          <div class="fund-performance-chart">
            ${layoutData.fundPerformanceCard.image}
          </div>
        </div>
      </div>
      
      <div class="fund-overview-right">
        ${badgeText ? `<div class="badge badge-primary"><span class="badge-icon" aria-hidden="true">${badgeIcon}</span><span>${badgeText}</span></div>` : ''}
        ${remainingContent.map((content, index) => {
    if (index === 0) {
      // Fund overview content with performance data
      return `<div class="right-content-item">${parsePerformanceContent(content)}</div>`;
    }
    return `<div class="right-content-item">${content}</div>`;
  }).join('')}
      </div>
    </div>
  `;

  // Replace block content with template
  block.innerHTML = htmlTemplate;

  // Clean up AEM button classes
  cleanupButtonClasses(block);
}
