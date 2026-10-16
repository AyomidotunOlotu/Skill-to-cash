(function () {
  'use strict';

  // ── LEGACY LINKS: old single-page anchors (#s0–#s9) → new pages ──
  var legacy = {
    s0: 'index.html', s1: 'pick-your-skill.html', s2: 'free-resources.html',
    s3: 'build-your-portfolio.html', s4: 'find-clients.html', s5: 'find-clients.html',
    s6: 'find-clients.html', s7: 'roadmap.html', s8: 'roadmap.html', s9: 'roadmap.html'
  };
  var hash = window.location.hash.replace('#', '');
  if (hash && legacy[hash] && !document.getElementById(hash)) {
    window.location.replace(legacy[hash] + '#' + hash);
    return;
  }

  // ── PROGRESS BAR ─────────────────────────────────────────────
  var pb = document.getElementById('pb');
  var scrollTicking = false;

  function updateProgress() {
    var scrollTop = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? Math.min(100, Math.round((scrollTop / docH) * 100)) : 0;
    if (pb) {
      pb.style.width = pct + '%';
      pb.setAttribute('aria-valuenow', pct);
    }
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ── NAV: keep the active page pill visible on narrow screens ──
  var activePill = document.querySelector('.nav-pill[aria-current="page"]');
  var nav = document.getElementById('stickyNav');
  if (activePill && nav && nav.scrollWidth > nav.clientWidth) {
    nav.scrollLeft = Math.max(0, activePill.offsetLeft - (nav.clientWidth - activePill.offsetWidth) / 2);
  }

  // ── ACCORDION (Q&A) ───────────────────────────────────────────
  var triggers = document.querySelectorAll('.qa-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = this.getAttribute('aria-expanded') === 'true';
      var bodyId = this.getAttribute('aria-controls');
      var body = bodyId ? document.getElementById(bodyId) : null;

      // Close all
      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var bId = t.getAttribute('aria-controls');
        var b = bId ? document.getElementById(bId) : null;
        if (b) {
          b.style.maxHeight = '0px';
          var item = t.closest('.qa-item');
          if (item) item.classList.remove('open');
        }
      });

      // Open clicked (if was closed)
      if (!isOpen && body) {
        this.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
        var item = this.closest('.qa-item');
        if (item) item.classList.add('open');
      }
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ── REVEAL ON SCROLL ──────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── INIT ──────────────────────────────────────────────────────
  updateProgress();

}());
