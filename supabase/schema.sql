-- 儿童易经学习App 数据库表结构
-- 请在 Supabase Dashboard -> SQL Editor 中执行此脚本

-- 1. 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT DEFAULT '小易',
  avatar TEXT DEFAULT '🦊',
  age INTEGER DEFAULT 7,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'explorer', 'advanced')),
  streak_days INTEGER DEFAULT 0,
  last_check_in DATE
);

-- 2. 八卦学习进度表
CREATE TABLE IF NOT EXISTS bagua_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  gua_name TEXT NOT NULL,
  learned BOOLEAN DEFAULT FALSE,
  learned_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, gua_name)
);

-- 3. 故事阅读进度表
CREATE TABLE IF NOT EXISTS story_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  story_id INTEGER NOT NULL,
  gua_name TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, story_id)
);

-- 4. 占卜历史表
CREATE TABLE IF NOT EXISTS divination_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  gua_name TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 成就表
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bagua_progress_user ON bagua_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_story_progress_user ON story_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_divination_user ON divination_history(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- RLS (Row Level Security) 策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bagua_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE divination_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- bagua_progress 策略
CREATE POLICY "Users can view own bagua progress" ON bagua_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bagua progress" ON bagua_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bagua progress" ON bagua_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- story_progress 策略
CREATE POLICY "Users can view own story progress" ON story_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own story progress" ON story_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own story progress" ON story_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- divination_history 策略
CREATE POLICY "Users can view own divination history" ON divination_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own divination history" ON divination_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- achievements 策略
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar, age, level)
  VALUES (NEW.id, '小易', '🦊', 7, 'beginner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 为新用户初始化八卦进度
CREATE OR REPLACE FUNCTION public.init_user_bagua_progress()
RETURNS TRIGGER AS $$
DECLARE
  gua RECORD;
BEGIN
  FOR gua IN SELECT unnest(ARRAY['乾', '坤', '震', '巽', '坎', '离', '艮', '兑']) AS name LOOP
    INSERT INTO public.bagua_progress (user_id, gua_name, learned)
    VALUES (NEW.id, gua.name, FALSE);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.init_user_bagua_progress();
