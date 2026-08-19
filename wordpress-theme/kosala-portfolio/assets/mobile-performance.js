(() => {
  const mobile = matchMedia("(max-width: 900px)");
  if (!mobile.matches) return;
  let scrollEndTimer;
  let scrolling = false;
  const pauseAnimatedMedia = () => document.querySelectorAll(".ai-bot__image").forEach((media) => media.pause?.());
  const resumeAnimatedMedia = () => {
    if (document.hidden) return;
    document.querySelectorAll(".ai-bot__image").forEach((media) => media.play?.().catch(() => {}));
  };
  const beginScroll = () => {
    if (!scrolling) {
      scrolling = true;
      document.documentElement.classList.add("mobile-scrolling");
      pauseAnimatedMedia();
    }
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      scrolling = false;
      document.documentElement.classList.remove("mobile-scrolling");
      resumeAnimatedMedia();
    }, 140);
  };
  addEventListener("scroll", beginScroll, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAnimatedMedia();
    else if (!scrolling) resumeAnimatedMedia();
  });
})();
