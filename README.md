<div align="center">

# GitHub Trending

**实时追踪 GitHub 热门开源项目 / Real-time GitHub Trending Repositories**

[English](#english) | [中文](#中文)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)
![Cloudflare](https://img.shields.io/badge/Deployed-Cloudflare-orange?logo=cloudflare)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

</div>

---

## 中文

### 简介

GitHub Trending 是一个现代化的 GitHub 热门项目趋势网站，帮助开发者实时发现和追踪 GitHub 上增长最快的开源项目。支持深色/浅色模式、翻译、收藏、搜索等功能，国内可直接访问。

### 核心功能

| 功能 | 说明 |
|------|------|
| 📊 **趋势浏览** | 按今日/本周/本月查看热门项目 |
| 🔍 **搜索** | 按关键词搜索仓库名称、描述、作者 |
| 🌐 **翻译** | 一键将英文描述翻译为中文（带缓存） |
| ⬇️ **下载** | 直接跳转 Release 页面下载 |
| 🌙 **深色/浅色模式** | 支持主题切换，自动保存偏好 |
| 💻 **语言筛选** | 支持 20 种编程语言过滤 |
| 🏷️ **主题分类** | ML、AI、Web、安全等 12 个主题 |
| 📄 **分页** | 支持翻页浏览大量结果 |
| ⭐ **收藏夹** | 本地保存感兴趣的仓库，随时查看 |
| 🔗 **分享** | 一键复制仓库链接 |
| ⌨️ **快捷键** | `/` 搜索, `T` 主题, `B` 收藏, `J/K` 滚动, `G` 回顶 |
| 📊 **语言统计** | 顶部显示热门语言占比，点击可筛选 |
| 📡 **RSS 订阅** | 下载 RSS 订阅文件 |
| 📱 **PWA 支持** | 可添加到手机桌面，像 App 一样使用 |
| ✨ **毛玻璃效果** | Header 毛玻璃半透明效果 |
| 📱 **移动端适配** | 针对手机端优化的布局和交互 |

### 快捷键

| 按键 | 功能 |
|------|------|
| `/` | 聚焦搜索框 |
| `T` | 切换深色/浅色模式 |
| `B` | 打开收藏夹 |
| `J` | 向下滚动 |
| `K` | 向上滚动 |
| `G` | 回到顶部 |

### 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS 4
- **后端**: Cloudflare Pages Functions / Vercel Serverless Functions
- **API**: GitHub Search API
- **图标**: Phosphor Icons
- **翻译**: MyMemory Translation API
- **部署**: Cloudflare Pages（全球 CDN，国内可直接访问）

### 在线访问

**Cloudflare Pages（推荐，国内可访问）：**
```
https://github-trending-aqb.pages.dev
```

**Vercel（国外访问）：**
```
https://github-trending-pearl.vercel.app
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/a3327564254/github-trending.git
cd github-trending

# 安装依赖
npm install

# 启动后端（需要开启代理访问 GitHub API）
node server.js

# 启动前端（新终端）
npm run dev
```

访问 http://localhost:5173

### 部署

**Cloudflare Pages：**
1. Fork 本仓库
2. 在 Cloudflare Pages 连接 GitHub 仓库
3. 构建命令: `npm run build`
4. 输出目录: `dist`

**Vercel：**
```bash
vercel --prod
```

### 免费额度

| 平台 | 限制 |
|------|------|
| Cloudflare Pages 静态页面 | 无限制 |
| Cloudflare Functions (API) | 100,000 次/天 |
| Vercel | 100GB 带宽/月 |

### 项目结构

```
github-trending/
├── api/
│   └── search.ts              # Vercel Serverless Function
├── functions/
│   └── api/
│       └── search.ts          # Cloudflare Pages Function
├── public/
│   ├── favicon.svg            # 网站图标
│   ├── manifest.json          # PWA 配置
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/
│   │   ├── FavoritesPage.tsx  # 收藏夹弹窗
│   │   ├── FilterBar.tsx      # 筛选栏（时间/语言/主题/搜索）
│   │   ├── Footer.tsx         # 页脚（RSS 下载）
│   │   ├── Header.tsx         # 顶部导航（收藏/翻译/主题）
│   │   ├── HeroSection.tsx    # 首页头部
│   │   ├── LoadingSkeleton.tsx # 加载骨架屏
│   │   ├── RepoCard.tsx       # 仓库卡片（收藏/分享/下载）
│   │   ├── ThemeToggle.tsx    # 主题切换按钮
│   │   └── TranslatedText.tsx # 翻译文本组件
│   ├── context/
│   │   ├── FavoritesContext.tsx # 收藏夹状态管理
│   │   └── TranslationContext.tsx # 翻译状态管理
│   ├── services/
│   │   ├── favorites.ts       # 收藏夹服务（localStorage）
│   │   ├── rss.ts             # RSS 生成服务
│   │   └── translate.ts       # 翻译服务（带缓存）
│   ├── api.ts                 # API 请求封装
│   ├── App.tsx                # 主应用组件（含快捷键）
│   ├── index.css              # 全局样式 + 主题变量 + 毛玻璃
│   ├── main.tsx               # 入口文件
│   └── types.ts               # TypeScript 类型定义
├── server.js                  # 本地开发后端
├── vercel.json                # Vercel 部署配置
├── wrangler.toml              # Cloudflare 部署配置
└── vite.config.ts             # Vite 配置（含代理）
```

---

## English

### Introduction

GitHub Trending is a modern website for tracking trending open-source projects on GitHub. It helps developers discover and follow the fastest-growing repositories in real-time. Features include dark/light mode, translation, favorites, search, and more. Accessible directly from China.

### Key Features

| Feature | Description |
|---------|-------------|
| 📊 **Trending** | Browse trending repos by daily/weekly/monthly |
| 🔍 **Search** | Search by repo name, description, or author |
| 🌐 **Translate** | One-click translation of English descriptions to Chinese (with cache) |
| ⬇️ **Download** | Direct link to Release page for downloads |
| 🌙 **Dark/Light Mode** | Theme toggle with saved preference |
| 💻 **Language Filter** | Filter by 20 programming languages |
| 🏷️ **Topic Categories** | 12 topics: ML, AI, Web, Security, etc. |
| 📄 **Pagination** | Browse through large result sets |
| ⭐ **Favorites** | Save repos locally for later viewing |
| 🔗 **Share** | One-click copy repo link |
| ⌨️ **Keyboard Shortcuts** | `/` search, `T` theme, `B` favorites, `J/K` scroll, `G` top |
| 📊 **Language Stats** | Top language distribution with click-to-filter |
| 📡 **RSS Feed** | Download RSS subscription file |
| 📱 **PWA Support** | Add to home screen, use like a native app |
| ✨ **Glassmorphism** | Frosted glass header effect |
| 📱 **Mobile Optimized** | Optimized layout and interactions for mobile |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search box |
| `T` | Toggle dark/light mode |
| `B` | Open favorites |
| `J` | Scroll down |
| `K` | Scroll up |
| `G` | Scroll to top |

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS 4
- **Backend**: Cloudflare Pages Functions / Vercel Serverless Functions
- **API**: GitHub Search API
- **Icons**: Phosphor Icons
- **Translation**: MyMemory Translation API
- **Deployment**: Cloudflare Pages (Global CDN, accessible from China)

### Live Demo

**Cloudflare Pages (Recommended, works in China):**
```
https://github-trending-aqb.pages.dev
```

**Vercel (International):**
```
https://github-trending-pearl.vercel.app
```

### Local Development

```bash
# Clone the repo
git clone https://github.com/a3327564254/github-trending.git
cd github-trending

# Install dependencies
npm install

# Start backend (proxy needed to access GitHub API)
node server.js

# Start frontend (new terminal)
npm run dev
```

Visit http://localhost:5173

### Deployment

**Cloudflare Pages:**
1. Fork this repo
2. Connect GitHub repo in Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`

**Vercel:**
```bash
vercel --prod
```

### Free Tier Limits

| Platform | Limit |
|----------|-------|
| Cloudflare Pages static | Unlimited |
| Cloudflare Functions (API) | 100,000 requests/day |
| Vercel | 100GB bandwidth/month |

### Project Structure

```
github-trending/
├── api/
│   └── search.ts              # Vercel Serverless Function
├── functions/
│   └── api/
│       └── search.ts          # Cloudflare Pages Function
├── public/
│   ├── favicon.svg            # Favicon
│   ├── manifest.json          # PWA config
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/
│   │   ├── FavoritesPage.tsx  # Favorites modal
│   │   ├── FilterBar.tsx      # Filter bar (time/language/topic/search)
│   │   ├── Footer.tsx         # Footer (RSS download)
│   │   ├── Header.tsx         # Header (favorites/translate/theme)
│   │   ├── HeroSection.tsx    # Hero section
│   │   ├── LoadingSkeleton.tsx # Loading skeleton
│   │   ├── RepoCard.tsx       # Repo card (favorite/share/download)
│   │   ├── ThemeToggle.tsx    # Theme toggle button
│   │   └── TranslatedText.tsx # Translated text component
│   ├── context/
│   │   ├── FavoritesContext.tsx # Favorites state management
│   │   └── TranslationContext.tsx # Translation state management
│   ├── services/
│   │   ├── favorites.ts       # Favorites service (localStorage)
│   │   ├── rss.ts             # RSS generation service
│   │   └── translate.ts       # Translation service (with cache)
│   ├── api.ts                 # API request wrapper
│   ├── App.tsx                # Main app (with keyboard shortcuts)
│   ├── index.css              # Global styles + theme + glassmorphism
│   ├── main.tsx               # Entry file
│   └── types.ts               # TypeScript type definitions
├── server.js                  # Local dev backend
├── vercel.json                # Vercel deployment config
├── wrangler.toml              # Cloudflare deployment config
└── vite.config.ts             # Vite config (with proxy)
```

---

<div align="center">

**Made with ❤️**

</div>
