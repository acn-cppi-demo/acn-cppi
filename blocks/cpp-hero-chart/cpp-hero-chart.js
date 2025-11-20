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
 * Get default dummy line chart configuration
 * @returns {Object} Default Highcharts configuration
 */
function getDummyLineChartConfig() {
  return {
    chart: {
      type: 'line',
      height: 170,
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    xAxis: {
      // show only the axis baseline (no labels or ticks)
      labels: { enabled: false },
      lineWidth: 1,
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickLength: 0,
      tickWidth: 0,
      minorTickLength: 0,
    },
    yAxis: {
      title: { text: null },
      labels: { enabled: false },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    plotOptions: {
      series: {
        dataLabels: { enabled: false },
        enableMouseTracking: false,
        marker: { enabled: false },
        color: 'var(--CPPI-White, #FFFFFF)',
        lineWidth: 2,
      },
    },
    series: [
      {
        name: 'Value',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 354.4],
        color: 'var(--CPPI-White, #FFFFFF)',
        lineWidth: 2,
      },
    ],
    credits: {
      enabled: false,
    },
    legend: { enabled: false },
    tooltip: { enabled: false },
  };
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
    if (typeof data.chartData === 'string' && data.chartData.trim()) {
      chartOptions = JSON.parse(data.chartData);
    } else if (typeof data.chartData === 'object' && data.chartData) {
      chartOptions = data.chartData;
    } else {
      // Use dummy line chart if no data provided
      chartOptions = getDummyLineChartConfig();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error);
    // Fall back to dummy chart
    chartOptions = getDummyLineChartConfig();
  }

  // Merge with default Highcharts configuration
  const config = {
    chart: {
      type: 'area',
      height: 170,
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
  // Extract all data from the block into a JSON object.
  // Prefer authoring attributes (data-aue-prop) when available, but fall
  // back to parsing the sequential child <div> structure that AEM publishes
  // on the live site (no data attributes).
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

  // Helper: plain text from HTML string
  const getPlainText = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent.trim();
  };

  // Helper: get text content from the block's child by index
  function getTextFromChild(idx) {
    const child = block.children[idx];
    if (!child) return '';
    const p = child.querySelector('p');
    if (p) return p.textContent.trim();
    return child.textContent.trim();
  }

  // Helper: extract picture/img info from the block's child by index
  function getPictureFromChild(idx) {
    const child = block.children[idx];
    if (!child) return null;
    const pic = child.querySelector('picture');
    if (!pic) return null;
    const img = pic.querySelector('img');
    if (!img) return null;
    return {
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || '',
      srcset: img.getAttribute('srcset') || '',
    };
  }

  // First attempt: read props from data-aue-prop (authoring metadata)
  const propElements = block.querySelectorAll('[data-aue-prop]');
  if (propElements && propElements.length > 0) {
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
  } else {
    // Fallback: AEM published markup typically places each authored field
    // inside a sequential child <div>. Map by index based on the sample HTML.
    // (helpers are defined at function root so linting rules are satisfied)

    // Index mapping (based on provided HTML sample):
    // 0 - title
    // 1 - description
    // 2 - CTA text
    // 3 - CTA href (sometimes rendered as text)
    // 4 - picture
    // 5 - graph label
    // 6 - value
    // 7 - badge / change
    // 8 - timeframe (e.g., 3M)
    cppHeroChartData.title = getTextFromChild(0) || null;
    cppHeroChartData.description = getTextFromChild(1) || null;
    cppHeroChartData.buttonLabel = getTextFromChild(2) || null;
    // Try to find an <a> inside the CTA child for href; otherwise, use child text
    const ctaChild = block.children[2];
    if (ctaChild) {
      const a = ctaChild.querySelector('a[href]');
      if (a) cppHeroChartData.buttonLink = a.getAttribute('href');
      else cppHeroChartData.buttonLink = getTextFromChild(3) || null;
    }
    const pic = getPictureFromChild(4);
    if (pic) {
      cppHeroChartData.graphImage = pic.src;
      cppHeroChartData.graphImageAlt = pic.alt;
    }
    cppHeroChartData.graphText = getTextFromChild(5) || null;
    cppHeroChartData.value = getTextFromChild(6) || null;
    cppHeroChartData.badge = getTextFromChild(7) || null;
    cppHeroChartData.selectedPeriod = getTextFromChild(8) || cppHeroChartData.selectedPeriod;
  }

  // Generate unique IDs for accessibility
  const titleId = `cpp-hero-chart-title-${Date.now()}`;
  const descriptionId = `cpp-hero-chart-description-${Date.now()}`;
  const chartId = `cpp-hero-chart-${Date.now()}`;

  // Plain text versions for rendered template
  const titleText = getPlainText(cppHeroChartData.title);
  const descriptionText = getPlainText(cppHeroChartData.description);

  // Build button HTML
  let buttonHtml = '';
  if (cppHeroChartData.buttonLabel) {
    const hasHref = cppHeroChartData.buttonLink && cppHeroChartData.buttonLink !== '#';
    if (hasHref) {
      buttonHtml = `<a href="${cppHeroChartData.buttonLink}" class="button button-secondary">${cppHeroChartData.buttonLabel}</a>`;
    } else {
      buttonHtml = `<button type="button" class="button button-secondary" disabled aria-disabled="true">${cppHeroChartData.buttonLabel}</button>`;
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

  // Build Learn More link (separate from the primary CTA button)
  let learnMoreHtml = '';
  if (cppHeroChartData.buttonLink) {
    learnMoreHtml = `
      <div class="cpp-hero-chart-learnmore-wrapper">
        <a class="cpp-hero-chart-learnmore" href="${cppHeroChartData.buttonLink}">Learn More <span class="cpp-hero-chart-learnmore-arrow" aria-hidden="true">→</span></a>
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

      <!-- Panel grouping controls, value and chart (left aligned, max-width 840px) -->
      <div class="cpp-hero-chart-panel">
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
        ${learnMoreHtml}
      </div>
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

  // Initialize Highcharts with provided data or dummy line chart
  initializeChart(chartId, cppHeroChartData);
}
