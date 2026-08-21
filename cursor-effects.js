(() => {
  if (innerWidth <= 900) return;

  const canvas = document.createElement("canvas");
  const aura = document.createElement("span");
  canvas.className = "cursor-canvas";
  aura.className = "cursor-aura";
  canvas.setAttribute("aria-hidden", "true");
  aura.setAttribute("aria-hidden", "true");
  document.body.append(canvas, aura);

  const context = canvas.getContext("2d", { alpha: true });
  const points = [];
  let pixelRatio = 1;
  let frame = 0;
  let lastX = -100;
  let lastY = -100;

  const resize = () => {
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * pixelRatio);
    canvas.height = Math.round(innerHeight * pixelRatio);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };
  const draw = () => {
    frame = 0;
    context.clearRect(0, 0, innerWidth, innerHeight);
    for (let index = points.length - 1; index >= 0; index -= 1) {
      const point = points[index];
      point.life -= 0.055;
      point.y += 0.16;
      if (point.life <= 0) {
        points.splice(index, 1);
        continue;
      }
      const radius = 1.8 + point.life * 3.8;
      const gradient = context.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius * 2.2,
      );
      gradient.addColorStop(
        0,
        `rgba(${point.green ? "190,226,180" : "255,169,99"},${point.life * 0.92})`,
      );
      gradient.addColorStop(
        0.45,
        `rgba(${point.green ? "151,190,143" : "235,121,64"},${point.life * 0.42})`,
      );
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(point.x, point.y, radius * 2.2, 0, Math.PI * 2);
      context.fill();
    }
    if (points.length) frame = requestAnimationFrame(draw);
  };
  const requestDraw = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  addEventListener(
    "mousemove",
    (event) => {
      const x = event.clientX;
      const y = event.clientY;
      aura.style.transform = `translate3d(${x}px,${y}px,0)`;
      document.documentElement.classList.add("cursor-active");
      const interactive = event.target.closest?.(
        "a,button,input,textarea,.project-card,.skill-card,.cert-item",
      );
      document.documentElement.classList.toggle(
        "cursor-interactive",
        Boolean(interactive),
      );
      if (Math.hypot(x - lastX, y - lastY) >= 5) {
        points.push({ x, y, life: 1, green: Boolean(interactive) });
        if (points.length > 24) points.shift();
        lastX = x;
        lastY = y;
        requestDraw();
      }
    },
    { passive: true },
  );
  addEventListener(
    "mousedown",
    () => document.documentElement.classList.add("cursor-pressed"),
    { passive: true },
  );
  addEventListener(
    "mouseup",
    () => document.documentElement.classList.remove("cursor-pressed"),
    { passive: true },
  );
  document.documentElement.addEventListener("mouseleave", () =>
    document.documentElement.classList.remove(
      "cursor-active",
      "cursor-interactive",
      "cursor-pressed",
    ),
  );
  addEventListener("resize", resize, { passive: true });
  resize();
})();
