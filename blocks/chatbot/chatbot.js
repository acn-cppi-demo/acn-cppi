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
    search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    fund: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 9L13 14L9 10L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    chart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    strategy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    contact: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 17C16 14.7909 14.2091 13 12 13C9.79086 13 8 14.7909 8 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    // Remove citation markers [1], [2], etc.
    .replace(/\[(\d+)\]/g, '')
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

  return html;
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
    const sourceLinks = sources.map((src) => `
      <a href="${src.url || '#'}" class="source-link" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">${getIcon('link')}</span>
        <span>${src.url || src.doc_id || 'Source'}</span>
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
        <div class="message-text">${formattedContent}</div>
        <span class="message-time">${timeStr}</span>
        ${sourcesHTML}
      </div>
    </div>
  `;
}

export default function decorate(block) {
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
        <div class="chatbot-logo">
          <img src="/icons/cppi-logo.svg" alt="CPPI Logo" onerror="this.parentElement.innerHTML='<span class=\\'logo-text\\'>CPP Investments</span>'" />
        </div>
        <button type="button" class="chatbot-close-btn" aria-label="Close chat dialog">
            <span class="menu-close-text" aria-hidden="true">Close</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M1.05375 13.3075L0 12.2538L5.6 6.65375L0 1.05375L1.05375 0L6.65375 5.6L12.2537 0L13.3075 1.05375L7.7075 6.65375L13.3075 12.2538L12.2537 13.3075L6.65375 7.7075L1.05375 13.3075Z" fill="#0273CF"></path>
            </svg>
        </button>        
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
          <p class="chatbot-subheading">Chat with Fundy, our virtual assistant to learn more about CPP Investments, ask questions, and discover more about our fund</p>
          
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
            <button id="chatSend" type="button" aria-label="Send message">${getIcon('send')}</button>
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
  closeBtn.addEventListener('click', () => {
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

    const focusableElements = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
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
  function setupSourcesToggle() {
    document.querySelectorAll('.sources-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
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
      });
    });
  }

  // Send message function
  async function sendMessage(msg) {
    if (!msg || !msg.trim()) return;

    // Switch to chat view
    showChatView();

    const userTimestamp = new Date();

    // Add user message
    chatBody.innerHTML += createMessageHTML(msg, true, userTimestamp);
    chatInput.value = '';
    chatInputConversation.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Add loading indicator with "Fundy is thinking..." - accessible status
    const loadingId = `loading-${Date.now()}`;
    chatBody.innerHTML += `
      <div class="chat-message bot-message" id="${loadingId}" role="status" aria-label="Fundy is thinking">
        <div class="thinking-indicator">
          <span class="thinking-icon" aria-hidden="true">${getIcon('hub')}</span>
          <span class="thinking-text">Fundy is thinking</span>
          <span class="thinking-dots" aria-hidden="true">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    `;
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
        body: JSON.stringify({
          request: msg,
        }),
      });

      const data = await res.json();

      // Remove loading indicator
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) loadingEl.remove();

      // Extract bot text response
      const reply = data?.response_data?.text_responses?.[0]
        || 'I couldn\'t generate a response.';

      // Extract sources/references
      const sources = data?.response_data?.references || [];

      const botTimestamp = new Date();
      chatBody.innerHTML += createMessageHTML(reply, false, botTimestamp, sources);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Setup sources toggle after adding to DOM
      setupSourcesToggle();

      // Extract citation for dataLayer
      const citation = sources?.[0]?.url || sources?.[0]?.doc_id || null;

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
      chatBody.innerHTML += createMessageHTML('Sorry, something went wrong. Please try again.', false, botTimestamp);
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
