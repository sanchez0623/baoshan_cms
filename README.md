# 宝山光通信 CMS

光通信行业轻量 CMS 系统，基于 **Next.js 16 + MySQL** 构建，包含前台展示、后台管理、留言收集与完整初始化 SQL。

## 技术架构

| 层级 | 技术栈 |
|------|--------|
| 运行环境 | Node.js 20+ |
| 前端框架 | Next.js 16 (App Router, React Server Components) |
| UI 样式 | Tailwind CSS v4 |
| 数据库 | MySQL 8+ / MariaDB 10.6+ |
| 数据访问 | mysql2 连接池 + 应用内 API |
| 后台认证 | MySQL 管理员表 + HttpOnly Session Cookie |
| 语言 | TypeScript |

## 功能模块

### 前台页面
- **首页**：Hero 横幅 + 明星产品 + 新闻资讯 + 企业优势
- **产品中心**：分类筛选 + 产品列表 + 产品详情（含规格表）
- **新闻资讯**：文章列表 + 文章详情（支持基础 Markdown 展示）
- **关于我们**：公司简介 + 企业价值观 + 发展历程 + 资质认证
- **联系我们**：联系信息 + 在线留言表单

### 后台管理（需登录）
- **控制台**：产品 / 文章 / 横幅 / 留言统计概览
- **产品管理**：CRUD + 分类 + 精选 + 发布状态
- **新闻管理**：CRUD + 精选 + 发布时间控制
- **横幅管理**：增删改 + 排序 + 启用/停用
- **留言管理**：查看客户留言 + 标为已读
- **网站设置**：公司信息、联系方式、ICP备案等全局配置

## 本地启动（只需配置数据库链接）

### 1. 创建数据库

先在你的 MySQL / MariaDB 实例里创建一个空数据库，例如：

```sql
CREATE DATABASE baoshan_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 导入初始化 SQL

按顺序执行：

```bash
mysql -u root -p baoshan_cms < mysql/001_initial_schema.sql
mysql -u root -p baoshan_cms < mysql/002_seed_data.sql
```

导入完成后，默认后台账号为：

- 邮箱：`admin@example.com`
- 密码：`Admin@123456`

> 建议上线前修改 `mysql/002_seed_data.sql` 中的管理员账号和密码哈希。

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

然后至少配置：

```env
DATABASE_URL=mysql://root:password@127.0.0.1:3306/baoshan_cms
```

生产环境还必须配置：

```env
CMS_SESSION_SECRET=replace-with-a-long-random-string
```

本地开发如果不设置该值，应用会为当前开发进程自动生成一个临时随机 Session Secret。

### 4. 安装并启动

> 需要 **Node.js >= 20**。可使用 `node -v` 查看当前版本，或通过 `.nvmrc` 配合 `nvm use` 切换。

```bash
npm install
npm run dev
```

访问：

- 前台：`http://localhost:3000`
- 后台登录：`http://localhost:3000/admin/login`

## 生产构建验证

```bash
npm run lint
npm run build
```

## 目录结构

```text
baoshan_cms/
├── app/
│   ├── (public)/            # 前台路由组
│   ├── admin/               # 后台管理路由
│   └── api/                 # 联系表单与后台管理 API
├── components/
│   ├── public/              # 前台组件
│   └── admin/               # 后台组件
├── lib/
│   ├── cms-data.ts          # MySQL 查询与写入封装
│   ├── mysql.ts             # MySQL 连接池
│   └── admin-auth.ts        # 后台 Session Cookie 认证
├── mysql/
│   ├── 001_initial_schema.sql
│   └── 002_seed_data.sql
├── types/
└── middleware.ts            # 后台路由认证保护
```

## 数据表说明

| 表名 | 说明 |
|------|------|
| `admin_users` | 后台管理员账号 |
| `banners` | 首页横幅 |
| `product_categories` | 产品分类 |
| `products` | 产品信息（JSON 规格参数） |
| `articles` | 新闻 / 文章 |
| `site_settings` | 网站全局设置 |
| `contact_submissions` | 客户留言 |

## 部署说明

部署时只需要保证：

1. 数据库已经执行过 `mysql/001_initial_schema.sql` 和 `mysql/002_seed_data.sql`
2. 运行环境设置了 `DATABASE_URL`
3. 必须设置 `CMS_SESSION_SECRET`，避免使用数据库连接信息参与生产会话签名

## 扩展建议

- **图片上传**：接入对象存储（COS / OSS / S3 / Cloudinary）
- **富文本编辑器**：集成 TipTap 或 Quill
- **多语言**：使用 next-intl
- **SEO 增强**：添加 sitemap.xml、robots.txt
- **分析统计**：集成 Umami 或 GA4
