/* =============================================================
 * regions.js — 产区百科（人工校对的深度知识层）
 * 说明：公开 API 只提供「酒款名 + 产地国家」，无法回答
 *      「艾雷岛是什么风格、闻起来怎样、有哪些真实酒厂和典型酒款」。
 *      本模块补齐这一层，内容基于公开产区知识整理，坐标精确到产区/城镇。
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  /**
   * 条目字段
   *  id/name/en/category/country/lat/lon  —— 定位与归类
   *  tagline   —— 一句话定位
   *  terroir   —— 风土（地理/气候/水/原料）
   *  craft     —— 工艺要点
   *  flavor    —— 风味标签（用于搜索与地球标记）
   *  peat/abv/age —— 关键参数（泥煤值 ppm / 酒精度 / 常见酒龄）
   *  brands    —— 真实酒厂 / 品牌（name 原名，cn 中文习惯译名，note 一句定位）
   *  bottles   —— 典型酒款（真实在售款）
   *  serve     —— 适饮温度与杯型
   *  pairing   —— 配餐
   *  priceBand —— 市场参考价区间（人民币）
   *  facts     —— 冷知识速览（[标签, 值]）
   */
  var R = {};

  /* ---------------- 苏格兰威士忌 ---------------- */
  R.islay = {
    id: 'islay', name: '艾雷岛', en: 'Islay', category: 'whisky', country: '英国 · 苏格兰',
    lat: 55.75, lon: -6.20, icon: '🏝️', level: '产区',
    tagline: '泥煤与海风的原点——一口下去是篝火、碘酒、海藻和咸柠檬。',
    terroir: '赫布里底群岛最南端的一座岛屿，面积仅 620 平方公里，却挤着 9 座在产酒厂。岛上覆盖着厚达数米的泥煤层（peat），酒厂挖它当燃料烘干发芽大麦，烟被湿冷海风压回麦子身上；熟成时仓库几乎贴着海，海盐与碘味常年渗进橡木桶。这两件事叠加，就是艾雷岛味道的全部来源。',
    craft: '地板发麦（部分酒厂自发芽）→ 泥煤熏麦（酚值 ppm 决定烟熏强度）→ 铜壶两次蒸馏 → 主要用波本桶（ refill / first-fill 混用），Lagavulin、Laphroaig 会用少量雪莉桶补甜。',
    flavor: ['泥煤烟熏', '海盐碘味', '篝火灰烬', '海藻', '药水/消毒水', '柠檬皮', '烟熏培根'],
    peat: '跨度极大：Bunnahabhain 核心款几乎无泥煤（1–2 ppm），Kilchoman / Ardbeg / Laphroaig 约 40–60 ppm，Octomore 系列可达 100+ ppm（全球最高之一）',
    abv: '核心款 40–46%，原桶强度（Cask Strength）常见 55–60%',
    age: '入门 10 年，进阶 12–18 年；超过 18 年后海盐感转柔、热带水果浮现',
    brands: [
      { name: 'Ardbeg', cn: '雅柏', note: '泥煤极重但有甜美果核，泥煤控的终点站', lat: 55.643, lon: -6.106 },
      { name: 'Laphroaig', cn: '拉弗格', note: '药水、碘酒、海苔——最“极端”的一支', lat: 55.638, lon: -6.155 },
      { name: 'Lagavulin', cn: '乐加维林', note: '厚重甜美 + 烟熏，慢炖型泥煤', lat: 55.636, lon: -6.128 },
      { name: 'Bowmore', cn: '波摩', note: '海盐与热带水果平衡，岛上的居中派', lat: 55.757, lon: -6.288 },
      { name: 'Caol Ila', cn: '卡尔里拉', note: '清瘦干净的泥煤，也是尊尼获加的基酒主力', lat: 55.854, lon: -6.109 },
      { name: 'Bruichladdich', cn: '布赫拉迪', note: '无泥煤线（The Classic Laddie）+ 超重泥煤线（Octomore）双线并行', lat: 55.765, lon: -6.363 },
      { name: 'Kilchoman', cn: '齐侯门', note: '2005 年建厂的新派，庄园式自种大麦 + 重泥煤', lat: 55.783, lon: -6.431 },
      { name: 'Bunnahabhain', cn: '布纳哈本', note: '几乎无泥煤 + 雪莉桶，岛上的“异类”', lat: 55.881, lon: -6.122 },
      { name: 'Ardnahoe', cn: '阿德纳霍', note: '2018 年建厂，岛上第 9 座，古典重泥煤路线', lat: 55.876, lon: -6.098 }
    ],
    bottles: ['Ardbeg 10 年', 'Laphroaig 10 年', 'Lagavulin 16 年', 'Bowmore 12 年', 'Caol Ila 12 年',
      'Bruichladdich The Classic Laddie', 'Kilchoman Machir Bay', 'Bunnahabhain 12 年', 'Ardbeg Uigeadail', 'Laphroaig Quarter Cask'],
    serve: { temp: '室温 18–20℃；加 2–3 滴水“打开”香气（重泥煤尤其需要）', glass: '格兰凯恩杯 / 郁金香闻香杯，别用大肚球形杯' },
    pairing: '生蚝、烟熏三文鱼、炭烤羊排、蓝纹奶酪、70% 以上黑巧克力',
    priceBand: '¥300–1,600：日常款 300–600，16/18 年 800–1,600，限量原桶 2,000+',
    facts: [['在产酒厂', '9 座'], ['泥煤值跨度', '1–100+ ppm'], ['岛屿面积', '约 620 km²'], ['陈年仓库', '多为贴海的传统地平式仓库']]
  };

  R.speyside = {
    id: 'speyside', name: '斯佩塞', en: 'Speyside', category: 'whisky', country: '英国 · 苏格兰',
    lat: 57.45, lon: -3.20, icon: '🌾', level: '产区',
    tagline: '苏格兰的“果篮”——苹果、梨、蜂蜜、香草，泥煤基本缺席。',
    terroir: '沿斯佩河（River Spey）谷地分布，是全苏格兰酒厂最密集的地方（约 50 座）。水源来自花岗岩层过滤的软水，谷地气候相对温和，成就了轻盈、果香、优雅的主流风格。',
    craft: '多用雪莉桶（Oloroso / PX）与波本桶并进，Glenfiddich、Balvenie 等仍保留地板发麦与自家桶匠；Macallan 以雪莉桶熟成策略闻名。',
    flavor: ['青苹果', '梨', '蜂蜜', '香草', '杏仁', '太妃糖', '干果', '橙皮'],
    peat: '普遍 0–5 ppm（极少泥煤），个别厂有烟熏副线（如 BenRiach Curiositas）',
    abv: '40–48%，单桶原酒常 55–60%',
    age: '12 年入门，15/18 年进阶，21/25 年高阶',
    brands: [
      { name: 'Macallan', cn: '麦卡伦', note: '雪莉桶标杆，干果与香料的教科书', lat: 57.483, lon: -3.202 },
      { name: 'Glenfiddich', cn: '格兰菲迪', note: '全球销量第一的单一麦芽，梨与青草', lat: 57.455, lon: -3.128 },
      { name: 'The Balvenie', cn: '百富', note: '仍自种大麦、自维护桶，蜂蜜与坚果', lat: 57.460, lon: -3.135 },
      { name: 'Glenlivet', cn: '格兰利威', note: '斯佩塞第一名门，花香与奶油', lat: 57.369, lon: -3.335 },
      { name: 'Aberlour', cn: '雅伯莱', note: '重雪莉桶代表，巧克力与干果', lat: 57.463, lon: -3.229 },
      { name: 'Mortlach', cn: '慕赫', note: '2.81 次蒸馏，肉感与油脂的“野兽”', lat: 57.443, lon: -3.128 }
    ],
    bottles: ['Macallan 12 年 雪莉桶', 'Glenfiddich 12 年', 'The Balvenie 12 年 DoubleWood', 'Glenlivet 15 年 French Oak', 'Aberlour A\'bunadh', 'Mortlach 12 年'],
    serve: { temp: '16–18℃', glass: '格兰凯恩杯；雪莉桶重口可用略阔口的闻香杯' },
    pairing: '烤鸭、焦糖布丁、坚果拼盘、硬质奶酪（Comté / Manchego）',
    priceBand: '¥250–3,000：12 年 250–500，18 年 1,200–2,500，麦卡伦高年份另计',
    facts: [['酒厂数量', '约 50 座'], ['主流桶型', '雪莉桶 + 波本桶'], ['泥煤使用', '极少'], ['代表河', 'River Spey']]
  };

  R.highland = {
    id: 'highland', name: '高地', en: 'Highland', category: 'whisky', country: '英国 · 苏格兰',
    lat: 57.48, lon: -4.22, icon: '⛰️', level: '产区',
    tagline: '面积最大、风格最广的产区——从轻盈花香到厚重海盐都算它。',
    terroir: '从因弗内斯一直延伸到苏格兰最北端与西海岸，跨度极大，因此风格也最杂。北高地偏咸与蜡感，东高地偏果香，西高地（Oban 一带）带海风。',
    craft: '以波本桶为主，偶用雪莉桶；Clynelish 的蜡质感来自其发酵与酒心切取工艺。',
    flavor: ['蜂蜜', '石楠花', '柑橘', '海盐', '蜡感', '坚果', '辛香料'],
    peat: '0–30 ppm 不等，视子区域而定',
    abv: '43–46%，单桶常见 50%+',
    age: '12–18 年为主，Oban、Dalmore 有 21/25 年线',
    brands: [
      { name: 'Oban', cn: '欧本', note: '西高地海港小镇，橙皮 + 海盐 + 烟熏', lat: 56.415, lon: -5.472 },
      { name: 'Clynelish', cn: '克莱尼利基', note: '标志性蜡质感，蜂蜜与柑橘', lat: 58.020, lon: -3.868 },
      { name: 'Dalmore', cn: '大摩', note: '多桶过桶工艺，巧克力与柑橘', lat: 57.689, lon: -4.253 },
      { name: 'Glenmorangie', cn: '格兰杰', note: '最高壶式蒸馏器，轻盈花香 + 过桶玩法', lat: 57.812, lon: -4.128 },
      { name: 'Old Pulteney', cn: '富特尼', note: '“北方海洋之魂”，咸味与麦芽', lat: 58.435, lon: -3.068 }
    ],
    bottles: ['Oban 14 年', 'Clynelish 14 年', 'Dalmore 12 年', 'Glenmorangie 10 年 Original', 'Old Pulteney 12 年'],
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' },
    pairing: '烤羊排、烟熏鳕鱼、陈年切达奶酪',
    priceBand: '¥300–1,800',
    facts: [['地理跨度', '苏格兰最大产区'], ['风格跨度', '最杂（轻盈↔厚重）'], ['海风影响', '西/北部明显']]
  };

  R.islands = {
    id: 'islands', name: '岛屿区（非艾雷）', en: 'Islands', category: 'whisky', country: '英国 · 苏格兰',
    lat: 58.60, lon: -3.10, icon: '🌊', level: '产区',
    tagline: '奥克尼、天空岛、刘易斯——比艾雷更野性、更咸、更石楠花。',
    terroir: '散落在苏格兰北部与西部的岛屿群，常年强风、低树、泥煤深厚，熟成环境极端，酒体普遍带海盐、石楠花与胡椒感。',
    craft: 'Talisker 用不对称蒸馏器制造胡椒感；Highland Park 自切泥煤（含石楠花根）并做雪莉桶平衡。',
    flavor: ['海盐', '石楠花蜜', '黑胡椒', '烟熏', '麦芽', '柑橘'],
    peat: '15–45 ppm，通常泥煤带甜味而非药味',
    abv: '45.8–48%（Talisker / Highland Park 主流）',
    age: '10–18 年',
    brands: [
      { name: 'Talisker', cn: '泰斯卡', note: '天空岛唯一酒厂，胡椒 + 海盐 + 烟熏', lat: 57.297, lon: -6.354 },
      { name: 'Highland Park', cn: '高原骑士', note: '奥克尼岛，石楠花蜜与烟熏的完美平衡', lat: 58.969, lon: -2.958 },
      { name: 'Scapa', cn: '斯卡帕', note: '同在奥克尼，无泥煤、蜂蜜与香草', lat: 58.959, lon: -3.010 },
      { name: 'Arran', cn: '阿伦', note: '岛上新兴，果香活泼', lat: 55.578, lon: -5.212 },
      { name: 'Jura', cn: '吉拉', note: '与艾雷隔海相望，风格却温和得多', lat: 55.997, lon: -5.945 }
    ],
    bottles: ['Talisker 10 年', 'Highland Park 12 年 Viking Honour', 'Scapa Skiren', 'Arran 10 年', 'Jura 10 年'],
    serve: { temp: '17–19℃', glass: '格兰凯恩杯' },
    pairing: '生蚝、烟熏海鲜、黑麦面包配黄油、陈年高达奶酪',
    priceBand: '¥280–1,200',
    facts: [['代表岛屿', 'Skye / Orkney / Arran / Jura'], ['共同点', '强海风 + 石楠花'], ['泥煤风味', '烟熏甜感为主，非药味']]
  };

  R.campbeltown = {
    id: 'campbeltown', name: '坎贝尔镇', en: 'Campbeltown', category: 'whisky', country: '英国 · 苏格兰',
    lat: 55.42, lon: -5.60, icon: '⚓', level: '产区',
    tagline: '曾经的“世界威士忌首都”，如今只剩 3 家，风格咸、油、有肉感。',
    terroir: '金泰尔半岛（Kintyre）南端的海港小镇，19 世纪曾有 30 多家酒厂，如今仅存 Springbank、Glen Scotia、Glengyle 三家，是最小众的产区。',
    craft: 'Springbank 坚持全程自做（地板发麦、自熏麦、自陈年装瓶），2.5 次蒸馏；Glen Scotia 有明显海盐与糖浆感。',
    flavor: ['海盐', '油脂感', '干果', '烟熏', '皮革', '糖浆', '肉汤'],
    peat: '10–30 ppm（Springbank 的 Longrow 系列更重）',
    abv: '46%（Springbank 全线 46% 未冷凝过滤）',
    age: '10–15 年为主，21 年以上少见',
    brands: [
      { name: 'Springbank', cn: '云顶', note: '100% 家族独立、全程自产，收藏级口碑', lat: 55.427, lon: -5.605 },
      { name: 'Glen Scotia', cn: '格兰帝', note: '维多利亚时期老厂，海盐与焦糖', lat: 55.429, lon: -5.608 },
      { name: 'Glengyle', cn: '格兰盖尔', note: '2004 复产，以 Kilkerran 品牌上市', lat: 55.428, lon: -5.606 }
    ],
    bottles: ['Springbank 10 年', 'Springbank 15 年', 'Longrow Peated', 'Glen Scotia 15 年', 'Kilkerran 12 年'],
    serve: { temp: '18–20℃', glass: '格兰凯恩杯' },
    pairing: '烤牛肉、烟熏火腿、坚果、黑麦面包',
    priceBand: '¥600–2,500（云顶溢价明显）',
    facts: [['现存酒厂', '3 座'], ['历史峰值', '19 世纪 30+ 座'], ['招牌工艺', '2.5 次蒸馏']]
  };

  R.lowland = {
    id: 'lowland', name: '低地', en: 'Lowland', category: 'whisky', country: '英国 · 苏格兰',
    lat: 55.95, lon: -4.20, icon: '🌿', level: '产区',
    tagline: '苏格兰的“开胃酒”——青草、柠檬、奶油的轻盈三重奏。',
    terroir: '苏格兰南部，地势平缓、气候温和，传统上多为三次蒸馏，酒体轻、谷物香明显。',
    craft: 'Auchentoshan 坚持三次蒸馏；新兴酒厂（Glasgow 的 Clydeside、Rosebank 复产）重拾低地传统。',
    flavor: ['青草', '柠檬', '奶油', '饼干', '白花', '蜂蜜'],
    peat: '0 ppm（基本无泥煤）',
    abv: '40–46%',
    age: '12–18 年',
    brands: [
      { name: 'Auchentoshan', cn: '欧肯特轩', note: '三次蒸馏代表，柑橘与杏仁', lat: 55.928, lon: -4.383 },
      { name: 'Glenkinchie', cn: '格兰昆奇', note: '“爱丁堡的麦芽”，花香与青草', lat: 55.883, lon: -2.883 },
      { name: 'Rosebank', cn: '罗斯班克', note: '2023 年复产的三蒸馏名厂', lat: 56.005, lon: -3.432 }
    ],
    bottles: ['Auchentoshan 12 年', 'Glenkinchie 12 年', 'Auchentoshan Three Wood'],
    serve: { temp: '12–16℃（可略冰镇）', glass: '郁金香杯 / 白酒杯亦可用' },
    pairing: '沙拉、白身鱼、山羊奶酪、柠檬挞',
    priceBand: '¥250–900',
    facts: [['蒸馏次数', '多为三次'], ['泥煤', '几乎不用'], ['定位', '餐前开胃']]
  };

  R.japan_whisky = {
    id: 'japan_whisky', name: '日本威士忌', en: 'Japanese Whisky', category: 'whisky', country: '日本',
    lat: 35.90, lon: 138.30, icon: '⛩️', level: '国家',
    tagline: '学苏格兰，但更讲“和谐”——水楢桶的檀香与线香是独门标志。',
    terroir: '三得利的山崎（京都盆地，多雾湿润）、白州（南阿尔卑斯山麓，雪水软水）、Nikka 的余市（北海道，靠海，气候接近苏格兰）。高低海拔差造就了同一集团内风格互补的调配基础。',
    craft: '严格分区熟成 + 精细调配（blending 被视为最高工艺）；水楢桶（Mizunara，日本橡木）带来檀香、沉香、椰子与线香气息，是日本独有的风味来源。',
    flavor: ['檀香/线香', '椰子', '青苹果', '蜂蜜', '白桃', '绿茶', '淡淡的烟熏'],
    peat: '0–25 ppm（余市、白州重泥煤版偏高）',
    abv: '43% 居多，原酒 50%+',
    age: '12/17 年经典线；因库存紧张，近年大量无年份（NAS）款',
    brands: [
      { name: 'Yamazaki', cn: '山崎', note: '日本单一麦芽起点，水楢与雪莉桶交织', lat: 34.888, lon: 135.570 },
      { name: 'Hakushu', cn: '白州', note: '森林中的酒厂，青草与薄荷感', lat: 35.828, lon: 138.280 },
      { name: 'Yoichi', cn: '余市', note: '北海道的海风与煤炭直火蒸馏，厚重烟熏', lat: 43.190, lon: 140.790 },
      { name: 'Miyagikyo', cn: '宫城峡', note: 'Nikka 的果香担当，轻盈花香', lat: 38.417, lon: 140.733 },
      { name: 'Hibiki', cn: '响', note: '调和巅峰，山崎+白州+知多的“和”', lat: 34.888, lon: 135.570 },
      { name: 'Nikka From The Barrel', cn: '余市/宫城峡调和原酒', note: '高性价比的入门神作（51.4%）', lat: 43.190, lon: 140.790 }
    ],
    bottles: ['山崎 12 年', '白州 12 年', '余市 单一麦芽', '响 Hibiki Harmony', 'Nikka From The Barrel', '宫城峡 单一麦芽'],
    serve: { temp: '16–20℃；日式 highball（苏打水 + 大冰）是最经典喝法', glass: '格兰凯恩杯 / 高球杯' },
    pairing: '刺身、天妇罗、烤鳗鱼、和果子、烟熏鸭胸',
    priceBand: '¥400–6,000：山崎/白州 12 年官方价 700–1,200，市场溢价常 2,000+；响 17/21 年可达 5,000–20,000',
    facts: [['独门桶', '水楢桶（Mizunara）'], ['经典喝法', 'Highball'], ['市场现状', '库存紧张，溢价显著'], ['地理跨度', '京都 / 山梨 / 北海道']]
  };

  R.bourbon = {
    id: 'bourbon', name: '美国波本/黑麦', en: 'Bourbon & Rye', category: 'whisky', country: '美国',
    lat: 38.04, lon: -84.50, icon: '🌽', level: '国家',
    tagline: '玉米带来的甜：香草、焦糖、椰子，配新烧焦橡木桶才合法。',
    terroir: '核心在肯塔基（全美 95% 波本产于此），石灰岩层过滤的硬水（无铁）是关键；极端大陆性气候（夏热冬冷）让酒在桶里剧烈呼吸，熟成速度远快于苏格兰。',
    craft: '法定要求：≥51% 玉米、全新炭烤橡木桶、入桶 ≤125 proof、装瓶 ≥80 proof、不得添加焦糖色以外的任何东西。酸醪（sour mash）工艺保证批次稳定。黑麦威士忌则要求 ≥51% 黑麦，辛香料感强。',
    flavor: ['香草', '焦糖', '烤玉米', '椰子', '肉桂', '黑胡椒', '樱桃', '皮革'],
    peat: '不适用（不用泥煤）',
    abv: '40–65%（small batch / barrel proof 常见 55–65%）',
    age: '4–12 年为主（气候热，陈太快容易过木）',
    brands: [
      { name: 'Buffalo Trace', cn: '水牛足迹', note: '性价比之王，也是 Pappy 的娘家', lat: 38.203, lon: -84.873 },
      { name: 'Maker\'s Mark', cn: '美格', note: '冬小麦替代黑麦，柔甜无刺激', lat: 37.643, lon: -85.348 },
      { name: 'Wild Turkey', cn: '威凤凰', note: '高黑麦比例，强劲辛香', lat: 38.203, lon: -84.873 },
      { name: 'Jim Beam', cn: '金宾', note: '全球销量最大的波本', lat: 37.970, lon: -85.663 },
      { name: 'Four Roses', cn: '四玫瑰', note: '10 种原酒配方，日系精细派', lat: 37.643, lon: -85.348 },
      { name: 'Woodford Reserve', cn: '活福', note: '三次壶式蒸馏，甜美香料', lat: 38.203, lon: -84.873 }
    ],
    bottles: ['Buffalo Trace 波本', 'Maker\'s Mark 46', 'Wild Turkey 101', 'Four Roses Small Batch', 'Woodford Reserve Double Oaked', 'Eagle Rare 10 年', 'Blanton\'s Original'],
    serve: { temp: '室温或加一颗大冰球', glass: '古典杯（Rock） / 格兰凯恩杯' },
    pairing: 'BBQ 猪肋排、炸鸡、焦糖布丁、山核桃派、雪茄',
    priceBand: '¥180–1,500：日常 180–350，小批量 400–800，Pappy 系列 10,000+',
    facts: [['法定容器', '全新炭烤橡木桶（必须用一次）'], ['玉米比例', '≥51%'], ['主产区', '肯塔基州'], ['熟成速度', '约为苏格兰的 2–3 倍']]
  };

  R.irish = {
    id: 'irish', name: '爱尔兰威士忌', en: 'Irish Whiskey', category: 'whisky', country: '爱尔兰',
    lat: 53.35, lon: -6.26, icon: '☘️', level: '国家',
    tagline: '三次蒸馏的顺滑——青草、青苹果、奶油，几乎不冒犯任何人。',
    terroir: '温带海洋性气候，全年温和，熟成平稳。历史上曾是全球最大产区，20 世纪衰落后近 20 年强势复兴。',
    craft: '标志性的三次蒸馏（部分厂仍用壶式 + 柱式混合），常使用未发芽大麦（pot still 传统）带来油脂与辛香。',
    flavor: ['青苹果', '香草', '蜂蜜', '燕麦饼干', '柑橘', '轻微辛香'],
    peat: '0–20 ppm（Connemara 等少数泥煤款）',
    abv: '40–46%',
    age: '12–18 年',
    brands: [
      { name: 'Jameson', cn: '尊美醇', note: '全球最畅销的爱尔兰威士忌', lat: 51.910, lon: -8.170 },
      { name: 'Redbreast', cn: '知更鸟', note: 'Single Pot Still 标杆，雪莉桶厚度惊人', lat: 51.910, lon: -8.170 },
      { name: 'Bushmills', cn: '布什米尔', note: '北爱最古老持照酒厂', lat: 55.203, lon: -6.520 },
      { name: 'Teeling', cn: '帝林', note: '都柏林新派，各种过桶玩法', lat: 53.343, lon: -6.275 }
    ],
    bottles: ['Jameson Irish Whiskey', 'Redbreast 12 年', 'Bushmills 10 年', 'Teeling Small Batch', 'Green Spot'],
    serve: { temp: '16–20℃', glass: '郁金香杯' },
    pairing: '爱尔兰炖羊肉、烟熏三文鱼、苏打面包、苹果派',
    priceBand: '¥150–1,200',
    facts: [['蒸馏次数', '典型三次'], ['独门类型', 'Single Pot Still'], ['复兴时间', '近 20 年']]
  };

  /* ---------------- 葡萄酒 ---------------- */
  R.bordeaux = {
    id: 'bordeaux', name: '波尔多', en: 'Bordeaux', category: 'red', country: '法国',
    lat: 44.84, lon: -0.58, icon: '🍇', level: '产区',
    tagline: '左岸赤霞珠的骨架，右岸梅洛的肉感——世界上最会“陈年”的红葡萄酒。',
    terroir: '加龙河与多尔多涅河汇成吉伦特河，把产区切成三块：左岸（Médoc / Graves）砾石土，保温排水好，赤霞珠主场；右岸（Saint-Émilion / Pomerol）黏土石灰岩，梅洛主场；两海之间（Entre-Deux-Mers）以白酒为主。海洋性气候 + 松林屏障。',
    craft: '严格的分级制度（1855 列级庄 / 圣爱美隆分级）；普遍橡木桶陈酿 12–24 个月；以混酿（blending）为灵魂，而非单品种。',
    flavor: ['黑醋栗', '雪松', '铅笔芯', '紫罗兰', '烟草', '黑樱桃', '李子', '雪茄盒'],
    abv: '12.5–14.5%',
    age: '左岸列级庄 10–30 年；右岸 5–15 年；顶级年份可达 50 年',
    brands: [
      { name: 'Château Lafite Rothschild', cn: '拉菲', note: '1855 一级庄， pencil lead 与雪松的典范', lat: 45.232, lon: -0.757 },
      { name: 'Château Latour', cn: '拉图', note: '最“硬核”的一级庄，结构感极强', lat: 45.220, lon: -0.760 },
      { name: 'Château Margaux', cn: '玛歌', note: '优雅与香气的极致', lat: 45.040, lon: -0.680 },
      { name: 'Château Mouton Rothschild', cn: '木桐', note: '每年邀请艺术家设计酒标', lat: 45.213, lon: -0.757 },
      { name: 'Petrus', cn: '柏图斯', note: '波美侯之王，几乎纯梅洛', lat: 44.930, lon: -0.196 },
      { name: 'Château Cheval Blanc', cn: '白马', note: '圣爱美隆 A 级，品丽珠比例高', lat: 44.923, lon: -0.192 }
    ],
    bottles: ['Château Lafite Rothschild', 'Château Latour', 'Château Margaux', 'Petrus', 'Château Cheval Blanc', 'Château Lynch-Bages', 'Château Montrose'],
    serve: { temp: '16–18℃（年轻的浓郁款可 15℃）', glass: '大肚波尔多杯（让酒液接触空气）' },
    pairing: '炭烤战斧牛排、羊排、松露料理、硬质奶酪',
    priceBand: '¥200–50,000+：入门 AOC 波尔多 200–400，中级庄 400–900，列级庄 2,000–20,000，一级庄顶级年份数万',
    facts: [['左岸主力', '赤霞珠'], ['右岸主力', '梅洛'], ['分级制度', '1855 列级庄制度'], ['经典年份', '2000 / 2005 / 2009 / 2010 / 2015 / 2016 / 2019']]
  };

  R.burgundy = {
    id: 'burgundy', name: '勃艮第', en: 'Burgundy', category: 'red', country: '法国',
    lat: 47.02, lon: 4.84, icon: '🍒', level: '产区',
    tagline: '黑皮诺与霞多丽的极致表达——讲究“地块”到了偏执的地步。',
    terroir: '第戎到里昂之间的狭长坡地，石灰岩 + 泥灰岩土壤，是“风土”（terroir）概念的发源地。同一座山，坡顶与坡底的酒能差一个天。分级以地块为核心：Grand Cru > Premier Cru > Village > Régionale。',
    craft: '黑皮诺（红）与霞多丽（白）几乎垄断；常用整串发酵（whole cluster）与淋皮（pigeage）；橡木桶陈酿 12–18 个月，新桶比例视等级与酒庄风格。',
    flavor: ['红樱桃', '草莓', '玫瑰花瓣', '泥土/森林地表', '蘑菇', '动物皮革', '山楂'],
    abv: '12.5–14%',
    age: '村级 3–8 年，一级园 8–15 年，特级园 15–30 年',
    brands: [
      { name: 'Domaine de la Romanée-Conti', cn: '罗曼尼·康帝', note: '勃艮第的神话，DRC', lat: 47.163, lon: 4.952 },
      { name: 'Domaine Leroy', cn: '勒桦', note: '生物动力法先驱，价格与 DRC 并驾', lat: 47.163, lon: 4.952 },
      { name: 'Domaine Armand Rousseau', cn: '卢梭', note: '香贝丹的标杆', lat: 47.240, lon: 4.948 },
      { name: 'Maison Louis Jadot', cn: '路易亚都', note: '覆盖广、品质稳的大商', lat: 47.023, lon: 4.838 },
      { name: 'Domaine Leflaive', cn: '勒弗莱', note: '白勃艮第（蒙哈榭）天花板', lat: 46.948, lon: 4.755 }
    ],
    bottles: ['Romanée-Conti Grand Cru', 'Chambertin Grand Cru', 'Gevrey-Chambertin 1er Cru', 'Meursault 1er Cru', 'Chablis Grand Cru', 'Vosne-Romanée'],
    serve: { temp: '红 14–16℃；白 10–12℃', glass: '大肚球形勃艮第杯（聚香）' },
    pairing: '烤鸭、野禽、蘑菇烩饭、软质奶酪（Époisses）',
    priceBand: '¥300–100,000+：大区级 300–600，村级 800–2,000，一级园 2,000–8,000，特级园 10,000+',
    facts: [['红葡萄', '黑皮诺'], ['白葡萄', '霞多丽'], ['分级核心', '地块（Climat）'], ['土壤', '石灰岩 + 泥灰岩']]
  };

  R.champagne = {
    id: 'champagne', name: '香槟', en: 'Champagne', category: 'sparkling', country: '法国',
    lat: 49.04, lon: 3.96, icon: '🍾', level: '产区',
    tagline: '只有这里产的才叫香槟——二次发酵带来的面包屑、奶油与极细气泡。',
    terroir: '巴黎以东约 150 公里的极北产区，白垩土（chalk）储水又反光，气候冷凉，酸度极高——这正是起泡酒需要的原料。三大核心区：Montagne de Reims（黑皮诺）、Vallée de la Marne（莫尼耶）、Côte des Blancs（霞多丽）。',
    craft: '传统法（Méthode Traditionnelle）：基酒调配 → 瓶内二次发酵 → 酒泥陈酿（酒渣自溶带来烤面包、奶油味）→ 转瓶（riddling）→ 除渣（disgorgement）→ 补液（dosage）。无年份（NV）法定陈酿 15 个月，年份酒 3 年以上。',
    flavor: ['烤面包', '布里欧修', '柑橘', '白桃', '杏仁', '白垩矿物感', '蜂蜜'],
    abv: '12–12.5%',
    age: 'NV 出炉即饮（可再放 2–3 年）；年份香槟可陈 10–20 年',
    brands: [
      { name: 'Moët & Chandon', cn: '酩悦', note: '全球销量第一，风格均衡', lat: 49.044, lon: 3.961 },
      { name: 'Veuve Clicquot', cn: '凯歌', note: '黄牌是全世界最认的香槟之一', lat: 49.258, lon: 4.034 },
      { name: 'Dom Pérignon', cn: '唐培里侬', note: '只做年份，永远是 P2 的期待', lat: 49.044, lon: 3.961 },
      { name: 'Krug', cn: '库克', note: '多年份调配 + 橡木桶发酵，复杂度标杆', lat: 49.258, lon: 4.034 },
      { name: 'Bollinger', cn: '堡林爵', note: '詹姆斯·邦德同款，力量感强', lat: 49.050, lon: 4.000 },
      { name: 'Salon', cn: '沙龙', note: '只做白中白（Blanc de Blancs）年份，极端稀少', lat: 48.945, lon: 4.000 }
    ],
    bottles: ['Moët & Chandon Impérial', 'Veuve Clicquot Yellow Label', 'Dom Pérignon Vintage', 'Krug Grande Cuvée', 'Bollinger Special Cuvée', 'Laurent-Perrier Brut'],
    serve: { temp: '6–8℃（绝不能冰到 4℃ 以下，会锁住香气）', glass: '笛型杯看气泡、白葡萄酒杯闻香气（行家更爱后者）' },
    pairing: '生蚝、鱼子酱、炸物、咸味坚果、奶油意面',
    priceBand: '¥350–3,000：入门 NV 350–600，年份 1,000–2,500，顶级（Krug / Salon）3,000+',
    facts: [['法定工艺', '传统瓶内二次发酵法'], ['三大品种', '霞多丽 / 黑皮诺 / 莫尼耶'], ['土壤', '白垩土'], ['法定陈酿', 'NV ≥15 个月、年份 ≥3 年']]
  };

  R.rioja = {
    id: 'rioja', name: '里奥哈', en: 'Rioja', category: 'red', country: '西班牙',
    lat: 42.45, lon: -2.60, icon: '🌶️', level: '产区',
    tagline: '美国橡木桶养出来的西班牙绅士——椰子、香草、皮革，性价比极高。',
    terroir: '埃布罗河谷地，北有坎塔布里亚山脉挡雨，海洋性与大陆性气候混合。分三个子区：Rioja Alta（高海拔、优雅）、Rioja Alavesa（石灰岩、酸度好）、Rioja Baja（温暖、酒体厚）。',
    craft: '以丹魄（Tempranillo）为主，混少量歌海娜、马苏埃罗；传统派长时间在美国橡木桶陈酿（椰子、香草、莳萝味明显），现代派改用法桶、果味更鲜。分级：Joven / Crianza / Reserva / Gran Reserva（陈年时间逐级拉长）。',
    flavor: ['椰子', '香草', '皮革', '红樱桃', '烟草', '干无花果', '莳萝'],
    abv: '13–14.5%',
    age: 'Crianza 2 年、Reserva 3 年、Gran Reserva 5 年（其中桶陈有下限要求）',
    brands: [
      { name: 'Marqués de Riscal', cn: '瑞格尔侯爵', note: '里奥哈现代派开山，弗兰克·盖里设计的酒店就在旁', lat: 42.550, lon: -2.590 },
      { name: 'Marqués de Cáceres', cn: '卡塞雷斯侯爵', note: '清爽易饮的现代派代表', lat: 42.450, lon: -2.600 },
      { name: 'Bodegas Muga', cn: '穆加', note: '传统派，自做橡木桶', lat: 42.583, lon: -2.883 },
      { name: 'La Rioja Alta', cn: '上里奥哈', note: '经典中的经典，Gran Reserva 890 系列', lat: 42.583, lon: -2.883 },
      { name: 'R. López de Heredia', cn: '洛佩兹·埃雷蒂亚', note: '极传统，Tondonia 是藏家心头好', lat: 42.583, lon: -2.883 }
    ],
    bottles: ['Marqués de Riscal Reserva', 'Muga Reserva', 'La Rioja Alta Viña Alberdi', 'R. López de Heredia Viña Tondonia Reserva', 'Marqués de Cáceres Crianza'],
    serve: { temp: '16–18℃', glass: '波尔多杯或里奥哈杯' },
    pairing: '伊比利亚火腿、烤乳猪、番茄炖牛肚、Manchego 奶酪',
    priceBand: '¥150–2,500：Crianza 150–300，Reserva 300–700，Gran Reserva 800–2,500',
    facts: [['主力品种', '丹魄（Tempranillo）'], ['桶型特色', '美国橡木（椰香）'], ['陈年分级', 'Crianza / Reserva / Gran Reserva']]
  };

  R.napa = {
    id: 'napa', name: '纳帕谷', en: 'Napa Valley', category: 'red', country: '美国',
    lat: 38.50, lon: -122.47, icon: '🌞', level: '产区',
    tagline: '加州阳光下的赤霞珠——黑莓、摩卡、雪松，成熟而华丽。',
    terroir: '旧金山以北 80 公里，50 公里长的狭长谷地，火山土与冲积土交错；白天热、夜晚受太平洋雾气降温，昼夜温差可达 15℃ 以上，糖分与酸度得以同时积累。',
    craft: '以赤霞珠为王，常做单一品种（与波尔多混酿思路不同）；法国橡木桶陈酿 18–24 个月；1976 年“巴黎审判”盲品中击败波尔多名庄，一战成名。',
    flavor: ['黑莓', '黑加仑', '摩卡', '香草', '雪松', '薄荷脑', '巧克力'],
    abv: '13.5–15.5%（普遍高于波尔多）',
    age: '5–20 年，顶级款可达 30 年',
    brands: [
      { name: 'Opus One', cn: '作品一号', note: '木桐与蒙大维的合体，波尔多骨架 + 加州果', lat: 38.398, lon: -122.310 },
      { name: 'Screaming Eagle', cn: '啸鹰', note: '纳帕最贵的膜拜酒，配额制', lat: 38.480, lon: -122.450 },
      { name: 'Robert Mondavi', cn: '蒙大维', note: '加州葡萄酒产业的奠基者', lat: 38.480, lon: -122.350 },
      { name: 'Caymus', cn: '凯慕斯', note: '饱满甜美的赤霞珠典型', lat: 38.480, lon: -122.420 },
      { name: 'Stag\'s Leap Wine Cellars', cn: '鹿跃', note: '1976 巴黎审判红组冠军', lat: 38.410, lon: -122.320 }
    ],
    bottles: ['Opus One', 'Robert Mondavi Napa Valley Cabernet', 'Caymus Cabernet Sauvignon', 'Stag\'s Leap S.L.V.', 'Screaming Eagle'],
    serve: { temp: '16–18℃', glass: '大肚波尔多杯' },
    pairing: '炭烤牛排、烟熏肋排、汉堡（精酿级）、陈年切达',
    priceBand: '¥300–30,000+：入门 300–600，名庄 1,500–5,000，膜拜酒 20,000+',
    facts: [['主力品种', '赤霞珠'], ['成名事件', '1976 巴黎审判'], ['昼夜温差', '可达 15℃+'], ['酒精度', '普遍比波尔多高 1–1.5%']]
  };

  R.mosel = {
    id: 'mosel', name: '摩泽尔', en: 'Mosel', category: 'white', country: '德国',
    lat: 49.98, lon: 7.07, icon: '🏞️', level: '产区',
    tagline: '雷司令的极限陡坡——青柠、白花、板岩矿物，甜度与酸度完美对拉。',
    terroir: '德国最北的经典产区之一，葡萄园挂在摩泽尔河两岸 60–70 度的陡坡上（手工采摘，成本极高）。蓝色板岩（Blue Slate）白天吸热、夜间放热，赋予酒独特的矿物与烟熏感。',
    craft: '雷司令（Riesling）占主导；按采收糖度分级：Kabinett → Spätlese → Auslese → Beerenauslese → Trockenbeerenauslese；装瓶时常标注甜度/干型（Trocken）。',
    flavor: ['青柠', '白桃', '白花', '蜂蜜', '板岩矿物', '汽油（陈年后）', '青苹果'],
    abv: '7.5–12.5%（低酒精是其特色）',
    age: '干型 3–8 年；甜型（Auslese 以上）可达 20–50 年',
    brands: [
      { name: 'Joh. Jos. Prüm', cn: '普朗', note: '摩泽尔雷司令的代名词', lat: 49.933, lon: 7.100 },
      { name: 'Dr. Loosen', cn: '露森', note: '国际市场认知度最高', lat: 49.983, lon: 7.033 },
      { name: 'Egon Müller', cn: '伊贡米勒', note: 'TBA 甜酒的天花板', lat: 49.616, lon: 6.600 },
      { name: 'Markus Molitor', cn: '马库斯梅里特', note: '干型与甜型双线极致', lat: 49.967, lon: 7.033 }
    ],
    bottles: ['Dr. Loosen Riesling Kabinett', 'Joh. Jos. Prüm Spätlese', 'Egon Müller Scharzhofberger Kabinett', 'Markus Molitor Haus Klosterberg'],
    serve: { temp: '8–10℃', glass: '雷司令杯 / 较小的白葡萄酒杯' },
    pairing: '泰式/川菜辣味料理、生鱼片、山羊奶酪、蜜汁火腿',
    priceBand: '¥150–5,000：入门 150–350，Spätlese 400–900，顶级 TBA 数千至上万',
    facts: [['主力品种', '雷司令'], ['土壤', '蓝色板岩'], ['坡度', '世界最陡葡萄园之一'], ['特色', '低酒精 + 高酸']]
  };

  R.barossa = {
    id: 'barossa', name: '巴罗萨谷', en: 'Barossa Valley', category: 'red', country: '澳大利亚',
    lat: -34.52, lon: 138.95, icon: '🦘', level: '产区',
    tagline: '百年老藤西拉——黑莓、胡椒、巧克力的浓郁轰炸。',
    terroir: '阿德莱德东北 60 公里，炎热干燥的地中海气候。这里拥有世界上最古老的持续结果西拉老藤（1843 年种植），也是澳洲葡萄酒产业的发源地。',
    craft: '以西拉（Shiraz）为核心，常见于美国橡木桶陈酿；老藤（Old Vine / Ancestor Vine）分级是当地特色。GSM（歌海娜+西拉+慕合怀特）混酿也很典型。',
    flavor: ['黑莓', '黑胡椒', '巧克力', '咖啡', '烟熏', '皮革', '李子干'],
    abv: '14–15.5%（酒精度偏高）',
    age: '5–20 年，顶级老藤可达 30 年',
    brands: [
      { name: 'Penfolds', cn: '奔富', note: 'Grange 是澳洲酒王，跨产区调配', lat: -34.520, lon: 138.620 },
      { name: 'Henschke', cn: '翰斯科', note: 'Hill of Grace 与 Grange 齐名', lat: -34.570, lon: 139.060 },
      { name: 'Torbreck', cn: '托布雷', note: '老藤西拉的现代派', lat: -34.520, lon: 138.960 },
      { name: 'Jacob\'s Creek', cn: '杰卡斯', note: '全球认知度最高的澳洲入门品牌', lat: -34.510, lon: 138.980 }
    ],
    bottles: ['Penfolds Bin 389', 'Penfolds Grange', 'Henschke Hill of Grace', 'Torbreck Old Vines', 'Penfolds Bin 28'],
    serve: { temp: '16–18℃', glass: '大肚西拉杯 / 波尔多杯' },
    pairing: '炭烤羊排、BBQ 牛小排、烟熏香肠、硬质奶酪',
    priceBand: '¥120–15,000：入门 120–300，名庄 800–3,000，Grange / Hill of Grace 5,000–15,000',
    facts: [['主力品种', '西拉（Shiraz）'], ['老藤年份', '最老 1843 年'], ['气候', '炎热干燥'], ['典型混酿', 'GSM']]
  };

  R.marlborough = {
    id: 'marlborough', name: '马尔堡', en: 'Marlborough', category: 'white', country: '新西兰',
    lat: -41.51, lon: 173.96, icon: '🥝', level: '产区',
    tagline: '长相思的世界标杆——百香果、青草、黑醋栗叶，炸裂的香气。',
    terroir: '新西兰南岛东北角，日照充足但夜间凉爽，昼夜温差大；砾石排水土壤。这里是新西兰最大的葡萄酒产区，长相思（Sauvignon Blanc）面积占绝对多数。',
    craft: '多为不锈钢罐低温发酵以保留香气（部分高端款用野生酵母 + 橡木桶）；黑皮诺是近年崛起的第二主力。',
    flavor: ['百香果', '青草', '黑醋栗叶', '青椒', '柚子', '柠檬草', '番茄叶'],
    abv: '12.5–13.5%',
    age: '1–3 年内饮用最佳（少有陈年潜力，除少数桶陈款）',
    brands: [
      { name: 'Cloudy Bay', cn: '云雾之湾', note: '让马尔堡长相思闻名世界的名字', lat: -41.470, lon: 173.960 },
      { name: 'Dog Point', cn: '狗点', note: 'Cloudy Bay 前酿酒师自创，桶陈风格', lat: -41.470, lon: 173.990 },
      { name: 'Villa Maria', cn: '新玛利', note: '新西兰家族名庄，品质稳定', lat: -36.990, lon: 174.800 },
      { name: 'Brancott Estate', cn: '布兰卡特', note: '马尔堡长相思的首个商业种植者', lat: -41.510, lon: 173.960 }
    ],
    bottles: ['Cloudy Bay Sauvignon Blanc', 'Dog Point Sauvignon Blanc', 'Villa Maria Sauvignon Blanc', 'Brancott Estate Sauvignon Blanc'],
    serve: { temp: '8–10℃', glass: '中等大小的白葡萄酒杯' },
    pairing: '生蚝、青口、泰式青木瓜沙拉、山羊奶酪',
    priceBand: '¥120–600：入门 120–250，名庄 300–600',
    facts: [['主力品种', '长相思'], ['崛起品种', '黑皮诺'], ['饮用窗口', '越新鲜越好'], ['发酵容器', '以不锈钢为主']]
  };

  R.mendoza = {
    id: 'mendoza', name: '门多萨', en: 'Mendoza', category: 'red', country: '阿根廷',
    lat: -32.89, lon: -68.83, icon: '🏔️', level: '产区',
    tagline: '安第斯山脚下的马尔贝克——黑樱桃、紫罗兰、可可的日光味。',
    terroir: '安第斯山脉东麓，海拔 800–1,600 米的高海拔沙漠绿洲。强烈的紫外线 + 巨大昼夜温差 + 冰川融水灌溉，造就皮厚色深的马尔贝克。',
    craft: '马尔贝克（Malbec）是阿根廷的国宝品种，法国移民带入后在此发扬光大；部分高端款使用混凝土蛋形槽或大型旧桶，减少橡木味、突出果味。',
    flavor: ['黑樱桃', '紫罗兰', '可可粉', '黑李子', '烟熏', '皮革', '薄荷'],
    abv: '13.5–15%',
    age: '3–12 年，高端款 15 年',
    brands: [
      { name: 'Catena Zapata', cn: '卡帝那', note: '高海拔马尔贝克的开拓者', lat: -33.030, lon: -68.870 },
      { name: 'Achaval-Ferrer', cn: '阿查瓦尔', note: '单一园极限低产量', lat: -33.030, lon: -68.870 },
      { name: 'Trapiche', cn: '风之语/查比', note: '产量大但高端线很硬', lat: -33.000, lon: -68.850 },
      { name: 'Zuccardi', cn: '祖卡迪', note: '近年国际评分极高', lat: -33.030, lon: -68.830 }
    ],
    bottles: ['Catena Malbec', 'Catena Zapata Adrianna White Bones', 'Achaval-Ferrer Finca Altamira', 'Zuccardi Serie A Malbec'],
    serve: { temp: '16–18℃', glass: '波尔多杯' },
    pairing: '阿根廷烤肉（Asado）、牛排、辣味香肠、蓝纹奶酪',
    priceBand: '¥100–2,000：入门 100–250，高端 600–2,000',
    facts: [['主力品种', '马尔贝克'], ['海拔', '800–1,600 米'], ['水源', '安第斯冰川融水'], ['国家定位', '阿根廷国宝品种']]
  };

  /* ---------------- 加强型 / 白兰地 ---------------- */
  R.cognac = {
    id: 'cognac', name: '干邑', en: 'Cognac', category: 'fortified', country: '法国',
    lat: 45.70, lon: -0.33, icon: '🥃', level: '产区',
    tagline: '葡萄白兰地之王——两次蒸馏 + 橡木桶，把水果变成干果、香料与“陈味”（rancio）。',
    terroir: '波尔多以北的夏朗德地区，白垩与黏土土壤，海洋性气候。法定六大子产区（Crus）中，Grande Champagne 与 Petite Champagne 的白垩土最优，其余为 Borderies / Fins Bois / Bons Bois / Bois Ordinaires。',
    craft: '白玉霓（Ugni Blanc）为主 → 铜制夏朗德壶式双重蒸馏（必须在次年 3 月 31 日前完成）→ 法国橡木桶（Limousin / Tronçais）陈酿。等级：VS（≥2 年）/ VSOP（≥4 年）/ XO（≥10 年，2018 年起由 6 年上调）。调配（assemblage）是灵魂。',
    flavor: ['干果', '葡萄干', '无花果', '香草', '肉桂', '皮革', 'rancio 陈味', '杏仁'],
    abv: '40%（法定最低）；原桶强度 45–60%',
    age: 'VS 2 年 / VSOP 4 年 / XO 10 年 / XXO 14 年，实际陈酿常远超法定年限',
    brands: [
      { name: 'Hennessy', cn: '轩尼诗', note: '全球销量第一，1765 年创立', lat: 45.700, lon: -0.330 },
      { name: 'Martell', cn: '马爹利', note: '最古老的干邑世家（1715）', lat: 45.700, lon: -0.330 },
      { name: 'Rémy Martin', cn: '人头马', note: '只用大/小香槟区（Fine Champagne）', lat: 45.700, lon: -0.330 },
      { name: 'Courvoisier', cn: '拿破仑', note: '拿破仑的“御用”，XO 圆润', lat: 45.720, lon: -0.290 }
    ],
    bottles: ['Hennessy XO', 'Martell Cordon Bleu', 'Rémy Martin XO', 'Courvoisier VSOP', 'Hennessy Paradis'],
    serve: { temp: '室温 20–22℃（用手心温杯）', glass: '干邑杯（矮胖郁金香） / 闻香杯' },
    pairing: '黑巧克力、雪茄、鹅肝、陈年硬质奶酪，或餐后纯饮',
    priceBand: '¥300–20,000：VS 300–500，VSOP 600–1,200，XO 1,500–4,000，顶级（Paradis / Louis XIII）10,000+',
    facts: [['主力品种', '白玉霓（Ugni Blanc）'], ['蒸馏方式', '夏朗德壶式两次蒸馏'], ['等级门槛', 'VS 2 / VSOP 4 / XO 10 年'], ['桶材', '法国橡木（Limousin / Tronçais）']]
  };

  R.jerez = {
    id: 'jerez', name: '赫雷斯（雪莉）', en: 'Jerez / Sherry', category: 'fortified', country: '西班牙',
    lat: 36.68, lon: -6.14, icon: '🍯', level: '产区',
    tagline: '被误解最深的酒——从极干的 Fino 到浓稠的 PX，跨度比任何产区都大。',
    terroir: '安达卢西亚南部，著名的“雪莉三角”（Jerez / Sanlúcar / El Puerto）。白垩质 Albariza 土壤反射阳光又保水，加上近海湿气，催生了独特的酒花（flor）酵母层。',
    craft: '基酒发酵后加烈（fortification）至 15–17%（生物陈年）或 17%+（氧化陈年）；核心是 Solera 系统——多层酒桶逐年混合，保证风格恒定。类型：Fino（酒花下生物陈年，极干）/ Manzanilla（海边版）/ Amontillado（酒花后氧化）/ Oloroso（纯氧化）/ PX（极甜）。',
    flavor: ['杏仁', '海水', '酵母', '烤面包', '核桃', '焦糖', '无花果干', '咖啡'],
    abv: '15–22%',
    age: 'Fino 需新鲜饮用（开瓶冷藏 1 周内）；Amontillado / Oloroso 可陈 10–30 年；PX 可陈数十年',
    brands: [
      { name: 'Tio Pepe', cn: '缇欧佩佩', note: 'Fino 的代名词（González Byass）', lat: 36.683, lon: -6.140 },
      { name: 'La Ina', cn: '拉伊娜', note: 'Lustau / Domecq 的经典 Fino', lat: 36.683, lon: -6.140 },
      { name: 'Lustau', cn: '路士露', note: '品类最全的雪莉名门', lat: 36.683, lon: -6.140 },
      { name: 'Equipo Navazos', cn: '纳瓦佐斯', note: '雪莉复兴运动的先锋', lat: 36.683, lon: -6.140 }
    ],
    bottles: ['Tio Pepe Fino', 'Lustau Amontillado', 'Lustau Oloroso', 'González Byass Noé PX', 'Manzanilla La Gitana'],
    serve: { temp: 'Fino / Manzanilla 5–8℃；Amontillado 12–14℃；Oloroso / PX 14–16℃', glass: '小号郁金香杯（catavino）' },
    pairing: 'Fino → 生蚝、西班牙火腿、橄榄；Oloroso → 炖肉、野味；PX → 冰淇淋、蓝纹奶酪',
    priceBand: '¥120–2,000：日常 120–300，陈年 Amontillado / Oloroso 400–1,200，稀有 VORS 1,500–2,000+',
    facts: [['核心系统', 'Solera 分级混合'], ['独特现象', '酒花（flor）生物陈年'], ['土壤', 'Albariza 白垩土'], ['甜度跨度', '极干 → 极甜']]
  };

  R.douro = {
    id: 'douro', name: '杜罗河谷（波特）', en: 'Douro / Port', category: 'fortified', country: '葡萄牙',
    lat: 41.16, lon: -7.79, icon: '🍷', level: '产区',
    tagline: '在发酵中加白兰地中断发酵——把甜和烈同时锁住。',
    terroir: '杜罗河两岸的陡峭梯田（世界文化遗产），片岩（schist）土壤，夏季酷热。人工开凿的梯田与极端气候，让葡萄浓缩度极高。',
    craft: '发酵进行到一半时加入 77% 的白兰地（aguardente），杀死酵母中断发酵 → 保留残糖 + 提高酒精度。类型：Ruby（果味、瓶中无氧）/ Tawny（氧化陈年，坚果味）/ Vintage（顶级年份，瓶中陈年数十年）/ LBV。',
    flavor: ['黑莓', '李子干', '巧克力', '焦糖', '核桃', '无花果', '香料', '咖啡'],
    abv: '19–20%（加烈酒典型）',
    age: 'Ruby 即饮；Tawny 10/20/30/40 年为平均陈年标注；Vintage 可陈 20–50 年',
    brands: [
      { name: 'Taylor\'s', cn: '泰勒', note: 'Vintage Port 的标杆', lat: 41.160, lon: -7.790 },
      { name: 'Graham\'s', cn: '格雷厄姆', note: 'Tawny 与 Vintage 双强', lat: 41.160, lon: -7.790 },
      { name: 'Dow\'s', cn: '道斯', note: '偏干的风格', lat: 41.160, lon: -7.790 },
      { name: 'Sandeman', cn: '山地文', note: '黑斗篷标志，认知度最高', lat: 41.140, lon: -7.790 }
    ],
    bottles: ['Taylor\'s Vintage Port', 'Graham\'s 20 年 Tawny', 'Dow\'s LBV', 'Sandeman Ruby Port', 'Fonseca Vintage Port'],
    serve: { temp: 'Ruby 14–16℃；Tawny 12–14℃；Vintage 16–18℃（需醒酒）', glass: '小号波特杯（容量小，因为酒精度高）' },
    pairing: '蓝纹奶酪（Stilton）、黑巧克力、核桃派、雪茄',
    priceBand: '¥150–8,000：Ruby 150–300，Tawny 10/20 年 400–1,200，Vintage 1,500–8,000',
    facts: [['加烈时机', '发酵中途加白兰地'], ['土壤', '片岩梯田（世界遗产）'], ['酒精度', '19–20%'], ['两大类型', 'Ruby（还原）/ Tawny（氧化）']]
  };

  /* ---------------- 啤酒 ---------------- */
  R.belgian_beer = {
    id: 'belgian_beer', name: '比利时修道院啤酒', en: 'Belgian Trappist', category: 'beer', country: '比利时',
    lat: 50.85, lon: 4.35, icon: '🍺', level: '国家',
    tagline: '修士酿的啤酒——高酒精、复杂香料、瓶中二次发酵，啤酒里的“勃艮第”。',
    terroir: '比利时修道院（Trappist）拥有Protected Designation 认证，目前全球仅约 11 家修道院获准使用 Trappist 标志（比利时 6 家、荷兰 2 家等）。',
    craft: '瓶中二次发酵（bottle conditioning）带来绵密气泡与陈年潜力；常用比利时酵母产生香蕉、丁香的酚类与酯类香气，部分加糖（candi sugar）提高酒精度而不加重酒体。类型：Dubbel（双料，棕糖/干果）/ Tripel（三料，金黄但强劲）/ Quadrupel（四料，深色厚重）。',
    flavor: ['香蕉', '丁香', '焦糖', '深色果干', '比利时糖', '面包', '胡椒', '酒精温感'],
    abv: '6–12%（三料/四料常 8–11%）',
    age: '多数 3–5 年，高酒精款可陈 10 年以上',
    brands: [
      { name: 'Westmalle', cn: '西麦尔', note: 'Tripel 风格的发明者（1956）', lat: 51.290, lon: 4.660 },
      { name: 'Chimay', cn: '智美', note: '最早商业化，红/白/蓝三色分级', lat: 50.050, lon: 4.320 },
      { name: 'Rochefort', cn: '罗斯福', note: '6/8/10 号，10 号是四料标杆', lat: 50.180, lon: 5.220 },
      { name: 'Orval', cn: '奥威', note: '布雷特酵母带来的皮革与野性', lat: 49.640, lon: 5.340 },
      { name: 'Westvleteren', cn: '西佛兰德斯', note: '全球最难买到的啤酒之一（12 号公认神作）', lat: 50.860, lon: 2.800 }
    ],
    bottles: ['Westmalle Tripel', 'Chimay Bleue（蓝标）', 'Rochefort 10', 'Orval', 'Westvleteren 12', 'Chimay Rouge（红标）'],
    serve: { temp: '8–12℃（越高度越高）', glass: '修道院专用郁金香杯 / 圣杯（chalice）' },
    pairing: '炖牛肉（Carbonnade）、蓝纹奶酪、比利时薯条、巧克力慕斯',
    priceBand: '¥25–150 / 330ml：常规 25–50，Rochefort 10 / Westvleteren 12 可到 100–150',
    facts: [['核心工艺', '瓶中二次发酵'], ['Trappist 认证', '全球约 11 家'], ['经典分级', 'Dubbel / Tripel / Quadrupel'], ['酵母特征', '香蕉 + 丁香的酚类香气']]
  };

  R.german_beer = {
    id: 'german_beer', name: '德国啤酒（纯净法）', en: 'German Beer / Reinheitsgebot', category: 'beer', country: '德国',
    lat: 49.75, lon: 13.38, icon: '🍻', level: '国家',
    tagline: '1516 年的纯净法：只用水、麦芽、啤酒花、酵母，把“干净”做到极致。',
    terroir: '啤酒花核心产区在 Hallertau / Spalt / Tettnang；水化学决定风格——皮尔森的极软水、多特蒙德的硬水、慕尼黑的碳酸盐硬水，分别催生了不同风格。',
    craft: 'Reinheitsgebot（啤酒纯净法）是 1516 年颁布的世界上最早的食品法规之一，2016 年入选德国非遗。皮尔森（Pilsner）用下层发酵 + 低温长时间熟成（lagering）；小麦白啤（Hefeweizen）用上层发酵 + 专用小麦酵母。',
    flavor: ['面包', '饼干', '啤酒花香草', '柑橘', '蜂蜜', '丁香（小麦啤）', '干净的苦'],
    abv: '4.8–5.4%（日常）；小麦啤 5–5.5；博克 6–9%',
    age: '越新鲜越好（尤其皮尔森）；博克可短期陈放',
    brands: [
      { name: 'Weihenstephaner', cn: '维森', note: '世界最古老的现存啤酒厂（1040 年）', lat: 48.400, lon: 11.730 },
      { name: 'Paulaner', cn: '宝莱纳', note: '慕尼黑小麦白啤代表', lat: 48.130, lon: 11.580 },
      { name: 'Krombacher', cn: '科隆巴赫', note: '德国销量第一的皮尔森', lat: 51.000, lon: 8.000 },
      { name: 'Pilsner Urquell', cn: '皮尔森之源', note: '（捷克）世界上第一款金色皮尔森，1842', lat: 49.750, lon: 13.380 },
      { name: 'Ayinger', cn: '艾英格', note: '巴伐利亚精工小厂口碑王', lat: 48.000, lon: 11.780 }
    ],
    bottles: ['Weihenstephaner Hefeweissbier', 'Paulaner Hefe-Weissbier', 'Pilsner Urquell', 'Krombacher Pils', 'Ayinger Celebrator Doppelbock'],
    serve: { temp: '皮尔森 6–8℃；小麦白啤 8–10℃；博克 10–12℃', glass: '皮尔森细长杯 / 小麦啤高身收腰杯' },
    pairing: '烤猪肘、白香肠、碱水面包、炸鸡（皮尔森解腻）',
    priceBand: '¥12–45 / 500ml',
    facts: [['法规', '1516 啤酒纯净法'], ['水化学', '决定风格（软水→皮尔森）'], ['发酵', '下层发酵 + 低温窖藏'], ['新鲜度', '越新越好']]
  };

  R.craft_beer_us = {
    id: 'craft_beer_us', name: '美国精酿（IPA）', en: 'American Craft / IPA', category: 'beer', country: '美国',
    lat: 39.73, lon: -121.84, icon: '🍊', level: '国家',
    tagline: '把啤酒花当主角——西海岸的松脂柑橘，东海岸的热带果汁。',
    terroir: '啤酒花核心产区在太平洋西北（Yakima Valley、Willamette Valley），Citra / Mosaic / Simcoe / Amarillo 等品种定义了现代 IPA 的香气谱。',
    craft: '美式 IPA 强调后期大量干投酒花（dry hopping），苦度（IBU）与香气分离；衍生出 West Coast IPA（清澈、苦、松脂）、New England / Hazy IPA（浑浊、低苦、热带果汁感）、Double/Triple IPA（高酒精）。',
    flavor: ['西柚', '芒果', '百香果', '松脂', '菠萝', '荔枝', '柑橘皮', '树脂苦'],
    abv: '5.5–12%（IPA 6–7.5，DIPA 8–9，TIPA 10+）',
    age: '越新鲜越好！IPA 是啤酒界的“生鲜”，建议 3 个月内喝掉（避光冷藏）',
    brands: [
      { name: 'Sierra Nevada', cn: '内华达山脉', note: '美国精酿鼻祖之一，Pale Ale 是行业基准', lat: 39.730, lon: -121.840 },
      { name: 'Russian River', cn: '俄罗斯河', note: 'Pliny the Elder 是 West Coast IPA 的圣杯', lat: 38.440, lon: -122.710 },
      { name: 'Tree House', cn: '树屋', note: 'Hazy IPA 的顶级代表', lat: 42.150, lon: -72.100 },
      { name: 'Stone Brewing', cn: '巨石', note: '“Fizzy Yellow Beer” 的反叛者', lat: 33.120, lon: -117.080 },
      { name: 'Lagunitas', cn: '拉古尼塔斯', note: 'IPA 普及化的功臣', lat: 38.240, lon: -122.730 }
    ],
    bottles: ['Sierra Nevada Pale Ale', 'Russian River Pliny the Elder', 'Lagunitas IPA', 'Stone IPA', 'Tree House Julius'],
    serve: { temp: '7–10℃（太冰会锁住酒花香气）', glass: 'IPA 杯（带棱纹）/ 非笛型品脱杯' },
    pairing: '辣味炸鸡、墨西哥菜、蓝纹奶酪、重口味烧烤',
    priceBand: '¥25–120 / 355ml：常规 25–45，进口稀有款 80–120',
    facts: [['核心工艺', '干投酒花（Dry Hopping）'], ['两大流派', 'West Coast / New England'], ['酒花产区', 'Yakima / Willamette'], ['新鲜度', '3 个月内最佳']]
  };

  /* ---------------- 鸡尾酒 / 烈酒原料 ---------------- */
  R.new_orleans = {
    id: 'new_orleans', name: '新奥尔良（鸡尾酒圣地）', en: 'New Orleans', category: 'cocktail', country: '美国',
    lat: 29.95, lon: -90.07, icon: '🎷', level: '城市',
    tagline: 'Sazerac 与 Ramos Gin Fizz 的故乡——美国鸡尾酒的发源地。',
    terroir: '密西西比河口的港口城市，法国、西班牙、非洲与加勒比文化交汇。19 世纪这里出现了美国最早的鸡尾酒文化，苦精（Peychaud\'s Bitters）与黑麦威士忌是本地味觉基底。',
    craft: 'Sazerac 是公认的美国第一款鸡尾酒：黑麦威士忌或干邑 + 苦精 + 糖，用苦艾酒涮杯；Hurricane、Ramos Gin Fizz 同为城市名片。',
    flavor: ['黑麦辛香', '苦精', '茴香/苦艾', '柑橘油', '香草', '糖浆'],
    abv: '20–35%（视配方）',
    age: '现调现饮',
    brands: [
      { name: 'Sazerac Coffee House', cn: '萨泽拉克咖啡馆', note: 'Sazerac 与 Peychaud 苦精的诞生地', lat: 29.955, lon: -90.070 },
      { name: 'Arnaud\'s French 75', cn: '阿诺酒吧', note: 'French 75 酒吧，老派服务', lat: 29.958, lon: -90.070 },
      { name: 'Peychaud\'s Bitters', cn: '裴乔氏苦精', note: '新奥尔良独有的茴香系苦精', lat: 29.950, lon: -90.080 }
    ],
    bottles: ['Sazerac', 'Ramos Gin Fizz', 'Hurricane', 'Vieux Carré', 'French 75'],
    serve: { temp: '冰镇（Sazerac 不加冰，Ramos 需摇 12 分钟）', glass: '古典杯 / 高球杯 / 笛型杯（视配方）' },
    pairing: '卡真小龙虾、秋葵浓汤、炸牡蛎三明治、贝奈特饼',
    priceBand: '¥80–180 / 杯（国内酒吧）',
    facts: [['史上第一', 'Sazerac 被认为是最早的美国鸡尾酒'], ['城市标志', 'Peychaud\'s Bitters'], ['文化底色', '法国 + 加勒比'], ['经典技法', '苦艾酒涮杯']]
  };

  R.tequila = {
    id: 'tequila', name: '特基拉（龙舌兰）', en: 'Tequila / Jalisco', category: 'cocktail', country: '墨西哥',
    lat: 20.88, lon: -103.84, icon: '🌵', level: '产区',
    tagline: '只有蓝色龙舌兰做的才叫 Tequila——青草、柑橘、胡椒与矿物的碰撞。',
    terroir: '墨西哥哈利斯科州（Jalisco）为核心产区，火山红土 + 高海拔。蓝色韦伯龙舌兰（Blue Weber Agave）需 6–8 年成熟，收割后取心（piña）慢烤。',
    craft: '慢烤（horno 石炉或蒸汽）→ 榨汁发酵 → 两次蒸馏。等级：Blanco（未陈年）/ Reposado（桶陈 2–12 个月）/ Añejo（1–3 年）/ Extra Añejo（3 年以上）。100% Agave 是品质分水岭（Mixto 允许添加 49% 其他糖）。',
    flavor: ['龙舌兰青草', '青柠', '白胡椒', '矿物', '香草', '烤菠萝', '蜂蜜（陈年后）'],
    abv: '38–40%（部分 55%）',
    age: 'Blanco 即饮；Añejo 可陈年，但风味会转柔',
    brands: [
      { name: 'Patrón', cn: '培恩', note: '高端龙舌兰的启蒙者', lat: 20.680, lon: -103.870 },
      { name: 'Don Julio', cn: '唐胡里奥', note: '1942 是送礼硬通货', lat: 20.560, lon: -103.460 },
      { name: 'Casamigos', cn: '卡萨米戈斯', note: '乔治·克鲁尼创立，好莱坞爆款', lat: 20.680, lon: -103.870 },
      { name: 'Fortaleza', cn: '福塔雷萨', note: '传统石磨工艺，行家首选', lat: 20.680, lon: -103.870 },
      { name: 'Ocho', cn: '奥乔', note: '单一地块（ranch）概念', lat: 20.560, lon: -103.460 }
    ],
    bottles: ['Margarita', 'Paloma', 'Tequila Sunrise', 'Don Julio 1942（纯饮）', 'Fortaleza Blanco'],
    serve: { temp: '纯饮 16–18℃；玛格丽特需冰镇（可盐口杯边）', glass: '郁金香闻香杯 / 玛格丽特杯 / 柯林杯' },
    pairing: '塔可、烤玉米、酸橘汁腌鱼、辣味牛肉、芒果配辣椒粉',
    priceBand: '¥150–3,000：Blanco 200–400，Reposado 300–600，Añejo 600–1,500，Don Julio 1942 约 2,500–3,500',
    facts: [['原料', '蓝色韦伯龙舌兰（需 6–8 年成熟）'], ['核心产区', 'Jalisco 州（+4 个法定州）'], ['品质分水岭', '100% Agave vs Mixto'], ['经典喝法', '盐 + 柠檬 + 一口闷（或纯饮更值得）']]
  };

  /* ---------------- 中国白酒 ---------------- */
  R.maotai = {
    id: 'maotai', name: '茅台镇', en: 'Maotai Town', category: 'baijiu', country: '中国 · 贵州遵义',
    lat: 27.834, lon: 106.412, icon: '🏺', level: '产区',
    tagline: '酱香鼻祖所在地——离开这片赤水河谷，酿不出同样的茅台。',
    terroir: '茅台镇位于贵州高原西北部，赤水河中游河谷，海拔仅 400 米。紫色砂页岩土壤 + 15–40℃ 冬暖夏热、潮湿少风的独特小气候，让空气中的产香微生物群极其丰富——这种微生物群离开茅台镇 100 公里就大幅衰减。所以即便拿到同样的酒曲、同样的大米高粱，异地酿造只能叫「酱酒」，不能叫「茅台」。',
    craft: '12987 工艺：1 年生产周期、2 次投料、9 次蒸煮、8 次发酵、7 次取酒。每轮发酵 30 天后取酒，新酒再经 5 年陶坛陈酿，最后用 7 个不同轮次、不同年份的老酒勾兑。',
    flavor: ['酱香突出', '幽雅细腻', '空杯留香', '回味悠长', '陈香', '焦糊'],
    abv: '53%（53° 是酱香黄金度数）',
    age: '无明确年份概念——用不同陈酿年份的老酒勾兑出新酒',
    brands: [
      { name: '贵州茅台酒厂', cn: '贵州茅台', note: '国酒 / 酱香鼻祖，飞天、五星、生肖系列', lat: 27.834, lon: 106.412 },
      { name: '习酒', cn: '习酒', note: '茅台集团旗下第二酱香品牌', lat: 28.331, lon: 106.211 },
      { name: '郎酒', cn: '郎酒', note: '古蔺二郎镇，赤水河谷另一酱香巨头', lat: 27.952, lon: 105.962 },
      { name: '国台酒', cn: '国台', note: '茅台镇第二大酒企', lat: 27.873, lon: 106.388 },
      { name: '金沙窖酒', cn: '金沙', note: '毕节金沙县，黔派酱香', lat: 27.460, lon: 106.220 }
    ],
    bottles: ['贵州茅台酒（飞天 53°）', '飞天茅台 500ml', '习酒窖藏 1988', '青花郎', '茅台王子酒', '茅台迎宾酒', '金沙摘要'],
    serve: { temp: '常温或温烫至 40℃ 释放酯香', glass: '茅台玻璃分酒器 + 2–3 钱白瓷杯' },
    pairing: '重油川菜、毛血旺、内脏、腊肉、烤全羊',
    priceBand: '¥600–2,500：习酒窖藏 1988 ¥500 左右；飞天茅台 ¥1,800–2,400；青花郎 ¥1,000 左右；年份茅台 ¥5,000+',
    facts: [['地理位置', '赤水河中游河谷，海拔 400 米'], ['核心香型', '酱香型（大曲酱香）'], ['独特价值', '离开茅台镇 100 公里微生物群衰减'], ['经典喝法', '拉酒线 / 看酒花 / 砸酒花']]
  };

  R.yibin = {
    id: 'yibin', name: '宜宾', en: 'Yibin', category: 'baijiu', country: '中国 · 四川宜宾',
    lat: 28.751, lon: 104.624, icon: '🍶', level: '产区',
    tagline: '五粮液的原乡——长江第一城，五种粮食出窖香。',
    terroir: '宜宾位于四川盆地南缘，长江、岷江、金沙江三江汇流处。当地富含偏硅酸的弱碱性矿泉水 + 温暖湿润的亚热带季风气候，是酿造浓香型白酒的黄金产地。「中国酒都」之称由此而来，五粮液、叙府酒、梦酒等品牌均出自此地。',
    craft: '五粮液采用「五粮液」配方：高粱 36%、大米 22%、糯米 18%、小麦 16%、玉米 8%。中温大曲、泥窖发酵 60–90 天、跑窖法循环蒸馏、陈年老窖是关键资产。',
    flavor: ['窖香浓郁', '醇厚甘冽', '入口绵软', '尾净余长', '粮香'],
    abv: '52%（经典款）',
    age: '通常以「勾兑年份」标识——老酒年份越高，价格越贵',
    brands: [
      { name: '五粮液酒厂', cn: '五粮液', note: '浓香型白酒第二巨头，国宴常客', lat: 28.751, lon: 104.624 },
      { name: '叙府酒业', cn: '叙府', note: '宜宾本地浓香老牌', lat: 28.768, lon: 104.638 },
      { name: '梦酒', cn: '梦酒', note: '五粮液集团旗下', lat: 28.751, lon: 104.624 }
    ],
    bottles: ['五粮液第八代经典装', '五粮液 1618', '五粮春', '叙府特曲'],
    serve: { temp: '常温', glass: '玻璃分酒器 + 小杯' },
    pairing: '川菜、淮扬菜、海鲜、家常菜',
    priceBand: '¥300–1,200：五粮春 ¥350；第八代经典 ¥1,000；五粮液 1618 ¥1,200',
    facts: [['地理', '三江汇流处（长江/岷江/金沙江）'], ['核心香型', '浓香型（大曲浓香）'], ['关键资产', '千年老窖池群（最古老 600+ 年）'], ['代表产品', '五粮液 8 代 / 1618 / 五粮春']]
  };

  R.fenyang = {
    id: 'fenyang', name: '汾阳·杏花村', en: 'Fenyang', category: 'baijiu', country: '中国 · 山西汾阳',
    lat: 37.265, lon: 111.785, icon: '🌾', level: '产区',
    tagline: '借问酒家何处有，牧童遥指杏花村——清香型白酒的鼻祖。',
    terroir: '山西汾阳杏花村位于吕梁山东麓，太原盆地西缘。当地地下水为低矿化度软水（含锶、锂、锗等微量元素），是酿造清香型白酒的稀缺资源。纬度较高（北纬 37°），气温凉爽、空气干燥，对清酒发酵极为有利。',
    craft: '清蒸二次清、地缸固态发酵、低温大曲（清茬曲 + 红心曲 + 后火曲三色曲混用）。蒸馏后不勾兑、不陈酿——直接装瓶，「一清到底」是汾酒的核心特色。',
    flavor: ['清香纯正', '醇甜柔和', '余味爽净', '粮食香', '青苹果'],
    abv: '38%（低度）/ 42%（中度）/ 53%（高度）',
    age: '青花 20 / 青花 30 是明确的年份产品',
    brands: [
      { name: '山西汾酒', cn: '汾酒', note: '清香型白酒鼻祖，中国「四大名酒」之一', lat: 37.265, lon: 111.785 },
      { name: '汾阳王', cn: '汾阳王', note: '杏花村本地老牌', lat: 37.281, lon: 111.793 },
      { name: '竹叶青', cn: '竹叶青', note: '汾酒集团旗下露酒品牌', lat: 37.265, lon: 111.785 }
    ],
    bottles: ['汾酒青花 20', '汾酒青花 30', '玻汾（出口型）', '竹叶青'],
    serve: { temp: '常温或冷藏', glass: '玻璃小杯' },
    pairing: '北京烤鸭、凉菜、面食、海鲜、清淡菜',
    priceBand: '¥150–600：玻汾 ¥150；青花 20 ¥470；青花 30 ¥800',
    facts: [['地理', '吕梁山东麓，太原盆地西缘'], ['核心香型', '清香型（大曲清香）'], ['核心工艺', '清蒸二次清、地缸发酵'], ['代表诗人', '杜牧「牧童遥指杏花村」']]
  };

  /* ---------------- 日本清酒 ---------------- */
  R.yamaguchi = {
    id: 'yamaguchi', name: '山口县·岩国', en: 'Yamaguchi', category: 'sake', country: '日本 · 山口县',
    lat: 34.186, lon: 132.219, icon: '🍶', level: '产区',
    tagline: '獺祭的故乡——日本大吟酿最高峰。',
    terroir: '山口县岩国市位于濑户内海沿岸、九州岛北面，年均温 16℃、雨量充足，水质属于软水（矿物质含量低），是大吟酿酒的理想水——软水酿出来的酒更甘甜、圆润、香气饱满。旭酒造（獺祭）是这里的代表品牌，「二割三分」连续多年是美国白宫国宴用酒。',
    craft: '全自动化生产线，温度控制精度到 0.1℃。原料米 100% 本地采购。精米步合越低，香气越奔放——23% 是行业天花板。',
    flavor: ['白桃', '哈密瓜', '青苹果', '花香', '旨味'],
    abv: '15–16%',
    age: '清酒无年份概念，以「出厂日期」标示，新鲜饮用最佳',
    brands: [
      { name: '旭酒造', cn: '獺祭', note: '「二割三分」连续多年美国白宫国宴用酒', lat: 34.186, lon: 132.219 },
      { name: '八千代酒造', cn: '八千代', note: '山口县老牌酒蔵', lat: 34.207, lon: 132.230 }
    ],
    bottles: ['獺祭 23 二割三分', '獺祭 39 三割九分', '獺祭 50', '獺祭 远心分离'],
    serve: { temp: '8–12℃ 冷藏', glass: '白葡萄酒杯 / 猪口杯' },
    pairing: '白身鱼刺身、海胆、寿司、天妇罗（淡味）',
    priceBand: '¥380–1,000：獺祭 39 ¥450；獺祭 23 ¥850；顶级款 ¥1,500+',
    facts: [['地理', '濑户内海沿岸 / 本州最西端'], ['核心工艺', '自动化温控 + 23% 精米步合'], ['代表产品', '獺祭 23 / 39 / 50'], ['国际地位', '2013 年起连续美国白宫国宴用酒']]
  };

  R.niigata = {
    id: 'niigata', name: '新潟县', en: 'Niigata', category: 'sake', country: '日本 · 新潟县',
    lat: 37.446, lon: 138.851, icon: '🍶', level: '产区',
    tagline: '淡丽辛口之王——日本第一清酒产量县。',
    terroir: '新潟县是日本第一清酒产量县（占全国产量近 1/3）。冬季多雪，雪水融化后渗入地下形成「軟水」（低硬度），加上冬季寒冷温差大，非常适合酿造「淡丽辛口」风格的清酒——口味清爽、酒体透明。',
    craft: '低温缓慢发酵，酒母以「速酿」为主流（部分酒蔵保留「生酛」「山廃」古法）。精米步合 50–60% 是主流，纯米大吟酿也是新潟县特产。',
    flavor: ['淡丽', '辛口', '米香', '旨味', '矿物感'],
    abv: '14–16%',
    age: '以「出厂日期」标示',
    brands: [
      { name: '朝日酒造', cn: '久保田', note: '「淡丽辛口」之王，纯米系列是其招牌', lat: 37.446, lon: 138.851 },
      { name: '八海山', cn: '八海山', note: '「普通酒之王」，一年生产 8,000 万瓶', lat: 37.282, lon: 138.871 },
      { name: '越後湯沢', cn: '越后汤泽', note: '雪国酒蔵集群', lat: 36.929, lon: 138.815 }
    ],
    bottles: ['久保田 翠寿', '久保田 万寿', '八海山 普通酒', '八海山 吟酿', '越后汤泽 上善如水'],
    serve: { temp: '8–12℃ 冷 或 40–45℃ 温', glass: '猪口杯 / 玻璃杯' },
    pairing: '寿司、刺身、烤鱼、天妇罗、雪国料理',
    priceBand: '¥150–400：八海山普通酒 ¥180；久保田翠寿 ¥340；越后汤泽上善 ¥200',
    facts: [['产量', '日本第一，占全国近 1/3'], ['核心风格', '淡丽辛口'], ['特色工艺', '雪水软水 + 低温发酵'], ['代表酒蔵', '久保田 / 八海山']]
  };

  R.yamagata = {
    id: 'yamagata', name: '山形县', en: 'Yamagata', category: 'sake', country: '日本 · 山形县',
    lat: 38.485, lon: 140.380, icon: '🍶', level: '产区',
    tagline: '十四代的故乡——日本清酒「最难买到」之酒。',
    terroir: '山形县位于日本东北地区南部，南部为群山环绕的内陆盆地。冬季寒冷的日本海气候 + 纯净的地下水，是吟酿酒的天堂。十四代（本：高木酒造）就坐落在山形县村山市——酒米「龙之落とし子」「酒未来」是十四代的核心竞争力。',
    craft: '吟酿酒的极致 ——精米步合 23–50%，低温缓慢发酵 30–40 天，保留花果香。十四代采用独家「秘伝玉返」技法，把清酒部分发酵后的气体重新注入酒体，产生特有的甜润口感。',
    flavor: ['蜜瓜', '青苹果', '花香', '旨味', '甘甜'],
    abv: '14–16%',
    age: '以「出厂日期」标示，新酒溢价高',
    brands: [
      { name: '高木酒造', cn: '十四代', note: '日本「最难买到」的清酒，一酒难求', lat: 38.485, lon: 140.380 },
      { name: '出羽桜酒造', cn: '出羽桜', note: '山形县代表酒蔵，樱花系列闻名', lat: 38.755, lon: 140.317 },
      { name: '酒田酒造', cn: '酒田酒', note: '山形县老牌酒蔵', lat: 38.918, lon: 139.836 }
    ],
    bottles: ['十四代 本丸', '十四代 龙月', '十四代 双虹', '出羽桜 樱花吟酿'],
    serve: { temp: '10–12℃ 微冷', glass: '白葡萄酒杯' },
    pairing: '高级寿司、刺身、烤白身鱼、和食怀石',
    priceBand: '¥400–20,000：出羽桜樱花 ¥450；十四代本丸 ¥4,500；十四代龙月 ¥15,000+',
    facts: [['地理', '日本东北地区南部内陆盆地'], ['核心特色', '独家酒米 + 低温发酵'], ['代表产品', '十四代本丸 / 龙月 / 双虹'], ['市场地位', '日本清酒「最难买」']]
  };

  /* ---------------- 中国黄酒 ---------------- */
  R.shaoxing = {
    id: 'shaoxing', name: '绍兴', en: 'Shaoxing', category: 'mijiu', country: '中国 · 浙江绍兴',
    lat: 29.997, lon: 120.585, icon: '🌾', level: '产区',
    tagline: '中国黄酒之宗——江南冬日的仪式感。',
    terroir: '绍兴位于浙江中北部、会稽山北麓，曹娥江流经。当地水质极佳，含适量矿物质和微生物群，糯米 + 麦曲 + 鉴湖水是中国黄酒的「黄金三角」。冬季投料、立春开耙、立夏压榨，整个工艺依「天时」而动——这是中国黄酒最古老的工艺范本。',
    craft: '淋饭法 / 摊饭法 / 喂饭法三大工艺路径。陶坛陈酿是关键——陈年黄酒含 600+ 种微量物质，时间换味道。',
    flavor: ['琥珀色', '蜜糖', '糯米甜', '焦糖', '草药'],
    abv: '14–18%',
    age: '5 年 / 10 年 / 18 年 / 30 年陈都有，价格随时间指数增长',
    brands: [
      { name: '古越龙山', cn: '古越龙山', note: '中国黄酒最大品牌', lat: 29.997, lon: 120.585 },
      { name: '会稽山', cn: '会稽山', note: '绍兴黄酒两大支柱之一', lat: 29.997, lon: 120.585 },
      { name: '塔牌', cn: '塔牌', note: '坚持手工冬酿的老牌酒厂', lat: 29.997, lon: 120.585 },
      { name: '女儿红', cn: '女儿红', note: '江南婚嫁仪式专属黄酒', lat: 29.997, lon: 120.585 }
    ],
    bottles: ['古越龙山 5 年陈花雕', '古越龙山 10 年陈', '会稽山 5 年陈', '塔牌手工冬酿', '女儿红 18 年陈'],
    serve: { temp: '温烫至 35–45℃（温一温更香）', glass: '陶瓷酒壶 + 小杯' },
    pairing: '大闸蟹、醉虾、姜母鸭、绍兴臭豆腐、淮扬大菜',
    priceBand: '¥30–450：5 年陈花雕 ¥45；10 年陈 ¥290；18 年女儿红 ¥360',
    facts: [['地理', '会稽山北麓 / 鉴湖水'], ['核心香型', '中国黄酒（半干 / 半甜 / 甜型）'], ['关键工艺', '冬至投料 + 立春开耙 + 陶坛陈酿'], ['经典喝法', '温一壶黄酒 / 大闸蟹']]
  };

  SA.REGIONS = R;

  /** 按 id 取产区 */
  SA.regionById = function (id) { return R[id] || null; };

  /** 按产地名模糊匹配产区（用于点击地球标记时自动切换知识卡） */
  SA.regionByOrigin = function (origin) {
    if (!origin) return null;
    var s = String(origin).toLowerCase();
    var keys = Object.keys(R);
    // 1) 名称精确命中
    for (var i = 0; i < keys.length; i++) {
      var r = R[keys[i]];
      if (s.indexOf(r.name.toLowerCase()) !== -1) return r;
      if (r.en && s.indexOf(r.en.toLowerCase()) !== -1) return r;
    }
    // 2) 关键词表命中
    var ALIAS = SA.REGION_ALIAS || {};
    var aliasKeys = Object.keys(ALIAS);
    for (var j = 0; j < aliasKeys.length; j++) {
      if (s.indexOf(aliasKeys[j]) !== -1) return R[ALIAS[aliasKeys[j]]] || null;
    }
    return null;
  };

  /** 别名 → 产区 id（小写关键词） */
  SA.REGION_ALIAS = {
    'islay': 'islay', '艾雷': 'islay', 'ardbeg': 'islay', 'laphroaig': 'islay', 'lagavulin': 'islay', 'bowmore': 'islay',
    'speyside': 'speyside', '斯佩塞': 'speyside', 'macallan': 'speyside', 'glenfiddich': 'speyside',
    'highland': 'highland', '高地': 'highland', 'oban': 'islands', 'talisker': 'islands', 'highland park': 'islands',
    'campbeltown': 'campbeltown', 'springbank': 'campbeltown',
    'lowland': 'lowland', '低地': 'lowland',
    'scotland': 'speyside', 'scotch': 'speyside', '苏格兰': 'speyside',
    'japan': 'japan_whisky', '日本': 'japan_whisky', 'yamazaki': 'japan_whisky', 'hibiki': 'japan_whisky', 'nikka': 'japan_whisky',
    'kentucky': 'bourbon', '肯塔基': 'bourbon', 'bourbon': 'bourbon', '波本': 'bourbon', 'tennessee': 'bourbon',
    'ireland': 'irish', '爱尔兰': 'irish', 'jameson': 'irish',
    'bordeaux': 'bordeaux', '波尔多': 'bordeaux', 'lafite': 'bordeaux', 'medoc': 'bordeaux',
    'burgundy': 'burgundy', '勃艮第': 'burgundy', 'romanee': 'burgundy',
    'champagne': 'champagne', '香槟': 'champagne',
    'rioja': 'rioja', '里奥哈': 'rioja',
    'napa': 'napa', '纳帕': 'napa', 'california': 'napa',
    'mosel': 'mosel', '摩泽尔': 'mosel', 'riesling': 'mosel', '雷司令': 'mosel',
    'barossa': 'barossa', '巴罗萨': 'barossa', 'shiraz': 'barossa', 'penfolds': 'barossa',
    'marlborough': 'marlborough', '马尔堡': 'marlborough', 'sauvignon blanc': 'marlborough', '长相思': 'marlborough',
    'mendoza': 'mendoza', '门多萨': 'mendoza', 'malbec': 'mendoza', '马尔贝克': 'mendoza',
    'cognac': 'cognac', '干邑': 'cognac', 'hennessy': 'cognac', '轩尼诗': 'cognac',
    'jerez': 'jerez', 'sherry': 'jerez', '雪莉': 'jerez',
    'douro': 'douro', 'port': 'douro', '波特': 'douro', 'porto': 'douro',
    'belgium': 'belgian_beer', '比利时': 'belgian_beer', 'trappist': 'belgian_beer', 'chimay': 'belgian_beer',
    'germany': 'german_beer', '德国': 'german_beer', 'pilsner': 'german_beer', 'munich': 'german_beer',
    'ipa': 'craft_beer_us', '精酿': 'craft_beer_us', 'sierra nevada': 'craft_beer_us',
    'new orleans': 'new_orleans', 'sazerac': 'new_orleans',
    'tequila': 'tequila', '龙舌兰': 'tequila', 'jalisco': 'tequila', 'margarita': 'tequila'
  };

  /** 热门产区快捷入口（左侧面板 chips） */
  SA.HOT_REGIONS = ['islay', 'speyside', 'bourbon', 'japan_whisky', 'bordeaux', 'champagne',
    'cognac', 'jerez', 'barossa', 'marlborough', 'belgian_beer', 'tequila',
    'maotai', 'yibin', 'fenyang', 'niigata', 'yamaguchi', 'shaoxing'];

})(window.SA);
