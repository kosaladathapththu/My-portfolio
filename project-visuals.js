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
  });
})();
