/**
 * Initialize Portfolio Allocation donut chart
 * @param {string} chartId - The chart container ID
 * @param {Object} data - The chart data object
 */
function initializePortfolioChart(chartId, data) {
  // Check if Highcharts is available
  if (typeof window.Highcharts === 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('Highcharts library not loaded');

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="portfolio-allocation-error">Chart library not available. Please ensure Highcharts is loaded.</div>';
    }
    return;
  }

  // Mock data for portfolio allocation (matching screenshot colors)
  const mockChartData = [
    { name: 'Equities', y: 25, color: '#01BAF2' },
    { name: 'Fixed Income', y: 20, color: '#0273CF' },
    { name: 'Real Estate', y: 15, color: '#0052A5' },
    { name: 'Infrastructure', y: 15, color: '#003A7A' },
    { name: 'Credit', y: 15, color: '#2C2C2C' },
    { name: 'Other', y: 10, color: '#000000' },
  ];

  // Parse chart data if provided, otherwise use mock data
  let chartData = mockChartData;
  try {
    if (data.chartData && typeof data.chartData === 'string' && data.chartData.trim()) {
      const parsed = JSON.parse(data.chartData);
      if (Array.isArray(parsed)) {
        chartData = parsed;
      }
    } else if (data.chartData && Array.isArray(data.chartData)) {
      chartData = data.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error);
  }

  // Highcharts configuration for donut chart
  const config = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'default',
        dataLabels: {
          enabled: false,
        },
        showInLegend: false,
        innerSize: '60%',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        states: {
          hover: {
            brightness: 0.1,
          },
        },
      },
    },
    series: [
      {
        name: 'Allocation',
        colorByPoint: false,
        innerSize: '60%',
        data: chartData,
      },
    ],
  };

  // Create the chart
  try {
    const chart = window.Highcharts.chart(chartId, config);
    // Store chart instance for later updates
    window[`highchart_${chartId}`] = chart;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Portfolio Allocation chart:', error);

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="portfolio-allocation-error">Error rendering chart. Please check the configuration.</div>';
    }
  }
}

/**
 * Handle asset class card click
 * @param {Element} card - The clicked card element
 * @param {Object} assetData - The asset class data
 */
function handleAssetClassClick(card, assetData) {
  // Toggle selected state
  const isSelected = card.classList.contains('selected');
  card.classList.toggle('selected', !isSelected);
  assetData.selected = !isSelected;

  // Update the radio button indicator
  const indicator = card.querySelector('.asset-class-indicator');
  if (indicator) {
    if (!isSelected) {
      // Selected state
      indicator.classList.add('selected');
      indicator.classList.remove('unselected');
    } else {
      // Unselected state
      indicator.classList.remove('selected');
      indicator.classList.add('unselected');
    }
  }

  // eslint-disable-next-line no-console
  console.log('Asset class toggled:', assetData.name, 'Selected:', !isSelected);
}

export default function decorate(block) {
  // Extract data from the block
  const portfolioData = {
    title: null,
    chartData: null,
    assetClasses: null,
  };

  // Helper: get text content from the block's child by index
  function getTextFromChild(idx) {
    const child = block.children[idx];
    if (!child) return '';
    const p = child.querySelector('p');
    if (p) return p.textContent.trim();
    return child.textContent.trim();
  }

  // Extract data from children (fallback for AEM published markup)
  portfolioData.title = getTextFromChild(0) || null;

  // Try to get data from data-aue-prop attributes
  const propElements = block.querySelectorAll('[data-aue-prop]');
  if (propElements && propElements.length > 0) {
    propElements.forEach((element) => {
      const propName = element.getAttribute('data-aue-prop');
      const propType = element.getAttribute('data-aue-type');
      let value = null;

      if (propType === 'richtext') {
        value = element.innerHTML.trim() || element.textContent.trim();
      } else {
        value = element.textContent.trim();
      }

      if (propName === 'title') {
        portfolioData.title = value;
      } else if (propName === 'chartData') {
        portfolioData.chartData = value;
      } else if (propName === 'assetClasses') {
        portfolioData.assetClasses = value;
      }
    });
  }

  // Mock asset classes data
  const mockAssetClasses = [
    {
      name: 'Equities',
      percentage: '00%',
      selected: true,
      color: '#000000',
    },
    {
      name: 'Fixed Income',
      percentage: '00%',
      selected: true,
      color: '#000000',
    },
    {
      name: 'Real Estate',
      percentage: '00%',
      selected: false,
      color: '#000000',
    },
    {
      name: 'Infrastructure',
      percentage: '00%',
      selected: false,
      color: '#0273CF',
    },
    {
      name: 'Credit',
      percentage: '00%',
      selected: true,
      color: '#0273CF',
    },
  ];

  // Parse asset classes data if provided
  let assetClasses = mockAssetClasses;
  try {
    if (portfolioData.assetClasses && typeof portfolioData.assetClasses === 'string' && portfolioData.assetClasses.trim()) {
      const parsed = JSON.parse(portfolioData.assetClasses);
      if (Array.isArray(parsed)) {
        assetClasses = parsed;
      }
    } else if (portfolioData.assetClasses && Array.isArray(portfolioData.assetClasses)) {
      assetClasses = portfolioData.assetClasses;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse asset classes data:', error);
  }

  // Generate unique IDs
  const titleId = `portfolio-allocation-title-${Date.now()}`;
  const chartId = `portfolio-allocation-chart-${Date.now()}`;

  // Build title HTML
  const titleHtml = portfolioData.title
    ? `<h2 class="portfolio-allocation-title" id="${titleId}">${portfolioData.title}</h2>`
    : '';

  // Build asset class cards HTML
  const assetCardsHtml = assetClasses
    .map((asset, index) => {
      const isSelected = asset.selected !== false; // Default to true if not specified
      const indicatorClass = isSelected ? 'selected' : 'unselected';
      const borderColor = asset.color || '#000000';
      const cardClass = isSelected ? 'selected' : '';
      const fillStyle = isSelected ? `style="background-color: ${borderColor};"` : '';
      const indicatorStyle = `style="border-color: ${borderColor};"`;
      return `
        <div class="asset-class-card ${cardClass}" data-asset-index="${index}">
          <div class="asset-class-indicator ${indicatorClass}" ${indicatorStyle}>
            ${isSelected ? `<div class="indicator-fill" ${fillStyle}></div>` : ''}
          </div>
          <div class="asset-class-content">
            <div class="asset-class-name">${asset.name}</div>
            <div class="asset-class-percentage">${asset.percentage || '00%'}</div>
          </div>
        </div>
      `;
    })
    .join('');

  // Build main HTML structure
  const html = `
    <div class="portfolio-allocation-wrapper" role="region" aria-labelledby="${titleId}">
      ${titleHtml}
      <div class="portfolio-allocation-content">
        <div class="portfolio-allocation-chart-container">
          <div class="portfolio-allocation-chart" id="${chartId}"></div>
        </div>
        <div class="portfolio-allocation-assets">
          ${assetCardsHtml}
        </div>
      </div>
    </div>
  `;

  // Replace block content
  block.innerHTML = html;

  // Initialize chart
  initializePortfolioChart(chartId, portfolioData);

  // Add click handlers for asset class cards
  const assetCards = block.querySelectorAll('.asset-class-card');
  assetCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      handleAssetClassClick(card, assetClasses[index]);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAssetClassClick(card, assetClasses[index]);
      }
    });

    // Make cards focusable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Toggle ${assetClasses[index].name} selection`);
  });
}
