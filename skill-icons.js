(() => {
  const brands = {
    Java: ["fa-brands fa-java", "#e76f00"],
    PHP: ["fa-brands fa-php", "#777bb4"],
    JavaScript: ["fa-brands fa-js", "#e8c400"],
    "JavaScript ES6+": ["fa-brands fa-js", "#e8c400"],
    Python: ["fa-brands fa-python", "#3776ab"],
    "Spring Boot": ["fa-solid fa-leaf", "#6db33f"],
    "React.js": ["fa-brands fa-react", "#149eca"],
    "Android SDK": ["fa-brands fa-android", "#3ddc84"],
    "Node.js": ["fa-brands fa-node-js", "#339933"],
    "Express.js": ["fa-brands fa-node-js", "#333"],
    Bootstrap: ["fa-brands fa-bootstrap", "#7952b3"],
    "Oracle DB": ["fa-solid fa-database", "#f80000"],
    MySQL: ["fa-solid fa-database", "#4479a1"],
    Firebase: ["fa-solid fa-fire-flame-curved", "#ff9100"],
    MongoDB: ["fa-solid fa-leaf", "#47a248"],
    HTML5: ["fa-brands fa-html5", "#e34f26"],
    CSS3: ["fa-brands fa-css3-alt", "#1572b6"],
    "Git & GitHub": ["fa-brands fa-github", "#181717"],
    Postman: ["fa-solid fa-paper-plane", "#ff6c37"],
    "Android Studio": ["fa-brands fa-android", "#3ddc84"],
    Arduino: ["fa-brands fa-arduino", "#00979d"],
    "Google Cloud (Basics)": ["fa-brands fa-google", "#4285f4"],
    "Azure Basics": ["fa-brands fa-microsoft", "#0078d4"],
  };
  const categoryFallbacks = [
    ["fa-solid fa-code", "#9a6000"],
    ["fa-solid fa-layer-group", "#9a6000"],
    ["fa-solid fa-database", "#4479a1"],
    ["fa-solid fa-display", "#1572b6"],
    ["fa-solid fa-screwdriver-wrench", "#6b7280"],
    ["fa-solid fa-microchip", "#00979d"],
    ["fa-solid fa-cloud", "#4285f4"],
    ["fa-solid fa-lightbulb", "#d99a00"],
  ];
  document
    .querySelectorAll("#skills .skill-card")
    .forEach((card, cardIndex) => {
      card.querySelectorAll("li").forEach((item) => {
        const name = item.textContent.trim();
        const [icon, color] =
          brands[name] || categoryFallbacks[cardIndex] || categoryFallbacks[0];
        const mark = document.createElement("i");
        mark.className = `${icon} skill-item-icon`;
        mark.setAttribute("aria-hidden", "true");
        mark.style.setProperty("--skill-brand", color);
        item.prepend(mark);
      });
    });
})();
