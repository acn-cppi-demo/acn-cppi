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

  // Generate random mock data for portfolio allocation (matching Figma design colors)
  const generateRandomChartData = () => {
    const segments = [
      { name: 'Equities', color: '#1E2127' },
      { name: 'Fixed Income', color: '#2C3D50' },
      { name: 'Real Estate', color: '#0052A4' },
      { name: 'Infrastructure', color: '#0273CF' },
      { name: 'Credit', color: '#D9E4FF' },
    ];

    // Generate random percentages that sum to 100
    const percentages = [];
    let remaining = 100;
    for (let i = 0; i < segments.length - 1; i += 1) {
      const max = remaining - (segments.length - i - 1) * 5; // Ensure at least 5% for remaining
      const min = 5;
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      percentages.push(value);
      remaining -= value;
    }
    percentages.push(remaining); // Last segment gets the remainder

    // Shuffle percentages for randomness
    for (let i = percentages.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [percentages[i], percentages[j]] = [percentages[j], percentages[i]];
    }

    return segments.map((segment, index) => ({
      name: segment.name,
      y: percentages[index],
      color: segment.color,
    }));
  };

  const mockChartData = generateRandomChartData();

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
      spacing: [0, 0, 0, 0], // Remove all padding: [top, right, bottom, left]
      margin: [0, 0, 0, 0], // Remove all margins: [top, right, bottom, left]
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
        borderWidth: 1,
        borderColor: '#FFFFFF',
        size: '100%', // Use full available space
        center: ['50%', '50%'], // Center the pie chart
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
        colorByPoint: true,
        innerSize: '60%',
        data: chartData.map((item) => ({
          ...item,
          opacity: 1, // Initial opacity, will be updated based on selection
        })),
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
 * Update chart to highlight selected segment (radio button behavior - only one selected)
 * @param {string} chartId - The chart container ID
 * @param {Array} assetClasses - Array of asset class objects with selected state
 */
function updateChartHighlight(chartId, assetClasses) {
  const chart = window[`highchart_${chartId}`];
  if (!chart || !chart.series || !chart.series[0]) {
    return;
  }

  const { points } = chart.series[0];

  // Find the selected asset class (radio button - only one selected)
  const selectedAsset = assetClasses.find((asset) => asset.selected === true);

  // Update each point based on asset class selection
  points.forEach((point) => {
    const assetClass = assetClasses.find((asset) => asset.name === point.name);
    if (assetClass) {
      const isSelected = assetClass === selectedAsset;
      // Set opacity: selected = 1, unselected = 0.3
      point.update({
        opacity: isSelected ? 1 : 0.3,
      }, false); // false = don't redraw yet
    }
  });

  // Redraw chart once after all updates
  chart.redraw();
}

/**
 * Handle asset class card click (radio button: only one selected, at least one always selected)
 * @param {Element} card - The clicked card element
 * @param {Object} assetData - The asset class data
 * @param {string} chartId - The chart container ID
 * @param {Array} assetClasses - Array of all asset classes
 * @param {NodeList} allCards - All asset class card elements
 */
function handleAssetClassClick(card, assetData, chartId, assetClasses, allCards) {
  // Radio button behavior: if already selected, do nothing (at least one must be selected)
  const isSelected = card.classList.contains('selected');
  if (isSelected) {
    return; // Don't allow deselecting if it's the only selected one
  }

  // Deselect all other cards (radio button behavior)
  allCards.forEach((otherCard, index) => {
    if (otherCard !== card) {
      otherCard.classList.remove('selected');
      assetClasses[index].selected = false;
      otherCard.setAttribute('aria-checked', 'false');

      // Update indicator for unselected cards
      const indicator = otherCard.querySelector('.asset-class-indicator');
      if (indicator) {
        indicator.classList.remove('selected');
        indicator.classList.add('unselected');
        const fill = indicator.querySelector('.indicator-fill');
        if (fill) {
          fill.remove();
        }
      }
    }
  });

  // Select the clicked card
  card.classList.add('selected');
  assetData.selected = true;
  card.setAttribute('aria-checked', 'true');

  // Update the radio button indicator for selected card
  const indicator = card.querySelector('.asset-class-indicator');
  if (indicator) {
    indicator.classList.add('selected');
    indicator.classList.remove('unselected');
    // Update indicator fill
    const fill = indicator.querySelector('.indicator-fill');
    if (!fill) {
      const fillDiv = document.createElement('div');
      fillDiv.className = 'indicator-fill';
      fillDiv.style.backgroundColor = assetData.color || '#000000';
      indicator.appendChild(fillDiv);
    }
  }

  // Update chart highlight
  updateChartHighlight(chartId, assetClasses);

  // eslint-disable-next-line no-console
  console.log('Asset class selected (radio):', assetData.name);
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

  // Generate random mock asset classes data (matching Figma design colors)
  const generateRandomAssetClasses = () => {
    const assetConfig = [
      { name: 'Equities', color: '#1E2127', defaultSelected: true },
      { name: 'Fixed Income', color: '#2C3D50', defaultSelected: true },
      { name: 'Real Estate', color: '#0052A4', defaultSelected: false },
      { name: 'Infrastructure', color: '#0273CF', defaultSelected: false },
      { name: 'Credit', color: '#D9E4FF', defaultSelected: true },
    ];

    return assetConfig.map((config) => {
      const percentage = Math.floor(Math.random() * 100);
      // Use default selected state but allow some randomness
      const selected = Math.random() > 0.3 ? config.defaultSelected : !config.defaultSelected;

      return {
        name: config.name,
        percentage: `${percentage.toString().padStart(2, '0')}%`,
        selected,
        color: config.color,
      };
    });
  };

  const mockAssetClasses = generateRandomAssetClasses();

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

  // Build title HTML with icon (matching Figma design)
  const titleHtml = portfolioData.title
    ? `
      <div class="portfolio-allocation-title-section">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.0154 21.45C8.58321 21.2063 6.55846 20.1826 4.94113 18.3787C3.32396 16.5749 2.51538 14.4487 2.51538 12C2.51538 9.55132 3.32396 7.42824 4.94113 5.63074C6.55846 3.8334 8.58321 2.80649 11.0154 2.54999V4.66524C9.17305 4.9179 7.6483 5.73782 6.44113 7.12499C5.23413 8.51215 4.63063 10.1372 4.63063 12C4.63063 13.8628 5.23413 15.4878 6.44113 16.875C7.6483 18.2622 9.17305 19.0821 11.0154 19.3347V21.45ZM13.0154 21.45V19.3347C14.6782 19.1347 16.0881 18.4447 17.2451 17.2645C18.4021 16.0843 19.1037 14.6628 19.3499 13H21.4651C21.2318 15.2487 20.3257 17.1641 18.7469 18.7462C17.168 20.3282 15.2575 21.2295 13.0154 21.45ZM19.3499 11C19.0974 9.33715 18.3942 7.9189 17.2404 6.74524C16.0865 5.5714 14.6782 4.87807 13.0154 4.66524V2.54999C15.2575 2.78332 17.168 3.6894 18.7469 5.26824C20.3257 6.84707 21.2318 8.75765 21.4651 11H19.3499Z" fill="white"/>
        </svg>

        <h2 class="portfolio-allocation-title" id="${titleId}">${portfolioData.title}</h2>
      </div>
    `
    : '';

  // Ensure at least one asset class is selected initially (radio button requirement)
  const hasSelected = assetClasses.some((asset) => asset.selected === true);
  if (!hasSelected && assetClasses.length > 0) {
    // Select the first one by default
    assetClasses[0].selected = true;
  }

  // Build asset class cards HTML (matching Figma layout)
  const assetCardsHtml = assetClasses
    .map((asset, index) => {
      const isSelected = asset.selected === true; // Radio button: only true means selected
      const indicatorClass = isSelected ? 'selected' : 'unselected';
      const fillColor = asset.color || '#000000';
      const cardClass = isSelected ? 'selected' : '';
      const fillStyle = isSelected ? `style="background-color: ${fillColor};"` : '';
      return `
        <div class="asset-class-card ${cardClass}" data-asset-index="${index}" role="radio" aria-checked="${isSelected ? 'true' : 'false'}" aria-label="Select ${asset.name}">
          <div class="asset-class-indicator-inner">
            <div class="asset-class-indicator ${indicatorClass}">
              ${isSelected ? `<div class="indicator-fill" ${fillStyle}></div>` : ''}
            </div>
            <div class="asset-class-name">${asset.name}</div>
          </div>
          <div class="asset-class-content">
            <div class="asset-class-percentage">${asset.percentage || '00%'}</div>
          </div>
        </div>
      `;
    })
    .join('');

  // Check if wrapper already exists (AEM might add it automatically)
  // Check if block's parent has the wrapper class
  const parentHasWrapper = block.parentElement?.classList.contains('portfolio-allocation-wrapper');
  const blockIsWrapper = block.classList.contains('portfolio-allocation-wrapper');

  // Build inner content (without wrapper if it already exists)
  const innerContent = `
    ${titleHtml}
    <div class="portfolio-allocation-content">
      <div class="portfolio-allocation-chart-container">
        <div class="portfolio-allocation-chart" id="${chartId}"></div>
      </div>
      <div class="portfolio-allocation-assets">
        ${assetCardsHtml}
      </div>
    </div>
  `;

  // If parent already has wrapper, add content directly to block and update parent attributes
  if (parentHasWrapper) {
    // Add role and aria-label to parent wrapper
    block.parentElement.setAttribute('role', 'region');
    block.parentElement.setAttribute('aria-labelledby', titleId);
    // Add content directly to block (no wrapper needed)
    block.innerHTML = innerContent;
  } else if (blockIsWrapper) {
    // Block itself is the wrapper
    block.setAttribute('role', 'region');
    block.setAttribute('aria-labelledby', titleId);
    block.innerHTML = innerContent;
  } else {
    // Create new wrapper
    const html = `
      <div class="portfolio-allocation-wrapper" role="region" aria-labelledby="${titleId}">
        ${innerContent}
      </div>
    `;
    block.innerHTML = html;
  }

  // Initialize chart
  initializePortfolioChart(chartId, portfolioData);

  // Update chart after initialization to set initial highlight state
  setTimeout(() => {
    updateChartHighlight(chartId, assetClasses);
  }, 100);

  // Initial state is already set in HTML generation above, so cards are already rendered correctly

  // Add click handlers for asset class cards (radio button behavior)
  const assetCards = block.querySelectorAll('.asset-class-card');
  assetCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      handleAssetClassClick(card, assetClasses[index], chartId, assetClasses, assetCards);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAssetClassClick(card, assetClasses[index], chartId, assetClasses, assetCards);
      }
    });

    // Make cards focusable and set radio button role
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', assetClasses[index].selected === true ? 'true' : 'false');
    card.setAttribute('aria-label', `Select ${assetClasses[index].name}`);
  });
}
