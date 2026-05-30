/* Coming soon — genera particelle (stelle) + archi orbitali nello SVG #field.
   Inline non e' consentito dalla CSP del sito (script-src 'self'), quindi sta qui. */
(function () {
  var field = document.getElementById('field');
  if (!field) return;
  var cx = 800, cy = 450;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 720px)').matches;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // 3 archi orbitali (ellissi sottili rosse)
  var arcs = [[300, 0.32], [360, 0.18], [240, 0.24]];
  arcs.forEach(function (a) {
    var el = document.createElementNS(SVG_NS, 'ellipse');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy);
    el.setAttribute('rx', a[0]); el.setAttribute('ry', a[0] * 0.85);
    el.setAttribute('class', 'arc');
    el.setAttribute('stroke-opacity', a[1]);
    field.appendChild(el);
  });

  function rnd(min, max) { return min + Math.random() * (max - min); }
  function rndInt(min, max) { return Math.floor(rnd(min, max + 1)); }

  var ringN = isMobile ? 120 : 260;
  var cloudN = isMobile ? 180 : 380;

  function makeDot(x, y, r, color, opacity) {
    var c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', x.toFixed(1));
    c.setAttribute('cy', y.toFixed(1));
    c.setAttribute('r', r.toFixed(2));
    c.setAttribute('fill', color);
    c.setAttribute('opacity', opacity);
    if (!reduced) {
      c.style.setProperty('--tx', rnd(-14, 14).toFixed(1) + 'px');
      c.style.setProperty('--ty', rnd(-14, 14).toFixed(1) + 'px');
      c.style.setProperty('--d', rnd(6, 14).toFixed(1) + 's');
      c.style.setProperty('--dl', (-rnd(0, 14)).toFixed(1) + 's');
      c.style.setProperty('--o', opacity);
    }
    field.appendChild(c);
  }

  // Anello stretto attorno al globo
  for (var i = 0; i < ringN; i++) {
    var ang = Math.random() * Math.PI * 2;
    var r = rnd(240, 320);
    var x = cx + r * Math.cos(ang);
    var y = cy + r * Math.sin(ang) * 0.88;
    var size = [1.0, 1.2, 1.4, 1.6, 2.0, 2.6, 3.2][rndInt(0, 6)];
    var roll = Math.random();
    var col = roll < 0.08 ? '#C41E3A' : (roll < 0.78 ? '#F5F1E8' : '#a9b4c2');
    makeDot(x, y, size, col, rnd(0.55, 1.00).toFixed(2));
  }
  // Nuvola esterna sparsa
  for (var j = 0; j < cloudN; j++) {
    var ang2 = Math.random() * Math.PI * 2;
    var r2 = rnd(340, 800);
    var x2 = cx + r2 * Math.cos(ang2);
    var y2 = cy + r2 * Math.sin(ang2) * 0.6 + rnd(-40, 40);
    var size2 = [0.8, 1.1, 1.4, 1.7][rndInt(0, 3)];
    var col2 = Math.random() < 0.78 ? '#F5F1E8' : '#a9b4c2';
    makeDot(x2, y2, size2, col2, rnd(0.30, 0.80).toFixed(2));
  }
})();
