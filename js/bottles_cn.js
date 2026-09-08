/* =========================================================================
 * bottles_cn.js —— 中国各地代表酒 + 全球各地特色酒（策展补充库）
 * -------------------------------------------------------------------------
 * 补充 bottles.js 未覆盖的：中国 33 省区市代表酒（含内蒙古马奶酒、天津芦台春、
 * 北京二锅头）、日本烧酎/泡盛、韩国烧酒、蒙古马奶酒、皮斯科、梅斯卡尔、卡莎萨、
 * 各国朗姆/伏特加/茴香酒/蜂蜜酒等。
 * 所有条目均带经纬度（可落地球）、参考价格区间、badges 快速标签。
 *
 * badges 说明：entry 新手推荐 / veteran 老炮儿推荐 / value 高性价比 / collect 收藏级
 * 价格：为 2026 年前后中国大陆/免税渠道常见零售价区间，仅供预算参考，非实时报价。
 * ========================================================================= */
(function (SA) {
  'use strict';
  var B = [];
  var SRC = '策展库 · bottles_cn';

  function add(o) {
    o.id = o.id || 'cn-' + B.length;
    if (o.latitude == null && o.lat != null) o.latitude = o.lat;
    if (o.longitude == null && o.lon != null) o.longitude = o.lon;
    o.category = o.category || 'baijiu';
    o.source = SRC;
    o.hasGeo = isFinite(o.latitude) && isFinite(o.longitude);
    o.badges = o.badges || [];
    o.flavor_tags = o.flavor_tags || [];
    B.push(o);
  }

  /* ==================== 华北 ==================== */
  add({ id: 'c-hongxing-erguotou', name: '红星二锅头（蓝瓶 56°）', brand: '红星', category: 'baijiu',
    sub_type: '清香型 · 二锅头', origin: '北京 · 怀柔', country: '中国', region: 'beijing',
    lat: 39.904, lon: 116.407, abv: 56, price: '¥15–25（500ml）', priceNum: 20, badges: ['entry', 'value'],
    flavor_tags: ['清香纯正', '甘冽', '入口冲', '粮食香', '余味净'],
    description: '1949 年华北酒业专卖公司收编北京 12 家老烧锅成立，是二锅头技艺的始创者。「二锅头」指掐头去尾取第二锅冷凝水——只取中段最纯净酒心，乙酸乙酯清爽、杂醇油极低。绿瓶 56° 是几代北京人的口粮记忆。',
    food_pairing: '炸酱面、卤煮、烤鸭、酱肘子、花生米', serve: { temp: '常温或冰镇', glass: '小玻璃盅' } });

  add({ id: 'c-niulanshan', name: '牛栏山二锅头（白瓶 52°）', brand: '牛栏山', category: 'baijiu',
    sub_type: '清香型 · 二锅头', origin: '北京 · 顺义牛栏山', country: '中国', region: 'beijing',
    lat: 40.130, lon: 116.654, abv: 52, price: '¥12–20（500ml）', priceNum: 16, badges: ['entry', 'value'],
    flavor_tags: ['绵甜', '清爽', '粮香', '低度柔和'],
    description: '顺义牛栏山镇，「百年牛栏山」。与红星并列北京二锅头双雄，销量上长期是全国光瓶酒冠军。度数选择多（36°–56°），白瓶 52° 是最经典款。',
    food_pairing: '火锅、烤串、家常炒菜', serve: { temp: '常温', glass: '小玻璃盅' } });

  add({ id: 'c-lutaichun', name: '芦台春（北酱 53°）', brand: '芦台春', category: 'baijiu',
    sub_type: '酱香型 · 麸曲酱香（北派酱香）', origin: '天津 · 宁河区芦台镇', country: '中国', region: 'tianjin',
    lat: 39.330, lon: 117.823, abv: 53, price: '¥200–600（500ml）', priceNum: 380, badges: ['veteran'],
    flavor_tags: ['舒适酱香', '焦香', '醇厚', '回甘'],
    description: '前身是清康熙元年（1662）「德和酒坊」。1972 年白酒泰斗周恒刚在此用茅台试点分离的菌种，研制出中国第一瓶优质麸曲酱香型白酒并亲自定名「芦台春」，被誉为「北方茅台」。1978–1983 年「芦台试点」与烟台试点、茅台试点并称中国白酒「三台试点」。2011 年获国家地理标志保护产品，2024 年认定中华老字号。',
    food_pairing: '津味罾蹦鲤鱼、狗不理包子、酱货拼盘', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-jinjiu', name: '津酒（帝王风范 52°）', brand: '津酒', category: 'baijiu',
    sub_type: '浓香型', origin: '天津 · 西青区', country: '中国', region: 'tianjin',
    lat: 39.125, lon: 117.199, abv: 52, price: '¥150–400（500ml）', priceNum: 250, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '协调', '尾净'],
    description: '天津地方名酒代表，属多粮浓香，有「南有洋河北有津酒」之说。帝王风范系列是本地婚宴常客。',
    food_pairing: '天津菜、海鲜、煎饼馃子（配酒另说）', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-hengshui-laobaigan', name: '衡水老白干（古法二十 67°）', brand: '衡水老白干', category: 'baijiu',
    sub_type: '老白干香型', origin: '河北 · 衡水', country: '中国', region: 'hebei',
    lat: 37.739, lon: 115.669, abv: 67, price: '¥280–360（500ml）', priceNum: 310, badges: ['veteran'],
    flavor_tags: ['醇香清雅', '甘冽挺拔', '青草香', '酒劲足', '回味长'],
    description: '「老白干」意为「老（历史悠久）、白（清澈透明）、干（酒度高不掺水）」。2004 年前归入清香型，后因中温大曲、地缸发酵但曲温更高、酒体更挺拔而独立成「老白干香型」。67° 是河北酒桌的性格线——第一次喝建议从五星 39°/52° 起步。',
    food_pairing: '驴肉火烧、酱牛肉、河北焖子', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-liulingzui', name: '刘伶醉（千年窖池 52°）', brand: '刘伶醉', category: 'baijiu',
    sub_type: '浓香型', origin: '河北 · 保定徐水', country: '中国', region: 'hebei',
    lat: 38.874, lon: 115.640, abv: 52, price: '¥150–400', priceNum: 260, badges: ['veteran'],
    flavor_tags: ['窖香浓郁', '绵甜', '陈香'],
    description: '西晋「竹林七贤」刘伶醉酒处得名，使用金元时期延续至今的古窖池群（全国重点文物保护单位）。',
    food_pairing: '保定驴肉、白肉罩火烧', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-hetaowang', name: '河套王（20 年 52°）', brand: '河套王', category: 'baijiu',
    sub_type: '浓香型', origin: '内蒙古 · 巴彦淖尔', country: '中国', region: 'neimenggu',
    lat: 40.744, lon: 107.390, abv: 52, price: '¥300–800', priceNum: 480, badges: ['veteran'],
    flavor_tags: ['窖香', '绵甜', '清爽', '粮香'],
    description: '内蒙古白酒销量老大，河套平原「天下第一粮仓」的优质高粱小麦，凭借低温缓慢发酵形成「淡雅浓香」的塞外风格。',
    food_pairing: '手把肉、烤羊排、羊杂碎', serve: { temp: '常温', glass: '银碗/小瓷杯' } });

  add({ id: 'c-mengguwang', name: '蒙古王（金帐 53°）', brand: '蒙古王', category: 'baijiu',
    sub_type: '浓香型 · 草原派', origin: '内蒙古 · 通辽', country: '中国', region: 'neimenggu',
    lat: 43.653, lon: 122.253, abv: 53, price: '¥180–500', priceNum: 300, badges: ['value'],
    flavor_tags: ['窖香', '醇厚', '微甜', '顺口'],
    description: '科尔沁草原上的浓香型代表，包装走草原文化路线。度数偏高但入口相对柔和，适合配牛羊肉。',
    food_pairing: '烤全羊、手把肉、奶豆腐', serve: { temp: '常温', glass: '银碗' } });

  add({ id: 'c-madajiou', name: '马奶酒（酸马奶 · 策格）', brand: '', category: 'mijiu',
    sub_type: '发酵乳酒 · 蒙古传统', origin: '内蒙古 · 锡林郭勒草原', country: '中国', region: 'neimenggu',
    lat: 43.933, lon: 116.087, abv: 3, price: '¥30–80（500ml）', priceNum: 50, badges: ['entry'],
    flavor_tags: ['酸甜', '乳香', '气泡感', '酒劲绵长', '清凉'],
    description: '蒙古语「策格」（ᠴᠡᠭᠡ，chigee），以鲜马奶经乳酸菌+酵母菌自然发酵而成，酒精度仅 1.5–3°，却「后劲绵长」——喝起来像酸奶汽水，骑上马才知厉害。蒙医认为可调理肠胃。是那达慕大会与待客的最高礼节之一，敬酒需双手接、无名指蘸酒弹三下敬天地。',
    food_pairing: '手把肉、奶皮子、烤羊腿、炒米', serve: { temp: '冰镇 6–10℃', glass: '银碗 / 木碗' } });

  add({ id: 'c-mendaolv', name: '闷倒驴（65° 草原白）', brand: '闷倒驴', category: 'baijiu',
    sub_type: '清香型 · 高度', origin: '内蒙古 · 赤峰', country: '中国', region: 'neimenggu',
    lat: 42.258, lon: 118.887, abv: 65, price: '¥40–90', priceNum: 60, badges: ['veteran', 'value'],
    flavor_tags: ['烈', '甘冽', '纯净', '高度'],
    description: '名字取自「驴喝了都能闷倒」的草原玩笑，60–68° 的高度清香型，是内蒙古酒桌上的硬通货。适合小口抿，不宜豪饮。',
    food_pairing: '手把肉、风干牛肉', serve: { temp: '常温', glass: '极小杯' } });

  /* ==================== 东北 ==================== */
  add({ id: 'c-beidacang', name: '北大仓（君妃 50°）', brand: '北大仓', category: 'baijiu',
    sub_type: '酱香型 · 北大仓派', origin: '黑龙江 · 齐齐哈尔', country: '中国', region: 'heilongjiang',
    lat: 47.342, lon: 123.950, abv: 50, price: '¥100–400', priceNum: 220, badges: ['value'],
    flavor_tags: ['酱香', '焦香', '醇厚', '略糙'],
    description: '1914 年建厂，东北酱香代表，有「北国茅台」之称。因东北红高粱与气候差异，酱香偏粗犷，性价比突出。',
    food_pairing: '锅包肉、杀猪菜、酱骨架', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-yushuqian', name: '榆树钱（年份酒 52°）', brand: '榆树钱', category: 'baijiu',
    sub_type: '浓香型', origin: '吉林 · 长春榆树', country: '中国', region: 'jilin',
    lat: 44.493, lon: 126.560, abv: 52, price: '¥100–400', priceNum: 200, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '柔顺'],
    description: '吉林名酒，因当地百年古榆树春季结荚形似铜钱得名「榆树钱」，寓意吉祥。东北浓香柔和派。',
    food_pairing: '东北乱炖、小鸡炖蘑菇', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-laolongkou', name: '老龙口（陈酿 52°）', brand: '老龙口', category: 'baijiu',
    sub_type: '浓香型', origin: '辽宁 · 沈阳', country: '中国', region: 'liaoning',
    lat: 41.802, lon: 123.431, abv: 52, price: '¥100–350', priceNum: 180, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '清爽'],
    description: '始建于 1662 年（清康熙元年），是东北酿造历史最久的酒坊之一，沈阳大东门「老龙口」古井水质甘冽。',
    food_pairing: '沈阳老边饺子、熏肉大饼', serve: { temp: '常温', glass: '小瓷杯' } });

  /* ==================== 华东 ==================== */
  add({ id: 'c-yanghe-blue', name: '洋河·梦之蓝 M6+（52°）', brand: '洋河', category: 'baijiu',
    sub_type: '浓香型 · 江淮派（绵柔）', origin: '江苏 · 宿迁', country: '中国', region: 'jiangsu',
    lat: 33.827, lon: 118.284, abv: 52, price: '¥700–1,100（520ml）', priceNum: 880, badges: ['collect'],
    flavor_tags: ['绵柔', '窖香', '粮香', '陈香', '顺滑'],
    description: '1979、1984、1989 三届全国评酒会「中国名酒」。江淮派浓香代表——区别于川派的爆香，主打「绵柔型」：入口低刺激、甜润、层次渐开，是商务宴请的全国硬通货。蓝色经典（海之蓝/天之蓝/梦之蓝）三段定位清晰。',
    food_pairing: '淮扬菜、清蒸鲥鱼、蟹粉狮子头', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-shuanggou', name: '双沟大曲（珍宝坊 53°）', brand: '双沟', category: 'baijiu',
    sub_type: '浓香型 · 江淮派', origin: '江苏 · 泗洪双沟镇', country: '中国', region: 'jiangsu',
    lat: 33.461, lon: 118.204, abv: 53, price: '¥150–500', priceNum: 280, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '醇厚'],
    description: '1984、1989 届中国名酒。1977 年双沟醉猿化石遗址出土，证明此地酿酒与人类起源同样久远。现与洋河同属苏酒集团。',
    food_pairing: '泗洪螃蟹、洪泽湖鱼鲜', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-jinshiyuan', name: '今世缘·国缘四开（42°）', brand: '今世缘', category: 'baijiu',
    sub_type: '浓香型 · 江淮派', origin: '江苏 · 淮安', country: '中国', region: 'jiangsu',
    lat: 33.610, lon: 119.015, abv: 42, price: '¥450–700', priceNum: 550, badges: ['entry'],
    flavor_tags: ['绵柔', '甜润', '低度顺口'],
    description: '婚宴场景第一品牌，「国缘」系列主打中度（42°）绵柔。名字与定位精准切中喜庆消费。',
    food_pairing: '淮扬菜、长鱼宴', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-gujinggong', name: '古井贡酒·年份原浆古20（50°）', brand: '古井贡', category: 'baijiu',
    sub_type: '浓香型 · 淡雅派', origin: '安徽 · 亳州', country: '中国', region: 'anhui',
    lat: 33.853, lon: 115.781, abv: 50, price: '¥500–900', priceNum: 650, badges: ['collect'],
    flavor_tags: ['窖香幽雅', '醇厚', '陈香', '回甘'],
    description: '1963、1979、1984、1989 四届中国名酒，「酒中牡丹」。曹操故乡亳州，使用无极水 + 明代窖池 + 桃花曲（只在桃花盛开时制曲）。年份原浆系列是徽酒高端化的样板。',
    food_pairing: '徽菜臭鳜鱼、李鸿章杂烩、曹操鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-kouzijiao', name: '口子窖（20 年 41°）', brand: '口子窖', category: 'baijiu',
    sub_type: '兼香型 · 浓中带酱', origin: '安徽 · 淮北濉溪', country: '中国', region: 'anhui',
    lat: 33.951, lon: 116.791, abv: 41, price: '¥400–700', priceNum: 520, badges: ['veteran'],
    flavor_tags: ['浓酱协调', '陈香', '绵甜', '余味长'],
    description: '兼香型代表（GB/T 10781.8）。濉溪「口子」千年酿酒古镇，采用「一步法」真藏实窖工艺，一步成兼香而非后期勾调。',
    food_pairing: '符离集烧鸡、地锅鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-yingjia', name: '迎驾贡酒（生态洞藏 52°）', brand: '迎驾贡', category: 'baijiu',
    sub_type: '浓香型', origin: '安徽 · 六安霍山', country: '中国', region: 'anhui',
    lat: 31.399, lon: 116.320, abv: 52, price: '¥200–600', priceNum: 350, badges: ['value'],
    flavor_tags: ['窖香', '甜润', '干净'],
    description: '汉武帝南巡霍山，官民迎驾献酒得名。主打大别山「生态酿酒」概念，洞藏系列在安徽及周边强势。',
    food_pairing: '霍山石斛炖汤、皖西白鹅', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-jingzhi', name: '一品景芝·芝香 15 年（53°）', brand: '景芝', category: 'baijiu',
    sub_type: '芝麻香型', origin: '山东 · 潍坊安丘景芝镇', country: '中国', region: 'shandong',
    lat: 36.423, lon: 119.179, abv: 53, price: '¥280–380', priceNum: 330, badges: ['veteran'],
    flavor_tags: ['炒芝麻香', '焦香', '酱头浓体清尾', '焙烤'],
    description: '芝麻香型创立者（GB/T 20824），由景芝酒厂 1957 年发现、1995 年正式确立香型。全程不加一粒芝麻——香气来自高温大曲+麸曲多菌种发酵产生的吡嗪类（焦香）与呋喃类（糊香）物质。「酱头、浓体、清尾」，是跳出浓清酱三大香型的高性价比选择。',
    food_pairing: '鲁菜九转大肠、葱烧海参、德州扒鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-kongfujia', name: '孔府家酒（儒雅香 52°）', brand: '孔府家', category: 'baijiu',
    sub_type: '浓香型', origin: '山东 · 曲阜', country: '中国', region: 'shandong',
    lat: 35.598, lon: 116.989, abv: 52, price: '¥120–400', priceNum: 200, badges: ['value'],
    flavor_tags: ['窖香', '醇厚', '绵甜'],
    description: '孔子故里，「孔府家酒，叫人想家」是 90 年代最洗脑的白酒广告之一。鲁派浓香，文化属性强。',
    food_pairing: '孔府菜、诗礼银杏', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-taishan', name: '泰山特曲（五岳独尊 52°）', brand: '泰山', category: 'baijiu',
    sub_type: '浓香型', origin: '山东 · 泰安', country: '中国', region: 'shandong',
    lat: 36.203, lon: 117.089, abv: 52, price: '¥150–400', priceNum: 220, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '爽净'],
    description: '山东大众消费王者，泰山文化加持，省内渗透率极高。',
    food_pairing: '泰山煎饼、鲁菜', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-shaoxing-huangjiu', name: '绍兴女儿红（花雕 16 年）', brand: '女儿红', category: 'mijiu',
    sub_type: '黄酒 · 半干型', origin: '浙江 · 绍兴', country: '中国', region: 'zhejiang',
    lat: 30.030, lon: 120.582, abv: 16, price: '¥80–300（500ml）', priceNum: 160, badges: ['entry'],
    flavor_tags: ['醇厚甘鲜', '焦糖', '麦曲香', '酸度清爽', '陈香'],
    description: '世界三大古酒之一（另两种：啤酒、葡萄酒）。以糯米、麦曲、鉴湖水酿造，属酿造酒（非蒸馏）。「女儿红」习俗：生女时埋酒于地下，出嫁时启封。按含糖量分元红（干）、加饭（半干）、善酿（半甜）、香雪（甜）四类。',
    food_pairing: '醉蟹、茴香豆、东坡肉、清蒸鱼', serve: { temp: '温热 40–45℃（冬季）或冰镇（夏季）', glass: '小瓷碗 / 锡壶温' } });

  add({ id: 'c-tongshan-shao', name: '同山烧（醉美同山 50°）', brand: '同山烧', category: 'baijiu',
    sub_type: '清香型 · 糟烧', origin: '浙江 · 诸暨同山', country: '中国', region: 'zhejiang',
    lat: 29.715, lon: 120.232, abv: 50, price: '¥100–300', priceNum: 180, badges: ['value'],
    flavor_tags: ['清香', '甘冽', '高粱香'],
    description: '浙江罕见的蒸馏白酒（江南多黄酒），用高粱酿造、糟烧工艺，是「江南茅台」式的地方存在。',
    food_pairing: '西施豆腐、诸暨香榧', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-sitir', name: '四特酒（东方韵·国韵 52°）', brand: '四特', category: 'baijiu',
    sub_type: '特香型', origin: '江西 · 樟树', country: '中国', region: 'jiangxi',
    lat: 28.067, lon: 115.547, abv: 52, price: '¥300–600', priceNum: 420, badges: ['veteran'],
    flavor_tags: ['三香兼备', '米香', '柔和', '诸味协调'],
    description: '特香型唯一代表（GB/T 20823），特点是「浓、清、酱三香兼备而不靠」。独特工艺「12353」：整粒大米为唯一原料、红褚条石垒窖、大曲由面粉+麦麸+酒糟三者制成。因整粒大米不粉碎，酒体自带米香的甜净。',
    food_pairing: '赣菜粉蒸肉、藜蒿炒腊肉、瓦罐汤', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-lidu', name: '李渡高粱（1955 光瓶 52°）', brand: '李渡', category: 'baijiu',
    sub_type: '兼香型 · 一口四香', origin: '江西 · 进贤李渡镇', country: '中国', region: 'jiangxi',
    lat: 28.372, lon: 116.262, abv: 52, price: '¥400–800', priceNum: 550, badges: ['veteran', 'collect'],
    flavor_tags: ['一口四香', '醇厚', '陈味', '层次丰富'],
    description: '元代烧酒作坊遗址（2002 年考古发现，中国年代最早、遗迹最全的白酒作坊）所在地，是高端光瓶酒的开创者。营销上主打「一瓶酒含 167 种微量成分」和「一口四香」。',
    food_pairing: '南昌拌粉、瓦罐煨汤', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-chengang', name: '龙岩沉缸酒（甜型黄酒）', brand: '沉缸', category: 'mijiu',
    sub_type: '黄酒 · 甜型', origin: '福建 · 龙岩', country: '中国', region: 'fujian',
    lat: 25.075, lon: 117.017, abv: 14, price: '¥60–180（500ml）', priceNum: 100, badges: ['entry'],
    flavor_tags: ['甜润', '红曲香', '醇厚', '琥珀色'],
    description: '1959 年被评为中国名酒，福建红曲黄酒代表。因酿造时酒醅反复沉浮于缸底（三沉三浮）得名，用红曲 + 白曲双曲发酵。',
    food_pairing: '客家菜、白斩鸡、佛跳墙', serve: { temp: '常温或温热', glass: '小瓷碗' } });

  add({ id: 'c-fumao', name: '福矛窖酒（30 年 53°）', brand: '福矛', category: 'baijiu',
    sub_type: '酱香型 · 闽派', origin: '福建 · 建瓯', country: '中国', region: 'fujian',
    lat: 27.038, lon: 118.320, abv: 53, price: '¥300–900', priceNum: 500, badges: ['veteran'],
    flavor_tags: ['酱香', '绵柔', '窖底香'],
    description: '「福建茅台」，闽北酱香代表，湿热的武夷山区微气候形成与黔派不同的绵柔酱香。',
    food_pairing: '闽北熏鹅、光饼', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-shanghai-laolao', name: '石库门上海老酒（锦绣 12 年）', brand: '石库门', category: 'mijiu',
    sub_type: '黄酒 · 半干型', origin: '上海 · 金山枫泾', country: '中国', region: 'shanghai',
    lat: 31.230, lon: 121.473, abv: 14, price: '¥80–200', priceNum: 120, badges: ['entry'],
    flavor_tags: ['醇和', '微甜', '焦糖', '清爽'],
    description: '海派黄酒代表，较绍兴黄酒更清淡甜润，是上海本帮菜的经典搭配。',
    food_pairing: '本帮红烧肉、油爆虾、草头圈子', serve: { temp: '温热 40℃', glass: '小瓷碗' } });

  /* ==================== 华中 / 华南 ==================== */
  add({ id: 'c-baiyunbian', name: '白云边（15 年 42°）', brand: '白云边', category: 'baijiu',
    sub_type: '兼香型 · 酱中带浓', origin: '湖北 · 荆州松滋', country: '中国', region: 'hubei',
    lat: 30.177, lon: 111.771, abv: 42, price: '¥100–130', priceNum: 115, badges: ['value', 'entry'],
    flavor_tags: ['兼香', '酱中带浓', '柔和', '低度顺口'],
    description: '兼香型另一极（与口子窖的「浓中带酱」相反）是「酱中带浓」。名字取自李白「且就洞庭赊月色，将船买酒白云边」。湖北市场统治级产品，42° 低度是其特色。',
    food_pairing: '沔阳三蒸、清蒸武昌鱼、热干面', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-jingjiu', name: '劲酒（保健酒 35°）', brand: '劲酒', category: 'baijiu',
    sub_type: '保健酒 · 配制', origin: '湖北 · 大冶', country: '中国', region: 'hubei',
    lat: 30.093, lon: 114.978, abv: 35, price: '¥15–40（125ml）', priceNum: 25, badges: ['entry'],
    flavor_tags: ['草本香', '微苦回甘', '甜润'],
    description: '中国保健酒销量第一（茅台白金酒、椰岛鹿龟酒同赛道）。以清香型白酒为基酒，加入淫羊藿、肉苁蓉、枸杞、黄芪等草本浸提。「劲酒虽好，可不要贪杯」是国民级广告语。',
    food_pairing: '家常菜、火锅', serve: { temp: '常温', glass: '小玻璃杯' } });

  add({ id: 'c-jiugui', name: '酒鬼酒·紫坛（54°）', brand: '酒鬼', category: 'baijiu',
    sub_type: '馥郁香型', origin: '湖南 · 湘西吉首', country: '中国', region: 'hunan',
    lat: 28.311, lon: 109.739, abv: 54, price: '¥330–450', priceNum: 380, badges: ['veteran'],
    flavor_tags: ['前浓', '中清', '后酱', '一口三香', '馥郁'],
    description: '馥郁香型唯一代表（GB/T 10781.11），2005 年正式确立，特点是「前浓、中清、后酱」一口三香。麻袋陶瓶由黄永玉设计，是白酒包装的经典之作。工艺：多粮颗粒原料、小曲培菌糖化、大曲配醅发酵、泥窖提质、洞穴贮存。',
    food_pairing: '湘西腊肉、剁椒鱼头、血粑鸭', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-wuling', name: '武陵酒（上酱 53°）', brand: '武陵', category: 'baijiu',
    sub_type: '酱香型 · 湘派', origin: '湖南 · 常德', country: '中国', region: 'hunan',
    lat: 29.049, lon: 111.693, abv: 53, price: '¥800–2,000', priceNum: 1200, badges: ['collect'],
    flavor_tags: ['酱香', '焦香', '醇厚', '细腻'],
    description: '1979、1984、1989 届中国名酒，湖南唯一酱香型名酒，与茅台、郎酒并称中国三大酱香（1980 年代专家盲评曾胜过茅台）。',
    food_pairing: '常德钵子菜、酱板鸭', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-yubingchao', name: '石湾玉冰烧（29°）', brand: '石湾', category: 'baijiu',
    sub_type: '豉香型', origin: '广东 · 佛山石湾', country: '中国', region: 'guangdong',
    lat: 23.002, lon: 113.105, abv: 29, price: '¥35–55（500ml）', priceNum: 45, badges: ['veteran', 'value'],
    flavor_tags: ['豉香', '油脂香', '醇和甘冽', '低度'],
    description: '豉香型代表。最特别的工艺叫「陈肉酝浸」——把蒸煮后的肥猪肉浸入米酒中吸附杂质并赋予油脂香，因此俗称「用猪肉泡出来的白酒」。酒度仅 29–38°，是广东烧腊摊的绝配。',
    food_pairing: '烧鹅、叉烧、腊味煲仔饭', serve: { temp: '常温或冰镇', glass: '小玻璃杯' } });

  add({ id: 'c-jiujiang-shuangzheng', name: '九江双蒸（29°）', brand: '九江双蒸', category: 'baijiu',
    sub_type: '豉香型', origin: '广东 · 佛山南海九江', country: '中国', region: 'guangdong',
    lat: 22.967, lon: 113.032, abv: 29, price: '¥15–25（500ml）', priceNum: 20, badges: ['entry', 'value'],
    flavor_tags: ['豉香', '米香', '清雅', '低度顺口'],
    description: '「双蒸」指两次蒸馏提纯，与玉冰烧同为豉香型。整箱十二瓶约 ¥190，合 16 元一瓶，是全国最便宜的名优白酒之一，粤菜大排档的常驻。',
    food_pairing: '白切鸡、蒸鱼、炒河粉', serve: { temp: '常温', glass: '小玻璃杯' } });

  add({ id: 'c-changle-shao', name: '长乐烧（客家米香 52°）', brand: '长乐烧', category: 'baijiu',
    sub_type: '米香型', origin: '广东 · 梅州五华', country: '中国', region: 'guangdong',
    lat: 23.933, lon: 115.777, abv: 52, price: '¥40–90', priceNum: 60, badges: ['value'],
    flavor_tags: ['蜜香', '米香清雅', '落口爽净'],
    description: '广东客家米香型代表（GB/T 10781.3），以大米为原料、小曲半固态发酵，主体香是 β-苯乙醇带来的蜂蜜香。',
    food_pairing: '客家盐焗鸡、酿豆腐', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-sanhua', name: '桂林三花酒（52°）', brand: '桂林三花', category: 'baijiu',
    sub_type: '米香型', origin: '广西 · 桂林', country: '中国', region: 'guangxi',
    lat: 25.274, lon: 110.290, abv: 52, price: '¥25–120', priceNum: 50, badges: ['entry', 'value'],
    flavor_tags: ['蜜香清雅', '入口柔绵', '落口爽净', '米香突出'],
    description: '米香型代表，广西名片。「三花」指酒花（摇酒时产生的泡沫）的粗细与持久度是判断酒度的传统方法。三星约 20–30 元，洞藏系列 200 多元。',
    food_pairing: '桂林米粉、荔浦芋扣肉、啤酒鱼', serve: { temp: '常温或冰镇', glass: '小瓷杯' } });

  add({ id: 'c-danquan', name: '丹泉酒（洞藏 30 年 53°）', brand: '丹泉', category: 'baijiu',
    sub_type: '酱香型 · 桂派', origin: '广西 · 河池南丹', country: '中国', region: 'guangxi',
    lat: 24.988, lon: 107.531, abv: 53, price: '¥600–1,500', priceNum: 900, badges: ['collect'],
    flavor_tags: ['酱香', '醇厚', '洞藏陈香'],
    description: '广西酱香代表，主打「洞天酒海」——在天然溶洞中贮存，洞内恒温恒湿，形成独特的洞藏陈香。',
    food_pairing: '壮乡五色糯米饭、白切鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-yedao-lugui', name: '椰岛鹿龟酒（33°）', brand: '椰岛', category: 'baijiu',
    sub_type: '保健酒 · 配制', origin: '海南 · 海口', country: '中国', region: 'hainan',
    lat: 20.020, lon: 110.322, abv: 33, price: '¥30–80', priceNum: 50, badges: ['entry'],
    flavor_tags: ['草本', '甜润', '药香'],
    description: '海南保健酒代表，以龟板、鹿茸等中药材浸提，主打养生场景，是海南伴手礼常客。',
    food_pairing: '海南鸡饭、文昌鸡', serve: { temp: '常温', glass: '小玻璃杯' } });

  /* ==================== 西南 / 西北 ==================== */
  add({ id: 'c-jiannanchun', name: '剑南春·水晶剑（52°）', brand: '剑南春', category: 'baijiu',
    sub_type: '浓香型 · 川派', origin: '四川 · 德阳绵竹', country: '中国', region: 'sichuan',
    lat: 31.339, lon: 104.203, abv: 52, price: '¥420–560（500ml）', priceNum: 480, badges: ['collect'],
    flavor_tags: ['芳香浓郁', '醇厚', '凛冽', '木陈香', '尾净'],
    description: '「唐时宫廷酒，今日剑南春」——唐代绵竹属剑南道，是贡酒产地。1979、1984、1989 三届中国名酒。水晶剑是 400 元价位段的标杆产品，被酒友称「最良心的名酒定价」。',
    food_pairing: '川菜水煮鱼、麻婆豆腐、夫妻肺片', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-langjiu-honghua', name: '郎酒·红花郎 15（53°）', brand: '郎酒', category: 'baijiu',
    sub_type: '酱香型 · 川派', origin: '四川 · 泸州古蔺二郎镇', country: '中国', region: 'sichuan',
    lat: 28.048, lon: 105.813, abv: 53, price: '¥400–700', priceNum: 520, badges: ['collect'],
    flavor_tags: ['酱香', '焦香', '花果香', '醇厚'],
    description: '1984、1989 届中国名酒。与茅台隔赤水河相望（左岸郎酒、右岸茅台），共享赤水河谷微生物带，是国内第二大酱香产能。青花郎定位「赤水河左岸，庄园酱酒」。',
    food_pairing: '麻辣火锅、古蔺麻辣鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-shede', name: '舍得·品味舍得（52°）', brand: '舍得', category: 'baijiu',
    sub_type: '浓香型 · 川派', origin: '四川 · 遂宁射洪', country: '中国', region: 'sichuan',
    lat: 30.874, lon: 105.383, abv: 52, price: '¥400–650', priceNum: 500, badges: ['collect'],
    flavor_tags: ['陈香', '粮香', '绵柔', '协调'],
    description: '1989 届中国名酒（沱牌曲酒）。「舍得」取自「智慧人生，品味舍得」，拥有 12 万吨老酒储备（行业第一梯队），主打「每一瓶都是老酒」。',
    food_pairing: '川菜、火锅', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-shuijingfang', name: '水井坊·井台（52°）', brand: '水井坊', category: 'baijiu',
    sub_type: '浓香型 · 川派', origin: '四川 · 成都', country: '中国', region: 'sichuan',
    lat: 30.573, lon: 104.066, abv: 52, price: '¥450–700', priceNum: 550, badges: ['collect'],
    flavor_tags: ['窖香', '粮香', '陈香', '绵甜'],
    description: '1998 年在成都水井街发现元明清三代连续使用的酿酒作坊遗址，被称作「中国白酒第一坊」，井台瓶型取自遗址剖面。现为帝亚吉欧控股。',
    food_pairing: '成都串串、回锅肉', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-dongjiu', name: '董酒·国密 G6（54°）', brand: '董酒', category: 'baijiu',
    sub_type: '董香型（药香型）', origin: '贵州 · 遵义董公寺', country: '中国', region: 'guizhou',
    lat: 27.752, lon: 106.956, abv: 54, price: '¥450–900', priceNum: 650, badges: ['veteran'],
    flavor_tags: ['药香', '百草香', '浓郁甘美', '香艳露骚', '回味长'],
    description: '1963、1979、1984、1989 四届中国名酒，董香型唯一代表。制曲加入 130 余味草本（配方为国家机密，工艺与配方三次被列为国家秘密），采用「两小两大、双醅串蒸」——大曲制酒醅、小曲制香醅，串蒸得酒。风格极其强烈，新手常被「吓一跳」。',
    food_pairing: '贵州酸汤鱼、折耳根、烙锅', serve: { temp: '常温', glass: '小瓷杯' } });

  /* 习酒·窖藏 1988 已在 bottles.js 有完整条目（含评分），此处不再重复录入 */

  add({ id: 'c-yunjiu', name: '云南玉林泉（小曲清香 50°）', brand: '玉林泉', category: 'baijiu',
    sub_type: '清香型 · 小曲', origin: '云南 · 玉溪峨山', country: '中国', region: 'yunnan',
    lat: 24.170, lon: 102.408, abv: 50, price: '¥80–250', priceNum: 140, badges: ['value'],
    flavor_tags: ['清香', '甘冽', '粮香', '干净'],
    description: '云南小曲清香代表，采用小曲固态发酵，酒体干净甘冽，是云南本地酒桌的主流。',
    food_pairing: '云南汽锅鸡、野生菌火锅', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-yanglin-feijiu', name: '杨林肥酒（48°）', brand: '杨林肥酒', category: 'baijiu',
    sub_type: '配制酒 · 云南特色', origin: '云南 · 昆明嵩明杨林', country: '中国', region: 'yunnan',
    lat: 25.037, lon: 102.720, abv: 48, price: '¥40–120', priceNum: 70, badges: ['entry'],
    flavor_tags: ['草本香', '青绿', '微甜', '酒体碧绿'],
    description: '始创于 1880 年，云南独有的绿色酒（因加入豌豆、青竹叶、陈皮等植物）。名字里的「肥」指酒体醇厚，有「健身补益」的传统说法。',
    food_pairing: '云南过桥米线、宣威火腿', serve: { temp: '常温', glass: '小玻璃杯' } });

  add({ id: 'c-tianyoude', name: '天佑德青稞酒（海拔 4600 52°）', brand: '天佑德', category: 'baijiu',
    sub_type: '清香型 · 青稞酒', origin: '青海 · 海东互助', country: '中国', region: 'qinghai',
    lat: 36.849, lon: 101.953, abv: 52, price: '¥150–500', priceNum: 260, badges: ['veteran'],
    flavor_tags: ['青稞香', '清雅', '甘冽', '高原粮香'],
    description: '青藏高原特有酒种，以青稞（裸大麦）为原料——世界上海拔最高的谷物之一。互助县是「中国青稞酒之源」，采用「清蒸清烧四次清」工艺。藏族敬酒时先弹酒三下敬天地，再双手献哈达。',
    food_pairing: '手抓羊肉、糌粑、牦牛肉', serve: { temp: '常温', glass: '小瓷杯 / 龙碗' } });

  add({ id: 'c-yilite', name: '伊力特（伊力王 52°）', brand: '伊力特', category: 'baijiu',
    sub_type: '浓香型 · 新疆派', origin: '新疆 · 伊犁新源', country: '中国', region: 'xinjiang',
    lat: 43.924, lon: 81.322, abv: 52, price: '¥120–400', priceNum: 200, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '爽净', '冰川水感'],
    description: '新疆白酒第一品牌，有「新疆茅台」之称。天山冰川融水 + 伊犁河谷高粱小麦，酒体偏清爽干净，与内地浓香风格不同。',
    food_pairing: '大盘鸡、烤羊肉串、手抓饭', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-jinhui', name: '金徽酒（正能量 50°）', brand: '金徽', category: 'baijiu',
    sub_type: '浓香型 · 陇派', origin: '甘肃 · 陇南徽县', country: '中国', region: 'gansu',
    lat: 33.775, lon: 105.752, abv: 50, price: '¥100–400', priceNum: 180, badges: ['value'],
    flavor_tags: ['窖香', '绵甜', '柔顺'],
    description: '甘肃名酒，地处秦岭南麓「陇上江南」，气候湿润适合酿酒，是西北少有的浓香型产区。',
    food_pairing: '兰州牛肉面、手抓羊肉', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-ningxia-hong', name: '宁夏红（枸杞酒 12°）', brand: '宁夏红', category: 'mijiu',
    sub_type: '果酒 · 枸杞配制', origin: '宁夏 · 中卫', country: '中国', region: 'ningxia',
    lat: 37.514, lon: 105.189, abv: 12, price: '¥50–200', priceNum: 100, badges: ['entry'],
    flavor_tags: ['枸杞甜香', '果香', '柔和', '低度'],
    description: '以宁夏中宁枸杞为原料的果酒，红色酒体、甜润易饮，主打健康养生与伴手礼。',
    food_pairing: '宁夏滩羊、八宝茶', serve: { temp: '常温或冰镇', glass: '小玻璃杯' } });

  add({ id: 'c-xizang-qingke', name: '藏缘青稞酒（52°）', brand: '藏缘', category: 'baijiu',
    sub_type: '清香型 · 青稞酒', origin: '西藏 · 拉萨', country: '中国', region: 'xizang',
    lat: 29.652, lon: 91.132, abv: 52, price: '¥80–300', priceNum: 150, badges: ['entry'],
    flavor_tags: ['青稞香', '清雅', '纯净', '高原味'],
    description: '藏族传统酒「羌」（chang），用青稞发酵酿制。习俗上敬酒需双手捧碗、无名指蘸酒弹三下敬天地神灵，客人需「三口一杯」（分三口喝完一杯，每口敬一次）。',
    food_pairing: '糌粑、风干牛肉、藏式血肠', serve: { temp: '常温', glass: '龙碗' } });

  /* ==================== 港澳台 ==================== */
  add({ id: 'c-jinmen-gaoliang', name: '金门高粱酒（58°）', brand: '金门酒厂', category: 'baijiu',
    sub_type: '清香型 · 高粱酒', origin: '中国台湾 · 金门', country: '中国', region: 'taiwan',
    lat: 24.440, lon: 118.340, abv: 58, price: '¥120–350（600ml）', priceNum: 200, badges: ['veteran', 'value'],
    flavor_tags: ['清香', '甘冽', '高粱甜', '落口爽净'],
    description: '中国台湾白酒第一品牌，1952 年建厂。金门的花岗岩层地下水与旱地高粱，加上坑道窖藏，形成「金门香型」（接近清香但更醇厚）。58° 是经典度数，也是调制台湾鸡尾酒的基酒。',
    food_pairing: '台湾卤肉饭、姜母鸭、海鲜', serve: { temp: '常温或冰冻', glass: '小瓷杯' } });

  add({ id: 'c-yushan', name: '玉山台湾高粱酒（52°）', brand: '玉山', category: 'baijiu',
    sub_type: '清香型 · 高粱酒', origin: '中国台湾 · 南投', country: '中国', region: 'taiwan',
    lat: 23.830, lon: 120.690, abv: 52, price: '¥100–300', priceNum: 160, badges: ['value'],
    flavor_tags: ['清香', '柔顺', '甘甜'],
    description: '台湾烟酒公司（原公卖局）出品，与金门高粱并称台湾高粱双雄，风格更柔和。',
    food_pairing: '台式热炒、三杯鸡', serve: { temp: '常温', glass: '小瓷杯' } });

  add({ id: 'c-hong-kong-wugu', name: '香港五谷醇（52°）', brand: '五谷醇', category: 'baijiu',
    sub_type: '浓香型', origin: '中国香港', country: '中国', region: 'hongkong',
    lat: 22.320, lon: 114.170, abv: 52, price: '¥200–500', priceNum: 300, badges: ['entry'],
    flavor_tags: ['窖香', '绵甜'],
    description: '中国香港本地白酒品牌，规模小但有地域代表性，主要供应本地与礼品市场。',
    food_pairing: '港式烧腊、盆菜', serve: { temp: '常温', glass: '小瓷杯' } });

  /* ==================== 全球特色酒（各大洲） ==================== */
  add({ id: 'c-shochu-imobuta', name: '芋烧酎 · 森伊藏（25°）', brand: '森伊藏', category: 'shochu',
    sub_type: '芋烧酎（红薯）', origin: '日本 · 鹿儿岛', country: '日本', region: 'japan_shochu',
    lat: 31.596, lon: 130.557, abv: 25, price: '¥1,500–5,000（720ml）', priceNum: 2500, badges: ['veteran', 'collect'],
    flavor_tags: ['红薯甜香', '醇厚', '陶瓮陈香', '回甘'],
    description: '烧酎（焼酎）是日本九州的代表性蒸馏酒，与清酒（酿造酒）完全不同的品类。芋烧酎以红薯为原料，森伊藏是「芋烧酎之王」，用黄曲 + 常压蒸馏 + 陶瓮（かめ）贮存。注意：烧酎是蒸馏酒，与「白酒」不同（白酒用大曲固态发酵、酒度更高）。',
    food_pairing: '鹿儿岛黑豚、烤鱼、萨摩扬げ', serve: { temp: '加冰 / 兑热水（お湯割り）', glass: '陶杯 / 岩石杯' } });

  add({ id: 'c-shochu-mugiya', name: '麦烧酎 · いいちこ（25°）', brand: 'いいちこ', category: 'shochu',
    sub_type: '麦烧酎（大麦）', origin: '日本 · 大分', country: '日本', region: 'japan_shochu',
    lat: 33.238, lon: 131.612, abv: 25, price: '¥120–250（720ml）', priceNum: 160, badges: ['entry', 'value'],
    flavor_tags: ['麦香', '清爽', '轻盈', '易饮'],
    description: '大分县麦烧酎代表，日本居酒屋最常见的平价烧酎之一。清爽不抢味，是入门烧酎的首选。',
    food_pairing: '日式串烧、刺身、天妇罗', serve: { temp: '加冰 / 兑苏打水（ハイボール）', glass: '玻璃杯' } });

  add({ id: 'c-awamori', name: '泡盛 · 残波黑（30°）', brand: '残波', category: 'shochu',
    sub_type: '泡盛（米曲 · 黑曲菌）', origin: '日本 · 冲绳', country: '日本', region: 'okinawa',
    lat: 26.212, lon: 127.680, abv: 30, price: '¥120–350（720ml）', priceNum: 200, badges: ['veteran'],
    flavor_tags: ['米曲香', '黑曲独特风味', '醇厚', '甘甜'],
    description: '冲绳独有的蒸馏酒，历史早于烧酎（源自 15 世纪琉球王国与南洋的蒸馏技术交流）。用泰国米 + 黑曲菌（アスペルギルス・アワモリ）全米曲发酵，单式蒸馏。陈年三年以上称「古酒（クース）」，是琉球文化的重要符号。',
    food_pairing: '冲绳海葡萄、猪肉料理、苦瓜炒蛋', serve: { temp: '加冰 / 兑水', glass: '陶杯' } });

  add({ id: 'c-soju-jinro', name: '真露 Chamisul Fresh（16.5°）', brand: '真露', category: 'shochu',
    sub_type: '稀释式烧酒', origin: '韩国 · 首尔', country: '韩国', region: 'korea',
    lat: 37.566, lon: 126.978, abv: 16.5, price: '¥15–30（360ml）', priceNum: 20, badges: ['entry', 'value'],
    flavor_tags: ['清爽', '微甜', '低度', '干净'],
    description: '韩国烧酒（소주）是全球销量最高的烈酒品牌之一（真露常年位居全球烈酒销量榜首）。现代稀释式烧酒用木薯/红薯淀粉糖化后蒸馏再稀释，酒度低（16–21°）、口感干净。注意：韩语「소주」虽与中文「烧酒」同形，但与中国白酒、日本烧酎都是不同品类。',
    food_pairing: '韩式烤肉、炸鸡、部队锅', serve: { temp: '冰镇', glass: '小玻璃杯（需双手接长辈倒酒）' } });

  add({ id: 'c-korea-makgeolli', name: '马格利（生浊酒 6°）', brand: '', category: 'mijiu',
    sub_type: '浊酒 · 米发酵', origin: '韩国 · 京畿道', country: '韩国', region: 'korea',
    lat: 37.413, lon: 127.518, abv: 6, price: '¥20–50（750ml）', priceNum: 30, badges: ['entry'],
    flavor_tags: ['米香', '酸甜', '乳白浑浊', '气泡感'],
    description: '韩国最古老的酒（막걸리），米+酒曲（누룩）发酵后不过滤，乳白色、微带气泡，酸甜清爽。喝前需轻轻摇匀，传统上配葱饼（파전），雨天吃饼喝酒是韩国人的固定节目。',
    food_pairing: '海鲜葱饼、泡菜饼、炖排骨', serve: { temp: '冰镇', glass: '大碗 / 马格利碗' } });

  add({ id: 'c-mongolia-airag', name: 'Airag（蒙古马奶酒）', brand: '', category: 'mijiu',
    sub_type: '发酵乳酒', origin: '蒙古 · 乌兰巴托', country: '蒙古', region: 'mongolia',
    lat: 47.886, lon: 106.905, abv: 3, price: '¥20–60（1L）', priceNum: 35, badges: ['entry'],
    flavor_tags: ['酸甜', '乳香', '微气泡', '清凉'],
    description: '蒙古国国饮「айраг」，与中国内蒙古的策格同源——鲜马奶经乳酸菌与酵母共生发酵。夏季草原上家家酿制，那达慕大会必备。因含 CO₂ 与乳酸，喝起来像气泡酸奶，但后劲不小。',
    food_pairing: '石头烤羊、蒙古包子（бууз）', serve: { temp: '冰凉', glass: '木碗' } });

  add({ id: 'c-pisco-peru', name: 'Pisco（秘鲁皮斯科 ·  Quebranta）', brand: '', category: 'spirit',
    sub_type: '皮斯科（葡萄蒸馏酒）', origin: '秘鲁 · 伊卡', country: '秘鲁', region: 'peru',
    lat: -14.067, lon: -75.729, abv: 40, price: '¥120–350（750ml）', priceNum: 200, badges: ['veteran'],
    flavor_tags: ['葡萄香', '花香', '果干', '无木桶陈'],
    description: '南美标志性蒸馏酒，由葡萄发酵后单次蒸馏而成，法律规定不得加水稀释、不得在木桶中陈年（保持葡萄原香）。秘鲁与智利为原产地命名权长期争议。国饮 Pisco Sour 用皮斯科+青柠+糖浆+蛋白+安格斯图拉苦精调制。',
    food_pairing: '秘鲁生鱼（ceviche）、烤豚鼠、玉米', serve: { temp: '冰镇纯饮或调 Pisco Sour', glass: '郁金香杯 / 宽口杯' } });

  add({ id: 'c-mezcal-oaxaca', name: 'Mezcal（瓦哈卡 · Espadín）', brand: '', category: 'spirit',
    sub_type: '梅斯卡尔（烟熏龙舌兰）', origin: '墨西哥 · 瓦哈卡', country: '墨西哥', region: 'mexico_oaxaca',
    lat: 17.065, lon: -96.723, abv: 45, price: '¥250–800（750ml）', priceNum: 400, badges: ['veteran', 'collect'],
    flavor_tags: ['烟熏', '泥土', '龙舌兰草本', '矿物感', '柑橘'],
    description: '龙舌兰酒的「祖师爷」。与 Tequila 的区别：Mezcal 可用任何品种龙舌兰（Tequila 法定只能用蓝色韦伯），且必须在石砌土坑中用柴火烘烤龙心（piña），因而带强烈烟熏味。传统喝法是配橙片和蠕虫盐（sal de gusano），小口啜饮（a sorbos）。',
    food_pairing: '墨西哥玉米卷、烤肉（barbacoa）、鳄梨酱', serve: { temp: '常温纯饮，不冰不shot', glass: '小陶杯（copita）' } });

  add({ id: 'c-tequila-jalisco', name: 'Tequila（Jalisco · Blanco 100% Agave）', brand: '', category: 'spirit',
    sub_type: '龙舌兰酒', origin: '墨西哥 · 哈利斯科', country: '墨西哥', region: 'mexico_jalisco',
    lat: 20.560, lon: -103.460, abv: 40, price: '¥150–600（750ml）', priceNum: 280, badges: ['entry'],
    flavor_tags: ['龙舌兰清甜', '柑橘', '胡椒', '矿物'],
    description: '只有在 Jalisco 等 5 个法定州、用蓝色韦伯龙舌兰（需 6–8 年成熟）酿造才能叫 Tequila。关键分水岭是瓶身是否标「100% Agave」——未标者为 Mixto（允许添加 49% 其他糖源）。Blanco（未陈）最能喝出龙舌兰本味，Reposado（2–12 月桶陈）更圆润。',
    food_pairing: '塔可、烤玉米、酸橘汁腌鱼、辣味牛肉', serve: { temp: '纯饮 16–18℃；Margarita 冰镇', glass: '郁金香闻香杯 / 玛格丽特杯' } });

  add({ id: 'c-cachaca', name: 'Cachaça（巴西甘蔗酒 · 陈年）', brand: '', category: 'spirit',
    sub_type: '甘蔗蒸馏酒', origin: '巴西 · 里约热内卢', country: '巴西', region: 'brazil',
    lat: -22.907, lon: -43.173, abv: 40, price: '¥80–400（700ml）', priceNum: 180, badges: ['entry', 'value'],
    flavor_tags: ['甘蔗甜', '青草', '花香', '微酸'],
    description: '巴西国酒，用新鲜甘蔗汁（而非糖蜜）直接发酵蒸馏，年产量超 10 亿升。全世界几乎只为一杯鸡尾酒而存在：Caipirinha（卡莎萨+青柠+糖+碎冰）。注意别和「朗姆」混淆——朗姆用糖蜜，卡莎萨用鲜榨甘蔗汁。',
    food_pairing: '巴西烤肉（churrasco）、黑豆饭（feijoada）', serve: { temp: '调 Caipirinha 需大量碎冰', glass: '古典杯' } });

  add({ id: 'c-rum-cuba', name: 'Ron Cubano（古巴白朗姆）', brand: 'Havana Club', category: 'spirit',
    sub_type: '朗姆（糖蜜 · 西班牙式）', origin: '古巴 · 哈瓦那', country: '古巴', region: 'cuba',
    lat: 23.114, lon: -82.367, abv: 40, price: '¥90–250（750ml）', priceNum: 150, badges: ['entry', 'value'],
    flavor_tags: ['甘蔗甜', '轻盈', '香草', '热带水果'],
    description: '西班牙式（Ron）朗姆风格：以糖蜜为原料、柱式连续蒸馏，酒体轻盈干净，是 Mojito、Daiquiri 的正统基酒。古巴是朗姆的心脏，海明威在哈瓦那 La Bodeguita 喝 Mojito 的故事让它成为传奇。',
    food_pairing: '烤猪肉、黑豆饭、炸香蕉', serve: { temp: 'Mojito / Daiquiri 冰镇', glass: '高球杯 / 蝶形杯' } });

  add({ id: 'c-rum-jamaica', name: 'Jamaican Rum（牙买加 · 高酯黑朗姆）', brand: '', category: 'spirit',
    sub_type: '朗姆（高酯 · 英式 Navy）', origin: '牙买加 · 金斯敦', country: '牙买加', region: 'jamaica',
    lat: 17.971, lon: -76.793, abv: 63, price: '¥250–700', priceNum: 400, badges: ['veteran'],
    flavor_tags: ['香蕉', '菠萝', '酯香爆炸', '厚重', 'funk'],
    description: '牙买加是高酯朗姆（high-ester）的圣地，靠野生酵母长时间发酵产生大量酯类，风味炸裂（行业黑话叫「funk」，甚至用 ppm 计量酯含量）。壶式蒸馏 + 热带陈年，是 Mai Tai 等 Tiki 鸡尾酒的灵魂，也是 Navy Rum 传统的源头。',
    food_pairing: '牙买加烤鸡（jerk chicken）、炸芭蕉', serve: { temp: '少量加水释放酯香，或调 Tiki', glass: '闻香杯 / Tiki 杯' } });

  add({ id: 'c-vodka-russia', name: 'Russian Vodka（俄罗斯标准版）', brand: '', category: 'spirit',
    sub_type: '伏特加（谷物）', origin: '俄罗斯 · 莫斯科', country: '俄罗斯', region: 'russia',
    lat: 55.755, lon: 37.618, abv: 40, price: '¥80–300（700ml）', priceNum: 150, badges: ['entry'],
    flavor_tags: ['纯净', '微甜', '面包香', '顺滑'],
    description: '伏特加（водка，意为「小水」）追求极致纯净：多次蒸馏 + 白桦活性炭过滤，理论上「无味」。俄式喝法是 -18℃ 冰镇、一口闷（залпом），配腌黄瓜、鲱鱼、黑面包。波兰与俄罗斯为伏特加起源地争论不休，两国都主张自己最早（8–9 世纪）。',
    food_pairing: '腌鱼、鱼子酱、腌蘑菇、萨洛（生腌肥膘）', serve: { temp: '冷冻 -18℃', glass: '50ml 小杯一口闷' } });

  add({ id: 'c-vodka-poland', name: 'Polish Vodka（波兰 · 黑麦土豆）', brand: '', category: 'spirit',
    sub_type: '伏特加（黑麦/土豆）', origin: '波兰 · 华沙', country: '波兰', region: 'poland',
    lat: 52.230, lon: 21.012, abv: 40, price: '¥120–400', priceNum: 200, badges: ['value'],
    flavor_tags: ['黑麦面包', '奶油感', '矿物', '微甜'],
    description: '波兰人坚持伏特加以黑麦或土豆为原料（法律上波兰伏特加只能用谷物或土豆），因此比中性伏特加更有质感——黑麦带来面包香，土豆带来奶油感。Zubrowka 加入野牛草，是波兰的国民风味。',
    food_pairing: '波兰饺子（pierogi）、腌菜、熏肠', serve: { temp: '冰镇', glass: '小杯' } });

  add({ id: 'c-aquavit', name: 'Aquavit（挪威 · 船运版）', brand: '', category: 'spirit',
    sub_type: '阿夸维特（葛缕子调味）', origin: '挪威 · 奥斯陆', country: '挪威', region: 'norway',
    lat: 59.914, lon: 10.752, abv: 40, price: '¥200–600（700ml）', priceNum: 350, badges: ['veteran'],
    flavor_tags: ['葛缕子', '莳萝', '柑橘皮', '香料', '咸鲜'],
    description: '北欧五国的共同烈酒（挪威 akevitt / 瑞典 akvavit / 丹麦 akvavit）。以谷物或土豆蒸馏，用葛缕子（caraway）、莳萝、茴香、柑橘皮调味。挪威 Linie Aquavit 有独特传统：酒桶随船跨越赤道往返澳大利亚，海运与温差加速陈化——瓶身会写船名与航次。',
    food_pairing: '腌三文鱼（gravlax）、鲱鱼、圣诞火腿、奶酪', serve: { temp: '冰镇纯饮（snaps）', glass: '细长小杯，配酒歌' } });

  add({ id: 'c-ouzo', name: 'Ouzo（希腊茴香酒）', brand: '', category: 'spirit',
    sub_type: '茴香烈酒', origin: '希腊 · 莱斯沃斯', country: '希腊', region: 'greece',
    lat: 39.101, lon: 26.555, abv: 40, price: '¥100–300（700ml）', priceNum: 180, badges: ['entry'],
    flavor_tags: ['茴香', '甘草', '清甜', '加水变乳白'],
    description: '希腊国酒，葡萄蒸馏酒 + 茴芹/八角/芫荽等香料二次蒸馏。著名现象叫「ouzo effect」：加水后酒液由透明变成乳白色（精油析出乳化）。希腊人配海鲜小菜（meze）在海边慢慢啜饮，从不上头式豪饮。',
    food_pairing: '烤章鱼、炸小鱼、希腊沙拉、羊奶酪', serve: { temp: '加水加冰，慢慢变乳白', glass: '细高杯' } });

  add({ id: 'c-raki', name: 'Rakı（土耳其狮子奶）', brand: 'Yeni Rakı', category: 'spirit',
    sub_type: '茴香烈酒', origin: '土耳其 · 伊斯坦布尔', country: '土耳其', region: 'turkey',
    lat: 41.008, lon: 28.979, abv: 45, price: '¥150–400（700ml）', priceNum: 250, badges: ['veteran'],
    flavor_tags: ['茴香', '葡萄', '强劲', '加水变白'],
    description: '土耳其国酒「aslan sütü（狮子奶）」——因加水后变乳白色得名，喝的人要像狮子一样勇猛。以葡萄渣蒸馏酒（suma）为基，加茴芹二次蒸馏。传统配法是 Rakı + 冰水 + 一串烤鱼（balık）或白奶酪哈密瓜，配 meze 小菜从黄昏喝到深夜。',
    food_pairing: '烤鲈鱼、白奶酪、哈密瓜、meze 拼盘', serve: { temp: '先倒酒后加水加冰', glass: '细长玻璃杯' } });

  add({ id: 'c-arak', name: 'Arak（黎凡特茴香酒）', brand: '', category: 'spirit',
    sub_type: '茴香烈酒', origin: '黎巴嫩 · 贝卡谷地', country: '黎巴嫩', region: 'lebanon',
    lat: 33.888, lon: 35.495, abv: 53, price: '¥150–400（750ml）', priceNum: 250, badges: ['veteran'],
    flavor_tags: ['茴香', '葡萄', '强劲', '甘草'],
    description: '黎凡特地区（黎巴嫩、叙利亚、以色列、约旦）的传统茴香酒，与 Ouzo/Rakı 同源。以葡萄发酵蒸馏后加茴芹三次蒸馏，酒度高（50–63°），必须加水稀释后饮用。是阿拉伯 meze 餐桌的标配。',
    food_pairing: '鹰嘴豆泥、烤肉串、塔布勒沙拉、葡萄叶包', serve: { temp: '1:1 加水加冰', glass: '小玻璃杯' } });

  add({ id: 'c-amrut-india', name: 'Amrut Fusion（印度单一麦芽）', brand: 'Amrut', category: 'whisky',
    sub_type: '单一麦芽 · 印度', origin: '印度 · 班加罗尔', country: '印度', region: 'india',
    lat: 12.972, lon: 77.595, abv: 50, price: '¥350–600（700ml）', priceNum: 450, badges: ['veteran'],
    flavor_tags: ['热带水果', '泥煤', '香料', '厚重'],
    description: '印度威士忌的里程碑——2004 年 Amrut 推出首款印度单一麦芽，2010 年 Jim Murray 给 Fusion 打出 97 分（Whisky Bible 年度第三），让世界开始正视印度威士忌。印度因高温陈年，天使分享高达 10–12%/年（苏格兰约 2%），酒体成熟极快。',
    food_pairing: '印度咖喱、坦都里烤肉、香料小食', serve: { temp: '常温，可加几滴水', glass: '闻香杯' } });

  add({ id: 'c-tej-ethiopia', name: 'Tej（埃塞俄比亚蜂蜜酒）', brand: '', category: 'mijiu',
    sub_type: '蜂蜜酒（mead）', origin: '埃塞俄比亚 · 亚的斯亚贝巴', country: '埃塞俄比亚', region: 'ethiopia',
    lat: 9.032, lon: 38.747, abv: 11, price: '¥30–80（1L）', priceNum: 50, badges: ['entry'],
    flavor_tags: ['蜂蜜甜', 'gesho 苦味', '微酸', '黄浊'],
    description: '埃塞俄比亚千年传统蜂蜜酒，用蜂蜜 + 水 + gesho（沙棘属植物的枝叶，提供苦味与发酵动力）自然发酵。招待贵客时倒酒者会站在左侧、右手持瓶连续倒入细颈瓶（berele），一气呵成不断流——这是待客的最高礼节。',
    food_pairing: '英吉拉（injera）、生牛肉（kitfo）、炖菜', serve: { temp: '常温', glass: '细颈瓶 berele' } });

  add({ id: 'c-lambanog', name: 'Lambanog（菲律宾椰子酒）', brand: '', category: 'spirit',
    sub_type: '椰子花汁蒸馏酒', origin: '菲律宾 · 吕宋岛奎松', country: '菲律宾', region: 'philippines',
    lat: 14.600, lon: 120.984, abv: 40, price: '¥50–150（750ml）', priceNum: 90, badges: ['entry', 'value'],
    flavor_tags: ['椰子', '甜香', '青草', '纯净'],
    description: '菲律宾「椰子伏特加」，采集未开的椰子花序（tuba）汁液发酵后蒸馏。酒体带天然椰子甜香，是吕宋岛农村的传统烈酒，近年开始商业化并出口。',
    food_pairing: '烤乳猪（lechon）、酸汤（sinigang）', serve: { temp: '冰镇纯饮或调鸡尾酒', glass: '小杯' } });

  add({ id: 'c-bundaberg-aus', name: 'Bundaberg（澳洲朗姆）', brand: 'Bundaberg', category: 'spirit',
    sub_type: '朗姆', origin: '澳大利亚 · 昆士兰班德堡', country: '澳大利亚', region: 'australia',
    lat: -24.850, lon: 152.350, abv: 37, price: '¥120–300（700ml）', priceNum: 180, badges: ['value'],
    flavor_tags: ['甘蔗甜', '焦糖', '香草', '顺口'],
    description: '澳洲国民朗姆，昆士兰甘蔗产区出品，标志性的 polar bear 商标。澳洲朗姆以「Bundy and Coke」（朗姆+可乐+青柠）的喝法闻名全国。',
    food_pairing: '澳式烧烤、肉派', serve: { temp: '加可乐青柠', glass: '高球杯' } });

  add({ id: 'c-canadian-whisky', name: 'Canadian Whisky（加拿大黑麦）', brand: '', category: 'whisky',
    sub_type: '黑麦威士忌', origin: '加拿大 · 多伦多', country: '加拿大', region: 'canada',
    lat: 43.653, lon: -79.383, abv: 40, price: '¥150–400', priceNum: 250, badges: ['entry'],
    flavor_tags: ['黑麦香料', '柔和', '香草', '轻盈'],
    description: '加拿大法律允许添加最多 9.09% 的调味酒（如陈年葡萄酒），加上高比例黑麦，形成轻盈柔和的特色。有趣的是：加拿大法规里「rye whisky」和「Canadian whisky」常常互换使用，即使黑麦占比不高。',
    food_pairing: '熏肉、枫糖料理、普丁（poutine）', serve: { temp: '常温或加冰', glass: '古典杯' } });

  add({ id: 'c-fernet', name: 'Fernet-Branca（意大利苦味酒）', brand: 'Fernet-Branca', category: 'spirit',
    sub_type: '苦味利口酒（amaro）', origin: '意大利 · 米兰', country: '意大利', region: 'italy',
    lat: 45.464, lon: 9.190, abv: 39, price: '¥120–280（750ml）', priceNum: 180, badges: ['veteran'],
    flavor_tags: ['极苦', '薄荷', '草药', '樟脑', '回甘'],
    description: '意大利苦味酒之王，1845 年配方至今保密，含 27 种草药（芦荟、大黄、龙胆、薄荷等）。以葡萄酒为基酒，是「bartender\'s handshake」——全世界调酒师下班后互敬的一杯。阿根廷人把它兑可乐喝（Fernet con Cola），年消费量占全球 75% 以上。',
    food_pairing: '餐后纯饮助消化，或兑可乐', serve: { temp: '常温或加冰', glass: '小杯 / 高球杯' } });

  add({ id: 'c-gin-london', name: 'London Dry Gin（伦敦干金）', brand: '', category: 'spirit',
    sub_type: '金酒', origin: '英国 · 伦敦', country: '英国', region: 'uk_london',
    lat: 51.507, lon: -0.128, abv: 43, price: '¥100–400（700ml）', priceNum: 180, badges: ['entry'],
    flavor_tags: ['杜松子', '柑橘皮', '芫荽', '鸢尾根', '松木'],
    description: '金酒（Gin）的法定定义：以中性酒精为基、必须以杜松子（juniper）为主要风味、酒度不低于 37.5%。「London Dry」不是产地而是工艺——需在蒸馏中（而非之后）加入香料、不得添加糖。Gin & Tonic 的诞生源于 19 世纪印度疟疾防治：驻印英军把抗疟药奎宁（tonic water）加金酒改善口感。',
    food_pairing: '烟熏三文鱼、腌黄瓜、奶酪拼盘', serve: { temp: 'G&T 需大量冰块 + 柠檬/黄瓜', glass: '高球杯 / 蝶形杯' } });

  add({ id: 'c-genever', name: 'Genever（荷兰金酒 · 前身）', brand: '', category: 'spirit',
    sub_type: '荷兰金酒', origin: '荷兰 · 阿姆斯特丹', country: '荷兰', region: 'netherlands',
    lat: 52.367, lon: 4.904, abv: 35, price: '¥150–500（700ml）', priceNum: 250, badges: ['veteran'],
    flavor_tags: ['麦芽酒香', '杜松子', '谷物甜', '厚重'],
    description: '金酒的祖先（金酒由荷兰 genever 演化而来，17 世纪经英国士兵带回并改名 gin）。与 London Dry 的区别：genever 用麦芽酒（malt wine）为基，酒体带谷物甜香、酒度更低，口感介于威士忌与金酒之间。荷兰人的传统喝法是「kopstootje」——一口冰 genever 配一杯啤酒。',
    food_pairing: '荷兰生鲱鱼、炸鱼、奶酪', serve: { temp: '冰镇纯饮', glass: '小郁金香杯' } });

  add({ id: 'c-belgian-lambic', name: 'Lambic（比利时自然发酵啤酒）', brand: '', category: 'beer',
    sub_type: '自然发酵艾尔', origin: '比利时 · 布鲁塞尔', country: '比利时', region: 'belgium',
    lat: 50.850, lon: 4.352, abv: 6, price: '¥60–200（375ml）', priceNum: 110, badges: ['veteran'],
    flavor_tags: ['酸', '野菌味', '干爽', '谷仓', '柠檬'],
    description: '全世界唯一靠野生酵母自然接种的啤酒。在布鲁塞尔 Senne 河谷，麦汁露天冷却接种空气中的酒香酵母（Brettanomyces），在橡木桶中陈年 1–3 年。Gueuze 是无年份调和版，Kriek 是樱桃版。兰比克更像葡萄酒而非啤酒。',
    food_pairing: '青口贝、奶酪（尤其是蓝纹）、酸菜', serve: { temp: '8–12℃', glass: '笛型杯 / 高脚杯' } });

  add({ id: 'c-czech-pilsner', name: 'Czech Pilsner（捷克皮尔森）', brand: '', category: 'beer',
    sub_type: '皮尔森（底层发酵）', origin: '捷克 · 皮尔森', country: '捷克', region: 'czech',
    lat: 49.747, lon: 13.378, abv: 5, price: '¥15–40（500ml）', priceNum: 25, badges: ['entry', 'value'],
    flavor_tags: ['麦芽甜', '萨兹酒花', '清爽', '苦度中等'],
    description: '1842 年皮尔森市民啤酒厂（Pilsner Urquell）诞生了世界上第一款金色透明啤酒，从此定义了「皮尔森」这个占全球啤酒产量 90% 的品类。捷克人均啤酒消费量连续 30 年世界第一（约 190L/人/年）。',
    food_pairing: '捷克烤猪肘（vepřo knedlo zelo）、炸奶酪', serve: { temp: '6–8℃', glass: '带把厚壁杯／扎啤杯' } });

  SA.BOTTLES_CN = B;
  SA.BOTTLES = (SA.BOTTLES || []).concat(B);
})(window.SA = window.SA || {});
