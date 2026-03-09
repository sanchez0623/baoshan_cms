# 宝山光通信 CMS

光通信行业轻量 CMS 系统，基于 **Next.js 14 + Supabase + Netlify** 构建。

## 技术架构

| 层级 | 技术栈 |
|------|--------|
| 前端框架 | Next.js 14 (App Router, RSC) |
| UI 样式 | Tailwind CSS v4 |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Supabase Auth |
| 部署 | Netlify |
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

### 3. 部署到 Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 中 "New site from Git" 连接仓库
3. Build settings 已通过 `netlify.toml` 自动配置
4. 在 Netlify > Site settings > Environment variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 触发重新部署

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
└── netlify.toml            # Netlify 部署配置
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
- **分析统计**：集成 Vercel Analytics 或 Umami
