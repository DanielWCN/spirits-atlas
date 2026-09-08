/* =============================================================
 * geo.js — 地理编码模块
 * 产区 / 国家 / 城市 → 经纬度。数据来自公开地理常识（API 普遍不带坐标，
 * 本模块负责把「产区名」解析成地球上的可落点坐标），失败时回落到国家质心。
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  /* ---------------- 国家质心 ---------------- */
  var COUNTRY = {
    'france': [46.6, 2.2], 'italy': [42.8, 12.6], 'spain': [40.2, -3.6], 'portugal': [39.6, -8.0],
    'germany': [51.1, 10.4], 'austria': [47.6, 14.1], 'hungary': [47.2, 19.4], 'greece': [39.0, 22.0],
    'united states': [39.5, -98.35], 'usa': [39.5, -98.35], 'united states of america': [39.5, -98.35],
    'canada': [56.1, -106.3], 'mexico': [23.6, -102.5], 'argentina': [-35.4, -65.2], 'chile': [-35.7, -71.5],
    'brazil': [-10.3, -53.2], 'uruguay': [-32.8, -56.0], 'peru': [-9.2, -75.0],
    'australia': [-25.7, 134.5], 'new zealand': [-41.8, 174.2], 'south africa': [-29.0, 24.0],
    'united kingdom': [54.0, -2.0], 'england': [52.6, -1.5], 'scotland': [56.8, -4.2], 'wales': [52.3, -3.7],
    'ireland': [53.2, -7.7], 'northern ireland': [54.6, -6.7],
    'japan': [36.2, 138.3], 'china': [35.0, 104.0], 'south korea': [36.5, 127.9], 'korea': [36.5, 127.9],
    'taiwan': [23.8, 120.9], 'hong kong': [22.32, 114.17], 'singapore': [1.35, 103.82],
    'india': [22.0, 79.0], 'thailand': [15.0, 100.9], 'vietnam': [16.0, 106.0], 'indonesia': [-2.5, 118.0],
    'belgium': [50.6, 4.6], 'netherlands': [52.2, 5.5], 'luxembourg': [49.7, 6.1], 'switzerland': [46.8, 8.2],
    'denmark': [56.1, 9.5], 'sweden': [62.0, 15.0], 'norway': [61.0, 9.0], 'finland': [64.0, 26.0],
    'iceland': [65.0, -18.6], 'poland': [52.1, 19.4], 'czechia': [49.8, 15.4], 'czech republic': [49.8, 15.4],
    'slovakia': [48.7, 19.7], 'slovenia': [46.1, 14.9], 'croatia': [45.1, 16.4], 'romania': [45.9, 25.0],
    'bulgaria': [42.7, 25.5], 'moldova': [47.2, 28.5], 'ukraine': [48.4, 31.2], 'georgia': [42.2, 43.4],
    'turkey': [39.0, 35.2], 'israel': [31.5, 34.9], 'lebanon': [33.9, 35.9], 'morocco': [31.8, -7.1],
    'egypt': [26.8, 30.8], 'tunisia': [34.1, 9.6], 'algeria': [28.0, 1.7],
    'russia': [57.0, 60.0], 'cuba': [21.6, -79.0], 'jamaica': [18.1, -77.3], 'puerto rico': [18.2, -66.4],
    'trinidad and tobago': [10.4, -61.2], 'barbados': [13.2, -59.5], 'martinique': [14.6, -61.0],
    'bahamas': [25.0, -77.4], 'bermuda': [32.3, -64.7], 'dominican republic': [18.9, -70.5],
    'austria ': [47.6, 14.1], 'luxembourg ': [49.7, 6.1], 'greece ': [39.0, 22.0],
    'bosnia and herzegovina': [43.9, 17.7], 'serbia': [44.0, 21.0], 'montenegro': [42.7, 19.3],
    'north macedonia': [41.6, 21.7], 'albania': [41.1, 20.0], 'cyprus': [35.1, 33.4], 'malta': [35.9, 14.4]
  };

  /* ---------------- 产区 / 城市坐标（含葡萄酒、威士忌、鸡尾酒、啤酒名城） ---------------- */
  var REGION = {
    /* --- 法国 --- */
    'bordeaux': [44.84, -0.58], 'medoc': [45.13, -0.75], 'saint-emilion': [44.89, -0.15],
    'pomerol': [44.93, -0.20], 'sauternes': [44.53, -0.33], 'graves': [44.70, -0.55],
    'burgundy': [47.05, 4.83], 'bourgogne': [47.05, 4.83], 'chablis': [47.81, 3.80],
    'cote de nuits': [47.18, 4.95], 'cote de beaune': [47.02, 4.75], 'maconnais': [46.45, 4.75],
    'beaujolais': [46.10, 4.65], 'champagne': [49.05, 4.00], 'epernay': [49.04, 3.96], 'reims': [49.26, 4.03],
    'rhone': [44.90, 4.90], 'cotes du rhone': [44.85, 4.80], 'chateauneuf du pape': [44.06, 4.83],
    'hermitage': [45.09, 4.83], 'cote rotie': [45.49, 4.81], 'loire': [47.30, 0.50],
    'sancerre': [47.33, 2.84], 'pouilly fume': [47.28, 2.96], 'vouvray': [47.40, 0.80],
    'muscadet': [47.20, -1.55], 'alsace': [48.30, 7.40], 'provence': [43.60, 5.90],
    'languedoc': [43.40, 3.20], 'roussillon': [42.70, 2.90], 'cahors': [44.45, 1.44],
    'madiran': [43.55, 0.05], 'jura': [46.80, 5.60], 'savoie': [45.60, 6.00],
    'cognac': [45.70, -0.33], 'armagnac': [43.90, 0.10], 'montrachet': [46.94, 4.74],

    /* --- 意大利 --- */
    'tuscany': [43.50, 11.20], 'toscana': [43.50, 11.20], 'chianti': [43.50, 11.30],
    'montalcino': [43.06, 11.49], 'brunello': [43.06, 11.49], 'montepulciano': [43.09, 11.78],
    'bolgheri': [43.23, 10.62], 'piedmont': [44.70, 7.90], 'piemonte': [44.70, 7.90],
    'barolo': [44.61, 7.94], 'barbaresco': [44.72, 8.08], 'asti': [44.90, 8.20],
    'veneto': [45.50, 11.30], 'valpolicella': [45.55, 10.90], 'amarone': [45.55, 10.90],
    'soave': [45.42, 11.24], 'prosecco': [45.85, 12.20], 'franciacorta': [45.63, 10.02],
    'sicily': [37.60, 14.00], 'sicilia': [37.60, 14.00], 'etna': [37.75, 15.00],
    'puglia': [40.90, 16.50], 'abruzzo': [42.20, 13.70], 'campania': [40.90, 14.80],
    'umbria': [43.10, 12.40], 'marche': [43.40, 13.20], 'lazio': [41.90, 12.70],
    'friuli': [46.00, 13.20], 'alto adige': [46.50, 11.30], 'trentino': [46.10, 11.10],
    'lombardy': [45.40, 9.80], 'emilia romagna': [44.60, 11.00], 'sardinia': [40.00, 9.00],
    'liguria': [44.30, 8.60], 'basilicata': [40.50, 16.00], 'calabria': [39.30, 16.50],

    /* --- 西班牙 / 葡萄牙 --- */
    'rioja': [42.40, -2.50], 'ribera del duero': [41.60, -3.70], 'priorat': [41.20, 0.90],
    'rias baixas': [42.50, -8.80], 'ribeira sacra': [42.40, -7.60], 'bierzo': [42.65, -6.60],
    'toro': [41.52, -5.40], 'rueda': [41.40, -4.95], 'navarra': [42.50, -1.70],
    'penedes': [41.40, 1.70], 'cava': [41.40, 1.70], 'emporda': [42.26, 3.02],
    'la mancha': [39.20, -3.00], 'valdepenas': [38.76, -3.39], 'jerez': [36.68, -6.14],
    'sherry': [36.68, -6.14], 'sanlucar de barrameda': [36.78, -6.35], 'montilla moriles': [37.42, -4.63],
    'malaga': [36.72, -4.42], 'douro': [41.20, -7.50], 'porto': [41.15, -8.60], 'port ': [41.15, -8.60],
    'vintage port': [41.15, -8.60], 'tawny port': [41.15, -8.60], 'ruby port': [41.15, -8.60],
    'late bottled vintage': [41.15, -8.60], 'vinho verde': [41.80, -8.30], 'alentejo': [38.50, -7.90],
    'dao': [40.60, -7.80], 'bairrada': [40.30, -8.50], 'madeira': [32.66, -16.92],
    'setubal': [38.52, -8.89], 'colares': [38.79, -9.45],

    /* --- 德国 / 奥地利 / 匈牙利 --- */
    'mosel': [49.90, 7.10], 'mosel saar ruwer': [49.90, 7.10], 'rheingau': [50.00, 8.00],
    'rheinhessen': [49.80, 8.20], 'pfalz': [49.30, 8.10], 'baden': [48.40, 7.90],
    'nahe': [49.80, 7.70], 'franken': [49.80, 10.00], 'wurttemberg': [48.80, 9.20], 'ahr': [50.55, 7.10],
    'wachau': [48.40, 15.40], 'kamptal': [48.50, 15.60], 'burgenland': [47.90, 16.50],
    'styria': [46.90, 15.60], 'steiermark': [46.90, 15.60], 'vienna': [48.21, 16.37], 'wien': [48.21, 16.37],
    'tokaj': [48.12, 21.40], 'tokaji': [48.12, 21.40], 'eger': [47.90, 20.37], 'villany': [45.87, 18.45],
    'szekszard': [46.35, 18.70], 'somló': [47.15, 17.35], 'somlo': [47.15, 17.35],

    /* --- 新世界 --- */
    'napa valley': [38.50, -122.40], 'napa': [38.50, -122.40], 'sonoma': [38.50, -122.80],
    'russian river valley': [38.47, -122.98], 'carneros': [38.25, -122.35], 'mendocino': [39.30, -123.40],
    'paso robles': [35.60, -120.70], 'santa barbara': [34.60, -119.80], 'santa maria valley': [34.90, -120.30],
    'willamette valley': [45.20, -123.20], 'oregon': [44.00, -120.50], 'washington': [47.00, -120.00],
    'columbia valley': [46.20, -119.50], 'walla walla': [46.06, -118.34], 'finger lakes': [42.70, -76.90],
    'texas hill country': [30.30, -98.60], 'central coast': [35.60, -120.60], 'lodi': [38.13, -121.27],
    'amador': [38.45, -120.80], 'okanagan': [49.50, -119.60], 'niagara': [43.20, -79.20],
    'mendoza': [-33.00, -68.80], 'salta': [-24.80, -65.40], 'patagonia': [-40.50, -64.50],
    'san juan': [-31.50, -68.50], 'la rioja': [-29.40, -66.90], 'uco valley': [-33.60, -69.20],
    'maipo': [-33.60, -70.60], 'casablanca valley': [-33.30, -71.40], 'colchagua': [-34.60, -71.00],
    'maule': [-35.50, -71.60], 'aconcagua': [-32.90, -70.60], 'rapel': [-34.20, -71.00],
    'curico': [-34.98, -71.24], 'central valley': [-34.50, -71.20], 'limari': [-30.60, -71.30],
    'marlborough': [-41.50, 173.90], 'central otago': [-45.00, 169.20], "hawke's bay": [-39.60, 176.80],
    'martinborough': [-41.20, 175.40], 'wairarapa': [-41.20, 175.40], 'gisborne': [-38.66, 178.02],
    'nelson': [-41.27, 173.28], 'barossa': [-34.50, 138.90], 'barossa valley': [-34.50, 138.90],
    'mclaren vale': [-35.20, 138.50], 'clare valley': [-33.80, 138.60], 'coonawarra': [-37.30, 140.80],
    'margaret river': [-33.95, 115.07], 'hunter valley': [-32.60, 151.20], 'yarra valley': [-37.70, 145.50],
    'mornington peninsula': [-38.30, 145.00], 'tasmania': [-42.00, 147.00], 'rutherglen': [-36.05, 146.46],
    'adelaide hills': [-34.95, 138.75], 'eden valley': [-34.65, 139.10], 'heathcote': [-36.80, 144.70],
    'stellenbosch': [-33.93, 18.86], 'paarl': [-33.72, 18.96], 'swartland': [-33.28, 18.50],
    'franschhoek': [-33.91, 19.10], 'constantia': [-34.03, 18.41], 'walker bay': [-34.40, 19.30],
    'elgin': [-34.15, 19.05], 'hemel en aarde': [-34.38, 19.20],
    'bekaa valley': [33.80, 35.90], 'kakheti': [41.70, 45.70], 'napa valley ': [38.50, -122.40],
    'ningxia': [38.50, 106.20], 'shandong': [37.80, 120.80], 'hebei': [40.40, 115.50],
    'xinjiang': [43.80, 87.60], 'yunnan': [27.80, 99.70], 'gansu': [38.00, 102.60],

    /* --- 威士忌产区 --- */
    'islay': [55.78, -6.19], 'port ellen': [55.63, -6.19], 'speyside': [57.45, -3.20],
    'highland': [57.50, -4.50], 'lowland': [55.90, -3.50], 'campbeltown': [55.42, -5.60],
    'orkney': [58.98, -3.00], 'isle of skye': [57.30, -6.20], 'isle of lewis': [58.20, -6.60],
    'uig': [58.20, -6.60], 'arran': [55.58, -5.25], 'jura': [55.98, -5.95], 'mull': [56.45, -5.70],
    'aberfeldy': [56.62, -3.86], 'aberlour': [57.47, -3.23], 'girvan': [55.24, -4.86],
    'annan': [54.98, -3.26], 'inverkeilor': [56.55, -2.53], 'glenrinnes': [57.40, -3.20],
    'aberargie': [56.34, -3.28], 'dufftown': [57.44, -3.13], 'keith': [57.54, -2.95],
    'kentucky': [37.80, -84.60], 'frankfort': [38.20, -84.90], 'louisville': [38.25, -85.76],
    'lexington': [38.04, -84.50], 'tennessee': [35.85, -86.35], 'lynchburg': [35.28, -86.37],
    'osaka': [34.69, 135.50], 'yamazaki': [34.87, 135.66], 'hokkaido': [43.06, 141.35],
    'hakushu': [35.90, 138.30], 'miyagi': [38.40, 141.00], 'kagoshima': [31.60, 130.55],
    'cork': [51.90, -8.50], 'midleton': [51.91, -8.17], 'bushmills': [55.20, -6.52],
    'tipperary': [52.47, -8.16], 'dublin': [53.35, -6.26], 'derry': [54.99, -7.31],
    'yilan': [24.75, 121.80], 'nantou': [23.83, 120.69], 'bangalore': [12.97, 77.59],
    'goa': [15.30, 74.10], 'tasmania ': [-42.00, 147.00], 'victoria': [-37.00, 144.00],

    /* --- 鸡尾酒 / 烈酒名城 --- */
    'jalisco': [20.67, -103.35], 'tequila': [20.88, -103.84], 'oaxaca': [17.07, -96.72],
    'mexico city': [19.43, -99.13], 'havana': [23.11, -82.37], 'santiago de cuba': [20.02, -75.82],
    'new orleans': [29.95, -90.07], 'london': [51.51, -0.12], 'paris': [48.86, 2.35],
    'new york': [40.71, -74.01], 'brooklyn': [40.68, -73.94], 'boston': [42.36, -71.06],
    'san francisco': [37.77, -122.42], 'chicago': [41.88, -87.63], 'los angeles': [34.05, -118.24],
    'seattle': [47.61, -122.33], 'key west': [24.56, -81.78], 'miami': [25.76, -80.19],
    'edinburgh': [55.95, -3.19], 'glasgow': [55.86, -4.25], 'belfast': [54.60, -5.93],
    'tokyo': [35.68, 139.69], 'osaka ': [34.69, 135.50], 'seoul': [37.57, 126.98],
    'amsterdam': [52.37, 4.90], 'berlin': [52.52, 13.40], 'munich': [48.14, 11.58],
    'vienna ': [48.21, 16.37], 'milan': [45.46, 9.19], 'venice': [45.44, 12.32], 'rome': [41.90, 12.50],
    'barcelona': [41.39, 2.17], 'madrid': [40.42, -3.70], 'lisbon': [38.72, -9.14],
    'rio de janeiro': [-22.91, -43.17], 'buenos aires': [-34.60, -58.38], 'lima': [-12.05, -77.04],
    'sydney': [-33.87, 151.21], 'melbourne': [-37.81, 144.96], 'cape town': [-33.92, 18.42],
    'bangkok': [13.76, 100.50], 'mumbai': [19.08, 72.88], 'istanbul': [41.01, 28.98],
    'athens': [37.98, 23.73], 'copenhagen': [55.68, 12.57], 'stockholm': [59.33, 18.07],
    'oslo': [59.91, 10.75], 'helsinki': [60.17, 24.94], 'reykjavik': [64.15, -21.94],
    'zurich': [47.38, 8.54], 'geneva': [46.20, 6.14], 'brussels': [50.85, 4.35],
    'prague': [50.08, 14.44], 'budapest': [47.50, 19.04], 'warsaw': [52.23, 21.01],
    'kingston': [17.99, -76.79], 'san juan': [18.47, -66.11], 'nassau': [25.06, -77.35],
    'bridgetown': [13.10, -59.62], 'port of spain': [10.65, -61.52], 'fort de france': [14.60, -61.07],
    'moscow': [55.76, 37.62], 'shanghai': [31.23, 121.47], 'beijing': [39.90, 116.41],
    'taipei': [25.03, 121.57], 'kuala lumpur': [3.14, 101.69], 'manila': [14.60, 120.98],
    'dublin ': [53.35, -6.26], 'bruges': [51.21, 3.22], 'bamberg': [49.89, 10.90],
    'pilsen': [49.75, 13.38], 'plzen': [49.75, 13.38], 'cologne': [50.94, 6.96],
    'dusseldorf': [51.23, 6.78], 'portland': [45.52, -122.68], 'san diego': [32.72, -117.16],
    'denver': [39.74, -104.99], 'austin': [30.27, -97.74], 'asheville': [35.60, -82.55],
    'grand rapids': [42.96, -85.67], 'montreal': [45.50, -73.57], 'toronto': [43.65, -79.38],
    'quebec': [46.81, -71.21], 'halifax': [44.65, -63.58], 'vancouver': [49.28, -123.12],
    'reykjavik ': [64.15, -21.94], 'cardiff': [51.48, -3.18], 'manchester': [53.48, -2.24],
    'leeds': [53.80, -1.55], 'nottingham': [52.95, -1.15], 'sheffield': [53.38, -1.47],
    'nuremberg': [49.45, 11.08], 'frankfurt': [50.11, 8.68], 'hamburg': [53.55, 9.99],
    'lyon': [45.76, 4.84], 'marseille': [43.30, 5.37], 'bordeaux ': [44.84, -0.58],
    'florence': [43.77, 11.26], 'naples': [40.85, 14.27], 'turin': [45.07, 7.69],
    'verona': [45.44, 10.99], 'palermo': [38.12, 13.36], 'cagliari': [39.22, 9.11],
    'porto ': [41.15, -8.61], 'funchal': [32.67, -16.93], 'santorini': [36.39, 25.46],
    'crete': [35.24, 24.81], 'santorini ': [36.39, 25.46], 'nemea': [37.82, 22.67],
    'naoussa': [40.63, 22.07], 'metsovo': [39.77, 21.18], 'rhodes': [36.43, 28.22]
  };

  /* ---------------- 国家名中文化 ---------------- */
  var COUNTRY_ZH = {
    'france': '法国', 'italy': '意大利', 'spain': '西班牙', 'portugal': '葡萄牙', 'germany': '德国',
    'austria': '奥地利', 'hungary': '匈牙利', 'greece': '希腊', 'united states': '美国', 'usa': '美国',
    'canada': '加拿大', 'mexico': '墨西哥', 'argentina': '阿根廷', 'chile': '智利', 'brazil': '巴西',
    'uruguay': '乌拉圭', 'peru': '秘鲁', 'australia': '澳大利亚', 'new zealand': '新西兰',
    'south africa': '南非', 'united kingdom': '英国', 'england': '英格兰', 'scotland': '苏格兰',
    'wales': '威尔士', 'ireland': '爱尔兰', 'northern ireland': '北爱尔兰', 'japan': '日本',
    'china': '中国', 'south korea': '韩国', 'korea': '韩国', 'taiwan': '中国台湾',
    'hong kong': '中国香港', 'singapore': '新加坡', 'india': '印度', 'thailand': '泰国',
    'vietnam': '越南', 'indonesia': '印度尼西亚', 'belgium': '比利时', 'netherlands': '荷兰',
    'luxembourg': '卢森堡', 'switzerland': '瑞士', 'denmark': '丹麦', 'sweden': '瑞典',
    'norway': '挪威', 'finland': '芬兰', 'iceland': '冰岛', 'poland': '波兰', 'czechia': '捷克',
    'czech republic': '捷克', 'slovakia': '斯洛伐克', 'slovenia': '斯洛文尼亚', 'croatia': '克罗地亚',
    'romania': '罗马尼亚', 'bulgaria': '保加利亚', 'moldova': '摩尔多瓦', 'ukraine': '乌克兰',
    'georgia': '格鲁吉亚', 'turkey': '土耳其', 'israel': '以色列', 'lebanon': '黎巴嫩',
    'morocco': '摩洛哥', 'egypt': '埃及', 'tunisia': '突尼斯', 'algeria': '阿尔及利亚',
    'russia': '俄罗斯', 'cuba': '古巴', 'jamaica': '牙买加', 'puerto rico': '波多黎各',
    'trinidad and tobago': '特立尼达和多巴哥', 'barbados': '巴巴多斯', 'martinique': '马提尼克',
    'bahamas': '巴哈马', 'bermuda': '百慕大', 'dominican republic': '多米尼加', 'cyprus': '塞浦路斯',
    'malta': '马耳他', 'albania': '阿尔巴尼亚', 'serbia': '塞尔维亚', 'montenegro': '黑山',
    'north macedonia': '北马其顿', 'bosnia and herzegovina': '波黑'
  };

  /* ---------------- 工具函数 ---------------- */
  function normalize(s) {
    if (!s) return '';
    return String(s)
      .normalize ? String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '') : String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
  }

  function norm(s) {
    var out = String(s == null ? '' : s);
    try { out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { /* 老浏览器忽略 */ }
    return out.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  /* 预构建索引：长键优先，避免 "port" 这类短词误命中 */
  var REGION_INDEX = Object.keys(REGION).map(function (k) {
    return { key: norm(k).replace(/\s+/g, ' ').trim(), lat: REGION[k][0], lon: REGION[k][1] };
  }).sort(function (a, b) { return b.key.length - a.key.length; });

  /**
   * 解析坐标
   * @param {string} country 国家（英文）
   * @param {string} region  产区/城市（英文，可空）
   * @returns {{lat:number, lon:number, level:string, matched:string|null}}
   */
  function resolve(country, region) {
    var r = norm(region);
    var c = norm(country);

    // 1) 产区精确匹配
    if (r) {
      for (var i = 0; i < REGION_INDEX.length; i++) {
        if (REGION_INDEX[i].key === r) {
          return { lat: REGION_INDEX[i].lat, lon: REGION_INDEX[i].lon, level: 'region', matched: REGION_INDEX[i].key };
        }
      }
      // 2) 产区子串匹配（键长 >= 4，避免短词误伤）
      for (var j = 0; j < REGION_INDEX.length; j++) {
        var k = REGION_INDEX[j].key;
        if (k.length >= 4 && r.indexOf(k) !== -1) {
          return { lat: REGION_INDEX[j].lat, lon: REGION_INDEX[j].lon, level: 'region', matched: k };
        }
      }
    }

    // 3) 国家质心
    if (c && COUNTRY[c]) {
      return { lat: COUNTRY[c][0], lon: COUNTRY[c][1], level: 'country', matched: c };
    }
    // 国家名作为子串兜底（例如 "United States of America"）
    var cKeys = Object.keys(COUNTRY);
    for (var m = 0; m < cKeys.length; m++) {
      if (cKeys[m].length >= 5 && c.indexOf(cKeys[m]) !== -1) {
        return { lat: COUNTRY[cKeys[m]][0], lon: COUNTRY[cKeys[m]][1], level: 'country', matched: cKeys[m] };
      }
    }
    return { lat: null, lon: null, level: 'none', matched: null };
  }

  function countryZh(country) {
    var c = norm(country);
    return COUNTRY_ZH[c] || country || '未知产区';
  }

  /** 经纬度 → 单位球面三维坐标（three.js 坐标系） */
  function latLonToVec3(lat, lon, radius) {
    var r = radius == null ? 1 : radius;
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon + 180) * Math.PI / 180;
    return {
      x: -r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.sin(theta)
    };
  }

  SA.geo = {
    resolve: resolve,
    countryZh: countryZh,
    latLonToVec3: latLonToVec3,
    COUNTRY: COUNTRY,
    REGION: REGION
  };
})(window.SA);
