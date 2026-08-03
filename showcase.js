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

  /* Section-level scroll transitions */
  const sectionTransitions = [...document.querySelectorAll("section:not(.hero) > .section-container, footer .footer-content")];
  sectionTransitions.forEach((item, index) => {
    item.classList.add("section-transition", "section-from-bottom");
    item.style.setProperty("--section-index", String(index));
    item.querySelectorAll(".opportunity-card,.highlight-card,.skill-card,.project-card,.experience-card,.education-item,.cert-item,.form-card").forEach((card, cardIndex) => card.style.setProperty("--academic-delay", `${80 + cardIndex * 90}ms`));
  });
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-section-visible");
      sectionObserver.unobserve(entry.target);
    }), { threshold: [0, .12], rootMargin: "-5% 0px -9% 0px" });
    sectionTransitions.forEach(item => sectionObserver.observe(item));
  } else sectionTransitions.forEach(item => item.classList.add("is-section-visible"));
  const revealItems = [...document.querySelectorAll(".section-header,.highlight-card,.skill-card,.project-card,.experience-card,.education-item,.cert-item,.game-shell,.memory-shell,.form-card")].filter(item => !item.closest(".section-transition"));
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
  if (contactRail) {
    const railHideDelay = 2800;
    const edgeRevealWidth = 96;
    let railHideTimer;
    let railInteracting = false;

    const setContactRailVisible = (visible) => {
      contactRail.classList.toggle("is-visible", visible);
      contactRail.setAttribute("aria-hidden", String(!visible));
      document.body.classList.toggle("contact-rail-active", visible);
    };
    const cancelRailHide = () => clearTimeout(railHideTimer);
    const scheduleRailHide = () => {
      cancelRailHide();
      if (railInteracting) return;
      railHideTimer = setTimeout(() => setContactRailVisible(false), railHideDelay);
    };
    const revealContactRail = () => {
      if (document.body.classList.contains("ai-open")) {
        setContactRailVisible(false);
        return;
      }
      setContactRailVisible(true);
      scheduleRailHide();
    };

    addEventListener("scroll", revealContactRail, { passive: true });
    addEventListener("pointermove", (event) => {
      if (event.clientX >= innerWidth - edgeRevealWidth) revealContactRail();
    }, { passive: true });
    contactRail.addEventListener("pointerenter", () => {
      railInteracting = true;
      cancelRailHide();
    });
    contactRail.addEventListener("pointerleave", () => {
      railInteracting = false;
      scheduleRailHide();
    });
    contactRail.addEventListener("focusin", () => {
      railInteracting = true;
      revealContactRail();
      cancelRailHide();
    });
    contactRail.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        railInteracting = contactRail.contains(document.activeElement);
        if (!railInteracting) scheduleRailHide();
      });
    });
    contactRail.addEventListener("click", revealContactRail);
    addEventListener("resize", scheduleRailHide, { passive: true });
    new MutationObserver(() => {
      if (document.body.classList.contains("ai-open")) {
        cancelRailHide();
        setContactRailVisible(false);
      }
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    if (scrollY > 0) revealContactRail();
    else setContactRailVisible(false);
  }

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