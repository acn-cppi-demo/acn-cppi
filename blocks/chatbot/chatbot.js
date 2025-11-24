export default function decorate(block) {
  const fields = block.model?.fields || {};
  const label = fields.title?.value || 'Need help?';
  const apiKey = fields.apiKey?.value || '';

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

    // Show user message
    chatBody.innerHTML += `<div class="msg user">${msg}</div>`;
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      // Call CPPI orchestrator API (NOT OpenAI)
      const response = await fetch("https://cppi-demo.accenture.com/es/api/v1/agent/orchestrator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: msg
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.response?.answer || "I couldn't generate a response.";

      chatBody.innerHTML += `<div class="msg bot">${reply}</div>`;
      chatBody.scrollTop = chatBody.scrollHeight;

    } catch (error) {
      console.error("Chatbot error:", error);
      chatBody.innerHTML += `<div class="msg bot error">Sorry, something went wrong.</div>`;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
