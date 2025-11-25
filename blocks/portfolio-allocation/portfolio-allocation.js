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

  // Asset class descriptions for tooltips
  const assetDescriptions = {
    Equities: 'Investments in publicly traded company stocks across global markets',
    'Fixed Income': 'Bonds and other debt securities providing steady income streams',
    'Real Estate': 'Property investments including commercial and residential real estate',
    Infrastructure: 'Investments in essential infrastructure assets like transportation and utilities',
    Credit: 'Corporate bonds, private debt, and structured credit opportunities',
  };

  // Fixed mock data for portfolio allocation (matching Figma design colors)
  const mockChartData = [
    {
      name: 'Equities',
      y: 30,
      color: '#1E2127',
      description: assetDescriptions.Equities,
    },
    {
      name: 'Fixed Income',
      y: 25,
      color: '#2C3D50',
      description: assetDescriptions['Fixed Income'],
    },
    {
      name: 'Real Estate',
      y: 20,
      color: '#0052A4',
      description: assetDescriptions['Real Estate'],
    },
    {
      name: 'Infrastructure',
      y: 15,
      color: '#0273CF',
      description: assetDescriptions.Infrastructure,
    },
    {
      name: 'Credit',
      y: 10,
      color: '#99BCFF',
      description: assetDescriptions.Credit,
    },
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
      spacing: [0, 0, 0, 0], // Remove all padding: [top, right, bottom, left]
      margin: [0, 0, 0, 0], // Remove all margins: [top, right, bottom, left]
      accessibility: {
        enabled: true,
        description: 'Portfolio allocation donut chart showing asset class distribution. Use arrow keys to navigate between segments.',
        keyboardNavigation: {
          enabled: true,
        },
      },
    },
    title: {
      text: null,
    },
    credits: {
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
          description: item.description || assetDescriptions[item.name] || '',
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
    console.error('Failed to create Portfolio Allocation chart:', error);

    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="portfolio-allocation-error">Error rendering chart. Please check the configuration.</div>';
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

  // Fixed mock asset classes data (matching Figma design colors)
  const mockAssetClasses = [
    {
      name: 'Equities',
      percentage: '30%',
      selected: false,
      color: '#1E2127',
    },
    {
      name: 'Fixed Income',
      percentage: '25%',
      selected: false,
      color: '#2C3D50',
    },
    {
      name: 'Real Estate',
      percentage: '20%',
      selected: false,
      color: '#0052A4',
    },
    {
      name: 'Infrastructure',
      percentage: '15%',
      selected: false,
      color: '#0273CF',
    },
    {
      name: 'Credit',
      percentage: '10%',
      selected: false,
      color: '#99BCFF',
    },
  ];

  // Fixed mock chart data for color matching (same colors as in initializePortfolioChart)
  const mockChartDataForColors = [
    { name: 'Equities', color: '#1E2127' },
    { name: 'Fixed Income', color: '#2C3D50' },
    { name: 'Real Estate', color: '#0052A4' },
    { name: 'Infrastructure', color: '#0273CF' },
    { name: 'Credit', color: '#99BCFF' },
  ];

  // Parse chart data first (needed for color matching)
  let chartDataForColors = mockChartDataForColors;
  try {
    if (portfolioData.chartData && typeof portfolioData.chartData === 'string' && portfolioData.chartData.trim()) {
      const parsed = JSON.parse(portfolioData.chartData);
      if (Array.isArray(parsed)) {
        // Extract just name and color for color matching
        chartDataForColors = parsed.map((item) => ({
          name: item.name,
          color: item.color,
        }));
      }
    } else if (portfolioData.chartData && Array.isArray(portfolioData.chartData)) {
      // Extract just name and color for color matching
      chartDataForColors = portfolioData.chartData.map((item) => ({
        name: item.name,
        color: item.color,
      }));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse chart data for colors:', error);
  }

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

  // Ensure asset class colors match chart data colors
  // Match by name and update colors from chart data
  const chartDataMap = new Map();
  chartDataForColors.forEach((item) => {
    chartDataMap.set(item.name, item.color);
  });

  // Update asset class colors to match chart data
  assetClasses = assetClasses.map((asset) => {
    const chartColor = chartDataMap.get(asset.name);
    if (chartColor) {
      return {
        ...asset,
        color: chartColor, // Use color from chart data
      };
    }
    return asset;
  });

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
      // Always show indicator with color (matching pie chart segment)
      const fillColor = asset.color || '#000000';
      const fillStyle = `style="background-color: ${fillColor};"`;
      return `
        <div class="asset-class-card" data-asset-index="${index}" aria-label="Color indicator for ${asset.name}">
          <div class="asset-class-indicator-inner">
            <div class="asset-class-indicator selected">
              <div class="indicator-fill" ${fillStyle}></div>
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

  // Asset class cards are visual indicators only (not clickable)
  // They show which color represents which portion
  const assetCards = block.querySelectorAll('.asset-class-card');
  assetCards.forEach((card) => {
    // Remove click handlers - cards are not interactive
    // Remove keyboard handlers - cards are not interactive
    // Remove focusability - cards are not interactive
    const cardName = card.querySelector('.asset-class-name')?.textContent || 'asset class';
    card.setAttribute('aria-label', `Color indicator for ${cardName}`);
    card.style.cursor = 'default'; // Show default cursor, not pointer
    card.removeAttribute('tabindex'); // Remove focusability
    card.removeAttribute('role'); // Remove radio role
  });

  // Initialize chart
  initializePortfolioChart(chartId, portfolioData);

  // Set up hover event handlers after chart is created
  setTimeout(() => {
    const chart = window[`highchart_${chartId}`];
    if (chart && chart.series && chart.series[0]) {
      chart.series[0].points.forEach((point) => {
        // On hover: highlight this segment, dim others
        point.on('mouseOver', () => {
          updateChartHighlight(chartId, point.name);
        });

        // On mouse out: restore all segments to full opacity
        point.on('mouseOut', () => {
          updateChartHighlight(chartId, null);
        });
      });
    }

    // Initialize chart with all segments visible
    updateChartHighlight(chartId, null);
  }, 100);
}
