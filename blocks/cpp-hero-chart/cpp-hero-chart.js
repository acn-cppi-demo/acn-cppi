/**
 * Update chart data based on selected period
 * @param {Object} data - The chart data object
 * @param {string} period - The selected period
 */
function updateChart(data, period) {
  // This function should be customized based on your data fetching strategy
  // For now, it's a placeholder for future implementation

  // Example implementation:
  // 1. Fetch new data from an API based on the period
  // 2. Update the chart with new data
  // 3. Animate the transition

  // eslint-disable-next-line no-console
  console.log('Updating chart for period:', period);

  // TODO: Implement actual data update logic
  // This might involve:
  // - Calling an API endpoint with the selected period
  // - Transforming the data to match Highcharts format
  // - Updating the chart instance with new series data
}

/**
 * Handle period tab changes
 * @param {string} period - The selected period (3M, 6M, 1Y, 2Y, 5Y)
 * @param {Element} block - The block element
 * @param {Object} data - The chart data object
 */
function handlePeriodChange(period, block, data) {
  // Update active tab styling
  const tabs = block.querySelectorAll('.period-tab');
  tabs.forEach((tab) => {
    const isActive = tab.dataset.period === period;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', isActive);
  });

  // Update selected period
  data.selectedPeriod = period;

  // Trigger chart update
  updateChart(data, period);

  // eslint-disable-next-line no-console
  console.log('Period changed to:', period);
}

/**
 * Initialize Highcharts
 * @param {string} chartId - The chart container ID
 * @param {Object} data - The chart data object
 */
function initializeChart(chartId, data) {
  // Check if Highcharts is available
  if (typeof window.Highcharts === 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('Highcharts library not loaded');

    // Render a placeholder or error message
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="cpp-hero-chart-error">Chart library not available. Please ensure Highcharts is loaded.</div>';
    }
    return;
  }

  // Parse chart data (assumed to be JSON string)
  let chartOptions = {};
  try {
    if (typeof data.chartData === 'string') {
      chartOptions = JSON.parse(data.chartData);
    } else {
      chartOptions = data.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error);

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="cpp-hero-chart-error">Invalid chart configuration.</div>';
    }
    return;
  }

  // Merge with default Highcharts configuration
  const config = {
    chart: {
      type: 'area',
      height: 400,
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
      align: 'bottom',
    },
    ...chartOptions,
  };

  // Create the chart
  try {
    const chart = window.Highcharts.chart(chartId, config);
    // Store chart instance for later updates
    window[`highchart_${chartId}`] = chart;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Highchart:', error);

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="cpp-hero-chart-error">Error rendering chart. Please check the configuration.</div>';
    }
  }
}

export default function decorate(block) {
  // Extract all data from the block into a JSON object
  const cppHeroChartData = {
    title: null,
    description: null,
    buttonLabel: null,
    buttonLink: null,
    graphImage: null,
    graphImageAlt: null,
    graphText: null,
    chartData: null,
    value: null,
    badge: null,
    periods: ['3M', '6M', '1Y', '2Y', '5Y'],
    selectedPeriod: '1Y',
  };

  // Find all elements with data-aue-prop attributes
  const propElements = block.querySelectorAll('[data-aue-prop]');
  propElements.forEach((element) => {
    const propName = element.getAttribute('data-aue-prop');
    const propType = element.getAttribute('data-aue-type');
    let value = null;

    // Extract value based on type
    if (propType === 'richtext') {
      value = element.innerHTML.trim() || element.textContent.trim();
    } else if (propType === 'text') {
      value = element.textContent.trim();
    } else {
      value = element.textContent.trim();
    }

    // Map to cppHeroChartData object
    if (propName === 'title') {
      cppHeroChartData.title = value;
    } else if (propName === 'description') {
      cppHeroChartData.description = value;
    } else if (propName === 'buttonLabel') {
      cppHeroChartData.buttonLabel = value;
    } else if (propName === 'buttonLink') {
      cppHeroChartData.buttonLink = element.getAttribute('href') || value;
    } else if (propName === 'graphImage') {
      cppHeroChartData.graphImage = value;
    } else if (propName === 'graphImageAlt') {
      cppHeroChartData.graphImageAlt = value;
    } else if (propName === 'graphText') {
      cppHeroChartData.graphText = value;
    } else if (propName === 'chartData') {
      cppHeroChartData.chartData = value;
    } else if (propName === 'value') {
      cppHeroChartData.value = value;
    } else if (propName === 'badge') {
      cppHeroChartData.badge = value;
    } else if (propName === 'selectedPeriod') {
      cppHeroChartData.selectedPeriod = value || '1Y';
    }
  });

  // Extract button link from <a> tag if not set
  if (!cppHeroChartData.buttonLink) {
    const buttonLink = block.querySelector('a[href]');
    if (buttonLink) {
      cppHeroChartData.buttonLink = buttonLink.getAttribute('href');
    }
  }

  // Store the JSON object for reference
  const cppHeroChartJson = JSON.stringify(cppHeroChartData, null, 2);

  // eslint-disable-next-line no-console
  console.log('CPP Hero Chart Data JSON:', cppHeroChartJson);
  // eslint-disable-next-line no-console
  console.log('CPP Hero Chart Data Object:', cppHeroChartData);

  // Helper function to extract plain text from HTML
  const getPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent.trim();
  };

  const titleText = getPlainText(cppHeroChartData.title);
  const descriptionText = getPlainText(cppHeroChartData.description);

  // Generate unique IDs for accessibility
  const titleId = `cpp-hero-chart-title-${Date.now()}`;
  const descriptionId = `cpp-hero-chart-description-${Date.now()}`;
  const chartId = `cpp-hero-chart-${Date.now()}`;

  // Build button HTML
  let buttonHtml = '';
  if (cppHeroChartData.buttonLabel) {
    const hasHref = cppHeroChartData.buttonLink && cppHeroChartData.buttonLink !== '#';
    if (hasHref) {
      buttonHtml = `<a href="${cppHeroChartData.buttonLink}" class="button button-primary">${cppHeroChartData.buttonLabel}</a>`;
    } else {
      buttonHtml = `<button type="button" class="button button-primary" disabled aria-disabled="true">${cppHeroChartData.buttonLabel}</button>`;
    }
  }

  // Build period tabs HTML
  const periodTabsHtml = cppHeroChartData.periods
    .map((period) => {
      const isActive = period === cppHeroChartData.selectedPeriod ? 'active' : '';
      return `<button class="period-tab ${isActive}" data-period="${period}" aria-pressed="${period === cppHeroChartData.selectedPeriod}">${period}</button>`;
    })
    .join('');

  // Build graph info section HTML
  let graphInfoHtml = '';
  if (cppHeroChartData.graphImage || cppHeroChartData.graphText) {
    graphInfoHtml = `
      <div class="cpp-hero-chart-graph-info">
        ${cppHeroChartData.graphImage ? `<img src="${cppHeroChartData.graphImage}" alt="${cppHeroChartData.graphImageAlt || 'Graph'}" />` : ''}
        ${cppHeroChartData.graphText ? `<span class="graph-text">${cppHeroChartData.graphText}</span>` : ''}
      </div>
    `;
  }

  // Build value and badge section HTML
  let valueHtml = '';
  if (cppHeroChartData.value) {
    valueHtml = `
      <div class="cpp-hero-chart-value-section">
        <div class="cpp-hero-chart-value">${cppHeroChartData.value}</div>
        ${cppHeroChartData.badge ? `<div class="cpp-hero-chart-badge">${cppHeroChartData.badge}</div>` : ''}
      </div>
    `;
  }

  // Build main HTML structure
  const descAttr = cppHeroChartData.description ? ` aria-describedby="${descriptionId}"` : '';

  const html = `
    <div class="cpp-hero-chart-wrapper" role="region" aria-labelledby="${titleId}"${descAttr}>
      <!-- Header Section -->
      <div class="cpp-hero-chart-header">
        <div class="cpp-hero-chart-main">
          ${cppHeroChartData.title ? `<h2 class="cpp-hero-chart-title" id="${titleId}">${titleText}</h2>` : ''}
          ${cppHeroChartData.description ? `<p class="cpp-hero-chart-description" id="${descriptionId}">${descriptionText}</p>` : ''}
          ${buttonHtml}
        </div>
      </div>

      <!-- Controls Section (Graph Info + Period Tabs) -->
      <div class="cpp-hero-chart-controls">
        ${graphInfoHtml}
        <div class="cpp-hero-chart-periods" role="tablist" aria-label="Time period selector">
          ${periodTabsHtml}
        </div>
      </div>

      <!-- Value with Badge Section -->
      ${valueHtml}

      <!-- Chart Container -->
      <div class="cpp-hero-chart" id="${chartId}"></div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;

  // Initialize period tab event listeners
  const periodTabs = block.querySelectorAll('.period-tab');
  periodTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      handlePeriodChange(e.target.dataset.period, block, cppHeroChartData);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePeriodChange(e.target.dataset.period, block, cppHeroChartData);
      }
    });
  });

  // Initialize Highcharts if data is available
  if (cppHeroChartData.chartData) {
    initializeChart(chartId, cppHeroChartData);
  }
}
