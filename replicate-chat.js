(() => {
  const form = document.querySelector(".ai-form");
  const input = document.querySelector(".ai-input");
  const messages = document.querySelector(".ai-messages");
  const send = document.querySelector(".ai-send");
  if (!form || !input || !messages || !send) return;

  const addMessage = (text, type) => {
    const message = document.createElement("div");
    message.className = `ai-msg ${type}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  };
  const showImage = (url) => {
    const card = document.createElement("article");
    card.className = "ai-image-card";
    card.innerHTML = `
      <div class="ai-image-frame"><img src="${url}" alt="AI-generated technology wallpaper" loading="eager" referrerpolicy="no-referrer"></div>
      <div class="ai-image-actions">
        <div><strong>Wallpaper ready</strong><span>Generated with Replicate</span></div>
        <a href="${url}" target="_blank" rel="noopener" aria-label="Open generated wallpaper"><i class="fas fa-arrow-up-right-from-square"></i></a>
      </div>`;
    messages.appendChild(card);
    messages.scrollTop = messages.scrollHeight;
  };

  form.addEventListener(
    "submit",
    async (event) => {
      const text = input.value.trim();
      if (
        !/(generate|create|make).*(wallpaper|image|picture)|wallpaper/i.test(
          text,
        )
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!text) return;
      addMessage(text, "user");
      window.novaChat?.remember("user", text);
      input.value = "";
      send.disabled = true;
      const waiting = addMessage(
        "Creating your wallpaper with Replicate...",
        "bot",
      );
      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ style: "futuristic" }),
        });
        const data = await response.json();
        const statusText = response.ok
          ? "Done - here is your generated wallpaper."
          : data.error || "Image generation failed.";
        waiting.textContent = statusText;
        if (response.ok) window.novaChat?.remember("assistant", statusText);
        if (response.ok && data.image) showImage(data.image);
      } catch {
        waiting.textContent = "The image generator is temporarily unavailable.";
      } finally {
        send.disabled = false;
        input.focus();
      }
    },
    true,
  );

  const suggestions = document.querySelector(".ai-suggestions");
  if (suggestions && !suggestions.querySelector("[data-image-prompt]")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ai-suggestion";
    button.dataset.imagePrompt = "true";
    button.innerHTML =
      '<i class="fas fa-wand-magic-sparkles"></i> Generate wallpaper';
    button.addEventListener("click", () => {
      input.value = "Generate a futuristic wallpaper";
      form.requestSubmit();
    });
    suggestions.appendChild(button);
  }
})();
