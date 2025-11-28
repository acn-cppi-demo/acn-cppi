/**
 * Mock data for different periods with different chart values
 * Each period has different data points and overall metrics
 */
function getPeriodMockData() {
  return {
    '3M': {
      chartData: [
        731.7, 740.5, 748.2, 753.1, 759.4, 765.8,
        770.2, 774.1, 775.8, 776.5, 777.0, 777.5,
      ],
      value: '$777.5B',
      badge: '+$45.8B',
      overallData: {
        netIncreaseLabel: 'Growth (3M)',
        netIncreaseValue: '+$45.8B',
        netReturnLabel: 'Period',
        netReturnValue: 'July - Sept 2025',
        netReturnType: 'Start: $731.7B',
      },
    },
    '6M': {
      chartData: [
        714.0, 725.3, 735.8, 743.5, 752.1, 760.4,
        766.8, 771.5, 774.2, 775.9, 776.7, 777.5,
      ],
      value: '$777.5B',
      badge: '+$63.1B',
      overallData: {
        netIncreaseLabel: 'Growth (6M)',
        netIncreaseValue: '+$63.1B',
        netReturnLabel: 'Period',
        netReturnValue: 'April - Sept 2025',
        netReturnType: 'Start: $714.0B',
      },
    },
    '1Y': {
      chartData: [515, 540, 560, 550, 590, 570, 600, 630, 620, 650, 680, 720],
      value: '$64.92B',
      badge: '+28.3%',
      overallData: {
        netIncreaseLabel: 'Net Increase',
        netIncreaseValue: '$15.3B',
        netReturnLabel: 'Net Return',
        netReturnValue: '+23.6%',
        netReturnType: 'Nominal',
      },
    },
    '2Y': {
      chartData: [
        570.0, 590.5, 610.8, 630.2, 650.1, 668.5,
        688.4, 708.2, 728.5, 750.1, 764.2, 777.5,
      ],
      value: '$777.5B',
      badge: '+$207.5B',
      overallData: {
        netIncreaseLabel: 'Growth (2Y)',
        netIncreaseValue: '+$207.5B',
        netReturnLabel: 'Period',
        netReturnValue: 'March 2023 - Sept 2025',
        netReturnType: 'Start: $570.0B',
      },
    },
    '5Y': {
      chartData: [
        409.6, 450.2, 490.8, 525.3, 560.1, 600.5,
        640.2, 680.8, 715.3, 745.2, 761.8, 777.5,
      ],
      value: '$777.5B',
      badge: '+$367.9B',
      overallData: {
        netIncreaseLabel: 'Growth (5Y)',
        netIncreaseValue: '+$367.9B',
        netReturnLabel: 'Period',
        netReturnValue: 'March 2020 - Sept 2025',
        netReturnType: 'Start: $409.6B',
      },
    },
  };
}

/**
 * Update period-specific values in the DOM
 * @param {Object} data - The chart data object
 * @param {string} period - The selected period
 * @param {Object} periodData - The period-specific mock data
 */
function updatePeriodValues(data, period, periodData) {
  const block = data.blockElement;

  // Update the value section
  const valueElement = block.querySelector('.cpp-hero-chart-value');
  if (valueElement && periodData.value) {
    valueElement.textContent = periodData.value;
  }

  // Update the badge
  const badgeElement = block.querySelector('.cpp-hero-chart-badge');
  if (badgeElement && periodData.badge) {
    // Update badge text (skip the SVG)
    const badgeText = badgeElement.querySelector('svg')?.nextSibling || badgeElement.lastChild;
    if (badgeText) {
      badgeText.textContent = periodData.badge;
    }
  }

  // Update the overall data panel if it exists
  if (periodData.overallData) {
    const overallDataSection = block.querySelector('.cpp-hero-chart-overall-data');
    if (overallDataSection) {
      const netIncreaseLabel = overallDataSection.querySelector('.cpp-hero-chart-overall-label');
      const netIncreaseValue = overallDataSection.querySelector('.cpp-hero-chart-overall-value');
      const netReturnLabel = overallDataSection.querySelectorAll('.cpp-hero-chart-overall-label')[1];
      const netReturnValue = overallDataSection.querySelector('.cpp-hero-chart-overall-return-value');
      const netReturnType = overallDataSection.querySelector('.cpp-hero-chart-overall-type');

      if (netIncreaseLabel && periodData.overallData.netIncreaseLabel) {
        netIncreaseLabel.textContent = periodData.overallData.netIncreaseLabel;
      }
      if (netIncreaseValue && periodData.overallData.netIncreaseValue) {
        netIncreaseValue.textContent = periodData.overallData.netIncreaseValue;
      }
      if (netReturnLabel && periodData.overallData.netReturnLabel) {
        netReturnLabel.textContent = periodData.overallData.netReturnLabel;
      }
      if (netReturnValue && periodData.overallData.netReturnValue) {
        netReturnValue.textContent = periodData.overallData.netReturnValue;
      }
      if (netReturnType && periodData.overallData.netReturnType) {
        netReturnType.textContent = periodData.overallData.netReturnType;
      }
    }
  }
}

/**
 * Update chart data based on selected period
 * @param {Object} data - The chart data object
 * @param {string} period - The selected period
 */
function updateChart(data, period) {
  // Use periodsData from JSON if available, otherwise fall back to mock data
  let periodData = null;
  if (data.periodsData && data.periodsData[period]) {
    periodData = data.periodsData[period];
  } else {
    const mockData = getPeriodMockData();
    periodData = mockData[period];
  }

  if (!periodData) {
    // eslint-disable-next-line no-console
    console.warn(`No data found for period: ${period}`);
    return;
  }

  // Get the chart instance directly from the data object using destructuring
  const { chartInstance } = data;

  if (chartInstance && typeof chartInstance.series !== 'undefined' && chartInstance.series.length > 0) {
    // Update the chart series data with animation
    try {
      chartInstance.series[0].setData(periodData.chartData, true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating chart:', error);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('Chart instance not found or not ready');
  }

  // Update value and badge in the DOM
  updatePeriodValues(data, period, periodData);
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
}

/**
 * Get default dummy line chart configuration
 * @returns {Object} Default Highcharts configuration
 */
function getDummyLineChartConfig() {
  return {
    chart: {
      type: 'area',
      height: 170,
      backgroundColor: 'transparent',
      accessibility: {
        enabled: true,
        description: 'Line chart showing portfolio value over time. Use arrow keys to navigate between data points.',
        keyboardNavigation: {
          enabled: true,
        },
      },
    },
    title: {
      text: null,
    },
    accessibility: {
      enabled: true,
      point: {
        descriptionFormatter(point) {
          return `Value: ${point.y}`;
        },
        valueDescriptionFormat: '{index}. {point.y}.',
      },
      screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5><div>{chartSubtitle}</div><div>{chartLongdesc}</div>',
      },
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
      labels: {
        enabled: true,
        style: {
          color: '#6F7176',
          fontSize: '12px',
        },
        formatter() {
          return `${this.value}B`;
        },
      },
      gridLineWidth: 1,
      gridLineColor: '#E3E4E5',
      lineWidth: 0,
      tickLength: 0,
      min: 500,
      max: 800,
      tickInterval: 100,
    },
    plotOptions: {
      area: {
        lineWidth: 2,
        fillOpacity: 1,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgba(2, 115, 207, 0.8)'],
            [1, 'rgba(2, 115, 207, 0)'],
          ],
        },
      },
      series: {
        dataLabels: { enabled: false },
        enableMouseTracking: false,
        marker: { enabled: false },
        color: '#0273CF',
        lineWidth: 2,
      },
    },
    series: [
      {
        name: 'Value',
        data: [520, 550, 580, 600, 620, 650, 640, 670, 690, 720, 750, 780],
        color: '#0273CF',
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
async function initializeChart(chartId, data) {
  // Dynamically load Highcharts if not available
  if (typeof window.Highcharts === 'undefined') {
    const container = document.getElementById(chartId);
    if (container) {
      container.innerHTML = '<div class="cpp-hero-chart-error">Loading chart...</div>';
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
        errorContainer.innerHTML = '<div class="cpp-hero-chart-error">Chart library not available. Please refresh the page.</div>';
      }
      return;
    }
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
  const defaultConfig = getDummyLineChartConfig();
  const config = {
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
      align: 'bottom',
    },
    accessibility: {
      enabled: true,
      description: data.graphText ? `Chart showing ${data.graphText} over time. Use arrow keys to navigate between data points.` : 'Line chart showing portfolio value over time. Use arrow keys to navigate between data points.',
      keyboardNavigation: {
        enabled: true,
      },
      point: {
        descriptionFormatter(point) {
          return `Value: ${point.y}`;
        },
        valueDescriptionFormat: '{index}. {point.y}.',
      },
      screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5><div>{chartSubtitle}</div><div>{chartLongdesc}</div>',
      },
    },
    ...defaultConfig,
    ...chartOptions,
    // Ensure yAxis settings are always applied
    yAxis: {
      ...defaultConfig.yAxis,
      ...(chartOptions.yAxis || {}),
    },
  };

  // Ensure chart height is set (but don't override the chart type from chartOptions)
  if (!config.chart) {
    config.chart = {};
  }
  if (!config.chart.height) {
    config.chart.height = 170;
  }
  if (!config.chart.backgroundColor) {
    config.chart.backgroundColor = 'transparent';
  }

  // Create the chart
  try {
    const chart = window.Highcharts.chart(chartId, config);
    // Store chart instance for later updates - BOTH in window and in data object
    window[`highchart_${chartId}`] = chart;
    data.chartInstance = chart;
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
    backgroundImage: null,
    backgroundImageAlt: null,
    graphImage: null,
    graphImageAlt: null,
    graphText: null,
    chartData: null,
    periodsData: null, // Will store the periods object from JSON
    value: null,
    badge: null,
    overallData: null,
    periods: [], // Default, will be synced from JSON or mock data
    selectedPeriod: '1Y',
    blockElement: null,
    chartInstanceId: null,
    chartInstance: null,
  };

  // Helper: plain text from HTML string
  // const getPlainText = (htmlString) => {
  //   if (!htmlString) return '';
  //   const tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = htmlString;
  //   return tempDiv.textContent.trim();
  // };

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

  // Helper: extract overall data from HTML element or string
  function parseOverallData(elementOrHtml) {
    let innerDiv = null;

    // If it's a number, treat it as child index
    if (typeof elementOrHtml === 'number') {
      const child = block.children[elementOrHtml];
      if (!child) return null;
      innerDiv = child.querySelector('div');
    } else if (typeof elementOrHtml === 'string') {
      // If it's a string, parse it as HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = elementOrHtml;
      innerDiv = tempDiv.querySelector('div') || tempDiv;
    } else if (elementOrHtml instanceof Element) {
      // If it's already a DOM element
      innerDiv = elementOrHtml.querySelector('div') || elementOrHtml;
    }

    if (!innerDiv) return null;

    // Find all paragraphs and headings
    const elements = Array.from(innerDiv.children);
    const overallData = {
      identifier: null,
      netIncreaseLabel: null,
      netIncreaseValue: null,
      netReturnLabel: null,
      netReturnValue: null,
      netReturnType: null,
      buttonLink: null,
      buttonText: null,
      buttonTitle: null,
    };

    // Parse the content structure
    elements.forEach((el, index) => {
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent.trim();

      // First check for button container (priority check)
      if (tagName === 'p') {
        const hasButtonClass = el.classList.contains('button-container') || (el.className && el.className.includes('button-container'));
        const link = el.querySelector('a.button, a[class*="button"], a');
        const linkHasButtonClass = link && (link.classList.contains('button') || (link.className && link.className.includes('button')));
        if (hasButtonClass || linkHasButtonClass) {
          const buttonLink = link || el.querySelector('a');
          if (buttonLink) {
            overallData.buttonLink = buttonLink.getAttribute('href') || null;
            overallData.buttonText = buttonLink.textContent.trim();
            overallData.buttonTitle = buttonLink.getAttribute('title') || null;
          }
        }
      }

      // First paragraph might be the identifier "{right side}" - but don't require it
      if (tagName === 'p' && index === 0 && text.includes('{right side}')) {
        overallData.identifier = text;
      }

      // Look for h1 which contains the main value ($17.0B)
      if (tagName === 'h1') {
        // Look for h1 which contains the main value ($17.0B)
        overallData.netIncreaseValue = text;
        // The previous paragraph should be the label
        if (index > 0 && elements[index - 1].tagName.toLowerCase() === 'p') {
          const prevText = elements[index - 1].textContent.trim();
          if (prevText && !prevText.includes('{right side}') && !prevText.includes('<hr') && !prevText.includes('&lt;hr')) {
            overallData.netIncreaseLabel = prevText;
          }
        }
      } else if (tagName === 'p' && !text.includes('<hr') && !text.includes('&lt;hr') && !text.includes('{right side}') && !el.classList.contains('button-container') && !(el.className && el.className.includes('button-container'))) {
        // Look for paragraphs that might be labels or values (exclude button container)
        // Check if it's a percentage value (contains %)
        if (text.includes('%')) {
          overallData.netReturnValue = text;
          // Previous paragraph should be the label
          if (index > 0 && elements[index - 1].tagName.toLowerCase() === 'p') {
            const prevText = elements[index - 1].textContent.trim();
            if (prevText && !prevText.includes('<hr') && !prevText.includes('&lt;hr')) {
              overallData.netReturnLabel = prevText;
            }
          }
        } else if (text.toLowerCase() === 'nominal' || text.toLowerCase() === 'real') {
          // Check if it's "Nominal" or similar type indicator
          overallData.netReturnType = text;
        }
      }
    });

    // Fallback: try to find button if not found yet
    if (!overallData.buttonLink) {
      // Try multiple selectors to find the button
      const buttonLink = innerDiv.querySelector('a.button, .button-container a, a[class*="button"], p.button-container a');
      if (buttonLink) {
        overallData.buttonLink = buttonLink.getAttribute('href') || null;
        overallData.buttonText = buttonLink.textContent.trim();
        overallData.buttonTitle = buttonLink.getAttribute('title') || null;
      } else {
        // Last resort: find any link that contains "review" or "return" in text
        const allLinks = innerDiv.querySelectorAll('a');
        allLinks.forEach((link) => {
          const linkText = link.textContent.toLowerCase();
          if ((linkText.includes('review') || linkText.includes('return')) && !overallData.buttonLink) {
            overallData.buttonLink = link.getAttribute('href') || null;
            overallData.buttonText = link.textContent.trim();
            overallData.buttonTitle = link.getAttribute('title') || null;
          }
        });
      }
    }

    // Fallback: try to find netIncreaseLabel if not found
    if (!overallData.netIncreaseLabel) {
      const h1 = innerDiv.querySelector('h1');
      if (h1 && h1.previousElementSibling) {
        const prevText = h1.previousElementSibling.textContent.trim();
        if (prevText && !prevText.includes('{right side}') && !prevText.includes('<hr') && !prevText.includes('&lt;hr')) {
          overallData.netIncreaseLabel = prevText;
        }
      }
    }

    // Return null if no meaningful data was extracted
    // But be more lenient - if we have any data (label, value, button), return it
    const hasData = overallData.netIncreaseValue
      || overallData.netReturnValue
      || overallData.buttonLink
      || overallData.netIncreaseLabel
      || overallData.netReturnLabel;
    if (!hasData) {
      return null;
    }

    return overallData;
  }

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
  // Check for background image at index 3
  const bgPic = getPictureFromChild(3);
  let graphImageIndex = 4;
  let graphTextIndex = 5;
  let valueIndex = 6;
  let badgeIndex = 7;
  let periodIndex = 8;

  if (bgPic) {
    cppHeroChartData.backgroundImage = bgPic.src;
    cppHeroChartData.backgroundImageAlt = bgPic.alt;
    // If background image exists, shift indices by 1
    graphImageIndex = 5;
    graphTextIndex = 6;
    valueIndex = 7;
    badgeIndex = 8;
    periodIndex = 9;
  }

  // Check for picture at the adjusted index, if present use it and adjust subsequent indices
  const pic = getPictureFromChild(graphImageIndex);

  if (pic) {
    cppHeroChartData.graphImage = pic.src;
    cppHeroChartData.graphImageAlt = pic.alt;
    // If picture exists, shift indices by 1
    graphTextIndex += 1;
    valueIndex += 1;
    badgeIndex += 1;
    periodIndex += 1;
  }

  cppHeroChartData.graphText = getTextFromChild(graphTextIndex) || null;
  cppHeroChartData.value = getTextFromChild(valueIndex) || null;
  cppHeroChartData.badge = getTextFromChild(badgeIndex) || null;
  const selectedPeriodFromChild = getTextFromChild(periodIndex);
  cppHeroChartData.selectedPeriod = selectedPeriodFromChild || cppHeroChartData.selectedPeriod;

  // Parse JSON data if chartData contains a JSON string with periods object
  // The JSON structure might be: { "periods": { "3M": {...}, "6M": {...}, ... } }
  if (cppHeroChartData.chartData) {
    try {
      let parsedData = null;
      if (typeof cppHeroChartData.chartData === 'string' && cppHeroChartData.chartData.trim()) {
        parsedData = JSON.parse(cppHeroChartData.chartData);
      } else if (typeof cppHeroChartData.chartData === 'object') {
        parsedData = cppHeroChartData.chartData;
      }

      // If parsed data contains a periods object, extract it and sync periods list
      if (parsedData && parsedData.periods && typeof parsedData.periods === 'object') {
        cppHeroChartData.periodsData = parsedData.periods;
        // Extract period keys from the periods object
        const periodKeys = Object.keys(parsedData.periods);
        if (periodKeys.length > 0) {
          cppHeroChartData.periods = periodKeys;
          // If selectedPeriod is not in the new periods list, set to first period
          if (!cppHeroChartData.periods.includes(cppHeroChartData.selectedPeriod)) {
            const [firstPeriod] = cppHeroChartData.periods;
            cppHeroChartData.selectedPeriod = firstPeriod;
          }
          // Update initial value, badge, and overallData from selected period's data
          const selectedPeriodData = cppHeroChartData.periodsData[cppHeroChartData.selectedPeriod];
          if (selectedPeriodData) {
            if (selectedPeriodData.value) cppHeroChartData.value = selectedPeriodData.value;
            if (selectedPeriodData.badge) cppHeroChartData.badge = selectedPeriodData.badge;
            if (selectedPeriodData.overallData) {
              cppHeroChartData.overallData = selectedPeriodData.overallData;
            }
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse chartData JSON:', error);
    }
  }

  // If no periodsData was extracted from JSON, sync periods from mock data
  if (!cppHeroChartData.periodsData) {
    const mockPeriodsData = getPeriodMockData();
    cppHeroChartData.periodsData = mockPeriodsData;
    // Extract period keys from mock data and sync periods array
    const periodKeys = Object.keys(mockPeriodsData);
    if (periodKeys.length > 0) {
      cppHeroChartData.periods = periodKeys;
      // If selectedPeriod is not in the periods list, set to first period
      if (!cppHeroChartData.periods.includes(cppHeroChartData.selectedPeriod)) {
        const [firstPeriod] = cppHeroChartData.periods;
        cppHeroChartData.selectedPeriod = firstPeriod;
      }
    }
  }

  // Extract overall data from the last child div (right side content)
  // First check for data-aue-prop
  const overallDataProp = block.querySelector('[data-aue-prop="overall_data"], [data-aue-prop="overallData"]');
  if (overallDataProp) {
    const propType = overallDataProp.getAttribute('data-aue-type');
    let value = null;
    if (propType === 'richtext') {
      value = overallDataProp.innerHTML.trim() || overallDataProp.textContent.trim();
    } else {
      value = overallDataProp.textContent.trim();
    }
    // Try to parse as JSON if it's a string
    if (value) {
      try {
        cppHeroChartData.overallData = JSON.parse(value);
      } catch (e) {
        // If not JSON, try to extract from HTML structure
        const extracted = parseOverallData(value);
        if (extracted) {
          cppHeroChartData.overallData = extracted;
        }
      }
    }
  } else {
    // Fallback: try to find the overall data div by checking multiple indices
    // Start from the end and work backwards to find the div with overall data
    let overallData = null;
    const childrenLength = block.children.length;
    for (let i = childrenLength - 1; i >= 0; i -= 1) {
      const child = block.children[i];
      const innerDiv = child.querySelector('div');
      if (innerDiv) {
        // Check if this div contains overall data indicators (h1, button, etc.)
        const hasH1 = innerDiv.querySelector('h1');
        const hasButton = innerDiv.querySelector('a.button, .button-container a, a[class*="button"]');
        if (hasH1 || hasButton) {
          overallData = parseOverallData(i);
          if (overallData) {
            break;
          }
        }
      }
    }
    if (overallData) {
      cppHeroChartData.overallData = overallData;
    }
  }

  // Generate unique IDs for accessibility
  const chartId = `cpp-hero-chart-${Date.now()}`;
  const titleId = `cpp-hero-chart-title-${Date.now()}`;
  const descriptionId = `cpp-hero-chart-description-${Date.now()}`;

  // Store references in data object for later use
  cppHeroChartData.blockElement = block;
  cppHeroChartData.chartInstanceId = chartId;

  // Build period tabs HTML
  const periodTabsHtml = cppHeroChartData.periods
    .map((period) => {
      const isActive = period === cppHeroChartData.selectedPeriod ? 'active' : '';
      return `<button class="period-tab ${isActive}" role="tab" data-period="${period}" aria-pressed="${period === cppHeroChartData.selectedPeriod}">${period}</button>`;
    })
    .join('');

  // Build graph info section HTML
  let graphInfoHtml = '';
  if (cppHeroChartData.graphImage || cppHeroChartData.graphText) {
    graphInfoHtml = `
      <div class="cpp-hero-chart-graph-info">
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.75 11.5C1.26417 11.5 0.851 11.3298 0.5105 10.9895C0.170167 10.649 0 10.2358 0 9.75C0 9.26417 0.170167 8.851 0.5105 8.5105C0.851 8.17017 1.26417 8 1.75 8C1.86283 8 1.96475 8.00483 2.05575 8.0145C2.14675 8.024 2.23717 8.05508 2.327 8.10775L7.10775 3.327C7.05508 3.23717 7.024 3.14675 7.0145 3.05575C7.00483 2.96475 7 2.86283 7 2.75C7 2.26417 7.17017 1.851 7.5105 1.5105C7.851 1.17017 8.26417 1 8.75 1C9.23583 1 9.649 1.17017 9.9895 1.5105C10.3298 1.851 10.5 2.26417 10.5 2.75C10.5 2.809 10.4705 2.99492 10.4115 3.30775L13.1923 6.0885C13.2821 6.04867 13.3693 6.024 13.4538 6.0145C13.5384 6.00483 13.6372 6 13.75 6C13.8628 6 13.9632 6.00483 14.051 6.0145C14.1388 6.024 14.2244 6.05508 14.3077 6.10775L18.1077 2.30775C18.0551 2.22442 18.024 2.13883 18.0145 2.051C18.0048 1.96317 18 1.86283 18 1.75C18 1.26417 18.1702 0.851 18.5105 0.5105C18.851 0.170166 19.2642 0 19.75 0C20.2358 0 20.649 0.170166 20.9895 0.5105C21.3298 0.851 21.5 1.26417 21.5 1.75C21.5 2.23583 21.3298 2.649 20.9895 2.9895C20.649 3.32983 20.2358 3.5 19.75 3.5C19.6372 3.5 19.5368 3.49517 19.449 3.4855C19.3612 3.476 19.2756 3.44492 19.1923 3.39225L15.3923 7.19225C15.4449 7.27558 15.476 7.36117 15.4855 7.449C15.4952 7.53683 15.5 7.63717 15.5 7.75C15.5 8.23583 15.3298 8.649 14.9895 8.9895C14.649 9.32983 14.2358 9.5 13.75 9.5C13.2642 9.5 12.851 9.32983 12.5105 8.9895C12.1702 8.649 12 8.23583 12 7.75C12 7.63717 12.0048 7.53525 12.0145 7.44425C12.024 7.35325 12.0551 7.26283 12.1077 7.173L9.327 4.39225C9.23717 4.44492 9.14675 4.476 9.05575 4.4855C8.96475 4.49517 8.86283 4.5 8.75 4.5C8.691 4.5 8.50508 4.4705 8.19225 4.4115L3.4115 9.19225C3.45133 9.28208 3.476 9.36925 3.4855 9.45375C3.49517 9.53842 3.5 9.63717 3.5 9.75C3.5 10.2358 3.32983 10.649 2.9895 10.9895C2.649 11.3298 2.23583 11.5 1.75 11.5Z" fill="white"/>
        </svg>

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
        ${cppHeroChartData.badge ? `<div class="cpp-hero-chart-badge">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.054 11.4038L0 10.35L5.127 5.223C5.6655 4.691 6.3145 4.42342 7.074 4.42025C7.83367 4.41708 8.48275 4.68467 9.02125 5.223L10.1712 6.373C10.4226 6.62433 10.7193 6.74842 11.0615 6.74525C11.4038 6.74208 11.7007 6.618 11.952 6.373L16.8348 1.5H13.904V0H19.404V5.5H17.904V2.56925L13.0058 7.44225C12.4674 7.97425 11.8168 8.24192 11.054 8.24525C10.2912 8.24842 9.64375 7.984 9.11175 7.452L7.93675 6.277C7.69558 6.03583 7.40292 5.91692 7.05875 5.92025C6.71442 5.92342 6.42175 6.04233 6.18075 6.277L1.054 11.4038Z" fill="#7BF1A8"/>
</svg> ${cppHeroChartData.badge}</div>` : ''}
      </div>
    `;
  }

  // Build Learn More link (separate from the primary CTA button)
  let learnMoreHtml = '';
  if (cppHeroChartData.buttonLink) {
    learnMoreHtml = `
      <div class="cpp-hero-chart-learnmore-wrapper">
        <a class="cpp-hero-chart-learnmore" href="${cppHeroChartData.buttonLink}">Learn More 
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#FFF"></path>
        </svg>
        </a>
      </div>
    `;
  }

  // Build Overall Data panel (right side)
  let overallDataHtml = '';
  if (cppHeroChartData.overallData) {
    const data = cppHeroChartData.overallData;
    overallDataHtml = `
      <div class="cpp-hero-chart-overall-data">
        ${data.netIncreaseLabel ? `<div class="cpp-hero-chart-overall-label">${data.netIncreaseLabel}</div>` : ''}
        ${data.netIncreaseValue ? `<h1 class="cpp-hero-chart-overall-value">${data.netIncreaseValue}</h1>` : ''}
        ${data.netReturnLabel || data.netReturnValue ? '<hr class="cpp-hero-chart-separator" />' : ''}
        ${data.netReturnLabel ? `<div class="cpp-hero-chart-overall-label">${data.netReturnLabel}</div>` : ''}
        ${data.netReturnValue ? `<div class="cpp-hero-chart-overall-return-value">${data.netReturnValue}</div>` : ''}
        ${data.netReturnType ? `<div class="cpp-hero-chart-overall-type">${data.netReturnType}</div>` : ''}
        ${data.buttonLink ? '<hr class="cpp-hero-chart-separator" />' : ''}
        ${data.buttonLink ? `
          <div class="cpp-hero-chart-overall-button-container">
            <a href="${data.buttonLink}" class="link-primary" ${data.buttonTitle ? ` title="${data.buttonTitle}"` : ''}>${data.buttonText || 'Review our return details'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="currentColor"></path>
              </svg>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Build main HTML structure
  const descAttr = cppHeroChartData.description ? ` aria-describedby="${descriptionId}"` : '';
  const html = `
    <div class="cpp-hero-chart-wrapper" role="region" aria-labelledby="${titleId}"${descAttr}>
      <!-- Main Content Area: Chart Panel (Left) and Overall Data Panel (Right) -->
      <div class="cpp-hero-chart-content-wrapper">
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

        <!-- Overall Data Panel (Right Side) -->
        ${overallDataHtml}
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

  // Lazy load Highcharts - defer until after initial paint for better LCP
  const lazyInitChart = () => {
    initializeChart(chartId, cppHeroChartData).then(() => {
      // Load initial period data (default selected period) after chart is initialized
      // Use setTimeout to ensure chart is fully initialized before updating
      setTimeout(() => {
        updateChart(cppHeroChartData, cppHeroChartData.selectedPeriod);
      }, 100);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Chart initialization failed:', error);
    });
  };

  // Use requestIdleCallback to defer chart loading until browser is idle
  // This allows LCP to complete before loading heavy Highcharts library
  if ('requestIdleCallback' in window) {
    requestIdleCallback(lazyInitChart, { timeout: 2000 });
  } else {
    // Fallback for Safari - defer to next frame after paint
    setTimeout(lazyInitChart, 100);
  }
}
