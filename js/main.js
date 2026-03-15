/* ─── SCROLL REVEAL ───────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── SMOOTH SCROLL NAV ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── SLIDER REELS ────────────────────────────── */
(function () {
  const track   = document.getElementById('reelsTrack');
  const outer   = document.getElementById('reelsOuter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots    = document.querySelectorAll('.slider-dot');
  const cards   = track ? track.querySelectorAll('.reel-card') : [];
  const total   = cards.length;

  if (!track || total === 0) return;

  let current = 0;
  const GAP   = 28;

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width + GAP;
  }

  function goTo(index) {
    if (index >= total) {
      current = 0;
    } else if (index < 0) {
      current = total - 1;
    } else {
      current = index;
    }
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  /* Botones */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

  /* Drag con ratón */
  let startX = 0, isDragging = false, startOffset = 0;

  outer.addEventListener('mousedown', e => {
    isDragging   = true;
    startX       = e.clientX;
    startOffset  = current * getCardWidth();
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const delta = startX - e.clientX;
    track.style.transform = `translateX(-${Math.max(0, startOffset + delta)}px)`;
  });

  /* Swipe táctil */
  outer.addEventListener('touchstart', e => {
    startX      = e.touches[0].clientX;
    startOffset = current * getCardWidth();
    track.style.transition = 'none';
  }, { passive: true });

  outer.addEventListener('touchmove', e => {
    const delta = startX - e.touches[0].clientX;
    track.style.transform = `translateX(-${Math.max(0, startOffset + delta)}px)`;
  }, { passive: true });

  /* Soltar (ratón y touch) */
  function endDrag(endX) {
    track.style.transition = '';
    const delta = startX - endX;
    if (Math.abs(delta) > 60) {
      goTo(delta > 0 ? current + 1 : current - 1);
    } else {
      goTo(current);
    }
    isDragging = false;
  }

  window.addEventListener('mouseup',  e => { if (isDragging) endDrag(e.clientX); });
  outer.addEventListener('touchend',  e => endDrag(e.changedTouches[0].clientX));
})();
