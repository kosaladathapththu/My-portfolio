(function(){
  // Respect reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keyboard navigation detection
  function handleFirstTab(e){
    if(e.key === 'Tab') document.documentElement.classList.add('keyboard-nav');
    window.removeEventListener('keydown', handleFirstTab);
  }
  window.addEventListener('keydown', handleFirstTab);

  // Scroll reveal for elements with .reveal or .reveal-ready
  if(!reduce){
    const rev = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:0.12});

    document.querySelectorAll('.reveal, .reveal-ready, .hero-content, .profile-card, .project-card, .skill-card, .highlight-card').forEach(el=>{
      rev.observe(el);
    });
  } else {
    // If reduced, just show them
    document.querySelectorAll('.reveal, .reveal-ready').forEach(el=>el.classList.add('is-visible'));
  }

  // Tilt effect for elements with .tilt
  function applyTilt(el, e){
    const bounds = el.getBoundingClientRect();
    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;
    const rotY = (px - 0.5) * 10; // rotateY
    const rotX = (0.5 - py) * 8; // rotateX
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
  }
  function resetTilt(el){ el.style.transform = ''; }

  if(!reduce){
    document.querySelectorAll('.tilt, .project-card').forEach(card=>{
      card.classList.add('tilt');
      card.addEventListener('mousemove', e=>applyTilt(card, e));
      card.addEventListener('mouseleave', ()=>resetTilt(card));
    });
  }

  // Simple ripple for buttons with .btn-ripple
  document.querySelectorAll('.btn-ripple').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      r.className='ripple';
      this.appendChild(r);
      const d = Math.max(this.clientWidth, this.clientHeight);
      r.style.width = r.style.height = d+'px';
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left - d/2)+'px';
      r.style.top = (e.clientY - rect.top - d/2)+'px';
      r.style.transition = 'transform .6s ease, opacity .6s ease';
      requestAnimationFrame(()=>{ r.style.transform='scale(1)'; r.style.opacity='0'; });
      setTimeout(()=>r.remove(),700);
    });
  });

  // Make hero name glow animated if present
  document.querySelectorAll('.gradient-text, .gradient-animate').forEach(el=>{
    el.classList.add('gradient-animate');
  });
})();
