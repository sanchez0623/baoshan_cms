# 宝山光通信 CMS

光通信行业轻量 CMS 系统，基于 **Next.js 16 + Supabase** 构建。

## 技术架构

| 层级 | 技术栈 |
|------|--------|
| 前端框架 | Next.js 16 (App Router, RSC) |
| UI 样式 | Tailwind CSS v4 |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Supabase Auth |
| 应用部署 | Docker（推荐部署到 Coolify / Railway / Render） |
| 数据与认证 | Supabase |
| 语言 | TypeScript |

## 功能模块

### 前台页面
- **首页**：Hero 横幅轮播 + 明星产品 + 新闻资讯 + 企业优势
- **产品中心**：分类筛选 + 产品列表 + 产品详情（含规格表）
- **新闻资讯**：文章列表 + 文章详情（支持 Markdown 格式）
- **关于我们**：公司简介 + 企业价值观 + 发展历程 + 资质认证
- **联系我们**：联系信息 + 在线留言表单

### 后台管理（需登录）
- **控制台**：数据统计概览 + 快捷操作
- **产品管理**：CRUD + 分类 + 精选 + 发布状态
- **新闻管理**：CRUD + 精选 + 发布时间控制
- **横幅管理**：Hero 横幅的增删改 + 排序 + 启用/停用
- **留言管理**：查看客户留言 + 标为已读
- **网站设置**：公司信息、联系方式、ICP 备案等全局配置

## 快速部署

### 1. 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 在 SQL Editor 中依次执行：
   - `supabase/migrations/001_initial_schema.sql`（建表 + RLS 策略）
   - `supabase/migrations/002_seed_data.sql`（示例数据，可选）
3. 在 Authentication > Users 中创建管理员账号
4. 获取 Project URL 和 Anon Key（Settings > API）

### 2. 本地开发

```bash
# 克隆后安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase URL 和 Anon Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前台，http://localhost:3000/admin/login 进入后台。

### 3. 部署方案分析

这个项目并不是“纯前端静态站”，而是一个 **前后端一体的 Next.js 应用**：

- 前端：官网页面、后台管理界面
- 应用层后端：Next.js SSR、路由中间件、`/api/contact` 留言接口
- 数据与认证后端：Supabase（PostgreSQL + Auth）

因此，不推荐为了迁移平台而把它强行拆成“静态前端 + 单独后端”，那样会引入额外改造成本。

### 4. 推荐部署方案

#### 方案 A（推荐）：应用层 Docker + Supabase

- **前端 / 应用层**：将整个 Next.js 项目作为一个 Node 容器部署到 **Coolify、Railway 或 Render**
- **后端 / 数据层**：继续使用 **Supabase**

推荐这个方案的原因：

1. **改动最小**：保留 App Router、SSR、Middleware、API Route 的现有实现
2. **不依赖 Vercel / Netlify 专用适配器**
3. **迁移简单**：仓库已提供 `Dockerfile`，兼容大多数支持 Docker 的平台
4. **职责清晰**：应用层和数据层分开，后续扩容也更方便

如果你希望：

- **更省心**：优先选 Railway / Render
- **更可控、长期成本更低**：优先选 Coolify + 自己的 VPS

> 不建议当前阶段改成 Cloudflare Pages 之类的“前端托管”方案，因为本项目依赖 SSR、鉴权中间件和服务端路由，迁移成本会明显更高。

### 5. 使用 Docker 部署应用层

1. 将代码推送到 GitHub
2. 在 Coolify、Railway 或 Render 中创建一个新的 **Docker / Container** 服务
3. 指向当前仓库，平台会自动使用仓库根目录的 `Dockerfile`
4. 配置以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 设置对外端口为 `3000`
6. 完成部署后访问站点，并验证：
   - 前台页面可打开
   - `/admin/login` 可访问
   - 联系表单可正常提交

### 6. 本地验证 Docker 构建

```bash
docker build -t baoshan-cms .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here \
  baoshan-cms
```

## 目录结构

```
baoshan_cms/
├── app/
│   ├── (public)/           # 前台路由组
│   │   ├── page.tsx        # 首页
│   │   ├── products/       # 产品中心
│   │   ├── news/           # 新闻资讯
│   │   ├── about/          # 关于我们
│   │   └── contact/        # 联系我们
│   ├── admin/              # 后台管理
│   │   ├── login/          # 登录页
│   │   ├── dashboard/      # 控制台
│   │   ├── products/       # 产品管理
│   │   ├── news/           # 新闻管理
│   │   ├── banners/        # 横幅管理
│   │   ├── contacts/       # 留言管理
│   │   └── settings/       # 网站设置
│   └── api/contact/        # 留言提交 API
├── components/
│   ├── public/             # 前台组件（Header, Footer, ContactForm）
│   └── admin/              # 后台组件（Sidebar, Forms, etc.）
├── lib/supabase/           # Supabase 客户端配置
├── types/                  # TypeScript 类型定义
├── supabase/migrations/    # 数据库迁移脚本
├── middleware.ts            # 后台路由认证保护
├── Dockerfile             # 通用 Docker 部署配置
└── .dockerignore          # Docker 构建忽略规则
```

## 数据库表结构

| 表名 | 说明 |
|------|------|
| `banners` | Hero 横幅 |
| `product_categories` | 产品分类 |
| `products` | 产品（含 JSONB 规格） |
| `articles` | 新闻/博客文章 |
| `site_settings` | 网站全局配置（KV） |
| `contact_submissions` | 客户留言 |

所有表均启用 Row Level Security (RLS)：
- 公开数据（产品、文章、横幅、设置）：公众可读
- 管理员（authenticated 用户）：完全 CRUD 权限
- 留言表：公众可写入，管理员可读

## 扩展建议

- **图片上传**：集成 Supabase Storage 或 Cloudinary
- **富文本编辑器**：集成 TipTap 或 Quill
- **多语言**：使用 next-intl
- **SEO 增强**：添加 sitemap.xml、robots.txt
- **分析统计**：集成 Plausible 或 Umami
