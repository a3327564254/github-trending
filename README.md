<div align="center">

# GitHub Trending

**实时追踪 GitHub 热门开源项目 / Real-time GitHub Trending Repositories**

[English](#english) | [中文](#中文)

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

</div>

---

## 中文

### 简介

GitHub Trending 是一个现代化的 GitHub 热门项目趋势网站，帮助开发者实时发现和追踪 GitHub 上增长最快的开源项目。

### 核心功能

| 功能 | 说明 |
|------|------|
| 📊 **趋势浏览** | 按今日/本周/本月查看热门项目 |
| 🔍 **搜索** | 按关键词搜索仓库名称、描述、作者 |
| 🌐 **翻译** | 一键将英文描述翻译为中文 |
| ⬇️ **下载** | 直接跳转 Release 页面下载 |
| 🌙 **深色/浅色模式** | 支持主题切换，自动保存偏好 |
| 💻 **语言筛选** | 支持 20 种编程语言过滤 |
| 🏷️ **主题分类** | ML、AI、Web、安全等 12 个主题 |
| 📄 **分页** | 支持翻页浏览大量结果 |

### 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS 4
- **后端**: Vercel Serverless Functions
- **API**: GitHub Search API
- **图标**: Phosphor Icons
- **翻译**: MyMemory Translation API
- **部署**: Vercel（全球 CDN，无需代理）

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

项目已部署到 Vercel，访问地址：

```
https://github-trending-pearl.vercel.app
```

如需重新部署：

```bash
vercel --prod
```

### 项目结构

```
github-trending/
├── api/
│   └── search.ts              # Vercel Serverless Function
├── public/
│   └── favicon.svg            # 网站图标
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx      # 筛选栏（时间/语言/主题/搜索）
│   │   ├── Footer.tsx         # 页脚
│   │   ├── Header.tsx         # 顶部导航（主题切换/翻译）
│   │   ├── HeroSection.tsx    # 首页头部
│   │   ├── LoadingSkeleton.tsx # 加载骨架屏
│   │   ├── RepoCard.tsx       # 仓库卡片（下载按钮）
│   │   ├── ThemeToggle.tsx    # 主题切换按钮
│   │   └── TranslatedText.tsx # 翻译文本组件
│   ├── context/
│   │   └── TranslationContext.tsx # 翻译状态管理
│   ├── services/
│   │   └── translate.ts       # 翻译服务（带缓存）
│   ├── api.ts                 # API 请求封装
│   ├── App.tsx                # 主应用组件
│   ├── index.css              # 全局样式 + 主题变量
│   ├── main.tsx               # 入口文件
│   └── types.ts               # TypeScript 类型定义
├── server.js                  # 本地开发后端
├── vercel.json                # Vercel 部署配置
└── vite.config.ts             # Vite 配置（含代理）
```

---

## English

### Introduction

GitHub Trending is a modern website for tracking trending open-source projects on GitHub. It helps developers discover and follow the fastest-growing repositories in real-time.

### Key Features

| Feature | Description |
|---------|-------------|
| 📊 **Trending** | Browse trending repos by daily/weekly/monthly |
| 🔍 **Search** | Search by repo name, description, or author |
| 🌐 **Translate** | One-click translation of English descriptions to Chinese |
| ⬇️ **Download** | Direct link to Release page for downloads |
| 🌙 **Dark/Light Mode** | Theme toggle with saved preference |
| 💻 **Language Filter** | Filter by 20 programming languages |
| 🏷️ **Topic Categories** | 12 topics: ML, AI, Web, Security, etc. |
| 📄 **Pagination** | Browse through large result sets |

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS 4
- **Backend**: Vercel Serverless Functions
- **API**: GitHub Search API
- **Icons**: Phosphor Icons
- **Translation**: MyMemory Translation API
- **Deployment**: Vercel (Global CDN, no proxy needed)

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

The project is deployed on Vercel:

```
https://github-trending-pearl.vercel.app
```

To redeploy:

```bash
vercel --prod
```

### Project Structure

```
github-trending/
├── api/
│   └── search.ts              # Vercel Serverless Function
├── public/
│   └── favicon.svg            # Favicon
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx      # Filter bar (time/language/topic/search)
│   │   ├── Footer.tsx         # Footer
│   │   ├── Header.tsx         # Header (theme toggle/translate)
│   │   ├── HeroSection.tsx    # Hero section
│   │   ├── LoadingSkeleton.tsx # Loading skeleton
│   │   ├── RepoCard.tsx       # Repo card (download button)
│   │   ├── ThemeToggle.tsx    # Theme toggle button
│   │   └── TranslatedText.tsx # Translated text component
│   ├── context/
│   │   └── TranslationContext.tsx # Translation state management
│   ├── services/
│   │   └── translate.ts       # Translation service (with cache)
│   ├── api.ts                 # API request wrapper
│   ├── App.tsx                # Main app component
│   ├── index.css              # Global styles + theme variables
│   ├── main.tsx               # Entry file
│   └── types.ts               # TypeScript type definitions
├── server.js                  # Local dev backend
├── vercel.json                # Vercel deployment config
└── vite.config.ts             # Vite config (with proxy)
```

---

<div align="center">

**Made with ❤️**

</div>
