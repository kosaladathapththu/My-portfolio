(() => {
  document.body.classList.add("showcase-ready");
  const ambient = document.createElement("div");
  ambient.className = "showcase-ambient";
  ambient.setAttribute("aria-hidden", "true");
  const grid = document.createElement("div");
  grid.className = "showcase-grid";
  grid.setAttribute("aria-hidden", "true");
  const progress = document.createElement("div");
  progress.className = "showcase-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress, grid, ambient);

  const tech = ["Full-Stack", "Spring Boot", "React", "Java", "Microservices", "Oracle", "MySQL", "Android", "IoT", "REST APIs", "Arduino", "Cloud"];
  const ribbon = document.createElement("div");
  ribbon.className = "showcase-ribbon";
  ribbon.setAttribute("aria-label", "Technology experience");
  const track = document.createElement("div");
  track.className = "showcase-ribbon-track";
  [...tech, ...tech].forEach((name, index) => {
    const item = document.createElement("span");
    item.textContent = name;
    item.style.setProperty("--dot", ["#2ee7df", "#5577ff", "#9b6cff", "#ffc857", "#ff6f61"][index % 5]);
    track.append(item);
  });
  ribbon.append(track);
  document.querySelector(".hero")?.insertAdjacentElement("afterend", ribbon);

  document.querySelectorAll("section:not(.hero) .section-container").forEach((section, index) => {
    section.dataset.showcaseIndex = String(index + 1).padStart(2, "0");
  });

  const revealItems = document.querySelectorAll(".section-header,.highlight-card,.skill-card,.project-card,.experience-card,.education-item,.cert-item,.game-shell,.memory-shell,.form-card");
  revealItems.forEach((item, index) => {
    item.classList.add("showcase-reveal");
    item.style.setProperty("--sc-delay", `${(index % 4) * 65}ms`);
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-shown"); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: "0px 0px -35px" });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("is-shown"));

  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--sc-progress", `${total > 0 ? Math.min(100, scrollY / total * 100) : 0}%`);
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".highlight-card,.skill-card,.project-card,.cert-item").forEach(card => card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--sc-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--sc-y", `${event.clientY - rect.top}px`);
    }));
  }
})();