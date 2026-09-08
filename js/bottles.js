/* =============================================================
 * bottles.js — 策展典型酒款库（人工校对的深度样本）
 * 目的：公开 API 只能给出「酒厂名 / 产地国家」，用户看不到
 *      「艾雷岛到底有哪些真实酒款、什么风味、多少钱」。
 *      本模块补齐 70 款真实在售经典酒，覆盖 7 大品类，
 *      坐标精确到酒厂 / 村镇，价格为中国市场参考区间。
 * 数据说明：价格会随年份、渠道、汇率波动，标注为「参考区间」而非实时报价。
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  var V = 'curated';
  var SRC = '策展酒款库（人工校对）';

  /**
   * 字段与 API 数据完全一致，额外补充：
   *  distillery 酒厂 / 庄园   region 关联产区 id（regions.js）
   *  priceNum   价格区间中值（用于排序）  rating 编辑推荐指数（5 分制）
   *  serve      适饮温度 / 杯型          age 酒龄   peat 泥煤值
   */
  var B = [];

  function add(o) {
    o.id = o.id || (V + '-' + B.length);
    o.category = o.category || 'whisky';
    o.source = SRC;
    o.source_url = o.source_url || null;
    // 字段归一化：本文件用 lat/lon 简写，统一 schema 用 latitude/longitude。
    // 缺这步会导致 hasGeo 恒为 false，策展酒款（茅台/艾雷岛等）全部无法在地球落点。
    if (o.latitude == null && o.lat != null) o.latitude = o.lat;
    if (o.longitude == null && o.lon != null) o.longitude = o.lon;
    o.hasGeo = isFinite(o.latitude) && isFinite(o.longitude);
    o.searchText = [o.name, o.brand, o.origin, o.sub_type, o.country, o.region, o.distillery,
      (o.flavor_tags || []).join(' ')].join(' ').toLowerCase();
    B.push(o);
    return o;
  }

  /* ==================== 苏格兰 · 艾雷岛（9 家在产酒厂全覆盖） ==================== */
  add({ id: 'c-ardbeg10', name: 'Ardbeg 10 年', brand: 'Ardbeg 雅柏', category: 'whisky', distillery: 'Ardbeg',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.643, lon: -6.106, abv: 46, age: 10, peat: '约 55 ppm',
    price: '¥450–620', priceNum: 530, rating: 4.7,
    flavor_tags: ['重泥煤', '篝火烟熏', '柠檬皮', '海盐', '黑胡椒', '咖啡'],
    description: '艾雷岛泥煤的入门必修课。闻起来是篝火与碘酒，入口却被甜麦芽和柠檬托住——泥煤很重但不粗暴。46% 装瓶、非冷凝过滤，是同价位里性价比最高的重泥煤单一麦芽之一。',
    food_pairing: '生蚝、炭烤羊排、烟熏三文鱼、70% 黑巧克力',
    serve: { temp: '18–20℃，滴 2–3 滴水', glass: '格兰凯恩杯' },
    image: 'https://static.whiskybase.com/storage/whiskies/1/3/1/1000px.13180.jpg' });

  add({ id: 'c-laphroaig10', name: 'Laphroaig 10 年', brand: 'Laphroaig 拉弗格', category: 'whisky', distillery: 'Laphroaig',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.638, lon: -6.155, abv: 40, age: 10, peat: '约 45 ppm',
    price: '¥380–520', priceNum: 450, rating: 4.6,
    flavor_tags: ['药水碘味', '海苔', '泥煤', '烟熏培根', '咸柠檬'],
    description: '艾雷岛最"极端"的一支：正露丸般的药水味、海苔与碘酒扑面而来，尾韵是咸味与焦糖。爱的人视若神明，恨的人一口劝退——它是判断你是否属于泥煤党的分水岭。查尔斯王子是其皇室认证持有者。',
    food_pairing: '生蚝、烟熏鳕鱼、蓝纹奶酪、黑麦面包配黄油',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-lagavulin16', name: 'Lagavulin 16 年', brand: 'Lagavulin 乐加维林', category: 'whisky', distillery: 'Lagavulin',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.636, lon: -6.128, abv: 43, age: 16, peat: '约 35 ppm',
    price: '¥850–1,200', priceNum: 1000, rating: 4.8,
    flavor_tags: ['甜美泥煤', '干果', '雪莉桶', '海盐', '烟草', '巧克力'],
    description: '慢炖型泥煤的巅峰：16 年把艾雷的粗犷磨成圆润，入口是干果、无花果与巧克力的甜，烟熏像是从背后慢慢涌上来。被很多人称为"最完整的一款艾雷岛"。',
    food_pairing: '烤鸭、伊比利亚火腿、陈年高达、雪茄',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-bowmore12', name: 'Bowmore 12 年', brand: 'Bowmore 波摩', category: 'whisky', distillery: 'Bowmore',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.757, lon: -6.288, abv: 40, age: 12, peat: '约 25 ppm',
    price: '¥350–480', priceNum: 410, rating: 4.3,
    flavor_tags: ['海盐', '热带水果', '中泥煤', '蜂蜜', '柑橘'],
    description: '岛上最古老的酒厂（1779）。风格居中：泥煤只有中等，海盐、芒果与蜂蜜的甜感更明显。想理解"艾雷岛不只有碘酒"，从这瓶开始。',
    food_pairing: '烟熏三文鱼、烤虾、山羊奶酪',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-caolila12', name: 'Caol Ila 12 年', brand: 'Caol Ila 卡尔里拉', category: 'whisky', distillery: 'Caol Ila',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.854, lon: -6.109, abv: 43, age: 12, peat: '约 35 ppm',
    price: '¥480–650', priceNum: 560, rating: 4.5,
    flavor_tags: ['清瘦泥煤', '青草', '柠檬', '海风', '烟熏鱼'],
    description: '艾雷岛产量最大的酒厂，也是尊尼获加（Johnnie Walker）的基酒主力。风格干净清瘦——像把泥煤过滤了一遍，青草、柠檬与海风清晰可辨，是"泥煤的结构课"。',
    food_pairing: '生蚝、清蒸白身鱼、烟熏三文鱼',
    serve: { temp: '16–18℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-laddie', name: 'Bruichladdich The Classic Laddie', brand: 'Bruichladdich 布赫拉迪', category: 'whisky', distillery: 'Bruichladdich',
    sub_type: '单一麦芽 · 艾雷岛（无泥煤）', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.765, lon: -6.363, abv: 50, age: null, peat: '0 ppm（无泥煤）',
    price: '¥480–650', priceNum: 560, rating: 4.4,
    flavor_tags: ['花香', '青苹果', '海盐', '麦芽', '柑橘'],
    description: '同一家酒厂的两副面孔：Classic Laddie 完全无泥煤，是艾雷岛的"异类"；Octomore 系列则做到 100+ ppm 的全球最重泥煤。这瓶 50% 装瓶、无年份，是全岛最能体现"风土而非泥煤"的一支。',
    food_pairing: '生蚝、柠檬黄油煎鱼、新鲜山羊奶酪',
    serve: { temp: '16–18℃，可滴几滴水降度', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-kilchoman', name: 'Kilchoman Machir Bay', brand: 'Kilchoman 齐侯门', category: 'whisky', distillery: 'Kilchoman',
    sub_type: '单一麦芽 · 艾雷岛', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.783, lon: -6.431, abv: 46, age: null, peat: '约 50 ppm',
    price: '¥520–720', priceNum: 620, rating: 4.4,
    flavor_tags: ['农场泥煤', '柑橘', '香草', '海盐', '胡椒'],
    description: '2005 年才建厂的"新派"，却是艾雷岛唯一做庄园式（自种大麦→自发芽→自熏麦→自蒸馏）的酒厂。泥煤里带着农场的干草与柑橘甜，年轻但有骨架。',
    food_pairing: '炭烤羊排、烤蔬菜、硬质奶酪',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-bunnahabhain12', name: 'Bunnahabhain 12 年', brand: 'Bunnahabhain 布纳哈本', category: 'whisky', distillery: 'Bunnahabhain',
    sub_type: '单一麦芽 · 艾雷岛（雪莉桶）', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.881, lon: -6.122, abv: 46.3, age: 12, peat: '1–2 ppm（几乎无泥煤）',
    price: '¥480–680', priceNum: 580, rating: 4.3,
    flavor_tags: ['雪莉桶', '坚果', '干果', '海盐', '巧克力'],
    description: '艾雷岛最北端的酒厂，水源未流经泥煤层，因此风格几乎无烟熏。雪莉桶主导，坚果、干果与淡淡海风——如果你想向朋友证明"艾雷岛不全是消毒水味"，拿这瓶。',
    food_pairing: '烤坚果、巧克力甜点、Manchego 奶酪',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-ardbeg-uigeadail', name: 'Ardbeg Uigeadail', brand: 'Ardbeg 雅柏', category: 'whisky', distillery: 'Ardbeg',
    sub_type: '单一麦芽 · 无年份（原桶强度）', origin: '艾雷岛', country: '英国', region: 'islay',
    lat: 55.643, lon: -6.106, abv: 54.2, age: null, peat: '约 55 ppm',
    price: '¥750–1,050', priceNum: 900, rating: 4.8,
    flavor_tags: ['重泥煤', '葡萄干', '黑巧克力', '皮革', '咖啡'],
    description: '波本桶 + 雪莉桶调配的原桶强度经典（54.2%）。泥煤、葡萄干与黑巧三重奏，被《威士忌圣经》多次评为年度最佳。加水后会爆出更多焦糖与烟熏。',
    food_pairing: '黑巧克力、烟熏牛胸肉、蓝纹奶酪',
    serve: { temp: '18–20℃，强烈建议加几滴水', glass: '格兰凯恩杯' }, image: '' });

  /* ==================== 苏格兰 · 斯佩塞 / 高地 / 岛屿 / 坎贝尔镇 ==================== */
  add({ id: 'c-macallan12', name: 'Macallan 12 年 雪莉桶', brand: 'Macallan 麦卡伦', category: 'whisky', distillery: 'Macallan',
    sub_type: '单一麦芽 · 斯佩塞', origin: '斯佩塞', country: '英国', region: 'speyside',
    lat: 57.483, lon: -3.202, abv: 40, age: 12, peat: '0 ppm',
    price: '¥750–1,100', priceNum: 900, rating: 4.6,
    flavor_tags: ['干果', '香草', '肉桂', '巧克力', '橙皮'],
    description: '雪莉桶威士忌的教科书。100% 西班牙 Oloroso 雪莉桶熟成，干果、肉桂与黑巧克力的厚度，是"送礼不出错"的代表作。',
    food_pairing: '烤鸭、坚果拼盘、黑巧克力甜点',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-glenfiddich12', name: 'Glenfiddich 12 年', brand: 'Glenfiddich 格兰菲迪', category: 'whisky', distillery: 'Glenfiddich',
    sub_type: '单一麦芽 · 斯佩塞', origin: '斯佩塞', country: '英国', region: 'speyside',
    lat: 57.455, lon: -3.128, abv: 40, age: 12, peat: '0 ppm',
    price: '¥240–340', priceNum: 290, rating: 4.1,
    flavor_tags: ['青苹果', '梨', '蜂蜜', '奶油', '橡木'],
    description: '全球销量最高的单一麦芽。梨与青苹果的清爽、蜂蜜的甜，几乎没有任何攻击性——最安全的"第一瓶单一麦芽"。',
    food_pairing: '烤鸡、苹果派、淡味奶酪',
    serve: { temp: '16–18℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-balvenie12', name: 'The Balvenie 12 年 DoubleWood', brand: 'Balvenie 百富', category: 'whisky', distillery: 'The Balvenie',
    sub_type: '单一麦芽 · 斯佩塞（过桶）', origin: '斯佩塞', country: '英国', region: 'speyside',
    lat: 57.460, lon: -3.135, abv: 40, age: 12, peat: '0 ppm',
    price: '¥450–620', priceNum: 530, rating: 4.5,
    flavor_tags: ['蜂蜜', '坚果', '香草', '干果', '肉桂'],
    description: '先在波本桶、再转入雪莉桶的"双桶"工艺。仍坚持自种大麦与自家桶匠修桶，蜂蜜与坚果的甜美感是斯佩塞的温柔面。',
    food_pairing: '焦糖布丁、烤杏仁、Comté 奶酪',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-aberlour', name: "Aberlour A'bunadh", brand: 'Aberlour 雅伯莱', category: 'whisky', distillery: 'Aberlour',
    sub_type: '单一麦芽 · 原桶强度', origin: '斯佩塞', country: '英国', region: 'speyside',
    lat: 57.463, lon: -3.229, abv: 60.8, age: null, peat: '0 ppm',
    price: '¥620–880', priceNum: 750, rating: 4.6,
    flavor_tags: ['重雪莉', '巧克力', '橙皮', '干果', '辛香料'],
    description: '批次装瓶的原桶强度（每批 59–62% 不等），100% 西班牙 Oloroso 雪莉桶。浓郁到像喝液体葡萄干蛋糕，加水后甜度更爆。',
    food_pairing: '黑巧克力、圣诞布丁、蓝纹奶酪',
    serve: { temp: '18–20℃，务必加水', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-oban14', name: 'Oban 14 年', brand: 'Oban 欧本', category: 'whisky', distillery: 'Oban',
    sub_type: '单一麦芽 · 西高地', origin: '高地', country: '英国', region: 'highland',
    lat: 56.415, lon: -5.472, abv: 43, age: 14, peat: '约 5 ppm',
    price: '¥620–880', priceNum: 750, rating: 4.4,
    flavor_tags: ['海盐', '橙皮', '蜂蜜', '烟熏', '麦芽'],
    description: '西高地海港小镇的小酒厂，风格介于高地与岛屿之间：蜜糖与橙皮的甜，背景里有海风和一点点烟熏。经典六巨头（Classic Malts）之一。',
    food_pairing: '烤羊排、烟熏鳕鱼、陈年切达',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-talisker10', name: 'Talisker 10 年', brand: 'Talisker 泰斯卡', category: 'whisky', distillery: 'Talisker',
    sub_type: '单一麦芽 · 天空岛', origin: '岛屿区', country: '英国', region: 'islands',
    lat: 57.297, lon: -6.354, abv: 45.8, age: 10, peat: '约 25 ppm',
    price: '¥380–520', priceNum: 450, rating: 4.5,
    flavor_tags: ['黑胡椒', '海盐', '烟熏', '麦芽', '辣椒'],
    description: '天空岛唯一的酒厂，用不对称蒸馏器制造出标志性的黑胡椒爆发感。海风、咸味与辣椒，被称为"海边的篝火"。',
    food_pairing: '生蚝、黑椒牛排、烟熏三文鱼',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-hp12', name: 'Highland Park 12 年', brand: 'Highland Park 高原骑士', category: 'whisky', distillery: 'Highland Park',
    sub_type: '单一麦芽 · 奥克尼岛', origin: '岛屿区', country: '英国', region: 'islands',
    lat: 58.969, lon: -2.958, abv: 40, age: 12, peat: '约 20 ppm',
    price: '¥350–480', priceNum: 410, rating: 4.5,
    flavor_tags: ['石楠花蜜', '烟熏', '柑橘', '海盐', '香料'],
    description: '奥克尼岛最北的酒厂，自切泥煤（含石楠花根）并用雪莉桶平衡。石楠花蜜的甜与烟熏的咸完美咬合，是公认"最均衡的泥煤威士忌"。',
    food_pairing: '烤猪肉、烟熏海鲜、蜂蜜坚果',
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-springbank10', name: 'Springbank 10 年', brand: 'Springbank 云顶', category: 'whisky', distillery: 'Springbank',
    sub_type: '单一麦芽 · 坎贝尔镇', origin: '坎贝尔镇', country: '英国', region: 'campbeltown',
    lat: 55.427, lon: -5.605, abv: 46, age: 10, peat: '约 12 ppm',
    price: '¥780–1,200', priceNum: 950, rating: 4.7,
    flavor_tags: ['海盐', '油脂感', '干果', '烟熏', '皮革'],
    description: '苏格兰仅存的家族独立酒厂之一，100% 自家完成发麦、蒸馏、陈年、装瓶。2.5 次蒸馏带来的油脂感与海盐，是行家圈里的硬通货。',
    food_pairing: '烤牛肉、烟熏火腿、坚果',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  /* ==================== 日本 / 美国 / 爱尔兰 ==================== */
  add({ id: 'c-yamazaki12', name: '山崎 12 年', brand: 'Suntory 三得利', category: 'whisky', distillery: 'Yamazaki 山崎',
    sub_type: '单一麦芽 · 日本', origin: '日本', country: '日本', region: 'japan_whisky',
    lat: 34.888, lon: 135.570, abv: 43, age: 12, peat: '0–20 ppm（部分原酒带烟熏）',
    price: '¥1,600–3,200', priceNum: 2400, rating: 4.7,
    flavor_tags: ['水楢桶', '檀香', '椰子', '干果', '蜂蜜', '白桃'],
    description: '日本单一麦芽的起点。水楢桶（Mizunara）带来的檀香与线香气息是日本独有，配上白桃与蜂蜜的甜。因原酒库存紧张，2013 年后长期缺货，市场溢价明显。',
    food_pairing: '刺身、烤鳗鱼、和果子',
    serve: { temp: '16–20℃；或做 Highball', glass: '格兰凯恩杯 / 高球杯' }, image: '' });

  add({ id: 'c-hibiki', name: '响 Hibiki Harmony', brand: 'Suntory 三得利', category: 'whisky', distillery: '山崎 / 白州 / 知多',
    sub_type: '调和麦芽威士忌 · 日本', origin: '日本', country: '日本', region: 'japan_whisky',
    lat: 34.888, lon: 135.570, abv: 43, age: null, peat: '混合（含轻微烟熏）',
    price: '¥900–1,600', priceNum: 1200, rating: 4.5,
    flavor_tags: ['蜂蜜', '橙皮', '水楢', '白桃', '檀香'],
    description: '把山崎、白州、知多三厂原酒调成"和"的艺术品。蜂蜜与橙皮的圆润，尾段浮起淡淡水楢香。在日本，调和被视为比单一麦芽更高的技艺。',
    food_pairing: '天妇罗、烟熏鸭胸、和风甜点',
    serve: { temp: '16–20℃；Highball 极适合', glass: '格兰凯恩杯 / 高球杯' }, image: '' });

  add({ id: 'c-nikka-ftb', name: 'Nikka From The Barrel', brand: 'Nikka 一甲', category: 'whisky', distillery: '余市 / 宫城峡',
    sub_type: '调和威士忌 · 日本', origin: '日本', country: '日本', region: 'japan_whisky',
    lat: 43.190, lon: 140.790, abv: 51.4, age: null, peat: '混合（余市带泥煤）',
    price: '¥280–420', priceNum: 350, rating: 4.5,
    flavor_tags: ['蜜饯', '香料', '橡木', '柑橘', '轻微烟熏'],
    description: '51.4% 的"小方瓶"，把余市的厚重与宫城峡的果香压进 500ml。公认性价比最高的日本威士忌之一——花三百块喝到日威的骨架。',
    food_pairing: '烤鸡肉串、奶油意面、坚果',
    serve: { temp: '18–20℃，可加水 / 加冰', glass: '洛克杯 / 格兰凯恩杯' }, image: '' });

  add({ id: 'c-yoichi', name: '余市 单一麦芽', brand: 'Nikka 一甲', category: 'whisky', distillery: 'Yoichi 余市',
    sub_type: '单一麦芽 · 日本（北海道）', origin: '日本', country: '日本', region: 'japan_whisky',
    lat: 43.190, lon: 140.790, abv: 45, age: null, peat: '约 15–25 ppm',
    price: '¥1,200–2,400', priceNum: 1800, rating: 4.6,
    flavor_tags: ['煤炭直火', '烟熏', '海风', '干果', '辛香料'],
    description: '竹鹤政孝为复刻苏格兰而选在北海道建厂——靠海、寒冷、仍坚持煤炭直火蒸馏。厚重、油润、带咸味与炭火感，是"最不像日本"的日本威士忌。',
    food_pairing: '烤扇贝、烟熏三文鱼、味噌烤茄子',
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' }, image: '' });

  add({ id: 'c-buffalotrace', name: 'Buffalo Trace 波本', brand: 'Buffalo Trace 水牛足迹', category: 'whisky', distillery: 'Buffalo Trace',
    sub_type: '肯塔基纯波本', origin: '美国', country: '美国', region: 'bourbon',
    lat: 38.203, lon: -84.873, abv: 45, age: null, peat: '不适用',
    price: '¥180–280', priceNum: 230, rating: 4.3,
    flavor_tags: ['香草', '焦糖', '太妃糖', '肉桂', '烤玉米'],
    description: '波本入门的黄金标准。玉米甜度、香草与新橡木桶的焦糖感非常完整，价格还不到一瓶苏格兰 12 年的一半。同一酒厂也产 Pappy Van Winkle（一瓶难求）。',
    food_pairing: 'BBQ 猪肋排、炸鸡、山核桃派',
    serve: { temp: '室温或加一颗大冰球', glass: '古典杯' }, image: '' });

  add({ id: 'c-makers46', name: "Maker's Mark 46", brand: "Maker's Mark 美格", category: 'whisky', distillery: "Maker's Mark",
    sub_type: '肯塔基波本（冬小麦）', origin: '美国', country: '美国', region: 'bourbon',
    lat: 37.643, lon: -85.348, abv: 47, age: null, peat: '不适用',
    price: '¥280–400', priceNum: 340, rating: 4.2,
    flavor_tags: ['香草', '焦糖', '烤面包', '肉桂', '法国橡木'],
    description: '用冬小麦替代黑麦，柔甜无刺激；46 指陈酿末期放入 10 根法国橡木条（staves）增添层次。蜡封瓶口是它的标志。',
    food_pairing: '焦糖布丁、烤苹果、烤坚果',
    serve: { temp: '室温', glass: '古典杯' }, image: '' });

  add({ id: 'c-wt101', name: 'Wild Turkey 101', brand: 'Wild Turkey 威凤凰', category: 'whisky', distillery: 'Wild Turkey',
    sub_type: '肯塔基波本（高黑麦）', origin: '美国', country: '美国', region: 'bourbon',
    lat: 38.203, lon: -84.873, abv: 50.5, age: null, peat: '不适用',
    price: '¥220–330', priceNum: 270, rating: 4.4,
    flavor_tags: ['肉桂', '黑胡椒', '香草', '皮革', '烤橡木'],
    description: '101 proof（50.5%）的高强度波本，黑麦比例高带来明显辛香。加冰后依然站得住，是调 Old Fashioned 的经典基酒。',
    food_pairing: 'BBQ 牛小排、辣味炸鸡、陈年切达',
    serve: { temp: '室温 / 加冰', glass: '古典杯' }, image: '' });

  add({ id: 'c-redbreast12', name: 'Redbreast 12 年', brand: 'Redbreast 知更鸟', category: 'whisky', distillery: 'Midleton',
    sub_type: 'Single Pot Still 爱尔兰威士忌', origin: '爱尔兰', country: '爱尔兰', region: 'irish',
    lat: 51.910, lon: -8.170, abv: 40, age: 12, peat: '0 ppm',
    price: '¥380–520', priceNum: 450, rating: 4.6,
    flavor_tags: ['干果', '圣诞香料', '油脂感', '坚果', '雪莉桶'],
    description: '爱尔兰 Single Pot Still（发芽+未发芽大麦壶式蒸馏）的标杆，雪莉桶主导。油脂感与圣诞香料的复杂度，远超它的价格。',
    food_pairing: '爱尔兰炖羊肉、苏打面包、苹果派',
    serve: { temp: '17–19℃', glass: '郁金香杯' }, image: '' });

  /* ==================== 葡萄酒 ==================== */
  add({ id: 'c-lafite', name: 'Château Lafite Rothschild', brand: 'Château Lafite Rothschild 拉菲', category: 'red', distillery: '拉菲古堡',
    sub_type: '波尔多一级庄 · 波亚克', origin: '波尔多', country: '法国', region: 'bordeaux',
    lat: 45.232, lon: -0.757, abv: 13, age: null,
    price: '¥6,000–30,000（视年份）', priceNum: 12000, rating: 4.9,
    flavor_tags: ['黑醋栗', '雪松', '铅笔芯', '紫罗兰', '烟草'],
    description: '1855 分级的一级庄，也是最被中国消费者熟知的波尔多名庄。左岸砾石土 + 高比例赤霞珠，年轻时紧涩封闭，陈年 15–30 年后展开雪松、铅笔芯与雪茄盒的复杂香气。',
    food_pairing: '炭烤战斧牛排、松露料理、陈年硬质奶酪',
    serve: { temp: '16–18℃，建议醒酒 1–2 小时', glass: '大肚波尔多杯' }, image: '' });

  add({ id: 'c-lynchbages', name: 'Château Lynch-Bages', brand: 'Château Lynch-Bages 靓茨伯', category: 'red', distillery: '靓茨伯庄园',
    sub_type: '波尔多五级庄 · 波亚克', origin: '波尔多', country: '法国', region: 'bordeaux',
    lat: 45.183, lon: -0.750, abv: 13.5, age: null,
    price: '¥900–2,200', priceNum: 1500, rating: 4.6,
    flavor_tags: ['黑加仑', '雪松', '薄荷', '烟草', '黑樱桃'],
    description: '虽列五级庄，但品质常年超二级，被称为"超五级"。果味浓郁、结构扎实，性价比在列级庄中相当突出。',
    food_pairing: '烤羊排、红酒炖牛肉、硬质奶酪',
    serve: { temp: '16–18℃，醒酒 1 小时', glass: '大肚波尔多杯' }, image: '' });

  add({ id: 'c-penfolds389', name: 'Penfolds Bin 389', brand: 'Penfolds 奔富', category: 'red', distillery: 'Penfolds',
    sub_type: '赤霞珠 + 西拉 · 南澳', origin: '巴罗萨谷', country: '澳大利亚', region: 'barossa',
    lat: -34.520, lon: 138.620, abv: 14.5, age: null,
    price: '¥600–900', priceNum: 750, rating: 4.4,
    flavor_tags: ['黑莓', '摩卡', '香草', '巧克力', '薄荷'],
    description: '"小 Grange"——用 Grange 陈酿过的桶来熟成，赤霞珠给骨架、西拉给肉感。澳洲酒在中国的门面担当，送礼辨识度极高。',
    food_pairing: '炭烤牛排、BBQ 肋排、陈年切达',
    serve: { temp: '16–18℃', glass: '波尔多杯' }, image: '' });

  add({ id: 'c-catena', name: 'Catena Malbec', brand: 'Catena Zapata 卡帝那', category: 'red', distillery: 'Catena',
    sub_type: '马尔贝克 · 门多萨', origin: '门多萨', country: '阿根廷', region: 'mendoza',
    lat: -33.030, lon: -68.870, abv: 13.5, age: null,
    price: '¥180–320', priceNum: 250, rating: 4.2,
    flavor_tags: ['黑樱桃', '紫罗兰', '可可', '李子', '烟熏'],
    description: '把阿根廷马尔贝克推向世界的酒庄。高海拔昼夜温差让皮厚色深，黑樱桃与紫罗兰香气直接讨喜，两百块喝到这个浓度很难挑刺。',
    food_pairing: '阿根廷烤肉、牛排、辣味香肠、蓝纹奶酪',
    serve: { temp: '16–18℃', glass: '波尔多杯' }, image: '' });

  add({ id: 'c-opusone', name: 'Opus One', brand: 'Opus One 作品一号', category: 'red', distillery: 'Opus One Winery',
    sub_type: '赤霞珠混酿 · 纳帕谷', origin: '纳帕谷', country: '美国', region: 'napa',
    lat: 38.398, lon: -122.310, abv: 14.5, age: null,
    price: '¥2,800–5,000', priceNum: 3800, rating: 4.8,
    flavor_tags: ['黑莓', '摩卡', '雪松', '香草', '薄荷脑'],
    description: '木桐（Mouton）与蒙大维（Mondavi）1979 年的联姻之作。波尔多的骨架遇见加州的阳光果味，是"新世界顶级"最标准的定义。',
    food_pairing: '炭烤战斧、烟熏牛小排、陈年切达',
    serve: { temp: '16–18℃，醒酒 1 小时', glass: '大肚波尔多杯' }, image: '' });

  add({ id: 'c-tondonia', name: 'R. López de Heredia Viña Tondonia Reserva', brand: 'R. López de Heredia', category: 'red', distillery: 'Tondonia',
    sub_type: '丹魄 · 里奥哈', origin: '里奥哈', country: '西班牙', region: 'rioja',
    lat: 42.583, lon: -2.883, abv: 13.5, age: null,
    price: '¥600–1,100', priceNum: 850, rating: 4.7,
    flavor_tags: ['干无花果', '椰子', '皮革', '烟草', '酸樱桃'],
    description: '里奥哈最传统的家族酒庄，坚持长时间美国桶陈酿与超长瓶储后才上市。喝到的往往已是 10 年以上的"已成熟"状态，氧化带来的干果与皮革味非常迷人。',
    food_pairing: '伊比利亚火腿、烤乳猪、Manchego 奶酪',
    serve: { temp: '16–18℃', glass: '波尔多杯' }, image: '' });

  add({ id: 'c-cloudybay', name: 'Cloudy Bay Sauvignon Blanc', brand: 'Cloudy Bay 云雾之湾', category: 'white', distillery: 'Cloudy Bay',
    sub_type: '长相思 · 马尔堡', origin: '马尔堡', country: '新西兰', region: 'marlborough',
    lat: -41.470, lon: 173.960, abv: 13, age: null,
    price: '¥280–420', priceNum: 350, rating: 4.4,
    flavor_tags: ['百香果', '青草', '黑醋栗叶', '柚子', '番茄叶'],
    description: '让全世界认识新西兰长相思的那瓶。百香果与青草的香气极度外放，酸度清脆，是夏天配生蚝的标准答案。',
    food_pairing: '生蚝、青口、泰式青木瓜沙拉、山羊奶酪',
    serve: { temp: '8–10℃', glass: '中等白葡萄酒杯' }, image: '' });

  add({ id: 'c-loosen', name: 'Dr. Loosen Riesling Kabinett', brand: 'Dr. Loosen 露森', category: 'white', distillery: 'Dr. Loosen',
    sub_type: '雷司令 · 摩泽尔', origin: '摩泽尔', country: '德国', region: 'mosel',
    lat: 49.983, lon: 7.033, abv: 8.5, age: null,
    price: '¥180–300', priceNum: 240, rating: 4.4,
    flavor_tags: ['青柠', '白桃', '板岩矿物', '白花', '蜂蜜'],
    description: '摩泽尔陡坡板岩园的入门标杆。仅 8.5% 酒精度，残糖与高酸形成完美张力，青柠与板岩矿物感清晰。配川菜、泰餐这类辣味料理是隐藏杀器。',
    food_pairing: '川菜 / 泰餐、生鱼片、蜜汁火腿、山羊奶酪',
    serve: { temp: '8–10℃', glass: '雷司令杯' }, image: '' });

  /* ==================== 起泡 / 加强 / 白兰地 ==================== */
  add({ id: 'c-dp2012', name: 'Dom Pérignon Vintage 2013', brand: 'Dom Pérignon 唐培里侬', category: 'sparkling', distillery: 'Dom Pérignon',
    sub_type: '年份香槟 · 埃佩尔奈', origin: '香槟', country: '法国', region: 'champagne',
    lat: 49.044, lon: 3.961, abv: 12.5, age: null,
    price: '¥1,600–2,600', priceNum: 2000, rating: 4.8,
    flavor_tags: ['烤面包', '布里欧修', '白桃', '杏仁', '白垩矿物'],
    description: '只做年份（不好的年份宁可不产）。酒泥陈酿 8 年以上，气泡细密如丝，烤面包与白花的层次在杯里持续变化。',
    food_pairing: '生蚝、鱼子酱、炸物、咸味坚果',
    serve: { temp: '6–8℃', glass: '白葡萄酒杯（比笛型杯更能闻香）' }, image: '' });

  add({ id: 'c-krug', name: 'Krug Grande Cuvée', brand: 'Krug 库克', category: 'sparkling', distillery: 'Krug',
    sub_type: '多年份香槟 · 兰斯', origin: '香槟', country: '法国', region: 'champagne',
    lat: 49.258, lon: 4.034, abv: 12, age: null,
    price: '¥1,900–3,200', priceNum: 2500, rating: 4.9,
    flavor_tags: ['烤杏仁', '布里欧修', '柑橘蜜饯', '香料', '烟熏'],
    description: '用上百个地块的基酒 + 橡木桶发酵，多年份调配。复杂度是香槟里的天花板，被称为"香槟中的勃艮第特级园"。',
    food_pairing: '鱼子酱、奶油意面、烤龙虾、鹅肝',
    serve: { temp: '8–10℃（比普通香槟略高更能出味）', glass: '白葡萄酒杯' }, image: '' });

  add({ id: 'c-hennessy-xo', name: 'Hennessy X.O', brand: 'Hennessy 轩尼诗', category: 'fortified', distillery: 'Hennessy',
    sub_type: 'XO 干邑', origin: '干邑', country: '法国', region: 'cognac',
    lat: 45.700, lon: -0.330, abv: 40, age: 10,
    price: '¥1,400–2,200', priceNum: 1800, rating: 4.6,
    flavor_tags: ['干果', '肉桂', '皮革', 'rancio 陈味', '黑巧克力'],
    description: '1870 年由莫里斯·轩尼诗为朋友调配的原创 XO，是全球 XO 品类的定义者。上百种生命之水调配，干果与香料的厚度、圆润无棱角。',
    food_pairing: '黑巧克力、鹅肝、雪茄，或餐后纯饮',
    serve: { temp: '20–22℃（手心温杯）', glass: '干邑杯' }, image: '' });

  add({ id: 'c-martell-cb', name: 'Martell Cordon Bleu', brand: 'Martell 马爹利', category: 'fortified', distillery: 'Martell',
    sub_type: 'XO 级干邑 · 边缘区', origin: '干邑', country: '法国', region: 'cognac',
    lat: 45.700, lon: -0.330, abv: 40, age: 10,
    price: '¥1,200–1,900', priceNum: 1500, rating: 4.5,
    flavor_tags: ['蜜饯橙皮', '杏仁', '紫罗兰', '姜饼', '香草'],
    description: '1912 年创立的经典，以 Borderies（边缘区）生命之水为核心，紫罗兰与蜜饯橙皮的花果香是其签名。在国内的宴席上辨识度极高。',
    food_pairing: '黑巧克力、烤坚果、雪茄',
    serve: { temp: '20–22℃', glass: '干邑杯' }, image: '' });

  add({ id: 'c-tiopepe', name: 'Tio Pepe Fino', brand: 'González Byass 缇欧佩佩', category: 'fortified', distillery: 'González Byass',
    sub_type: 'Fino 雪莉（生物陈年）', origin: '赫雷斯', country: '西班牙', region: 'jerez',
    lat: 36.683, lon: -6.140, abv: 15, age: 4,
    price: '¥120–220', priceNum: 170, rating: 4.3,
    flavor_tags: ['杏仁', '海水', '酵母', '青橄榄', '烤面包'],
    description: '在酒花（flor）覆盖下生物陈年的极干型雪莉，酒精度仅 15%。咸鲜、杏仁与酵母味，冰镇后配生蚝或火腿是安达卢西亚的日常。开瓶后必须冷藏并一周内喝完。',
    food_pairing: '生蚝、西班牙火腿、橄榄、炸小鱼',
    serve: { temp: '5–8℃', glass: '小号郁金香杯（catavino）' }, image: '' });

  add({ id: 'c-lustau-olo', name: 'Lustau Oloroso Dry', brand: 'Lustau 路士露', category: 'fortified', distillery: 'Lustau',
    sub_type: 'Oloroso 雪莉（氧化陈年）', origin: '赫雷斯', country: '西班牙', region: 'jerez',
    lat: 36.683, lon: -6.140, abv: 20, age: 12,
    price: '¥220–380', priceNum: 300, rating: 4.4,
    flavor_tags: ['核桃', '皮革', '无花果', '咖啡', '烟草'],
    description: '不加酒花、纯氧化陈年的深色雪莉。核桃、皮革与咖啡的厚重，酒精度 20% 却因陈年显得柔顺。冬天配炖肉或单独小酌都极好。',
    food_pairing: '炖牛肉、野味、陈年硬质奶酪、核桃',
    serve: { temp: '14–16℃', glass: '小号郁金香杯' }, image: '' });

  add({ id: 'c-taylor-vp', name: "Taylor's Vintage Port", brand: "Taylor's 泰勒", category: 'fortified', distillery: "Taylor's",
    sub_type: '年份波特 · 杜罗河谷', origin: '杜罗河谷', country: '葡萄牙', region: 'douro',
    lat: 41.160, lon: -7.790, abv: 20, age: null,
    price: '¥1,500–6,000（视年份）', priceNum: 3000, rating: 4.8,
    flavor_tags: ['黑莓', '紫罗兰', '黑巧克力', '香料', '李子干'],
    description: '只在最好的年份（平均十年三次）宣布 Vintage。瓶中陈年数十年，年轻时是浓缩黑果与紫罗兰，陈年后转为雪松、咖啡与香料。开瓶需醒酒。',
    food_pairing: 'Stilton 蓝纹奶酪、黑巧克力、核桃派、雪茄',
    serve: { temp: '16–18℃，必须醒酒', glass: '小号波特杯' }, image: '' });

  add({ id: 'c-graham20', name: "Graham's 20 年 Tawny", brand: "Graham's 格雷厄姆", category: 'fortified', distillery: "Graham's",
    sub_type: 'Tawny 波特（氧化陈年 20 年）', origin: '杜罗河谷', country: '葡萄牙', region: 'douro',
    lat: 41.160, lon: -7.790, abv: 20, age: 20,
    price: '¥550–900', priceNum: 700, rating: 4.6,
    flavor_tags: ['焦糖', '核桃', '无花果干', '肉桂', '橙皮'],
    description: '在小木桶里氧化陈年平均 20 年，酒色转为琥珀（tawny），坚果与焦糖味突出。开瓶后可放数月不坏，是最适合慢慢喝的波特类型。',
    food_pairing: '焦糖布丁、核桃派、蓝纹奶酪、雪茄',
    serve: { temp: '12–14℃（略冰镇更好喝）', glass: '小号波特杯' }, image: '' });

  /* ==================== 啤酒 ==================== */
  add({ id: 'c-westmalle', name: 'Westmalle Tripel', brand: 'Westmalle 西麦尔', category: 'beer', distillery: 'Abdij van Onze-Lieve-Vrouw',
    sub_type: '比利时三料（Trappist）', origin: '比利时', country: '比利时', region: 'belgian_beer',
    lat: 51.290, lon: 4.660, abv: 9.5, age: null,
    price: '¥35–55 / 330ml', priceNum: 45, rating: 4.7,
    flavor_tags: ['香蕉', '丁香', '蜂蜜', '焦糖', '酒精温感'],
    description: '1956 年首创"Tripel"这个风格。金黄透亮却高达 9.5%，比利时酵母的香蕉与丁香香气，口感却意外干爽——是修道院啤酒的基准线。',
    food_pairing: '蓝纹奶酪、炖牛肉、比利时薯条',
    serve: { temp: '8–12℃', glass: '修道院郁金香杯 / 圣杯' }, image: '' });

  add({ id: 'c-rochefort10', name: 'Rochefort 10', brand: 'Rochefort 罗斯福', category: 'beer', distillery: 'Abbaye de Saint-Rémy',
    sub_type: '比利时四料（Quadrupel）', origin: '比利时', country: '比利时', region: 'belgian_beer',
    lat: 50.180, lon: 5.220, abv: 11.3, age: null,
    price: '¥55–90 / 330ml', priceNum: 70, rating: 4.8,
    flavor_tags: ['深色果干', '焦糖', '比利时糖', '巧克力', '酒精温感'],
    description: '修道院啤酒的"陈年型"：11.3%、深棕、浓郁的无花果与焦糖，装瓶后还能继续演化 5–10 年。常被形容为"啤酒里的波特酒"。',
    food_pairing: '巧克力慕斯、炖牛肉、蓝纹奶酪',
    serve: { temp: '12–14℃', glass: '圣杯（chalice）' }, image: '' });

  add({ id: 'c-chimay-bleue', name: 'Chimay Bleue（蓝标）', brand: 'Chimay 智美', category: 'beer', distillery: 'Abbaye de Scourmont',
    sub_type: '比利时四料（Trappist）', origin: '比利时', country: '比利时', region: 'belgian_beer',
    lat: 50.050, lon: 4.320, abv: 9, age: null,
    price: '¥35–55 / 330ml', priceNum: 45, rating: 4.6,
    flavor_tags: ['深色果干', '焦糖', '酵母', '香料', '面包'],
    description: '最早商业化的 Trappist 啤酒之一。瓶中二次发酵让它能陈年，深色果干与香料的复杂度随温度上升不断涌现。',
    food_pairing: '烤鸭、炖菜、洗皮奶酪',
    serve: { temp: '10–14℃', glass: '圣杯' }, image: '' });

  add({ id: 'c-weihen', name: 'Weihenstephaner Hefeweissbier', brand: 'Weihenstephaner 维森', category: 'beer', distillery: 'Bayerische Staatsbrauerei Weihenstephan',
    sub_type: '德式小麦白啤（Hefeweizen）', origin: '德国', country: '德国', region: 'german_beer',
    lat: 48.400, lon: 11.730, abv: 5.4, age: null,
    price: '¥15–28 / 500ml', priceNum: 20, rating: 4.5,
    flavor_tags: ['香蕉', '丁香', '面包', '小麦', '柑橘'],
    description: '1040 年创立，世界上最古老的现存啤酒厂。德式小麦白啤的黄金标准：香蕉与丁香的酵母香、绵密泡沫、顺滑收口。',
    food_pairing: '烤猪肘、白香肠、碱水面包',
    serve: { temp: '8–10℃', glass: '小麦啤高身收腰杯' }, image: '' });

  add({ id: 'c-urquell', name: 'Pilsner Urquell', brand: 'Pilsner Urquell 皮尔森之源', category: 'beer', distillery: 'Plzeňský Prazdroj',
    sub_type: '捷克皮尔森（Pilsner）', origin: '捷克', country: '捷克', region: 'german_beer',
    lat: 49.750, lon: 13.380, abv: 4.4, age: null,
    price: '¥15–28 / 500ml', priceNum: 20, rating: 4.5,
    flavor_tags: ['萨兹酒花', '面包', '蜂蜜', '干净的苦'],
    description: '1842 年世界上第一款金色皮尔森就在皮尔森市诞生。极软水 + 萨兹酒花 + 三次煮出糖化，干净利落的苦味是全世界拉格的原型。',
    food_pairing: '炸鸡、烤香肠、白身鱼',
    serve: { temp: '6–8℃', glass: '皮尔森细长杯' }, image: '' });

  add({ id: 'c-snpa', name: 'Sierra Nevada Pale Ale', brand: 'Sierra Nevada 内华达山脉', category: 'beer', distillery: 'Sierra Nevada Brewing',
    sub_type: '美式淡色艾尔（APA）', origin: '美国', country: '美国', region: 'craft_beer_us',
    lat: 39.730, lon: -121.840, abv: 5.6, age: null,
    price: '¥25–40 / 355ml', priceNum: 32, rating: 4.4,
    flavor_tags: ['柑橘', '松脂', '焦糖麦芽', '葡萄柚'],
    description: '1980 年问世，定义了美式精酿。整颗酒花（whole cone）投放，柑橘与松脂在焦糖麦芽的甜上跳舞，苦与甜完美平衡——现代 IPA 的祖宗。',
    food_pairing: '辣味炸鸡、墨西哥菜、蓝纹奶酪',
    serve: { temp: '7–10℃', glass: 'IPA 杯 / 品脱杯' }, image: '' });

  add({ id: 'c-pliny', name: 'Russian River Pliny the Elder', brand: 'Russian River 俄罗斯河', category: 'beer', distillery: 'Russian River Brewing',
    sub_type: '双料 IPA（West Coast）', origin: '美国', country: '美国', region: 'craft_beer_us',
    lat: 38.440, lon: -122.710, abv: 8, age: null,
    price: '¥70–120 / 510ml', priceNum: 95, rating: 4.9,
    flavor_tags: ['松脂', '葡萄柚', '芒果', '树脂苦', '花香'],
    description: '西海岸 DIPA 的圣杯，多年霸榜 RateBeer。极干、极苦、极香，酒体却薄得像没加过麦芽——"把酒花做到极限"的教材。越新鲜越好，冷藏避光。',
    food_pairing: '蓝纹奶酪、辣翅、墨西哥烤肉',
    serve: { temp: '7–10℃', glass: 'IPA 杯' }, image: '' });

  add({ id: 'c-guiness', name: 'Guinness Draught', brand: 'Guinness 健力士', category: 'beer', distillery: 'St. James\'s Gate',
    sub_type: '爱尔兰世涛（Dry Stout）', origin: '爱尔兰', country: '爱尔兰', region: 'irish',
    lat: 53.340, lon: -6.290, abv: 4.2, age: null,
    price: '¥18–35 / 440ml', priceNum: 25, rating: 4.3,
    flavor_tags: ['烘焙咖啡', '焦糖', '奶油', '黑巧克力'],
    description: '用氮气（而非二氧化碳）打出的绵密泡沫是它的标志。酒体轻得意外（仅 4.2%），烘焙大麦的咖啡与黑巧味干净利落。',
    food_pairing: '炖牛肉、生蚝、巧克力甜点',
    serve: { temp: '6–8℃', glass: '品脱杯（氮气打泡）' }, image: '' });

  /* ==================== 鸡尾酒 ==================== */
  add({ id: 'c-margarita', name: 'Margarita 玛格丽特', brand: 'IBA 官方配方', category: 'cocktail', distillery: '龙舌兰基酒',
    sub_type: ' shaken 酸酒（Sour）', origin: '墨西哥 · 哈利斯科', country: '墨西哥', region: 'tequila',
    lat: 20.880, lon: -103.840, abv: 17, age: null,
    price: '¥70–140 / 杯', priceNum: 100, rating: 4.6,
    flavor_tags: ['龙舌兰', '青柠', '橙皮甜酒', '盐', '清爽'],
    description: '龙舌兰 + 君度 + 鲜青柠，盐口杯。三大基酒平衡的教科书：烈、酸、甜、咸四角俱全。用 100% Agave Blanco 做的版本与用 Mixto 完全是两个东西。',
    food_pairing: '塔可、酸橘汁腌鱼、烤玉米、芒果辣椒',
    serve: { temp: '冰镇，无冰（straight up）', glass: '玛格丽特杯（盐口）' }, image: '' });

  add({ id: 'c-sazerac', name: 'Sazerac 萨泽拉克', brand: 'IBA 官方配方', category: 'cocktail', distillery: '新奥尔良',
    sub_type: '搅拌型古典（Stirred）', origin: '美国 · 新奥尔良', country: '美国', region: 'new_orleans',
    lat: 29.955, lon: -90.070, abv: 32, age: null,
    flavor_tags: ['黑麦', '苦艾酒', '裴乔氏苦精', '茴香', '柠檬油'],
    description: '公认的美国第一款鸡尾酒（19 世纪中叶，新奥尔良）。黑麦威士忌或干邑 + 苦精 + 糖，用苦艾酒涮杯后倒掉，最后喷柠檬皮油。无冰、浓烈、草本。',
    food_pairing: '卡真小龙虾、秋葵浓汤、炸牡蛎三明治',
    serve: { temp: '冰镇，无冰', glass: '古典杯' }, image: '' });

  add({ id: 'c-negroni', name: 'Negroni 尼格罗尼', brand: 'IBA 官方配方', category: 'cocktail', distillery: '佛罗伦萨',
    sub_type: '等份搅拌（1:1:1）', origin: '意大利 · 佛罗伦萨', country: '意大利', region: 'italy',
    lat: 43.770, lon: 11.255, abv: 24, age: null,
    price: '¥80–150 / 杯', priceNum: 110, rating: 4.6,
    flavor_tags: ['金巴利苦', '杜松子', '甜味美思', '橙皮', '草本'],
    description: '金酒 + 金巴利 + 甜味美思 1:1:1，1919 年佛罗伦萨。苦与甜的拉锯中带杜松子的清香，橙皮油是点睛。开胃酒之王，也是"成年人的味道"代言人。',
    food_pairing: '腌肉拼盘、橄榄、硬质奶酪、黑巧克力',
    serve: { temp: '加冰', glass: '古典杯（橙皮装饰）' }, image: '' });

  add({ id: 'c-oldfashioned', name: 'Old Fashioned 古典', brand: 'IBA 官方配方', category: 'cocktail', distillery: '肯塔基',
    sub_type: '搅拌型古典（Stirred）', origin: '美国 · 肯塔基', country: '美国', region: 'bourbon',
    lat: 38.040, lon: -84.500, abv: 32, age: null,
    price: '¥80–150 / 杯', priceNum: 110, rating: 4.5,
    flavor_tags: ['波本', '安高天娜苦精', '糖', '橙皮', '橡木'],
    description: '最古老的鸡尾酒定义（1806 年就有文字记载）：烈酒 + 糖 + 苦精 + 水。波本的甜、苦精的香、橙皮的油，简单到没有任何东西可以藏拙。',
    food_pairing: '烤坚果、牛排、雪茄',
    serve: { temp: '加一颗大冰球', glass: '古典杯' }, image: '' });

  add({ id: 'c-mojito', name: 'Mojito 莫吉托', brand: 'IBA 官方配方', category: 'cocktail', distillery: '哈瓦那',
    sub_type: '高球型（Highball）', origin: '古巴 · 哈瓦那', country: '古巴', region: 'cuba',
    lat: 23.130, lon: -82.380, abv: 13, age: null,
    price: '¥60–120 / 杯', priceNum: 90, rating: 4.3,
    flavor_tags: ['薄荷', '青柠', '朗姆', '蔗糖', '苏打'],
    description: '白朗姆 + 大量新鲜薄荷 + 青柠 + 蔗糖 + 苏打。关键是"拍"薄荷出香而非捣碎出苦，海明威在哈瓦那的 La Bodeguita 让它成为传奇。',
    food_pairing: '古巴三明治、炸香蕉、辣味小吃',
    serve: { temp: '大量碎冰', glass: '柯林杯' }, image: '' });

  add({ id: 'c-french75', name: 'French 75 法兰西 75', brand: 'IBA 官方配方', category: 'cocktail', distillery: '巴黎 / 新奥尔良',
    sub_type: '气泡型（Sparkling）', origin: '法国 · 巴黎', country: '法国', region: 'champagne',
    lat: 48.860, lon: 2.350, abv: 15, age: null,
    price: '¥90–160 / 杯', priceNum: 120, rating: 4.4,
    flavor_tags: ['金酒', '香槟', '柠檬', '气泡', '清爽'],
    description: '金酒 + 柠檬 + 糖， topped 香槟。名字来自一战时的法军 75mm 速射炮——喝起来优雅，后劲不小。任何时候想喝"有点 Champagne 的鸡尾酒"，点它。',
    food_pairing: '生蚝、鱼子酱、咸味小点',
    serve: { temp: '冰镇', glass: '笛型杯 / 柯林杯' }, image: '' });

  /* ==================== 中国白酒（10 款 —— 用户首轮反馈"要能查茅台"） ==================== */
  add({ id: 'c-moutai-feitian', name: '贵州茅台酒（飞天 53°）', brand: '贵州茅台', category: 'baijiu', distillery: '贵州茅台酒厂',
    sub_type: '酱香型 · 大曲酱香', origin: '贵州遵义 · 茅台镇', country: '中国', region: 'maotai',
    lat: 27.834, lon: 106.412, abv: 53, age: null,
    price: '¥1,500–2,400（500ml）', priceNum: 1900, rating: 4.9,
    flavor_tags: ['酱香突出', '幽雅细腻', '空杯留香', '回味悠长', '陈香', '焦糊'],
    description: '茅台镇赤水河谷小气候、紫色土壤 + 本地红缨子糯高粱 + 12987 工艺（1 年周期、2 次投料、9 次蒸煮、8 次发酵、7 次取酒）+ 5 年以上陶坛陈酿。酯类物质多达上百种，「酱香突出、幽雅细腻、空杯留香持久」是国酒代名词。53° 是酱香黄金酒精度——加水变浑是它的身份特征。',
    food_pairing: '川式红烧肉、毛血旺、烤全羊、腊味拼盘；高端商务宴请硬通货',
    serve: { temp: '常温或温烫至 40℃ 释放酯香', glass: '茅台玻璃分酒器 + 2–3 钱白瓷杯', extra: '拉酒线、看酒花、砸酒花 —— 老饕品鉴三件套' },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Moutai_Feitian.jpg/640px-Moutai_Feitian.jpg' });

  add({ id: 'c-wuliangye-8th', name: '五粮液 第八代经典装', brand: '五粮液', category: 'baijiu', distillery: '宜宾五粮液酒厂',
    sub_type: '浓香型 · 大曲浓香', origin: '四川宜宾', country: '中国', region: 'yibin',
    lat: 28.751, lon: 104.624, abv: 52, age: null,
    price: '¥900–1,150（500ml）', priceNum: 1000, rating: 4.7,
    flavor_tags: ['窖香浓郁', '醇厚甘冽', '入口绵软', '尾净余长', '粮香'],
    description: '「五粮液」名字来自 5 种粮食：高粱、大米、糯米、小麦、玉米。明代「陈氏秘方」温凉曲入窖，老窖发酵 60–90 天。浓香核心香源是「己酸乙酯」，闻起来像成熟的菠萝蜜+窖泥。第八代是 2019 年新包装，比第七代瓶身更修长、整体感更稳重。',
    food_pairing: '川菜、淮扬菜、海鲜、河鲜；喜宴 / 商务宴请硬通货',
    serve: { temp: '常温', glass: '水晶玻璃分酒器 + 小杯' }, image: '' });

  add({ id: 'c-fenjiu-qinghua20', name: '汾酒 青花 20', brand: '山西汾酒', category: 'baijiu', distillery: '山西杏花村汾酒厂',
    sub_type: '清香型 · 大曲清香', origin: '山西汾阳 · 杏花村', country: '中国', region: 'fenyang',
    lat: 37.265, lon: 111.785, abv: 53, age: 20,
    price: '¥400–550（500ml）', priceNum: 470, rating: 4.5,
    flavor_tags: ['清香纯正', '醇甜柔和', '余味爽净', '粮食香', '青苹果'],
    description: '清香型白酒的「鼻祖」。「借问酒家何处有，牧童遥指杏花村」即指此地。清香型的特点是乙酸乙酯 + 乳酸乙酯主导，香气干净无杂味，入口甜、落口净。「汾老大」之名源于它是新中国成立后白酒销量长期第一，开国大典国宴用酒。',
    food_pairing: '北京烤鸭、凉拌菜、面食、海鲜；适合不喜欢浓烈酒味的入门者',
    serve: { temp: '常温或冷藏', glass: '玻璃小杯' }, image: '' });

  add({ id: 'c-yanghe-m6plus', name: '洋河 梦之蓝 M6+', brand: '洋河', category: 'baijiu', distillery: '江苏洋河酒厂',
    sub_type: '浓香型 · 绵柔浓香', origin: '江苏宿迁', country: '中国',
    lat: 33.660, lon: 118.270, abv: 52, age: null,
    price: '¥700–900（500ml）', priceNum: 800, rating: 4.5,
    flavor_tags: ['绵柔', '甘冽', '窖香', '粮香', '陈香'],
    description: '洋河近年凭「绵柔浓香」路线杀出重围。M6+ 是中高端旗舰，比 M3 多 3 年陶坛陈酿。酒体特点是入口绵柔、甜润、不刺喉，特别适合不耐烈酒但又不想喝酱香的人群。江浙沪商务宴请首选。',
    food_pairing: '江浙菜、淮扬菜、海鲜、清淡粤菜',
    serve: { temp: '常温', glass: '水晶玻璃杯' }, image: '' });

  add({ id: 'c-langjiu-qinghualang', name: '郎酒 青花郎', brand: '郎酒', category: 'baijiu', distillery: '古蔺郎酒厂',
    sub_type: '酱香型 · 大曲酱香', origin: '四川古蔺 · 二郎镇', country: '中国',
    lat: 27.952, lon: 105.962, abv: 53, age: null,
    price: '¥900–1,100（500ml）', priceNum: 1000, rating: 4.7,
    flavor_tags: ['酱香', '陈香', '焦糊', '空杯留香', '酸甜'],
    description: '酱香型白酒「两大巨头」之一（另一个是茅台），同在赤水河谷，但二郎镇海拔比茅台镇高 200 米，气候更冷，发酵周期更长。风味上：酸度比茅台稍高、酱香更收敛，「茅郎并列」是高端酱香酒藏家圈标配。',
    food_pairing: '重油川菜、内脏、烧烤、腊肉',
    serve: { temp: '常温或温烫', glass: '小杯 / 茅台同款玻璃分酒器' }, image: '' });

  add({ id: 'c-guojiao1573', name: '泸州老窖 国窖 1573', brand: '泸州老窖', category: 'baijiu', distillery: '泸州老窖酒厂',
    sub_type: '浓香型 · 大曲浓香', origin: '四川泸州', country: '中国',
    lat: 28.872, lon: 105.443, abv: 52, age: null,
    price: '¥800–950（500ml）', priceNum: 870, rating: 4.6,
    flavor_tags: ['窖香浓郁', '醇厚', '绵甜', '尾净', '糟香'],
    description: '「千年老窖万年糟」，1573 这个名字来自公司拥有的 1573 年建造的国宝级窖池群。窖龄越长、窖泥中富集的产香微生物越丰富，窖香（己酸乙酯）越突出。浓香型白酒里公认的高端代表，三大「浓香鼻祖」之一。',
    food_pairing: '川菜、淮扬菜、烤肉、商务宴请',
    serve: { temp: '常温', glass: '玻璃分酒器 + 小杯' }, image: '' });

  add({ id: 'c-jiannanchun-crystal', name: '剑南春 水晶剑', brand: '剑南春', category: 'baijiu', distillery: '四川剑南春酒厂',
    sub_type: '浓香型 · 大曲浓香', origin: '四川绵竹', country: '中国',
    lat: 31.340, lon: 104.196, abv: 52, age: null,
    price: '¥380–480（500ml）', priceNum: 430, rating: 4.4,
    flavor_tags: ['窖香', '粮香', '甘冽', '清爽', '醇厚'],
    description: '唐朝宫廷御酒「剑南之春」的正统传承者。浓香型里价格最良心的「老牌国优」之一，500ml 一瓶不到 ¥500，但窖香 + 粮香都拿得出手。民间婚宴 / 商务接待的「不出错」选择。',
    food_pairing: '川菜、淮扬菜、面食、家常菜',
    serve: { temp: '常温', glass: '小杯' }, image: '' });

  add({ id: 'c-gujing-20', name: '古井贡酒 年份原浆 古 20', brand: '古井贡酒', category: 'baijiu', distillery: '安徽古井贡酒厂',
    sub_type: '浓香型 · 大曲浓香', origin: '安徽亳州', country: '中国',
    lat: 33.871, lon: 115.776, abv: 50, age: 20,
    price: '¥400–500（500ml）', priceNum: 450, rating: 4.3,
    flavor_tags: ['窖香', '粮香', '醇厚', '甘冽', '尾净'],
    description: '古井贡是曹操家乡亳州的「中华第一贡」，明清两代都是贡酒。古 20 是年份原浆系列中端款，江淮派浓香代表之一，特点是窖香更柔顺、入口更甜润，比川派浓香少几分烈性。',
    food_pairing: '徽菜、淮扬菜、面食',
    serve: { temp: '常温', glass: '小杯' }, image: '' });

  add({ id: 'c-xijiu-1988', name: '习酒 窖藏 1988', brand: '习酒', category: 'baijiu', distillery: '贵州习酒酒厂',
    sub_type: '酱香型 · 大曲酱香', origin: '贵州遵义 · 习水', country: '中国',
    lat: 28.331, lon: 106.211, abv: 53, age: null,
    price: '¥450–600（500ml）', priceNum: 520, rating: 4.5,
    flavor_tags: ['酱香', '陈香', '醇厚', '尾净', '酸甜'],
    description: '习酒是茅台集团旗下「第二大酱香品牌」，1988 是其旗舰单品——1998 年为纪念习酒建厂 50 周年推出。风味是标准酱香，酸度比茅台略低，对酱香入门者更友好。商务宴请、礼品、收藏皆可。',
    food_pairing: '川菜、烧烤、内脏、腊味',
    serve: { temp: '常温', glass: '小杯' }, image: '' });

  add({ id: 'c-shede-sh', name: '舍得 智慧舍得', brand: '舍得酒业', category: 'baijiu', distillery: '四川舍得酒业',
    sub_type: '浓香型 · 大曲浓香', origin: '四川射洪', country: '中国',
    lat: 30.873, lon: 105.421, abv: 52, age: null,
    price: '¥380–500（500ml）', priceNum: 440, rating: 4.3,
    flavor_tags: ['窖香', '粮香', '醇厚', '绵软', '陈香'],
    description: '舍得是沱牌曲酒旗下高端品牌，「舍百斤好酒、得一瓶舍得」—— 用 6 年以上基酒勾兑。沱牌舍得射洪产区是老牌川酒重要产地之一，与五粮液同属「川派浓香」，但风格更偏绵柔。',
    food_pairing: '川菜、家常菜、面食',
    serve: { temp: '常温', glass: '小杯' }, image: '' });

  /* ==================== 日本清酒（6 款 —— 涵盖纯米大吟醴 / 纯米酒 / 本酿造） ==================== */
  add({ id: 'c-dassai-23', name: '獺祭 二割三分 纯米大吟酿', brand: '獺祭 · 旭酒造', category: 'sake', distillery: '旭酒造',
    sub_type: '纯米大吟酿', origin: '山口县 · 岩国市', country: '日本', region: 'yamaguchi',
    lat: 34.186, lon: 132.219, abv: 16, age: null,
    price: '¥700–1,000（720ml）', priceNum: 850, rating: 4.8,
    flavor_tags: ['白桃', '哈密瓜', '青苹果', '花香', '旨味'],
    description: '二割三分 = 精米步合 23%，意味着每粒米磨掉 77% 只留米芯。日本大吟酿最高峰之一，2013 年起成为美国白宫国宴用酒。香气奔放，入口如沐春风；冷藏 8℃ 单独品味，搭配白身鱼刺身最佳。',
    food_pairing: '白身鱼刺身、海胆、寿司、天妇罗（淡味）',
    serve: { temp: '8–12℃ 冷藏', glass: '白葡萄酒杯（闻香）/ 猪口杯（传统）' },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dassai_23.jpg/640px-Dassai_23.jpg' });

  add({ id: 'c-juyondai-honmaru', name: '十四代 本丸', brand: '十四代 · 高木酒造', category: 'sake', distillery: '高木酒造',
    sub_type: '纯米大吟酿', origin: '山形县 · 村山市', country: '日本', region: 'yamagata',
    lat: 38.485, lon: 140.380, abv: 15, age: null,
    price: '¥3,800–5,500（1,800ml）', priceNum: 4500, rating: 4.9,
    flavor_tags: ['蜜瓜', '青苹果', '花香', '旨味', '甘甜'],
    description: '十四代是日本清酒界的「茅台」，一酒难求。本丸是入门款，比顶级款「龙月」「双虹」便宜得多，但同款酒米「龙之落とし子」与「酒未来」是十四代核心竞争力。香气如热带水果，入口有蜂蜜甜感，酸度恰好。1,800ml 一瓶可以倒 12 杯。',
    food_pairing: '高级寿司、刺身、烤白身鱼、和食怀石',
    serve: { temp: '10–12℃ 微冷', glass: '白葡萄酒杯' }, image: '' });

  add({ id: 'c-dassai-39', name: '獺祭 三割九分 純米大吟醸', brand: '獺祭 · 旭酒造', category: 'sake', distillery: '旭酒造',
    sub_type: '纯米大吟酿', origin: '山口县 · 岩国市', country: '日本',
    lat: 34.186, lon: 132.219, abv: 16, age: null,
    price: '¥380–520（720ml）', priceNum: 450, rating: 4.6,
    flavor_tags: ['哈密瓜', '青苹果', '米甜', '旨味'],
    description: '二割三分的「妹妹款」，精米步合 39%，价格更亲民，香气同样浓郁。是首次尝试獺祭的首选款。',
    food_pairing: '寿司、刺身、天妇罗、淡味和食',
    serve: { temp: '8–12℃', glass: '白葡萄酒杯 / 猪口杯' }, image: '' });

  add({ id: 'c-kubota-suiju', name: '久保田 翠寿', brand: '久保田 · 朝日酒造', category: 'sake', distillery: '朝日酒造',
    sub_type: '纯米大吟酿', origin: '新潟县 · 长冈市', country: '日本', region: 'niigata',
    lat: 37.446, lon: 138.851, abv: 15, age: null,
    price: '¥280–400（720ml）', priceNum: 340, rating: 4.4,
    flavor_tags: ['淡丽', '辛口', '米香', '旨味', '矿物感'],
    description: '新潟县清酒之王「久保田」系列的中端款。「淡丽辛口」是新潟县酒的整体风格——口味清淡、干净、利落、不甜腻。适合搭配各种和食，温烫到 40–45℃ 又是另一番风味。',
    food_pairing: '寿司、刺身、烤鱼、天妇罗',
    serve: { temp: '8–12℃ 冷 或 40–45℃ 温', glass: '猪口杯 / 玻璃杯' }, image: '' });

  add({ id: 'c-kokuryu', name: '黑龙 大吟酿', brand: '黑龙 · 黑龙酒造', category: 'sake', distillery: '黑龙酒造',
    sub_type: '大吟酿', origin: '福井县 · 胜山市', country: '日本',
    lat: 36.061, lon: 136.502, abv: 15, age: null,
    price: '¥350–500（720ml）', priceNum: 420, rating: 4.5,
    flavor_tags: ['果香', '米甜', '旨味', '平衡', '柔和'],
    description: '福井县代表酒款之一，1988 年被选为日本航空头等舱用酒。黑龙酒造是「山废」酒母工艺复兴的旗手，大吟酿入口柔和、香气饱满、酸甜平衡，是高级日本料亭的常见用酒。',
    food_pairing: '刺身、寿司、烤鱼、怀石料理',
    serve: { temp: '10–12℃ 冷藏', glass: '白葡萄酒杯' }, image: '' });

  add({ id: 'c-hakutsuru', name: '白鹤 纯米酒', brand: '白鹤酒造', category: 'sake', distillery: '白鹤酒造',
    sub_type: '纯米酒', origin: '兵库县 · 神户市滩区', country: '日本',
    lat: 34.706, lon: 135.213, abv: 15, age: null,
    price: '¥150–220（720ml）', priceNum: 180, rating: 4.1,
    flavor_tags: ['米香', '旨味', '干净', '平衡'],
    description: '滩五乡（神户西部）是日本「酒心之国」，白鹤是五大老牌酒蔵之一。纯米酒系列是入门级的「本格派」，没有添加酿造酒精，米味与旨味并重。冷藏 / 常温 / 温烫都行，是日本居酒屋最常见的「お通し酒」。',
    food_pairing: '寿司、刺身、烤鸡串、烧鸟、拉面',
    serve: { temp: '8–12℃ 冷 / 40℃ 温烫', glass: '猪口杯 / 玻璃杯' }, image: '' });

  /* ==================== 米酒 / 黄酒 / 梅酒（7 款） ==================== */
  add({ id: 'c-guyue-5y', name: '古越龙山 五年陈花雕酒', brand: '古越龙山', category: 'mijiu', distillery: '古越龙山绍兴酒厂',
    sub_type: '中国黄酒 · 加饭酒', origin: '浙江 · 绍兴', country: '中国', region: 'shaoxing',
    lat: 29.997, lon: 120.585, abv: 14, age: 5,
    price: '¥35–55（500ml）', priceNum: 45, rating: 4.2,
    flavor_tags: ['琥珀色', '蜜糖', '糯米甜', '焦糖', '草药'],
    description: '绍兴黄酒是「中国黄酒之宗」，古越龙山是最大品牌。五年陈花雕是经典入门款，糯米 + 麦曲发酵，陶坛陈酿 5 年。微甜、醇厚、有「温一壶黄酒、配一盘大闸蟹」的江南仪式感。可直接温饮，也可做菜（花雕醉鸡、绍兴黄酒炖蛋）。',
    food_pairing: '大闸蟹、醉虾、姜母鸭、绍兴臭豆腐、醉鸡',
    serve: { temp: '温烫至 35–45℃（温一温更香）', glass: '陶瓷酒壶 + 小杯' },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Shaoxing_wine_jar.jpg/640px-Shaoxing_wine_jar.jpg' });

  add({ id: 'c-guyue-10y', name: '古越龙山 中央库藏十年陈', brand: '古越龙山', category: 'mijiu', distillery: '古越龙山绍兴酒厂',
    sub_type: '中国黄酒 · 元红酒', origin: '浙江 · 绍兴', country: '中国',
    lat: 29.997, lon: 120.585, abv: 15, age: 10,
    price: '¥220–360（500ml）', priceNum: 290, rating: 4.6,
    flavor_tags: ['深琥珀', '蜜糖', '陈香', '焦糖', '坚果'],
    description: '十年陈黄酒已经进入收藏级别。陶坛陈酿 10 年的黄酒，糖分与氨基酸深度反应，颜色呈深琥珀色，香气从糯米甜转向陈香、坚果、太妃糖。中老年男士的挚爱，也是高端江浙菜餐厅的镇店之选。',
    food_pairing: '大闸蟹、陈年火腿、酱鸭、醉虾、淮扬大菜',
    serve: { temp: '常温或 30℃ 微温', glass: '陶瓷酒壶 + 小杯' }, image: '' });

  add({ id: 'c-kuaijishan-5y', name: '会稽山 五年陈花雕酒', brand: '会稽山', category: 'mijiu', distillery: '会稽山绍兴酒',
    sub_type: '中国黄酒 · 加饭酒', origin: '浙江 · 绍兴', country: '中国',
    lat: 29.997, lon: 120.585, abv: 14, age: 5,
    price: '¥30–48（500ml）', priceNum: 40, rating: 4.1,
    flavor_tags: ['蜜糖', '糯米甜', '麦曲', '清爽'],
    description: '会稽山与古越龙山并称「绍兴黄酒两大支柱」。五年陈花雕性价比极高，比古越龙山更清爽、米味更突出，适合年轻入门者。',
    food_pairing: '大闸蟹、醉鸡、绍兴菜、家常江浙菜',
    serve: { temp: '温烫', glass: '陶瓷酒壶 + 小杯' }, image: '' });

  add({ id: 'c-tapai-shougong', name: '塔牌 手工冬酿', brand: '塔牌', category: 'mijiu', distillery: '塔牌绍兴酒',
    sub_type: '中国黄酒 · 元红酒', origin: '浙江 · 绍兴', country: '中国',
    lat: 29.997, lon: 120.585, abv: 15, age: null,
    price: '¥120–200（500ml）', priceNum: 160, rating: 4.4,
    flavor_tags: ['糯米甜', '蜜糖', '干净', '微酸'],
    description: '塔牌是中国黄酒里少数坚持「手工冬酿」的老牌酒厂—— 冬至投料、立春开耙、立夏压榨，整个过程依古法，不机械赶工。手工冬酿黄酒比普通机制酒更醇和、香气更复杂。',
    food_pairing: '大闸蟹、醉鸡、淮扬菜、绍兴菜',
    serve: { temp: '温烫至 40℃', glass: '陶瓷酒壶 + 小杯' }, image: '' });

  add({ id: 'c-nverhong-18y', name: '女儿红 十八年陈', brand: '女儿红', category: 'mijiu', distillery: '女儿红绍兴酒',
    sub_type: '中国黄酒 · 花雕酒', origin: '浙江 · 绍兴', country: '中国',
    lat: 29.997, lon: 120.585, abv: 16, age: 18,
    price: '¥280–450（500ml）', priceNum: 360, rating: 4.7,
    flavor_tags: ['陈香', '蜜糖', '焦糖', '深琥珀', '厚重'],
    description: '女儿红是中国最富浪漫色彩的黄酒——据说在江南地区，父母在女儿出生时埋一坛黄酒，等到女儿出嫁时挖出来宴请宾客，所以叫「女儿红」。18 年陈已经是非常成熟的口感，琥珀色深邃，蜜糖 + 焦糖 + 陈香交织。江浙高端婚宴 / 寿宴必备。',
    food_pairing: '陈年火腿、酱鸭、醉虾、大闸蟹、淮扬大菜',
    serve: { temp: '常温', glass: '陶瓷酒壶 + 小杯' }, image: '' });

  add({ id: 'c-umenohi', name: '梅乃宿 梅酒', brand: '梅乃宿酒造', category: 'mijiu', distillery: '梅乃宿酒造',
    sub_type: '日本梅酒 · 本格派', origin: '奈良县 · 葛城市', country: '日本',
    lat: 34.477, lon: 135.736, abv: 12, age: null,
    price: '¥120–180（720ml）', priceNum: 150, rating: 4.5,
    flavor_tags: ['梅子', '蜜糖', '微酸', '酒香', '果香'],
    description: '「本格梅酒」代表品牌之一，全程用奈良县产青梅 + 梅乃宿清酒浸渍 1–2 年，不加任何香料、色素、酸味料。开瓶就是满满梅香，入口甜中带酸，尾韵有清酒发酵的酒香。加冰块或苏打水即成「梅子 Highball」，夏天人气款。',
    food_pairing: '日料前菜、烤肉、奶酪、炸鸡、生鱼片',
    serve: { temp: '5–8℃ 冰镇 / 加冰直饮', glass: '洛克杯 / 加苏打水' }, image: '' });

  add({ id: 'c-choya', name: '蝶矢 梅酒（俏雅）', brand: '蝶矢', category: 'mijiu', distillery: '蝶矢',
    sub_type: '日本梅酒 · 经典款', origin: '和歌山县', country: '日本',
    lat: 33.738, lon: 135.504, abv: 14, age: null,
    price: '¥70–110（750ml）', priceNum: 90, rating: 4.2,
    flavor_tags: ['梅子', '蜜糖', '清爽', '顺滑'],
    description: '「CHOYA 俏雅」是日本梅酒最大众化的品牌，几乎所有日料店、居酒屋都有。和歌山县纪州南高梅 + 白兰地 / 清酒浸渍，3 年内即装瓶。性价比首选款，「梅子 Highball」配炸鸡是日本居酒屋的黄金组合。',
    food_pairing: '炸鸡、烤串、烤肉、生鱼片、日料前菜',
    serve: { temp: '5–8℃ 冰镇', glass: '洛克杯 / 加苏打水' }, image: '' });

  SA.BOTTLES = B;

  /** 同步返回策展酒款（供 loadAll 当作一个"数据源"接入） */
  SA.api_curated = function () {
    /* 用合并后的总表（bottles.js 本体 + bottles_cn.js 补的中国各地/全球特色酒） */
    var SRC_ARR = (SA.BOTTLES && SA.BOTTLES.length ? SA.BOTTLES : B);
    return SRC_ARR.map(function (b) {
      var o = {};
      for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) o[k] = b[k];
      o.hasGeo = isFinite(o.latitude) && isFinite(o.longitude);
      return o;
    });
  };

  /** 按产区 id 取该产区的策展酒款 */
  SA.bottlesByRegion = function (regionId) {
    if (!regionId) return [];
    return B.filter(function (b) { return b.region === regionId; });
  };
})(window.SA);
