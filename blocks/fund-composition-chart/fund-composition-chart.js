// Shared default chart data for fallback when no chart data is provided
const DEFAULT_CHART_DATA = {
  categories: ['2021', '2022', '2023', '2024', '2025'],
  series: [
    {
      name: 'Public Equity',
      data: [149.2, 150.9, 148.2, 158.1, 164.3],
      color: '#0052A4',
    },
    {
      name: 'Private Equity',
      data: [119.3, 140.1, 159.6, 189.7, 221.5],
      color: '#0273CF',
    },
    {
      name: 'Government Bonds',
      data: [99.4, 97, 96.9, 101.2, 121.4],
      color: '#3E97FF',
    },
    {
      name: 'Credit',
      data: [49.7, 64.7, 74.1, 82.2, 92.9],
      color: '#99BCFF',
    },
    {
      name: 'Real Estate',
      data: [39.8, 43.1, 45.6, 50.6, 57.2],
      color: '#E3E4E5',
    },
    {
      name: 'Infrastructure',
      data: [39.8, 43.1, 45.6, 50.6, 57.2],
      color: '#2C3D50',
    },
  ],
  min: 0,
  max: 800,
  tickInterval: 100,
};

/**
 * Initialize Fund Composition stacked column chart
 * @param {string} chartId - The chart container ID
 * @param {Object} data - The chart data object
 */
async function initializeCompositionChart(chartId, data) {
  // Dynamically load Highcharts if not available
  if (typeof window.Highcharts === 'undefined') {
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="fund-composition-chart-error">Loading chart...</div>';
    }

    try {
      // Import loadHighcharts from aem.js
      const { loadHighcharts } = await import(`${window.hlx.codeBasePath}/scripts/aem.js`);
      await loadHighcharts();

      // Verify Highcharts is loaded
      if (typeof window.Highcharts === 'undefined') {
        throw new Error('Highcharts failed to load');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load Highcharts:', error);
      const errorContainer = document.getElementById(chartId);
      if (errorContainer) {
        errorContainer.innerHTML = '<div class="fund-composition-chart-error">Chart library not available. Please refresh the page.</div>';
      }
      return;
    }
  }

  // Chart data is already parsed and passed from decorate function
  const chartData = (data.chartData && data.chartData.categories)
    ? data.chartData : DEFAULT_CHART_DATA;

  // Use provided min/max/interval or defaults
  const yAxisMin = chartData.min || 0;
  const yAxisMax = chartData.max || 800;
  const yAxisTickInterval = chartData.tickInterval || 100;

  // Determine chart height based on screen size
  const isMobile = window.innerWidth <= 480;
  const chartHeight = isMobile ? 350 : 432;

  // Calculate groupPadding for 40px spacing between columns
  // Highcharts groupPadding is percentage-based (0-1) of category width
  // For approximately 40px spacing, we use a higher padding value
  // This creates visible gaps between the year columns
  const groupPaddingValue = 0.3;

  // Highcharts configuration for stacked column chart
  const config = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      spacing: [20, 0, 20, 0], // [top, right, bottom, left]
      reflow: true,
      width: null,
      height: chartHeight,
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    accessibility: {
      enabled: true,
      description: 'Five-year historical fund composition by asset class showing stacked columns from 2021 to 2025. Use arrow keys to navigate between data points.',
      keyboardNavigation: {
        enabled: true,
      },
      point: {
        descriptionFormatter(point) {
          const { name, y, series } = point;
          return `${series.name} for ${name}: $${y.toFixed(1)}B`;
        },
        valueDescriptionFormat: '{index}. {point.series.name} for {point.category}: {point.y}B.',
      },
    },
    xAxis: {
      categories: chartData.categories,
      lineWidth: 0,
      lineColor: 'transparent',
      tickWidth: 0,
      offset: 0,
      labels: {
        style: {
          color: '#2C3D50',
          fontSize: '14px',
          fontFamily: "'Open Sans', sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      min: yAxisMin,
      max: yAxisMax,
      tickInterval: yAxisTickInterval,
      gridLineWidth: 1,
      gridLineColor: '#E3E4E5',
      lineWidth: 0,
      lineColor: 'transparent',
      labels: {
        format: '{value}B',
        style: {
          color: '#6F7176',
          fontSize: '14px',
          fontFamily: "'Open Sans', sans-serif",
        },
      },
    },
    legend: {
      enabled: false, // Disable Highcharts legend, we'll use custom HTML legend
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E3E4E5',
      borderWidth: 1,
      borderRadius: 8,
      style: {
        color: '#2C3D50',
        fontSize: '14px',
        fontFamily: "'Open Sans', sans-serif",
      },
      shared: true,
      formatter() {
        let tooltip = `<b>${this.x}</b><br/>`;
        let total = 0;
        this.points.forEach((point) => {
          total += point.y;
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>$${point.y.toFixed(1)}B</b><br/>`;
        });
        tooltip += `<br/><b>Total: $${total.toFixed(1)}B</b>`;
        return tooltip;
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderRadius: 0,
        borderWidth: 0,
        groupPadding: groupPaddingValue,
        pointPadding: 0.1,
        dataLabels: {
          enabled: false,
        },
        states: {
          hover: {
            brightness: 0.1,
          },
        },
      },
    },
    series: chartData.series.reverse().map((series) => ({
      name: series.name,
      data: series.data,
      color: series.color || '#0273CF',
    })),
  };

  // Create the chart
  try {
    const chart = window.Highcharts.chart(chartId, config);
    window[`highchart_${chartId}`] = chart;

    // Update chart height on window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isMobileNow = window.innerWidth <= 480;
        const newHeight = isMobileNow ? 350 : 432;
        if (chart && chart.chartHeight !== newHeight) {
          chart.setSize(null, newHeight, false);
        }
      }, 250);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Fund Composition chart:', error);
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="fund-composition-chart-error">Error rendering chart. Please check the configuration.</div>';
    }
  }
}

export default function decorate(block) {
  // Extract data from the block
  const compositionData = {
    title: null,
    chartData: null,
  };

  // Helper: get text content from the block's child by index
  function getTextFromChild(idx) {
    const child = block.children[idx];
    if (!child) return '';

    // Check for <pre><code> or <code> first (common for code blocks)
    const code = child.querySelector('pre code, code');
    if (code) return code.textContent.trim();

    // Fallback to <p> tag
    const p = child.querySelector('p');
    if (p) return p.textContent.trim();

    // Last resort: get all text content
    return child.textContent.trim();
  }

  // Extract title (first child)
  compositionData.title = getTextFromChild(0) || 'Five-Year Historical Fund Composition by Asset Class';

  // Extract chart data (second child) - JSON string
  const chartDataText = getTextFromChild(1);

  // Try to get data from data-aue-prop attributes (AEM editor)
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
        compositionData.title = value;
      } else if (propName === 'chartData') {
        compositionData.chartData = value;
      }
    });
  }
  // Fallback: parse from block children
  if (chartDataText && !compositionData.chartData) {
    try {
      compositionData.chartData = chartDataText;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to extract chart data:', error);
    }
  }

  // Parse chart data - single source of truth for both chart and legend
  let chartData = DEFAULT_CHART_DATA;
  try {
    if (compositionData.chartData && typeof compositionData.chartData === 'string' && compositionData.chartData.trim()) {
      let parsed;
      try {
        // Try parsing directly first
        parsed = JSON.parse(compositionData.chartData);
      } catch (parseError) {
        // If direct parse fails, clean up the JSON string
        let cleanJson = compositionData.chartData.trim();

        // Remove HTML entities and decode them
        cleanJson = cleanJson.replace(/&nbsp;/g, ' ');
        cleanJson = cleanJson.replace(/&quot;/g, '"');
        cleanJson = cleanJson.replace(/&#34;/g, '"');
        cleanJson = cleanJson.replace(/&#39;/g, "'");
        cleanJson = cleanJson.replace(/&apos;/g, "'");
        cleanJson = cleanJson.replace(/<br\s*\/?>/gi, ' ');
        cleanJson = cleanJson.replace(/<pre[^>]*>/gi, '');
        cleanJson = cleanJson.replace(/<\/pre>/gi, '');
        cleanJson = cleanJson.replace(/<code[^>]*>/gi, '');
        cleanJson = cleanJson.replace(/<\/code>/gi, '');

        // Normalize line breaks
        cleanJson = cleanJson.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove single-line comments
        cleanJson = cleanJson.replace(/\/\/[^\n]*/g, '');

        // Normalize whitespace
        cleanJson = cleanJson.replace(/\n/g, ' ');
        cleanJson = cleanJson.replace(/\s+/g, ' ');
        cleanJson = cleanJson.trim();

        // Quote unquoted property names if needed
        const hasQuotedProps = /[{,]\s*"[a-zA-Z_$][a-zA-Z0-9_$]*"\s*:/.test(cleanJson);
        if (!hasQuotedProps) {
          cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        }

        // Remove trailing commas
        cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1');

        parsed = JSON.parse(cleanJson);
      }

      if (parsed.categories && parsed.series) {
        chartData = parsed;
      }
    } else if (compositionData.chartData && typeof compositionData.chartData === 'object' && compositionData.chartData.categories) {
      chartData = compositionData.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error, 'Raw data:', compositionData.chartData);
  }

  // Store parsed chartData back for chart initialization
  compositionData.chartData = chartData;

  // Generate unique IDs
  const titleId = `fund-composition-chart-title-${Date.now()}`;
  const chartId = `fund-composition-chart-${Date.now()}`;

  // Build legend HTML from chart data (single source of truth)
  // Series order matches chart stacking (first in array = bottom of stack)
  const legendItems = chartData.series.map((series) => `
    <div class="fund-composition-chart-legend-item">
      <span class="fund-composition-chart-legend-symbol" style="background-color: ${series.color || '#0273CF'};"></span>
      <span class="fund-composition-chart-legend-label">${series.name}</span>
    </div>
  `).join('');

  // Check if wrapper already exists
  const parentHasWrapper = block.parentElement?.classList.contains('fund-composition-chart-wrapper');
  const blockIsWrapper = block.classList.contains('fund-composition-chart-wrapper');

  // Build inner content HTML
  const innerContent = `
    <div class="fund-composition-chart-content">
      <div class="fund-composition-chart-header">
        <h3 class="fund-composition-chart-title" id="${titleId}">${compositionData.title}</h3>
      </div>
      <div class="fund-composition-chart-container">
        <div class="fund-composition-chart" id="${chartId}"></div>
      </div>
      <div class="fund-composition-chart-legend">
        ${legendItems}
      </div>
    </div>
  `;

  // If parent already has wrapper, add content directly to block
  if (parentHasWrapper) {
    block.parentElement.setAttribute('role', 'region');
    block.parentElement.setAttribute('aria-labelledby', titleId);
    block.innerHTML = innerContent;
  } else if (blockIsWrapper) {
    // Block itself is the wrapper
    block.setAttribute('role', 'region');
    block.setAttribute('aria-labelledby', titleId);
    block.innerHTML = innerContent;
  } else {
    // Create new wrapper
    const html = `
      <div class="fund-composition-chart-wrapper" role="region" aria-labelledby="${titleId}">
        ${innerContent}
      </div>
    `;
    block.innerHTML = html;
  }

  // Lazy load chart initialization function
  const lazyInitChart = () => {
    initializeCompositionChart(chartId, compositionData).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Chart initialization failed:', error);
    });
  };

  // Use IntersectionObserver to load chart only when visible
  const chartContainer = block.querySelector('.fund-composition-chart-container');
  if (chartContainer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lazyInitChart();
          observer.disconnect();
        }
      });
    }, { rootMargin: '100px' });
    observer.observe(chartContainer);
  } else if ('requestIdleCallback' in window) {
    // Fallback - defer to idle time
    requestIdleCallback(lazyInitChart, { timeout: 2000 });
  } else {
    setTimeout(lazyInitChart, 100);
  }
}
