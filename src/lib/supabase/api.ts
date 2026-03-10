import { getSupabaseClient } from './client'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type BaguaProgress = Database['public']['Tables']['bagua_progress']['Row']
type StoryProgress = Database['public']['Tables']['story_progress']['Row']
type DivinationHistory =
  Database['public']['Tables']['divination_history']['Row']
type DailySignin = Database['public']['Tables']['daily_signins']['Row']

// 获取用户资料
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

// 更新用户资料
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>,
): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// 获取八卦学习进度
export async function getBaguaProgress(
  userId: string,
): Promise<BaguaProgress[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('bagua_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching bagua progress:', error)
    return []
  }

  return data || []
}

// 更新八卦学习状态
export async function updateBaguaProgress(
  userId: string,
  guaName: string,
  learned: boolean,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('bagua_progress').upsert(
    {
      user_id: userId,
      gua_name: guaName,
      learned,
      learned_at: learned ? new Date().toISOString() : null,
    },
    {
      onConflict: 'user_id,gua_name',
    },
  )

  if (error) {
    console.error('Error updating bagua progress:', error)
    throw error
  }
}

// 获取故事阅读进度
export async function getStoryProgress(
  userId: string,
): Promise<StoryProgress[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('story_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching story progress:', error)
    return []
  }

  return data || []
}

// 更新故事阅读状态
export async function updateStoryProgress(
  userId: string,
  storyId: number,
  guaName: string,
  read: boolean,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('story_progress').upsert(
    {
      user_id: userId,
      story_id: storyId,
      gua_name: guaName,
      read,
      read_at: read ? new Date().toISOString() : null,
    },
    {
      onConflict: 'user_id,story_id',
    },
  )

  if (error) {
    console.error('Error updating story progress:', error)
    throw error
  }
}

// 添加占卜记录
export async function addDivinationRecord(
  userId: string,
  guaName: string,
  result: string,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('divination_history').insert({
    user_id: userId,
    gua_name: guaName,
    result,
  })

  if (error) {
    console.error('Error adding divination record:', error)
    throw error
  }
}

// 获取占卜历史
export async function getDivinationHistory(
  userId: string,
  limit = 10,
): Promise<DivinationHistory[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('divination_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching divination history:', error)
    return []
  }

  return data || []
}

// 获取 Asia/Shanghai 时区的日期字符串
function getTodayDateString(): string {
  const now = new Date()
  return now
    .toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-')
}

// 打卡（旧版，保留兼容）
export async function checkIn(
  userId: string,
): Promise<{ streak: number; isNewDay: boolean }> {
  const profile = await getProfile(userId)
  if (!profile) throw new Error('Profile not found')

  const today = getTodayDateString()
  const lastCheckIn = profile.last_check_in

  if (lastCheckIn === today) {
    return { streak: profile.streak_days, isNewDay: false }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday
    .toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-')

  const isContinuous = lastCheckIn === yesterdayStr
  const newStreak = isContinuous ? profile.streak_days + 1 : 1

  await updateProfile(userId, {
    streak_days: newStreak,
    last_check_in: today,
  })

  return { streak: newStreak, isNewDay: true }
}

// 每日签到（新版，带积分）
export async function dailySignin(userId: string): Promise<{
  success: boolean
  points: number
  streak: number
  message: string
  signin?: DailySignin
}> {
  const supabase = getSupabaseClient()
  const today = getTodayDateString()

  // 检查今天是否已签到
  const { data: existingSignin } = await supabase
    .from('daily_signins')
    .select('*')
    .eq('user_id', userId)
    .eq('signin_date', today)
    .single()

  if (existingSignin) {
    // 已签到，返回当前连续天数
    const profile = await getProfile(userId)
    return {
      success: false,
      points: 0,
      streak: profile?.streak_days || 0,
      message: '今天已经签到过了',
    }
  }

  // 计算积分（连续签到奖励）
  const profile = await getProfile(userId)
  if (!profile) throw new Error('Profile not found')

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday
    .toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-')

  const isContinuous = profile.last_check_in === yesterdayStr
  const newStreak = isContinuous ? profile.streak_days + 1 : 1

  // 基础积分 10 分，连续签到额外奖励
  let points = 10
  if (newStreak >= 7)
    points += 10 // 连续 7 天 +10 分
  else if (newStreak >= 3) points += 5 // 连续 3 天 +5 分

  // 插入签到记录
  const { data: signin, error: signinError } = await supabase
    .from('daily_signins')
    .insert({
      user_id: userId,
      signin_date: today,
      points,
    })
    .select()
    .single()

  if (signinError) {
    // 可能是唯一约束冲突（并发签到）
    if (signinError.code === '23505') {
      return {
        success: false,
        points: 0,
        streak: newStreak,
        message: '今天已经签到过了',
      }
    }
    throw signinError
  }

  // 更新用户资料
  await updateProfile(userId, {
    streak_days: newStreak,
    last_check_in: today,
  })

  return {
    success: true,
    points,
    streak: newStreak,
    message: `签到成功！获得 ${points} 积分`,
    signin,
  }
}

// 获取签到历史
export async function getSigninHistory(
  userId: string,
  limit = 30,
): Promise<DailySignin[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('daily_signins')
    .select('*')
    .eq('user_id', userId)
    .order('signin_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching signin history:', error)
    return []
  }

  return data || []
}

// 获取连续签到天数
export async function getSigninStreak(userId: string): Promise<number> {
  const profile = await getProfile(userId)
  return profile?.streak_days || 0
}

// 获取总签到积分
export async function getTotalPoints(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('get_total_points', {
    user_id: userId,
  })

  if (error) {
    // 如果没有 RPC 函数，手动计算
    const { data: signins } = await supabase
      .from('daily_signins')
      .select('points')
      .eq('user_id', userId)

    return signins?.reduce((sum, s) => sum + s.points, 0) || 0
  }

  return data || 0
}
