(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      document.body.style.setProperty("--mx", `${event.clientX}px`);
      document.body.style.setProperty("--my", `${event.clientY}px`);
    }, { passive: true });
  }
  const targets = document.querySelectorAll(".section-header, .highlight-card, .skill-card, .project-card, .education-item, .cert-item, .form-card");
  if ("IntersectionObserver" in window && !reduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    targets.forEach((element) => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
  }
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".btn, .social-link").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });
  }
})();