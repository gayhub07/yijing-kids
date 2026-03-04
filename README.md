# 易经小课堂 🎭

> 面向 3-12 岁儿童的易经学习互动应用

## ✨ 功能模块

### 🏠 首页
- 欢迎区 + 今日进度
- 功能入口导航
- 每日推荐内容

### ☯️ 八卦乐园 `/bagua`
- 8 个卦象学习
- 每卦详情页（故事、关键词、emoji）
- 学习进度追踪
- 完成庆祝动画

### 📖 故事时光 `/stories`
- 64 卦完整故事
- 分页阅读体验
- 难度分级（启蒙/探索/进阶）
- 阅读进度追踪

### 🔮 小小占卜师 `/divination`
- 摇签占卜游戏
- 8 卦完整结果解读
- 历史记录保存

### 👤 个人中心 `/profile`
- 学习统计数据
- 成就系统（9 个成就）
- 编辑资料（昵称 + 头像）

### ⚙️ 设置 `/settings`
- 应用设置

### ❓ 帮助中心 `/help`
- 使用帮助

### ℹ️ 关于我们 `/about`
- 项目介绍

## 🛠 技术栈

- **框架**: SvelteKit 2.x + Svelte 5
- **构建工具**: Vite 7.x
- **样式**: TailwindCSS 4.x (CSS Nesting)
- **数据库**: Supabase (PostgreSQL + Auth)
- **代码规范**: Biome
- **包管理**: pnpm

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 Supabase 配置

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📁 项目结构

```
src/
├── app.css                 # 全局样式
├── lib/
│   ├── components/         # 可复用组件
│   │   ├── BaguaCard.svelte
│   │   ├── BottomNav.svelte
│   │   ├── FeatureCard.svelte
│   │   ├── ProgressRing.svelte
│   │   └── StoryCard.svelte
│   ├── data/
│   │   └── stories-extra.ts  # 64卦故事数据
│   └── supabase/
│       ├── api.ts          # API 调用
│       ├── auth.ts         # 认证逻辑
│       ├── client.ts       # Supabase 客户端
│       └── database.types.ts
└── routes/
    ├── +page.svelte        # 首页
    ├── bagua/              # 八卦乐园
    ├── stories/            # 故事时光
    ├── divination/         # 小小占卜师
    ├── profile/            # 个人中心
    ├── settings/           # 设置
    ├── help/               # 帮助中心
    └── about/              # 关于我们
```

## 📊 数据库表

- `profiles` - 用户资料
- `bagua_progress` - 八卦学习进度
- `story_progress` - 故事阅读进度
- `divination_history` - 占卜历史
- `achievements` - 成就记录

## 📝 开发规范

- 使用 Svelte 5 runes 语法 (`$state`, `$derived`, `$effect`)
- 样式优先使用 Tailwind，复杂场景使用 CSS Nesting
- 所有 API 调用放在 `$lib/supabase/api.ts`
- 使用 Biome 进行代码格式化和 lint

## 📄 License

ISC

---

Made with ❤️ for kids learning Yijing
