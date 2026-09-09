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

    /* 移动端抽屉 handle：点击切换 body.mobile-drawer-up。
       默认（首次进入）即展开酒单 —— 用户手机上第一个诉求是"能看列表、
       能下滑"，地球仍保留顶部 30dvh 可点选；想看大地球再点一次把手。 */
    var isMobile = function () { return window.innerWidth <= 600; };
    if (isMobile()) {
      document.body.classList.add('mobile-drawer-up');
      setTimeout(function () { SA.globe.resize(); }, 400);
    }
    var handle = document.getElementById('mobileDrawerHandle');
    if (handle) {
      handle.addEventListener('click', function (e) {
        e.stopPropagation();
        document.body.classList.toggle('mobile-drawer-up');
        /* 抽屉切换后让地球立即重算尺寸 */
        setTimeout(function () { SA.globe.resize(); }, 380);
      });
    }
    /* 手机：点击列表项时若处于"酒单未展开"，先展开酒单（否则详情被盖住/看不到联动） */
    document.addEventListener('click', function (e) {
      if (!isMobile()) return;
      var item = e.target.closest('#panel .item');
      if (!item) return;
      if (!document.body.classList.contains('mobile-drawer-up')) {
        document.body.classList.add('mobile-drawer-up');
        setTimeout(function () { SA.globe.resize(); }, 380);
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.SA);
