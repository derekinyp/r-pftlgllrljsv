(function () {
  function latest() { return (window.SB_ISSUES || [])[0] || null; }
  function brief() { return window.LATEST_BRIEF || null; }
  function copy() { return window.SITE_COPY || {}; }

  var SHAPE = { g: '●', b: '▲', r: '◆', a: '◐', n: '○' };

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
    var col = document.getElementById('b-light-col');
    var scale = (iss && C.usesV2 && C.usesV2(iss.id)) ? (C.CURRENT_RULER || 'v2.1') : 'v1.1';
    var header = iss ? (iss.id + ' 燈號（依 ' + scale + '）') : '本期燈號';
    if (col) col.textContent = header;
    var map = {};
    if (data && data.layers) {
      for (var i = 0; i < data.layers.length; i++) {
        map[data.layers[i].id] = data.layers[i];
      }
    }
    var cells = document.querySelectorAll('#b-quick td[data-layer]');
    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];
      var id = cell.getAttribute('data-layer');
      var L = map[id];
      cell.setAttribute('data-label', header);
      var orig = cell.querySelector('.b-hist');
      if (orig && orig.parentNode) orig.parentNode.removeChild(orig);
      cell.innerHTML = '';
      if (!L) {
        cell.appendChild(document.createTextNode('—'));
      } else {
        var tone = L.tone || 'n';
        var short = C.verdictShort ? C.verdictShort(L.tone, L.verdict) : (L.verdict || '不判');
        var a = document.createElement('a');
        a.className = tone;
        a.href = href;
        var sh = document.createElement('span');
        sh.className = 'shape';
        sh.setAttribute('aria-hidden', 'true');
        sh.textContent = SHAPE[tone] || '○';
        a.appendChild(sh);
        a.appendChild(document.createTextNode(short));
        if (iss) a.setAttribute('title', '見 ' + iss.id + (L.verdict && L.verdict !== short ? '（原文：' + L.verdict + '）' : ''));
        cell.appendChild(a);
      }
      if (orig) cell.appendChild(orig);
    }
  }
  function init() {
    fillNote();
    fillLights();
    if (copy().fillL2Notes) copy().fillL2Notes();
    if (copy().fillL2VerdictNotes) {
      var iss = latest();
      var data = brief();
      copy().fillL2VerdictNotes((data && data.issueId) || (iss && iss.id));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
