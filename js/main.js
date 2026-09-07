/* ==========================================================================
   Summer Sail — site behaviour
   Vanilla JS, no dependencies. Everything degrades gracefully without it.
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- header -- */
  function stickyHeader() {
    var header = d.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() {
      var stuck = window.scrollY > 8;
      header.classList.toggle('is-stuck', stuck);
      var tb = d.querySelector('.topbar');
      if (tb) tb.classList.toggle('is-stuck', stuck);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* --------------------------------------------------------- mobile nav -- */
  function mobileNav() {
    var burger = d.querySelector('.burger');
    var drawer = d.querySelector('.mobile-nav');
    if (!burger || !drawer) return;

    var closeBtn = drawer.querySelector('.mobile-nav__close');
    var lastFocus = null;

    function open() {
      lastFocus = d.activeElement;
      drawer.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      d.body.classList.add('nav-open');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      d.body.classList.remove('nav-open');
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);

    drawer.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', close);
    });

    // Accordion sub-menus inside the drawer
    drawer.querySelectorAll('.m-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = btn.nextElementSibling;
        if (!sub) return;
        var isOpen = sub.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  /* ------------------------------------------------------ scroll reveal -- */
  function reveal() {
    var items = d.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- countups -- */
  function countUp() {
    var nums = d.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* --------------------------------------------------------- lightbox -- */
  function lightbox() {
    var triggers = Array.prototype.slice.call(d.querySelectorAll('[data-lightbox]'));
    if (!triggers.length) return;

    var box = d.querySelector('.lightbox');
    if (!box) return;

    var imgEl = box.querySelector('img');
    var countEl = box.querySelector('.lightbox__count');
    var idx = 0;

    function srcOf(el) {
      return el.getAttribute('data-full') ||
             (el.querySelector('img') && el.querySelector('img').src) || '';
    }
    function altOf(el) {
      var i = el.querySelector('img');
      return i ? i.alt : '';
    }

    function show(i) {
      idx = (i + triggers.length) % triggers.length;
      imgEl.src = srcOf(triggers[idx]);
      imgEl.alt = altOf(triggers[idx]);
      if (countEl) countEl.textContent = (idx + 1) + ' / ' + triggers.length;
    }
    function open(i) {
      show(i);
      box.classList.add('is-open');
      d.body.style.overflow = 'hidden';
      var c = box.querySelector('.lightbox__close');
      if (c) c.focus();
    }
    function close() {
      box.classList.remove('is-open');
      d.body.style.overflow = '';
      imgEl.removeAttribute('src');
    }

    triggers.forEach(function (el, i) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });

    box.querySelector('.lightbox__close').addEventListener('click', close);
    var prev = box.querySelector('.lightbox__nav--prev');
    var next = box.querySelector('.lightbox__nav--next');
    if (prev) prev.addEventListener('click', function () { show(idx - 1); });
    if (next) next.addEventListener('click', function () { show(idx + 1); });

    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    d.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* --------------------------------------------------------- hero film -- */
  /* The poster image is what ships in the HTML, so the hero is complete
     before any video is considered. The film is only fetched when it is
     genuinely wanted: a wide screen, motion allowed, and no data saver. */
  function heroVideo() {
    var video = d.querySelector('.hero__video');
    if (!video) return;

    if (reduceMotion) return;
    if (window.innerWidth < 768) return;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;

    var sources = [
      ['data-src-webm', 'video/webm'],
      ['data-src-mp4', 'video/mp4']
    ];
    sources.forEach(function (pair) {
      var src = video.getAttribute(pair[0]);
      if (!src) return;
      var el = d.createElement('source');
      el.src = src;
      el.type = pair[1];
      video.appendChild(el);
    });

    video.addEventListener('playing', function () {
      video.classList.add('is-playing');
    }, { once: true });

    video.load();
    var attempt = video.play();
    if (attempt && attempt.catch) {
      // Autoplay refused (some power-saving modes) — the poster simply stays.
      attempt.catch(function () {});
    }
  }

  /* ------------------------------------------------------------- forms -- */
  /* The original site posted to a WordPress mail plugin. Until a real
     endpoint exists, forms validate locally and hand off to mailto: so
     nothing a visitor types is ever lost. Set data-endpoint on the form
     to POST somewhere instead. */
  function forms() {
    d.querySelectorAll('form[data-ss-form]').forEach(function (form) {
      var status = form.querySelector('.form-status');
      var submit = form.querySelector('[type="submit"]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var required = form.querySelectorAll('[required]');
        var ok = true;
        required.forEach(function (f) {
          if (!f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
            ok = false;
            f.style.borderColor = '#C87B7B';
          } else {
            f.style.borderColor = '';
          }
        });

        if (!ok) {
          if (status) {
            status.className = 'form-status is-err';
            status.textContent = window.SSI18n.t('form.error');
          }
          return;
        }

        var endpoint = form.getAttribute('data-endpoint');
        var data = new FormData(form);

        if (endpoint) {
          if (submit) { submit.disabled = true; submit.textContent = window.SSI18n.t('form.sending'); }
          fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('bad status'); return r; })
            .then(function () {
              form.reset();
              if (status) {
                status.className = 'form-status is-ok';
                status.textContent = window.SSI18n.t(form.getAttribute('data-ok-key') || 'form.success');
              }
            })
            .catch(function () {
              if (status) {
                status.className = 'form-status is-err';
                status.textContent = window.SSI18n.t('form.error');
              }
            })
            .finally(function () {
              if (submit) { submit.disabled = false; submit.textContent = window.SSI18n.t(submit.getAttribute('data-i18n') || 'form.send'); }
            });
          return;
        }

        // Fallback: compose an email the visitor can send.
        var lines = [];
        data.forEach(function (v, k) {
          if (k.indexOf('_') === 0 || !String(v).trim()) return;
          lines.push(k.replace(/_/g, ' ') + ': ' + v);
        });
        var subject = form.getAttribute('data-subject') || 'Summer Sail enquiry';
        window.location.href = 'mailto:info@summer-sail.com' +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));

        if (status) {
          status.className = 'form-status is-ok';
          status.textContent = window.SSI18n.t(form.getAttribute('data-ok-key') || 'form.success');
        }
      });
    });
  }

  /* ----------------------------------------------------------- to top -- */
  function toTop() {
    var btn = d.querySelector('.to-top');
    if (!btn) return;
    var ticking = false;
    function update() {
      btn.classList.toggle('is-visible', window.scrollY > 700);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------- overlay header -- */
  /* Pages that open with a full-bleed hero let the header float over it,
     transparent, until the first scroll. */
  function overlayHeader() {
    var topbar = d.querySelector('.topbar');
    var header = d.querySelector('.site-header');
    if (!header) return;

    // Publish the real height of the fixed chrome so the hero can slide
    // under it by exactly the right amount at any breakpoint.
    function measure() {
      var h = (topbar ? topbar.offsetHeight : 0) + header.offsetHeight;
      d.documentElement.style.setProperty('--chrome-h', h + 'px');
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);

    if (d.querySelector('.hero, .page-hero')) {
      d.body.classList.add('has-overlay-hero');
    }
  }

  /* ---------------------------------------------------------- helpers -- */
  function misc() {
    // Current year in the footer
    d.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
    // Date inputs cannot be in the past
    d.querySelectorAll('input[type="date"]').forEach(function (el) {
      if (!el.min) el.min = new Date().toISOString().split('T')[0];
    });
    // Tables that overflow get a visible hint
    d.querySelectorAll('.table-wrap').forEach(function (w) {
      var hint = w.parentElement.querySelector('.table-scroll-hint');
      if (hint) hint.style.display = w.scrollWidth > w.clientWidth ? '' : 'none';
    });
  }

  /* -------------------------------------------------------------- boot -- */
  function boot() {
    if (window.SSI18n) window.SSI18n.init();
    overlayHeader();
    stickyHeader();
    mobileNav();
    reveal();
    countUp();
    lightbox();
    heroVideo();
    forms();
    toTop();
    misc();
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
