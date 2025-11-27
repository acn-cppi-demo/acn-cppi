export default function decorate(block) {
  const fields = block.model?.fields || {};
  const label = fields.title?.value || 'Need help?';

  block.innerHTML = `
  <!-- Floating Widget Button -->
  <div class="chatbot-pill">
    <span>${label}</span>
    <div class="pill-icon-wrapper">
      <img class="pill-icon" src="https://img.icons8.com/?size=100&id=59820&format=png&color=FFFFFF" />
    </div>
  </div>

  <!-- Popup Modal -->
  <div class="chatbot-modal hidden">
    <div class="chat-header">
      <div class="chat-title-left">
        <img class="fundy-icon" 
             src="https://img.icons8.com/?size=100&id=59820&format=png&color=FFFFFF" />
        <div class="chat-title-group">
          <div class="chat-title">Fundy</div>
          <div class="chat-subtitle">CPP Investments FAQ</div>
        </div>
      </div>
      <button class="chat-close">✕</button>
    </div>

    <div class="chat-body" id="chatBody"></div>

    <div class="chat-input-wrapper">
      <input id="chatInput" placeholder="Type a question..." />
 <button id="chatSend" class="send-btn">
  <img src="/icons/send_icon.svg" class="send-icon" />
</button>
    </div>
  </div>
`;

  const widget = block.querySelector('.chatbot-pill');
  const modal = block.querySelector('.chatbot-modal');
  const close = block.querySelector('.chat-close');
  const chatInput = block.querySelector('#chatInput');
  const sendBtn = block.querySelector('#chatSend');
  const chatBody = block.querySelector('#chatBody');

  let welcomeShown = false;

  widget.addEventListener('click', () => {
    modal.classList.remove('hidden');
    widget.classList.add('hidden');

    if (!welcomeShown) {
      function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      const welcomeMessage = `
    <div class="msg bot welcome-msg">
      <div>
        <strong>Hi there, I’m Fundy!</strong><br/>
        Your CPP Investments assistant.<br/>
        You can ask me about the fund, performance, or our investments!
      </div>
      <div class="msg-time">${formatTime()}</div>
    </div>
<div class="suggestion-label">
    You can try asking me about:
  </div>
    <div class="suggestions">
      <div class="suggestion-btn" data-msg="How we invest">How we invest</div>
      <div class="suggestion-btn" data-msg="Fund performance">Fund performance</div>
      <div class="suggestion-btn" data-msg="Where we invest">Where we invest</div>
    </div>
  `;

      chatBody.innerHTML += welcomeMessage;
      welcomeShown = true;
    }
  });

  close.addEventListener('click', () => {
    modal.classList.add('hidden');
    widget.classList.remove('hidden');
  });

  async function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    chatBody.innerHTML += `<div class="msg user">${msg}</div>`;
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

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
        body: JSON.stringify({ request: msg }),
      });

      const data = await res.json();

      const reply = data?.response_data?.text_responses?.[0]
        || 'I couldn’t generate a response.';

      chatBody.innerHTML += `<div class="msg bot">${reply}</div>`;
      chatBody.scrollTop = chatBody.scrollHeight;

      const citation = data?.response_data?.references?.[0]?.url
        || data?.response_data?.references?.[0]?.doc_id
        || null;

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
  chatBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
      const text = e.target.dataset.msg;
      chatInput.value = text;
      sendMessage();
    }
  });
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
