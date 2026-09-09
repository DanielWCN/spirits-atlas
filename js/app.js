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

    /* ============ 移动端（≤600px）：可拖拽底部抽屉 ============
       地图全屏铺底；#panel 是悬浮底部的抽屉：
       · 按住顶部把手上下拖动 → 实时跟手，松手吸附到 LOW(42%) / HIGH(88%)
       · 轻点把手 → LOW ↔ HIGH 切换
       · 酒单滚到顶后再上拉 → 继续把抽屉拉高（联动）
    */
    var isMobile = function () { return window.innerWidth <= 600; };
    var panel = document.getElementById('panel');
    var handle = document.getElementById('mobileDrawerHandle');
    var listWrap = document.getElementById('listWrap');
    var LOW = 0.42, HIGH = 0.88;

    function sheetH() { return panel ? panel.getBoundingClientRect().height : 0; }
    function setSheet(px) { if (panel) panel.style.height = Math.round(px) + 'px'; }
    function snapSheet(px) {
      var ih = window.innerHeight;
      var to = (px / ih) < (LOW + HIGH) / 2 ? LOW : HIGH;
      if (panel) panel.style.height = Math.round(ih * to) + 'px';
      return to;
    }
    if (isMobile() && panel) {
      var cur = LOW;
      panel.style.height = (window.innerHeight * cur) + 'px';

      var drag = null;
      function beginDrag(y) {
        drag = { y0: y, h0: sheetH(), moved: 0, dragging: false };
        if (panel) panel.classList.add('dragging');
      }
      function moveDrag(y) {
        if (!drag) return;
        var dy = y - drag.y0;
        drag.moved = Math.max(drag.moved, Math.abs(dy));
        if (!drag.dragging && drag.moved > 8) drag.dragging = true;  /* 超过阈值才算拖动，避免误触 */
        if (!drag.dragging) return;
        var ih = window.innerHeight;
        var h = drag.h0 - dy;
        h = Math.max(ih * LOW - 60, Math.min(h, ih * HIGH + 40));
        setSheet(h);
      }
      function endDrag() {
        if (!drag) return;
        if (panel) panel.classList.remove('dragging');
        var ih = window.innerHeight;
        if (!drag.dragging) {          /* 轻点 → 反向切换档位 */
          cur = (sheetH() / ih) <= (LOW + HIGH) / 2 ? HIGH : LOW;
          panel.style.height = Math.round(ih * cur) + 'px';
        } else {
          cur = snapSheet(sheetH());
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

      /* 酒单滚动联动：滚到顶再上拉 → 拉高抽屉（Pointer + Touch 双路径） */
      if (listWrap) {
        var lt = null;
        function lwStart(y) {
          lt = { y0: y, dragging: false };
        }
        function lwMove(y, cancelable) {
          if (!lt) return;
          var dy = y - lt.y0;
          if (!lt.dragging) {
            /* 抽屉未到最高、且列表在顶部、且手指上拉 → 接管为抽屉拖动 */
            var nearHigh = sheetH() / window.innerHeight > HIGH - 0.04;
            if (!nearHigh && listWrap.scrollTop <= 0 && dy < -10) {
              lt.dragging = true;
              beginDrag(lt.y0);
              if (panel) panel.classList.add('dragging');
            } else return;
          }
          if (cancelable) moveDrag(y);
        }
        function lwEnd() {
          if (lt && lt.dragging) endDrag();
          lt = null;
        }
        function peDown(e) { lwStart(e.clientY); }
        function peMove(e) {
          /* pointer 按下时若已接管为拖动则阻止原生滚动 */
          if (lt && lt.dragging && e.cancelable) e.preventDefault();
          lwMove(e.clientY, true);
        }
        if (window.PointerEvent) {
          listWrap.addEventListener('pointerdown', peDown);
          listWrap.addEventListener('pointermove', peMove, { passive: false });
          listWrap.addEventListener('pointerup', lwEnd);
          listWrap.addEventListener('pointercancel', lwEnd);
        }
        listWrap.addEventListener('touchstart', function (e) { lwStart(e.touches[0].clientY); }, { passive: true });
        listWrap.addEventListener('touchmove', function (e) { lwMove(e.touches[0].clientY, true); }, { passive: false });
        listWrap.addEventListener('touchend', lwEnd);
        listWrap.addEventListener('touchcancel', lwEnd);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.SA);
