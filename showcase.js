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

  const codefield = document.createElement("div");
  codefield.className = "showcase-codefield";
  codefield.setAttribute("aria-hidden", "true");
  const codeWords = [
    ["React", "7%", "24%", "-7deg", "9vw", "-5vh", "9s", "-3s"],
    ["JAVA", "68%", "17%", "5deg", "-8vw", "8vh", "11s", "-6s"],
    ["SQL", "28%", "48%", "-3deg", "12vw", "5vh", "12s", "-7s"],
    ["API", "73%", "57%", "7deg", "-10vw", "-7vh", "10s", "-5s"],
    ["IoT", "11%", "76%", "4deg", "8vw", "-8vh", "12s", "-8s"],
    ["Spring", "57%", "83%", "-6deg", "9vw", "-6vh", "13s", "-9s"],
    ["Cloud", "40%", "12%", "3deg", "-7vw", "7vh", "10s", "-6s"],
    ["Oracle", "78%", "38%", "-4deg", "-9vw", "6vh", "12s", "-4s"]
  ];
  codeWords.forEach(([word,x,y,r,dx,dy,speed,delay]) => {
    const item = document.createElement("span");
    item.className = "showcase-codeword";
    item.textContent = word;
    [["--x",x],["--y",y],["--r",r],["--dx",dx],["--dy",dy],["--speed",speed],["--delay",delay]].forEach(([key,value]) => item.style.setProperty(key,value));
    codefield.append(item);
  });
  const bandTech = ["React", "Spring Boot", "Java", "REST API", "Oracle", "Microservices", "Android", "IoT", "Cloud", "MySQL"];
  ["one", "two"].forEach((variant, bandIndex) => {
    const band = document.createElement("div");
    band.className = `showcase-diagonal ${variant}`;
    const bandTrack = document.createElement("div");
    bandTrack.className = "showcase-diagonal-track";
    [...bandTech, ...bandTech, ...bandTech].forEach((name, index) => {
      const item = document.createElement("span");
      item.textContent = name;
      item.style.setProperty("--band-color", ["#2ee7df", "#5577ff", "#9b6cff", "#ffc857", "#ff6f61"][(index + bandIndex) % 5]);
      bandTrack.append(item);
    });
    band.append(bandTrack);
    (document.querySelector(".portrait-stage") || codefield).append(band);
  });
  document.body.prepend(codefield);

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

  const contactRail = document.getElementById("contactRail");
  const updateContactRail = () => {
    if (!contactRail) return;
    const trigger = Math.min(520, Math.max(240, innerHeight * .38));
    const visible = scrollY > trigger;
    contactRail.classList.toggle("is-visible", visible);
    contactRail.setAttribute("aria-hidden", String(!visible));
  };
  addEventListener("scroll", updateContactRail, { passive: true });
  addEventListener("resize", updateContactRail, { passive: true });
  updateContactRail();

  const pageFooter = document.querySelector("footer#contact");
  if (pageFooter) document.body.append(pageFooter);

  if (matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".highlight-card,.skill-card,.project-card,.cert-item").forEach(card => card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--sc-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--sc-y", `${event.clientY - rect.top}px`);
    }));
  }
})();