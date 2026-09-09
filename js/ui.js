/* =============================================================
 * ui.js — 左侧面板渲染 + 双向联动绑定
 * v2：新增「产区百科」渲染（回答"艾雷岛到底是什么"）+ 热门产区入口 + 布局无覆盖
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  var S = SA.store;
  var el = {};
  var searchTimer = null;
  var lastReason = '';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function chips(arr, cls) {
    return '<div class="chips">' + (arr || []).map(function (t) {
      return '<span class="chip ' + (cls || '') + '">' + esc(t) + '</span>';
    }).join('') + '</div>';
  }
  function sec(title, body) {
    return '<div class="c-sec"><h3>' + esc(title) + '</h3>' + body + '</div>';
  }
  function p(text) { return '<p>' + esc(text) + '</p>'; }

  /* ================= 初始化 ================= */
  function init() {
    ['catTabs', 'quickFilter', 'knowledge', 'list', 'detail', 'searchInput', 'sortSelect', 'resultCount',
      'originChip', 'hudSources', 'hudCount', 'hudLegend', 'globeTip', 'loading', 'loadList',
      'camBtn', 'camPop', 'hotRegions'].forEach(function (id) { el[id] = $(id); });

    buildTabs();
    renderQuickFilter();
    buildHotRegions();
    renderLegend();
    bindPanel();
    bindGlobe();
    S.subscribe(render);
    render(S.state, 'init');
  }

  /* ================= 品类标签 ================= */
  function buildTabs() {
    var tabs = [{ id: 'all', name: '全部', icon: '🌍', color: '#8fb6ff' }].concat(SA.CATEGORIES);
    el.catTabs.innerHTML = tabs.map(function (t) {
      return '<button class="tab" data-cat="' + t.id + '" style="--c:' + t.color + '" title="' + esc(t.name) + '">' +
        '<span class="tab-ico">' + t.icon + '</span><span class="tab-text">' + esc(t.short) + '</span></button>';
    }).join('');
    el.catTabs.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      S.setCategory(b.getAttribute('data-cat'));
      S.select(null, 'category-switch');
      SA.globe.clearSelection();
      hideDetail();
      flip();
    });
  }

  function syncTabs() {
    Array.prototype.forEach.call(el.catTabs.querySelectorAll('.tab'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-cat') === S.state.category);
    });
  }

  /* ================= 热门产区入口 ================= */
  function buildHotRegions() {
    var ids = SA.HOT_REGIONS || [];
    el.hotRegions.innerHTML = '<span class="lbl">🔥 热门产区</span>' + ids.map(function (id) {
      var r = SA.regionById(id);
      if (!r) return '';
      return '<button class="hot-chip" data-region="' + r.id + '" style="--c:' + SA.colorOf(r.category) + '">' +
        esc(r.name) + '</button>';
    }).join('');
    el.hotRegions.addEventListener('click', function (e) {
      var b = e.target.closest('.hot-chip');
      if (!b) return;
      var id = b.getAttribute('data-region');
      var r = SA.regionById(id);
      if (!r) return;
      var on = S.state.regionKey === id;
      S.setRegionFilter(on ? null : id);
      S.select(null);
      hideDetail();
      if (!on) {
        SA.globe.clearSelection();
        SA.globe.flyTo(r.lat, r.lon, 1.5, 1150);
      }
      SA.globe.applyFilter();
      flip();
    });
  }

  function syncHotRegions() {
    Array.prototype.forEach.call(el.hotRegions.querySelectorAll('.hot-chip'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-region') === S.state.regionKey);
    });
  }

  function renderLegend() {
    el.hudLegend.innerHTML = SA.CATEGORIES.map(function (c) {
      return '<div class="lg"><i style="background:' + c.color + ';box-shadow:0 0 8px ' + c.color + '"></i>' + esc(c.name) + '</div>';
    }).join('');
  }

  /* ================= 快速筛选（新手 / 老炮儿 / 性价比 / 收藏） ================= */
  var BADGE_DEFS = [
    { id: 'entry',   icon: '🌱', label: '新手推荐' },
    { id: 'veteran', icon: '🥃', label: '老炮儿推荐' },
    { id: 'value',   icon: '💰', label: '高性价比' },
    { id: 'collect', icon: '💎', label: '收藏级' }
  ];

  function renderQuickFilter() {
    var box = el.quickFilter;
    if (!box) return;
    var on = (S.state.badges || []);
    var counts = Object.create(null);
    S.state.all.forEach(function (i) {
      (i.badges || []).forEach(function (b) { counts[b] = (counts[b] || 0) + 1; });
    });
    box.innerHTML = BADGE_DEFS.map(function (b) {
      var active = on.indexOf(b.id) !== -1;
      return '<button class="qf-chip' + (active ? ' on' : '') + '" data-b="' + b.id + '" data-badge="' + b.id + '">' +
        b.icon + ' ' + b.label + '<span class="qf-count">' + (counts[b.id] || 0) + '</span></button>';
    }).join('') +
      (on.length ? '<button class="qf-chip" data-badge-clear="1">✕ 清除</button>' : '');
    bindQuickFilter();
  }

  function bindQuickFilter() {
    var box = el.quickFilter;
    if (!box) return;
    box.querySelectorAll('[data-badge]').forEach(function (b) {
      b.addEventListener('click', function () { S.toggleBadge(b.getAttribute('data-badge')); });
    });
    var clr = box.querySelector('[data-badge-clear]');
    if (clr) clr.addEventListener('click', function () { S.clearBadges(); });
  }

  /* ================= 知识卡：品类知识 ================= */
  function categoryCardHTML(k, color) {
    var cmp = k.craft || {}, left = cmp.left || {}, right = cmp.right || {};
    function ul(arr) { return '<ul>' + (arr || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
    return '<div class="c-head">' +
      '<div class="c-ico">' + k.icon + '</div>' +
      '<div class="c-title"><h2>' + esc(k.name) + '</h2><span class="c-en">' + esc(k.en || '') + '</span></div>' +
      '</div>' +
      '<p class="c-tagline">' + esc(k.tagline) + '</p>' +
      '<p class="c-def">' + esc(k.definition) + '</p>' +
      sec(cmp.title || '核心工艺差异',
        '<div class="c-cmp">' +
        '<div class="c-col"><h4>' + esc(left.name || '') + '</h4>' + ul(left.bullets) + '</div>' +
        '<div class="c-col"><h4>' + esc(right.name || '') + '</h4>' + ul(right.bullets) + '</div>' +
        '</div>') +
      (k.subtypes ? sec(k.subtypesTitle || '完整香型 / 子类体系',
        '<div class="c-subtypes">' + k.subtypes.map(function (s) {
          return '<div class="st-row"' + (s.rare ? ' data-rare="1"' : '') + '>' +
            '<span class="st-name">' + esc(s.name) + '</span>' +
            '<span class="st-mark">' + esc(s.mark || '') + '</span>' +
            '<span class="st-desc">' + esc(s.desc || '') + '</span>' +
            '<span class="st-brands">' + esc(s.brands || '') + '</span>' +
            '</div>';
        }).join('') + '</div>') : '') +
      sec('经典产区', chips(k.regions)) +
      sec('适饮 & 配餐',
        '<div class="c-kv">' +
        '<div><label>适饮温度</label><span>' + esc(k.serve.temp) + '</span></div>' +
        '<div><label>杯型建议</label><span>' + esc(k.serve.glass) + '</span></div>' +
        '<div style="grid-column:1/-1"><label>配餐建议</label><span>' + esc(k.pairing) + '</span></div>' +
        '</div>');
  }

  /* ================= 知识卡：产区百科 ================= */
  function regionCardHTML(r) {
    var color = SA.colorOf(r.category);
    var cat = SA.CATEGORY_MAP[r.category] || {};
    var kv = '';
    function kvItem(label, val) {
      if (!val) return '';
      return '<div><label>' + esc(label) + '</label><span>' + esc(val) + '</span></div>';
    }
    var brands = (r.brands || []).map(function (b) {
      return '<div class="c-brand" data-brand="' + esc(b.name) + '">' +
        '<b>' + esc(b.cn || b.name) + '</b><i>' + esc(b.name) + '</i><span>' + esc(b.note || '') + '</span></div>';
    }).join('');
    var bottles = (r.bottles || []).map(function (b) {
      return '<button class="chip chip-btn" data-bottle="' + esc(b) + '">' + esc(b) + '</button>';
    }).join('');
    var facts = (r.facts || []).map(function (f) {
      return '<span class="chip">· ' + esc(f[0]) + '：' + esc(f[1]) + '</span>';
    }).join('');

    return '<div class="c-head">' +
      '<div class="c-ico">' + (r.icon || '📍') + '</div>' +
      '<div class="c-title"><h2>' + esc(r.name) + '</h2><span class="c-en">' + esc(r.en || '') + '</span></div>' +
      '</div>' +
      '<div class="c-top">' +
      '<span class="c-badge">📍 ' + esc(r.country) + '</span>' +
      '<span class="c-badge">' + esc(cat.name || '') + '</span>' +
      '<span class="c-badge">' + esc(r.level || '产区') + '</span>' +
      '</div>' +
      '<p class="c-tagline">' + esc(r.tagline) + '</p>' +
      sec('风土 · 为什么是这里', p(r.terroir)) +
      (r.craft ? sec('工艺要点', p(r.craft)) : '') +
      sec('关键参数', '<div class="c-kv">' +
        kvItem('泥煤值 / PPM', r.peat) + kvItem('常见酒精度', r.abv) +
        kvItem('典型酒龄', r.age) + kvItem('参考价格带', r.priceBand) +
        '</div>') +
      sec('代表风味', chips(r.flavor, 'chip-accent')) +
      (brands ? sec('代表酒厂 / 品牌（点击筛选）', '<div class="c-brands">' + brands + '</div>') : '') +
      (bottles ? sec('典型酒款（点击定位）', '<div class="chips">' + bottles + '</div>') : '') +
      sec('适饮 & 配餐', '<div class="c-kv">' +
        kvItem('适饮温度', r.serve && r.serve.temp) + kvItem('杯型', r.serve && r.serve.glass) +
        '<div style="grid-column:1/-1"><label>配餐建议</label><span>' + esc(r.pairing) + '</span></div>' +
        '</div>') +
      (facts ? '<div class="c-facts">' + facts + '</div>' : '');
  }

  function renderKnowledge() {
    var r = S.state.regionKey ? SA.regionById(S.state.regionKey) : null;
    if (!r && S.state.originFilter) r = SA.regionByOrigin(S.state.originFilter);
    var color, html;
    if (r) {
      color = SA.colorOf(r.category);
      html = regionCardHTML(r);
    } else {
      var k = S.state.category === 'all' ? SA.KNOWLEDGE_ALL : (SA.KNOWLEDGE[S.state.category] || SA.KNOWLEDGE_ALL);
      color = S.state.category === 'all' ? '#8fb6ff' : SA.colorOf(S.state.category);
      html = categoryCardHTML(k, color);
      if (S.state.originFilter) {
        var note = SA.REGION_NOTES && SA.REGION_NOTES[S.state.originFilter];
        html += sec('当前产地 · ' + S.state.originFilter,
          p(note ? note.note : '该产地暂无百科条目，可切换到「全部」查看品类知识，或从上方「热门产区」进入深度产区介绍。'));
      }
    }
    el.knowledge.innerHTML = '<div class="card" style="--accent:' + color + '">' + html + '</div>';
    wrapCardBody(el.knowledge.firstElementChild);
    bindKnowledge();
  }

  /** 把知识卡 c-head 之后的内容包进 .c-body，实现「折叠/展开」，把纵向空间还给列表 */
  function wrapCardBody(card) {
    if (!card) return;
    var head = card.querySelector('.c-head');
    if (!head) return;
    var body = document.createElement('div');
    body.className = 'c-body';
    var node = head.nextSibling;
    while (node) {
      var next = node.nextSibling;
      body.appendChild(node);
      node = next;
    }
    card.appendChild(body);
    // 折叠开关按钮
    var btn = document.createElement('button');
    btn.className = 'c-toggle';
    btn.type = 'button';
    btn.title = '展开 / 收起 知识详情';
    head.appendChild(btn);
    head.classList.add('clickable');
    head.addEventListener('click', function () { setKnowOpen(!knowOpen); });
    card.classList.toggle('collapsed', !knowOpen);
    syncToggle(card);
  }

  var knowOpen = false;   // 默认折叠：列表优先，避免内容局促
  function setKnowOpen(open) {
    knowOpen = !!open;
    var card = el.knowledge.firstElementChild;
    if (!card) return;
    card.classList.toggle('collapsed', !knowOpen);
    syncToggle(card);
  }
  function syncToggle(card) {
    var btn = card.querySelector('.c-toggle');
    if (btn) btn.textContent = knowOpen ? '收起 ▲' : '展开 ▼';
  }

  /** 知识卡内的交互：点击品牌筛选 / 点击酒款定位 */
  function bindKnowledge() {
    el.knowledge.querySelectorAll('.c-brand').forEach(function (b) {
      b.addEventListener('click', function () {
        var name = this.getAttribute('data-brand');
        el.searchInput.value = name;
        S.setQuery(name);
        S.setOriginFilter(null);
        S.setRegionFilter(null);
        SA.globe.applyFilter();
      });
    });
    el.knowledge.querySelectorAll('[data-bottle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var name = this.getAttribute('data-bottle');
        var hit = findByName(name);
        if (hit) {
          S.select(hit.id, 'bottle-chip');
          showDetail(hit);
          SA.globe.setSelected(hit);
        } else {
          el.searchInput.value = name;
          S.setQuery(name);
          SA.globe.applyFilter();
        }
      });
    });
  }

  function findByName(name) {
    var key = String(name).toLowerCase();
    var all = S.state.all;
    for (var i = 0; i < all.length; i++) {
      if (String(all[i].name).toLowerCase().indexOf(key) !== -1) return all[i];
    }
    // 退一步：取首个 token
    var first = key.split(/\s+/)[0];
    if (first && first.length > 2) {
      for (var j = 0; j < all.length; j++) {
        if (String(all[j].name).toLowerCase().indexOf(first) !== -1) return all[j];
      }
    }
    return null;
  }

  function flip() {
    var card = el.knowledge.firstElementChild;
    if (!card) return;
    card.classList.remove('flip');
    void card.offsetWidth;
    card.classList.add('flip');
  }

  /* ================= 列表 ================= */
  function renderList() {
    var list = S.getList();
    el.resultCount.textContent = list.length;
    var st = S.getStats();
    el.hudCount.innerHTML = '<b>' + list.length + '</b> 款匹配 · 共 <b>' + st.total + '</b> 款';
    if (!list.length) {
      el.list.innerHTML = '<div class="empty"><div class="empty-ico">🍸</div><p>没有匹配的酒款</p>' +
        '<span>换个关键词，或点「全部」重置筛选</span></div>';
      return;
    }
    var show = list.slice(0, 200);
    el.list.innerHTML = show.map(function (it) {
      var c = SA.colorOf(it.category);
      var tags = (it.flavor_tags || []).slice(0, 3).map(function (t) {
        return '<span class="tag flavor">' + esc(t) + '</span>';
      }).join('');
      var price = it.price && it.price !== '数据待更新'
        ? '<div class="item-price">' + esc(it.price) + '</div>' : '';
      /* 评分：优先用有出处的 ratings.js。没评分的就不再显示评分块（避免满屏"暂无"）；
   徽标（badges）才是 800+ 款酒都能用的客观维度，组合起来同样能给用户推荐感 */
      var rt = SA.ratingOf ? SA.ratingOf(it.id) : null;
      var rate = rt
        ? '<div class="rate">' +
            '<span class="rate-score">' + rt.score + '<small>' + esc(rt.unit) + '</small></span>' +
            '<span class="rate-src">' + esc(rt.source) + (rt.votes ? ' · ' + rt.votes + ' 票' : '') + '</span>' +
          '</div>'
        : '';
      var bd = (it.badges || []).map(function (b) {
        var d = BADGE_DEFS.filter(function (x) { return x.id === b; })[0];
        return d ? '<span class="badge ' + b + '">' + d.icon + d.label + '</span>' : '';
      }).join('');
      var meta = (it.abv ? 'ABV ' + it.abv + '%' : '');
      var thumb = SA.bottleImage(it, 44);
      return '<li class="item' + (S.state.selectedId === it.id ? ' active' : '') + '" data-id="' + esc(it.id) + '" style="--c:' + c + '">' +
        '<img class="item-thumb" src="' + esc(thumb) + '" alt="" loading="lazy"' +
        ' data-cat="' + esc(it.category) + '" data-size="44">' +
        '<div class="item-main">' +
        '<div class="item-title">' + esc(it.name) + '</div>' +
        '<div class="item-sub">' + esc(it.brand || it.distillery || '') + ' · ' + esc(it.origin) + '</div>' +
        '<div class="item-tags"><span class="tag">' + esc(it.sub_type || '') + '</span>' + tags + '</div>' +
        (bd ? '<div class="item-tags">' + bd + '</div>' : '') +
        '</div>' +
        '<div class="item-right">' + price + rate + (meta ? '<div class="item-meta">' + meta + '</div>' : '') + '</div>' +
        '</li>';
    }).join('') + (list.length > show.length ? '<li class="more">仅显示前 200 条，共 ' + list.length + ' 条，请用搜索缩小范围</li>' : '');
    fixThumbs(el.list);
  }

  /** 真实图加载失败时回落到品类占位图（有些 API 图源会 404 / 跨域） */
  function fixThumbs(root) {
    Array.prototype.forEach.call(root.querySelectorAll('img.item-thumb, img.dt-img'), function (img) {
      var cat = img.getAttribute('data-cat') || '';
      var size = parseInt(img.getAttribute('data-size') || '44', 10);
      img.addEventListener('error', function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = '1';
        img.src = SA.bottlePlaceholder({ category: cat }, size);
      }, { once: true });
    });
  }

  function bindList() {
    el.list.addEventListener('click', function (e) {
      var li = e.target.closest('.item');
      if (!li) return;
      var it = S.findById(li.getAttribute('data-id'));
      if (!it) return;
      S.select(it.id, 'item-click');
      showDetail(it);
      SA.globe.setSelected(it);
    });
  }

  /* ================= 详情卡 ================= */
  function showDetail(it) {
    var c = SA.colorOf(it.category);
    var cat = SA.CATEGORY_MAP[it.category] || {};
    var k = SA.KNOWLEDGE[it.category] || {};
    var reg = it.region ? SA.regionById(it.region) : null;
    var flavors = (it.flavor_tags || []).map(function (t) {
      return '<span class="tag flavor">' + esc(t) + '</span>';
    }).join('');
    var facts = '';
    function f(label, val) {
      if (!val) return '';
      return '<div class="dt-fact"><label>' + label + '</label><span>' + esc(val) + '</span></div>';
    }
    facts += f('子类', it.sub_type);
    facts += f('酒厂 / 庄园', it.distillery);
    facts += f('酒精度', it.abv ? it.abv + '%' : null);
    facts += f('酒龄', it.age ? it.age + ' 年' : null);
    facts += f('泥煤值', it.peat);
    facts += f('适饮温度', (it.serve && it.serve.temp) || (k.serve ? k.serve.temp : null));
    facts += f('杯型', (it.serve && it.serve.glass) || (k.serve && k.serve.glass));

    /* 有出处的评分块：没有权威来源就直说，不编造 */
    var rt = SA.ratingOf ? SA.ratingOf(it.id) : null;
    var rateBlock = rt
      ? '<div class="dt-rate">' +
          '<b>' + rt.score + '</b><span class="dt-band">' + esc(rt.band) + '</span>' +
          '<span style="font-size:11px;color:var(--txt-3)">' + esc(rt.source) + (rt.votes ? ' · ' + rt.votes + ' 票' : '') + '</span>' +
          '<span class="dt-note">' + esc(rt.note) + (rt.url ? ' <a href="' + esc(rt.url) + '" target="_blank" rel="noopener">查看来源 ↗</a>' : '') + '</span>' +
        '</div>'
      : '<div class="dt-rate"><span class="dt-note">暂无权威评分 —— 本项目不收录无法追溯来源的分数，宁缺毋滥。</span></div>';
    var bd = (it.badges || []).map(function (b) {
      var d = BADGE_DEFS.filter(function (x) { return x.id === b; })[0];
      return d ? '<span class="badge ' + b + '">' + d.icon + ' ' + d.label + '</span>' : '';
    }).join('');

    var hero = SA.bottleImage(it, 220);
    el.detail.innerHTML = '<div class="dt" style="--c:' + c + '">' +
      '<button class="dt-back">← 返回列表</button>' +
      '<button class="dt-close" title="关闭">×</button>' +
      '<div class="dt-hero">' +
      '<img class="dt-img" src="' + esc(hero) + '" alt="' + esc(it.name) + '"' +
      ' data-cat="' + esc(it.category) + '" data-size="220">' +
      '</div>' +
      '<div class="dt-head"><div class="dt-head-main">' +
      '<div class="dt-cat"><span class="dt-dot"></span>' + esc(cat.name || it.category) + '</div>' +
      '<h3>' + esc(it.name) + '</h3>' +
      '<div class="dt-sub">' + esc(it.brand) + '</div>' +
      '<div class="dt-origin">📍 ' + esc(it.origin) + (it.origin_inferred ? ' <span class="badge">产地推断</span>' : '') +
      (bd ? '<div style="margin-top:6px">' + bd + '</div>' : '') + '</div>' +
      '</div></div>' +
      rateBlock +
      '<div class="dt-price"><label>参考价格</label><span class="hl">' + esc(it.price || '数据待更新') + '</span>' +
      '<em>' + (it.price && it.price !== '数据待更新' ? '市场参考区间，随渠道波动' : '公开数据源暂未提供零售价') + '</em></div>' +
      '<div class="dt-facts">' + facts + '</div>' +
      '<div class="dt-block"><label>风味标签</label><div class="chips">' + (flavors || '<span class="chip">待品鉴</span>') + '</div></div>' +
      '<div class="dt-block"><label>描述 / 品鉴笔记</label><p>' + esc(it.description || '').replace(/\n/g, '<br>') + '</p></div>' +
      (it.food_pairing ? '<div class="dt-block"><label>食物搭配</label><p>' + esc(it.food_pairing) + '</p></div>' : '') +
      '<div class="dt-foot">' +
      '<button class="btn-fly">🌍 地球定位</button>' +
      (SA.imageSearchURL ? '<a class="btn-fly" href="' + esc(SA.imageSearchURL(it)) + '" target="_blank" rel="noopener">🔍 查看实拍瓶身</a>' : '') +
      (reg ? '<button class="btn-fly" data-region="' + esc(reg.id) + '">📖 ' + esc(reg.name) + ' 产区百科</button>' : '') +
      (it.source_url ? '<a class="btn-src" href="' + esc(it.source_url) + '" target="_blank" rel="noopener">数据源：' + esc(it.source) + '</a>'
        : '<span class="btn-src" style="border:0">数据源：' + esc(it.source) + '</span>') +
      '</div></div>';
    el.detail.style.height = '';      /* 回到默认 58%，不要残留上次拖动的高度 */
    el.detail.classList.add('open');

    fixThumbs(el.detail);
    var back = el.detail.querySelector('.dt-back');
    if (back) back.addEventListener('click', function () {
      // 仅关闭详情面板；地球保持飞近（cam.dist=1.42）、选中环保留、selBar 显示
      // 用户可继续浏览列表，或点 selBar 的 × 彻底取消选中
      hideDetail();
    });
    el.detail.querySelector('.dt-close').addEventListener('click', function () {
      hideDetail();
    });
    el.detail.querySelector('.btn-fly:not([data-region])').addEventListener('click', function () { SA.globe.setSelected(it); });
    var rb = el.detail.querySelector('.btn-fly[data-region]');
    if (rb) rb.addEventListener('click', function () {
      var r = SA.regionById(this.getAttribute('data-region'));
      if (!r) return;
      S.setRegionFilter(r.id);
      hideDetail();
      SA.globe.flyTo(r.lat, r.lon, 1.5, 1100);
      SA.globe.applyFilter();
      flip();
    });
  }

  function hideDetail() { el.detail.classList.remove('open'); el.detail.innerHTML = ''; }

  /* ================= 筛选栏 ================= */
  function bindPanel() {
    el.searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var v = this.value;
      searchTimer = setTimeout(function () {
        S.setQuery(v);
        SA.globe.applyFilter();
      }, 180);
    });

    el.sortSelect.addEventListener('change', function () { S.setSort(this.value); });

    $('clearBtn').addEventListener('click', function () {
      el.searchInput.value = '';
      S.clearFilters();
      hideDetail();
      SA.globe.clearSelection();
      SA.globe.applyFilter();
      flip();
    });

    bindList();

    // 📷 传图识酒
    el.camBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      el.camPop.classList.toggle('open');
    });
    document.addEventListener('click', function () { el.camPop.classList.remove('open'); });
    el.camPop.addEventListener('click', function (e) { e.stopPropagation(); });
    el.camPop.innerHTML = '<div class="cam-title">📷 传图识酒</div>' +
      '<p class="cam-desc">图像识别模块开发中，当前阶段支持<b>瓶身特征描述</b>搜索 —— 点选下方特征，或直接在搜索框输入。</p>' +
      '<div class="cam-chips">' + SA.BOTTLE_HINTS.map(function (h) {
        return '<button class="chip chip-btn" data-kw="' + esc(h.kw) + '" title="' + esc(h.hint) + '">' + esc(h.label) + '</button>';
      }).join('') + '</div>';
    el.camPop.addEventListener('click', function (e) {
      var b = e.target.closest('.chip-btn');
      if (!b) return;
      var kw = b.getAttribute('data-kw');
      el.searchInput.value = kw;
      S.setQuery(kw);
      SA.globe.applyFilter();
      el.camPop.classList.remove('open');
      el.searchInput.focus();
    });

    $('clearOrigin').addEventListener('click', function () {
      S.setRegionFilter(null);
      S.setOriginFilter(null);
      SA.globe.applyFilter();
      flip();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hideDetail(); }   // 关闭详情但保留选中
    });

    $('zoomIn').addEventListener('click', function () { SA.globe.zoomTo(SA.globe.getDistance() - 0.45); });
    $('zoomOut').addEventListener('click', function () { SA.globe.zoomTo(SA.globe.getDistance() + 0.5); });
    $('zoomReset').addEventListener('click', function () { SA.globe.clearSelection(); S.select(null); SA.globe.zoomTo(2.9); });
    var selBar = $('selBar'), selClear = $('selClear');
    if (selClear) selClear.addEventListener('click', function () { SA.globe.clearSelection(); S.select(null); });
    // 选中时显示"已聚焦"条
    var prevSelId = null;
    var selTick = setInterval(function () {
      var id = S.state && S.state.selectedId;
      if (id !== prevSelId) {
        prevSelId = id;
        if (selBar) selBar.hidden = !id;
      }
    }, 400);
  }

  /* ================= 地球联动 ================= */
  function bindGlobe() {
    SA.globe.on('clusterClick', function (c) {
      if (!c) return;
      var reg = SA.regionByOrigin(c.origin);
      hideDetail();
      if (reg) S.setRegionFilter(reg.id);
      else S.setOriginFilter(c.origin);
      S.select(null);
      SA.globe.applyFilter();
      flip();
    });
    SA.globe.on('emptyClick', function () {
      if (S.state.originFilter || S.state.regionKey) {
        S.setRegionFilter(null);
        S.setOriginFilter(null);
        SA.globe.applyFilter();
        flip();
      }
    });
    SA.globe.on('clusterHover', function (c, pos) {
      if (!c || !pos) { el.globeTip.classList.remove('show'); return; }
      var cat = (SA.CATEGORY_MAP[c.category] || {}).name || '';
      el.globeTip.innerHTML = '<b>' + esc(c.origin) + '</b><span>' + c.count + ' 款 · ' + esc(cat) + '</span>';
      el.globeTip.style.left = pos.x + 'px';
      el.globeTip.style.top = pos.y + 'px';
      el.globeTip.classList.add('show');
    });
  }

  /* ================= 数据源状态 ================= */
  function renderStatus(st) {
    if (st.state === 'loading') {
      if (el.loadList.querySelector('[data-id="' + st.id + '"]')) return;
      var d = document.createElement('div');
      d.className = 'load-item';
      d.setAttribute('data-id', st.id);
      d.innerHTML = '<span class="spin"></span><span class="li-name">' + esc(st.label) + '</span><span class="li-state">连接中…</span>';
      el.loadList.appendChild(d);
      return;
    }
    var node = el.loadList.querySelector('[data-id="' + st.id + '"]');
    if (!node) return;
    var sp = node.querySelector('.spin');
    if (sp) sp.remove();
    if (st.state === 'ok') {
      node.classList.add('ok');
      node.querySelector('.li-state').textContent = '✓ ' + st.count + ' 条';
    } else if (st.state === 'empty') {
      node.classList.add('warn');
      node.querySelector('.li-state').textContent = '⚠ 0 条（已降级）';
    } else if (st.state === 'error') {
      node.classList.add('err');
      node.querySelector('.li-state').textContent = '✕ 失败（已启用兜底数据）';
    } else {
      node.classList.add('warn');
      node.querySelector('.li-state').textContent = '⚠ 可选源不可用（已跳过）';
    }
  }

  function renderHud() {
    var st = S.state.statuses || [];
    el.hudSources.innerHTML = st.map(function (s) {
      var cls = s.state === 'ok' ? 'ok' : (s.state === 'error' ? 'err' : 'warn');
      return '<span class="src ' + cls + '" title="' + esc(s.desc + ' · ' + (s.error || s.count + ' 条')) + '"><i></i>' + esc(s.label) + '</span>';
    }).join('');
  }

  function hideLoading() {
    el.loading.classList.add('hidden');
    setTimeout(function () { el.loading.style.display = 'none'; }, 800);
  }

  /* ================= 主渲染 ================= */
  function render(state, reason) {
    lastReason = reason;
    syncTabs();
    syncHotRegions();
    if (reason === 'init' || reason === 'data') renderQuickFilter();
    if (reason === 'badge') { renderQuickFilter(); SA.globe.applyFilter(); }
    if (reason === 'init' || reason === 'category' || reason === 'data' ||
      reason === 'origin' || reason === 'region' || reason === 'clear') {
      renderKnowledge();
    }
    renderList();
    renderHud();
    var label = '';
    if (state.regionKey) {
      var r = SA.regionById(state.regionKey);
      label = r ? r.name : state.regionKey;
    } else if (state.originFilter) label = state.originFilter;
    if (label) {
      el.originChip.style.display = 'inline-flex';
      el.originChip.querySelector('span').textContent = label;
    } else el.originChip.style.display = 'none';

    Array.prototype.forEach.call(el.list.querySelectorAll('.item'), function (li) {
      li.classList.toggle('active', li.getAttribute('data-id') === state.selectedId);
    });
  }

  SA.ui = {
    init: init,
    renderStatus: renderStatus,
    hideLoading: hideLoading,
    flipKnowledge: flip,
    showDetail: showDetail,
    hideDetail: hideDetail
  };
})(window.SA);
