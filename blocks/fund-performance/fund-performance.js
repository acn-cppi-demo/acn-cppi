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
        ${layoutData.rightSideContent.map((content, index) => {
    if (index === 0) {
      // Badge content
      return `<div class="right-content-item">${content}</div>`;
    }
    if (index === 1) {
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
