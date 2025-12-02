import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let agentContext = null;

const popularSearches = [
  'CPP facts and history',
  'Investment holdings breakdown',
  'Private Equity investments',
  'Fund performance',
  'Careers at CPP Investments',
  'Who owns the 407 ETR?',
];

const topPages = [
  {
    title: 'Fund Facts',
    description: 'Details about our fund & structure',
    icon: 'fund',
  },
  {
    title: 'Reports & Data',
    description: 'Performance Metrics and data',
    icon: 'chart',
  },
  {
    title: 'Our Strategy',
    description: 'Long-term value creation approach',
    icon: 'strategy',
  },
  {
    title: 'Contact Us',
    description: 'How to reach us for your inquiries',
    icon: 'contact',
  },
];

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
    hub: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
      <path d="M5.67975 22.5C4.93208 22.5 4.29858 22.2407 3.77925 21.722C3.25975 21.2033 3 20.5702 3 19.8225C3 19.0748 3.25908 18.4423 3.77725 17.925C4.29542 17.4075 4.92933 17.1488 5.679 17.1488C5.89517 17.1488 6.09883 17.1726 6.29 17.2203C6.48117 17.2679 6.66908 17.3366 6.85375 17.4263L9.1815 14.5358C8.8405 14.1466 8.59558 13.7108 8.44675 13.2283C8.29808 12.7458 8.265 12.2493 8.3475 11.739L4.9795 10.616C4.74183 11.0198 4.4245 11.3391 4.0275 11.5738C3.63033 11.8083 3.17892 11.9255 2.67325 11.9255C1.92892 11.9255 1.29733 11.6667 0.7785 11.1493C0.2595 10.6318 0 9.9985 0 9.2495C0 8.50067 0.259333 7.86758 0.778 7.35025C1.29667 6.83308 1.92983 6.5745 2.6775 6.5745C3.42517 6.5745 4.05767 6.83317 4.575 7.3505C5.0925 7.868 5.35125 8.50117 5.35125 9.25C5.35125 9.291 5.34967 9.33142 5.3465 9.37125C5.34333 9.41092 5.34175 9.44383 5.34175 9.47L8.71675 10.6372C8.97875 10.1586 9.31667 9.76925 9.7305 9.46925C10.1443 9.16925 10.6187 8.96733 11.1538 8.8635V5.28C10.5103 5.12883 10.0028 4.80292 9.6315 4.30225C9.26017 3.80158 9.0745 3.25808 9.0745 2.67175C9.0745 1.92942 9.33325 1.29858 9.85075 0.77925C10.3682 0.25975 11.0015 0 11.7505 0C12.4993 0 13.1324 0.2595 13.6497 0.7785C14.1669 1.29733 14.4255 1.92975 14.4255 2.67575C14.4255 3.25942 14.2373 3.80158 13.861 4.30225C13.4845 4.80292 12.9796 5.12883 12.3463 5.28V8.8635C12.8813 8.96733 13.3568 9.16925 13.773 9.46925C14.1893 9.76925 14.5317 10.1586 14.8 10.6372L18.1583 9.47C18.1519 9.44283 18.1488 9.40933 18.1488 9.3695V9.25C18.1488 8.50117 18.4071 7.868 18.9237 7.3505C19.4404 6.83317 20.0726 6.5745 20.8202 6.5745C21.5679 6.5745 22.2014 6.83325 22.7208 7.35075C23.2403 7.86825 23.5 8.5015 23.5 9.2505C23.5 9.99933 23.2405 10.6324 22.7215 11.1497C22.2027 11.6669 21.5711 11.9255 20.8267 11.9255C20.3232 11.9255 19.8698 11.8072 19.4665 11.5705C19.0632 11.3337 18.7478 11.0155 18.5205 10.616L15.1525 11.739C15.2393 12.2493 15.209 12.7459 15.0615 13.2288C14.914 13.7118 14.6663 14.1442 14.3185 14.5262L16.6462 17.418C16.8252 17.3303 17.0117 17.2636 17.2057 17.2177C17.3997 17.1717 17.6048 17.1488 17.821 17.1488C18.5707 17.1488 19.2046 17.4071 19.7227 17.9237C20.2409 18.4404 20.5 19.0726 20.5 19.8202C20.5 20.5679 20.2407 21.2014 19.722 21.7208C19.2033 22.2403 18.5702 22.5 17.8225 22.5C17.0748 22.5 16.4423 22.2411 15.925 21.7232C15.4075 21.2054 15.1488 20.5718 15.1488 19.8225C15.1488 19.5042 15.1953 19.2108 15.2885 18.9423C15.3815 18.6737 15.5257 18.4158 15.7212 18.1685L13.3935 15.259C12.8957 15.5478 12.3456 15.6923 11.7433 15.6923C11.1409 15.6923 10.5902 15.5478 10.091 15.259L7.77875 18.1853C7.96808 18.4289 8.11083 18.6831 8.207 18.9478C8.30317 19.2126 8.35125 19.5042 8.35125 19.8225C8.35125 20.5718 8.09292 21.2054 7.57625 21.7232C7.05958 22.2411 6.42742 22.5 5.67975 22.5Z" fill="white"/>
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

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Convert markdown to clean HTML for chat display
function formatMarkdownToHTML(text) {
  if (!text) return '';

  let html = text
    // Remove ```markdown and ``` code blocks
    .replace(/```markdown\s*/gi, '')
    .replace(/```\s*/g, '')
    // Convert ### headings to styled bold text with spacing
    .replace(/^###\s+(.+)$/gm, '<strong class="response-heading">$1</strong>')
    // Convert ## headings to larger styled bold text
    .replace(/^##\s+(.+)$/gm, '<strong class="response-heading-lg">$1</strong>')
    // Convert # headings to largest styled bold text
    .replace(/^#\s+(.+)$/gm, '<strong class="response-heading-xl">$1</strong>')
    // Convert **bold** to <strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Convert bullet points (- item or * item) to styled list items
    .replace(/^[-*]\s+(.+)$/gm, '<span class="response-list-item">$1</span>')
    // Convert numbered lists (1. item, 2. item)
    .replace(/^\d+\.\s+(.+)$/gm, '<span class="response-list-item numbered">$1</span>')
    // Clean up extra whitespace/newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Convert remaining newlines to <br>
  html = html.replace(/\n/g, '<br>');

  // Clean up double <br> after headings
  html = html.replace(/(<\/strong>)<br><br>/g, '$1<br>');

  // Remove <br> tags between list items to prevent extra spacing
  html = html.replace(/(<\/span>)<br>(?=<span class="response-list-item")/g, '$1');

  return html;
}

function insertCitationLinks(text, sources) {
  if (!sources || !sources.length) return text;

  return text.replace(/\[(\d+)\]/g, (match, digit) => {
    const index = parseInt(digit, 10);
    if (sources[index]) {
      return `[<a href="${sources[index].url || '#'}" target="_blank" rel="noopener noreferrer">${digit}</a>]`;
    }
    return match;
  });
}

function createMessageHTML(content, isUser, timestamp, sources = null) {
  const timeStr = formatTime(timestamp);
  const sourcesId = `sources-${Date.now()}`;

  if (isUser) {
    return `
      <div class="chat-message user-message">
        <div class="message-bubble user-bubble">
          <p class="message-text">${content}</p>
          <span class="message-time">${timeStr}</span>
        </div>
      </div>
    `;
  }

  // Format markdown to HTML for bot responses
  const formattedContent = formatMarkdownToHTML(content);

  let sourcesHTML = '';
  if (sources && sources.length > 0) {
    const sourceLinks = sources.map((src, idx) => `
      <a href="${src.url || '#'}" class="source-link" target="_blank" rel="noopener noreferrer">
        <span>${idx}. ${src.title || src.url || 'Source'}</span>
      </a>
    `).join('');

    sourcesHTML = `
      <div class="sources-container" id="${sourcesId}">
        <button type="button" class="sources-toggle" data-target="${sourcesId}" aria-expanded="false" aria-controls="${sourcesId}-list">
          <span>Sources (${sources.length})</span>
          <span class="chevron-icon" aria-hidden="true">${getIcon('chevronDown')}</span>
        </button>
        <div class="sources-list collapsed" id="${sourcesId}-list">
          ${sourceLinks}
        </div>
      </div>
    `;
  }

  return `
    <div class="chat-message bot-message">
      <div class="message-bubble bot-bubble">
        <div class="message-text">${insertCitationLinks(formattedContent, sources)}</div>
        <span class="message-time">${timeStr}</span>
        ${sourcesHTML}
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  // Fetch the nav fragment to reuse the logo
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let logoHTML = '<img src="/icons/cppi-logo.svg" alt="CPPI Logo" onerror="this.parentElement.innerHTML=\'<span class=\\\'logo-text\\\'>CPP Investments</span>\'" />';

  try {
    // Use cache=true to leverage the fragment already loaded by the header
    const fragment = await loadFragment(navPath, true);
    if (fragment) {
      // The first section of the nav fragment contains the brand/logo
      const brandSection = fragment.firstElementChild;
      if (brandSection) {
        const pic = brandSection.querySelector('picture');
        const img = brandSection.querySelector('img');
        if (pic) {
          logoHTML = pic.outerHTML;
        } else if (img) {
          logoHTML = img.outerHTML;
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not load nav fragment for chatbot logo:', error);
  }

  // Generate popular searches HTML - use buttons for keyboard accessibility
  const popularSearchesHTML = popularSearches.map((search) => `
    <button type="button" class="chatbot-search-suggestion" data-query="${search}">
      <span class="search-icon" aria-hidden="true">${getIcon('search')}</span>
      <span>${search}</span>
    </button>
  `).join('');

  // Generate top pages HTML
  const topPagesHTML = topPages.map((page) => `
    <a href="#" class="chatbot-top-page-card">
      <div class="top-page-icon" aria-hidden="true">${getIcon(page.icon)}</div>
      <h4>${page.title}</h4>
      <p>${page.description}</p>
    </a>
  `).join('');

  block.innerHTML = `
    <!-- Full Page Overlay -->
    <div class="chatbot-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="chatbot-dialog-title">
      <!-- Header -->
      <div class="chatbot-overlay-header">
        <div class="chatbot-overlay-header-content">
          <div class="chatbot-logo">
            <a href="/" aria-label="Home" style="pointer-events: auto; cursor: pointer;">
              ${logoHTML}
            </a>

            </div>
              <div class="chatbot-close-btn" role="button" tabindex="0" aria-label="Close chat dialog">
                  <span class="menu-close-text" aria-hidden="true">Close</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M1.05375 13.3075L0 12.2538L5.6 6.65375L0 1.05375L1.05375 0L6.65375 5.6L12.2537 0L13.3075 1.05375L7.7075 6.65375L13.3075 12.2538L12.2537 13.3075L6.65375 7.7075L1.05375 13.3075Z" fill="#0273CF"></path>
                  </svg>
              </div>          
            </div> 
          </div>

          <div class="chatbot-divider"></div>

      <div class="chatbot-overlay-content">
        <!-- Initial Search View -->
        <div class="chatbot-search-view">
          <div class="chatbot-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.92975 22.75C5.18208 22.75 4.54858 22.4907 4.02925 21.972C3.50975 21.4533 3.25 20.8202 3.25 20.0725C3.25 19.3248 3.50908 18.6923 4.02725 18.175C4.54542 17.6575 5.17933 17.3988 5.929 17.3988C6.14517 17.3988 6.34883 17.4226 6.54 17.4703C6.73117 17.5179 6.91908 17.5866 7.10375 17.6763L9.4315 14.7858C9.0905 14.3966 8.84558 13.9608 8.69675 13.4783C8.54808 12.9958 8.515 12.4993 8.5975 11.989L5.2295 10.866C4.99183 11.2698 4.6745 11.5891 4.2775 11.8238C3.88033 12.0583 3.42892 12.1755 2.92325 12.1755C2.17892 12.1755 1.54733 11.9167 1.0285 11.3993C0.5095 10.8818 0.25 10.2485 0.25 9.4995C0.25 8.75067 0.509333 8.11758 1.028 7.60025C1.54667 7.08308 2.17983 6.8245 2.9275 6.8245C3.67517 6.8245 4.30767 7.08317 4.825 7.6005C5.3425 8.118 5.60125 8.75117 5.60125 9.5C5.60125 9.541 5.59967 9.58142 5.5965 9.62125C5.59333 9.66092 5.59175 9.69383 5.59175 9.72L8.96675 10.8872C9.22875 10.4086 9.56667 10.0193 9.9805 9.71925C10.3943 9.41925 10.8687 9.21733 11.4038 9.1135V5.53C10.7603 5.37883 10.2528 5.05292 9.8815 4.55225C9.51017 4.05158 9.3245 3.50808 9.3245 2.92175C9.3245 2.17942 9.58325 1.54858 10.1007 1.02925C10.6182 0.50975 11.2515 0.25 12.0005 0.25C12.7493 0.25 13.3824 0.5095 13.8997 1.0285C14.4169 1.54733 14.6755 2.17975 14.6755 2.92575C14.6755 3.50942 14.4873 4.05158 14.111 4.55225C13.7345 5.05292 13.2296 5.37883 12.5963 5.53V9.1135C13.1313 9.21733 13.6068 9.41925 14.023 9.71925C14.4393 10.0193 14.7817 10.4086 15.05 10.8872L18.4083 9.72C18.4019 9.69283 18.3988 9.65933 18.3988 9.6195V9.5C18.3988 8.75117 18.6571 8.118 19.1737 7.6005C19.6904 7.08317 20.3226 6.8245 21.0702 6.8245C21.8179 6.8245 22.4514 7.08325 22.9708 7.60075C23.4903 8.11825 23.75 8.7515 23.75 9.5005C23.75 10.2493 23.4905 10.8824 22.9715 11.3997C22.4527 11.9169 21.8211 12.1755 21.0767 12.1755C20.5732 12.1755 20.1198 12.0572 19.7165 11.8205C19.3132 11.5837 18.9978 11.2655 18.7705 10.866L15.4025 11.989C15.4893 12.4993 15.459 12.9959 15.3115 13.4788C15.164 13.9618 14.9163 14.3942 14.5685 14.7762L16.8962 17.668C17.0752 17.5803 17.2617 17.5136 17.4557 17.4677C17.6497 17.4217 17.8548 17.3988 18.071 17.3988C18.8207 17.3988 19.4546 17.6571 19.9727 18.1737C20.4909 18.6904 20.75 19.3226 20.75 20.0702C20.75 20.8179 20.4907 21.4514 19.972 21.9708C19.4533 22.4903 18.8202 22.75 18.0725 22.75C17.3248 22.75 16.6923 22.4911 16.175 21.9732C15.6575 21.4554 15.3988 20.8218 15.3988 20.0725C15.3988 19.7542 15.4453 19.4608 15.5385 19.1923C15.6315 18.9237 15.7757 18.6658 15.9712 18.4185L13.6435 15.509C13.1457 15.7978 12.5956 15.9423 11.9933 15.9423C11.3909 15.9423 10.8402 15.7978 10.341 15.509L8.02875 18.4353C8.21808 18.6789 8.36083 18.9331 8.457 19.1978C8.55317 19.4626 8.60125 19.7542 8.60125 20.0725C8.60125 20.8218 8.34292 21.4554 7.82625 21.9732C7.30958 22.4911 6.67742 22.75 5.92975 22.75Z" fill="white"/>
            </svg>
            <span>Chat with Fundy</span>
          </div>
          
          <h1 class="chatbot-heading" id="chatbot-dialog-title">How can we help you today?</h1>
          <p class="chatbot-subheading">Chat with Fundy, our virtual assistant to learn more about CPP Investments, ask questions, and discover more about our fund.</p>
          
          <div class="chatbot-search-wrapper">
            <label for="chatInput" class="visually-hidden">Ask a question about CPP Investments</label>
            <input 
              type="text" 
              id="chatInput" 
              class="chatbot-search-input" 
              placeholder='Ask me about things like "Investment Strategy" or "Q3 Performance"...'
              aria-describedby="chatbot-search-hint"
            />
            <span id="chatbot-search-hint" class="visually-hidden">Press Enter to send your question</span>
          </div>

          <div class="chatbot-popular-searches">
            <h3>Popular searches</h3>
            <div class="popular-searches-grid">
              ${popularSearchesHTML}
            </div>
          </div>

          <div class="chatbot-top-pages">
            <h3>Top Pages</h3>
            <div class="top-pages-grid">
              ${topPagesHTML}
            </div>
          </div>
        </div>

        <!-- Chat Conversation View (hidden initially) -->
        <div class="chatbot-chat-view hidden">
          <div class="chatbot-badge">
            <span class="badge-icon" aria-hidden="true">${getIcon('hub')}</span>
            <span>Chat with Fundy</span>
          </div>
          
          <div class="chat-body" id="chatBody" role="log" aria-live="polite" aria-label="Chat conversation"></div>
          
            <div class="chat-input-wrapper">
              <label for="chatInputConversation" class="visually-hidden">Type your message</label>
              <input id="chatInputConversation" placeholder="Ask a question" aria-describedby="chat-input-hint" />
              <span id="chat-input-hint" class="visually-hidden">Press Enter or click send to submit</span>
              <button id="chatSend" type="button" aria-label="Send message"><span aria-hidden="true">${getIcon('send')}</span></button>
            </div>
        </div>
      </div>
    </div>
  `;

  // DOM Elements
  const overlay = block.querySelector('.chatbot-overlay');
  const closeBtn = block.querySelector('.chatbot-close-btn');
  const searchView = block.querySelector('.chatbot-search-view');
  const chatView = block.querySelector('.chatbot-chat-view');
  const chatInput = block.querySelector('#chatInput');
  const chatInputConversation = block.querySelector('#chatInputConversation');
  const sendBtn = block.querySelector('#chatSend');
  const chatBody = block.querySelector('#chatBody');
  const searchSuggestions = block.querySelectorAll('.chatbot-search-suggestion');

  // Store the element that had focus before opening
  let previouslyFocusedElement = null;

  // Function to open the chatbot overlay (exposed globally for header search icon)
  function openChatbot() {
    previouslyFocusedElement = document.activeElement;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  }

  // Expose openChatbot globally so header search can trigger it
  window.openChatbotOverlay = openChatbot;

  // Close overlay and restore focus
  function closeChatbot() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    // Reset to search view
    searchView.classList.remove('hidden');
    chatView.classList.add('hidden');
    // Clear chat
    chatBody.innerHTML = '';
    // Restore focus to previously focused element
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus();
    }
  }

  closeBtn.addEventListener('click', closeChatbot);

  closeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeChatbot();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeBtn.click();
    }
  });

  // Focus trap for modal accessibility
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || overlay.classList.contains('hidden')) return;

    const focusableElements = Array.from(overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )).filter((el) => el.offsetParent !== null);

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab: if on first element, wrap to last
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else if (document.activeElement === lastFocusable) {
      // Tab: if on last element, wrap to first
      e.preventDefault();
      firstFocusable.focus();
    }
  });

  // Switch to chat view
  function showChatView() {
    searchView.classList.add('hidden');
    chatView.classList.remove('hidden');
    chatInputConversation.focus();
  }

  // Toggle sources dropdown with accessibility
  chatBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.sources-toggle');
    if (btn) {
      e.stopPropagation();
      const container = btn.closest('.sources-container');
      const sourcesList = container.querySelector('.sources-list');
      const chevron = btn.querySelector('.chevron-icon');
      const isExpanded = !sourcesList.classList.contains('collapsed');

      sourcesList.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      chevron.innerHTML = sourcesList.classList.contains('collapsed')
        ? getIcon('chevronDown')
        : getIcon('chevronUp');
    }
  });

  // Send message function
  async function sendMessage(msg) {
    if (!msg || !msg.trim()) return;

    // Switch to chat view
    showChatView();

    const userTimestamp = new Date();

    // Add user message
    chatBody.insertAdjacentHTML('beforeend', createMessageHTML(msg, true, userTimestamp));
    chatInput.value = '';
    chatInputConversation.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Add loading indicator with "Fundy is thinking..." - accessible status
    const loadingId = `loading-${Date.now()}`;
    chatBody.insertAdjacentHTML('beforeend', `
          <div class="chat-message bot-message" id="${loadingId}" role="status" aria-label="Fundy is thinking">
            <div class="thinking-indicator">
              <span class="thinking-icon" aria-hidden="true">${getIcon('hub')}</span>
              <span class="thinking-text">Fundy is thinking</span>
              <span class="thinking-dots" aria-hidden="true">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        `);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Fire dataLayer event: user message
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'message_sent',
      message_detail: msg,
    });

    try {
      const res = await fetch('https://cppi-demo.accenture.com/es/api/v2/agent/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(
          agentContext
            ? { request: msg, agent_context: agentContext }
            : { request: msg },
        ),
      });

      const data = await res.json();
      if (data?.agent_context) {
        agentContext = data.agent_context;
      }
      // Remove loading indicator
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) loadingEl.remove();

      // Extract bot text response
      const reply = data?.response_data?.text_responses?.[0]
        || 'I couldn\'t generate a response.';

      // Extract sources/references
      const sources = data?.response_data?.references || [];

      const botTimestamp = new Date();
      chatBody.insertAdjacentHTML('beforeend', createMessageHTML(reply, false, botTimestamp, sources));
      chatBody.scrollTop = chatBody.scrollHeight;

      // Extract citation for dataLayer
      const citation = sources?.[0]?.title || sources?.[0]?.url || null;

      // Fire dataLayer event: bot response citation
      if (citation) {
        window.dataLayer.push({
          event: 'message_response',
          citation,
        });
      }
    } catch (e) {
      // Remove loading indicator
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) loadingEl.remove();

      const botTimestamp = new Date();
      chatBody.insertAdjacentHTML('beforeend', createMessageHTML('Sorry, something went wrong. Please try again.', false, botTimestamp));
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // Event listeners for search suggestions
  searchSuggestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      sendMessage(query);
    });
  });

  // Event listeners for input fields
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(chatInput.value.trim());
    }
  });

  chatInputConversation.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(chatInputConversation.value.trim());
    }
  });

  sendBtn.addEventListener('click', () => {
    sendMessage(chatInputConversation.value.trim());
  });
}
