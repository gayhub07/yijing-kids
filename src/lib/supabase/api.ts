import { getSupabaseClient } from './client'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type BaguaProgress = Database['public']['Tables']['bagua_progress']['Row']
type StoryProgress = Database['public']['Tables']['story_progress']['Row']
type DivinationHistory = Database['public']['Tables']['divination_history']['Row']

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
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
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
export async function getBaguaProgress(userId: string): Promise<BaguaProgress[]> {
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
export async function updateBaguaProgress(userId: string, guaName: string, learned: boolean): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('bagua_progress')
    .upsert({
      user_id: userId,
      gua_name: guaName,
      learned,
      learned_at: learned ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,gua_name'
    })
  
  if (error) {
    console.error('Error updating bagua progress:', error)
    throw error
  }
}

// 获取故事阅读进度
export async function getStoryProgress(userId: string): Promise<StoryProgress[]> {
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
export async function updateStoryProgress(userId: string, storyId: number, guaName: string, read: boolean): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('story_progress')
    .upsert({
      user_id: userId,
      story_id: storyId,
      gua_name: guaName,
      read,
      read_at: read ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,story_id'
    })
  
  if (error) {
    console.error('Error updating story progress:', error)
    throw error
  }
}

// 添加占卜记录
export async function addDivinationRecord(userId: string, guaName: string, result: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('divination_history')
    .insert({
      user_id: userId,
      gua_name: guaName,
      result
    })
  
  if (error) {
    console.error('Error adding divination record:', error)
    throw error
  }
}

// 获取占卜历史
export async function getDivinationHistory(userId: string, limit = 10): Promise<DivinationHistory[]> {
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

// 打卡
export async function checkIn(userId: string): Promise<{ streak: number; isNewDay: boolean }> {
  const profile = await getProfile(userId)
  if (!profile) throw new Error('Profile not found')
  
  const today = new Date().toISOString().split('T')[0]
  const lastCheckIn = profile.last_check_in
  
  if (lastCheckIn === today) {
    return { streak: profile.streak_days, isNewDay: false }
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const isContinuous = lastCheckIn === yesterdayStr
  const newStreak = isContinuous ? profile.streak_days + 1 : 1
  
  await updateProfile(userId, {
    streak_days: newStreak,
    last_check_in: today
  })
  
  return { streak: newStreak, isNewDay: true }
}
