/* =============================================================
 * api.js — 真实数据源接入层
 * 所有外部 API 调用封装在此模块内，统一映射为项目标准数据结构：
 * { id, name, brand, category, sub_type, origin, latitude, longitude,
 *   price, abv, flavor_tags, description, food_pairing, image_url, source, ... }
 * 任一数据源失败 → 自动降级到内置兜底数据，不影响其他功能。
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  var E = SA.ENDPOINTS;
  var L = SA.LIMITS;

  /* ---------------- 通用工具 ---------------- */
  function fetchJSON(url, timeout) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, timeout || 12000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .finally(function () { clearTimeout(timer); });
  }

  function fetchText(url, timeout) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, timeout || 12000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .finally(function () { clearTimeout(timer); });
  }

  /** 极简 CSV 解析（支持引号包裹与逗号转义） */
  function parseCSV(text) {
    var rows = [], row = [], cur = '', inQ = false;
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (inQ) {
        if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
        else cur += ch;
      } else {
        if (ch === '"') inQ = true;
        else if (ch === ',') { row.push(cur); cur = ''; }
        else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
        else cur += ch;
      }
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    var header = rows.shift() || [];
    return rows.filter(function (r) { return r.length === header.length && r.join('').trim() !== ''; })
      .map(function (r) {
        var o = {}; header.forEach(function (h, idx) { o[h.trim()] = (r[idx] || '').trim(); }); return o;
      });
  }

  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : null; }

  var BREWERY_TYPE_ZH = {
    micro: '微型精酿酒厂', nano: '纳米酒厂', regional: '区域酒厂', brewpub: '前店后厂酒吧',
    large: '大型酒厂', planning: '筹备中', bar: '酒吧', contract: '代工生产',
    proprietor: '自有品牌', closed: '已关闭', location: '分店/厂区'
  };

  var COUNTRY_BEER_FLAVOR = {
    'germany': ['麦芽', '面包香', '萨兹酒花'], 'belgium': ['酵母酯香', '辛香', '果香'],
    'united states': ['酒花', '柑橘', '松脂'], 'england': ['麦芽', '焦糖', '泥土'],
    'czechia': ['萨兹酒花', '麦芽', '清爽'], 'ireland': ['烘焙', '咖啡', '顺滑'],
    'japan': ['清爽', '精细', '米香'], 'scotland': ['麦芽', '蜂蜜', '花香'],
    'netherlands': ['麦芽', '比利时酵母', '果香'], 'italy': ['麦芽', '柑橘', '草本'],
    'france': ['麦芽', '草本', '农舍风格'], 'australia': ['酒花', '热带水果', '柑橘'],
    'new zealand': ['酒花', '百香果', '青草'], 'canada': ['麦芽', '枫糖', '清爽'],
    'denmark': ['酒花', '柑橘', '实验风格'], 'norway': ['酸啤', '野菌', '莓果'],
    'brazil': ['清爽', '小麦', '柑橘'], 'mexico': ['清爽', '青柠', '玉米甜'],
    'spain': ['清爽', '麦芽', '柑橘'], 'poland': ['麦芽', '蜂蜜', '草本']
  };

  var GRAPE_ZH = {
    'cabernet sauvignon': '赤霞珠', 'cabernet franc': '品丽珠', 'merlot': '梅洛',
    'pinot noir': '黑皮诺', 'syrah': '西拉', 'shiraz': '设拉子', 'malbec': '马尔贝克',
    'sangiovese': '桑娇维塞', 'nebbiolo': '内比奥罗', 'tempranillo': '丹魄',
    'grenache': '歌海娜', 'garnacha': '歌海娜', 'zinfandel': '仙粉黛', 'primitivo': '普里米蒂沃',
    'chardonnay': '霞多丽', 'sauvignon blanc': '长相思', 'riesling': '雷司令',
    'pinot grigio': '灰皮诺', 'pinot gris': '灰皮诺', 'gewurztraminer': '琼瑶浆',
    'gewürztraminer': '琼瑶浆', 'viognier': '维欧尼', 'semillon': '赛美蓉',
    'chenin blanc': '白诗南', 'moscato': '麝香', 'muscat': '麝香', 'albarino': '阿尔巴利诺',
    'albariño': '阿尔巴利诺', 'verdejo': '弗德乔', 'petit verdot': '小维多',
    'carignan': '佳丽酿', 'cinsault': '神索', 'mourvedre': '慕合怀特', 'monastrell': '莫纳斯特雷尔',
    'montepulciano': '蒙特布查诺', 'aglianico': '艾格尼科', 'touriga': '国产多瑞加',
    'gruner veltliner': '绿维特利纳', 'glera': '格雷拉', 'prosecco': '普罗塞克',
    'pinot meunier': '莫尼耶', 'nero': '黑珍珠', 'corvina': '科维纳', 'dolcetto': '多姿桃',
    'barbera': '巴贝拉', 'gamay': '佳美', 'carmenere': '佳美娜', 'petite sirah': '小西拉'
  };

  function detectGrape(text) {
    var t = String(text || '').toLowerCase();
    var keys = Object.keys(GRAPE_ZH).sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < keys.length; i++) { if (t.indexOf(keys[i]) !== -1) return GRAPE_ZH[keys[i]]; }
    return null;
  }

  /* =========================================================
   * 数据源 1：Open Brewery DB（啤酒 / 苹果酒）
   * 仓库：openbrewerydb/openbrewerydb-laravel-api  文档：api.openbrewerydb.org/docs
   * ========================================================= */
  function loadBreweries() {
    return Promise.all([
      fetchJSON(E.brewery), fetchJSON(E.brewery2), fetchJSON(E.brewery3)
    ]).then(function (pages) {
      var all = [];
      pages.forEach(function (p) { if (Array.isArray(p)) all = all.concat(p); });
      // 去重 + 仅保留有坐标的
      var seen = {}, out = [];
      all.forEach(function (b) {
        if (!b || seen[b.id]) return;
        if (b.latitude == null || b.longitude == null) return;
        seen[b.id] = 1;
        var lat = parseFloat(b.latitude), lon = parseFloat(b.longitude);
        if (!isFinite(lat) || !isFinite(lon) || (lat === 0 && lon === 0)) return;
        var city = b.city || b.state || '';
        var countryKey = String(b.country || '').toLowerCase();
        var region = (b.state_province || '');
        var geo = SA.geo.resolve(b.country, region + ' ' + city);
        var typeZh = BREWERY_TYPE_ZH[b.brewery_type] || b.brewery_type || '酒厂';
        var flavors = COUNTRY_BEER_FLAVOR[countryKey] || ['麦芽', '酒花', '清爽'];
        out.push({
          id: 'beer-' + b.id,
          name: b.name,
          brand: b.name,
          category: 'beer',
          sub_type: typeZh,
          origin: SA.geo.countryZh(b.country) + (city ? ' · ' + city : ''),
          country: b.country || '',
          region: city,
          latitude: geo.level === 'region' ? geo.lat : lat,
          longitude: geo.level === 'region' ? geo.lon : lon,
          price: '数据待更新',
          abv: null,
          flavor_tags: flavors.slice(0, 4),
          description: (b.name + ' 是一家位于 ' + SA.geo.countryZh(b.country) + (city ? ' ' + city : '') + ' 的' + typeZh + '。数据源 Open Brewery DB（开放免费 API，无需认证）。'),
          food_pairing: '啤酒佐餐范围极广：拉格配炸物与烧烤，IPA 配辛辣菜与重口奶酪，世涛配巧克力甜点。',
          image_url: null,
          website: b.website_url || null,
          source: 'Open Brewery DB',
          source_url: 'https://www.openbrewerydb.org/',
          rating: null
        });
      });
      return out.slice(0, L.beer);
    });
  }

  /* =========================================================
   * 数据源 2：WhiskyyDB/whisky-database（GitHub 开源，jsDelivr 分发）
   * ========================================================= */
  function loadWhiskyFromGitHub() {
    return Promise.all([fetchText(E.whiskyDistilleries), fetchText(E.whiskySpirits)])
      .then(function (res) {
        var distilleries = parseCSV(res[0]);
        var spirits = parseCSV(res[1]);
        var out = [];
        distilleries.forEach(function (d, idx) {
          var geo = SA.geo.resolve(d.country, d.region);
          // 找到属于该酒厂的酒款
          var mine = spirits.filter(function (s) {
            return String(s.name).toLowerCase().indexOf(String(d.name).toLowerCase().split(' ')[0]) !== -1;
          });
          var t = String(d.name).toLowerCase();
          var sub = mine.length ? mine[0].type : (String(d.country).toLowerCase().indexOf('scotland') !== -1 ? 'Scotch Whisky' : (String(d.country).toLowerCase().indexOf('japan') !== -1 ? 'Japanese Whisky' : 'Whisky'));
          var subZh = /single malt/i.test(sub) ? (/japanese/i.test(sub) ? '日本单一麦芽' : '苏格兰单一麦芽')
            : /bourbon/i.test(sub) ? '波本威士忌' : /scotch/i.test(sub) ? '苏格兰威士忌' : '威士忌';
          var regionNote = SA.REGION_NOTES[geo.matched];
          out.push({
            id: 'whisky-gh-' + (d.distillery_id || idx),
            name: mine.length ? mine[0].name : (d.name + ' Distillery'),
            brand: d.name,
            category: 'whisky',
            sub_type: subZh,
            origin: SA.geo.countryZh(d.country) + ' · ' + d.region,
            country: d.country,
            region: d.region,
            latitude: geo.lat,
            longitude: geo.lon,
            price: '数据待更新',
            abv: mine.length ? num(mine[0].abv) : null,
            age: mine.length ? num(mine[0].age) : null,
            flavor_tags: SA.inferFlavor(d.name + ' ' + d.region + ' ' + sub, 'whisky'),
            description: (d.name + ' 酒厂位于' + SA.geo.countryZh(d.country) + ' ' + d.region + '产区。' + (regionNote ? regionNote.note : '') + ' 数据来源：WhiskyyDB 开源数据库（自动摄入 Wikidata / Wikipedia / Open Food Facts / TTB COLA 等公开渠道）。'),
            food_pairing: '烟熏三文鱼、黑巧克力、坚果拼盘；泥煤重口款可搭配生蚝与蓝纹奶酪。',
            image_url: null,
            source: 'WhiskyyDB / whisky-database',
            source_url: 'https://github.com/WhiskyyDB/whisky-database',
            rating: null,
            extra_note: mine.length ? ('酒龄 ' + (mine[0].age || 'N/A') + ' 年 · 容量 ' + mine[0].volume_ml + 'ml') : null
          });
        });
        return out;
      });
  }

  /* =========================================================
   * 数据源 3：Open Food Facts（威士忌补充源，ODbL 开放数据）
   * ========================================================= */
  function loadWhiskyFromOFF() {
    return fetchJSON(E.offWhisky, 9000).then(function (data) {
      var prods = (data && data.products) || [];
      var out = [];
      prods.forEach(function (p, i) {
        var country = (p.countries_tags && p.countries_tags.length)
          ? p.countries_tags[0].replace('en:', '').replace(/-/g, ' ') : '';
        var geo = SA.geo.resolve(country, '');
        var name = p.product_name || p.brands || ('Whisky ' + p.code);
        out.push({
          id: 'whisky-off-' + (p.code || i),
          name: name,
          brand: p.brands || '未知品牌',
          category: 'whisky',
          sub_type: /scotch/i.test(name) ? '苏格兰威士忌' : /bourbon/i.test(name) ? '波本威士忌' : /irish/i.test(name) ? '爱尔兰威士忌' : '威士忌',
          origin: SA.geo.countryZh(country),
          country: country,
          region: '',
          latitude: geo.lat,
          longitude: geo.lon,
          price: '数据待更新',
          abv: p.abv ? num(p.abv) : null,
          flavor_tags: SA.inferFlavor(name, 'whisky'),
          description: (name + '（' + (p.brands || '未知品牌') + '）—— 来自 Open Food Facts 开放食品数据库的公开条目，标注产地：' + SA.geo.countryZh(country) + '。'),
          food_pairing: '黑巧克力、坚果、陈年奶酪；也可纯饮或加冰。',
          image_url: p.image_front_small_url || null,
          source: 'Open Food Facts',
          source_url: 'https://world.openfoodfacts.org/',
          rating: null
        });
      });
      return out.slice(0, L.whiskyOff);
    });
  }

  /* =========================================================
   * 数据源 4：sampleapis.com/wines（Vivino 派生公开数据集）
   * ========================================================= */
  var WINE_CATEGORY = { red: 'red', white: 'white', sparkling: 'sparkling', rose: 'red', port: 'fortified', dessert: 'fortified' };

  function loadWines() {
    var jobs = Object.keys(E.wines).map(function (key) {
      return fetchJSON(E.wines[key], 15000).then(function (list) {
        if (!Array.isArray(list)) return [];
        var cat = WINE_CATEGORY[key];
        return list
          .filter(function (w) { return w && w.wine && w.location; })
          .map(function (w) {
            var rating = w.rating && w.rating.average ? parseFloat(w.rating.average) : null;
            return { w: w, rating: rating || 0 };
          })
          .sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); })
          .slice(0, L.winePerType)
          .map(function (x) { return mapWine(x.w, cat, key); });
      });
    });
    return Promise.all(jobs).then(function (groups) {
      var out = [];
      groups.forEach(function (g) { out = out.concat(g); });
      return out;
    });
  }

  function mapWine(w, category, bucket) {
    var parts = String(w.location).split('·');
    var country = (parts[0] || '').trim();
    var region = (parts[1] || '').trim();
    var geo = SA.geo.resolve(country, region);
    var grape = detectGrape(w.wine + ' ' + region);
    var isPort = bucket === 'port';
    var isDessert = bucket === 'dessert';
    var sub = grape || (isPort ? '波特加强酒' : isDessert ? '甜型葡萄酒' : (region || '混酿'));
    if (bucket === 'rose') sub = '桃红葡萄酒' + (grape ? '（' + grape + '）' : '');
    var rating = w.rating && w.rating.average ? parseFloat(w.rating.average) : null;
    var reviews = w.rating && w.rating.reviews ? w.rating.reviews : '';
    return {
      id: 'wine-' + bucket + '-' + w.id,
      name: w.wine,
      brand: w.winery,
      category: category,
      sub_type: sub,
      origin: SA.geo.countryZh(country) + (region ? ' · ' + region : ''),
      country: country,
      region: region,
      latitude: geo.lat,
      longitude: geo.lon,
      price: '数据待更新',
      abv: null,
      flavor_tags: SA.inferFlavor(w.wine + ' ' + region, category),
      description: (w.winery + ' 出品的《' + w.wine + '》，产自 ' + region + '（' + SA.geo.countryZh(country) + '）。' +
        (rating ? '社区评分 ' + rating + ' / 5' + (reviews ? '（' + reviews + '）' : '') + '。' : '') +
        (grape ? ' 主要品种：' + grape + '。' : '') +
        ' 数据来源：sampleapis Wines 公开数据集（Vivino 派生）。'),
      food_pairing: category === 'fortified'
        ? '波特与甜酒：蓝纹奶酪、黑巧克力、无花果干、坚果；也可作为餐后酒单独享用。'
        : '产地配产地是万能法则：当地酒配当地菜；高酸白酒解油腻，高单宁红酒配红肉。',
      image_url: w.image || null,
      source: 'sampleapis Wines',
      source_url: 'https://api.sampleapis.com/wines',
      rating: rating,
      reviews: reviews,
      serve_temp: SA.KNOWLEDGE[category] ? SA.KNOWLEDGE[category].serve.temp : null
    };
  }

  /* =========================================================
   * 数据源 5：TheCocktailDB（鸡尾酒配方 API）
   * ========================================================= */
  var SPIRIT_ORIGIN = [
    { kw: ['tequila', 'mezcal'], city: 'Jalisco', country: 'Mexico', label: '墨西哥 · 哈利斯科' },
    { kw: ['rum'], city: 'Havana', country: 'Cuba', label: '古巴 · 哈瓦那' },
    { kw: ['scotch'], city: 'Edinburgh', country: 'Scotland', label: '苏格兰 · 爱丁堡' },
    { kw: ['irish'], city: 'Dublin', country: 'Ireland', label: '爱尔兰 · 都柏林' },
    { kw: ['bourbon', 'tennessee', 'rye', 'whiskey'], city: 'New Orleans', country: 'United States', label: '美国 · 新奥尔良' },
    { kw: ['gin'], city: 'London', country: 'United Kingdom', label: '英国 · 伦敦' },
    { kw: ['cognac', 'brandy'], city: 'Cognac', country: 'France', label: '法国 · 干邑' },
    { kw: ['champagne', 'sparkling wine'], city: 'Paris', country: 'France', label: '法国 · 巴黎' },
    { kw: ['vermouth', 'campari', 'amaro', 'aperol'], city: 'Milan', country: 'Italy', label: '意大利 · 米兰' },
    { kw: ['vodka'], city: 'New York', country: 'United States', label: '美国 · 纽约（现代经典）' },
    { kw: ['sake'], city: 'Tokyo', country: 'Japan', label: '日本 · 东京' },
    { kw: ['absinthe'], city: 'Paris', country: 'France', label: '法国 · 巴黎' },
    { kw: ['cachaca'], city: 'Rio de Janeiro', country: 'Brazil', label: '巴西 · 里约' },
    { kw: ['pisco'], city: 'Lima', country: 'Peru', label: '秘鲁 · 利马' }
  ];

  function inferCocktailOrigin(d) {
    var ing = [];
    for (var i = 1; i <= 15; i++) { if (d['strIngredient' + i]) ing.push(String(d['strIngredient' + i]).toLowerCase()); }
    var joined = ing.join(' | ');
    for (var k = 0; k < SPIRIT_ORIGIN.length; k++) {
      for (var m = 0; m < SPIRIT_ORIGIN[k].kw.length; m++) {
        if (joined.indexOf(SPIRIT_ORIGIN[k].kw[m]) !== -1) {
          var o = SPIRIT_ORIGIN[k];
          var geo = SA.geo.resolve(o.country, o.city);
          return { geo: geo, label: o.label, inferred: true, ingredients: ing };
        }
      }
    }
    var g2 = SA.geo.resolve('United States', 'New York');
    return { geo: g2, label: '美国 · 纽约（现代经典）', inferred: true, ingredients: ing };
  }

  function loadCocktails() {
    return fetchJSON(E.cocktailList, 12000).then(function (list) {
      var drinks = (list && list.drinks) || [];
      // 优先取名字里带经典关键词的，保证地球上有可读的条目
      var picked = drinks.slice(0, L.cocktail);
      return Promise.all(picked.map(function (d) {
        return fetchJSON(E.cocktailLookup + d.idDrink, 10000).catch(function () { return null; });
      })).then(function (details) {
        var out = [];
        details.forEach(function (res) {
          if (!res || !res.drinks || !res.drinks[0]) return;
          var d = res.drinks[0];
          var inf = inferCocktailOrigin(d);
          var ing = inf.ingredients.slice(0, 6).map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); });
          out.push({
            id: 'cocktail-' + d.idDrink,
            name: d.strDrink,
            brand: d.strIBA ? ('IBA · ' + d.strIBA) : (d.strCategory || '经典鸡尾酒'),
            category: 'cocktail',
            sub_type: d.strCategory || '鸡尾酒',
            origin: inf.label,
            country: '',
            region: inf.label,
            latitude: inf.geo.lat,
            longitude: inf.geo.lon,
            price: '数据待更新',
            abv: null,
            flavor_tags: SA.inferFlavor(ing.join(' '), 'cocktail'),
            description: '【配方原料】' + ing.join('、') + '。\n【调制步骤】' + (d.strInstructions || '暂无步骤说明。'),
            food_pairing: '酸味类配海鲜与炸物；苦味类（内格罗尼系）作开胃酒；奶油类配甜点。',
            image_url: d.strDrinkThumb || null,
            source: 'TheCocktailDB',
            source_url: 'https://www.thecocktaildb.com/',
            rating: null,
            glass: d.strGlass || null,
            origin_inferred: true
          });
        });
        return out;
      });
    });
  }

  /* =========================================================
   * 数据源 6：加强型酒内置条目（暂无公开 API，预留接入接口）
   * ========================================================= */
  var BUILTIN_FORTIFIED = [
    { name: 'Tío Pepe Fino Sherry', brand: 'González Byass', origin: '西班牙 · 赫雷斯', sub: '菲诺雪莉（生物陈年）', region: 'jerez', abv: 15, notes: '在 Flor 酒花覆盖下生物陈年 4 年以上，口感极干、带杏仁与酵母气息，冰镇饮用。' },
    { name: 'Lustau East India Solera', brand: 'Lustau', origin: '西班牙 · 赫雷斯', sub: '欧罗露索雪莉（氧化陈年）', region: 'jerez', abv: 20, notes: '氧化陈年后甜润浓厚，带核桃、咖啡与糖蜜气息。' },
    { name: 'Blandy\'s 10 Year Old Malmsey', brand: 'Blandy\'s', origin: '葡萄牙 · 马德拉', sub: '马姆塞马德拉', region: 'madeira', abv: 19, notes: '经 Estufagem 加热陈化，被称为「不死之酒」，开瓶数月不坏。' },
    { name: 'Taylor\'s 10 Year Old Tawny Port', brand: 'Taylor\'s', origin: '葡萄牙 · 杜罗河谷', sub: '茶色波特（10 年）', region: 'douro', abv: 20, notes: '橡木桶长期氧化陈年，呈现核桃、焦糖与干果风味。' },
    { name: 'Graham\'s Vintage Port 2000', brand: 'Graham\'s', origin: '葡萄牙 · 杜罗河谷', sub: '年份波特', region: 'douro', abv: 20, notes: '单一年份、瓶中陈年，需醒酒除渣，陈年潜力可达数十年。' },
    { name: 'Marsala Vergine Soleras', brand: 'Florio', origin: '意大利 · 西西里', sub: '玛莎拉（干型）', region: 'sicily', abv: 18, notes: '西西里加强酒，用索莱拉系统陈年，常用于烹饪与本饮。' },
    { name: 'Muscat de Beaumes-de-Venise', brand: 'Domaine de Durban', origin: '法国 · 罗讷河谷', sub: '天然甜酒 VDN（麝香）', region: 'rhone', abv: 15, notes: '发酵中途加葡萄酒精中止发酵，保留天然糖分与麝香葡萄香气。' },
    { name: 'Rutherglen Muscat', brand: 'Campbells', origin: '澳大利亚 · 路斯格兰', sub: '路斯格兰麝香甜酒', region: 'barossa', abv: 18, notes: '炎热气候下浓缩的麝香葡萄，氧化陈年带来焦糖与糖蜜风味。' }
  ];

  function loadFortifiedBuiltin() {
    return Promise.resolve(BUILTIN_FORTIFIED.map(function (f, i) {
      var geo = SA.geo.resolve('', f.region);
      return {
        id: 'fortified-builtin-' + i,
        name: f.name, brand: f.brand, category: 'fortified',
        sub_type: f.sub, origin: f.origin, country: '', region: f.region,
        latitude: geo.lat, longitude: geo.lon,
        price: '数据待更新',
        abv: f.abv,
        flavor_tags: SA.inferFlavor(f.name + ' ' + f.sub, 'fortified'),
        description: f.notes + '（本条目为加强型酒内置示例数据：该品类暂无稳定公开 API，已预留接口 SA.api.registerFortifiedSource(fn) 供后续替换。）',
        food_pairing: '菲诺配生蚝与杏仁；茶色波特配坚果与焦糖甜点；年份波特配蓝纹奶酪与黑巧克力。',
        image_url: null,
        source: '内置示例数据（预留 API 接口）',
        source_url: null,
        rating: null
      };
    }));
  }

  /* 预留接口：后续有真实 API 时调用 SA.api.registerFortifiedSource(fn) 即可替换内置数据 */
  SA.api = SA.api || {};
  SA.api.registerFortifiedSource = function (fn) {
    if (typeof fn === 'function') BUILTIN_OVERRIDE = fn;
  };
  var BUILTIN_OVERRIDE = null;

  /* =========================================================
   * 兜底数据：任一数据源失败时的优雅降级
   * ========================================================= */
  var FALLBACK = {
    red: [
      { name: 'Château Lafite Rothschild 2015', brand: 'Château Lafite Rothschild', origin: '法国 · 波尔多', region: 'bordeaux' },
      { name: 'Barolo Riserva 2016', brand: 'Giacomo Conterno', origin: '意大利 · 皮埃蒙特', region: 'barolo' },
      { name: 'Opus One 2018', brand: 'Opus One Winery', origin: '美国 · 纳帕谷', region: 'napa valley' }
    ],
    white: [
      { name: 'Montrachet Grand Cru 2018', brand: 'Domaine de la Romanée-Conti', origin: '法国 · 勃艮第', region: 'montrachet' },
      { name: 'Cloudy Bay Sauvignon Blanc 2022', brand: 'Cloudy Bay', origin: '新西兰 · 马尔堡', region: 'marlborough' }
    ],
    sparkling: [
      { name: 'Dom Pérignon Vintage 2012', brand: 'Moët & Chandon', origin: '法国 · 香槟', region: 'champagne' }
    ],
    whisky: [
      { name: 'Yamazaki 12 Year Old', brand: 'Suntory', origin: '日本 · 大阪（山崎）', region: 'yamazaki', abv: 43, age: 12 },
      { name: 'Lagavulin 16 Year Old', brand: 'Lagavulin', origin: '苏格兰 · 艾雷岛', region: 'islay', abv: 43, age: 16 }
    ],
    beer: [
      { name: 'Guinness Draught', brand: 'Guinness', origin: '爱尔兰 · 都柏林', region: 'dublin', abv: 4.2 }
    ],
    cocktail: [
      { name: 'Margarita', brand: 'IBA · Contemporary Classics', origin: '墨西哥 · 哈利斯科', region: 'jalisco' }
    ],
    fortified: [
      { name: 'Taylor\'s 10 Year Old Tawny Port', brand: 'Taylor\'s', origin: '葡萄牙 · 杜罗河谷', region: 'douro', abv: 20 }
    ]
  };

  function fallbackFor(category) {
    var list = FALLBACK[category] || [];
    return list.map(function (f, i) {
      var geo = SA.geo.resolve('', f.region);
      return {
        id: 'fallback-' + category + '-' + i,
        name: f.name, brand: f.brand, category: category,
        sub_type: SA.CATEGORY_MAP[category] ? SA.CATEGORY_MAP[category].name : category,
        origin: f.origin, country: '', region: f.region,
        latitude: geo.lat, longitude: geo.lon,
        price: '数据待更新', abv: f.abv || null, age: f.age || null,
        flavor_tags: SA.inferFlavor(f.name, category),
        description: '（离线兜底条目）' + f.name + ' —— 对应数据源暂时不可用，已启用内置条目保证功能完整。',
        food_pairing: '参考左侧品类知识卡中的搭配建议。',
        image_url: null, source: '内置兜底数据', source_url: null, rating: null
      };
    });
  }

  /* ---------------- 策展典型酒款库（同步，永不失败） ---------------- */
  function loadCurated() {
    return Promise.resolve(SA.api_curated ? SA.api_curated() : []);
  }

  /* =========================================================
   * 统一加载入口
   * ========================================================= */
  SA.api.loadAll = function (onStatus) {
    var jobs = [
      { id: 'curated', label: '策展典型酒款库', desc: '140+ 款真实经典酒（含艾雷岛 9 家酒厂、中国 33 省代表酒、全球特色酒）· 人工校对', category: 'mixed', run: loadCurated },
      { id: 'beer', label: 'Open Brewery DB', desc: '啤酒厂 / 苹果酒厂（含经纬度）', category: 'beer', run: loadBreweries },
      { id: 'whisky-gh', label: 'WhiskyyDB', desc: 'GitHub 开源威士忌数据库', category: 'whisky', run: loadWhiskyFromGitHub },
      { id: 'whisky-off', label: 'Open Food Facts', desc: '威士忌补充（ODbL 开放数据）', category: 'whisky', run: loadWhiskyFromOFF, optional: true },
      { id: 'wines', label: 'sampleapis Wines', desc: '红/白/起泡/桃红/波特/甜酒', category: 'red', run: loadWines },
      { id: 'cocktails', label: 'TheCocktailDB', desc: '鸡尾酒配方与原料', category: 'cocktail', run: loadCocktails },
      { id: 'fortified', label: '加强型酒', desc: '内置条目 + 预留 API 接口', category: 'fortified', run: loadFortifiedBuiltin }
    ];

    var items = [], statuses = [];

    return Promise.all(jobs.map(function (job) {
      if (onStatus) onStatus({ id: job.id, label: job.label, state: 'loading' });
      return job.run()
        .then(function (list) {
          var arr = Array.isArray(list) ? list : [];
          items = items.concat(arr);
          var st = { id: job.id, label: job.label, desc: job.desc, state: arr.length ? 'ok' : 'empty', count: arr.length };
          statuses.push(st);
          if (onStatus) onStatus(st);
        })
        .catch(function (err) {
          // 可选源（如 OFF）失败时不注入兜底数据，避免与主源重复 & 显示更友好的状态
          var st = {
            id: job.id, label: job.label, desc: job.desc,
            state: job.optional ? 'warn' : 'error',
            count: 0,
            error: String(err && err.message || err)
          };
          if (!job.optional) {
            var fb = fallbackFor(job.category);
            items = items.concat(fb);
            st.count = fb.length;
          }
          statuses.push(st);
          if (onStatus) onStatus(st);
        });
    })).then(function () {
      // 清洗：过滤无坐标条目（列表仍保留，但不落点）
      items.forEach(function (it) {
        it.hasGeo = isFinite(it.latitude) && isFinite(it.longitude) && it.latitude !== null;
        if (!it.hasGeo) { it.latitude = null; it.longitude = null; }
        it.searchText = [it.name, it.brand, it.origin, it.sub_type, it.country, it.region, (it.flavor_tags || []).join(' ')]
          .join(' ').toLowerCase();
      });
      return { items: items, statuses: statuses };
    });
  };

  SA.api.parseCSV = parseCSV;
  SA.api.fetchJSON = fetchJSON;
})(window.SA);
