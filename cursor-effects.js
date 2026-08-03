(() => {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return;

  const aura = document.createElement("span");
  aura.className = "cursor-aura";
  aura.setAttribute("aria-hidden", "true");
  document.body.append(aura);

  let targetX = -100;
  let targetY = -100;
  let glowX = -100;
  let glowY = -100;
  let frame = 0;
  let initialized = false;

  const render = () => {
    frame = 0;
    glowX += (targetX - glowX) * .28;
    glowY += (targetY - glowY) * .28;
    aura.style.transform = `translate3d(${glowX}px,${glowY}px,0)`;
    if (Math.abs(targetX - glowX) > .12 || Math.abs(targetY - glowY) > .12) frame = requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!initialized) {
      initialized = true;
      glowX = targetX;
      glowY = targetY;
      document.documentElement.classList.add("cursor-active");
    }
    const interactive = event.target.closest?.("a,button,input,textarea,.project-card,.skill-card,.cert-item");
    document.documentElement.classList.toggle("cursor-interactive", Boolean(interactive));
    requestRender();
  }, { passive: true });
  addEventListener("pointerdown", () => document.documentElement.classList.add("cursor-pressed"), { passive: true });
  addEventListener("pointerup", () => document.documentElement.classList.remove("cursor-pressed"), { passive: true });
  document.documentElement.addEventListener("mouseleave", () => document.documentElement.classList.remove("cursor-active","cursor-interactive","cursor-pressed"));
  document.documentElement.addEventListener("mouseenter", () => {
    if (initialized) document.documentElement.classList.add("cursor-active");
  });
})();
