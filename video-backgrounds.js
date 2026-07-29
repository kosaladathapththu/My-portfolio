(() => {
  const activate = (video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener("canplay", play, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && video.paused) play();
    });
  };
  const scan = (root = document) => root.querySelectorAll?.(".section-video-bg video").forEach(activate);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => scan());
  else scan();
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    if (node.matches?.(".section-video-bg video")) activate(node);
    scan(node);
  }))).observe(document.documentElement, { childList: true, subtree: true });
})();