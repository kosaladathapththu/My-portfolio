(() => {
  document.querySelectorAll('#projectsGrid .project-card').forEach((card) => {
    const source = card.dataset.img;
    if (!source || card.querySelector('.project-visual')) return;
    const figure = document.createElement('figure');
    figure.className = 'project-visual';
    const image = document.createElement('img');
    image.src = source;
    image.alt = `${card.dataset.title || 'Project'} visual`;
    image.loading = 'lazy';
    image.decoding = 'async';
    figure.append(image);
    card.prepend(figure);

    card.querySelectorAll('.project-proof span').forEach((label) => {
      const key = label.querySelector('b')?.textContent.trim().toLowerCase();
      if (!key) return;
      label.classList.add(`proof-${key}`);
      if (key === 'status') {
        const value = label.textContent.toLowerCase();
        const tone = /private/.test(value) ? 'private' : /prototype|academic/.test(value) ? 'prototype' : /live|production|professional|client/.test(value) ? 'live' : 'neutral';
        label.dataset.tone = tone;
      }
    });
  });
})();
