/* Local vanilla heatmap for o.html. No external libraries. */
(function () {
  function $(id) { return document.getElementById(id); }
  function clip(v, a) { return Math.max(-a, Math.min(a, v)); }
  function mix(c1, c2, t) {
    var o = [];
    for (var i = 0; i < 3; i++) o[i] = Math.round(c1[i] + (c2[i] - c1[i]) * t);
    return "rgb(" + o.join(",") + ")";
  }
  // Distinct from judgment green/blue/red lights.
  /* 雙色與判定燈（綠／藍／紅／橘）區隔：低＝灰青，高＝紫。顏色在 ±2 封頂，格子數字照實顯示。 */
  var LO = [46, 120, 128], MID = [244, 241, 234], HI = [112, 72, 160];
  function colorFor(v) {
    if (v == null || isNaN(v)) return null;
    var t = clip(v, 2) / 2;
    if (t < 0) return mix(MID, LO, -t);
    return mix(MID, HI, t);
  }
  function cellLabel(flag, v) {
    if (flag === "缺") return "缺";
    if (flag === "暫定") return "暫定";
    if (flag === "不立尺") return "無尺";
    if (v == null) return flag || "缺";
    var n = Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
    return n;
  }
  function cellTitle(month, layer, v, flag, warn) {
    var bits = [month, layer];
    if (flag) bits.push(flag);
    if (v != null && !isNaN(v)) bits.push("分數 " + v.toFixed(2));
    if (warn) bits.push("矛盾");
    return bits.join(" · ");
  }

  function render() {
    var data = window.HEATMAP;
    var root = $("hm-root");
    if (!data || !root) return;
    var months = data.months || [];
    var layers = data.layers || [];
    var html = [];
    html.push('<div class="hm-legend">');
    html.push('<span class="hm-scale"><span>低於基準</span><span class="hm-ramp" title="灰青＝低於基準，紫＝高於基準；不是判定燈號"><i></i><i></i><i></i><i></i><i></i></span><span>高於基準</span></span>');
    html.push('<span class="hm-chip">缺</span><span class="hm-chip">沿用（底線）</span><span class="hm-chip">部分</span><span class="hm-chip">暫定</span><span class="hm-chip">不立尺</span><span class="hm-chip">矛盾（點）</span>');
    html.push('<span class="hm-keyhint">點列展開指標。時間軸可左右滑動，層名欄固定。顏色在 ±2 封頂，數字照實顯示；紫／灰青不是判定燈號。z＝和過去兩年平均相比，差幾個標準差。</span>');
    var emptyIdx = [];
    for (var er = 0; er < layers.length; er++) {
      var eL = layers[er];
      var empty = true;
      for (var ec = 0; ec < (eL.flags || []).length; ec++) {
        var ef = eL.flags[ec];
        var ev = eL.scores && eL.scores[ec];
        if (ef !== '缺' && ef !== '暫定' && ef !== '不立尺') { empty = false; break; }
        if (ev != null && !isNaN(ev)) { empty = false; break; }
      }
      if (empty) emptyIdx.push(er);
    }
    html.push('<button type="button" class="hm-empty-btn" id="hm-empty-btn">無資料的層（' + emptyIdx.length + '）</button>');
    html.push('</div>');
    html.push('<div class="hm-scroll"><table class="hm-grid" role="grid">');
    html.push('<thead><tr><th class="hm-lab">層</th>');
    for (var i = 0; i < months.length; i++) {
      var lab = months[i].slice(2).replace("-", "/");
      html.push('<th>' + lab + '</th>');
    }
    html.push('</tr></thead><tbody>');
    for (var r = 0; r < layers.length; r++) {
      var L = layers[r];
      html.push('<tr class="hm-layer' + (emptyIdx.indexOf(r) >= 0 ? ' is-empty' : '') + '" data-row="' + r + '" tabindex="0" role="button" aria-expanded="false">');
      var labNote = '';
        if (L.id === 'L1') labNote = '<div class="hm-labnote">分數高時，當時尺未另列超越門檻，燈號仍可能為符合。熱力圖不是判定。</div>';
        html.push('<th scope="row" class="hm-lab" title="' + L.name + '">' + L.name + labNote + '</th>');
      for (var c = 0; c < months.length; c++) {
        var v = L.scores[c];
        var flag = L.flags[c];
        var warn = L.warn && L.warn[c];
        var cls = "hm-cell";
        var bg = colorFor(v);
        if (flag === "缺") cls += " hm-miss";
        else if (flag === "暫定") cls += " hm-hold";
        else if (flag === "不立尺") cls += " hm-noruler";
        if (flag === "沿用") cls += " hm-carry";
        if (flag === "部分") cls += " hm-part";
        var style = bg ? ' style="background:' + bg + '"' : "";
        html.push('<td class="' + cls + '"' + style + ' title="' + cellTitle(months[c], L.name, v, flag, warn) + '">');
        html.push('<span class="m">' + cellLabel(flag, v) + "</span>");
        if (warn) html.push('<span class="hm-warn" title="矛盾"></span>');
        html.push("</td>");
      }
      html.push("</tr>");
    }
    html.push("</tbody></table></div>");
    html.push('<div class="hm-detail" id="hm-detail" hidden></div>');
    root.innerHTML = html.join("");

    var asof = $("hm-asof");
    if (asof) {
      asof.textContent = "資料截止 " + data.asof + "（" + data.timezone + "）。尺：" + (data.ruler || "") + "。" + (data.scale && data.scale.label ? data.scale.label + "。" : "") + " z＝和過去兩年平均相比，差幾個標準差。";
    }
    var grid = root.querySelector(".hm-grid");
    var emptyBtn = $("hm-empty-btn");
    var hideEmpty = true;
    function applyEmpty() {
      if (grid) grid.classList.toggle("hide-empty", hideEmpty);
      if (emptyBtn) emptyBtn.textContent = hideEmpty
        ? ("顯示無資料的層（" + emptyIdx.length + "）")
        : ("收起無資料的層（" + emptyIdx.length + "）");
      if (emptyBtn) emptyBtn.setAttribute("aria-pressed", hideEmpty ? "true" : "false");
    }
    if (emptyBtn) {
      emptyBtn.addEventListener("click", function () { hideEmpty = !hideEmpty; applyEmpty(); });
    }
    applyEmpty();

    var open = -1;
    function detail(L) {
      var bits = [];
      bits.push("<h3>" + L.name + "</h3>");
      bits.push("<p>" + (L.dir_note || "") + "</p>");
      if (L.why) bits.push("<p>" + L.why + "</p>");
      if (L.indicators && L.indicators.length) {
        bits.push("<ul>");
        for (var i = 0; i < L.indicators.length; i++) {
          var ind = L.indicators[i];
          bits.push("<li><b>" + ind.name + "</b> — " + (ind.method || "") + "。來源：" + (ind.source || "") + "。" + (ind.why || "") + (ind.fuse === false ? "（不納入融合）" : "") + "</li>");
        }
        bits.push("</ul>");
      } else {
        bits.push("<p>本列沒有可量化的一手指標。</p>");
      }
      return bits.join("");
    }
    function paintInd(tbody, L, rowIdx) {
      var old = tbody.querySelectorAll(".hm-ind");
      for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
      var row = tbody.querySelectorAll(".hm-layer")[rowIdx];
      if (!L.indicators) return;
      var vis = L.indicators.slice().sort(function (a, b) {
        return (a.fuse === false) - (b.fuse === false);
      });
      var anchor = row;
      for (var k = vis.length - 1; k >= 0; k--) {
        var ind = vis[k];
        var tr = document.createElement("tr");
        tr.className = "hm-ind";
        var th = document.createElement("th");
        th.className = "hm-lab";
        th.textContent = ind.name;
        th.title = ind.name;
        tr.appendChild(th);
        for (var c = 0; c < months.length; c++) {
          var cell = (ind.values && ind.values[c]) || { v: null, flag: "缺" };
          var td = document.createElement("td");
          var flag = cell.flag || (cell.v == null ? "缺" : "實測");
          var v = cell.v;
          var cls = "hm-cell";
          var bg = colorFor(v);
          if (flag === "缺") cls += " hm-miss";
          else if (flag === "暫定") cls += " hm-hold";
          else if (flag === "不立尺") cls += " hm-noruler";
          if (flag === "沿用") cls += " hm-carry";
          if (flag === "部分") cls += " hm-part";
          td.className = cls;
          if (bg) td.style.background = bg;
          var shown = (v == null && (flag === "實測" || flag === "沿用") && cell.raw != null)
            ? String(cell.raw)
            : cellLabel(flag, v);
          td.innerHTML = '<span class="m">' + shown + "</span>";
          var tip = [months[c], ind.name, flag];
          if (cell.raw != null) tip.push("原始 " + cell.raw);
          if (v != null) tip.push("分數 " + Number(v).toFixed(2));
          if (cell.src) tip.push(cell.src);
          td.title = tip.join(" · ");
          tr.appendChild(td);
        }
        if (anchor.nextSibling) tbody.insertBefore(tr, anchor.nextSibling);
        else tbody.appendChild(tr);
      }
    }
    function toggle(idx) {
      var tbody = root.querySelector("tbody");
      var rows = tbody.querySelectorAll(".hm-layer");
      var box = $("hm-detail");
      if (open === idx) {
        rows[idx].classList.remove("hm-open");
        rows[idx].setAttribute("aria-expanded", "false");
        var leftover = tbody.querySelectorAll(".hm-ind");
        for (var i = 0; i < leftover.length; i++) leftover[i].parentNode.removeChild(leftover[i]);
        box.hidden = true;
        box.innerHTML = "";
        open = -1;
        return;
      }
      if (open >= 0) {
        rows[open].classList.remove("hm-open");
        rows[open].setAttribute("aria-expanded", "false");
      }
      open = idx;
      rows[idx].classList.add("hm-open");
      rows[idx].setAttribute("aria-expanded", "true");
      paintInd(tbody, layers[idx], idx);
      box.innerHTML = detail(layers[idx]);
      box.hidden = false;
    }
    var layerRows = root.querySelectorAll(".hm-layer");
    for (var r = 0; r < layerRows.length; r++) {
      (function (idx) {
        layerRows[idx].addEventListener("click", function () { toggle(idx); });
        layerRows[idx].addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            toggle(idx);
          }
        });
      })(r);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
