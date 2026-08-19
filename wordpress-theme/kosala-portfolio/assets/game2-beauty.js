(() => {
  const shell = document.querySelector(".memory-shell");
  const board = document.querySelector("#memoryBoard");
  if (!shell || !board || shell.querySelector(".memory-progress")) return;

  const progress = document.createElement("div");
  progress.className = "memory-progress";
  progress.innerHTML = "<span></span>";
  board.after(progress);
  const bar = progress.firstElementChild;

  let celebrated = false;
  const celebrate = () => {
    const colors = ["#5b7cff","#22d3ee","#42e8a4","#ffb84d","#f472b6"];
    for (let index = 0; index < 42; index++) {
      const piece = document.createElement("i");
      piece.className = "memory-confetti";
      piece.style.setProperty("--confetti", colors[index % colors.length]);
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 260;
      piece.style.setProperty("--cx", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--cy", `${Math.sin(angle) * distance}px`);
      piece.style.setProperty("--cr", `${Math.random() * 720 - 360}deg`);
      shell.appendChild(piece);
      setTimeout(() => piece.remove(), 950);
    }
  };
  const update = () => {
    const matched = board.querySelectorAll(".memory-card.matched").length;
    const total = board.querySelectorAll(".memory-card").length || 12;
    bar.style.width = `${matched / total * 100}%`;
    if (matched === total && !celebrated) { celebrated = true; celebrate(); }
    if (matched === 0) celebrated = false;
  };
  new MutationObserver(update).observe(board, { subtree:true, attributes:true, attributeFilter:["class"], childList:true });
  update();
})();
