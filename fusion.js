(() => {
  const mesh = document.createElement("div");
  mesh.className = "fx-mesh";
  document.body.prepend(mesh);

  const progress = document.createElement("div");
  progress.className = "fx-progress";
  document.body.prepend(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--fx-scroll", `${max > 0 ? scrollY / max * 100 : 0}%`);
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const technologies = ["React", "Spring Boot", "Node-RED", "ThingsBoard", "Java", "Oracle", "Firebase", "IoT", "Flask", "Microservices", "PL/SQL", "REST APIs"];
  const ribbon = document.createElement("div");
  ribbon.className = "fx-ribbon";
  const track = document.createElement("div");
  track.className = "fx-ribbon-track";
  [...technologies, ...technologies].forEach((name) => {
    const item = document.createElement("span");
    item.className = "fx-ribbon-item";
    item.textContent = name;
    track.appendChild(item);
  });
  ribbon.appendChild(track);
  document.querySelector(".hero")?.insertAdjacentElement("afterend", ribbon);

  document.querySelectorAll("section:not(.hero) .section-container").forEach((container, index) => {
    container.dataset.fxIndex = String(index + 1).padStart(2, "0");
  });

  if (matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".highlight-card,.skill-card,.project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  }
})();
