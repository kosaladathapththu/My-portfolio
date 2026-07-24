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
    .ai-bot{width:42px;height:42px;position:relative;display:grid;place-items:center;flex:0 0 auto;margin:-7px 1px -7px -8px}
    .ai-bot::before{content:"";position:absolute;inset:3px;border-radius:50%;background:rgba(255,255,255,.35);filter:blur(5px);animation:botGlow 2.4s ease-in-out infinite}
    .ai-bot__image{position:relative;width:42px;height:42px;object-fit:contain;display:block;filter:drop-shadow(0 5px 7px rgba(17,23,34,.2));transform-origin:50% 70%;animation:botFloat 2.8s ease-in-out infinite}
    .ai-launcher:hover .ai-bot__image{animation:botHello .75s ease-in-out}
    .ai-launcher.is-thinking .ai-bot__image{animation:botThink .7s ease-in-out infinite alternate}
    @keyframes botSignal{0%{opacity:.7;transform:scale(.92)}70%,100%{opacity:0;transform:scale(1.16)}}
    @keyframes botGlow{0%,100%{opacity:.35;transform:scale(.85)}50%{opacity:.8;transform:scale(1.12)}}
    @keyframes botFloat{0%,100%{transform:translateY(1px) rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}
    @keyframes botHello{0%,100%{transform:rotate(0)}30%{transform:rotate(-10deg) scale(1.08)}65%{transform:rotate(8deg) scale(1.08)}}
    @keyframes botThink{to{transform:translateY(-3px) rotate(5deg) scale(1.06)}}
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
    .ai-launcher{background:transparent!important;color:var(--text)!important;box-shadow:none!important;padding:8px 6px!important;gap:10px!important;min-height:82px!important;border-radius:24px!important;align-items:center!important}
    .ai-launcher:hover{transform:translateY(-4px)!important;box-shadow:none!important}
    .ai-launcher::before{inset:4px auto 4px 0!important;width:78px;border-radius:50%!important;border-color:rgba(77,124,255,.48)!important}
    .ai-bot{width:76px!important;height:76px!important;margin:0!important;z-index:3}
    .ai-bot::before{inset:7px!important;background:radial-gradient(circle,rgba(77,124,255,.32),transparent 70%)!important;filter:blur(8px)!important}
    .ai-bot__image{width:76px!important;height:76px!important;filter:drop-shadow(0 12px 15px rgba(0,0,0,.35))!important}
    .ai-cloud{position:relative;z-index:2;display:flex;align-items:center;min-height:54px;padding:10px 20px 10px 22px;background:#fff;color:#111722;border-radius:30px 34px 29px 32px;font-size:.84rem;font-weight:800;line-height:1.25;white-space:nowrap;box-shadow:0 14px 34px rgba(0,0,0,.3);animation:cloudBreathe 3s ease-in-out infinite}
    .ai-cloud::before{content:"";position:absolute;width:17px;height:17px;left:-8px;bottom:8px;background:#fff;border-radius:50%;box-shadow:-8px 7px 0 -3px #fff}
    .ai-cloud::after{content:"";position:absolute;inset:-5px 18px auto 24px;height:22px;background:#fff;border-radius:50%;z-index:-1}
    .ai-launcher:hover .ai-cloud{background:#ffb84d;animation:cloudHello .65s ease}
    .ai-launcher:hover .ai-cloud::before,.ai-launcher:hover .ai-cloud::after{background:#ffb84d;box-shadow:-8px 7px 0 -3px #ffb84d}
    @keyframes cloudBreathe{0%,100%{transform:translateY(1px) scale(1)}50%{transform:translateY(-2px) scale(1.018)}}
    @keyframes cloudHello{50%{transform:translateY(-5px) scale(1.035)}}
    @media(max-width:560px){.ai-launcher .ai-bot{display:grid!important}.ai-launcher .ai-cloud{display:flex!important}.ai-bot{width:64px!important;height:64px!important}.ai-bot__image{width:64px!important;height:64px!important}.ai-cloud{font-size:.76rem;padding:9px 15px;white-space:normal;max-width:155px}.ai-launcher{min-height:70px!important}}
    section.ai-panel{padding:0!important;width:min(430px,calc(100vw - 28px))!important;height:min(610px,calc(100vh - 118px))!important;grid-template-rows:auto minmax(0,1fr) auto!important;background:linear-gradient(160deg,#111a2a,#0a101b)!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:26px!important;box-shadow:0 30px 100px rgba(0,0,0,.58)!important}
    .ai-head{min-height:84px;padding:14px 16px 14px 78px!important;position:relative;background:rgba(255,255,255,.035);border-bottom:1px solid rgba(255,255,255,.09)!important}
    .ai-head::before{content:"";position:absolute;left:15px;top:10px;width:56px;height:56px;background:url("image.png") center/contain no-repeat;filter:drop-shadow(0 7px 10px rgba(0,0,0,.35));animation:botFloat 2.8s ease-in-out infinite}
    .ai-head strong{font-size:1rem!important;color:#fff}.ai-head span{color:#98a9c0!important;font-size:.74rem!important;margin-top:3px}.ai-close{width:38px!important;height:38px!important;border-radius:12px!important;background:rgba(255,255,255,.07)!important;color:#fff!important;transition:.2s}.ai-close:hover{background:#ffb84d!important;color:#111722!important;transform:rotate(6deg)}
    .ai-messages{min-height:0!important;padding:18px!important;gap:12px!important;overflow-y:auto!important;overscroll-behavior:contain;background:radial-gradient(circle at 100% 0,rgba(77,124,255,.08),transparent 45%),#0a101b!important;scrollbar-width:thin;scrollbar-color:#36445b transparent}
    .ai-msg{max-width:84%!important;padding:11px 14px!important;border-radius:16px!important;font-size:.86rem!important;line-height:1.55!important;box-shadow:0 6px 18px rgba(0,0,0,.13)}
    .ai-msg.bot{background:#182337!important;border:1px solid rgba(255,255,255,.09)!important;color:#edf3fb!important;border-bottom-left-radius:5px!important}.ai-msg.user{background:linear-gradient(135deg,#4d7cff,#315de2)!important;color:#fff!important;border-bottom-right-radius:5px!important}
    .ai-suggestions{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}.ai-suggestion{border:1px solid rgba(255,184,77,.25);background:rgba(255,184,77,.08);color:#ffd28d;border-radius:999px;padding:7px 10px;font:700 .7rem Manrope,sans-serif;cursor:pointer;transition:.2s}.ai-suggestion:hover{background:#ffb84d;color:#111722;transform:translateY(-2px)}
    .ai-form{padding:13px!important;gap:9px!important;background:#0f1726;border-top:1px solid rgba(255,255,255,.09)!important}.ai-input{min-width:0;height:48px;padding:0 14px!important;background:#182337!important;border:1px solid rgba(255,255,255,.1)!important;color:#fff!important;border-radius:14px!important}.ai-input::placeholder{color:#738198}.ai-input:focus{border-color:#4d7cff!important;box-shadow:0 0 0 3px rgba(77,124,255,.13)}.ai-send{width:48px!important;height:48px;border-radius:14px!important;background:#ffb84d!important;color:#111722!important;transition:.2s}.ai-send:hover{transform:translateY(-2px);background:#ffc86e!important}
    @media(max-width:560px){section.ai-panel{right:8px!important;bottom:84px!important;width:calc(100vw - 16px)!important;height:min(620px,calc(100vh - 105px))!important;border-radius:22px!important}.ai-head{min-height:76px;padding-left:68px!important}.ai-head::before{width:48px;height:48px}.ai-messages{padding:14px!important}.ai-msg{max-width:90%!important}.ai-suggestion{font-size:.67rem}}
    .experience-card{display:grid;grid-template-columns:190px 1fr;gap:28px;padding:28px;background:linear-gradient(145deg,rgba(21,30,47,.96),rgba(12,19,32,.96));border:1px solid rgba(255,255,255,.11);border-radius:24px;box-shadow:0 24px 70px rgba(0,0,0,.2);transition:.35s ease}
    .experience-card:hover{transform:translateY(-7px);border-color:rgba(255,184,77,.42);box-shadow:0 30px 80px rgba(0,0,0,.32)}.experience-logo{display:grid;place-items:center;min-height:180px;padding:24px;background:#fff;border-radius:18px}.experience-logo img{width:100%;max-width:150px;height:auto;object-fit:contain}.experience-content{min-width:0}.experience-top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}.experience-type{display:inline-block;margin-bottom:9px;color:#ffb84d;font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.experience-content h3{margin:0;color:#fff;font-size:1.55rem}.experience-company{margin-top:7px;color:#a9b6c8;font-weight:700}.experience-date{flex:0 0 auto;padding:8px 11px;border:1px solid rgba(77,124,255,.3);border-radius:999px;background:rgba(77,124,255,.09);color:#9db3ff;font-size:.76rem;font-weight:800}.experience-content ul{margin:22px 0;color:#aab6c8;list-style:none}.experience-content li{position:relative;margin:10px 0;padding-left:20px;line-height:1.65}.experience-content li::before{content:"";position:absolute;left:0;top:.68em;width:7px;height:7px;border-radius:50%;background:#ffb84d}.experience-tags{display:flex;flex-wrap:wrap;gap:8px}.experience-tags span{padding:7px 10px;border-radius:8px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#c8d2df;font-size:.72rem;font-weight:700}
    @media(max-width:760px){.experience-card{grid-template-columns:1fr;padding:18px}.experience-logo{min-height:120px}.experience-logo img{max-width:130px}.experience-top{flex-direction:column;gap:12px}.experience-date{align-self:flex-start}}
    @media(prefers-reduced-motion:reduce){.motion-aurora::before,.motion-aurora::after,.ai-launcher::before,.ai-bot::before,.ai-bot__image,.nav-container,.hero-content>*,.profile-card{animation:none!important}.motion-item{opacity:1;transform:none;transition:none}}
  `;
  document.head.appendChild(style);

  const aurora = document.createElement("div");
  aurora.className = "motion-aurora";
  document.body.prepend(aurora);

  const launcher = document.querySelector(".ai-launcher");
  if (launcher) {
    launcher.innerHTML = `
      <span class="ai-bot" aria-hidden="true">
        <img class="ai-bot__image" src="image.png" alt="">
      </span>
      <span class="ai-cloud">Ask anything from Kosala</span>`;
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

  const suggestions = document.createElement("div");
  suggestions.className = "ai-suggestions";
  ["Best projects?", "Technical skills?", "Why hire Kosala?"].forEach((label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ai-suggestion";
    button.textContent = label;
    button.addEventListener("click", () => {
      const input = document.querySelector(".ai-input");
      const form = document.querySelector(".ai-form");
      if (input && form) { input.value = label; form.requestSubmit(); }
    });
    suggestions.appendChild(button);
  });
  document.querySelector(".ai-messages")?.appendChild(suggestions);
  if (reduced || !("IntersectionObserver" in window)) return;
  const targets = document.querySelectorAll(".section-header, .highlight-card, .skill-card, .project-card, .education-item, .cert-item, .form-card, .experience-card");
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
