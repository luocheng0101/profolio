# 个人作品集 · XIAO WANG PORTFOLIO

一个杂志式编辑排版的个人作品集网站，使用**原生 HTML / CSS / JavaScript** 手工打造，不依赖任何框架或 UI 组件库。

## 主要功能

- **首屏 Hero**：个人介绍、方向标签与数据概览，配合背景大字描边装饰
- **精选作品**：由 `projects.js` 数据驱动渲染，支持 3 种排版模板（feature 通栏头版 / split 左右交错 / wide 横向紧凑），扩展项目只需在数组中新增一条数据
- **关于我**：个人简介、技能列表与基本信息
- **联系方式**：电话及社交链接
- **深浅色主题切换**：导航栏右侧按钮一键切换，通过 `localStorage` 记忆用户选择，首次访问跟随系统偏好
- **交互细节**：导航滚动背景、滚动显现动画、当前区块导航高亮、移动端全屏抽屉菜单
- **响应式适配**：兼容桌面端、平板与手机

## 技术栈

| 类别 | 技术 |
|------|------|
| 结构 | HTML5（语义化标签） |
| 样式 | CSS3（CSS 变量、Grid / Flex 布局、`clamp()` 流式字号） |
| 交互 | 原生 JavaScript（ES5+，`IntersectionObserver`） |
| 存储 | `localStorage`（主题记忆） |

## 运行方式

纯静态页面，无需安装依赖：

```bash
# 方式一：直接双击打开
portfolio/index.html

# 方式二：本地服务器（推荐，任选其一）
cd portfolio
python -m http.server 8080
# 或使用 VS Code 的 Live Server 插件
```

然后访问 `http://localhost:8080`。

## 项目结构

```
demo04/
├── portfolio/
│   ├── index.html        # 页面结构
│   ├── css/style.css     # 样式（含深色主题变量）
│   ├── js/main.js        # 渲染与交互逻辑
│   ├── js/projects.js    # 项目数据（作品列表数据源）
│   └── profile.md        # 个人信息
└── .gitignore
```

## 自定义

- **新增项目**：编辑 `portfolio/js/projects.js`，在 `PROJECTS` 数组中添加一条记录
- **修改配色**：编辑 `portfolio/css/style.css` 顶部的 `:root`（浅色）与 `[data-theme="dark"]`（深色）变量块
