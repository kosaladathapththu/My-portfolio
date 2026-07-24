(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style = document.createElement("style");
  style.textContent = `
    .motion-aurora{position:fixed;inset:0;z-index:-4;pointer-events:none;overflow:hidden}
    .motion-aurora::before,.motion-aurora::after{content:"";position:absolute;width:34rem;height:34rem;border-radius:50%;filter:blur(100px);opacity:.1;animation:auroraDrift 16s ease-in-out infinite alternate}
    .motion-aurora::before{background:#4d7cff;right:-10rem;top:8%}
    .motion-aurora::after{background:#ffb84d;left:-14rem;bottom:0;animation-delay:-7s}
    @keyframes auroraDrift{to{transform:translate3d(-5rem,4rem,0) scale(1.14)}}

    .ai-launcher{overflow:visible!important;isolation:isolate}
    .ai-launcher::before{content:"";position:absolute;inset:-7px;border:1px solid rgba(255,184,77,.5);border-radius:19px;opacity:0;animation:botSignal 3s ease-out infinite;pointer-events:none}
    .ai-bot{width:31px;height:31px;position:relative;display:grid;place-items:center;flex:0 0 auto}
    .ai-bot__antenna{position:absolute;width:2px;height:7px;background:#111722;top:0;left:50%;transform-origin:bottom;animation:antennaWave 2.6s ease-in-out infinite}
    .ai-bot__antenna::before{content:"";position:absolute;width:5px;height:5px;border-radius:50%;background:#111722;left:-1.5px;top:-3px;box-shadow:0 0 0 3px rgba(17,23,34,.12)}
    .ai-bot__head{position:absolute;left:3px;right:3px;bottom:2px;height:21px;border:2px solid #111722;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:5px;background:rgba(255,255,255,.22)}
    .ai-bot__eye{width:4px;height:6px;border-radius:4px;background:#111722;animation:botBlink 4s infinite}
    .ai-bot__mouth{position:absolute;width:8px;height:2px;background:#111722;border-radius:4px;bottom:3px;opacity:.7}
    .ai-launcher:hover .ai-bot__head{animation:botNod .65s ease}
    .ai-launcher.is-thinking .ai-bot__head{animation:botThink .8s ease-in-out infinite alternate}
    .ai-launcher.is-thinking .ai-bot__eye{animation:botScan .75s ease-in-out infinite alternate}
    @keyframes botSignal{0%{opacity:.7;transform:scale(.92)}70%,100%{opacity:0;transform:scale(1.16)}}
    @keyframes antennaWave{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(9deg)}}
    @keyframes botBlink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.08)}}
    @keyframes botNod{50%{transform:translateY(2px) rotate(3deg)}}
    @keyframes botThink{to{transform:translateY(-2px)}}
    @keyframes botScan{to{transform:translateX(2px)}}

    .motion-item{opacity:0;transform:translateY(34px);transition:opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1);transition-delay:var(--motion-delay,0ms)}
    .motion-item.motion-in{opacity:1;transform:none}
    .section-header.motion-item{transform:translateY(24px)}
    .project-card.motion-item,.skill-card.motion-item,.highlight-card.motion-item,.cert-item.motion-item{will-change:transform}
    .project-card.motion-in:hover,.skill-card.motion-in:hover,.highlight-card.motion-in:hover,.cert-item.motion-in:hover{transform:translateY(-8px) perspective(900px) rotateX(var(--tilt-y,0deg)) rotateY(var(--tilt-x,0deg))!important}
    .nav-container{animation:navArrival .7s cubic-bezier(.2,.7,.2,1) both}
    @keyframes navArrival{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
    .hero-content>*{animation:heroChild .75s cubic-bezier(.2,.7,.2,1) both}
    .hero-content>*:nth-child(2){animation-delay:.08s}.hero-content>*:nth-child(3){animation-delay:.16s}.hero-content>*:nth-child(4){animation-delay:.24s}.hero-content>*:nth-child(5){animation-delay:.32s}
    @keyframes heroChild{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    .profile-card{animation:profileArrival .9s .18s cubic-bezier(.2,.7,.2,1) both}
    @keyframes profileArrival{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:none}}
    @media(prefers-reduced-motion:reduce){.motion-aurora::before,.motion-aurora::after,.ai-launcher::before,.ai-bot__antenna,.ai-bot__eye,.nav-container,.hero-content>*,.profile-card{animation:none!important}.motion-item{opacity:1;transform:none;transition:none}}
  `;
  document.head.appendChild(style);

  const aurora = document.createElement("div");
  aurora.className = "motion-aurora";
  document.body.prepend(aurora);

  const launcher = document.querySelector(".ai-launcher");
  if (launcher) {
    launcher.innerHTML = `
      <span class="ai-bot" aria-hidden="true">
        <span class="ai-bot__antenna"></span>
        <span class="ai-bot__head">
          <span class="ai-bot__eye"></span><span class="ai-bot__eye"></span>
          <span class="ai-bot__mouth"></span>
        </span>
      </span>
      <span>Ask Kosala AI</span>`;
    const form = document.querySelector(".ai-form");
    form?.addEventListener("submit", () => launcher.classList.add("is-thinking"));
    const messages = document.querySelector(".ai-messages");
    if (messages) {
      new MutationObserver(() => {
        const last = messages.lastElementChild;
        if (last && last.textContent !== "Thinking...") launcher.classList.remove("is-thinking");
      }).observe(messages, { childList: true, subtree: true, characterData: true });
    }
  }

  if (reduced || !("IntersectionObserver" in window)) return;
  const targets = document.querySelectorAll(".section-header, .highlight-card, .skill-card, .project-card, .education-item, .cert-item, .form-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
  targets.forEach((element, index) => {
    element.classList.add("motion-item");
    element.style.setProperty("--motion-delay", `${(index % 3) * 70}ms`);
    observer.observe(element);
  });

  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".project-card, .skill-card, .highlight-card, .cert-item").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--tilt-x", `${((event.clientX - rect.left) / rect.width - .5) * 2.2}deg`);
        card.style.setProperty("--tilt-y", `${-((event.clientY - rect.top) / rect.height - .5) * 2.2}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }
})();
