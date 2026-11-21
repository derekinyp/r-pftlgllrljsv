/* 一頁圖解第一屏：本期三句話、八層現況、判定尺與 L2 說明。
   數字與判定只從 LATEST_BRIEF、SB_ISSUES、SITE_COPY 帶出，不在此檔寫死本期內容。
   缺資料時寫「缺」。不表態多空。 */
(function () {
  var TONE_SIGNAL = { g: 'ok', b: 'up', r: 'off', a: 'watch', n: 'na' };
  var TONE_MARK = { g: '●', b: '▲', r: '◆', a: '◐', n: '○' };
  var TONE_LABEL = { g: '符合', b: '超越', r: '偏離', a: '觀察', n: '不判' };

  function issues() {
    return window.SB_ISSUES || [];
  }
  function brief() {
    return window.LATEST_BRIEF || null;
  }
  function copy() {
    return window.SITE_COPY || null;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function miss(host, msg) {
    if (!host) return;
    host.textContent = msg || '缺';
  }

  function renderMeta() {
    var latest = issues()[0];
    var data = brief();
    var C = copy();
    var issueA = document.getElementById('now-issue');
    var spanEl = document.getElementById('now-span');
    var rulerEl = document.getElementById('now-ruler');
    if (issueA) {
      if (latest && latest.href) {
        issueA.href = latest.href;
        issueA.textContent = latest.id || '缺';
      } else {
        issueA.removeAttribute('href');
        issueA.textContent = '缺';
      }
    }
    if (spanEl) spanEl.textContent = (latest && latest.span) ? latest.span : '缺';
    if (rulerEl) {
      var id = (data && data.issueId) || (latest && latest.id);
      if (C && C.scaleNote && id) {
        rulerEl.textContent = C.scaleNote(id);
      } else if (C && C.CURRENT_RULER) {
        rulerEl.textContent = '判定尺 ' + C.CURRENT_RULER;
      } else {
        rulerEl.textContent = '缺';
      }
    }
  }

  function renderPoints() {
    var host = document.getElementById('now-points');
    var hl = document.getElementById('now-headline');
    if (!host) return;
    var latest = issues()[0];
    var data = brief();
    host.innerHTML = '';
    if (!data || !latest || data.issueId !== latest.id) {
      if (hl) miss(hl, '缺');
      var li = el('li', 'now-miss', '缺');
      host.appendChild(li);
      return;
    }
    if (hl) hl.textContent = data.headline || '缺';
    var points = data.points || [];
    if (!points.length) {
      host.appendChild(el('li', 'now-miss', '缺'));
      return;
    }
    for (var i = 0; i < points.length; i++) {
      var pt = points[i];
      var item = el('li');
      var kind = pt.kind || '事實';
      var badgeCls = 'zd-kind' + (kind === '推論' ? ' zd-kind--inference' : '');
      item.appendChild(el('span', badgeCls, kind));
      item.appendChild(document.createTextNode(' ' + (pt.text || '缺')));
      host.appendChild(item);
    }
  }

  function signalClass(tone) {
    return TONE_SIGNAL[tone] || 'na';
  }

  function shortVerdict(L) {
    var C = copy();
    if (C && C.verdictShort) return C.verdictShort(L.tone, L.verdict);
    return TONE_LABEL[L.tone] || '不判';
  }

  function renderLayerRow(L) {
    var tone = L.tone || 'n';
    var item = el('li', 'now-row');
    item.appendChild(el('span', 'now-row__name', L.name || L.id || '缺'));
    var mark = el('span', 'zd-kpi-mark zd-kpi-mark--' + signalClass(tone));
    var shape = el('span', 'zd-kpi-mark__shape', TONE_MARK[tone] || '○');
    shape.setAttribute('aria-hidden', 'true');
    mark.appendChild(shape);
    var shortV = shortVerdict(L);
    mark.appendChild(document.createTextNode(' ' + shortV));
    if (L.verdict && L.verdict !== shortV) mark.title = L.verdict;
    item.appendChild(mark);
    if (L.summary) {
      var sum = el('span', 'now-row__sum', L.summary);
      item.appendChild(sum);
    }
    return item;
  }

  function renderLayers() {
    var host = document.getElementById('now-layers');
    var exoHost = document.getElementById('now-exo');
    if (!host) return;
    var latest = issues()[0];
    var data = brief();
    host.innerHTML = '';
    if (exoHost) exoHost.innerHTML = '';
    if (!data || !data.layers || !data.layers.length || (latest && data.issueId !== latest.id)) {
      host.appendChild(el('li', 'now-miss', '缺'));
      return;
    }
    var exoCount = 0;
    for (var i = 0; i < data.layers.length; i++) {
      var L = data.layers[i];
      var row = renderLayerRow(L);
      if (L.group === 'exo') {
        if (exoHost) {
          exoHost.appendChild(row);
          exoCount++;
        }
      } else {
        host.appendChild(row);
      }
    }
    var exoWrap = document.getElementById('now-exo-wrap');
    if (exoWrap) exoWrap.hidden = !exoCount;
  }

  function init() {
    renderMeta();
    renderPoints();
    renderLayers();
    var C = copy();
    if (C && C.fillL2Notes) C.fillL2Notes();
    if (C && C.fillLatestHrefs) C.fillLatestHrefs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
