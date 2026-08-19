(() => {
  const counter = document.getElementById("profileViewCount");
  if (!counter) return;

  const storageKey = "kosalaPortfolioVisitorId";
  let visitorId = localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId = crypto.randomUUID().replaceAll("-", "");
    localStorage.setItem(storageKey, visitorId);
  }

  fetch("/api/views", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ visitorId }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Counter unavailable");
      return response.json();
    })
    .then(({ views }) => {
      const target = Number(views);
      if (!Number.isFinite(target)) return;
      const duration = 900;
      const started = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    })
    .catch(() => {
      counter.textContent = "—";
      counter.closest(".stat")?.classList.add("stat-unavailable");
    });
})();
