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
      <a href="${src.url || '#'}" class="source-link" target="_blank">
        ${getIcon('link')}
        <span>${src.url || src.doc_id || 'Source'}</span>
      </a>
    `).join('');

    sourcesHTML = `
      <div class="sources-container" id="${sourcesId}">
        <button class="sources-toggle" data-target="${sourcesId}">
          <span>Sources</span>
          <span class="chevron-icon">${getIcon('chevronDown')}</span>
        </button>
        <div class="sources-list collapsed">
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
  // Generate popular searches HTML
  const popularSearchesHTML = popularSearches.map((search) => `
    <button class="chatbot-search-suggestion" data-query="${search}">
      <span class="search-icon">${getIcon('search')}</span>
      <span>${search}</span>
    </button>
  `).join('');

  // Generate top pages HTML
  const topPagesHTML = topPages.map((page) => `
    <a href="#" class="chatbot-top-page-card">
      <div class="top-page-icon">${getIcon(page.icon)}</div>
      <h4>${page.title}</h4>
      <p>${page.description}</p>
    </a>
  `).join('');

  block.innerHTML = `
    <!-- Full Page Overlay -->
    <div class="chatbot-overlay hidden">
      <!-- Header -->
      <div class="chatbot-overlay-header">
        <div class="chatbot-logo">
          <img src="/icons/cppi-logo.svg" alt="CPPI Logo" onerror="this.parentElement.innerHTML='<span class=\\'logo-text\\'>CPP Investments</span>'" />
        </div>
        <button class="chatbot-close-btn">
          <span>Close</span>
          ${getIcon('close')}
        </button>
      </div>

      <div class="chatbot-divider"></div>

      <div class="chatbot-overlay-content">
        <!-- Initial Search View -->
        <div class="chatbot-search-view">
          <div class="chatbot-badge">
            <span class="badge-icon">${getIcon('hub')}</span>
            <span>Chat with Fundy</span>
          </div>
          
          <h1 class="chatbot-heading">How can we help you today?</h1>
          <p class="chatbot-subheading">Chat with Fundy, our virtual assistant to learn more about CPP Investments, ask questions, and discover more about our fund</p>
          
          <div class="chatbot-search-wrapper">
            <input 
              type="text" 
              id="chatInput" 
              class="chatbot-search-input" 
              placeholder='Ask me about things like "Investment Strategy" or "Q3 Performance"...'
            />
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
            <span class="badge-icon">${getIcon('hub')}</span>
            <span>Chat with Fundy</span>
          </div>
          
          <div class="chat-body" id="chatBody"></div>
          
          <div class="chat-input-wrapper">
            <input id="chatInputConversation" placeholder="Ask a question" />
            <button id="chatSend">${getIcon('send')}</button>
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

  // Function to open the chatbot overlay (exposed globally for header search icon)
  function openChatbot() {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  }

  // Expose openChatbot globally so header search can trigger it
  window.openChatbotOverlay = openChatbot;

  // Close overlay
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    // Reset to search view
    searchView.classList.remove('hidden');
    chatView.classList.add('hidden');
    // Clear chat
    chatBody.innerHTML = '';
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeBtn.click();
    }
  });

  // Switch to chat view
  function showChatView() {
    searchView.classList.add('hidden');
    chatView.classList.remove('hidden');
    chatInputConversation.focus();
  }

  // Toggle sources dropdown
  function setupSourcesToggle() {
    document.querySelectorAll('.sources-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = btn.closest('.sources-container');
        const sourcesList = container.querySelector('.sources-list');
        const chevron = btn.querySelector('.chevron-icon');

        sourcesList.classList.toggle('collapsed');
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

    // Add loading indicator with "Fundy is thinking..."
    const loadingId = `loading-${Date.now()}`;
    chatBody.innerHTML += `
      <div class="chat-message bot-message" id="${loadingId}">
        <div class="thinking-indicator">
          <span class="thinking-icon">${getIcon('hub')}</span>
          <span class="thinking-text">Fundy is thinking</span>
          <span class="thinking-dots">
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
