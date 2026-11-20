/* 出刊步驟：在下方 ISSUES 陣列「最前面」新增一筆（最新期在上）。
   欄位：id＝期數鍵（如 2026-W48）、year＝年度、href＝中性檔名（如 2026-w48.html）、span＝期間。
   選單以年度 optgroup 分組，選項顯示「2026-W48　期間」，倒序。
   「最新週報」連結由 ISSUES[0] 推導，不必改各頁導覽列。
   下拉預設為不可選的「選擇期數…」，任一期（含最新）一選就跳轉。
   試跑版（例如「2026-W47 試跑（截止 2026-11-19）」）不得寫入本清單，也不得佔用正式檔名。
   說明見 skill references/deliverables.md「出刊步驟」。
   歷史期數鍵 2026-W39～2026-W47 沿用既有 W 編號，不依覆蓋期間重編 ISO 週；詳見 deliverables「期數鍵與 ISO 週」。 */
(function () {
  var ISSUES = [
    { id: '2026-W47', year: 2026, href: '2026-w47.html', span: '2026-11-11～11-16' },
    { id: '2026-W46', year: 2026, href: '2026-w46.html', span: '2026-11-04～11-10' },
    { id: '2026-W45', year: 2026, href: '2026-w45.html', span: '2026-10-31～11-06' },
    { id: '2026-W44', year: 2026, href: '2026-w44.html', span: '2026-10-20～10-30' },
    { id: '2026-W43', year: 2026, href: '2026-w43.html', span: '2026-10-13～10-19' },
    { id: '2026-W42', year: 2026, href: '2026-w42.html', span: '2026-10-06～10-12' },
    { id: '2026-W41', year: 2026, href: '2026-w41.html', span: '2026-09-29～10-05' },
    { id: '2026-W40', year: 2026, href: '2026-w40.html', span: '2026-09-22～09-28' },
    { id: '2026-W39', year: 2026, href: '2026-w39.html', span: '2026-09-15～09-21' }
  ];

  function currentFile() {
    var p = (location.pathname || '').split('/').pop() || 'index.html';
    return p;
  }

  function render() {
    var host = document.getElementById('sb-issues');
    if (!host) return;
    var cur = currentFile();
    var latest = ISSUES[0];
    var wrap = document.createElement('span');
    wrap.className = 'sb-week';
    if (latest) {
      var latestA = document.createElement('a');
      latestA.className = 'sb-latest';
      latestA.href = latest.href;
      latestA.textContent = '最新週報';
      if (latest.href === cur) latestA.className += ' sb-on';
      wrap.appendChild(latestA);
    }
    var lab = document.createElement('label');
    lab.className = 'sb-week-lab';
    lab.setAttribute('for', 'sb-week-sel');
    var sel = document.createElement('select');
    sel.id = 'sb-week-sel';
    sel.setAttribute('aria-label', '選擇週報期數');
    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = '選擇期數…';
    ph.disabled = true;
    ph.selected = true;
    sel.appendChild(ph);
    var lastYear = null;
    var og = null;
    for (var j = 0; j < ISSUES.length; j++) {
      var it = ISSUES[j];
      if (it.year !== lastYear) {
        og = document.createElement('optgroup');
        og.label = String(it.year);
        sel.appendChild(og);
        lastYear = it.year;
      }
      var o = document.createElement('option');
      o.value = it.href;
      o.textContent = it.id + '　' + it.span;
      og.appendChild(o);
    }
    sel.addEventListener('change', function () {
      if (sel.value && sel.value !== currentFile()) location.href = sel.value;
    });
    lab.appendChild(sel);
    wrap.appendChild(lab);
    host.innerHTML = '';
    host.appendChild(wrap);
  }

  window.SB_ISSUES = ISSUES;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
