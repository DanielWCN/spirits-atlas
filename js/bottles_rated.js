/* =========================================================================
 * bottles_rated.js —— 补齐「有权威评分但酒库里还没有」的酒款
 * -------------------------------------------------------------------------
 * 起因：ratings.js 里 71 条可溯源评分中有 22 条指向的酒款在 bottles.js /
 * bottles_cn.js 里并不存在，导致列表里"评分显示不出来"。这里按同一 schema
 * 补齐对应酒款（含中国名酒 西凤 / 宝丰 / 宋河），评分即可自动对上。
 * 所有条目带真实经纬度、参考价格、badges（entry/veteran/value/collect）。
 * ========================================================================= */
(function (SA) {
  'use strict';
  var B = [];
  var SRC = '策展库 · bottles_rated';

  function add(o) {
    o.id = o.id || 'rt-' + B.length;
    if (o.latitude == null && o.lat != null) o.latitude = o.lat;
    if (o.longitude == null && o.lon != null) o.longitude = o.lon;
    o.category = o.category || 'whisky';
    o.source = SRC;
    o.hasGeo = isFinite(o.latitude) && isFinite(o.longitude);
    o.badges = o.badges || [];
    o.flavor_tags = o.flavor_tags || [];
    B.push(o);
  }

  /* ==================== 苏格兰 · 艾雷岛 ==================== */
  add({ id: 'c-ardbeg-corry', name: 'Ardbeg Corryvreckan', brand: 'Ardbeg', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛（无年份）', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.638, lon: -6.113, abv: 57.1, price: '¥600–800（700ml）', priceNum: 700, badges: ['veteran', 'collect'],
    flavor_tags: ['重泥煤', '黑胡椒', '海潮', '深色水果', '烟熏'],
    description: '以艾雷岛与朱拉岛之间的 Corryvreckan 漩涡命名，用部分 Virgin Oak（全新橡木桶）熟成，桶强装瓶。是 Ardbeg 委员会（Committee）票选出的经典款，泥煤酚值约 40–50ppm 却仍有甜感。',
    food_pairing: '黑巧克力、烟熏三文鱼、蓝纹奶酪', serve: { temp: '常温，可加几滴矿泉水', glass: '格兰凯恩杯' } });

  add({ id: 'c-ardbeg-oa', name: 'Ardbeg An Oa', brand: 'Ardbeg', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛（无年份）', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.638, lon: -6.113, abv: 46.6, price: '¥450–600（700ml）', priceNum: 520, badges: ['entry'],
    flavor_tags: ['圆润泥煤', '太妃糖', '烤面包', '甘草', '柔和烟熏'],
    description: '2017 年上市，用 Pedro Ximénez 桶、全新橡木桶与首填波本桶在「Gathering Vat」中调和，把 Ardbeg 标志性的粗犷泥煤打磨得更圆润，是最容易入门的阿贝。',
    food_pairing: '烤羊排、烟熏奶酪、黑森林蛋糕', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-laphroaig-qc', name: 'Laphroaig Quarter Cask', brand: 'Laphroaig', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛（无年份）', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.628, lon: -6.155, abv: 48, price: '¥400–550（700ml）', priceNum: 470, badges: ['veteran', 'value'],
    flavor_tags: ['浓烈泥煤', '椰香', '香草', '碘味', '海风'],
    description: '先在波本桶熟成，再转入只有标准桶 1/4 大小的「Quarter Cask」，桶壁接触面积翻倍，熟成加速、椰子与香草气息明显。多位酒评人综合分 9.02，是公认的性价比泥煤标杆。',
    food_pairing: '生蚝、烟熏火腿、咸味坚果', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-laphroaig-cs', name: 'Laphroaig 10 年 桶强（Batch 16）', brand: 'Laphroaig', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛 · 桶强', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.628, lon: -6.155, abv: 58.6, price: '¥900–1300（700ml）', priceNum: 1050, badges: ['veteran', 'collect'],
    flavor_tags: ['爆炸泥煤', '海盐', '焦糖', '木质香料', '余味极长'],
    description: '10 年原桶强度版本，不过滤不调色，酚值常年 40+ppm。Whiskybase 社区均分 88 分档，是重口味爱好者的必修课；加几滴水会释放出明显的甜奶油香。',
    food_pairing: '烟熏鳗鱼、陈年高达奶酪', serve: { temp: '常温，建议滴几滴水', glass: '格兰凯恩杯' } });

  add({ id: 'c-lagavulin-8', name: 'Lagavulin 8 年（200 周年纪念）', brand: 'Lagavulin', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛 8 年', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.635, lon: -6.128, abv: 48, price: '¥550–750（700ml）', priceNum: 620, badges: ['veteran'],
    flavor_tags: ['强劲烟熏', '柠檬', '海盐', '麦芽甜', '胡椒'],
    description: '为纪念酒厂 1816 年创立 200 周年而复刻的高年份前身版本，熟成时间更短因此泥煤的"生猛"感更直接，meta-critic 8.70，被许多老饕认为比 16 年更过瘾。',
    food_pairing: '炭烤海鲜、伊比利亚火腿', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-bowmore-18', name: 'Bowmore 18 年', brand: 'Bowmore', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛 18 年', origin: '苏格兰 · 艾雷岛 · 波摩', country: '英国', region: 'islay',
    lat: 55.757, lon: -6.289, abv: 43, price: '¥1200–1600（700ml）', priceNum: 1400, badges: ['veteran', 'collect'],
    flavor_tags: ['热带水果', '巧克力', '淡泥煤', '海盐', '雪莉'],
    description: '全部在 Oloroso 雪莉桶中收尾，是艾雷岛"果香派"的代表：泥煤退居二线，芒果、百香果与黑巧克力成为主角。Whiskybase 均分稳定在 86 分档。',
    food_pairing: '黑巧克力、烤鸭、陈年切达', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-bruichladdich-pc', name: 'Port Charlotte 10 年（布赫拉迪）', brand: 'Bruichladdich', category: 'whisky',
    sub_type: '单一麦芽 · 艾雷岛 · 重泥煤', origin: '苏格兰 · 艾雷岛', country: '英国', region: 'islay',
    lat: 55.685, lon: -6.375, abv: 50, price: '¥650–900（700ml）', priceNum: 760, badges: ['veteran'],
    flavor_tags: ['厚重泥煤', '橡木', '香草', '烟熏培根', '柑橘'],
    description: '布赫拉迪酒厂的重泥煤支线，酚值约 40ppm，全部使用苏格兰本地大麦。whiskynet 泥煤榜常客（约 87/100 档）。',
    food_pairing: '烟熏牛胸肉、烤蘑菇', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  /* ==================== 苏格兰 · 斯佩塞 / 高地 / 岛屿 ==================== */
  add({ id: 'c-balvenie-14cc', name: 'The Balvenie 14 年 Caribbean Cask', brand: 'The Balvenie', category: 'whisky',
    sub_type: '单一麦芽 · 斯佩塞 14 年', origin: '苏格兰 · 达夫敦', country: '英国', region: 'speyside',
    lat: 57.437, lon: -3.129, abv: 43, price: '¥750–1000（700ml）', priceNum: 850, badges: ['entry', 'value'],
    flavor_tags: ['朗姆桶甜', '香蕉', '太妃糖', '香草', '圆润'],
    description: '先在波本桶熟成 14 年，再用加勒比朗姆桶过桶 6 个月，热带水果与红糖气息明显。Whiskybase 千余票样本均分 83+，是送礼与自饮都稳妥的一款。',
    food_pairing: '焦糖布丁、烤菠萝、坚果', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-glenfarclas-15', name: 'Glenfarclas 15 年', brand: 'Glenfarclas', category: 'whisky',
    sub_type: '单一麦芽 · 斯佩塞 · 雪莉桶', origin: '苏格兰 · 巴林达洛赫', country: '英国', region: 'speyside',
    lat: 57.393, lon: -3.317, abv: 46, price: '¥800–1100（700ml）', priceNum: 920, badges: ['veteran', 'collect'],
    flavor_tags: ['雪莉', '葡萄干', '黑巧克力', '皮革', '香料'],
    description: '家族独立经营百余年，是斯佩塞雪莉桶风格的教科书。100% Oloroso 雪莉桶熟成，酒体厚重、干果与皮革气息突出，Whiskybase 均分 87 分档。',
    food_pairing: '圣诞布丁、蓝纹奶酪、烟熏鸭胸', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-arran-10', name: 'Arran 10 年', brand: 'Isle of Arran', category: 'whisky',
    sub_type: '单一麦芽 · 岛屿区 10 年', origin: '苏格兰 · 阿伦岛', country: '英国', region: 'islands',
    lat: 55.701, lon: -5.298, abv: 46, price: '¥400–550（700ml）', priceNum: 460, badges: ['entry', 'value'],
    flavor_tags: ['柑橘', '蜂蜜', '青苹果', '淡淡海风', '麦芽'],
    description: '1995 年才投产的年轻酒厂，坚持不冷凝过滤、不调色。风格清新华丽，柑橘与蜂蜜突出，长期是"高性价比入门单一麦芽"榜单常客。',
    food_pairing: '烟熏三文鱼、柠檬挞、山羊奶酪', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-auchentoshan-3w', name: 'Auchentoshan Three Wood', brand: 'Auchentoshan', category: 'whisky',
    sub_type: '单一麦芽 · 低地 · 三次桶陈', origin: '苏格兰 · 克莱德班克', country: '英国', region: 'lowland',
    lat: 55.906, lon: -4.407, abv: 43, price: '¥600–850（700ml）', priceNum: 700, badges: ['entry'],
    flavor_tags: ['黑加仑', '葡萄干', '肉桂', '橙皮', '顺滑'],
    description: '低地仅存的三家酒厂之一，坚持三次蒸馏。先后在波本桶、Oloroso 桶、Pedro Ximénez 桶中熟成（故名 Three Wood），甜美丰厚，Whiskybase 约 82 分 / 400+ 票。',
    food_pairing: '巧克力慕斯、烤坚果、圣诞蛋糕', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  /* ==================== 调和威士忌 ==================== */
  add({ id: 'c-chivas-12', name: 'Chivas Regal 12 年', brand: 'Chivas Brothers', category: 'whisky',
    sub_type: '调和威士忌 12 年', origin: '苏格兰 · 基思（Strathisla）', country: '英国', region: 'speyside',
    lat: 57.542, lon: -2.955, abv: 40, price: '¥180–260（700ml）', priceNum: 210, badges: ['entry'],
    flavor_tags: ['蜂蜜', '苹果', '香草', '柔和', '奶油'],
    description: '全球最畅销的 12 年调和威士忌之一，以 Strathisla 单一麦芽为骨架。Whiskybase 均分 77.5 分档——客观地说属于"低于平均但易饮"的入门定位，适合加冰或调酒。',
    food_pairing: '烤肉、奶油意面、苹果派', serve: { temp: '常温或加冰', glass: '古典杯' } });

  add({ id: 'c-johnnie-black12', name: 'Johnnie Walker Black Label 12 年', brand: 'Johnnie Walker', category: 'whisky',
    sub_type: '调和威士忌 12 年', origin: '苏格兰 · 基尔马诺克（起源）', country: '英国', region: 'scotland',
    lat: 55.611, lon: -4.497, abv: 40, price: '¥220–320（700ml）', priceNum: 260, badges: ['entry', 'value'],
    flavor_tags: ['烟熏', '柑橘', '香草', '麦芽', '平衡'],
    description: '由约 40 种麦芽与谷物威士忌调和，其中含 Talisker、Lagavulin 等岛屿/艾雷岛原酒，因此带有招牌的一缕烟熏。约 80 分档，是全世界酒吧最常见的"标准杯"。',
    food_pairing: '牛排、烟熏奶酪、黑巧克力', serve: { temp: '常温 / 加冰 / 苏打水', glass: '古典杯' } });

  /* ==================== 爱尔兰 / 美国 / 日本 ==================== */
  add({ id: 'c-bushmills-12', name: 'Bushmills 12 年', brand: 'Bushmills', category: 'whisky',
    sub_type: '单一麦芽 · 爱尔兰 12 年', origin: '北爱尔兰 · 布什米尔', country: '英国', region: 'ireland',
    lat: 55.203, lon: -6.520, abv: 40, price: '¥400–550（700ml）', priceNum: 460, badges: ['entry'],
    flavor_tags: ['蜂蜜', '干果', '雪莉', '香料', '顺滑'],
    description: '1608 年获得蒸馏许可的世界最古老持证酒厂之一。先在波本桶后转 Oloroso 桶，Whiskybase 约 83 分 / 60+ 票，是爱尔兰单一麦芽的平价门面。',
    food_pairing: '烤鸡、坚果、焦糖甜点', serve: { temp: '常温', glass: '格兰凯恩杯' } });

  add({ id: 'c-jameson-original', name: 'Jameson Irish Whiskey', brand: 'Jameson', category: 'whisky',
    sub_type: '调和爱尔兰威士忌（三次蒸馏）', origin: '爱尔兰 · 科克郡 Midleton', country: '爱尔兰', region: 'ireland',
    lat: 51.916, lon: -8.172, abv: 40, price: '¥150–220（700ml）', priceNum: 180, badges: ['entry', 'value'],
    flavor_tags: ['花香', '青苹果', '香草', '轻盈', '顺滑'],
    description: '全球销量最大的爱尔兰威士忌，单一壶式 + 谷物威士忌调和、三次蒸馏，因此酒体轻盈顺滑。公开样本极少（约 76–77 分区间），定位纯口粮 / 调酒（Irish Coffee 经典基酒）。',
    food_pairing: '咖啡、姜汁啤酒（调酒）、炸鱼薯条', serve: { temp: '常温 / 加冰', glass: '古典杯' } });

  add({ id: 'c-jack-daniels-no7', name: 'Jack Daniel\'s Old No.7', brand: 'Jack Daniel\'s', category: 'whisky',
    sub_type: '田纳西威士忌（枫木炭过滤）', origin: '美国 · 田纳西州 Lynchburg', country: '美国', region: 'usa',
    lat: 35.283, lon: -86.370, abv: 40, price: '¥160–240（700ml）', priceNum: 190, badges: ['entry'],
    flavor_tags: ['香草', '焦糖', '香蕉', '橡木', '甜润'],
    description: '田纳西威士忌的代名词，蒸馏后经 3 米厚枫木炭缓慢过滤（Lincoln County Process），口感比波本更柔和甜润。Whiskybase 样本极少、约 76–77 分档，属大众口粮定位。',
    food_pairing: '可乐（JD & Cola）、烧烤肋排、汉堡', serve: { temp: '加冰 / 调酒', glass: '古典杯' } });

  add({ id: 'c-jd-single-barrel', name: 'Jack Daniel\'s Single Barrel', brand: 'Jack Daniel\'s', category: 'whisky',
    sub_type: '田纳西威士忌 · 单桶', origin: '美国 · 田纳西州 Lynchburg', country: '美国', region: 'usa',
    lat: 35.283, lon: -86.370, abv: 45, price: '¥400–550（700ml）', priceNum: 460, badges: ['veteran'],
    flavor_tags: ['浓郁焦糖', '烤橡木', '香草', '黑糖', '余味长'],
    description: '从仓库高层（熟成温差大、风味最浓）挑选单桶装瓶，每瓶都印有桶号与仓库编号。相比 No.7 桶强更高、焦糖与橡木感更集中。',
    food_pairing: '炭烤牛排、焦糖布丁、雪茄', serve: { temp: '常温 / 加冰', glass: '格兰凯恩杯' } });

  add({ id: 'c-nikka-taketsuru', name: 'Nikka Taketsuru Pure Malt', brand: 'Nikka', category: 'whisky',
    sub_type: '纯麦芽 · 日本（余市 + 宫城峡）', origin: '日本 · 宫城峡（仙台）', country: '日本', region: 'japan',
    lat: 38.389, lon: 140.955, abv: 43, price: '¥900–1400（700ml）', priceNum: 1100, badges: ['veteran', 'collect'],
    flavor_tags: ['果香', '淡淡烟熏', '橡木', '蜂蜜', '平衡'],
    description: '以日威之父竹鹤政孝命名，调和余市（烟熏厚重）与宫城峡（花果轻盈）两家原酒，是理解 Nikka 风格最标准的一支。Whiskybase 约 86 分档。',
    food_pairing: '刺身、烤鳗鱼、和果子', serve: { temp: '常温 / 加冰球', glass: '格兰凯恩杯' } });

  /* ==================== 中国名酒（全国评酒会定级） ==================== */
  add({ id: 'c-xifeng-lvp', name: '西凤酒（绿脖西凤 55°）', brand: '西凤', category: 'baijiu',
    sub_type: '凤香型', origin: '陕西 · 宝鸡凤翔', country: '中国', region: 'shaanxi',
    lat: 34.520, lon: 107.398, abv: 55, price: '¥100–180（500ml）', priceNum: 130, badges: ['veteran', 'value'],
    flavor_tags: ['醇香典雅', '甘润挺爽', '诸味协调', '尾净悠长'],
    description: '1952 年第一届全国评酒会评出的"四大名酒"之一，也是凤香型唯一代表。工艺独一份：用土暗窖发酵（每年换新窖泥），酒海（荆条编篓涂血料纸蜜蜡）贮存，因此兼具清香的净与浓香的甜。',
    food_pairing: '陕西凉皮、羊肉泡馍、腊汁肉夹馍', serve: { temp: '常温', glass: '小玻璃盅' } });

  add({ id: 'c-baofeng', name: '宝丰酒（国色清香 63°）', brand: '宝丰', category: 'baijiu',
    sub_type: '清香型', origin: '河南 · 平顶山宝丰', country: '中国', region: 'henan',
    lat: 33.866, lon: 113.058, abv: 63, price: '¥150–260（500ml）', priceNum: 190, badges: ['veteran'],
    flavor_tags: ['清香纯正', '绵甜柔和', '甘润爽口', '回味净'],
    description: '1989 年第五届全国评酒会评定的"中国名酒"，豫酒清香派代表，与汾酒同属大曲清香一脉却更偏绵甜。地处中原粮仓，用高粱为主料、地缸发酵。',
    food_pairing: '豫式烩面、道口烧鸡、胡辣汤', serve: { temp: '常温', glass: '小玻璃盅' } });

  add({ id: 'c-songhe', name: '宋河粮液（国字宋河）', brand: '宋河', category: 'baijiu',
    sub_type: '浓香型', origin: '河南 · 周口鹿邑', country: '中国', region: 'henan',
    lat: 33.855, lon: 115.487, abv: 50, price: '¥180–320（500ml）', priceNum: 230, badges: ['value'],
    flavor_tags: ['窖香浓郁', '绵甜甘冽', '香味协调', '尾净'],
    description: '1989 年第五届全国评酒会"中国名酒"，豫酒浓香派代表。取老子故里鹿邑古宋河之水，老窖续糟发酵，是中原地区礼宴用酒的老牌子。',
    food_pairing: '逍遥镇胡辣汤、开封灌汤包、红烧黄河鲤鱼', serve: { temp: '常温', glass: '小玻璃盅' } });

  SA.BOTTLES_RATED = B;
  SA.BOTTLES = (SA.BOTTLES || []).concat(B);
})(window.SA = window.SA || {});
