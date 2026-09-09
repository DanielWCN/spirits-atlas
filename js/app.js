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

    /* ============ 移动端（≤600px）：全屏可刷的酒单 ============
       心智模型：打开页面主要就是「刷酒」。
       · 面板默认占 60% 屏（列表为主、顶部仍留 40% 地球可点）
       · 在列表里往上一滑 → 面板平滑铺满整屏（100%），酒单全屏可刷
       · 面板全屏后再下滑 → 先滚列表内容；滚到顶部继续下滑 → 退回地图态 60%
       · 顶部把手：按住可上下拖（实时跟手），轻点 = 一键切换 60% ↔ 100%
    */
    var isMobile = function () { return window.innerWidth <= 600; };
    var panel = document.getElementById('panel');
    var handle = document.getElementById('mobileDrawerHandle');
    var listWrap = document.getElementById('listWrap');
    var LOW = 0.60, FULL = 1.0;          /* 地图态 60% ↔ 全屏酒单 */

    function sheetH() { return panel ? panel.getBoundingClientRect().height : 0; }
    function setSheet(px) { if (panel) panel.style.height = Math.round(px) + 'px'; }
    function applyFrac(frac) {
      var ih = window.innerHeight;
      if (panel) {
        panel.style.height = Math.round(ih * frac) + 'px';
        panel.classList.toggle('p-full', frac >= 0.98);
      }
      return frac;
    }
    function snapSheet(px) {
      return applyFrac((px / window.innerHeight) < (LOW + FULL) / 2 ? LOW : FULL);
    }
    if (isMobile() && panel) {
      var cur = applyFrac(LOW);

      var drag = null;
      function beginDrag(y) {
        drag = { y0: y, h0: sheetH(), moved: 0, up: 0, down: 0, dragging: false };
        if (panel) panel.classList.add('dragging');
      }
      function moveDrag(y) {
        if (!drag) return;
        var dy = y - drag.y0;
        drag.moved = Math.max(drag.moved, Math.abs(dy));
        if (!drag.dragging && drag.moved > 8) drag.dragging = true;  /* 超过阈值才算拖动，避免误触点击 */
        if (!drag.dragging) return;
        if (dy < 0) drag.up += -dy; else drag.down += dy;
        var ih = window.innerHeight;
        var h = drag.h0 - dy;
        h = Math.max(ih * LOW - 40, Math.min(h, ih * FULL));
        setSheet(h);
      }
      function endDrag() {
        if (!drag) return;
        if (panel) panel.classList.remove('dragging');
        var ih = window.innerHeight;
        if (!drag.dragging) {          /* 轻点 → 反向切换档位 */
          cur = applyFrac((sheetH() / ih) <= (LOW + FULL) / 2 ? FULL : LOW);
        } else {
          /* 上滑意图明显 → 直接全屏；下拉意图明显 → 回地图态；否则就近吸附 */
          var upIntent = drag.up > Math.max(drag.down, 60);
          var downIntent = drag.down > Math.max(drag.up, 60);
          cur = upIntent ? applyFrac(FULL) : (downIntent ? applyFrac(LOW) : snapSheet(sheetH()));
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
         - 面板未全屏：向上滑 → 接管手势把面板拉向全屏（"想看更多就上滑"）
         - 面板全屏：列表内容正常滚动；在列表顶部或头部再下滑 → 拉回地图态 */
      if (panel) {
        var lt = null;
        function panStart(y) { lt = { y0: y, dragging: false }; }
        function panMove(y, ev) {
          if (!lt) return;
          var dy = y - lt.y0;
          var frac = sheetH() / window.innerHeight;
          if (!lt.dragging) {
            if (frac < 0.985) {
              /* 非全屏：向上滑 = 把面板拉向全屏（下拉交还列表原生滚动） */
              if (dy < -14) { lt.dragging = true; beginDrag(lt.y0); if (panel) panel.classList.add('dragging'); }
              else return;
            } else {
              /* 全屏：只有滚到顶后的下拉才接管（列表中部下拉 = 正常滚动内容） */
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
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.SA);
