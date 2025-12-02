/**
 * Mock data for the Historical Fund Performance chart
 * Two series: Cumulative Net Income and Total Fund Size
 * Range: 2014 - 2025
 */
function getMockChartData() {
  return {
    chart: {
      type: 'area',
      backgroundColor: '#ffffff',
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: '<div style="display: flex; align-items: center; gap: 8px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n'
        + '  <path d="M3 17.75C2.51417 17.75 2.101 17.5798 1.7605 17.2395C1.42017 16.899 1.25 16.4858 1.25 16C1.25 15.5142 1.42017 15.101 1.7605 14.7605C2.101 14.4202 2.51417 14.25 3 14.25C3.11283 14.25 3.21475 14.2548 3.30575 14.2645C3.39675 14.274 3.48717 14.3051 3.577 14.3577L8.35775 9.577C8.30508 9.48717 8.274 9.39675 8.2645 9.30575C8.25483 9.21475 8.25 9.11283 8.25 9C8.25 8.51417 8.42017 8.101 8.7605 7.7605C9.101 7.42017 9.51417 7.25 10 7.25C10.4858 7.25 10.899 7.42017 11.2395 7.7605C11.5798 8.101 11.75 8.51417 11.75 9C11.75 9.059 11.7205 9.24492 11.6615 9.55775L14.4423 12.3385C14.5321 12.2987 14.6193 12.274 14.7038 12.2645C14.7884 12.2548 14.8872 12.25 15 12.25C15.1128 12.25 15.2132 12.2548 15.301 12.2645C15.3888 12.274 15.4744 12.3051 15.5577 12.3577L19.3577 8.55775C19.3051 8.47442 19.274 8.38883 19.2645 8.301C19.2548 8.21317 19.25 8.11283 19.25 8C19.25 7.51417 19.4202 7.101 19.7605 6.7605C20.101 6.42017 20.5142 6.25 21 6.25C21.4858 6.25 21.899 6.42017 22.2395 6.7605C22.5798 7.101 22.75 7.51417 22.75 8C22.75 8.48583 22.5798 8.899 22.2395 9.2395C21.899 9.57983 21.4858 9.75 21 9.75C20.8872 9.75 20.7868 9.74517 20.699 9.7355C20.6112 9.726 20.5256 9.69492 20.4423 9.64225L16.6423 13.4423C16.6949 13.5256 16.726 13.6112 16.7355 13.699C16.7452 13.7868 16.75 13.8872 16.75 14C16.75 14.4858 16.5798 14.899 16.2395 15.2395C15.899 15.5798 15.4858 15.75 15 15.75C14.5142 15.75 14.101 15.5798 13.7605 15.2395C13.4202 14.899 13.25 14.4858 13.25 14C13.25 13.8872 13.2548 13.7852 13.2645 13.6942C13.274 13.6033 13.3051 13.5128 13.3577 13.423L10.577 10.6423C10.4872 10.6949 10.3968 10.726 10.3058 10.7355C10.2148 10.7452 10.1128 10.75 10 10.75C9.941 10.75 9.75508 10.7205 9.44225 10.6615L4.6615 15.4423C4.70133 15.5321 4.726 15.6193 4.7355 15.7037C4.74517 15.7884 4.75 15.8872 4.75 16C4.75 16.4858 4.57983 16.899 4.2395 17.2395C3.899 17.5798 3.48583 17.75 3 17.75Z" fill="#0273CF"/>\n'
        + '</svg> Cumulative Fund Income</div>',
      align: 'left',
      useHTML: true,
      style: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2C3D50',
        fontFamily: 'inherit',
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'top',
      layout: 'horizontal',
      itemStyle: {
        color: '#6F7176',
        fontWeight: '400',
        fontSize: '12px',
      },
      symbolRadius: 0,
      symbolHeight: 12,
      symbolWidth: 12,
    },
    xAxis: {
      // Use linear axis instead of categories to have full control over padding
      type: 'linear',
      min: 2014,
      max: 2025,
      tickInterval: 1,
      lineColor: '#E3E4E5',
      tickWidth: 0,
      minPadding: 0,
      maxPadding: 0,
      startOnTick: true,
      endOnTick: true,
      labels: {
        style: {
          color: '#6F7176',
          fontSize: '12px',
        },
        // Ensure we show integer years
        formatter() {
          return this.value;
        },
      },
    },
    yAxis: {
      title: { text: null },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#E3E4E5',
      labels: {
        format: '{value}',
        style: {
          color: '#6F7176',
          fontSize: '12px',
        },
      },
      min: 0,
      max: 800,
      tickInterval: 100,
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: 'circle',
        },
        fillOpacity: 1,
      },
      series: {
        lineWidth: 2,
        states: {
          hover: {
            enabled: true,
            lineWidth: 3,
          },
        },
      },
    },
    tooltip: {
      shared: false,
      useHTML: true,
      backgroundColor: '#fff',
      borderColor: '#E3E4E5',
      borderRadius: 8,
      shadow: true,
      formatter() {
        return `<div style="padding: 4px; text-align: center;">
                      <div style="font-size: 16px; font-weight: 600; color: #0273CF; margin-bottom: 4px;">$${this.y}B</div>
                      <div style="font-size: 12px; color: #6F7176;">${this.x} ${this.series.name}</div>
                    </div>`;
      },
    },
    series: [
      {
        name: 'Cumulative Net Income',
        linkedTo: 'legend-net-income',
        data: [
          [2014, 105], [2015, 120], [2016, 130], [2017, 160], [2018, 190],
          [2019, 230], [2020, 280], [2021, 340], [2022, 380], [2023, 389.5],
          [2024, 440], [2025, 480],
        ],
        color: '#0273CF',
        fillColor: {
          linearGradient: {
            x1: 0, y1: 0, x2: 0, y2: 1,
          },
          stops: [
            [0, 'rgba(2, 115, 207, 0.8)'],
            [1, 'rgba(2, 115, 207, 0.1)'],
          ],
        },
        zIndex: 2,
      },
      {
        name: 'Total Fund Size',
        linkedTo: 'legend-fund-size',
        data: [
          [2014, 380], [2015, 410], [2016, 420], [2017, 450], [2018, 490],
          [2019, 530], [2020, 554.7], [2021, 620], [2022, 660], [2023, 690],
          [2024, 730], [2025, 760],
        ],
        color: '#2CD5C4',
        fillColor: {
          linearGradient: {
            x1: 0, y1: 0, x2: 0, y2: 1,
          },
          stops: [
            [0, 'rgba(44, 213, 196, 0.8)'],
            [1, 'rgba(44, 213, 196, 0.1)'],
          ],
        },
        zIndex: 1,
      },
      // Dummy series for Legend - Cumulative Net Income
      {
        id: 'legend-net-income',
        name: 'Cumulative Net Income',
        color: '#0273CF',
        type: 'scatter',
        marker: {
          symbol: 'square',
          radius: 6,
        },
        data: [],
        showInLegend: true,
        legendIndex: 0,
      },
      // Dummy series for Legend - Total Fund Size
      {
        id: 'legend-fund-size',
        name: 'Total Fund Size',
        color: '#2CD5C4',
        type: 'scatter',
        marker: {
          symbol: 'square',
          radius: 6,
        },
        data: [],
        showInLegend: true,
        legendIndex: 1,
      },
    ],
  };
}

/**
 * Initialize Highcharts for the component
 * @param {string} chartId - The chart container ID
 * @param {Object} chartOptions - The chart configuration
 */
async function initializeChart(chartId, chartOptions) {
  const container = document.getElementById(chartId);
  if (!container) return;

  if (typeof window.Highcharts === 'undefined') {
    container.innerHTML = '<div class="loading-chart">Loading chart...</div>';
    try {
      const { loadHighcharts } = await import(`${window.hlx.codeBasePath}/scripts/aem.js`);
      await loadHighcharts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load Highcharts:', error);
      container.innerHTML = '<div class="error">Chart library not available.</div>';
      return;
    }
  }

  try {
    window.Highcharts.chart(chartId, chartOptions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Highchart:', error);
    container.innerHTML = '<div class="error">Error rendering chart.</div>';
  }
}

export default function decorate(block) {
  const children = [...block.children];
  const badge = children[0]?.textContent.trim();
  const title = children[1]?.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent.trim();
  const description = children[2]?.innerHTML;

  let chartConfig = getMockChartData();
  const authoredConfigJson = children[3]?.textContent.trim();
  if (authoredConfigJson && authoredConfigJson.startsWith('{')) {
    try {
      const parsedConfig = JSON.parse(authoredConfigJson);
      // Deep merge or override mock data
      chartConfig = { ...chartConfig, ...parsedConfig };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Invalid chart JSON, using mock data', e);
    }
  }

  const chartId = `historical-chart-${Date.now()}`;

  // Remove the duplicate fundFactsHtml generation at the end of function
  // and use statsHtml instead

  // Build HTML
  const html = `
        <div class="historical-funds-container">
          ${badge ? `<div class="historical-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M1.054 11.4038L0 10.35L5.127 5.223C5.6655 4.691 6.3145 4.42342 7.074 4.42025C7.83367 4.41708 8.48275 4.68467 9.02125 5.223L10.1712 6.373C10.4226 6.62433 10.7193 6.74842 11.0615 6.74525C11.4038 6.74208 11.7007 6.618 11.952 6.373L16.8348 1.5H13.904V0H19.404V5.5H17.904V2.56925L13.0058 7.44225C12.4674 7.97425 11.8168 8.24192 11.054 8.24525C10.2912 8.24842 9.64375 7.984 9.11175 7.452L7.93675 6.277C7.69558 6.03583 7.40292 5.91692 7.05875 5.92025C6.71442 5.92342 6.42175 6.04233 6.18075 6.277L1.054 11.4038Z" fill="#2C3D50"/>
            </svg>
            ${badge}
          </div>` : ''}
      
          ${title ? `<h2 class="historical-title">${title}</h2>` : ''}
      
          ${description ? `<div class="historical-description">${description}</div>` : ''}
      
          <div class="historical-chart-wrapper">
            <div id="${chartId}" class="historical-chart-element"></div>
          </div>
        </div>
      `;

  block.innerHTML = html;

  // Initialize chart
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initializeChart(chartId, chartConfig), { timeout: 2000 });
  } else {
    setTimeout(() => initializeChart(chartId, chartConfig), 100);
  }
}
