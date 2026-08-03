(() => {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return;

  const aura = document.createElement("span");
  aura.className = "cursor-aura";
  aura.setAttribute("aria-hidden", "true");
  const sparks = Array.from({ length: 8 }, () => {
    const spark = document.createElement("span");
    spark.className = "cursor-spark";
    spark.setAttribute("aria-hidden", "true");
    return spark;
  });
  document.body.append(aura, ...sparks);

  let targetX = -100;
  let targetY = -100;
  let glowX = -100;
  let glowY = -100;
  let frame = 0;
  let initialized = false;
  let sparkIndex = 0;
  let lastSparkAt = 0;
  let lastSparkX = -100;
  let lastSparkY = -100;

  const render = () => {
    frame = 0;
    glowX += (targetX - glowX) * .35;
    glowY += (targetY - glowY) * .35;
    aura.style.transform = `translate3d(${glowX}px,${glowY}px,0)`;
    if (Math.abs(targetX - glowX) > .1 || Math.abs(targetY - glowY) > .1) frame = requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const emitSpark = (x, y, now) => {
    const distance = Math.hypot(x - lastSparkX, y - lastSparkY);
    if (now - lastSparkAt < 34 || distance < 8) return;
    lastSparkAt = now;
    lastSparkX = x;
    lastSparkY = y;
    const spark = sparks[sparkIndex++ % sparks.length];
    spark.getAnimations().forEach((animation) => animation.cancel());
    spark.animate([
      { opacity: .78, transform: `translate3d(${x}px,${y}px,0) scale(1)` },
      { opacity: 0, transform: `translate3d(${x}px,${y + 7}px,0) scale(.2)` }
    ], { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
  };

  addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!initialized) {
      initialized = true;
      glowX = targetX;
      glowY = targetY;
      lastSparkX = targetX;
      lastSparkY = targetY;
      document.documentElement.classList.add("cursor-active");
    }
    const interactive = event.target.closest?.("a,button,input,textarea,.project-card,.skill-card,.cert-item");
    document.documentElement.classList.toggle("cursor-interactive", Boolean(interactive));
    emitSpark(targetX, targetY, event.timeStamp);
    requestRender();
  }, { passive: true });
  addEventListener("pointerdown", () => document.documentElement.classList.add("cursor-pressed"), { passive: true });
  addEventListener("pointerup", () => document.documentElement.classList.remove("cursor-pressed"), { passive: true });
  document.documentElement.addEventListener("mouseleave", () => document.documentElement.classList.remove("cursor-active","cursor-interactive","cursor-pressed"));
  document.documentElement.addEventListener("mouseenter", () => {
    if (initialized) document.documentElement.classList.add("cursor-active");
  });
})();
