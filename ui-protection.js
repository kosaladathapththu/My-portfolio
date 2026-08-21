/* Basic UI deterrence only; public browser source cannot be made inaccessible. */
(() => {
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
  document.addEventListener("contextmenu", stop, { capture: true });
  document.addEventListener(
    "keydown",
    (event) => {
      const key = event.key.toLowerCase();
      const blocked =
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          ["i", "j", "c", "k"].includes(key)) ||
        (event.ctrlKey && ["u", "s"].includes(key));
      if (blocked) stop(event);
    },
    { capture: true },
  );
  document.addEventListener(
    "dragstart",
    (event) => {
      if (event.target instanceof HTMLImageElement) stop(event);
    },
    { capture: true },
  );
})();
