(() => {
  const launcher = document.createElement("button");
  launcher.className = "ai-launcher";
  launcher.setAttribute("aria-label", "Ask about Kosala");
  launcher.innerHTML = '<i class="fas fa-message"></i><span>Ask about Kosala</span>';

  const panel = document.createElement("section");
  panel.className = "ai-panel";
  panel.setAttribute("aria-label", "Portfolio assistant");
  panel.innerHTML = `
    <div class="ai-head"><div><strong>Portfolio assistant</strong><span>Ask about experience, projects or skills</span></div><button class="ai-close" aria-label="Close"><i class="fas fa-xmark"></i></button></div>
    <div class="ai-messages" aria-live="polite"><div class="ai-msg bot">Hi! Ask me anything about Kosala's projects and technical experience.</div></div>
    <form class="ai-form"><input class="ai-input" maxlength="500" placeholder="What has Kosala built?" aria-label="Your question" required><button class="ai-send" aria-label="Send"><i class="fas fa-arrow-up"></i></button></form>`;
  document.body.append(launcher, panel);

  const close = panel.querySelector(".ai-close");
  const form = panel.querySelector(".ai-form");
  const input = panel.querySelector(".ai-input");
  const send = panel.querySelector(".ai-send");
  const messages = panel.querySelector(".ai-messages");
  const toggle = (open) => {
    panel.classList.toggle("open", open);
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
    input.value = "";
    send.disabled = true;
    const waiting = addMessage("Thinking...", "bot");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      waiting.textContent = response.ok ? data.answer : (data.error || "Assistant unavailable.");
    } catch {
      waiting.textContent = "The assistant needs the secure server endpoint to be deployed first.";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
