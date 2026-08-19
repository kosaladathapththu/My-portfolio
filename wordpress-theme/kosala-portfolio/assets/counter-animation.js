(() => {
  const counters = [...document.querySelectorAll(".hero-stats .stat-number")];
  if (!counters.length) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const values = counters.map((counter) => {
    const label = counter.textContent.trim();
    const target = Number.parseInt(label, 10) || 0;
    const suffix = label.replace(/[\d.,\s-]/g, "");
    counter.setAttribute("aria-label", label);
    return { counter, target, suffix };
  });

  if (reducedMotion) return;

  values.forEach(({ counter, suffix }) => {
    counter.textContent = `0${suffix}`;
  });

  const animate = ({ counter, target, suffix }, delay) => {
    const duration = 1250;
    setTimeout(() => {
      const start = performance.now();
      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
  };

  const run = () => values.forEach((value, index) => animate(value, index * 130));
  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    run();
  }, { threshold: 0.3 });

  observer.observe(document.querySelector(".hero-stats"));
})();