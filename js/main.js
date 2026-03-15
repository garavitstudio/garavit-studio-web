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

/* ─── VIDEO CAROUSEL ──────────────────────────── */
(function () {

  // Datos de los videos
  var videos = [
    { src: 'videos/Cejas2%20F.mp4',       tag: 'Peluquería', title: 'El secreto de un corte que dura meses' },
    { src: 'videos/Linaje%20F.mp4',        tag: 'Estética',   title: 'Lo que nadie te cuenta del cuidado de uñas' },
    { src: 'videos/laser%20globo%20F.mp4', tag: 'Fitness',    title: 'Por qué tus clientes no vuelven al gym' }
  ];

  var current = 0;
  var isMuted = true;

  var vcVideo   = document.getElementById('vcVideo');
  var vcTag     = document.getElementById('vcTag');
  var vcTitle   = document.getElementById('vcTitle');
  var vcPhone   = document.getElementById('vcPhone');
  var vcSound   = document.getElementById('vcSound');
  var icoMute   = document.getElementById('icoMute');
  var icoUnmute = document.getElementById('icoUnmute');
  var vcPrev    = document.getElementById('vcPrev');
  var vcNext    = document.getElementById('vcNext');
  var vcDots    = document.querySelectorAll('.vc-dot');

  if (!vcVideo) return; // Salir si no existe el elemento

  function loadVideo(index) {
    // Fade out
    vcPhone.style.opacity = '0';

    setTimeout(function() {
      var v = videos[index];

      // Actualizar src, tag y título
      vcVideo.src   = v.src;
      vcVideo.muted = isMuted;
      vcTag.textContent   = v.tag;
      vcTitle.textContent = v.title;

      // Actualizar dots
      vcDots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });

      // Reproducir
      vcVideo.load();
      vcVideo.play().catch(function() {});

      // Fade in
      vcPhone.style.opacity = '1';
    }, 250);
  }

  function goTo(index) {
    if (index < 0) index = videos.length - 1;
    if (index >= videos.length) index = 0;
    current = index;
    loadVideo(current);
  }

  // Botón de sonido
  vcSound.addEventListener('click', function() {
    isMuted = !isMuted;
    vcVideo.muted = isMuted;
    icoMute.style.display   = isMuted ? 'block' : 'none';
    icoUnmute.style.display = isMuted ? 'none'  : 'block';
  });

  // Flechas
  vcPrev.addEventListener('click', function() { goTo(current - 1); });
  vcNext.addEventListener('click', function() { goTo(current + 1); });

  // Dots
  vcDots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(dot.getAttribute('data-i')));
    });
  });

  // Swipe táctil
  var touchStartX = 0;
  vcPhone.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  vcPhone.addEventListener('touchend', function(e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
    }
  });

  // Iniciar con el primer video
  vcVideo.muted = true;
  vcVideo.play().catch(function() {});

})();
