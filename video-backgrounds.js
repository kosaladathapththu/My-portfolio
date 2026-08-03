(() => {
  const videos = new Set();
  const visible = new WeakMap();
  const mobile = matchMedia("(max-width: 900px)");
  let mobileScrolling = false;
  let scrollEndTimer;

  const playWhenAllowed = (video) => {
    if (document.hidden || mobileScrolling || visible.get(video) === false) return;
    video.play().catch(() => {});
  };
  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visible.set(entry.target, entry.isIntersecting);
      if (entry.isIntersecting) playWhenAllowed(entry.target);
      else entry.target.pause();
    });
  }, { rootMargin: "160px 0px", threshold: 0.01 }) : null;

  const activate = (video) => {
    if (!(video instanceof HTMLVideoElement) || videos.has(video)) return;
    videos.add(video);
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    if (observer) observer.observe(video);
    else {
      visible.set(video, true);
      if (video.readyState >= 2) playWhenAllowed(video);
      else video.addEventListener("canplay", () => playWhenAllowed(video), { once: true });
    }
  };
  const scan = (root = document) => root.querySelectorAll?.(".section-video-bg video").forEach(activate);
  const resumeVisible = () => videos.forEach(playWhenAllowed);

  if (mobile.matches) addEventListener("scroll", () => {
    if (!mobileScrolling) {
      mobileScrolling = true;
      videos.forEach((video) => video.pause());
    }
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      mobileScrolling = false;
      resumeVisible();
    }, 160);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((video) => video.pause());
    else resumeVisible();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => scan());
  else scan();
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    if (node.matches?.(".section-video-bg video")) activate(node);
    scan(node);
  }))).observe(document.documentElement, { childList: true, subtree: true });
})();
