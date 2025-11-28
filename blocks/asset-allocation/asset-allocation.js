/**
 * Initialize Asset Allocation donut chart
 * @param {string} chartId - The chart container ID
 * @param {Object} data - The chart data object
 */
async function initializeAssetChart(chartId, data) {
  // Dynamically load Highcharts if not available
  if (typeof window.Highcharts === 'undefined') {
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="asset-allocation-error">Loading chart...</div>';
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
        errorContainer.innerHTML = '<div class="asset-allocation-error">Chart library not available. Please refresh the page.</div>';
      }
      return;
    }
  }

  // Chart data is already parsed and passed from decorate function
  // Use the chartData array directly from data parameter
  const chartData = Array.isArray(data.chartData) ? data.chartData : [];

  // Highcharts configuration for donut chart
  const config = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      width: 200,
      height: 200,
      spacing: [0, 0, 0, 0], // Remove all padding: [top, right, bottom, left]
      margin: [0, 0, 0, 0], // Remove all margins: [top, right, bottom, left]
      accessibility: {
        enabled: true,
        description: 'Asset allocation donut chart showing asset class distribution across five categories: Public Equities, Private Equities, Real Assets, Credit Investments, and Government Bonds. Use arrow keys to navigate between segments.',
        keyboardNavigation: {
          enabled: true,
        },
        announceNewData: {
          enabled: true,
        },
        point: {
          valueDescriptionFormat: '{name}: {y}%.',
        },
      },
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
      point: {
        descriptionFormatter(point) {
          const { name, y, description } = point;
          return `${name}: ${y}% of portfolio. ${description || ''}`;
        },
        valueDescriptionFormat: '{index}. {point.name}, {point.y}%.',
      },
      screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5><div>{chartSubtitle}</div><div>{chartLongdesc}</div>',
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#FFFFFF',
      borderWidth: 1,
      borderRadius: 8,
      style: {
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: "'Open Sans', sans-serif",
      },
      padding: 12,
      useHTML: true,
      outside: true, // Allow tooltip to render outside chart container
      followPointer: false, // Don't follow mouse, position relative to point
      distance: 15, // Distance from point
      hideDelay: 100, // Small delay before hiding to prevent flickering
      shape: 'rect', // Use rectangular shape with connecting line
      connectorWidth: 1, // Width of the connecting line
      connectorColor: '#FFFFFF', // Color of the connecting line
      positioner(width, height, point) {
        // Position tooltip just after the portion in chart (relative to the point)
        const { chart } = this;
        const {
          plotLeft,
          plotTop,
          plotWidth,
          plotHeight,
        } = chart;
        const { plotX, plotY } = point;
        const chartContainer = chart.renderTo;
        const containerRect = chartContainer.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate the angle of the point to determine which side to place tooltip
        const centerX = plotWidth / 2;
        const centerY = plotHeight / 2;
        const angle = Math.atan2(plotY - centerY, plotX - centerX);
        const gap = 15; // Gap between chart and tooltip

        // Position tooltip based on the angle of the point
        // For points on the right side (0 to PI/2 and -PI/2 to 0), show tooltip to the right
        // For points on the left side, show tooltip to the left
        let tooltipX;
        let tooltipY = plotY + plotTop - (height / 2);

        if (Math.abs(angle) < Math.PI / 2) {
          // Right side of chart - position tooltip to the right
          tooltipX = plotX + plotLeft + gap;
        } else {
          // Left side of chart - position tooltip to the left
          tooltipX = plotX + plotLeft - width - gap;
        }

        // Check if tooltip would go off the right edge of viewport
        const viewportWidth = window.innerWidth;
        const tooltipRightEdge = containerRect.left + scrollX + tooltipX + width;
        if (tooltipRightEdge > viewportWidth) {
          // Position to the left instead
          tooltipX = plotX + plotLeft - width - gap;
        }

        // Check if tooltip would go off the left edge of viewport
        const tooltipLeftEdge = containerRect.left + scrollX + tooltipX;
        if (tooltipLeftEdge < 0) {
          // Position to the right instead
          tooltipX = plotX + plotLeft + gap;
        }

        // Check if tooltip would go off the bottom of viewport
        const viewportHeight = window.innerHeight;
        const tooltipBottomEdge = containerRect.top + scrollY + tooltipY + height;
        if (tooltipBottomEdge > viewportHeight) {
          tooltipY = viewportHeight - (containerRect.top + scrollY) - height - 10;
        }

        // Check if tooltip would go off the top of viewport
        const tooltipTopEdge = containerRect.top + scrollY + tooltipY;
        if (tooltipTopEdge < scrollY) {
          tooltipY = scrollY - containerRect.top + 10;
        }

        // Ensure tooltip doesn't go below chart bottom
        if (tooltipY + height > plotHeight + plotTop) {
          tooltipY = plotHeight + plotTop - height - 10;
        }

        // Ensure tooltip doesn't go above chart top
        if (tooltipY < plotTop) {
          tooltipY = plotTop + 10;
        }

        return {
          x: tooltipX,
          y: tooltipY,
        };
      },
      formatter() {
        const { point } = this;
        const { name, y } = point;
        const description = point.description || point.options.description || '';
        return `
          <div style="min-width: 200px; max-width: 280px; word-wrap: break-word; overflow-wrap: break-word;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 16px; word-wrap: break-word; overflow-wrap: break-word;">
              ${name}
            </div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #FFFFFF;">
              ${y}%
            </div>
            ${description ? `<div style="font-size: 12px; line-height: 1.4; color: rgba(255, 255, 255, 0.9); word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">
              ${description}
            </div>` : ''}
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'pointer', // Change cursor to pointer on hover
        dataLabels: {
          enabled: false,
        },
        showInLegend: false,
        innerSize: '60%',
        borderWidth: 1, // 1px border for all segments
        borderColor: '#FFFFFF', // White border color
        borderRadius: 0, // No border radius on segments
        size: '100%', // Use full available space
        center: ['50%', '50%'], // Center the pie chart
        states: {
          hover: {
            brightness: 0.15, // Slightly brighten on hover
            borderWidth: 1, // Keep 1px border on hover
            borderRadius: 0, // No border radius on hover
            halo: {
              size: 5,
              opacity: 0.25,
            },
          },
        },
      },
    },
    series: [
      {
        name: 'Allocation',
        colorByPoint: true,
        innerSize: '60%',
        borderWidth: 1, // Ensure 1px border on series level
        borderColor: '#FFFFFF', // White border color
        data: chartData.map((item) => ({
          ...item,
          opacity: 1, // Initial opacity, will be updated based on selection
          description: item.description || '',
          borderWidth: 1, // 1px border for each segment
          borderColor: '#FFFFFF', // White border for each segment
          borderRadius: 0, // No border radius for each segment
          accessibility: {
            enabled: true,
            description: `${item.name} represents ${item.y}% of the portfolio allocation. ${item.description || ''}`,
            exposeAsGroupOnly: false,
          },
        })),
      },
    ],
  };

  // Create the chart
  try {
    const chart = window.Highcharts.chart(chartId, config);
    // Store chart instance for later updates
    window[`highchart_${chartId}`] = chart;

    // Add custom connecting line for tooltip
    let tooltipLine = null;

    // Override tooltip refresh to draw connecting line
    const originalRefresh = chart.tooltip.refresh;
    chart.tooltip.refresh = function refresh(point, mouseEvent) {
      // Call original refresh
      originalRefresh.call(this, point, mouseEvent);

      // Remove existing line if any
      if (tooltipLine) {
        tooltipLine.destroy();
        tooltipLine = null;
      }

      // Draw connecting line
      if (point && this.label && this.label.element) {
        // Get point position on chart
        const pointX = point.plotX + chart.plotLeft;
        const pointY = point.plotY + chart.plotTop;

        // Get tooltip position
        const tooltipBox = this.label.element.getBoundingClientRect();
        const chartBox = chart.container.getBoundingClientRect();
        const tooltipX = tooltipBox.left - chartBox.left;
        const tooltipY = tooltipBox.top - chartBox.top + (tooltipBox.height / 2);

        // Draw line from point to tooltip
        tooltipLine = chart.renderer.path([
          ['M', pointX, pointY],
          ['L', tooltipX, tooltipY],
        ])
          .attr({
            stroke: '#FFFFFF',
            'stroke-width': 1,
            zIndex: 5,
          })
          .add();
      }
    };

    // Remove line when tooltip is hidden
    const originalHide = chart.tooltip.hide;
    chart.tooltip.hide = function hide() {
      if (tooltipLine) {
        tooltipLine.destroy();
        tooltipLine = null;
      }
      originalHide.call(this);
    };

    // Chart is created, hover handlers will be set up after function definitions
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Asset Allocation chart:', error);

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="asset-allocation-error">Error rendering chart. Please check the configuration.</div>';
    }
  }
}

/**
 * Update chart to highlight/dim segments based on hover
 * @param {string} chartId - The chart container ID
 * @param {string} hoveredSegmentName - Name of the hovered segment (null to show all)
 */
function updateChartHighlight(chartId, hoveredSegmentName = null) {
  const chart = window[`highchart_${chartId}`];
  if (!chart || !chart.series || !chart.series[0]) {
    return;
  }

  const { points } = chart.series[0];

  // Update each point based on hover state
  points.forEach((point) => {
    if (hoveredSegmentName === null) {
      // Show all segments at full opacity
      point.update({
        opacity: 1,
      }, false);
    } else {
      // Highlight hovered segment, dim others
      const isHovered = point.name === hoveredSegmentName;
      point.update({
        opacity: isHovered ? 1 : 0.3,
      }, false);
    }
  });

  // Redraw chart once after all updates
  chart.redraw();
}

export default function decorate(block) {
  // Extract data from the block
  const assetData = {
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

  // Extract data from children (fallback for AEM published markup)
  assetData.title = getTextFromChild(0) || null;

  // Extract chart data (second child) - JSON array
  const chartDataText = getTextFromChild(1);
  if (chartDataText) {
    assetData.chartData = chartDataText;
  }

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
        assetData.title = value;
      } else if (propName === 'chartData') {
        assetData.chartData = value;
      }
    });
  }

  // Parse chart data - this will be the single source of truth for both chart and legend
  // Fixed mock data structure (matching design colors)
  const mockChartData = [
    {
      name: 'Real Assets',
      y: 35,
      color: '#0052A4',
      description: 'Investments in real estate, infrastructure, and tangible assets',
    },
    {
      name: 'Government Bonds',
      y: 25,
      color: '#99BCFF',
      description: 'Government-issued debt securities providing stable returns',
    },
    {
      name: 'Credit Investments',
      y: 18,
      color: '#0273CF',
      description: 'Corporate bonds, private debt, and structured credit opportunities',
    },
    {
      name: 'Private Equities',
      y: 12,
      color: '#2C3D50',
      description: 'Investments in privately held companies and equity funds',
    },
    {
      name: 'Public Equities',
      y: 10,
      color: '#1E2127',
      description: 'Investments in publicly traded company stocks across global markets',
    },
  ];

  // Parse chart data from assetData - single source of truth
  let chartData = mockChartData;
  try {
    if (assetData.chartData && typeof assetData.chartData === 'string' && assetData.chartData.trim()) {
      let parsed;
      try {
        // Try parsing directly first (in case it's already valid JSON)
        parsed = JSON.parse(assetData.chartData);
      } catch (parseError) {
        // If direct parse fails, clean up the JSON string
        let cleanJson = assetData.chartData.trim();

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

        // Quote unquoted property names (if needed)
        // Only quote if property names aren't already quoted
        const hasQuotedProps = /[{,]\s*"[a-zA-Z_$][a-zA-Z0-9_$]*"\s*:/.test(cleanJson);
        if (!hasQuotedProps) {
          // Add quotes around unquoted property names
          cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        }

        // Remove trailing commas
        cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1');

        parsed = JSON.parse(cleanJson);
      }

      if (Array.isArray(parsed)) {
        chartData = parsed;
      }
    } else if (assetData.chartData && Array.isArray(assetData.chartData)) {
      chartData = assetData.chartData;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data:', error, 'Raw data:', assetData.chartData);
  }

  // Store parsed chartData back for chart initialization (single source of truth)
  assetData.chartData = chartData;

  // Generate asset classes list from chartData (single source of truth)
  // Format: { name, percentage, color, description }
  const assetClasses = chartData.map((item) => {
    // Format percentage from y value (e.g., 35 -> "35.0%")
    const percentage = typeof item.y === 'number' ? `${item.y.toFixed(1)}%` : '00.0%';
    return {
      name: item.name || '',
      percentage,
      color: item.color || '#000000',
      description: item.description || '',
    };
  });

  // Generate unique IDs
  const titleId = `asset-allocation-title-${Date.now()}`;
  const chartId = `asset-allocation-chart-${Date.now()}`;

  // Build title HTML
  const titleHtml = assetData.title
    ? `
      <div class="asset-allocation-title-section">
        <h2 class="asset-allocation-title" id="${titleId}">${assetData.title}</h2>
      </div>
    `
    : '';

  // Build asset class list HTML (matching design - vertical list with bullets)
  const assetListHtml = assetClasses
    .map((asset, index) => {
      // Always show indicator with color (matching pie chart segment)
      const fillColor = asset.color || '#000000';
      const fillStyle = `style="background-color: ${fillColor};"`;
      const itemId = `asset-class-${chartId}-${index}`;
      return `
        <div class="asset-class-item" role="listitem" aria-label="${asset.name}: ${asset.percentage}" id="${itemId}">
          <div class="asset-class-indicator" aria-hidden="true">
            <div class="indicator-fill" ${fillStyle}></div>
          </div>
          <div class="asset-class-name">${asset.name}</div>
          <div class="asset-class-percentage" aria-label="${asset.name} allocation is ${asset.percentage}">${asset.percentage || '00.0%'}</div>
        </div>
      `;
    })
    .join('');

  // Check if wrapper already exists (AEM might add it automatically)
  // Check if block's parent has the wrapper class
  const parentHasWrapper = block.parentElement?.classList.contains('asset-allocation-wrapper');
  const blockIsWrapper = block.classList.contains('asset-allocation-wrapper');

  // Build inner content (without wrapper if it already exists)
  const innerContent = `
    ${titleHtml}
    <div class="asset-allocation-content">
      <div class="asset-allocation-chart-content">
        <div class="asset-allocation-chart-container">
          <div class="asset-allocation-chart-wrapper">
            <h3 class="asset-allocation-chart-title" id="${chartId}-title">Asset Allocation</h3>
            <div 
              class="asset-allocation-chart" 
              id="${chartId}" 
              role="img"
              aria-label="Asset allocation donut chart"
              aria-describedby="${chartId}-title ${chartId}-description"
            >
              <div id="${chartId}-description" class="sr-only">
                This donut chart visualizes the portfolio asset allocation across five categories. Use arrow keys to navigate between segments.
              </div>
            </div>
          </div>
        </div>
        <div class="asset-allocation-list" role="list" aria-label="Asset allocation breakdown">
          ${assetListHtml}
        </div>
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
      <div class="asset-allocation-wrapper" role="region" aria-labelledby="${titleId}">
        ${innerContent}
      </div>
    `;
    block.innerHTML = html;
  }

  // Asset class items are visual indicators - enhance accessibility
  const assetItems = block.querySelectorAll('.asset-class-item');
  assetItems.forEach((item) => {
    // Keep role="listitem" for proper semantic structure
    // Already has aria-label from HTML generation
    item.style.cursor = 'default'; // Show default cursor, not pointer
    item.setAttribute('tabindex', '-1'); // Not keyboard focusable but accessible to screen readers
  });

  // Lazy load chart initialization function
  const lazyInitChart = () => {
    initializeAssetChart(chartId, { chartData }).then(() => {
      // Set up hover event handlers after chart is created
      setTimeout(() => {
        const chart = window[`highchart_${chartId}`];
        if (chart && chart.series && chart.series[0]) {
          chart.series[0].points.forEach((point) => {
            // Add event listeners using addEventListener for pie slice elements
            const sliceElement = point.graphic?.element;
            if (sliceElement) {
              sliceElement.addEventListener('mouseenter', () => {
                updateChartHighlight(chartId, point.name);
              });
              sliceElement.addEventListener('mouseleave', () => {
                updateChartHighlight(chartId, null);
              });
            }
          });
        }

        // Initialize chart with all segments visible
        updateChartHighlight(chartId, null);
      }, 100);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Chart initialization failed:', error);
    });
  };

  // Use IntersectionObserver to load chart only when visible
  const chartContainer = block.querySelector('.asset-allocation-chart-container');
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
    requestIdleCallback(lazyInitChart, { timeout: 2000 });
  } else {
    setTimeout(lazyInitChart, 100);
  }
}
