/* =============================================================
 * config.js — 全局配置：品类定义、配色体系、数据源端点
 * 全部挂在 window.SA 命名空间下（非 ES Module，支持 file:// 直开）
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  /* ---------- 品类定义（颜色体系统一：知识卡 / 标签 / 地球标记共用） ---------- */
  SA.CATEGORIES = [
    { id: 'red',       name: '红葡萄酒',  short: '红酒', icon: '🍷', color: '#e11d48', rgb: [225, 29, 72] },
    { id: 'white',     name: '白葡萄酒',  short: '白葡萄酒', icon: '🥂', color: '#e6c34a', rgb: [230, 195, 74] },
    { id: 'sparkling', name: '起泡酒',    short: '起泡', icon: '🍾', color: '#6fd3e6', rgb: [111, 211, 230] },
    { id: 'whisky',    name: '威士忌',    short: '威士忌', icon: '🥃', color: '#f09922', rgb: [240, 153, 34] },
    { id: 'beer',      name: '啤酒/苹果酒', short: '啤酒', icon: '🍺', color: '#f6d365', rgb: [246, 211, 101] },
    { id: 'cocktail',  name: '鸡尾酒',    short: '鸡尾酒', icon: '🍸', color: '#c77dff', rgb: [199, 125, 255] },
    { id: 'fortified', name: '加强型酒',  short: '加强', icon: '🍯', color: '#c2683f', rgb: [194, 104, 63] },
    /* 东方谷物酒 —— 按 GB/T 17204-2021 定义：白酒是「以粮谷为原料、大曲/小曲/麸曲为糖化发酵剂，经蒸煮糖化发酵蒸馏而成的蒸馏酒」，
       与日本烧酎（shochu）、韩国烧酒（soju）是完全不同的品类，此前误写为「白酒（烧酒）」已更正 */
    { id: 'baijiu',    name: '中国白酒',  short: '白酒', icon: '🏺', color: '#dc2626', rgb: [220, 38, 38] },
    { id: 'sake',      name: '日本清酒',  short: '清酒', icon: '🍶', color: '#a8d8ea', rgb: [168, 216, 234] },
    { id: 'mijiu',     name: '黄酒 / 米酒 / 梅酒', short: '米酒', icon: '🌾', color: '#d4a76a', rgb: [212, 167, 106] },
    { id: 'shochu',    name: '烧酎 / 烧酒 / 马奶酒', short: '烧酎', icon: '🍥', color: '#9ca3af', rgb: [156, 163, 175] },
    { id: 'spirit',    name: '其他烈酒（龙舌兰/伏特加/金酒/朗姆）', short: '烈酒', icon: '🌵', color: '#84cc16', rgb: [132, 204, 22] }
  ];

  SA.CATEGORY_MAP = {};
  SA.CATEGORIES.forEach(function (c) { SA.CATEGORY_MAP[c.id] = c; });

  SA.DEFAULT_COLOR = '#8fb6ff';

  SA.colorOf = function (categoryId) {
    var c = SA.CATEGORY_MAP[categoryId];
    return c ? c.color : SA.DEFAULT_COLOR;
  };

  /* ---------- 真实数据源端点（全部已实测可用 + CORS 放行） ---------- */
  SA.ENDPOINTS = {
    /* 1. Open Brewery DB —— 全球啤酒厂/苹果酒厂 REST API，无需认证，自带经纬度 */
    brewery: 'https://api.openbrewerydb.org/v1/breweries?page=1&per_page=60',
    brewery2: 'https://api.openbrewerydb.org/v1/breweries?page=7&per_page=60',
    brewery3: 'https://api.openbrewerydb.org/v1/breweries?page=23&per_page=60',

    /* 2. WhiskyyDB/whisky-database（GitHub 开源，经 jsDelivr 分发，CORS *） */
    whiskyDistilleries: 'https://cdn.jsdelivr.net/gh/WhiskyyDB/whisky-database@main/samples/distilleries.csv',
    whiskySpirits: 'https://cdn.jsdelivr.net/gh/WhiskyyDB/whisky-database@main/samples/spirits.csv',

    /* 3. Open Food Facts 威士忌（ODbL 开放数据，作为威士忌补充源，失败自动降级） */
    offWhisky: 'https://world.openfoodfacts.org/api/v2/search?categories_tags=en:whisky&page_size=60&fields=code,product_name,brands,countries_tags,abv,image_front_small_url,labels_tags',

    /* 4. sampleapis.com/wines（GitHub jdorfman/awesome-json-datasets 收录的 Vivino 派生数据集） */
    wines: {
      red: 'https://api.sampleapis.com/wines/reds',
      white: 'https://api.sampleapis.com/wines/whites',
      sparkling: 'https://api.sampleapis.com/wines/sparkling',
      rose: 'https://api.sampleapis.com/wines/rose',
      port: 'https://api.sampleapis.com/wines/port',
      dessert: 'https://api.sampleapis.com/wines/dessert'
    },

    /* 5. TheCocktailDB —— 免费公开鸡尾酒 API */
    cocktailList: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail',
    cocktailLookup: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='
  };

  /* ---------- 地球贴图（three.js 官方仓库，经 jsDelivr 分发，CORS *） ---------- */
  SA.TEXTURES = {
    day: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r157/examples/textures/planets/earth_atmos_2048.jpg',
    night: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r157/examples/textures/planets/earth_lights_2048.png'
  };

  /* ---------- 每个数据源的取数上限（控制首屏性能） ---------- */
  SA.LIMITS = {
    winePerType: 70,   // 每种葡萄酒取 70 条（按评分排序后截取）
    beer: 150,
    whiskyOff: 40,
    cocktail: 44
  };

  /* ---------- 酒款图片：manifest 精准匹配 → 品类兜底 → 程序化 SVG 瓶图（默认全程序化，永不错配） ---------- */
  var PH_CACHE = {};

  /* 跳转到该酒款的实拍图搜索（不会错配，点击查看真实照片） */
  SA.imageSearchURL = function (item) {
    var q = encodeURIComponent(((item && (item.name || '')) + ' ' + ((item && item.brand) || '')).trim());
    return 'https://www.bing.com/images/search?q=' + q;
  };

  /* 8 种瓶身 shape —— 按品类映射到不同形状+封口+丝印位置 */
  var SHAPES = {
    /* 威士忌方瓶：方肩 + 短粗瓶颈 + 软木塞 */
    square: {
      body: function (w, h) {
        return 'M' + (w * .30) + ' ' + (h * .34) +
          ' L' + (w * .30) + ' ' + (h * .88) +
          ' Q' + (w * .30) + ' ' + (h * .94) + ' ' + (w * .36) + ' ' + (h * .94) +
          ' L' + (w * .64) + ' ' + (h * .94) +
          ' Q' + (w * .70) + ' ' + (h * .94) + ' ' + (w * .70) + ' ' + (h * .88) +
          ' L' + (w * .70) + ' ' + (h * .34) +
          ' L' + (w * .66) + ' ' + (h * .30) +
          ' L' + (w * .34) + ' ' + (h * .30) + ' Z';
      },
      shoulder: function (w, h) {
        return 'M' + (w * .34) + ' ' + (h * .30) + ' L' + (w * .36) + ' ' + (h * .24) +
          ' L' + (w * .64) + ' ' + (h * .24) + ' L' + (w * .66) + ' ' + (h * .30) + ' Z';
      },
      neck: function (w, h) {
        return 'M' + (w * .40) + ' ' + (h * .24) +
          ' L' + (w * .40) + ' ' + (h * .14) +
          ' L' + (w * .60) + ' ' + (h * .14) +
          ' L' + (w * .60) + ' ' + (h * .24) + ' Z';
      },
      cap: 'cork',        // 软木塞
      liquid: .55,         // 酒液高度
      label: { x: .34, y: .52, w: .32, h: .22 },
      shineX: .38
    },
    /* 葡萄酒波尔多瓶：高肩 + 长瓶颈 + 软木塞 */
    bordeaux: {
      body: function (w, h) {
        return 'M' + (w * .34) + ' ' + (h * .34) +
          ' L' + (w * .34) + ' ' + (h * .90) +
          ' Q' + (w * .34) + ' ' + (h * .94) + ' ' + (w * .40) + ' ' + (h * .94) +
          ' L' + (w * .60) + ' ' + (h * .94) +
          ' Q' + (w * .66) + ' ' + (h * .94) + ' ' + (w * .66) + ' ' + (h * .90) +
          ' L' + (w * .66) + ' ' + (h * .34) +
          ' L' + (w * .62) + ' ' + (h * .30) +
          ' L' + (w * .38) + ' ' + (h * .30) + ' Z';
      },
      shoulder: function (w, h) {
        return 'M' + (w * .38) + ' ' + (h * .30) +
          ' L' + (w * .42) + ' ' + (h * .22) +
          ' L' + (w * .58) + ' ' + (h * .22) +
          ' L' + (w * .62) + ' ' + (h * .30) + ' Z';
      },
      neck: function (w, h) {
        return 'M' + (w * .45) + ' ' + (h * .22) +
          ' L' + (w * .45) + ' ' + (h * .10) +
          ' L' + (w * .55) + ' ' + (h * .10) +
          ' L' + (w * .55) + ' ' + (h * .22) + ' Z';
      },
      cap: 'cork',
      liquid: .58,
      label: { x: .34, y: .50, w: .32, h: .20 },
      shineX: .42
    },
    /* 白酒圆柱瓶：直筒 + 短颈 + 红色封口 */
    baijiu: {
      body: function (w, h) {
        return 'M' + (w * .35) + ' ' + (h * .30) +
          ' L' + (w * .35) + ' ' + (h * .90) +
          ' Q' + (w * .35) + ' ' + (h * .94) + ' ' + (w * .41) + ' ' + (h * .94) +
          ' L' + (w * .59) + ' ' + (h * .94) +
          ' Q' + (w * .65) + ' ' + (h * .94) + ' ' + (w * .65) + ' ' + (h * .90) +
          ' L' + (w * .65) + ' ' + (h * .30) + ' Z';
      },
      shoulder: function (w, h) { return ''; },
      neck: function (w, h) {
        return 'M' + (w * .44) + ' ' + (h * .30) +
          ' L' + (w * .44) + ' ' + (h * .20) +
          ' L' + (w * .56) + ' ' + (h * .20) +
          ' L' + (w * .56) + ' ' + (h * .30) + ' Z';
      },
      cap: 'redseal',
      liquid: .60,
      label: { x: .30, y: .50, w: .40, h: .25 },
      shineX: .40
    },
    /* 日式清酒一升瓶：圆肚 + 细口 */
    tokkuri: {
      body: function (w, h) {
        return 'M' + (w * .30) + ' ' + (h * .38) +
          ' Q' + (w * .28) + ' ' + (h * .55) + ' ' + (w * .30) + ' ' + (h * .78) +
          ' Q' + (w * .30) + ' ' + (h * .92) + ' ' + (w * .36) + ' ' + (h * .93) +
          ' L' + (w * .64) + ' ' + (h * .93) +
          ' Q' + (w * .70) + ' ' + (h * .92) + ' ' + (w * .70) + ' ' + (h * .78) +
          ' Q' + (w * .72) + ' ' + (h * .55) + ' ' + (w * .70) + ' ' + (h * .38) +
          ' L' + (w * .66) + ' ' + (h * .34) +
          ' L' + (w * .34) + ' ' + (h * .34) + ' Z';
      },
      shoulder: function (w, h) {
        return 'M' + (w * .34) + ' ' + (h * .34) + ' L' + (w * .38) + ' ' + (h * .28) +
          ' L' + (w * .62) + ' ' + (h * .28) + ' L' + (w * .66) + ' ' + (h * .34) + ' Z';
      },
      neck: function (w, h) {
        return 'M' + (w * .45) + ' ' + (h * .28) +
          ' L' + (w * .45) + ' ' + (h * .16) +
          ' L' + (w * .55) + ' ' + (h * .16) +
          ' L' + (w * .55) + ' ' + (h * .28) + ' Z';
      },
      cap: 'paper',
      liquid: .62,
      label: { x: .32, y: .54, w: .36, h: .22 },
      shineX: .38
    },
    /* 黄酒坛：广口 + 鼓肚 + 棕色 */
    flask: {
      body: function (w, h) {
        return 'M' + (w * .30) + ' ' + (h * .36) +
          ' Q' + (w * .24) + ' ' + (h * .55) + ' ' + (w * .30) + ' ' + (h * .80) +
          ' Q' + (w * .30) + ' ' + (h * .92) + ' ' + (w * .36) + ' ' + (h * .93) +
          ' L' + (w * .64) + ' ' + (h * .93) +
          ' Q' + (w * .70) + ' ' + (h * .92) + ' ' + (w * .70) + ' ' + (h * .80) +
          ' Q' + (w * .76) + ' ' + (h * .55) + ' ' + (w * .70) + ' ' + (h * .36) +
          ' L' + (w * .66) + ' ' + (h * .30) +
          ' L' + (w * .34) + ' ' + (h * .30) + ' Z';
      },
      shoulder: function (w, h) {
        return 'M' + (w * .34) + ' ' + (h * .30) + ' L' + (w * .40) + ' ' + (h * .24) +
          ' L' + (w * .60) + ' ' + (h * .24) + ' L' + (w * .66) + ' ' + (h * .30) + ' Z';
      },
      neck: function (w, h) {
        return 'M' + (w * .42) + ' ' + (h * .24) +
          ' L' + (w * .42) + ' ' + (h * .16) +
          ' L' + (w * .58) + ' ' + (h * .16) +
          ' L' + (w * .58) + ' ' + (h * .24) + ' Z';
      },
      cap: 'cork',
      liquid: .70,
      label: { x: .30, y: .54, w: .40, h: .22 },
      shineX: .38
    },
    /* 标准烈酒瓶：高瓶 + 螺纹盖 */
    tall: {
      body: function (w, h) {
        return 'M' + (w * .34) + ' ' + (h * .32) +
          ' L' + (w * .34) + ' ' + (h * .90) +
          ' Q' + (w * .34) + ' ' + (h * .94) + ' ' + (w * .40) + ' ' + (h * .94) +
          ' L' + (w * .60) + ' ' + (h * .94) +
          ' Q' + (w * .66) + ' ' + (h * .94) + ' ' + (w * .66) + ' ' + (h * .90) +
          ' L' + (w * .66) + ' ' + (h * .32) +
          ' L' + (w * .62) + ' ' + (h * .28) +
          ' L' + (w * .38) + ' ' + (h * .28) + ' Z';
      },
      shoulder: function (w, h) {
        return 'M' + (w * .38) + ' ' + (h * .28) +
          ' L' + (w * .42) + ' ' + (h * .22) +
          ' L' + (w * .58) + ' ' + (h * .22) +
          ' L' + (w * .62) + ' ' + (h * .28) + ' Z';
      },
      neck: function (w, h) {
        return 'M' + (w * .46) + ' ' + (h * .22) +
          ' L' + (w * .46) + ' ' + (h * .12) +
          ' L' + (w * .54) + ' ' + (h * .12) +
          ' L' + (w * .54) + ' ' + (h * .22) + ' Z';
      },
      cap: 'screw',
      liquid: .55,
      label: { x: .32, y: .50, w: .36, h: .22 },
      shineX: .40
    },
    /* 啤酒瓶：细长 + 短颈 + 金属盖 */
    beer: {
      body: function (w, h) {
        return 'M' + (w * .32) + ' ' + (h * .30) +
          ' L' + (w * .32) + ' ' + (h * .92) +
          ' Q' + (w * .32) + ' ' + (h * .95) + ' ' + (w * .38) + ' ' + (h * .95) +
          ' L' + (w * .62) + ' ' + (h * .95) +
          ' Q' + (w * .68) + ' ' + (h * .95) + ' ' + (w * .68) + ' ' + (h * .92) +
          ' L' + (w * .68) + ' ' + (h * .30) +
          ' L' + (w * .64) + ' ' + (h * .26) +
          ' L' + (w * .36) + ' ' + (h * .26) + ' Z';
      },
      shoulder: function (w, h) { return ''; },
      neck: function (w, h) {
        return 'M' + (w * .42) + ' ' + (h * .26) +
          ' L' + (w * .42) + ' ' + (h * .16) +
          ' L' + (w * .58) + ' ' + (h * .16) +
          ' L' + (w * .58) + ' ' + (h * .26) + ' Z';
      },
      cap: 'metal',
      liquid: .85,
      label: { x: .32, y: .50, w: .36, h: .22 },
      shineX: .38
    },
    /* 鸡尾酒杯：V 形 + 杯脚 */
    cocktail: {
      body: function (w, h) {
        return 'M' + (w * .22) + ' ' + (h * .30) +
          ' L' + (w * .50) + ' ' + (h * .78) +
          ' L' + (w * .78) + ' ' + (h * .30) + ' Z';
      },
      shoulder: function (w, h) { return ''; },
      neck: function (w, h) {
        return 'M' + (w * .49) + ' ' + (h * .78) +
          ' L' + (w * .49) + ' ' + (h * .92) +
          ' L' + (w * .51) + ' ' + (h * .92) +
          ' L' + (w * .51) + ' ' + (h * .78) + ' Z';
      },
      cap: 'rim',
      liquid: .25,
      label: { x: .40, y: .44, w: .20, h: .14 },
      shineX: .40
    }
  };

  /* 品类 → 瓶身 shape 映射 */
  var CAT_SHAPE = {
    red: 'bordeaux', white: 'bordeaux', sparkling: 'bordeaux', fortified: 'bordeaux',
    whisky: 'square', cocktail: 'cocktail',
    beer: 'beer', baijiu: 'baijiu', sake: 'tokkuri', mijiu: 'flask', shochu: 'tall', spirit: 'tall'
  };

  /* 封口 SVG 片段 */
  function capSVG(kind, w, h, c) {
    if (kind === 'cork') {
      return '<rect x="' + (w * .40) + '" y="' + (h * .085) + '" width="' + (w * .20) + '" height="' + (h * .055) + '" fill="#8b5a2b" rx="1"/>' +
             '<rect x="' + (w * .395) + '" y="' + (h * .075) + '" width="' + (w * .21) + '" height="' + (h * .012) + '" fill="#5a3a1a" rx=".5"/>';
    }
    if (kind === 'redseal') {
      return '<rect x="' + (w * .40) + '" y="' + (h * .17) + '" width="' + (w * .20) + '" height="' + (h * .035) + '" fill="#dc2626" rx=".5"/>' +
             '<rect x="' + (w * .395) + '" y="' + (h * .18) + '" width="' + (w * .21) + '" height="' + (h * .008) + '" fill="#7f1d1d" rx=".5"/>' +
             '<line x1="' + (w * .40) + '" y1="' + (h * .14) + '" x2="' + (w * .40) + '" y2="' + (h * .20) + '" stroke="#dc2626" stroke-width="1.5" opacity=".7"/>' +
             '<line x1="' + (w * .60) + '" y1="' + (h * .14) + '" x2="' + (w * .60) + '" y2="' + (h * .20) + '" stroke="#dc2626" stroke-width="1.5" opacity=".7"/>';
    }
    if (kind === 'screw') {
      return '<rect x="' + (w * .455) + '" y="' + (h * .105) + '" width="' + (w * .09) + '" height="' + (h * .025) + "' fill='" + c + "' rx='.5'/>" +
             '<rect x="' + (w * .453) + '" y="' + (h * .10) + '" width="' + (w * .094) + '" height="' + (h * .008) + '" fill="#1f2937" rx=".5"/>';
    }
    if (kind === 'paper') {
      return '<rect x="' + (w * .44) + '" y="' + (h * .135) + '" width="' + (w * .12) + '" height="' + (h * .030) + '" fill="#f5f5dc" stroke="#888" stroke-width=".5"/>' +
             '<line x1="' + (w * .50) + '" y1="' + (h * .14) + '" x2="' + (w * .50) + '" y2="' + (h * .165) + '" stroke="#888" stroke-width=".5"/>';
    }
    if (kind === 'metal') {
      return '<rect x="' + (w * .418) + '" y="' + (h * .155) + '" width="' + (w * .164) + '" height="' + (h * .012) + '" fill="#9ca3af" rx=".5"/>' +
             '<rect x="' + (w * .42) + '" y="' + (h * .14) + '" width="' + (w * .16) + '" height="' + (h * .015) + '" fill="#d1d5db" rx=".5"/>';
    }
    if (kind === 'rim') {
      return '<ellipse cx="' + (w * .50) + '" cy="' + (h * .30) + '" rx="' + (w * .28) + '" ry="' + (h * .012) + '" fill="#cbd5e1" stroke="#64748b" stroke-width=".5"/>';
    }
    return '';
  }

  /* 真实图 manifest：精准匹配 id → URL。
   * 当前为空：国内网络拿不到「免 key + 可按酒款名搜」的图源
   *   Pexels / Unsplash 搜索 API 都要 key（已实测 401）
   *   Wikimedia / Openverse 直连全部超时（已实测 60s 无响应）
   * 与其按酒名模糊匹配导致张冠李戴（茅台配成别的瓶），
   * 不如默认全部用程序化瓶型图（8 种 shape，按品类区分，永不错配/永不 404）。
   * 拿到可用图源后，往 MANIFEST 塞 { 'maotai-fly': 'https://...' } 即可生效。
   * 或者填 CATEGORY_FALLBACK 给每类放 1 张通用图（需先 curl 验证内容是酒类再填）。 */
  var MANIFEST = {};
  var CATEGORY_FALLBACK = {};
  /* true = 远程数据源自带的真实图优先（已逐一实测可直连）：
   *   sampleapis Wines  → images.vivino.com 酒标实拍（718 条全带图）
   *   Open Food Facts   → images.openfoodfacts.org 瓶身正面实拍（704 条）
   *   TheCocktailDB     → strDrinkThumb 鸡尾酒实拍
   * 加载失败会自动回落到品类占位图（见 ui.js fixThumbs），不会出现裂图。 */
  SA.USE_REMOTE_IMAGES = true;
  SA.MANIFEST = MANIFEST;
  SA.CATEGORY_FALLBACK = CATEGORY_FALLBACK;

  /* 本地真实图库：id → assets/bottles/{id}.jpg
   * 129 款名酒的真实产品图（360 图搜抓取，人工相关性校验）。
   * 这里比 MANIFEST 优先级更高：local URL 必能加载，零网络依赖。 */
      var LOCAL_IMAGES = {
    'c-ardbeg10'              : 'assets/bottles/c-ardbeg10.jpg',
    'c-ardbeg-uigeadail'      : 'assets/bottles/c-ardbeg-uigeadail.jpg',
    'c-laphroaig10'           : 'assets/bottles/c-laphroaig10.jpg',
    'c-lagavulin16'           : 'assets/bottles/c-lagavulin16.jpg',
    'c-caolila12'             : 'assets/bottles/c-caolila12.jpg',
    'c-kilchoman'             : 'assets/bottles/c-kilchoman.jpg',
    'c-bunnahabhain12'        : 'assets/bottles/c-bunnahabhain12.jpg',
    'c-macallan12'            : 'assets/bottles/c-macallan12.jpg',
    'c-glenfiddich12'         : 'assets/bottles/c-glenfiddich12.jpg',
    'c-balvenie12'            : 'assets/bottles/c-balvenie12.jpg',
    'c-oban14'                : 'assets/bottles/c-oban14.jpg',
    'c-talisker10'            : 'assets/bottles/c-talisker10.jpg',
    'c-hp12'                  : 'assets/bottles/c-hp12.jpg',
    'c-springbank10'          : 'assets/bottles/c-springbank10.jpg',
    'c-yamazaki12'            : 'assets/bottles/c-yamazaki12.jpg',
    'c-hibiki'                : 'assets/bottles/c-hibiki.jpg',
    'c-nikka-ftb'             : 'assets/bottles/c-nikka-ftb.jpg',
    'c-redbreast12'           : 'assets/bottles/c-redbreast12.jpg',
    'c-moutai-feitian'        : 'assets/bottles/c-moutai-feitian.jpg',
    'c-wuliangye-8th'         : 'assets/bottles/c-wuliangye-8th.jpg',
    'c-fenjiu-qinghua20'      : 'assets/bottles/c-fenjiu-qinghua20.jpg',
    'c-guojiao1573'           : 'assets/bottles/c-guojiao1573.jpg',
    'c-jiannanchun-crystal'   : 'assets/bottles/c-jiannanchun-crystal.jpg',
    'c-hengshui-laobaigan'    : 'assets/bottles/c-hengshui-laobaigan.jpg',
    'c-hetaowang'             : 'assets/bottles/c-hetaowang.jpg',
    'c-mengguwang'            : 'assets/bottles/c-mengguwang.jpg',
    'c-bowmore12'             : 'assets/bottles/c-bowmore12.jpg',
    'c-laddie'                : 'assets/bottles/c-laddie.jpg',
    'c-aberlour'              : 'assets/bottles/c-aberlour.jpg',
    'c-yoichi'                : 'assets/bottles/c-yoichi.jpg',
    'c-buffalotrace'          : 'assets/bottles/c-buffalotrace.jpg',
    'c-makers46'              : 'assets/bottles/c-makers46.jpg',
    'c-wt101'                 : 'assets/bottles/c-wt101.jpg',
    'c-lynchbages'            : 'assets/bottles/c-lynchbages.jpg',
    'c-penfolds389'           : 'assets/bottles/c-penfolds389.jpg',
    'c-catena'                : 'assets/bottles/c-catena.jpg',
    'c-opusone'               : 'assets/bottles/c-opusone.jpg',
    'c-tondonia'              : 'assets/bottles/c-tondonia.jpg',
    'c-cloudybay'             : 'assets/bottles/c-cloudybay.jpg',
    'c-dp2012'                : 'assets/bottles/c-dp2012.jpg',
    'c-hennessy-xo'           : 'assets/bottles/c-hennessy-xo.jpg',
    'c-rochefort10'           : 'assets/bottles/c-rochefort10.jpg',
    'c-chimay-bleue'          : 'assets/bottles/c-chimay-bleue.jpg',
    'c-weihen'                : 'assets/bottles/c-weihen.jpg',
    'c-urquell'               : 'assets/bottles/c-urquell.jpg',
    'c-snpa'                  : 'assets/bottles/c-snpa.jpg',
    'c-guiness'               : 'assets/bottles/c-guiness.jpg',
    'c-negroni'               : 'assets/bottles/c-negroni.jpg',
    'c-oldfashioned'          : 'assets/bottles/c-oldfashioned.jpg',
    'c-mojito'                : 'assets/bottles/c-mojito.jpg',
    'c-yanghe-m6plus'         : 'assets/bottles/c-yanghe-m6plus.jpg',
    'c-gujing-20'             : 'assets/bottles/c-gujing-20.jpg',
    'c-xijiu-1988'            : 'assets/bottles/c-xijiu-1988.jpg',
    'c-dassai-23'             : 'assets/bottles/c-dassai-23.jpg',
    'c-juyondai-honmaru'      : 'assets/bottles/c-juyondai-honmaru.jpg',
    'c-kokuryu'               : 'assets/bottles/c-kokuryu.jpg',
    'c-hakutsuru'             : 'assets/bottles/c-hakutsuru.jpg',
    'c-guyue-5y'              : 'assets/bottles/c-guyue-5y.jpg',
    'c-kuaijishan-5y'         : 'assets/bottles/c-kuaijishan-5y.jpg',
    'c-choya'                 : 'assets/bottles/c-choya.jpg',
    'c-hongxing-erguotou'     : 'assets/bottles/c-hongxing-erguotou.jpg',
    'c-niulanshan'            : 'assets/bottles/c-niulanshan.jpg',
    'c-jinjiu'                : 'assets/bottles/c-jinjiu.jpg',
    'c-liulingzui'            : 'assets/bottles/c-liulingzui.jpg',
    'c-beidacang'             : 'assets/bottles/c-beidacang.jpg',
    'c-yushuqian'             : 'assets/bottles/c-yushuqian.jpg',
    'c-laolongkou'            : 'assets/bottles/c-laolongkou.jpg',
    'c-yanghe-blue'           : 'assets/bottles/c-yanghe-blue.jpg',
    'c-shuanggou'             : 'assets/bottles/c-shuanggou.jpg',
    'c-jinshiyuan'            : 'assets/bottles/c-jinshiyuan.jpg',
    'c-gujinggong'            : 'assets/bottles/c-gujinggong.jpg',
    'c-kouzijiao'             : 'assets/bottles/c-kouzijiao.jpg',
    'c-yingjia'               : 'assets/bottles/c-yingjia.jpg',
    'c-jingzhi'               : 'assets/bottles/c-jingzhi.jpg',
    'c-kongfujia'             : 'assets/bottles/c-kongfujia.jpg',
    'c-shaoxing-huangjiu'     : 'assets/bottles/c-shaoxing-huangjiu.jpg',
    'c-fumao'                 : 'assets/bottles/c-fumao.jpg',
    'c-shanghai-laolao'       : 'assets/bottles/c-shanghai-laolao.jpg',
    'c-baiyunbian'            : 'assets/bottles/c-baiyunbian.jpg',
    'c-jingjiu'               : 'assets/bottles/c-jingjiu.jpg',
    'c-jiugui'                : 'assets/bottles/c-jiugui.jpg',
    'c-wuling'                : 'assets/bottles/c-wuling.jpg',
    'c-yubingchao'            : 'assets/bottles/c-yubingchao.jpg',
    'c-jiujiang-shuangzheng'  : 'assets/bottles/c-jiujiang-shuangzheng.jpg',
    'c-changle-shao'          : 'assets/bottles/c-changle-shao.jpg',
    'c-sanhua'                : 'assets/bottles/c-sanhua.jpg',
    'c-yedao-lugui'           : 'assets/bottles/c-yedao-lugui.jpg',
    'c-jiannanchun'           : 'assets/bottles/c-jiannanchun.jpg',
    'c-langjiu-honghua'       : 'assets/bottles/c-langjiu-honghua.jpg',
    'c-shede'                 : 'assets/bottles/c-shede.jpg',
    'c-shuijingfang'          : 'assets/bottles/c-shuijingfang.jpg',
    'c-dongjiu'               : 'assets/bottles/c-dongjiu.jpg',
    'c-yunjiu'                : 'assets/bottles/c-yunjiu.jpg',
    'c-yanglin-feijiu'        : 'assets/bottles/c-yanglin-feijiu.jpg',
    'c-tianyoude'             : 'assets/bottles/c-tianyoude.jpg',
    'c-yilite'                : 'assets/bottles/c-yilite.jpg',
    'c-jinhui'                : 'assets/bottles/c-jinhui.jpg',
    'c-jinmen-gaoliang'       : 'assets/bottles/c-jinmen-gaoliang.jpg',
    'c-hong-kong-wugu'        : 'assets/bottles/c-hong-kong-wugu.jpg',
    'c-korea-makgeolli'       : 'assets/bottles/c-korea-makgeolli.jpg',
    'c-mongolia-airag'        : 'assets/bottles/c-mongolia-airag.jpg',
    'c-ouzo'                  : 'assets/bottles/c-ouzo.jpg',
    'c-raki'                  : 'assets/bottles/c-raki.jpg',
    'c-amrut-india'           : 'assets/bottles/c-amrut-india.jpg',
    'c-gin-london'            : 'assets/bottles/c-gin-london.jpg',
    'c-laphroaig-qc'          : 'assets/bottles/c-laphroaig-qc.jpg',
    'c-laphroaig-cs'          : 'assets/bottles/c-laphroaig-cs.jpg',
    'c-glenfarclas-15'        : 'assets/bottles/c-glenfarclas-15.jpg',
    'c-arran-10'              : 'assets/bottles/c-arran-10.jpg',
    'c-auchentoshan-3w'       : 'assets/bottles/c-auchentoshan-3w.jpg',
    'c-jameson-original'      : 'assets/bottles/c-jameson-original.jpg',
    'c-xifeng-lvp'            : 'assets/bottles/c-xifeng-lvp.jpg',
    'c-loosen'                : 'assets/bottles/c-loosen.jpg',
    'c-krug'                  : 'assets/bottles/c-krug.jpg',
    'c-margarita'             : 'assets/bottles/c-margarita.jpg',
    'c-langjiu-qinghualang'   : 'assets/bottles/c-langjiu-qinghualang.jpg',
    'c-shede-sh'              : 'assets/bottles/c-shede-sh.jpg',
    'c-dassai-39'             : 'assets/bottles/c-dassai-39.jpg',
    'c-tapai-shougong'        : 'assets/bottles/c-tapai-shougong.jpg',
    'c-sitir'                 : 'assets/bottles/c-sitir.jpg',
    'c-chengang'              : 'assets/bottles/c-chengang.jpg',
    'c-pisco-peru'            : 'assets/bottles/c-pisco-peru.jpg',
    'c-rum-jamaica'           : 'assets/bottles/c-rum-jamaica.jpg',
    'c-vodka-poland'          : 'assets/bottles/c-vodka-poland.jpg',
    'c-canadian-whisky'       : 'assets/bottles/c-canadian-whisky.jpg',
    'c-chivas-12'             : 'assets/bottles/c-chivas-12.jpg',
    'c-bushmills-12'          : 'assets/bottles/c-bushmills-12.jpg',
    'c-jack-daniels-no7'      : 'assets/bottles/c-jack-daniels-no7.jpg',
    'c-songhe'                : 'assets/bottles/c-songhe.jpg'
  };
  SA.LOCAL_IMAGES = LOCAL_IMAGES;

  /**
   * 取酒款图片 URL：本地真实图 → 远程 manifest → 品类兜底 → 程序化 SVG
   */
  SA.bottleImage = function (item, size) {
    if (!item) return SA.bottlePlaceholder({ category: 'all' }, size || 44);
    /* 1. 本地真实图（必中） */
    if (LOCAL_IMAGES[item.id]) return LOCAL_IMAGES[item.id];
    if (SA.USE_REMOTE_IMAGES) {
      if (MANIFEST[item.id] && /^https?:\/\//.test(MANIFEST[item.id])) return MANIFEST[item.id];
      var real = item.image_url || item.image || '';
      if (real && /^https?:\/\//.test(real)) return real;
      var cat = item.category || '';
      if (CATEGORY_FALLBACK[cat]) return CATEGORY_FALLBACK[cat];
    }
    return SA.bottlePlaceholder(item, size || 44);
  };

  /* 图搜跳转：用户点"查看实拍"按钮 → Bing 图片搜索，绝不错配 */
  SA.imageSearchURL = function (item) {
    var q = encodeURIComponent(((item && (item.name || '')) + ' ' + ((item && item.brand) || '')).trim());
    return 'https://www.bing.com/images/search?q=' + q;
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bottleTag(item) {
    if (!item) return '?';
    var src = ((item.brand || '') + ' ' + (item.distillery || '') + ' ' + (item.name || '')).trim();
    var m = src.match(/[A-Z]{2,5}/);
    if (m) return m[0].slice(0, 4);
    var cjk = src.match(/[\u4e00-\u9fa5]/g);
    if (cjk && cjk.length >= 2) return cjk.slice(0, 2).join('');
    if (cjk && cjk.length === 1) return cjk[0];
    return 'SA';
  }
  function bottleVintage(item) {
    if (!item) return '';
    var src = (item.name || '') + ' ' + (item.sub_type || '');
    var m = src.match(/\b(18|19|20)\d{2}\b/);
    return m ? m[0] : '';
  }

  /** 程序化 SVG 瓶图：按品类选 shape，画瓶身+瓶颈+封口+酒液+丝印标签+玻璃高光 */
  SA.bottlePlaceholder = function (item, size) {
    size = size || 96;
    var catId = (item && item.category) || 'all';
    var shapeKey = CAT_SHAPE[catId] || 'tall';
    var SH = SHAPES[shapeKey];
    var detailed = size >= 80 && item && item.id;
    var key = (detailed ? 'd|' : 'g|') + shapeKey + '|' + catId + (detailed ? '|' + item.id : '') + '@' + size;
    if (PH_CACHE[key]) return PH_CACHE[key];

    var cat = SA.CATEGORY_MAP[catId] || { color: '#8fb6ff', icon: '🍷' };
    var c = cat.color || '#8fb6ff';
    var w = size, h = size;
    var body = SH.body(w, h);
    var neck = SH.neck(w, h);
    var shoulder = SH.shoulder ? SH.shoulder(w, h) : '';
    var liquid = SH.liquid;
    var lab = SH.label;
    var sx = SH.shineX || .4;

    /* 酒液：取瓶身底部上浮 30%~80% 高度，按液体比例画填充 */
    var bodyTop = h * .34;       // 瓶身顶部 y
    var bodyBot = h * .93;       // 瓶身底部 y
    var liqTop = bodyTop + (bodyBot - bodyTop) * (1 - liquid);
    /* 酒液填充路径：复用 body，但在顶部裁剪 */
    var liquidPath = body;

    /* 封口：按 cap 类型 */
    var cap = capSVG(SH.cap, w, h, c);

    /* 丝印标签（仅 detailed 模式） */
    var labelHTML = '';
    if (detailed) {
      var lx = w * lab.x, ly = w * lab.y, lw = w * lab.w, lh = w * lab.h;
      var tag = bottleTag(item);
      var vin = bottleVintage(item);
      var tagSize = Math.max(6, Math.min(13, lw * .34));
      labelHTML =
        '<rect x="' + lx + '" y="' + ly + '" width="' + lw + '" height="' + lh + '" rx="1" fill="#fff7e8" fill-opacity=".96" stroke="' + c + '" stroke-opacity=".25" stroke-width=".5"/>' +
        '<text x="' + (lx + lw / 2) + '" y="' + (ly + lh * .42) + '" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="' + tagSize + '" fill="' + c + '" letter-spacing=".5">' + esc(tag) + '</text>' +
        (vin ? '<text x="' + (lx + lw / 2) + '" y="' + (ly + lh * .72) + '" text-anchor="middle" font-family="Georgia,serif" font-size="' + (tagSize * .6) + '" fill="#6b6b6b">' + esc(vin) + '</text>' : '') +
        '<line x1="' + (lx + lw * .1) + '" y1="' + (ly + lh * .82) + '" x2="' + (lx + lw * .9) + '" y2="' + (ly + lh * .82) + '" stroke="' + c + '" stroke-opacity=".5" stroke-width=".4"/>';
    }

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs>' +
        '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + c + '" stop-opacity=".22"/>' +
          '<stop offset="1" stop-color="' + c + '" stop-opacity=".04"/>' +
        '</linearGradient>' +
        '<linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="' + c + '" stop-opacity=".18"/>' +
          '<stop offset=".45" stop-color="' + c + '" stop-opacity=".75"/>' +
          '<stop offset="1" stop-color="' + c + '" stop-opacity=".30"/>' +
        '</linearGradient>' +
        '<linearGradient id="liq' + key.replace(/[^a-z0-9]/gi, '_') + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + c + '" stop-opacity=".85"/>' +
          '<stop offset="1" stop-color="' + c + '" stop-opacity=".55"/>' +
        '</linearGradient>' +
        '<linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".22"/>' +
          '<stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<radialGradient id="floor" cx=".5" cy="1" r=".5">' +
          '<stop offset="0" stop-color="#000" stop-opacity=".35"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<clipPath id="bodyClip' + key.replace(/[^a-z0-9]/gi, '_') + '"><path d="' + body + '"/></clipPath>' +
      '</defs>' +
      '<rect width="' + w + '" height="' + h + '" rx="' + (w * .12) + '" fill="#0b1120"/>' +
      '<rect x="1" y="1" width="' + (w - 2) + '" height="' + (h - 2) + '" rx="' + (w * .12) + '" fill="url(#bg)"/>' +
      /* 投影（瓶底） */
      '<ellipse cx="' + (w * .5) + '" cy="' + (h * .95) + '" rx="' + (w * .30) + '" ry="' + (h * .025) + '" fill="url(#floor)"/>' +
      /* 瓶身玻璃 */
      '<path d="' + body + '" fill="url(#glass)" stroke="' + c + '" stroke-opacity=".55" stroke-width=".7"/>' +
      /* 酒液填充（剪裁到瓶身内） */
      '<g clip-path="url(#bodyClip' + key.replace(/[^a-z0-9]/gi, '_') + ')">' +
        '<rect x="0" y="' + liqTop + '" width="' + w + '" height="' + (h - liqTop) + '" fill="url(#liq' + key.replace(/[^a-z0-9]/gi, '_') + ')"/>' +
      '</g>' +
      /* 玻璃高光（左竖线） */
      '<rect x="' + (w * sx) + '" y="' + (h * .36) + '" width="' + (w * .035) + '" height="' + (h * .50) + '" rx="1" fill="#fff" fill-opacity=".18"/>' +
      /* 玻璃高光（顶部弧） */
      '<path d="' + body + '" fill="url(#shine)"/>' +
      /* 肩部 */
      (shoulder ? '<path d="' + shoulder + '" fill="' + c + '" fill-opacity=".5"/>' : '') +
      /* 瓶颈 */
      '<path d="' + neck + '" fill="' + c + '" fill-opacity=".7"/>' +
      '<path d="' + neck + '" fill="none" stroke="' + c + '" stroke-opacity=".4" stroke-width=".5"/>' +
      /* 封口 */
      cap +
      /* 标签 */
      labelHTML +
      (detailed ? '' : '<text x="50%" y="' + (h * .62) + '" text-anchor="middle" font-size="' + (w * .22) + '">' + (cat.icon || '🍷') + '</text>') +
      '<circle cx="' + (w * .15) + '" cy="' + (h * .14) + '" r="' + (w * .04) + '" fill="' + c + '" opacity=".55"/>' +
      '</svg>';
    var uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    PH_CACHE[key] = uri;
    return uri;
  };

  SA.DEBUG = false;
})(window.SA);
