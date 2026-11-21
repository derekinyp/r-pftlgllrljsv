/* 綜覽頁：首屏卡、燈號短名、基準尺說明皆由 ISSUES／LATEST_BRIEF／SITE_COPY 推導。 */
(function () {
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function latest() {
    var list = window.SB_ISSUES || [];
    return list[0] || null;
  }
  function brief() {
    return window.LATEST_BRIEF || null;
  }
  function copy() {
    return window.SITE_COPY || {};
  }

  /* 形狀各自帶燈號色，文字與現行字串逐字相同（KPI-MARKS.md / 規範 1.2.1）。 */
  function kpiMarks(counts) {
    var items = [['ok', '●', '符合 ', counts.g], ['up', '▲', '超越 ', counts.b], ['off', '◆', '偏離 ', counts.r]];
    var frag = document.createDocumentFragment();
    items.forEach(function (it, i) {
      if (i) { var sep = document.createElement('span'); sep.className = 'zd-kpi-mark__sep'; sep.textContent = '・'; frag.appendChild(sep); }
      var m = document.createElement('span'); m.className = 'zd-kpi-mark zd-kpi-mark--' + it[0];
      var sh = document.createElement('span'); sh.className = 'zd-kpi-mark__shape'; sh.setAttribute('aria-hidden', 'true'); sh.textContent = it[1];
      m.appendChild(sh); m.appendChild(document.createTextNode(' ' + it[2] + it[3])); frag.appendChild(m);
    });
    return frag;
  }

  function renderKpi() {
    var host = document.getElementById('o-kpi');
    if (!host) return;
    var iss = latest();
    var data = brief();
    var C = copy();
    host.innerHTML = '';
    var ruler = C.kpiRulerLabel ? C.kpiRulerLabel(iss && iss.id) : { v: '判定尺', l: '' };
    var card1 = el('div');
    card1.appendChild(el('div', 'v', ruler.v));
    card1.appendChild(el('div', 'l', ruler.l));
    host.appendChild(card1);

    var card2 = el('div');
    if (iss) {
      card2.appendChild(el('div', 'v', iss.id));
      card2.appendChild(el('div', 'l', '最新一期　' + (iss.span || '')));
    } else {
      card2.appendChild(el('div', 'v', '—'));
      card2.appendChild(el('div', 'l', '尚無已刊期數'));
    }
    host.appendChild(card2);

    var layers = (data && data.layers) || [];
    var counts = { g: 0, b: 0, r: 0, a: 0, n: 0 };
    var redNames = [];
    for (var i = 0; i < layers.length; i++) {
      var t = layers[i].tone || 'n';
      if (counts[t] == null) counts[t] = 0;
      counts[t]++;
      if (t === 'r') redNames.push(layers[i].name || layers[i].id);
    }
    var card3 = el('div');
    if (data && iss && data.issueId === iss.id && layers.length) {
      var v = el('div', 'v', ''); v.appendChild(kpiMarks(counts)); card3.appendChild(v);
      var extra = [];
      if (counts.a) extra.push('觀察 ' + counts.a);
      if (counts.n) extra.push('不判 ' + counts.n);
      card3.appendChild(el('div', 'l', iss.id + '　' + layers.length + ' 列' + (extra.length ? '（另 ' + extra.join('、') + '）' : '')));
    } else {
      card3.appendChild(el('div', 'v', '—'));
      card3.appendChild(el('div', 'l', '記分卡尚未同步'));
    }
    host.appendChild(card3);

    var card4 = el('div');
    if (redNames.length) {
      card4.appendChild(el('div', 'v', '本期偏離'));
      card4.appendChild(el('div', 'l', '偏離層：' + redNames.join('、')));
    } else if (layers.length) {
      card4.appendChild(el('div', 'v', '本期無偏離'));
      card4.appendChild(el('div', 'l', '沒有判為偏離的層'));
    } else {
      card4.appendChild(el('div', 'v', '—'));
      card4.appendChild(el('div', 'l', '本期偏離層見記分卡'));
    }
    host.appendChild(card4);

    var compact = document.getElementById('o-kpi-compact');
    if (compact) {
      var bits = [];
      if (iss) bits.push(iss.id);
      bits.push(ruler.v);
      if (data && iss && data.issueId === iss.id && layers.length) {
        bits.push(kpiMarks(counts));
        if (redNames.length) bits.push('偏離：' + redNames.join('、'));
      }
      compact.textContent = '';
      bits.forEach(function (p, i) {
        if (i) compact.appendChild(document.createTextNode('　'));
        compact.appendChild(typeof p === 'string' ? document.createTextNode(p) : p);
      });
    }
  }

  function renderScaleNote() {
    var p = document.getElementById('o-scale-note');
    if (!p || !copy().scaleNote) return;
    var iss = latest();
    p.textContent = copy().scaleNote(iss && iss.id);
  }

  function shortenLights() {
    var C = copy();
    var tds = document.querySelectorAll('#lights td, #scorecard td.g, #scorecard td.b, #scorecard td.r, #scorecard td.a, #scorecard td.n');
    for (var i = 0; i < tds.length; i++) {
      var td = tds[i];
      var raw = (td.textContent || '').trim();
      if (!raw) continue;
      var short = C.verdictShortFromClass ? C.verdictShortFromClass(td.className) : null;
      if (!short) continue;
      if (raw !== short) {
        td.setAttribute('title', raw);
        td.textContent = short;
      }
    }
  }

  function init() {
    renderKpi();
    renderScaleNote();
    shortenLights();
    if (copy().fillL2Notes) copy().fillL2Notes();
    if (copy().fillL2VerdictNotes) {
      var iss2 = latest();
      var data2 = brief();
      copy().fillL2VerdictNotes((data2 && data2.issueId) || (iss2 && iss2.id));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
