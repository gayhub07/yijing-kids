-- ===========================================
-- 每日签到功能 - 数据库迁移
-- 执行时间：2026-03-10
-- ===========================================

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

-- ===========================================
-- 验证查询（执行后运行）
-- ===========================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_signins';
