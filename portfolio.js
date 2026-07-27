document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-track';
  progressBar.innerHTML = '<span class="progress-bar"></span>';
  document.body.prepend(progressBar);

  const progressFill = progressBar.querySelector('.progress-bar');
  const updateProgress = () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height ? Math.min((scroll / height) * 100, 100) : 0;
    progressFill.style.width = `${percent}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealTargets = document.querySelectorAll('.section, .project-card, .skill-card, .highlight-card, .cert-item, .education-item, .experience-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('reveal'));
  }
});
