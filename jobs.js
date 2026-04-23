(function () {
  'use strict';

  var list = document.getElementById('jobs-list');
  if (!list) return;

  var src = list.getAttribute('data-jobs-src') || 'jobs.json';
  var anchor = list.getAttribute('data-anchor') || '#candidati';
  var lang = (document.documentElement.lang || 'it').toLowerCase().slice(0, 2);
  if (lang !== 'it' && lang !== 'en') lang = 'it';

  fetch(src, { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (jobs) {
      if (!Array.isArray(jobs)) throw new Error('jobs.json must be an array');
      renderCards(jobs, lang, list, anchor);
      renderOptions(jobs, lang);
      wirePreselect();
    })
    .catch(function (err) {
      console.error('[jobs] load failed:', err);
    });

  function t(obj, lang) {
    if (!obj) return '';
    return obj[lang] || obj.it || obj.en || '';
  }

  function renderCards(jobs, lang, container, anchor) {
    var frag = document.createDocumentFragment();
    jobs.forEach(function (job) {
      var a = document.createElement('a');
      a.className = 'job';
      a.href = anchor;
      a.setAttribute('data-role', job.id);

      [
        ['job__role', t(job.title, lang)],
        ['job__meta', t(job.location, lang)],
        ['job__meta', t(job.type, lang)]
      ].forEach(function (pair) {
        var d = document.createElement('div');
        d.className = pair[0];
        d.textContent = pair[1];
        a.appendChild(d);
      });

      var arrow = document.createElement('span');
      arrow.className = 'job__arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      a.appendChild(arrow);

      frag.appendChild(a);
    });
    container.innerHTML = '';
    container.appendChild(frag);
  }

  function renderOptions(jobs, lang) {
    var sel = document.getElementById('c-role');
    if (!sel) return;
    var placeholder = sel.querySelector('option[value=""]');
    sel.innerHTML = '';
    if (placeholder) sel.appendChild(placeholder);
    jobs.forEach(function (job) {
      var opt = document.createElement('option');
      opt.value = job.id;
      opt.textContent = t(job.title, lang) || job.id;
      sel.appendChild(opt);
    });
  }

  function wirePreselect() {
    document.querySelectorAll('.job[data-role]').forEach(function (card) {
      card.addEventListener('click', function () {
        var role = card.getAttribute('data-role');
        var sel = document.getElementById('c-role');
        if (sel) sel.value = role;
      });
    });
  }
})();
