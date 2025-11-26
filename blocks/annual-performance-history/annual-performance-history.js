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
        data: [2.5, 16.8, -8.2, 10.5, 9.3, 3.1],
        color: '#0273CF', // Blue color for CPP Investments
      },
      {
        name: 'Benchmark Return',
        data: [2.1, 15.2, -7.5, 9.8, 8.9, 2.8],
        color: '#2C3D50', // Dark grey for Benchmark
      },
    ],
  };

  // Parse chart data if provided
  let chartData = mockChartData;
  try {
    if (data.chartData && typeof data.chartData === 'string' && data.chartData.trim()) {
      const parsed = JSON.parse(data.chartData);
      if (parsed.categories && parsed.series) {
        chartData = parsed;
      }
    } else if (data.chartData && typeof data.chartData === 'object' && data.chartData.categories) {
      chartData = data.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error);
  }

  // Highcharts configuration
  const config = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      spacing: [20, 20, 20, 20],
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
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
          return `${series.name} for ${name}: ${y > 0 ? '+' : ''}${y}%`;
        },
        valueDescriptionFormat: '{index}. {point.series.name} for {point.category}: {point.y}%.',
      },
      screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5><div>{chartSubtitle}</div><div>{chartLongdesc}</div>',
      },
    },
    xAxis: {
      categories: chartData.categories,
      lineWidth: 1,
      lineColor: '#E3E4E5',
      tickWidth: 0,
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
      lineWidth: 1,
      lineColor: '#E3E4E5',
      labels: {
        format: '{value}%',
        style: {
          color: '#2C3D50',
          fontSize: '14px',
          fontFamily: "'Open Sans', sans-serif",
        },
      },
    },
    legend: {
      enabled: true,
      align: 'left',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      itemStyle: {
        color: '#2C3D50',
        fontSize: '14px',
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: '400',
      },
      itemHoverStyle: {
        color: '#0273CF',
      },
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0,
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
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${value}%</b><br/>`;
        });
        return tooltip;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 0,
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
    legendData: null,
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

  // Extract chart data (second child) - JSON string
  const chartDataText = getTextFromChild(1);
  if (chartDataText) {
    try {
      performanceData.chartData = JSON.parse(chartDataText);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse chart data:', error);
    }
  }

  // Extract legend data (third child) - optional
  const legendDataText = getTextFromChild(2);
  if (legendDataText) {
    try {
      performanceData.legendData = JSON.parse(legendDataText);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse legend data:', error);
    }
  }

  // Generate unique IDs
  const titleId = `annual-performance-history-title-${Date.now()}`;
  const chartId = `annual-performance-history-chart-${Date.now()}`;

  // Build HTML structure
  const html = `
    <div class="annual-performance-history-wrapper" role="region" aria-labelledby="${titleId}">
      <div class="annual-performance-history-header">
        <div class="annual-performance-history-title-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="annual-performance-history-icon">
            <circle cx="12" cy="12" r="11" stroke="#0273CF" stroke-width="1.5" fill="none"/>
            <text x="12" y="17" text-anchor="middle" font-size="14" font-weight="600" fill="#0273CF" font-family="'Open Sans', sans-serif">L</text>
          </svg>
          <h2 class="annual-performance-history-title" id="${titleId}">${performanceData.title}</h2>
        </div>
      </div>
      <div class="annual-performance-history-chart-container">
        <div class="annual-performance-history-chart" id="${chartId}"></div>
      </div>
    </div>
  `;

  block.innerHTML = html;

  // Initialize chart (async)
  initializePerformanceChart(chartId, performanceData).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Chart initialization failed:', error);
  });
}
