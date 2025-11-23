export default function decorate(block) {
    const fields = block.model?.fields || {};
    const label = fields.title?.value || "Need help?";
    const apiKey = fields.apiKey?.value || "";
  
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
  
    const widget = block.querySelector(".chatbot-pill");
    const modal = block.querySelector(".chatbot-modal");
    const close = block.querySelector(".chat-close");
    const chatInput = block.querySelector("#chatInput");
    const sendBtn = block.querySelector("#chatSend");
    const chatBody = block.querySelector("#chatBody");
  
    widget.addEventListener("click", () => {
      modal.classList.remove("hidden");
      widget.classList.add("hidden");
    });
  
    close.addEventListener("click", () => {
      modal.classList.add("hidden");
      widget.classList.remove("hidden");
    });
  
    async function sendMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;
  
      chatBody.innerHTML += `<div class="msg user">${msg}</div>`;
      chatInput.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;
  
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: msg }]
        })
      });
  
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Error";
  
      chatBody.innerHTML += `<div class="msg bot">${reply}</div>`;
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
  