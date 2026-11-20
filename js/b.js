(function () {
  function latest() { return (window.SB_ISSUES || [])[0] || null; }
  function brief() { return window.LATEST_BRIEF || null; }
  function copy() { return window.SITE_COPY || {}; }

  function fillNote() {
    var p = document.getElementById('b-scale-note');
    if (!p || !copy().scaleNote) return;
    var iss = latest();
    p.textContent = copy().scaleNote(iss && iss.id);
  }
  function fillLights() {
    var iss = latest();
    var data = brief();
    var C = copy();
    var href = iss && iss.href ? iss.href : 'index.html#weeks';
    var map = {};
    if (data && data.layers) {
      for (var i = 0; i < data.layers.length; i++) {
        map[data.layers[i].id] = data.layers[i];
      }
    }
    var cells = document.querySelectorAll('#b-quick td[data-layer]');
    for (var j = 0; j < cells.length; j++) {
      var id = cells[j].getAttribute('data-layer');
      var L = map[id];
      cells[j].innerHTML = '';
      if (!L) {
        cells[j].textContent = '—';
        continue;
      }
      var short = C.verdictShort ? C.verdictShort(L.tone, L.verdict) : (L.verdict || '不判');
      var a = document.createElement('a');
      a.className = 'in';
      a.href = href;
      a.textContent = short;
      if (iss) a.setAttribute('title', '見 ' + iss.id + (L.verdict && L.verdict !== short ? '（原文：' + L.verdict + '）' : ''));
      cells[j].appendChild(a);
    }
  }
  function init() {
    fillNote();
    fillLights();
    if (copy().fillL2Notes) copy().fillL2Notes();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
