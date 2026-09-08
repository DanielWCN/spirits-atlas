/* =============================================================
 * store.js — 数据状态中心（视图无关）
 * 负责：索引、筛选、搜索、产地聚类。视图层只订阅变化，不直接改数据。
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  var state = {
    all: [],
    category: 'all',
    query: '',
    originFilter: null,   // 点击地球标记后的产地过滤
    regionKey: null,      // 产区百科 id（regions.js）
    selectedId: null,
    badges: [],           // 快速标签筛选：entry / veteran / value / collect
    sort: 'rating',
    statuses: [],
    ready: false
  };

  var listeners = [];

  function emit(reason) {
    listeners.forEach(function (fn) { fn(state, reason); });
  }

  function set(patch, reason) {
    var changed = false;
    Object.keys(patch).forEach(function (k) {
      if (state[k] !== patch[k]) { state[k] = patch[k]; changed = true; }
    });
    if (changed) emit(reason || 'update');
  }

  function setItems(items, statuses) {
    state.all = items || [];
    state.statuses = statuses || [];
    state.ready = true;
    emit('data');
  }

  /** 品类过滤 */
  function byCategory(list, cat) {
    if (!cat || cat === 'all') return list;
    return list.filter(function (i) { return i.category === cat; });
  }

  /** 模糊搜索：空格分词 AND 匹配，覆盖名称/品牌/产地/子类/风味/瓶身特征 */
  function byQuery(list, q) {
    var s = String(q || '').trim().toLowerCase();
    if (!s) return list;
    var tokens = s.split(/\s+/);
    return list.filter(function (i) {
      var t = i.searchText || '';
      return tokens.every(function (tk) { return t.indexOf(tk) !== -1; });
    });
  }

  /** 快速标签过滤：新手推荐 / 老炮儿推荐 / 高性价比 / 收藏级（多选取并集→交集为 AND） */
  function byBadge(list, badges) {
    if (!badges || !badges.length) return list;
    return list.filter(function (i) {
      var b = i.badges || [];
      return badges.every(function (x) { return b.indexOf(x) !== -1; });
    });
  }

  /**
   * 推荐指数：优先用 ratings.js 里有出处的权威评分（换算成百分制），
   * 没权威评分的才退回策展时的 5 分制印象分，最后才是 0。
   * 这样"按推荐指数排序"时，有据可查的酒款一定排在前面。
   */
  function scoreOf(i) {
    var r = SA.ratingOf ? SA.ratingOf(i.id) : null;
    if (r && r.max) return { auth: 1, v: (r.score / r.max) * 100 };
    return { auth: 0, v: (i.rating || 0) * 20 };
  }

  function sortList(list, sort) {
    var arr = list.slice();
    if (sort === 'name') {
      arr.sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
    } else if (sort === 'origin') {
      arr.sort(function (a, b) { return String(a.origin).localeCompare(String(b.origin)); });
    } else {
      arr.sort(function (a, b) {
        var A = scoreOf(a), B = scoreOf(b);
        if (A.auth !== B.auth) return B.auth - A.auth;   // 有权威评分的优先
        if (B.v !== A.v) return B.v - A.v;
        return String(a.name).localeCompare(String(b.name));
      });
    }
    return arr;
  }

  /** 当前列表（品类 + 搜索 + 产地过滤 + 产区分组 + 排序） */
  function getList() {
    var list = byCategory(state.all, state.category);
    list = byQuery(list, state.query);
    list = byBadge(list, state.badges);
    if (state.regionKey) {
      list = list.filter(function (i) { return i.region === state.regionKey; });
    }
    if (state.originFilter) {
      list = list.filter(function (i) { return i.origin === state.originFilter; });
    }
    return sortList(list, state.sort);
  }

  /** 品类内匹配搜索的条目 id 集合（用于地球高亮） */
  function getMatchedIds() {
    var list = byBadge(byQuery(byCategory(state.all, state.category), state.query), state.badges);
    var set = Object.create(null);
    list.forEach(function (i) { set[i.id] = 1; });
    return set;
  }

  /**
   * 产地聚类：把同一产地的酒款聚成一个地球标记
   * @param {string} [catOverride] 传入 'all' 可一次性构建全部品类的标记
   *   （地球只构建一次，之后靠 alpha 动画显隐，避免重建造成画面跳变）
   * @returns {Array} clusters
   */
  function getClusters(catOverride) {
    var cat = catOverride || state.category;
    var base = byCategory(state.all, cat);
    var matched = getMatchedIds();
    var map = Object.create(null);
    var order = [];

    base.forEach(function (it) {
      if (!it.hasGeo) return;
      var key = (it.origin || '未知产区') + '||' + it.category;
      if (!map[key]) {
        map[key] = {
          id: 'c-' + order.length,
          originKey: it.origin,
          origin: it.origin,
          category: it.category,
          country: it.country,
          lat: it.latitude,
          lon: it.longitude,
          count: 0,
          items: [],
          aging: 0,
          matchedCount: 0,
          topRating: 0
        };
        order.push(key);
      }
      var c = map[key];
      c.count++;
      c.items.push(it);
      c.aging += SA.agingScore(it);
      if (matched[it.id]) c.matchedCount++;
      if ((it.rating || 0) > c.topRating) { c.topRating = it.rating || 0; c.top = it; }
    });

    var clusters = order.map(function (k) {
      var c = map[k];
      c.aging = c.aging / Math.max(1, c.count);
      c.active = state.query ? c.matchedCount > 0 : true;
      return c;
    });

    // 同坐标多品类标记做微小螺旋偏移，避免完全重叠
    var seen = Object.create(null);
    clusters.forEach(function (c) {
      var key = c.lat.toFixed(2) + ',' + c.lon.toFixed(2);
      seen[key] = (seen[key] || 0);
      var n = seen[key]++;
      if (n > 0) {
        var ang = n * 2.4, rad = 0.9 + n * 0.35;
        c.lat += rad * Math.cos(ang) * 0.25;
        c.lon += rad * Math.sin(ang) * 0.25;
      }
    });

    return clusters;
  }

  function findById(id) {
    for (var i = 0; i < state.all.length; i++) if (state.all[i].id === id) return state.all[i];
    return null;
  }

  /** 单个条目是否命中当前搜索词 */
  function matchesQuery(item) {
    var s = String(state.query || '').trim().toLowerCase();
    if (!s) return true;
    var tokens = s.split(/\s+/);
    var t = item.searchText || '';
    return tokens.every(function (tk) { return t.indexOf(tk) !== -1; });
  }

  /** 地球标记是否处于激活状态（品类 + 搜索 + 产区 三重过滤） */
  function isClusterActive(cluster) {
    if (state.category !== 'all' && cluster.category !== state.category) return false;
    var items = cluster.items || [];
    if (state.regionKey) {
      for (var k = 0; k < items.length; k++) if (items[k].region === state.regionKey) return true;
      return false;
    }
    if (!state.query) return true;
    for (var i = 0; i < items.length; i++) if (matchesQuery(items[i])) return true;
    return false;
  }

  function getStats() {
    var total = state.all.length;
    var geo = state.all.filter(function (i) { return i.hasGeo; }).length;
    var byCat = Object.create(null);
    state.all.forEach(function (i) { byCat[i.category] = (byCat[i.category] || 0) + 1; });
    return { total: total, geo: geo, byCat: byCat };
  }

  SA.store = {
    state: state,
    subscribe: function (fn) { listeners.push(fn); return fn; },
    emit: emit,
    set: set,
    setItems: setItems,
    getList: getList,
    getClusters: getClusters,
    getMatchedIds: getMatchedIds,
    findById: findById,
    matchesQuery: matchesQuery,
    isClusterActive: isClusterActive,
    getStats: getStats,
    select: function (id, reason) { set({ selectedId: id }, reason || 'select'); },
    setCategory: function (c) { set({ category: c, originFilter: null, regionKey: null }, 'category'); },
    toggleBadge: function (b) {
      var arr = (state.badges || []).slice();
      var i = arr.indexOf(b);
      if (i === -1) arr.push(b); else arr.splice(i, 1);
      set({ badges: arr }, 'badge');
    },
    clearBadges: function () { set({ badges: [] }, 'badge'); },
    setQuery: function (q) { set({ query: q }, 'query'); },
    setOriginFilter: function (o) { set({ originFilter: o, regionKey: null }, 'origin'); },
    setRegionFilter: function (r) { set({ regionKey: r, originFilter: null }, 'region'); },
    setSort: function (s) { set({ sort: s }, 'sort'); },
    clearFilters: function () { set({ query: '', originFilter: null, regionKey: null }, 'clear'); }
  };
})(window.SA);
