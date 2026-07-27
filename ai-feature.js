(() => {
  const launcher = document.createElement("button");
  launcher.className = "ai-launcher";
  launcher.setAttribute("aria-label", "Ask about Kosala");
  launcher.innerHTML = '<i class="fas fa-message"></i><span>Ask about Kosala</span>';

  const panel = document.createElement("section");
  panel.className = "ai-panel";
  panel.setAttribute("aria-label", "Portfolio assistant");
  panel.innerHTML = `
    <div class="ai-head"><div><strong>Nova AI assistant</strong><span>Portfolio details and general questions</span></div><button class="ai-close" aria-label="Close"><i class="fas fa-xmark"></i></button></div>
    <div class="ai-messages" aria-live="polite"><div class="ai-msg bot">Hi! I can answer questions about Kosala, share his public contact details, or help with general questions.</div></div>
    <form class="ai-form"><input class="ai-input" maxlength="1200" placeholder="Ask me anything..." aria-label="Your question" required><button class="ai-send" aria-label="Send"><i class="fas fa-arrow-up"></i></button></form>`;
  document.body.append(launcher, panel);

  const close = panel.querySelector(".ai-close");
  const form = panel.querySelector(".ai-form");
  const input = panel.querySelector(".ai-input");
  const send = panel.querySelector(".ai-send");
  const messages = panel.querySelector(".ai-messages");
  const history = [];
  const toggle = (open) => {
    panel.classList.toggle("open", open);
    document.body.classList.toggle("ai-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  launcher.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  close.addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") toggle(false); });

  const addMessage = (text, type) => {
    const message = document.createElement("div");
    message.className = `ai-msg ${type}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  };
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
      if (response.ok) {
        history.push({ role: "user", content: text }, { role: "assistant", content: answer });
        if (history.length > 10) history.splice(0, history.length - 10);
      }
    } catch {
      waiting.textContent = "The assistant needs the secure server endpoint to be deployed first.";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
