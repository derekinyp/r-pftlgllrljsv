/* 首頁：最新期重點、八層判定與期數時間軸皆由 ISSUES／LATEST_BRIEF 推導。 */
(function () {
  var TONE_LABEL = { g: '符合', b: '超越', r: '偏離', a: '觀察', n: '不判' };

  function issues() {
    return window.SB_ISSUES || [];
  }
  function brief() {
    return window.LATEST_BRIEF || null;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderHero() {
    var host = document.getElementById('hero-latest');
    if (!host) return;
    var list = issues();
    var latest = list[0];
    var data = brief();
    host.innerHTML = '';
    if (!latest) {
      host.appendChild(el('p', 'hero-miss', '尚無已刊期數。'));
      return;
    }
    var kicker = el('p', 'hero-kicker', latest.id + '　' + latest.span);
    host.appendChild(kicker);
    var synced = data && data.issueId === latest.id;
    if (synced && data.headline) {
      host.appendChild(el('h2', 'hero-hl', data.headline));
    } else {
      host.appendChild(el('p', 'hero-miss', '重點資料尚未同步至最新一期，請先打開週報原文。'));
    }
    if (synced && data.points && data.points.length) {
      var ul = el('ul', 'hero-points');
      for (var i = 0; i < data.points.length; i++) {
        var pt = data.points[i];
        var li = el('li');
        var badge = el('span', 'kind kind-' + (pt.kind === '推論' ? 'inf' : pt.kind === '假設' ? 'hyp' : 'fact'), pt.kind || '事實');
        li.appendChild(badge);
        li.appendChild(document.createTextNode(' ' + (pt.text || '')));
        ul.appendChild(li);
      }
      host.appendChild(ul);
    }
    var actions = el('div', 'hero-actions');
    var primary = el('a', 'btn-primary', '最新週報');
    primary.href = latest.href;
    actions.appendChild(primary);
    var secondary = el('a', 'btn-ghost', '各期列表');
    secondary.href = '#weeks';
    actions.appendChild(secondary);
    host.appendChild(actions);
  }

  function renderChain() {
    var host = document.getElementById('chain-list');
    var exo = document.getElementById('chain-exo');
    var meta = document.getElementById('chain-meta');
    if (!host) return;
    var list = issues();
    var latest = list[0];
    var data = brief();
    host.innerHTML = '';
    if (exo) exo.innerHTML = '';
    if (meta) {
      var scale = (window.SITE_COPY && window.SITE_COPY.scaleNote) ? window.SITE_COPY.scaleNote(latest && latest.id) : '';
      if (latest && data && data.issueId === latest.id) {
        meta.textContent = (scale ? scale + ' ' : '') + '判定取自 ' + latest.id + ' 已刊記分卡，不回溯改判。';
      } else if (latest) {
        meta.textContent = '各層摘要尚未同步至 ' + latest.id + '。';
      }
    }
    if (!data || !data.layers || (latest && data.issueId !== latest.id)) return;
    function baselineHref(id) {
      var map = { rate: 'RATE', reg: 'CTRL', ref: 'REFL' };
      return 'b.html#' + (map[id] || id);
    }
    for (var i = 0; i < data.layers.length; i++) {
      var L = data.layers[i];
      var item = el('li', 'layer tone-' + (L.tone || 'n'));
      var top = el('div', 'layer-top');
      var left = el('span', 'layer-idline');
      left.appendChild(el('span', 'layer-name', L.name));
      if (L.id) {
        var a = el('a', 'b-link', '基準');
        a.href = baselineHref(L.id);
        a.setAttribute('aria-label', L.name + '的現行基準');
        left.appendChild(a);
      }
      if (L.id === 'L2') {
        var note = el('span', 'l2-note');
        note.setAttribute('data-l2-note', '');
        note.textContent = (window.SITE_COPY && window.SITE_COPY.L2_RECON_NOTE) || '';
        left.appendChild(note);
      }
      top.appendChild(left);
      var shortV = (window.SITE_COPY && window.SITE_COPY.verdictShort)
        ? window.SITE_COPY.verdictShort(L.tone, L.verdict)
        : (TONE_LABEL[L.tone] || '不判');
      var pill = el('span', 'verdict', shortV);
      if (L.verdict && L.verdict !== shortV) pill.title = L.verdict;
      top.appendChild(pill);
      item.appendChild(top);
      item.appendChild(el('p', 'layer-sum', L.summary || ''));
      if (L.group === 'exo') {
        if (exo) exo.appendChild(item);
      } else {
        host.appendChild(item);
      }
    }
  }

  function renderEntries() {
    var latestA = document.querySelectorAll('[data-latest-href]');
    var latest = issues()[0];
    if (!latest) return;
    for (var i = 0; i < latestA.length; i++) {
      latestA[i].href = latest.href;
    }
  }

  function renderTimeline() {
    var host = document.getElementById('week-timeline');
    if (!host) return;
    var list = issues();
    var notes = (brief() && brief().issueNotes) || {};
    host.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var li = el('li', i === 0 ? 'tl-item is-latest' : 'tl-item');
      var a = el('a', 'tl-card');
      a.href = it.href;
      var hd = el('div', 'tl-hd');
      hd.appendChild(el('strong', '', it.id));
      hd.appendChild(el('span', 'tl-span', it.span));
      if (i === 0) hd.appendChild(el('span', 'tl-flag', '最新'));
      a.appendChild(hd);
      if (notes[it.id]) a.appendChild(el('p', '', notes[it.id]));
      li.appendChild(a);
      host.appendChild(li);
    }
  }

  function init() {
    renderHero();
    renderChain();
    renderEntries();
    renderTimeline();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
