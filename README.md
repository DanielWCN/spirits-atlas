# 酒类地图 Spirits Atlas

一个把「全球酒款」画在 3D 地球上的交互式地图：右侧可拖拽旋转、滚轮缩放的地球，左侧是品类知识卡、筛选与酒款列表，两侧双向联动。

**858 款酒 · 8 大品类 · 33 省市地方酒 · 12 种白酒香型 · 26 张真实产品图**

---

## 在线访问

<!-- 部署到 Render 后，把下面的地址替换成实际链接，例如 https://spirits-atlas-a1b2.onrender.com -->
**部署后填写**（见下方「部署」一节）

本地运行：直接用浏览器打开 `index.html` 即可，无需安装任何依赖、无需启动服务器。
（地球贴图已内嵌为 base64，Three.js 已本地化到 `js/vendor/`，**断网也能正常显示**。）

---

## 功能

### 右侧 3D 地球
- **拖拽**旋转、**滚轮**缩放
- 点光点 → 相机飞向该产区；点标签 → 展开该产区酒款
- 标签按相机距离**分三级密度**：远看只看大区，拉近才显示细分产区，避免欧洲等密集区标签互相压盖
- 已关闭自动旋转与大气层特效，保证地图清晰可读

### 左侧面板
- **8 大品类**：中国白酒、威士忌、清酒、米酒、烧酎、葡萄酒、啤酒、鸡尾酒
- **搜索**：支持中文名 / 品牌 / 英文名（茅台、Macallan…）
- **快速筛选**：🌱 新手推荐 · 🥃 老炮儿推荐 · 💰 性价比 · 💎 收藏级
- **排序**：推荐指数（按权威评分）· 名称 · 产地
- **12 种白酒香型知识卡**：浓香 / 酱香 / 清香 / 米香 / 凤香 / 董香 / 豉香 / 特香 / 兼香 / 馥郁香 / 老白干香 / 芝麻香，含国标号、口感特征与代表品牌

### 详情浮层
- 产地、酒精度、价格区间、风味标签、餐搭建议、侍酒温度
- **权威评分**（有出处才显示）：Whiskybase 百分制 / Meta Critic 十分制 / 中国名酒评选 / IWSC
- 有真实产品图的 26 款名酒显示**实拍图**，其余显示按品类区分的程序化瓶型图

---

## 数据来源

| 来源 | 内容 |
|---|---|
| 人工策展 | 858 款核心酒款（含经纬度、产区、风味、评分、价格） |
| [Open Brewery DB](https://www.openbrewerydb.org/) | 全球啤酒厂/苹果酒厂（自带经纬度） |
| [WhiskyyDB/whisky-database](https://github.com/WhiskyyDB/whisky-database) | 威士忌蒸馏厂与酒款 |
| [Open Food Facts](https://world.openfoodfacts.org/) | 威士忌补充源 |
| [sampleapis.com/wines](https://api.sampleapis.com/wines) | 葡萄酒数据集 |
| [TheCocktailDB](https://www.thecocktaildb.com/) | 鸡尾酒配方 |

远程 API 不可达时自动降级为本地策展数据，**不影响核心体验**。

---

## 项目结构

```
spirits-atlas/
├── index.html              # 页面骨架
├── css/style.css           # 样式（含移动端抽屉布局）
├── js/
│   ├── vendor/three.min.js # Three.js r157（本地化，离线可用）
│   ├── assets/textures.js  # 地球贴图（4096×2048，base64 内嵌）
│   ├── config.js           # 品类/配色/图片与瓶型生成
│   ├── bottles*.js         # 酒款数据（策展 + 中国地方酒 + 评分酒）
│   ├── ratings.js          # 权威评分（70 条，均有出处）
│   ├── knowledge.js        # 品类知识卡
│   ├── globe.js            # 3D 地球渲染与交互
│   ├── store.js            # 状态与筛选
│   ├── ui.js               # 列表/详情渲染
│   └── app.js              # 启动引导
└── assets/bottles/         # 26 张真实产品图
```

---

## 部署

### Render（Static Site）
1. 将本仓库推送到 GitHub
2. Render Dashboard → **New** → **Static Site**
3. 连接仓库，配置：
   - Build Command：**留空**
   - Publish Directory：**留空**（或填 `.`）
4. 创建后等待约 1 分钟，即可获得 `https://xxx.onrender.com` 链接

仓库已附带 `render.yaml`，也可直接用 Blueprint 部署。

### GitHub Pages
仓库 Settings → Pages → Source 选 `Deploy from a branch` → 分支 `main` / 目录 `/ (root)` → Save。

---

## 版权说明

- 代码与策展数据：可自由使用
- `assets/bottles/` 中 26 张产品图为第三方素材，仅用于个人作品展示与学习；**如需公开发布或商业用途，请删除该目录**，程序会自动回退到程序化瓶型图（永不错配）

---

## 技术栈

原生 HTML / CSS / JavaScript（无构建步骤）+ Three.js r157 WebGL 渲染。
