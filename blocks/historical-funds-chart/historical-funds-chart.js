const fundStats = [
  {
    title: '22M+',
    description: 'CPP Contributors and Beneficiaries',
    icon: 'fund',
  },
  {
    title: '8.3%',
    description: '20-Year Nominal Return',
    icon: 'fund',
  },
  {
    title: '5.6%',
    description: '10-year Net Real Return',
    icon: 'fund',
  },
];

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

function getIcon(name) {
  const icons = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19.5423 20.577L13.2616 14.296C12.7616 14.7088 12.1866 15.0319 11.5366 15.2653C10.8866 15.4986 10.2141 15.6153 9.5193 15.6153C7.81014 15.6153 6.36364 15.0235 5.1798 13.84C3.99597 12.6565 3.40405 11.2103 3.40405 9.50152C3.40405 7.79285 3.9958 6.34618 5.1793 5.16152C6.3628 3.97702 7.80897 3.38477 9.5178 3.38477C11.2265 3.38477 12.6731 3.97668 13.8578 5.16051C15.0423 6.34435 15.6346 7.79085 15.6346 9.50002C15.6346 10.2142 15.5147 10.8963 15.2751 11.5463C15.0352 12.1963 14.7153 12.7616 14.3153 13.2423L20.5961 19.523L19.5423 20.577ZM9.5193 14.1155C10.8078 14.1155 11.8991 13.6683 12.7933 12.774C13.6876 11.8798 14.1348 10.7885 14.1348 9.50002C14.1348 8.21152 13.6876 7.12018 12.7933 6.22601C11.8991 5.33168 10.8078 4.88452 9.5193 4.88452C8.2308 4.88452 7.13947 5.33168 6.2453 6.22601C5.35097 7.12018 4.9038 8.21152 4.9038 9.50002C4.9038 10.7885 5.35097 11.8798 6.2453 12.774C7.13947 13.6683 8.2308 14.1155 9.5193 14.1155Z" fill="#0273CF"/>
    </svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    fund: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
      <path d="M1.054 11.4038L0 10.35L5.127 5.223C5.6655 4.691 6.3145 4.42342 7.074 4.42025C7.83367 4.41708 8.48275 4.68467 9.02125 5.223L10.1712 6.373C10.4226 6.62433 10.7193 6.74842 11.0615 6.74525C11.4038 6.74208 11.7007 6.618 11.952 6.373L16.8348 1.5H13.904V0H19.404V5.5H17.904V2.56925L13.0058 7.44225C12.4674 7.97425 11.8168 8.24192 11.054 8.24525C10.2912 8.24842 9.64375 7.984 9.11175 7.452L7.93675 6.277C7.69558 6.03583 7.40292 5.91692 7.05875 5.92025C6.71442 5.92342 6.42175 6.04233 6.18075 6.277L1.054 11.4038Z" fill="#0273CF"/>
    </svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.05775 20.5C4.55258 20.5 4.125 20.325 3.775 19.975C3.425 19.625 3.25 19.1974 3.25 18.6923V3H4.75V18.6923C4.75 18.7692 4.78208 18.8398 4.84625 18.9038C4.91025 18.9679 4.98075 19 5.05775 19H20.75V20.5H5.05775ZM6.69225 17.25V9.09625H9.69225V17.25H6.69225ZM11.4423 17.25V4.09625H14.4423V17.25H11.4423ZM16.1923 17.25V13.0963H19.1923V17.25H16.1923Z" fill="#0273CF"/>
    </svg>`,
    strategy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16.2557 20.5L15.2115 19.4557L16.7865 17.8558L15.2115 16.2807L16.2557 15.2115L17.8558 16.8115L19.4307 15.2115L20.5 16.2807L18.9 17.8558L20.5 19.4557L19.4307 20.5L17.8558 18.925L16.2557 20.5ZM6.25 19C6.5975 19 6.89267 18.8785 7.1355 18.6355C7.3785 18.3927 7.5 18.0975 7.5 17.75C7.5 17.4025 7.3785 17.1073 7.1355 16.8645C6.89267 16.6215 6.5975 16.5 6.25 16.5C5.9025 16.5 5.60733 16.6215 5.3645 16.8645C5.1215 17.1073 5 17.4025 5 17.75C5 18.0975 5.1215 18.3927 5.3645 18.6355C5.60733 18.8785 5.9025 19 6.25 19ZM6.25 20.5C5.48717 20.5 4.83817 20.2323 4.303 19.697C3.76767 19.1618 3.5 18.5128 3.5 17.75C3.5 16.9872 3.76767 16.3382 4.303 15.803C4.83817 15.2677 5.48717 15 6.25 15C6.85383 15 7.39708 15.1773 7.87975 15.5318C8.36242 15.8863 8.69158 16.3552 8.86725 16.9385C9.58142 16.8128 10.1731 16.4737 10.6423 15.9212C11.1116 15.3686 11.3463 14.7282 11.3463 14V10.1443C11.3463 8.83142 11.8097 7.71158 12.7365 6.78475C13.6635 5.85775 14.7834 5.39425 16.0962 5.39425H17.6115L15.7865 3.56925L16.8558 2.5L20.5 6.14425L16.8558 9.7885L15.7865 8.74425L17.602 6.89425H16.0962C15.1924 6.89425 14.4247 7.20992 13.7933 7.84125C13.1619 8.47275 12.8462 9.24042 12.8462 10.1443V14C12.8462 15.1333 12.469 16.1208 11.7145 16.9625C10.96 17.8042 10.0212 18.3013 8.898 18.4538C8.743 19.0576 8.419 19.5496 7.926 19.9298C7.433 20.3099 6.87433 20.5 6.25 20.5ZM4.54425 8.7885L3.5 7.74425L5.075 6.14425L3.5 4.56925L4.54425 3.5L6.14425 5.1L7.71925 3.5L8.7885 4.56925L7.1885 6.14425L8.7885 7.74425L7.71925 8.7885L6.14425 7.2135L4.54425 8.7885Z" fill="#0273CF"/>
    </svg>`,
    contact: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 13.7692C12.4858 13.7692 12.899 13.5991 13.2395 13.2587C13.5798 12.9183 13.75 12.5051 13.75 12.0192C13.75 11.5334 13.5798 11.1202 13.2395 10.7797C12.899 10.4394 12.4858 10.2693 12 10.2693C11.5142 10.2693 11.101 10.4394 10.7605 10.7797C10.4202 11.1202 10.25 11.5334 10.25 12.0192C10.25 12.5051 10.4202 12.9183 10.7605 13.2587C11.101 13.5991 11.5142 13.7692 12 13.7692ZM8.25 17.4615H15.75V17.098C15.75 16.7428 15.6545 16.4275 15.4635 16.152C15.2725 15.8763 15.0109 15.6648 14.6788 15.5173C14.2648 15.3404 13.835 15.2036 13.3895 15.1067C12.944 15.0099 12.4808 14.9615 12 14.9615C11.5192 14.9615 11.056 15.0099 10.6105 15.1067C10.165 15.2036 9.73525 15.3404 9.32125 15.5173C8.98908 15.6648 8.7275 15.8763 8.5365 16.152C8.3455 16.4275 8.25 16.7428 8.25 17.098V17.4615ZM17.6923 21.5H6.30775C5.80258 21.5 5.375 21.325 5.025 20.975C4.675 20.625 4.5 20.1974 4.5 19.6923V4.30775C4.5 3.80258 4.675 3.375 5.025 3.025C5.375 2.675 5.80258 2.5 6.30775 2.5H13.7885L19.5 8.2115V19.6923C19.5 20.1974 19.325 20.625 18.975 20.975C18.625 21.325 18.1974 21.5 17.6923 21.5ZM17.6923 20C17.7692 20 17.8398 19.9679 17.9038 19.9038C17.9679 19.8398 18 19.7693 18 19.6923V8.85L13.15 4H6.30775C6.23075 4 6.16025 4.03208 6.09625 4.09625C6.03208 4.16025 6 4.23075 6 4.30775V19.6923C6 19.7693 6.03208 19.8398 6.09625 19.9038C6.16025 19.9679 6.23075 20 6.30775 20H17.6923Z" fill="#0273CF"/>
    </svg>`,
    hub: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <circle cx="12" cy="4" r="2" fill="currentColor"/>
      <circle cx="12" cy="20" r="2" fill="currentColor"/>
      <circle cx="4" cy="12" r="2" fill="currentColor"/>
      <circle cx="20" cy="12" r="2" fill="currentColor"/>
      <path d="M12 7V9M12 15V17M9 12H7M17 12H15" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
    </svg>`,
    chevronDown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    chevronUp: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    link: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66669 8.66666C6.95299 9.04942 7.31826 9.36612 7.73772 9.59529C8.15718 9.82446 8.62103 9.96074 9.09779 9.99489C9.57455 10.029 10.0531 9.96024 10.5009 9.79319C10.9487 9.62613 11.3554 9.36471 11.6934 9.02666L13.6934 7.02666C14.3005 6.39799 14.6365 5.55598 14.6289 4.68199C14.6213 3.808 14.2708 2.97196 13.6527 2.35394C13.0347 1.73591 12.1987 1.38535 11.3247 1.37775C10.4507 1.37016 9.60869 1.70614 8.98002 2.31333L7.83335 3.45333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.33335 7.33334C9.04705 6.95058 8.68178 6.63388 8.26232 6.40471C7.84286 6.17554 7.37901 6.03926 6.90225 6.00511C6.42549 5.97096 5.94695 6.03976 5.49911 6.20682C5.05127 6.37387 4.6446 6.63529 4.30669 6.97334L2.30669 8.97334C1.69949 9.60201 1.36351 10.444 1.37111 11.318C1.3787 12.192 1.72927 13.028 2.34729 13.6461C2.96531 14.2641 3.80135 14.6147 4.67534 14.6222C5.54933 14.6298 6.39134 14.2939 7.02002 13.6867L8.16002 12.5467" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };
  return icons[name] || '';
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

  // Extract stats cards (assumed to be in the 5th row or subsequent rows)
  // We'll check if there are specific rows for cards or if we use mock cards
  let statsHtml = '';
  // if (children.length > 4) {
  //   // ... existing logic for authored cards ...
  //   // Assuming authored content follows the new structure or needs adaptation
  //   // For now, let's focus on the mock data structure as requested
  //   // If authored content is present, we might need to adapt it to the new card style
  //   // But the prompt implies modifying the mock/default appearance primarily
  //
  //   const cards = [];
  //   for (let i = 4; i < children.length; i += 1) {
  //     const cardContent = children[i];
  //     const value = cardContent.children[0]?.textContent.trim();
  //     const label = cardContent.children[1]?.textContent.trim();
  //     if (value && label) {
  //       cards.push({ title: value, description: label, icon: 'fund' });
  //     }
  //   }
  //
  //   if (cards.length > 0) {
  //     const cardsHtml = cards.map((card) => `
  //               <div class="historical-funds-card">
  //                 <div class="fund-stats-icon" aria-hidden="true">${getIcon(card.icon)}</div>
  //                 <h4>${card.title}</h4>
  //                 <p>${card.description}</p>
  //               </div>
  //             `).join('');
  //
  //     statsHtml = `
  //             <div class="historical-funds-stats">
  //               <div class="fund-stats-grid">
  //                 ${cardsHtml}
  //               </div>
  //             </div>
  //           `;
  //   }
  // } else {
  const cardsHtml = fundStats.map((page) => `
            <div class="historical-funds-card">
              <div class="fund-stats-icon" aria-hidden="true">${getIcon(page.icon)}</div>
              <h4>${page.title}</h4>
              <p>${page.description}</p>
            </div>
          `).join('');

  statsHtml = `
          <div class="historical-funds-stats">
            <div class="fund-stats-grid">
              ${cardsHtml}
            </div>
          </div>
        `;
  // }

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
      
          ${statsHtml}
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
