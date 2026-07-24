(() => {
  const contact = document.querySelector("#contactFormSection");
  if (!contact || document.querySelector("#mini-game")) return;

  const section = document.createElement("section");
  section.id = "mini-game";
  section.innerHTML = `
    <div class="section-container">
      <div class="section-header">
        <div class="section-label"><i class="fas fa-gamepad"></i> Mini Game</div>
        <h2>Bug Hunt</h2>
        <p>A quick developer challenge: squash as many bugs as possible before the timer reaches zero.</p>
      </div>
      <div class="game-shell">
        <div class="game-info">
          <div>
            <span class="game-kicker"><i class="fas fa-terminal"></i> Debug mode</span>
            <h3>Ready to debug?</h3>
            <p>Tap the bugs as they appear. Faster reactions earn a cleaner build.</p>
          </div>
          <div class="game-stats">
            <div class="game-stat"><strong id="gameScore">0</strong><span>Score</span></div>
            <div class="game-stat"><strong id="gameTime">20</strong><span>Seconds</span></div>
            <div class="game-stat"><strong id="gameBest">0</strong><span>Best</span></div>
          </div>
          <button class="game-start" id="gameStart"><i class="fas fa-play"></i> Start Debugging</button>
        </div>
        <div class="game-arena" id="gameArena" aria-label="Bug Hunt game area">
          <div class="game-ready" id="gameReady"><div><i class="fas fa-bug"></i>Press start, then tap every bug</div></div>
          <div class="game-result" id="gameResult"><div class="game-result-card"><i class="fas fa-trophy"></i><h4 id="gameResultTitle">Build complete</h4><p id="gameResultText"></p></div></div>
        </div>
      </div>
    </div>`;
  contact.before(section);

  const contactNav = document.querySelector('.nav-links a[href="#contactFormSection"]')?.closest("li");
  if (contactNav && !document.querySelector('.nav-links a[href="#mini-game"]')) {
    const item = document.createElement("li");
    item.innerHTML = '<a href="#mini-game"><i class="fas fa-gamepad"></i> Game</a>';
    contactNav.before(item);
  }

  const arena = section.querySelector("#gameArena");
  const start = section.querySelector("#gameStart");
  const scoreEl = section.querySelector("#gameScore");
  const timeEl = section.querySelector("#gameTime");
  const bestEl = section.querySelector("#gameBest");
  const ready = section.querySelector("#gameReady");
  const result = section.querySelector("#gameResult");
  const resultTitle = section.querySelector("#gameResultTitle");
  const resultText = section.querySelector("#gameResultText");
  let score = 0, time = 20, running = false, spawnTimer, clockTimer;
  const bestKey = "kosalaBugHuntBest";
  bestEl.textContent = localStorage.getItem(bestKey) || "0";

  const clearBugs = () => arena.querySelectorAll(".game-bug").forEach(bug => bug.remove());
  const sparks = (x, y) => {
    for (let i = 0; i < 7; i++) {
      const spark = document.createElement("span");
      spark.className = "game-spark";
      spark.style.left = `${x}px`; spark.style.top = `${y}px`;
      spark.style.setProperty("--sx", `${Math.cos(i / 7 * Math.PI * 2) * 38}px`);
      spark.style.setProperty("--sy", `${Math.sin(i / 7 * Math.PI * 2) * 38}px`);
      arena.appendChild(spark);
      setTimeout(() => spark.remove(), 500);
    }
  };
  const spawn = () => {
    if (!running) return;
    const bug = document.createElement("button");
    bug.type = "button"; bug.className = "game-bug"; bug.textContent = "🐛";
    bug.setAttribute("aria-label", "Squash bug");
    const maxX = Math.max(8, arena.clientWidth - 66);
    const maxY = Math.max(8, arena.clientHeight - 66);
    bug.style.left = `${8 + Math.random() * (maxX - 8)}px`;
    bug.style.top = `${8 + Math.random() * (maxY - 8)}px`;
    bug.addEventListener("click", () => {
      if (!running || bug.classList.contains("squashed")) return;
      score += 1; scoreEl.textContent = score;
      const x = bug.offsetLeft + bug.offsetWidth / 2, y = bug.offsetTop + bug.offsetHeight / 2;
      bug.classList.add("squashed"); sparks(x, y);
      setTimeout(() => bug.remove(), 260);
    });
    arena.appendChild(bug);
    setTimeout(() => { if (bug.isConnected) bug.remove(); }, Math.max(750, 1450 - score * 18));
    spawnTimer = setTimeout(spawn, Math.max(320, 760 - score * 12));
  };
  const finish = () => {
    running = false; clearTimeout(spawnTimer); clearInterval(clockTimer); clearBugs();
    const oldBest = Number(localStorage.getItem(bestKey) || 0);
    if (score > oldBest) { localStorage.setItem(bestKey, String(score)); bestEl.textContent = score; resultTitle.textContent = "New high score!"; }
    else resultTitle.textContent = "Build complete";
    resultText.textContent = `You removed ${score} bug${score === 1 ? "" : "s"}.`;
    result.classList.add("show"); start.disabled = false; start.innerHTML = '<i class="fas fa-rotate-right"></i> Play Again';
  };
  start.addEventListener("click", () => {
    score = 0; time = 20; running = true; scoreEl.textContent = "0"; timeEl.textContent = "20";
    ready.classList.add("hidden"); result.classList.remove("show"); start.disabled = true; clearBugs();
    spawn();
    clockTimer = setInterval(() => { time -= 1; timeEl.textContent = time; if (time <= 0) finish(); }, 1000);
  });
})();
