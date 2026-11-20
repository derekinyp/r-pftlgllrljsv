/* 全站共用顯示用文案與燈號短名。數字與判定仍以已刊週報／基準為準，本檔只負責顯示。
   L2_RECON_NOTE 是振達 2026-11-20 核准的顯示句，不改基準約 8,200 億或暫定狀態。 */
(function (w) {
  var COPY = {
    L2_RECON_NOTE: '四家已對帳約 7,300 億美元，Oracle 缺',
    /* 說明已刊 W47 為何判超越。6,400–7,750 與 78% 出自該期原文（標轉引）；
       7,590 是 v1.1「約 6,900 億、容忍 ±10%」的上緣（6,900×1.10），原文未寫出此數。 */
    L2_W47_BLUE_NOTE: 'W47 判超越依據：七大口徑 6,400–7,750 億美元、年增 78%（該期轉引）；對照 v1.1 上緣 7,590 億（6,900 億 × 1.10）',
    L2_W47_ISSUE: '2026-W47',
    CURRENT_RULER: 'v2.1',
    CURRENT_RULER_APPROVED: '2026-11-20',
    V2_EFFECTIVE_ISSUE: '2026-W48',
    VERDICT_LABEL: { g: '符合', b: '超越', r: '偏離', a: '觀察', n: '不判' }
  };

  function issueKey(id) {
    var m = String(id || '').match(/(\d{4})-W(\d+)/i);
    return m ? (+m[1]) * 100 + (+m[2]) : 0;
  }

  COPY.issueKey = issueKey;

  COPY.usesV2 = function (issueId) {
    return issueKey(issueId) >= issueKey(COPY.V2_EFFECTIVE_ISSUE);
  };

  COPY.scaleNote = function (latestId) {
    if (!latestId) return '';
    var ver = COPY.CURRENT_RULER;
    if (COPY.usesV2(latestId)) {
      return '本期燈號依 ' + ver + ' 判定（自 ' + COPY.V2_EFFECTIVE_ISSUE + ' 起適用）。';
    }
    return '本期燈號依 v1.1 判定（' + latestId + ' 及以前）；' + ver + ' 自 ' + COPY.V2_EFFECTIVE_ISSUE + ' 起適用。';
  };

  COPY.kpiRulerLabel = function (latestId) {
    var ver = COPY.CURRENT_RULER;
    if (COPY.usesV2(latestId)) {
      return { v: ver, l: '本期判定尺（' + COPY.V2_EFFECTIVE_ISSUE + ' 起適用）' };
    }
    return { v: 'v1.1 → ' + ver, l: '本期判定尺 v1.1；下期起 ' + ver };
  };

  COPY.rulerBanner = function () {
    return '現行判定尺為 ' + COPY.CURRENT_RULER + '（' + COPY.CURRENT_RULER_APPROVED + ' 核准），自 ' + COPY.V2_EFFECTIVE_ISSUE + ' 起適用。已刊 2026-W39 至 2026-W47 仍按當時尺判定，不回溯重判。L2 口徑數值為暫定，待一手對帳後再定案。';
  };

  COPY.fillRulerBanners = function () {
    var text = COPY.rulerBanner();
    var nodes = document.querySelectorAll('[data-ruler-banner]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = text;
  };

  /* 只改顯示短名，不改判定。原文放到 title。 */
  COPY.verdictShortFromClass = function (cls) {
    if (/\bg\b/.test(cls) || /(^| )g( |$)/.test(cls)) return '符合';
    if (/\bb\b/.test(cls) || /(^| )b( |$)/.test(cls)) return '超越';
    if (/\br\b/.test(cls) || /(^| )r( |$)/.test(cls)) return '偏離';
    if (/\ba\b/.test(cls) || /(^| )a( |$)/.test(cls)) return '觀察';
    if (/\bn\b/.test(cls) || /(^| )n( |$)/.test(cls)) return '不判';
    return null;
  };

  COPY.verdictShort = function (tone, raw) {
    if (tone && COPY.VERDICT_LABEL[tone]) return COPY.VERDICT_LABEL[tone];
    var s = String(raw || '');
    if (/超越/.test(s)) return '超越';
    if (/偏離/.test(s)) return '偏離';
    if (/符合/.test(s)) return '符合';
    if (/觀察/.test(s)) return '觀察';
    return '不判';
  };

  COPY.fillL2Notes = function () {
    var nodes = document.querySelectorAll('[data-l2-note]');
    for (var i = 0; i < nodes.length; i++) {
      var prefix = nodes[i].getAttribute('data-l2-prefix') || '';
      nodes[i].textContent = prefix + COPY.L2_RECON_NOTE;
    }
  };

  COPY.l2VerdictNote = function (issueId) {
    if (issueId === COPY.L2_W47_ISSUE) return COPY.L2_W47_BLUE_NOTE;
    return '';
  };

  COPY.fillL2VerdictNotes = function (issueId) {
    var text = COPY.l2VerdictNote(issueId);
    var nodes = document.querySelectorAll('[data-l2-verdict-note]');
    for (var i = 0; i < nodes.length; i++) {
      if (text) { nodes[i].textContent = text; nodes[i].hidden = false; }
      else { nodes[i].textContent = ''; nodes[i].hidden = true; }
    }
  };

  COPY.fillLatestHrefs = function () {
    var latest = (window.SB_ISSUES || [])[0];
    if (!latest || !latest.href) return;
    var nodes = document.querySelectorAll('[data-latest-href]');
    for (var i = 0; i < nodes.length; i++) nodes[i].href = latest.href;
  };

  w.SITE_COPY = COPY;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      COPY.fillL2Notes();
      COPY.fillRulerBanners();
      var latest = (window.SB_ISSUES || [])[0];
      var brief = window.LATEST_BRIEF || {};
      COPY.fillL2VerdictNotes((brief.issueId || (latest && latest.id)));
      COPY.fillLatestHrefs();
    });
  } else {
    COPY.fillL2Notes();
    COPY.fillRulerBanners();
    var latest = (window.SB_ISSUES || [])[0];
    var brief = window.LATEST_BRIEF || {};
    COPY.fillL2VerdictNotes((brief.issueId || (latest && latest.id)));
    COPY.fillLatestHrefs();
  }
})(window);
