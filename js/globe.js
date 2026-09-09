/* =============================================================
 * globe.js — 3D 科幻地球仪（Three.js）
 * 自研拖拽旋转 / 滚轮缩放 / 缓动飞入运镜（不依赖 OrbitControls）
 * v3 重构：彻底解决"加性混合叠加导致整屏烤白/烤黄"
 *   1) 全部 ShaderMaterial / 标记 / 网格 / 大气 → NormalBlending
 *   2) 取消 ACES toneMapping 与多重 emissive
 *   3) 取消夜灯叠加壳 / 取消赤道粉尘带（这两项就是上一版烤屏元凶）
 *   4) 标记用 NormalBlending + alpha 衰减 + 边缘羽化
 *   5) 大气层改成纯描边（Fresnel × 边缘），仅屏幕边缘可见
 * ============================================================= */
window.SA = window.SA || {};

(function (SA) {
  'use strict';

  var G = { ready: false, clusters: [], listeners: {} };

  var renderer, scene, camera, container;
  var earth, stars, dust, sunLight, nightOverlay;  // atmosphere 已彻底禁用
  var markerPoints, markerGeom, markerMat;
  var selectionMesh, arcMesh, arcMat;
  var cam = { yaw: 1.85, pitch: 0.10, dist: 4.2 };   // 初始看向亚洲（中国贵州/茅台、东京/獭祭、清酒产区一目了然）
  var target = { yaw: 1.85, pitch: 0.10, dist: 4.2 };
  var tween = null;
  var lastInteract = 0, dragging = false, dragVX = 0, dragVY = 0;
  var lastPX = 0, lastPY = 0, moved = 0;
  var hovered = -1, hoverCluster = null;
  var selectedPoint = null, arcVisible = false;
  var labelLayer, labelPool = [], labelFrame = 0;
  var clock = null, W = 1, H = 1, RAF = null;
  var pointerPx = { x: -1e4, y: -1e4, inside: false };
  var DEG = Math.PI / 180;
  var MIN_DIST = 1.18, MAX_DIST = 5.2;
  var MARK_R = 1.012;

  function on(evt, cb) { (G.listeners[evt] = G.listeners[evt] || []).push(cb); }
  function fire(evt, a, b) { (G.listeners[evt] || []).forEach(function (fn) { try { fn(a, b); } catch (e) { console.error(e); } }); }

  /* ================= 初始化 ================= */
  function init(opts) {
    container = opts.container;
    if (typeof THREE === 'undefined') { fire('error', 'Three.js 未能加载'); return false; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (e) { fire('error', '当前环境不支持 WebGL'); return false; }

    W = container.clientWidth || 800;
    H = container.clientHeight || 600;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x05080f, 1);
    // 不开 toneMapping：贴图是 sRGB 编码，加了 ACES 反而过曝
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 500);
    clock = new THREE.Clock();

    buildStars();
    buildEarth();
    // 不调用 buildAtmosphere()：大气层彻底禁用
    buildMarkers();
    buildSelection();
    buildArc();

    labelLayer = document.createElement('div');
    labelLayer.className = 'globe-labels';
    container.appendChild(labelLayer);

    bindEvents();
    updateCamera();
    G.ready = true;
    animate();
    return true;
  }

  /* ================= 光照（地球不再接收光照，纯贴图展示，避免白面被烤） ================= */
  function buildLights() { /* no-op：地球用 MeshBasicMaterial 不接收光照 */ }

  /* ================= 星空（NormalBlending） ================= */
  function buildStars() {
    var n = 1800, pos = new Float32Array(n * 3), size = new Float32Array(n), phase = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var r = 70 + Math.random() * 110;
      var t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.cos(p);
      pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      size[i] = 0.5 + Math.random() * 1.4;
      phase[i] = Math.random() * 6.28;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    var m = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio || 1, 2) } },
      vertexShader: [
        'attribute float aSize; attribute float aPhase; varying float vTw;',
        'uniform float uTime; uniform float uPR;',
        'void main(){ vTw = 0.5 + 0.5*sin(uTime*0.6 + aPhase);',
        '  gl_PointSize = aSize * uPR;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }'
      ].join('\n'),
      fragmentShader: [
        'varying float vTw;',
        'void main(){ float d = length(gl_PointCoord - 0.5); if(d>0.5) discard;',
        '  float a = (1.0 - d*2.0);',
        '  gl_FragColor = vec4(vec3(0.72,0.80,0.95), a*a*vTw*0.45); }'
      ].join('\n'),
      transparent: true, depthWrite: false, blending: THREE.NormalBlending
    });
    stars = new THREE.Points(g, m);
    scene.add(stars);
  }

  /* ================= 地球 ================= */
  function fallbackDayTexture() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#0d2f52'); g.addColorStop(0.5, '#154a7a'); g.addColorStop(1, '#0d2f52');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    // 粗略大陆块（仅作贴图失败时的兜底，让人一眼看出是地球）
    var blobs = [[150, 130, 120, 80], [110, 250, 70, 120], [300, 110, 90, 60], [430, 120, 140, 70],
    [470, 230, 90, 110], [560, 105, 220, 90], [600, 250, 120, 110], [790, 120, 150, 80],
    [830, 300, 80, 60], [260, 400, 60, 40], [900, 420, 200, 40]];
    blobs.forEach(function (b) {
      x.fillStyle = 'rgba(58,110,72,0.55)';
      x.beginPath(); x.ellipse(b[0], b[1], b[2], b[3], 0, 0, 6.3); x.fill();
    });
    x.fillStyle = 'rgba(240,245,255,0.75)'; x.fillRect(0, 0, 1024, 14); x.fillRect(0, 498, 1024, 14);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }

  /**
   * 贴图后处理：
   *   1) 超过 GPU 上限（部分设备 maxTextureSize=4096）时自动降采样，避免贴图变黑
   *   2) 各向异性过滤拉满 —— 斜视角/放大看陆地边缘不再糊
   *   3) mipmap + 线性过滤，远近都平滑
   */
  function prepareTexture(t) {
    var caps = renderer.capabilities || {};
    var maxTex = caps.maxTextureSize || 4096;
    var aniso = Math.min(16, caps.getMaxAnisotropy ? caps.getMaxAnisotropy() : 8);
    var img = t.image;
    if (img && img.width > maxTex) {
      try {
        var c = document.createElement('canvas');
        c.width = maxTex;
        c.height = Math.max(1, Math.round(img.height * maxTex / img.width));
        var cx = c.getContext('2d');
        cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
        cx.drawImage(img, 0, 0, c.width, c.height);
        if (t.dispose) t.dispose();
        t = new THREE.CanvasTexture(c);
      } catch (e) { /* 降采样失败就用原图 */ }
    }
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = aniso;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    if (t.colorSpace !== undefined && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }

  function buildEarth() {
    var geo = new THREE.SphereGeometry(1, 128, 128);
    var localURL = (window.SA_TEXTURES && window.SA_TEXTURES.day) || (SA.TEXTURES && SA.TEXTURES.day);
    var remoteURL = SA.TEXTURES && SA.TEXTURES.day;

    // MeshBasicMaterial：纯贴图，零光照，颜色即贴图本身 —— 绝不会过曝
    var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // 先用程序化兜底图立即出画面（不会白屏），高清贴图到位后自动替换
    mat.map = fallbackDayTexture();

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // 第一优先：内嵌高清贴图（4096×2048，NASA Blue Marble 降采样）→ 放大到产区依然清晰
    loader.load(localURL, function (t) {
      mat.map = prepareTexture(t);
      mat.needsUpdate = true;
      G.texInfo = mat.map.image ? (mat.map.image.width + 'x' + mat.map.image.height) : 'unknown';
    }, undefined, function () {
      // 第二优先：远程 CDN（内嵌文件缺失/损坏时兜底）
      if (remoteURL && remoteURL !== localURL) {
        loader.load(remoteURL, function (t2) {
          mat.map = prepareTexture(t2);
          mat.needsUpdate = true;
          G.texInfo = mat.map.image ? (mat.map.image.width + 'x' + mat.map.image.height) : 'unknown';
        }, undefined, function () { /* 保留程序化兜底 */ });
      }
    });

    earth = new THREE.Mesh(geo, mat);
    scene.add(earth);

    // 经纬网格（科幻感很淡）
    var gpos = [];
    for (var i = 0; i <= 12; i++) {
      var lon = -180 + i * 30;
      for (var a = -90; a < 90; a += 4) {
        var v1 = SA.geo.latLonToVec3(a, lon, 1.002), v2 = SA.geo.latLonToVec3(a + 4, lon, 1.002);
        gpos.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    for (var j = 1; j < 6; j++) {
      var lat = -60 + j * 30;
      for (var b = -180; b < 180; b += 4) {
        var w1 = SA.geo.latLonToVec3(lat, b, 1.002), w2 = SA.geo.latLonToVec3(lat, b + 4, 1.002);
        gpos.push(w1.x, w1.y, w1.z, w2.x, w2.y, w2.z);
      }
    }
    var lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(gpos, 3));
    scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
      color: 0x4c8fd6, transparent: true, opacity: 0.18, blending: THREE.NormalBlending, depthWrite: false
    })));
  }

  /* === 大气层：彻底关闭。BackSide Fresnel 即使改成 NormalBlending 也会把屏幕烤成橘红；用户优先要"地球清晰可读" === */
  /* === 该函数不再被 init() 调用，仅保留为占位以防未来误添加 === */
  function buildAtmosphere() {
    return null;  // 不创建任何 Mesh
  }

  // 取消香气分子粒子（旧版本在地球外圈用 AdditiveBlending 加上被压扁在赤道，
  // 是上一版把整屏烤成橘黄的元凶之一）
  function buildDust() { /* no-op */ }

  /* ================= 产地标记（NormalBlending + 中心硬边缘） ================= */
  var MARKER_VS = [
    'attribute vec3 aColor; attribute float aSize; attribute float aPhase; attribute float aAging; attribute float aAlpha;',
    'varying vec3 vC; varying float vA; varying float vAging;',
    'uniform float uTime; uniform float uPR;',
    'void main(){',
    '  vC = aColor; vA = aAlpha; vAging = aAging;',
    '  float pulse = 0.92 + 0.08*sin(uTime*1.6 + aPhase);',
    '  vec4 mv = modelViewMatrix * vec4(position,1.0);',
    '  // 关键：系数必须是小值 + clamp。早期用 (300.0 / -mv.z) 会让每个标记变成',
    '  // 375~900px 的巨型圆盘，几百个叠在一起把整屏涂成橘红（"烤屏"的真正元凶）。',
    '  float ps = aSize * uPR * pulse * (9.0 / -mv.z);',
    '  gl_PointSize = clamp(ps, 2.5, 18.0);',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var MARKER_FS = [
    'varying vec3 vC; varying float vA; varying float vAging;',
    'void main(){',
    '  vec2 c = gl_PointCoord - 0.5; float d = length(c);',
    '  if(d > 0.5) discard;',
    '  // 单层实心小点（去掉 halo，否则 700+ 标记叠加会把地球贴图糊成橘红色块）',
    '  float core = smoothstep(0.32, 0.10, d);',
    '  float a = core * vA;',
    '  if(a < 0.05) discard;',
    '  gl_FragColor = vec4(vC, a);',
    '}'
  ].join('\n');

  function buildMarkers() {
    markerGeom = new THREE.BufferGeometry();
    markerGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    markerMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio || 1, 2) } },
      vertexShader: MARKER_VS, fragmentShader: MARKER_FS,
      transparent: true, depthWrite: false, blending: THREE.NormalBlending
    });
    markerPoints = new THREE.Points(markerGeom, markerMat);
    markerPoints.frustumCulled = false;
    scene.add(markerPoints);
  }

  /** 构建全部产地标记（一次构建，之后靠 alpha 动画显隐，避免重建闪跳） */
  function setClusters(clusters) {
    G.clusters = clusters || [];
    var n = G.clusters.length;
    var pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    var size = new Float32Array(n), phase = new Float32Array(n), aging = new Float32Array(n), al = new Float32Array(n);
    var tmp = new THREE.Color();
    for (var i = 0; i < n; i++) {
      var c = G.clusters[i];
      var v = SA.geo.latLonToVec3(c.lat, c.lon, MARK_R);
      pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
      c._vec = new THREE.Vector3(v.x, v.y, v.z);
      tmp.set(SA.colorOf(c.category));
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
      size[i] = 2.2 + Math.min(3.3, Math.log2(c.count + 1) * 1.0);   // 配合 (9.0/-mv.z)：默认视角约 6~15px
      phase[i] = Math.random() * 6.28;
      aging[i] = c.aging || 0.3;
      al[i] = 0;
    }
    markerGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    markerGeom.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    markerGeom.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    markerGeom.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    markerGeom.setAttribute('aAging', new THREE.BufferAttribute(aging, 1));
    markerGeom.setAttribute('aAlpha', new THREE.BufferAttribute(al, 1));
    markerGeom.computeBoundingSphere();
    G.alphaTarget = new Float32Array(n);
    G.alphaCurrent = new Float32Array(n);
    G.visible = new Uint8Array(n);
    G.screen = new Array(n);
    applyFilter();
  }

  function applyFilter() {
    if (!G.clusters.length) return;
    for (var i = 0; i < G.clusters.length; i++) {
      var c = G.clusters[i];
      var active = SA.store && SA.store.isClusterActive ? SA.store.isClusterActive(c) : true;
      G.alphaTarget[i] = active ? 1.0 : 0.0;
    }
  }

  /* ================= 选中光环 / 光弧（先禁用，看清楚是否这两个在干扰） ================= */
  function buildSelection() {
    // 高亮环：贴在地球表面外侧 1.4%，呼吸缩放
    var geo = new THREE.RingGeometry(0.010, 0.016, 48);
    var mat = new THREE.MeshBasicMaterial({
      color: 0xffd166, side: THREE.DoubleSide,
      transparent: true, opacity: 0.70,
      depthWrite: false, depthTest: false,
      blending: THREE.NormalBlending
    });
    selectionMesh = new THREE.Mesh(geo, mat);
    selectionMesh.renderOrder = 4;
    selectionMesh.visible = false;
    scene.add(selectionMesh);
  }

  function buildArc() {
    // 起点→选中点 的弧形光线：NormalBlending 流动高亮（不会加色过曝）
    arcMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:    { value: 0 },
        uOpacity: { value: 0.85 },
        uColor:   { value: new THREE.Color(0xffd166) }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main(){',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec2 vUv;',
        'uniform float uTime; uniform float uOpacity; uniform vec3 uColor;',
        'void main(){',
        '  float pulse = 0.45 + 0.55 * sin((vUv.x * 9.0 - uTime * 1.8) * 6.2831);',
        '  float fade  = smoothstep(0.0, 0.10, vUv.x) * smoothstep(1.0, 0.92, vUv.x);',
        '  float a = uOpacity * fade * (0.45 + 0.55 * pulse);',
        '  if (a < 0.01) discard;',
        '  gl_FragColor = vec4(uColor, a);',
        '}'
      ].join('\n'),
      transparent: true, depthWrite: false,
      blending: THREE.NormalBlending
    });
    arcMesh = new THREE.Mesh(new THREE.BufferGeometry(), arcMat);
    arcMesh.frustumCulled = false;
    arcMesh.renderOrder = 3;
    arcMesh.visible = false;
    scene.add(arcMesh);
  }

  function updateArc() {
    if (!arcVisible || !selectedPoint) { if (arcMesh) arcMesh.visible = false; return; }
    var start = selectedPoint.clone().multiplyScalar(1.03);
    var camPos = camera.position;
    var forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    var up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    var left = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion);
    // 弧线终点：屏幕右下方，比之前近很多 → 弧线变成「短指针」而不是覆盖半个地球的霓虹光环
    var dEnd = camPos.length() * 0.35;
    var halfH = Math.tan((camera.fov / 2) * DEG) * dEnd;
    var halfW = halfH * camera.aspect;
    var end = camPos.clone().add(forward.multiplyScalar(dEnd))
      .add(left.multiplyScalar(halfW * 0.55)).add(up.multiplyScalar(-halfH * 0.30));
    var c1 = start.clone().multiplyScalar(1.35).add(new THREE.Vector3(0, 0.10, 0));
    var c2 = end.clone().lerp(start, 0.45).add(new THREE.Vector3(0, 0.14, 0));
    var tube = new THREE.TubeGeometry(new THREE.CubicBezierCurve3(start, c1, c2, end), 40, 0.0035, 6, false);
    if (arcMesh.geometry) arcMesh.geometry.dispose();
    arcMesh.geometry = tube;
    arcMesh.visible = true;
  }

  function setSelected(item) {
    if (!item || !isFinite(item.latitude)) { clearSelection(); return; }
    var v = SA.geo.latLonToVec3(item.latitude, item.longitude, 1.0);
    selectedPoint = new THREE.Vector3(v.x, v.y, v.z);
    arcVisible = true;
    selectionMesh.visible = true;
    selectionMesh.position.copy(selectedPoint).multiplyScalar(1.014);
    selectionMesh.lookAt(0, 0, 0);
    var c = new THREE.Color(SA.colorOf(item.category));
    selectionMesh.material.color.copy(c);
    arcMat.uniforms.uColor.value.copy(c);
    flyTo(item.latitude, item.longitude, 1.42, 1100);
  }

  function clearSelection() {
    selectedPoint = null; arcVisible = false;
    if (arcMesh) arcMesh.visible = false;
    if (selectionMesh) selectionMesh.visible = false;
  }

  /* ================= 运镜 ================= */
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function latLonToYawPitch(lat, lon) {
    var v = SA.geo.latLonToVec3(lat, lon, 1);
    var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
    return { yaw: Math.atan2(v.x / len, v.z / len), pitch: Math.asin(Math.max(-1, Math.min(1, v.y / len))) };
  }

  function flyTo(lat, lon, dist, duration) {
    var yp = latLonToYawPitch(lat, lon);
    var dy = yp.yaw - cam.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    tween = {
      t0: performance.now(), dur: duration || 1100,
      from: { yaw: cam.yaw, pitch: cam.pitch, dist: cam.dist },
      to: { yaw: cam.yaw + dy, pitch: yp.pitch, dist: dist == null ? 1.6 : Math.max(MIN_DIST, Math.min(MAX_DIST, dist)) }
    };
    lastInteract = performance.now();
  }

  function zoomTo(dist) {
    target.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, dist));
    lastInteract = performance.now();
  }

  function updateCamera() {
    var d = cam.dist, cp = Math.cos(cam.pitch);
    camera.position.set(d * cp * Math.sin(cam.yaw), d * Math.sin(cam.pitch), d * cp * Math.cos(cam.yaw));
    camera.lookAt(0, 0, 0);
  }

  /** 聚焦某个产区（供左侧"热门产区"入口调用） */
  function focusCluster(c) {
    if (!c) return;
    flyTo(c.lat, c.lon, Math.min(cam.dist, 1.65), 1100);
    fire('clusterClick', c);
  }

  /* ================= 交互 ================= */
  var _ptrs = {}, _pinchLast = null, _pinchUsed = false;
  function _ptrsLen() { var n = 0; for (var k in _ptrs) if (_ptrs.hasOwnProperty(k)) n++; return n; }
  function _ptrsDist() {
    var ids = Object.keys(_ptrs); if (ids.length < 2) return null;
    var a = _ptrs[ids[0]], b = _ptrs[ids[1]];
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }
  function bindEvents() {
    var dom = renderer.domElement;
    dom.addEventListener('pointerdown', function (e) {
      _ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = _ptrsLen();
      if (n === 1) {            // 第一指：开始拖转/预备点击
        dragging = true; moved = 0; lastPX = e.clientX; lastPY = e.clientY;
        dragVX = dragVY = 0; lastInteract = performance.now();
        _pinchUsed = false;
        try { dom.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      } else if (n === 2) {     // 第二指：进入双指缩放，暂停拖转
        dragging = false; moved = 0; dragVX = dragVY = 0;
        _pinchUsed = true; _pinchLast = null;
        try { dom.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      }
    });
    dom.addEventListener('pointermove', function (e) {
      var rect = dom.getBoundingClientRect();
      pointerPx.x = e.clientX - rect.left;
      pointerPx.y = e.clientY - rect.top;
      pointerPx.inside = true;
      if (_ptrs[e.pointerId]) { _ptrs[e.pointerId].x = e.clientX; _ptrs[e.pointerId].y = e.clientY; }
      var n = _ptrsLen();
      if (n >= 2) {             /* 双指捏合缩放（触屏） */
        var d = _ptrsDist();
        if (d) {
          if (_pinchLast != null && _pinchLast > 0) {
            target.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, target.dist * (_pinchLast / d)));
            tween = null;
          }
          _pinchLast = d;
        }
        lastInteract = performance.now();
        return;
      }
      if (n === 1 && dragging) {
        var dx = e.clientX - lastPX, dy = e.clientY - lastPY;
        lastPX = e.clientX; lastPY = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        /* 触屏灵敏度远低于鼠标（约为鼠标 1/3），手机慢拖也能精细控制 */
        var isTouch = e.pointerType === 'touch';
        var rot = isTouch ? 0.0016 : 0.0052;
        var pr = isTouch ? 0.0015 : 0.0048;
        target.yaw -= dx * rot;
        target.pitch = Math.max(-1.32, Math.min(1.32, target.pitch + dy * pr));
        dragVX = -dx * rot; dragVY = dy * pr;
        lastInteract = performance.now();
        tween = null;
      }
    });
    function _lift(e) {
      if (_ptrs[e.pointerId]) delete _ptrs[e.pointerId];
      var n = _ptrsLen();
      if (n === 1) {            // 还剩一指 → 无缝继续拖转，避免视角跳动
        var ids = Object.keys(_ptrs);
        lastPX = _ptrs[ids[0]].x; lastPY = _ptrs[ids[0]].y;
        dragging = true; dragVX = dragVY = 0; moved = 0;
        return;
      }
      if (n > 0) return;
      if (!dragging) { dragging = false; lastInteract = performance.now(); return; }
      dragging = false;
      lastInteract = performance.now();
      if (!_pinchUsed && moved < 6) handleClick(e);
      else {
        /* 惯性：触屏几乎不给（避免"松手还在飞"），鼠标保留轻度惯性 */
        var isTouch = e.pointerType === 'touch';
        target.yaw += dragVX * (isTouch ? 0.6 : 6);
        target.pitch += dragVY * (isTouch ? 0.4 : 4);
        if (isTouch) { dragVX *= 0.70; dragVY *= 0.70; }
      }
    }
    dom.addEventListener('pointerup', _lift);
    dom.addEventListener('pointercancel', _lift);
    dom.addEventListener('pointerleave', function () { pointerPx.inside = false; dragging = false; });
    dom.addEventListener('wheel', function (e) {
      e.preventDefault();
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= 120;
      target.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, target.dist * Math.exp(d * 0.0013)));
      lastInteract = performance.now();
      tween = null;
    }, { passive: false });
    dom.addEventListener('dblclick', function (e) {
      var rect = dom.getBoundingClientRect();
      pointerPx.x = e.clientX - rect.left; pointerPx.y = e.clientY - rect.top;
      var idx = pickIndex();
      zoomTo(idx >= 0 ? 1.35 : Math.max(MIN_DIST, target.dist - 0.6));
    });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { resize(); }).observe(container);
    }
    window.addEventListener('resize', resize);
  }

  /**
   * 屏幕空间拾取：把标记投影到像素坐标，取距离鼠标最近的（热区与视觉尺寸一致）
   */
  function projectAll() {
    var n = G.clusters.length;
    var camPos = camera.position;
    var camLen2 = camPos.lengthSq();
    for (var i = 0; i < n; i++) {
      var c = G.clusters[i];
      if (!c._vec) continue;
      // 精确遮挡剔除：点 p 在球面上，相机 C，可见条件 p·C > r²
      var dot = c._vec.x * camPos.x + c._vec.y * camPos.y + c._vec.z * camPos.z;
      if (dot < MARK_R * MARK_R * 0.995 || camLen2 <= 0) { G.visible[i] = 0; G.screen[i] = null; continue; }
      G.visible[i] = 1;
      var p = c._vec.clone().project(camera);
      if (p.z > 1) { G.screen[i] = null; continue; }
      G.screen[i] = { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z };
    }
  }

  function pickIndex() {
    if (!G.clusters.length || !pointerPx.inside) return -1;
    var best = -1, bestD = 1e9;
    for (var i = 0; i < G.clusters.length; i++) {
      var c = G.clusters[i];
      if (!G.visible[i] || !G.screen[i]) continue;
      if (!G.alphaTarget || G.alphaTarget[i] < 0.5) continue;
      if (!G.alphaCurrent || G.alphaCurrent[i] < 0.35) continue;
      var s = G.screen[i];
      var dx = s.x - pointerPx.x, dy = s.y - pointerPx.y;
      var d2 = dx * dx + dy * dy;
      // 命中半径：随酒款数量与缩放变化，最小 14px
      var r = 14 + Math.min(16, Math.log2(c.count + 1) * 4.0) * (2.9 / cam.dist);
      if (d2 < r * r && d2 < bestD) { bestD = d2; best = i; }
    }
    return best;
  }

  function handleClick() {
    var idx = pickIndex();
    if (idx >= 0 && G.clusters[idx]) {
      var c = G.clusters[idx];
      flyTo(c.lat, c.lon, Math.min(cam.dist, 1.7), 1000);
      fire('clusterClick', c);
    } else {
      fire('emptyClick');
    }
  }

  function resize() {
    if (!container || !renderer) return;
    var w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    W = w; H = h;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }

  /* ================= 标签层（按 dist 分级 + 屏幕空间聚合） =================
   * 三级密度：
   *   远 dist > 3.5 → 顶级 8 个 cluster（按 count 排序），小字
   *   中 1.8~3.5   → 顶级 18 个，中字
   *   近 < 1.8     → 顶级 30 个，大字
   * 屏幕空间聚合：两标签中心像素距 < pixelGap 时，弱的那个（count 小）被合并隐藏
   */
  function syncLabels() {
    if (!labelLayer) return;
    var vis = [];
    for (var i = 0; i < G.clusters.length; i++) {
      if (!G.visible[i] || !G.screen[i]) continue;
      if (!G.alphaTarget || G.alphaTarget[i] < 0.5) continue;
      if (!G.alphaCurrent || G.alphaCurrent[i] < 0.4) continue;
      var s = G.screen[i];
      if (s.x < 0 || s.x > W || s.y < 0 || s.y > H) continue;
      vis.push({ c: G.clusters[i], x: s.x, y: s.y, i: i, count: G.clusters[i].count });
    }
    vis.sort(function (a, b) { return b.count - a.count; });

    /* 1. 按 dist 决定密度上限 */
    var maxLabels, lvlClass, pixelGap;
    if (cam.dist > 3.5)      { maxLabels = 8;  lvlClass = 'lvl-far';  pixelGap = 95; }
    else if (cam.dist > 1.8) { maxLabels = 18; lvlClass = 'lvl-mid';  pixelGap = 70; }
    else                     { maxLabels = 30; lvlClass = 'lvl-near'; pixelGap = 55; }

    /* 2. 屏幕空间聚合：保留 count 大的，挤掉的隐藏 */
    var placed = [];
    for (var j = 0; j < vis.length; j++) {
      var v = vis[j];
      var collide = false;
      for (var p = 0; p < placed.length; p++) {
        var dx = placed[p].x - v.x, dy = placed[p].y - v.y;
        if (dx * dx + dy * dy < pixelGap * pixelGap) { collide = true; break; }
      }
      if (!collide) placed.push(v);
      if (placed.length >= maxLabels) break;
    }

    while (labelPool.length < placed.length) {
      var d = document.createElement('div');
      d.className = 'globe-label ' + lvlClass;
      d.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        if (isFinite(idx) && G.clusters[idx]) focusCluster(G.clusters[idx]);
      });
      labelLayer.appendChild(d);
      labelPool.push(d);
    }
    for (var k = 0; k < labelPool.length; k++) {
      var el = labelPool[k];
      /* 跟随 dist 切换字号档位 */
      if (el._lvl !== lvlClass) { el.className = 'globe-label ' + lvlClass; el._lvl = lvlClass; }
      if (k < placed.length) {
        var it = placed[k];
        el.style.display = 'flex';
        el.style.transform = 'translate3d(' + it.x.toFixed(1) + 'px,' + it.y.toFixed(1) + 'px,0)';
        el.setAttribute('data-idx', it.i);
        if (el.getAttribute('data-name') !== it.c.origin) {
          el.setAttribute('data-name', it.c.origin);
          var shortName = it.c.origin.split(/·|\s/).pop() || it.c.origin;
          el.innerHTML = '<i style="background:' + SA.colorOf(it.c.category) + '"></i><span>' +
            escapeHTML(shortName) + '</span><b>' + it.c.count + '</b>';
        }
      } else el.style.display = 'none';
    }
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ================= 主循环 ================= */
  function animate() {
    RAF = requestAnimationFrame(animate);
    var now = performance.now();
    var t = clock ? clock.getElapsedTime() : now / 1000;

    if (tween) {
      var p = Math.min(1, (now - tween.t0) / tween.dur);
      var e = easeInOutCubic(p);
      cam.yaw = tween.from.yaw + (tween.to.yaw - tween.from.yaw) * e;
      cam.pitch = tween.from.pitch + (tween.to.pitch - tween.from.pitch) * e;
      cam.dist = tween.from.dist + (tween.to.dist - tween.from.dist) * e;
      target.yaw = cam.yaw; target.pitch = cam.pitch; target.dist = cam.dist;
      if (p >= 1) tween = null;
    } else {
      if (!dragging) {
        target.yaw += dragVX; target.pitch += dragVY;
        dragVX *= 0.90; dragVY *= 0.90;
        if (Math.abs(dragVX) < 0.00002) dragVX = 0;
        if (Math.abs(dragVY) < 0.00002) dragVY = 0;
      }
      // 自动旋转已按用户要求彻底关闭：地球在用户拖拽后完全静止，不再自行漂移。
      // （原逻辑：!dragging && now - lastInteract > 4500 → target.yaw += 0.0005）
      cam.yaw += (target.yaw - cam.yaw) * 0.16;
      cam.pitch += (target.pitch - cam.pitch) * 0.16;
      cam.dist += (target.dist - cam.dist) * 0.16;
    }
    updateCamera();

    projectAll();

    // 标记 alpha 缓动 + 遮挡剔除
    if (G.alphaTarget && G.alphaCurrent) {
      var attr = markerGeom.getAttribute('aAlpha');
      var changed = false;
      for (var i = 0; i < G.alphaTarget.length; i++) {
        var want = G.alphaTarget[i] * (G.visible[i] ? 1 : 0);
        var cur = G.alphaCurrent[i];
        var nv = cur + (want - cur) * 0.14;
        if (Math.abs(nv - cur) > 0.0015) changed = true; else nv = want;
        G.alphaCurrent[i] = nv;
        attr.array[i] = nv;
      }
      attr.needsUpdate = true;
    }

    if (markerMat) markerMat.uniforms.uTime.value = t;
    if (dust && dust.material && dust.material.uniforms) dust.material.uniforms.uTime.value = t;
    if (stars && stars.material && stars.material.uniforms) stars.material.uniforms.uTime.value = t;
    if (dust && dust.rotation) dust.rotation.y = t * 0.010;
    if (stars && stars.rotation) stars.rotation.y = t * 0.004;

    if (selectionMesh && selectionMesh.visible) {
      var s = 1 + Math.sin(t * 3.0) * 0.10;
      selectionMesh.scale.set(s, s, s);
      selectionMesh.material.opacity = 0.45 + 0.20 * Math.sin(t * 3.0);
    }
    if (arcMesh && arcMesh.visible) { arcMat.uniforms.uTime.value = t; arcMat.uniforms.uOpacity.value = 0.7; updateArc(); }

    // hover 检测（屏幕空间）
    if (pointerPx.inside) {
      var idx = pickIndex();
      if (idx !== hovered) {
        hovered = idx;
        hoverCluster = idx >= 0 ? G.clusters[idx] : null;
        renderer.domElement.style.cursor = hoverCluster ? 'pointer' : 'grab';
        fire('clusterHover', hoverCluster, { x: pointerPx.x + (container ? 0 : 0), y: pointerPx.y });
      }
    }

    labelFrame++;
    if (labelFrame % 3 === 0) syncLabels();

    renderer.render(scene, camera);
  }

  SA.globe = {
    init: init,
    on: on,
    setClusters: setClusters,
    applyFilter: applyFilter,
    setSelected: setSelected,
    clearSelection: clearSelection,
    flyTo: flyTo,
    zoomTo: zoomTo,
    focusCluster: focusCluster,
    getDistance: function () { return cam.dist; },
    getCam: function () { return { yaw: cam.yaw, pitch: cam.pitch, dist: cam.dist }; },
    getTextureInfo: function () {
      if (!earth) return null;
      var m = earth.material, im = m && m.map && m.map.image;
      return { w: im ? im.width : 0, h: im ? im.height : 0, aniso: m && m.map ? m.map.anisotropy : 0, info: G.texInfo || 'fallback' };
    },
    resize: resize,
    isReady: function () { return G.ready; },
    destroy: function () { if (RAF) cancelAnimationFrame(RAF); }
  };
})(window.SA);
