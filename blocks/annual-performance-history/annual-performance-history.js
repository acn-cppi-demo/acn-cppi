/**
 * Initialize Annual Performance History column chart
 * @param {string} chartId - The chart container ID
 * @param {Object} data - The chart data object
 */
async function initializePerformanceChart(chartId, data) {
  // Dynamically load Highcharts if not available
  if (typeof window.Highcharts === 'undefined') {
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="annual-performance-history-error">Loading chart...</div>';
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
        errorContainer.innerHTML = '<div class="annual-performance-history-error">Chart library not available. Please refresh the page.</div>';
      }
      return;
    }
  }

  // Mock data matching Figma design
  const mockChartData = {
    categories: ['2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      {
        name: 'CPP Investments Return',
        data: [2.5, 16.8, -3.2, 10.5, 9.3, 3.1],
        color: '#0273CF', // Blue color for CPP Investments
      },
      {
        name: 'Benchmark Return',
        data: [2.1, 15.2, -4.5, 9.8, 8.9, 2.8],
        color: '#2C3D50', // Dark grey for Benchmark
      },
    ],
  };

  // Chart data is already parsed and passed from decorate function
  // Use the chartData directly from data parameter
  const chartData = (data.chartData && data.chartData.categories) ? data.chartData : mockChartData;

  // Determine chart height based on screen size
  const isMobile = window.innerWidth <= 480;
  const chartHeight = isMobile ? 230 : 300;

  // Highcharts configuration
  const config = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      spacing: [20, 0, 20, 0], // [top, right, bottom, left] - remove left and right spacing
      reflow: true, // Enable responsive reflow
      width: null, // Auto width
      height: chartHeight, // Responsive height: 250px on mobile, 300px on desktop
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false, // Disable export menu
    },
    accessibility: {
      enabled: true,
      description: 'Annual Performance History chart showing CPP Investments Return and Benchmark Return from 2020 to 2025. Use arrow keys to navigate between data points.',
      keyboardNavigation: {
        enabled: true,
      },
      point: {
        descriptionFormatter(point) {
          const { name, y, series } = point;
          return `${series.name} for ${name}: ${y > 0 ? '+' : ''}${y}`;
        },
        valueDescriptionFormat: '{index}. {point.series.name} for {point.category}: {point.y}.',
      },
      screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5><div>{chartSubtitle}</div><div>{chartLongdesc}</div>',
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
      min: -7,
      max: 21,
      tickInterval: 7,
      gridLineWidth: 1,
      gridLineColor: '#E3E4E5',
      lineWidth: 0,
      lineColor: 'transparent',
      labels: {
        format: '{value}',
        style: {
          color: '#2C3D50',
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
      borderRadius: 4,
      style: {
        color: '#2C3D50',
        fontSize: '14px',
        fontFamily: "'Open Sans', sans-serif",
      },
      shared: true,
      formatter() {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points.forEach((point) => {
          const value = point.y > 0 ? `+${point.y}` : point.y;
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${value}</b><br/>`;
        });
        return tooltip;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        borderWidth: 0,
        groupPadding: 0.2,
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
    series: chartData.series.map((series) => ({
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
        const newHeight = isMobileNow ? 250 : 300;
        if (chart && chart.chartHeight !== newHeight) {
          chart.setSize(null, newHeight, false);
        }
      }, 250);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Annual Performance History chart:', error);
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="annual-performance-history-error">Error rendering chart. Please check the configuration.</div>';
    }
  }
}

export default function decorate(block) {
  // Extract data from the block
  const performanceData = {
    title: null,
    chartData: null,
    footnote: null,
  };

  // Helper: get text content from the block's child by index
  function getTextFromChild(idx) {
    const child = block.children[idx];
    if (!child) return '';
    const p = child.querySelector('p');
    if (p) return p.textContent.trim();
    return child.textContent.trim();
  }

  // Extract title (first child)
  performanceData.title = getTextFromChild(0) || 'Annual Performance History';

  // Extract chart data (second child) - JSON string - single source of truth
  const chartDataText = getTextFromChild(1);

  // Extract footnote (third child)
  const footnoteText = getTextFromChild(2);

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
        performanceData.title = value;
      } else if (propName === 'chartData') {
        performanceData.chartData = value;
      } else if (propName === 'footnote') {
        performanceData.footnote = value;
      }
    });
  } else {
    // Fallback: parse from block children
    if (chartDataText) {
      try {
        performanceData.chartData = chartDataText;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to extract chart data:', error);
      }
    }

    if (footnoteText) {
      performanceData.footnote = footnoteText;
    }
  }

  // Mock data structure (single source for both chart and legend)
  const mockChartData = {
    categories: ['2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      {
        name: 'CPP Investments Return',
        data: [2.5, 16.8, -8.2, 10.5, 9.3, 3.1],
        color: '#0273CF',
      },
      {
        name: 'Benchmark Return',
        data: [2.1, 15.2, -7.5, 9.8, 8.9, 2.8],
        color: '#2C3D50',
      },
    ],
  };

  // Parse chart data - single source of truth for both chart and legend
  let chartData = mockChartData;
  try {
    if (performanceData.chartData && typeof performanceData.chartData === 'string' && performanceData.chartData.trim()) {
      const parsed = JSON.parse(performanceData.chartData);
      if (parsed.categories && parsed.series) {
        chartData = parsed;
      }
    } else if (performanceData.chartData && typeof performanceData.chartData === 'object' && performanceData.chartData.categories) {
      chartData = performanceData.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error);
  }

  // Store parsed chartData back for chart initialization
  performanceData.chartData = chartData;

  // Generate unique IDs
  const titleId = `annual-performance-history-title-${Date.now()}`;
  const chartId = `annual-performance-history-chart-${Date.now()}`;

  // Build legend HTML from chart data (single source of truth)
  const legendItems = chartData.series.map((series) => `
    <div class="annual-performance-history-legend-item">
      <span class="annual-performance-history-legend-symbol" style="background-color: ${series.color || '#0273CF'};"></span>
      <span class="annual-performance-history-legend-label">${series.name}</span>
    </div>
  `).join('');

  // Check if wrapper already exists
  const parentHasWrapper = block.parentElement?.classList.contains('annual-performance-history-wrapper');
  const blockIsWrapper = block.classList.contains('annual-performance-history-wrapper');

  // Build inner content HTML
  const innerContent = `
        <div class="annual-performance-history-content">
          <div class="annual-performance-history-header">
            <div class="annual-performance-history-title-wrapper">
              <h2 class="annual-performance-history-title" id="${titleId}">${performanceData.title}</h2>
            </div>
            <div class="annual-performance-history-legend annual-performance-history-legend-desktop">
              ${legendItems}
            </div>
          </div>
          <div class="annual-performance-history-chart-container">
            <div class="annual-performance-history-chart" id="${chartId}"></div>
          </div>
          <div class="annual-performance-history-legend annual-performance-history-legend-mobile">
            ${legendItems}
          </div>
        </div>
        ${performanceData.footnote ? `<div class="annual-performance-history-footnote">${performanceData.footnote}</div>` : ''}
      `;

  // If parent already has wrapper, add content directly to block and update parent attributes
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
      <div class="annual-performance-history-wrapper" role="region" aria-labelledby="${titleId}">
        ${innerContent}
      </div>
    `;
    block.innerHTML = html;
  }

  // Lazy load chart initialization function
  const lazyInitChart = () => {
    initializePerformanceChart(chartId, performanceData).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Chart initialization failed:', error);
    });
  };

  // Use IntersectionObserver to load chart only when visible
  const chartContainer = block.querySelector('.annual-performance-history-chart-container');
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
