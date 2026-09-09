/* =============================================================
 * app.js — 启动引导：初始化地球 → 拉取真实数据 → 装配联动
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  function showFatal(msg) {
    var box = document.getElementById('fatal');
    if (!box) return;
    box.style.display = 'flex';
    box.querySelector('p').textContent = msg;
  }

  function boot() {
    // 1. 初始化 3D 地球
    var ok = false;
    try {
      ok = SA.globe.init({ container: document.getElementById('globe') });
    } catch (e) {
      ok = false;
      console.error(e);
    }
    if (!ok) {
      document.getElementById('globe').innerHTML =
        '<div class="fatal-inline">⚠ 3D 地球初始化失败<br><span>常见原因：浏览器未启用 WebGL，或 Three.js CDN 全部不可达。<br>请在地址栏访问 chrome://gpu 确认硬件加速已开启。</span></div>';
    }
    SA.globe.on('error', function (msg) { console.warn('[globe]', msg); });

    // 2. 初始化左侧面板（先渲染静态骨架，数据到达后自动刷新）
    SA.ui.init();

    // 3. 加载真实数据源
    SA.api.loadAll(function (st) { SA.ui.renderStatus(st); })
      .then(function (res) {
        SA.store.setItems(res.items, res.statuses);
        if (SA.globe.isReady()) {
          SA.globe.setClusters(SA.store.getClusters('all'));
          // 开场运镜：从远及近推到全球视角
          SA.globe.flyTo(38, 5, 2.95, 2000);
        }
        SA.ui.hideLoading();
        var st = SA.store.getStats();
        console.info('[Spirits Atlas] 载入 ' + st.total + ' 条数据，其中 ' + st.geo + ' 条可落点地球。');
        // 开场运镜：从远及近推到全球视角
        setTimeout(function () { SA.globe.flyTo(30, 10, 2.85, 1800); }, 400);
      })
      .catch(function (err) {
        console.error(err);
        SA.ui.hideLoading();
        showFatal('数据加载失败：' + (err && err.message ? err.message : err));
      });

    // 4. 窗口尺寸变化 + 移动端抽屉切换
    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { SA.globe.resize(); }, 120);
    });

    /* ============ 移动端（≤600px）：三档酒单 / 地图 ============
       心智模型：打开 = 刷酒为主，地图可随时让位/呼出。
       MAP(12%) 纯地图态(酒单只露一小条，随时可拉起)
       MIX(60%) 酒单+顶部留 40% 地球（默认）
       FULL(100%) 酒单全屏可刷
       手势：
       · 列表里上滑 = 逐级放大直到全屏；往下拖 = 缩小
       · 顶部把手：按住可上下拖（跟手），轻点 = MAP→MIX→FULL→MIX 循环
       · 全屏态把列表滚到顶再下拉 → 收起
    */
    var isMobile = function () { return window.innerWidth <= 600; };
    var panel = document.getElementById('panel');
    var handle = document.getElementById('mobileDrawerHandle');
    var listWrap = document.getElementById('listWrap');
    var MAP = 0.12, MIX = 0.60, FULL = 1.0;

    function sheetH() { return panel ? panel.getBoundingClientRect().height : 0; }
    function setSheet(px) { if (panel) panel.style.height = Math.round(px) + 'px'; }
    function applyFrac(frac) {
      var ih = window.innerHeight;
      if (panel) {
        panel.style.height = Math.round(ih * frac) + 'px';
        panel.classList.toggle('p-full', frac >= 0.98);
        panel.classList.toggle('p-map', frac <= 0.18);
      }
      return frac;
    }
    if (isMobile() && panel) {
      var cur = applyFrac(MIX);

      var drag = null;
      function beginDrag(y) {
        drag = { y0: y, h0: sheetH(), moved: 0, up: 0, down: 0, dragging: false };
        if (panel) panel.classList.add('dragging');
      }
      function moveDrag(y) {
        if (!drag) return;
        var dy = y - drag.y0;
        drag.moved = Math.max(drag.moved, Math.abs(dy));
        if (!drag.dragging && drag.moved > 8) drag.dragging = true;  /* 超过阈值才算拖动，避免误触 */
        if (!drag.dragging) return;
        if (dy < 0) drag.up += -dy; else drag.down += dy;
        var ih = window.innerHeight;
        var h = drag.h0 - dy;
        h = Math.max(ih * MAP, Math.min(h, ih * FULL));
        setSheet(h);
      }
      function endDrag() {
        if (!drag) return;
        if (panel) panel.classList.remove('dragging');
        var ih = window.innerHeight;
        if (!drag.dragging) {          /* 轻点 → 逐级上跳：MAP→MIX→FULL→MIX */
          var f = sheetH() / ih;
          cur = applyFrac(f <= (MAP + MIX) / 2 ? MIX : (f >= (MIX + FULL) / 2 ? MIX : FULL));
        } else {
          /* 按拖动方向落档：大幅上滑→FULL，小幅上拉→MIX；下拉→收起 */
          var upIntent = drag.up > Math.max(drag.down, 60);
          var downIntent = drag.down > Math.max(drag.up, 60);
          var f = sheetH() / ih;
          if (upIntent) cur = applyFrac(f > 0.55 ? FULL : MIX);
          else if (downIntent) {
            var startFull = (drag.h0 / ih) >= 0.98;
            /* 从全屏开始下拉：拖过 140px 就直接收到底(地图全屏)，否则回 MIX */
            cur = applyFrac(startFull ? (drag.down > 140 ? MAP : MIX) : (f < 0.55 ? MAP : MIX));
          }
          else cur = applyFrac(f < (MAP + MIX) / 2 ? MAP : (f < (MIX + FULL) / 2 ? MIX : FULL));
        }
        drag = null;
      }

      /* 支持 Pointer Events（现代 WebView），无则退回 Touch */
      if (window.PointerEvent && handle) {
        handle.addEventListener('pointerdown', function (e) {
          e.preventDefault(); beginDrag(e.clientY);
          handle.setPointerCapture && handle.setPointerCapture(e.pointerId);
        });
        handle.addEventListener('pointermove', function (e) { moveDrag(e.clientY); });
        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
      } else if (handle) {
        handle.addEventListener('touchstart', function (e) { beginDrag(e.touches[0].clientY); }, { passive: true });
        handle.addEventListener('touchmove', function (e) {
          if (drag && drag.dragging) e.preventDefault();
          moveDrag(e.touches[0].clientY);
        }, { passive: false });
        handle.addEventListener('touchend', endDrag);
      }

      /* 面板区手势联动（绑在 #panel 上，覆盖头部与列表）：
         - 非全屏：向上滑 → 接管并放大；列表顶部下拉 → 接管并缩小（到 MAP 即"下滑隐藏"）
         - 全屏：内容自由滚动；滚到顶再下拉 → 收起 */
      if (panel) {
        var lt = null;
        function panStart(y) { lt = { y0: y, dragging: false }; }
        function panMove(y, ev) {
          if (!lt) return;
          var dy = y - lt.y0;
          var frac = sheetH() / window.innerHeight;
          if (!lt.dragging) {
            if (frac < 0.985) {
              if (dy < -14) { lt.dragging = true; beginDrag(lt.y0); if (panel) panel.classList.add('dragging'); }
              else if (dy > 14 && listWrap && listWrap.scrollTop <= 0) {
                /* 列表已滚到顶还继续下拉 → 缩小面板（MAP = 完全收起给地图） */
                lt.dragging = true; beginDrag(lt.y0); if (panel) panel.classList.add('dragging');
              }
              else return;
            } else {
              if (dy > 14 && listWrap && listWrap.scrollTop <= 0) {
                lt.dragging = true; beginDrag(lt.y0); if (panel) panel.classList.add('dragging');
              } else return;
            }
          }
          if (lt.dragging && ev && ev.cancelable) ev.preventDefault();
          if (lt.dragging) moveDrag(y);
        }
        function panEnd() { if (lt && lt.dragging) endDrag(); lt = null; }
        if (window.PointerEvent) {
          panel.addEventListener('pointerdown', function (e) { panStart(e.clientY); });
          panel.addEventListener('pointermove', function (e) { panMove(e.clientY, e); }, { passive: false });
          panel.addEventListener('pointerup', panEnd);
          panel.addEventListener('pointercancel', panEnd);
        }
        panel.addEventListener('touchstart', function (e) { panStart(e.touches[0].clientY); }, { passive: true });
        panel.addEventListener('touchmove', function (e) { panMove(e.touches[0].clientY, e); }, { passive: false });
        panel.addEventListener('touchend', panEnd);
        panel.addEventListener('touchcancel', panEnd);
      }

      /* ===== 详情浮层：可拖高度（默认 58% 露出地图位置，上拉放大，下拉超过一半关闭） ===== */
      var detail = document.getElementById('detail');
      if (detail) {
        var dg = null;
        function detBegin(y) {
          if (!detail.classList.contains('open')) return;
          dg = { y0: y, h0: detail.getBoundingClientRect().height, moved: 0, dragging: false };
          detail.classList.add('dragging');
        }
        function detMove(y) {
          if (!dg) return;
          var dy = y - dg.y0;
          dg.moved = Math.max(dg.moved, Math.abs(dy));
          if (!dg.dragging && dg.moved > 8) dg.dragging = true;
          if (!dg.dragging) return;
          var ih = window.innerHeight;
          var h = dg.h0 - dy;
          h = Math.max(ih * 0.30, Math.min(h, ih * 0.98));
          detail.style.height = Math.round(h) + 'px';
        }
        function detEnd() {
          if (!dg) return;
          detail.classList.remove('dragging');
          if (dg.dragging) {
            var ih = window.innerHeight;
            var f = detail.getBoundingClientRect().height / ih;
            if (f < 0.34) {                        /* 拖得较低 → 关闭详情，回到看地图 */
              var c = detail.querySelector('.dt-close');
              if (c) c.click();
            } else {
              detail.style.height = Math.round(ih * (f > 0.66 ? 0.96 : 0.46)) + 'px';
            }
          }
          dg = null;
        }
        function detDown(e) {
          var r = detail.getBoundingClientRect();
          var off = e.clientY - r.top;
          if (off > 34) return;                      /* 只在顶部把手区拖动 */
          if (e.target.closest && e.target.closest('button,a')) return; /* 放行返回/关闭按钮 */
          e.preventDefault();
          detBegin(e.clientY);
        }
        function detDrag(e) { if (dg) { e.preventDefault(); detMove(e.clientY); } }
        function detUp() { detEnd(); }
        if (window.PointerEvent) {
          detail.addEventListener('pointerdown', detDown);
          detail.addEventListener('pointermove', detDrag, { passive: false });
          detail.addEventListener('pointerup', detUp);
          detail.addEventListener('pointercancel', detUp);
        }
        detail.addEventListener('touchstart', function (e) {
          if (e.touches.length !== 1) return;
          var r = detail.getBoundingClientRect();
          var off = e.touches[0].clientY - r.top;
          if (off > 34) return;
          if (e.target.closest && e.target.closest('button,a')) return;
          detBegin(e.touches[0].clientY);
        }, { passive: true });
        detail.addEventListener('touchmove', function (e) {
          if (dg && dg.dragging) e.preventDefault();
          detMove(e.touches[0].clientY);
        }, { passive: false });
        detail.addEventListener('touchend', detUp);
        detail.addEventListener('touchcancel', detUp);

        /* 打开详情：面板收成小条，露出全屏地图作背景，酒的位置在详情上方可见 */
        window.addEventListener('sa:detailopen', function () {
          if (!isMobile()) return;
          applyFrac(MAP);
          /* 等 flyTo 动画基本到位后再把详情压矮一点，避免遮住屏幕中央的标记 */
          setTimeout(function () {
            var d = document.getElementById('detail');
            if (d && d.classList.contains('open')) d.style.height = Math.round(window.innerHeight * 0.46) + 'px';
          }, 560);
        });
        /* "📍 在地图看位置" → 收起详情并切到纯地图态，直观看到这款酒的位置 */
        window.addEventListener('sa:viewmap', function () {
          if (!isMobile()) return;
          applyFrac(MAP);
        });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.SA);
