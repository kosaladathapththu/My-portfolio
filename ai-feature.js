(() => {
  const STORAGE_KEY = "nova-chat-history-v1";
  const greeting = "Hi! I can answer questions about Kosala, share his public contact details, or help with general questions.";
  const launcher = document.createElement("button");
  launcher.className = "ai-launcher";
  launcher.setAttribute("aria-label", "Ask about Kosala");
  launcher.innerHTML = '<i class="fas fa-message"></i><span>Ask about Kosala</span>';

  const panel = document.createElement("section");
  panel.className = "ai-panel";
  panel.setAttribute("aria-label", "Portfolio assistant");
  panel.innerHTML = `
    <div class="ai-head"><div><strong>Nova AI assistant</strong><span>Portfolio details and general questions</span></div><div class="ai-head-actions"><button class="ai-clear" aria-label="Clear chat history" title="Clear chat history"><i class="fas fa-trash-can"></i></button><button class="ai-close" aria-label="Close"><i class="fas fa-xmark"></i></button></div></div>
    <div class="ai-messages" aria-live="polite"><div class="ai-msg bot">${greeting}</div></div>
    <form class="ai-form"><input class="ai-input" maxlength="1200" placeholder="Ask me anything..." aria-label="Your question" required><button class="ai-send" aria-label="Send"><i class="fas fa-arrow-up"></i></button></form>`;
  document.body.append(launcher, panel);

  const close = panel.querySelector(".ai-close");
  const clear = panel.querySelector(".ai-clear");
  const form = panel.querySelector(".ai-form");
  const input = panel.querySelector(".ai-input");
  const send = panel.querySelector(".ai-send");
  const messages = panel.querySelector(".ai-messages");
  let history = [];

  const saveHistory = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20))); } catch {}
  };
  const addMessage = (text, type) => {
    const message = document.createElement("div");
    message.className = `ai-msg ${type}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  };
  const remember = (role, content) => {
    if (!content) return;
    history.push({ role, content: String(content).slice(0, 1200) });
    if (history.length > 20) history.splice(0, history.length - 20);
    saveHistory();
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) history = saved.filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string").slice(-20);
  } catch {}
  history.forEach(item => addMessage(item.content, item.role === "user" ? "user" : "bot"));

  window.novaChat = { remember, addMessage, messages, getHistory: () => history.slice(-8) };
  const toggle = (open) => {
    panel.classList.toggle("open", open);
    document.body.classList.toggle("ai-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) { input.focus(); messages.scrollTop = messages.scrollHeight; }
  };
  launcher.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  close.addEventListener("click", () => toggle(false));
  clear.addEventListener("click", () => {
    history = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    messages.querySelectorAll(".ai-msg,.ai-image-card").forEach(item => item.remove());
    messages.insertAdjacentHTML("afterbegin", `<div class="ai-msg bot">${greeting}</div>`);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") toggle(false); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    const requestHistory = history.slice(-8);
    input.value = "";
    send.disabled = true;
    const waiting = addMessage("Thinking...", "bot");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: requestHistory })
      });
      const data = await response.json();
      const answer = response.ok ? data.answer : (data.error || "Assistant unavailable.");
      waiting.textContent = answer;
      if (response.ok) { remember("user", text); remember("assistant", answer); }
    } catch {
      waiting.textContent = "The assistant is temporarily unavailable. Please try again.";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();