# Supabase 数据库配置指南

## 🎯 快速开始（5分钟）

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com/
2. 点击 "New Project"
3. 填写项目名称（如：chinese-poetry）
4. 选择地区（建议选择 Asia Pacific - Singapore）
5. 等待项目创建完成（约2分钟）

### 2. 获取 API 密钥

创建完成后，进入项目 Dashboard：

1. 点击左侧菜单 **Settings** → **API**
2. 找到以下信息：
   - **Project URL** (如: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** API key (以 `eyJhbG...` 开头)

### 3. 配置环境变量

编辑文件 `.env.local`：

```bash
# 将以下值替换为你的 Supabase 项目信息
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 创建数据库表

1. 在 Supabase Dashboard 中，点击左侧 **SQL Editor**
2. 点击 **New query**
3. 复制粘贴以下内容（来自 `lib/supabase-schema.sql`）：

```sql
-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  poem_slug TEXT NOT NULL,
  poet_name TEXT NOT NULL,
  poem_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, poem_slug)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_slug ON favorites(poem_slug);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid()::text = user_id);
```

4. 点击 **Run** 执行 SQL

### 5. 配置 Clerk 集成（重要）

1. 在 Supabase Dashboard，点击 **Authentication** → **Providers**
2. 启用 **Clerk** 集成或配置 JWT 验证
3. 或者使用更简单的方法：在 SQL Editor 执行：

```sql
-- 允许已认证用户访问（配合 Clerk）
CREATE POLICY "Enable read access for authenticated users"
  ON favorites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON favorites FOR DELETE
  TO authenticated
  USING (true);
```

### 6. 本地测试

```bash
cd /workspaces/04-classify/my-app
npm run dev
```

访问 http://localhost:3000 测试收藏功能。

---

## ✅ 功能验证清单

- [ ] 登录后显示用户头像
- [ ] 进入诗词详情页，看到"收藏"按钮
- [ ] 点击"收藏"，按钮变为"已收藏"
- [ ] 访问 /favorites 页面，看到收藏的诗词
- [ ] 点击"取消收藏"，从列表移除
- [ ] 刷新页面，收藏数据保持

---

## 🔧 常见问题

### Q1: 收藏不保存？
**解决**: 检查环境变量是否正确配置，数据库表是否创建。

### Q2: 提示权限错误？
**解决**: 确保执行了 RLS Policy 的 SQL 语句。

### Q3: 跨域问题？
**解决**: Supabase 已自动配置 CORS，无需额外设置。

---

## 📊 数据库结构

```
favorites 表
├── id: UUID (主键)
├── user_id: TEXT (用户ID)
├── poem_slug: TEXT (诗词标识)
├── poet_name: TEXT (诗人名字)
├── poem_title: TEXT (诗词标题)
└── created_at: TIMESTAMP (创建时间)

索引
├── idx_favorites_user_id (按用户查询)
└── idx_favorites_poem_slug (按诗词查询)
```

---

## 🚀 部署到 Vercel

1. 在 Vercel 导入项目
2. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Clerk 相关变量
3. 部署完成！

---

## 📝 注意事项

1. **免费额度**: Supabase 免费版提供 500MB 数据库，足够本项目使用
2. **实时功能**: 如需实时同步，可启用 Supabase Realtime
3. **备份**: 定期导出数据，Supabase 自动每日备份

---

**需要帮助？** 参考 Supabase 官方文档：https://supabase.com/docs
