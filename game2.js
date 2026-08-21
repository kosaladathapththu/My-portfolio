(() => {
  const firstGame = document.querySelector("#mini-game .game-shell");
  if (!firstGame || document.querySelector(".memory-shell")) return;

  const games = [
    { id: "react", label: "React", icon: "fab fa-react", color: "#61dafb" },
    { id: "java", label: "Java", icon: "fab fa-java", color: "#ff8a65" },
    {
      id: "database",
      label: "Database",
      icon: "fas fa-database",
      color: "#ffd166",
    },
    {
      id: "api",
      label: "REST API",
      icon: "fas fa-code-branch",
      color: "#8fa7ff",
    },
    { id: "iot", label: "IoT", icon: "fas fa-microchip", color: "#42e8a4" },
    { id: "git", label: "Git", icon: "fab fa-git-alt", color: "#f06b4f" },
  ];

  const shell = document.createElement("div");
  shell.className = "memory-shell";
  shell.innerHTML = `
    <div class="memory-head">
      <div class="memory-title-wrap">
        <div class="memory-icon"><i class="fas fa-brain"></i></div>
        <div><h3>Tech Match</h3><p>Flip cards and pair Kosala's technologies.</p></div>
      </div>
      <div class="memory-meta">
        <div class="memory-pill"><strong id="memoryMoves">0</strong><span>Moves</span></div>
        <div class="memory-pill"><strong id="memoryTime">0s</strong><span>Time</span></div>
        <div class="memory-pill"><strong id="memoryBest">-</strong><span>Best</span></div>
      </div>
    </div>
    <div class="memory-board" id="memoryBoard" aria-label="Technology memory matching game"></div>
    <div class="memory-actions">
      <span class="memory-message" id="memoryMessage">Choose any card to begin.</span>
      <button class="memory-reset" id="memoryReset"><i class="fas fa-shuffle"></i> Shuffle Cards</button>
    </div>`;
  firstGame.after(shell);

  const board = shell.querySelector("#memoryBoard");
  const movesEl = shell.querySelector("#memoryMoves");
  const timeEl = shell.querySelector("#memoryTime");
  const bestEl = shell.querySelector("#memoryBest");
  const message = shell.querySelector("#memoryMessage");
  const reset = shell.querySelector("#memoryReset");
  const bestKey = "kosalaTechMatchBest";
  let first = null,
    lock = false,
    moves = 0,
    matched = 0,
    seconds = 0,
    timer = null,
    started = false;

  const savedBest = Number(localStorage.getItem(bestKey) || 0);
  bestEl.textContent = savedBest ? `${savedBest} moves` : "-";
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const finish = () => {
    clearInterval(timer);
    timer = null;
    message.textContent = `Matched all technologies in ${moves} moves and ${seconds} seconds.`;
    shell.classList.add("memory-win");
    if (
      !savedBest ||
      moves < Number(localStorage.getItem(bestKey) || Infinity)
    ) {
      localStorage.setItem(bestKey, String(moves));
      bestEl.textContent = `${moves} moves`;
      message.textContent = `New best! Completed in ${moves} moves and ${seconds} seconds.`;
    }
    setTimeout(() => shell.classList.remove("memory-win"), 900);
  };
  const flip = (card) => {
    if (lock || card === first || card.classList.contains("matched")) return;
    if (!started) {
      started = true;
      timer = setInterval(() => {
        seconds += 1;
        timeEl.textContent = `${seconds}s`;
      }, 1000);
    }
    card.classList.add("flipped");
    if (!first) {
      first = card;
      message.textContent = "Now find its matching technology.";
      return;
    }
    moves += 1;
    movesEl.textContent = moves;
    if (first.dataset.id === card.dataset.id) {
      first.classList.add("matched");
      card.classList.add("matched");
      first.classList.remove("flipped");
      card.classList.remove("flipped");
      first = null;
      matched += 1;
      message.textContent = "Match found!";
      if (matched === games.length) finish();
    } else {
      lock = true;
      message.textContent = "Not a match - try again.";
      const previous = first;
      first = null;
      setTimeout(() => {
        previous.classList.remove("flipped");
        card.classList.remove("flipped");
        lock = false;
      }, 720);
    }
  };
  const build = () => {
    clearInterval(timer);
    timer = null;
    board.innerHTML = "";
    first = null;
    lock = false;
    moves = 0;
    matched = 0;
    seconds = 0;
    started = false;
    movesEl.textContent = "0";
    timeEl.textContent = "0s";
    message.textContent = "Choose any card to begin.";
    shuffle(
      [...games, ...games].map((game, index) => ({
        ...game,
        key: `${game.id}-${index}`,
      })),
    ).forEach((game) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.id = game.id;
      card.setAttribute("aria-label", `Hidden technology card`);
      card.innerHTML = `<span class="memory-face memory-back"></span><span class="memory-face memory-front" style="--memory-color:${game.color}"><i class="${game.icon}"></i><span>${game.label}</span></span>`;
      card.addEventListener("click", () => flip(card));
      board.appendChild(card);
    });
  };
  reset.addEventListener("click", build);
  build();
})();
