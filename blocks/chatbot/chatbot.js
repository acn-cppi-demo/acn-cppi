export default function decorate(block) {
  const fields = block.model?.fields || {};
  const label = fields.title?.value || 'Need help?';

  block.innerHTML = `
      <!-- Floating Widget Button -->
      <div class="chatbot-pill">
        <span>${label}</span>
        <img class="pill-icon" src="https://img.icons8.com/?size=100&id=59820&format=png&color=0D6EFD" />
      </div>
  
      <!-- Popup Modal -->
      <div class="chatbot-modal hidden">
        <div class="chat-header">
          <span>AI Assistant</span>
          <button class="chat-close">✕</button>
        </div>
  
        <div class="chat-body" id="chatBody"></div>
  
        <div class="chat-input-wrapper">
          <input id="chatInput" placeholder="Ask something…" />
          <button id="chatSend">Send</button>
        </div>
      </div>
    `;

  const widget = block.querySelector('.chatbot-pill');
  const modal = block.querySelector('.chatbot-modal');
  const close = block.querySelector('.chat-close');
  const chatInput = block.querySelector('#chatInput');
  const sendBtn = block.querySelector('#chatSend');
  const chatBody = block.querySelector('#chatBody');

  widget.addEventListener('click', () => {
    modal.classList.remove('hidden');
    widget.classList.add('hidden');
  });

  close.addEventListener('click', () => {
    modal.classList.add('hidden');
    widget.classList.remove('hidden');
  });

  async function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    // UI update
    chatBody.innerHTML += `<div class="msg user">${msg}</div>`;
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 🔥 Fire dataLayer event: user message
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

      // Extract bot text response
      const reply = data?.response_data?.text_responses?.[0]
        || 'I couldn’t generate a response.';

      chatBody.innerHTML += `<div class="msg bot">${reply}</div>`;
      chatBody.scrollTop = chatBody.scrollHeight;

      // 🔥 Extract citation for dataLayer
      const citation = data?.response_data?.references?.[0]?.url
        || data?.response_data?.references?.[0]?.doc_id
        || null;

      // 🔥 Fire dataLayer event: bot response citation
      if (citation) {
        window.dataLayer.push({
          event: 'message_response',
          citation,
        });
      }
    } catch (e) {
      chatBody.innerHTML += '<div class="msg bot">Sorry, something went wrong.</div>';
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
