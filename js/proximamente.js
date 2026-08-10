/* ═══════════════════════════════════════════════
   GARAVIT STUDIO — PRÓXIMAMENTE
   Captación de leads + animaciones
═══════════════════════════════════════════════ */

/* ─── CONFIGURACIÓN ───────────────────────────────
   Los correos que dejen los visitantes se envían a
   la dirección indicada aquí, vía FormSubmit (gratis,
   sin cuenta ni claves de API).

   IMPORTANTE — activación única:
   La PRIMERA vez que alguien envíe el formulario,
   FormSubmit manda un correo de confirmación a
   hola@garavitstudio.com. Hay que abrirlo y pulsar el
   enlace de activación. A partir de ahí, todos los leads
   llegan solos a esa bandeja.

   Para cambiar el destino, cambia solo el correo de abajo.
─────────────────────────────────────────────────── */
var LEAD_EMAIL    = 'hola@garavitstudio.com';
var LEAD_ENDPOINT = 'https://formsubmit.co/ajax/' + LEAD_EMAIL;

/* ─── SCROLL REVEAL ───────────────────────────── */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ─── FORMULARIO DE LEADS ─────────────────────── */
(function () {

  var form        = document.getElementById('leadForm');
  var input       = document.getElementById('leadEmail');
  var honeypot    = document.getElementById('leadWebsite');
  var button      = document.getElementById('leadSubmit');
  var buttonText  = document.getElementById('leadSubmitText');
  var msg         = document.getElementById('leadMsg');
  var success     = document.getElementById('leadSuccess');

  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function showError(text) {
    msg.innerHTML = text;
    msg.classList.add('error');
  }

  function clearError() {
    msg.textContent = '';
    msg.classList.remove('error');
  }

  function setLoading(loading) {
    button.disabled = loading;
    buttonText.textContent = loading ? 'Enviando…' : 'Quiero que me contactéis';
  }

  /* Copia local de seguridad: si el envío falla, el lead
     no se pierde y se puede recuperar desde la consola con
     localStorage.getItem('garavit_leads')                */
  function saveLocally(email) {
    try {
      var stored = JSON.parse(localStorage.getItem('garavit_leads') || '[]');
      stored.push({ email: email, fecha: new Date().toISOString() });
      localStorage.setItem('garavit_leads', JSON.stringify(stored));
    } catch (err) { /* almacenamiento no disponible: seguimos igual */ }
  }

  function showSuccess() {
    form.style.display = 'none';
    success.classList.add('visible');
  }

  /* Último recurso: si la red falla, ofrecemos el mailto
     prerrellenado para que el lead no se evapore.        */
  function offerMailtoFallback(email) {
    var subject = encodeURIComponent('Quiero info de Garavit Studio');
    var body    = encodeURIComponent('Hola, os dejo mi correo: ' + email);
    showError(
      'No hemos podido enviarlo ahora mismo. ' +
      '<a href="mailto:' + LEAD_EMAIL + '?subject=' + subject + '&body=' + body + '">' +
      'Escríbenos directamente aquí</a> y te contestamos igual.'
    );
  }

  input.addEventListener('input', clearError);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Bot detectado: fingimos éxito y no enviamos nada.
    if (honeypot && honeypot.value) {
      showSuccess();
      return;
    }

    var email = input.value.trim();

    if (!email) {
      showError('Escribe tu correo y te contactamos nosotros.');
      input.focus();
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showError('Ese correo no parece válido. Revísalo, porfa.');
      input.focus();
      return;
    }

    clearError();
    setLoading(true);
    saveLocally(email);

    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        _subject: 'Nuevo lead desde la web (Próximamente)',
        _template: 'table',
        _captcha: 'false',
        origen: 'proximamente.html',
        fecha: new Date().toLocaleString('es-ES')
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function () {
        showSuccess();
      })
      .catch(function () {
        setLoading(false);
        offerMailtoFallback(email);
      });
  });

})();
