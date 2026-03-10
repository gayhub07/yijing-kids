# 执行数据库迁移指南

## 方式一：Supabase Dashboard（推荐）

### 步骤

1. **打开 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard/project/jyalotiourdqocosdiaj/sql/new
   - 这是 SQL Editor 页面

2. **复制并执行 SQL**
   
   打开文件 `supabase/migrations/20260310103000_create_daily_signins.sql`，复制全部内容，粘贴到 SQL Editor 中，然后点击 **Run** 按钮。

3. **验证执行结果**
   
   执行成功后，在左侧菜单点击 **Table Editor**，应该能看到新创建的 `daily_signins` 表。

---

## 方式二：Supabase CLI（如果你安装了）

```bash
# 安装 Supabase CLI（如果还没有）
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref jyalotiourdqocosdiaj

# 推送迁移
supabase db push
```

---

## SQL 内容

```sql
-- 创建每日签到记录表
CREATE TABLE IF NOT EXISTS daily_signins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, signin_date) -- 同一天只能签到一次
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_daily_signins_user_id ON daily_signins(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_signins_date ON daily_signins(signin_date);
CREATE INDEX IF NOT EXISTS idx_daily_signins_user_date ON daily_signins(user_id, signin_date DESC);

-- 添加 RLS 策略
ALTER TABLE daily_signins ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的签到记录
CREATE POLICY "Users can view own signins"
  ON daily_signins FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的签到记录
CREATE POLICY "Users can insert own signins"
  ON daily_signins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 添加 comments
COMMENT ON TABLE daily_signins IS '每日签到记录表';
COMMENT ON COLUMN daily_signins.id IS '签到记录 ID';
COMMENT ON COLUMN daily_signins.user_id IS '用户 ID';
COMMENT ON COLUMN daily_signins.signin_date IS '签到日期';
COMMENT ON COLUMN daily_signins.points IS '获得积分';
COMMENT ON COLUMN daily_signins.created_at IS '创建时间';
```

---

## 验证迁移成功

执行以下 SQL 检查表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'daily_signins';

-- 检查表结构
\d daily_signins

-- 检查 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'daily_signins';
```

---

## 迁移后测试

1. 启动开发服务器：
   ```bash
   pnpm dev --host
   ```

2. 访问签到页面：
   - http://localhost:5173/signin

3. 点击"立即签到"按钮，应该能正常签到并获得积分。

---

*创建时间：2026-03-10*
