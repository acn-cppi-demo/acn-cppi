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
 * loads and decorates the fund performance block
 * @param {Element} block The fund performance block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  // Extract content into JSON variable
  const fundPerformanceData = {
    title: '',
    description: '',
    cta: '',
    image: '',
  };

  rows.forEach((row, index) => {
    const cells = [...row.children];

    if (index === 0 && cells.length > 0) {
      // Extract title and icon
      fundPerformanceData.title = cells[0].innerHTML;
    } else if (index === 1 && cells.length > 0) {
      // Extract description and CTA
      const cellContent = cells[0];
      const paragraphs = cellContent.querySelectorAll('p');

      paragraphs.forEach((p) => {
        const link = p.querySelector('a');
        if (link) {
          fundPerformanceData.cta = p.innerHTML;
        } else {
          fundPerformanceData.description = p.innerHTML;
        }
      });
    } else if (index === 2 && cells.length > 0) {
      // Extract image/chart
      fundPerformanceData.image = cells[0].innerHTML;
    }
  });

  // Clear existing content
  block.textContent = '';

  // Create entire HTML using template literals
  const htmlTemplate = `
    <div class="fund-performance-card">
      <div class="fund-performance-content">
        <div class="fund-performance-header">
          ${fundPerformanceData.title}
        </div>

        <div class="fund-performance-description">
          <p>${fundPerformanceData.description}</p>
        </div>

        <div class="fund-performance-cta">
          ${fundPerformanceData.cta}
        </div>
      </div>

      <div class="fund-performance-chart">
        ${fundPerformanceData.image}
      </div>
    </div>
  `;

  // Replace block content with template
  block.innerHTML = htmlTemplate;

  // Clean up AEM button classes
  cleanupButtonClasses(block);
}
