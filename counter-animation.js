(() => {
  const counters = [...document.querySelectorAll(".hero-stats .stat-number")];
  const stats = document.querySelector(".hero-stats");
  if (!counters.length || !stats) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const values = counters.map((counter) => {
    const original = counter.textContent.trim();
    const target = Number.parseInt(original, 10) || 0;
    const suffix = original.replace(/[\d.,\s-]/g, "");
    counter.setAttribute("aria-label", original);
    counter.dataset.target = String(target);
    return { counter, target, suffix };
  });

  if (reducedMotion) return;
  let hasRun = false;

  const count = ({ counter, target, suffix }, delay) => {
    counter.textContent = `0${suffix}`;
    setTimeout(() => {
      const started = performance.now();
      counter.classList.add("is-counting");
      const update = (now) => {
        const progress = Math.min((now - started) / 1800, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
        else counter.classList.remove("is-counting");
      };
      requestAnimationFrame(update);
    }, delay);
  };

  const run = () => {
    if (hasRun) return;
    hasRun = true;
    values.forEach((value, index) => count(value, index * 220));
  };

  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    },
    { threshold: 0.45 },
  );
  observer.observe(stats);
})();
