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
    ["Oracle", "78%", "38%", "-4deg", "-9vw", "6vh", "12s", "-4s"],
  ];
  codeWords.forEach(([word, x, y, r, dx, dy, speed, delay]) => {
    const item = document.createElement("span");
    item.className = "showcase-codeword";
    item.textContent = word;
    [
      ["--x", x],
      ["--y", y],
      ["--r", r],
      ["--dx", dx],
      ["--dy", dy],
      ["--speed", speed],
      ["--delay", delay],
    ].forEach(([key, value]) => item.style.setProperty(key, value));
    codefield.append(item);
  });
  document.body.prepend(codefield);

  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const setHeroWordVisibility = (hidden) =>
      document.body.classList.toggle("hero-words-hidden", hidden);
    const heroRect = heroSection.getBoundingClientRect();
    setHeroWordVisibility(heroRect.bottom > 0 && heroRect.top < innerHeight);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => setHeroWordVisibility(entry.isIntersecting),
        {
          threshold: 0,
          rootMargin: "0px",
        },
      ).observe(heroSection);
    }
  }

  const tech = [
    "JavaScript",
    "PHP",
    "Python",
    "Node.js",
    "GitHub",
    "Android",
    "Docker",
    "Arduino",
    "Java",
    "React",
    "Spring Boot",
    "Oracle",
    "MySQL",
    "IoT",
    "REST APIs",
    "Cloud",
  ];
  const techIcons = {
    JavaScript: "fa-brands fa-js",
    PHP: "fa-brands fa-php",
    Python: "fa-brands fa-python",
    "Node.js": "fa-brands fa-node-js",
    GitHub: "fa-brands fa-github",
    Android: "fa-brands fa-android",
    Docker: "fa-brands fa-docker",
    Arduino: "fa-brands fa-arduino",
    React: "fa-brands fa-react",
    Java: "fa-brands fa-java",
    "Full-Stack": "fa-solid fa-code",
    "Spring Boot": "fa-solid fa-leaf",
    Microservices: "fa-solid fa-cubes",
    Oracle: "fa-solid fa-database",
    MySQL: "fa-solid fa-database",
    IoT: "fa-solid fa-microchip",
    "REST APIs": "fa-solid fa-cloud-arrow-up",
    Cloud: "fa-solid fa-cloud",
  };
  const techColors = {
    JavaScript: "#f7df1e",
    PHP: "#777bb4",
    Python: "#3776ab",
    "Node.js": "#339933",
    GitHub: "#181717",
    Android: "#3ddc84",
    Docker: "#2496ed",
    Arduino: "#00979d",
    Java: "#e76f00",
    React: "#61dafb",
    "Spring Boot": "#6db33f",
    Oracle: "#f80000",
    MySQL: "#4479a1",
    IoT: "#7c3aed",
    "REST APIs": "#ff6c37",
    Cloud: "#4285f4",
  };
  const ribbon = document.createElement("div");
  ribbon.className = "showcase-ribbon";
  ribbon.setAttribute("aria-label", "Technology experience");
  const track = document.createElement("div");
  track.className = "showcase-ribbon-track";
  [...tech, ...tech].forEach((name, index) => {
    const item = document.createElement("span");
    item.innerHTML = `<i class="${techIcons[name] || "fa-solid fa-code"}" aria-hidden="true"></i><b>${name}</b>`;
    item.style.setProperty("--brand-color", techColors[name] || "#111111");
    track.append(item);
  });
  ribbon.append(track);
  document.querySelector(".hero")?.insertAdjacentElement("afterend", ribbon);

  document
    .querySelectorAll("section:not(.hero) .section-container")
    .forEach((section, index) => {
      section.dataset.showcaseIndex = String(index + 1).padStart(2, "0");
    });

  /* Section-level scroll transitions */
  const sectionTransitions = [
    ...document.querySelectorAll(
      "section:not(.hero) > .section-container, footer .footer-content",
    ),
  ];
  sectionTransitions.forEach((item, index) => {
    item.classList.add("section-transition", "section-from-bottom");
    item.style.setProperty("--section-index", String(index));
    item
      .querySelectorAll(
        ".opportunity-card,.highlight-card,.skill-card,.project-card,.experience-card,.education-item,.cert-item,.form-card",
      )
      .forEach((card, cardIndex) =>
        card.style.setProperty(
          "--academic-delay",
          `${Math.min(cardIndex, 3) * 80}ms`,
        ),
      );
  });
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-section-visible");
          sectionObserver.unobserve(entry.target);
        }),
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    sectionTransitions.forEach((item) => sectionObserver.observe(item));
  } else
    sectionTransitions.forEach((item) =>
      item.classList.add("is-section-visible"),
    );
  const revealItems = [
    ...document.querySelectorAll(
      ".section-header,.highlight-card,.skill-card,.project-card,.experience-card,.education-item,.cert-item,.game-shell,.memory-shell,.form-card",
    ),
  ].filter((item) => !item.closest(".section-transition"));
  revealItems.forEach((item, index) => {
    item.classList.add("showcase-reveal");
    item.style.setProperty("--sc-delay", `${(index % 4) * 65}ms`);
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-shown");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -35px" },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("is-shown"));

  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty(
      "--sc-progress",
      `${total > 0 ? Math.min(100, (scrollY / total) * 100) : 0}%`,
    );
  };
  let progressFrame;
  const requestProgressUpdate = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      progressFrame = 0;
      updateProgress();
    });
  };
  addEventListener("scroll", requestProgressUpdate, { passive: true });
  updateProgress();

  const assistantLauncher = document.querySelector(".ai-launcher");
  if (assistantLauncher) {
    let cloudHideTimer;
    let scrollSettleTimer;
    const showAssistantCloud = () => {
      clearTimeout(cloudHideTimer);
      document.documentElement.classList.remove("assistant-cloud-hidden");
    };
    const scheduleAssistantCloudHide = (delay = 4500) => {
      clearTimeout(cloudHideTimer);
      cloudHideTimer = setTimeout(
        () => document.documentElement.classList.add("assistant-cloud-hidden"),
        delay,
      );
    };
    assistantLauncher.addEventListener("pointerenter", showAssistantCloud);
    assistantLauncher.addEventListener("pointerleave", () =>
      scheduleAssistantCloudHide(1600),
    );
    assistantLauncher.addEventListener("focusin", showAssistantCloud);
    assistantLauncher.addEventListener("focusout", () =>
      scheduleAssistantCloudHide(1600),
    );
    addEventListener(
      "scroll",
      () => {
        document.documentElement.classList.add("site-scrolling");
        clearTimeout(scrollSettleTimer);
        scrollSettleTimer = setTimeout(
          () => document.documentElement.classList.remove("site-scrolling"),
          180,
        );
      },
      { passive: true },
    );
    scheduleAssistantCloudHide();
  }

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
      railHideTimer = setTimeout(
        () => setContactRailVisible(false),
        railHideDelay,
      );
    };
    const revealContactRail = () => {
      if (document.body.classList.contains("ai-open")) {
        setContactRailVisible(false);
        return;
      }
      setContactRailVisible(true);
      scheduleRailHide();
    };

    let railScrollFrame;
    addEventListener(
      "scroll",
      () => {
        if (railScrollFrame) return;
        railScrollFrame = requestAnimationFrame(() => {
          railScrollFrame = 0;
          revealContactRail();
        });
      },
      { passive: true },
    );
    addEventListener(
      "pointermove",
      (event) => {
        if (event.clientX >= innerWidth - edgeRevealWidth) revealContactRail();
      },
      { passive: true },
    );
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
    document
      .querySelectorAll(".highlight-card,.skill-card,.project-card,.cert-item")
      .forEach((card) =>
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--sc-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--sc-y", `${event.clientY - rect.top}px`);
        }),
      );
  }
})();
