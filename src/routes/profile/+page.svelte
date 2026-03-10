<script lang="ts">
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import {
  getBaguaProgress,
  getDivinationHistory,
  getProfile,
  getStoryProgress,
  getTotalPoints,
  updateProfile,
} from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'

// 成就定义
const achievementDefs = [
  {
    id: 'first_learn',
    name: '初入易门',
    icon: '🌱',
    desc: '完成第一次学习',
    condition: (stats: any) => stats.baguaLearned >= 1,
  },
  {
    id: 'bagua_4',
    name: '八卦新手',
    icon: '☯️',
    desc: '学习4个卦象',
    condition: (stats: any) => stats.baguaLearned >= 4,
  },
  {
    id: 'bagua_8',
    name: '八卦大师',
    icon: '🏆',
    desc: '学习全部8个卦象',
    condition: (stats: any) => stats.baguaLearned >= 8,
  },
  {
    id: 'story_5',
    name: '故事爱好者',
    icon: '📖',
    desc: '阅读5个故事',
    condition: (stats: any) => stats.storiesRead >= 5,
  },
  {
    id: 'story_10',
    name: '故事达人',
    icon: '📚',
    desc: '阅读10个故事',
    condition: (stats: any) => stats.storiesRead >= 10,
  },
  {
    id: 'divine_3',
    name: '占卜学徒',
    icon: '🔮',
    desc: '完成3次占卜',
    condition: (stats: any) => stats.divinationCount >= 3,
  },
  {
    id: 'divine_5',
    name: '占卜师',
    icon: '✨',
    desc: '完成5次占卜',
    condition: (stats: any) => stats.divinationCount >= 5,
  },
  {
    id: 'streak_3',
    name: '坚持者',
    icon: '🔥',
    desc: '连续打卡3天',
    condition: (stats: any) => stats.streakDays >= 3,
  },
  {
    id: 'streak_7',
    name: '毅力之星',
    icon: '⭐',
    desc: '连续打卡7天',
    condition: (stats: any) => stats.streakDays >= 7,
  },
]

let profile = $state<any>(null)
let stats = $state({
  learningDays: 0,
  baguaLearned: 0,
  storiesRead: 0,
  divinationCount: 0,
  streakDays: 0,
  totalPoints: 0,
})
let loading = $state(true)
let showEditModal = $state(false)
let editName = $state('')
let editAvatar = $state('')
let isSaving = $state(false)

// 头像选项
const avatarOptions = [
  '🦊',
  '🐼',
  '🐰',
  '🐱',
  '🐶',
  '🦁',
  '🐯',
  '🐻',
  '🐨',
  '🐸',
  '🦉',
  '🦄',
]

// 计算解锁的成就
const achievements = $derived(
  achievementDefs.map((a) => ({
    ...a,
    unlocked: a.condition(stats),
  })),
)

const unlockedCount = $derived(achievements.filter((a) => a.unlocked).length)

// 加载数据
async function loadData() {
  if (!browser || !$auth.user) return

  loading = true
  try {
    const [profileData, baguaData, storyData, divinationData, pointsData] =
      await Promise.all([
        getProfile($auth.user.id),
        getBaguaProgress($auth.user.id),
        getStoryProgress($auth.user.id),
        getDivinationHistory($auth.user.id, 100),
        getTotalPoints($auth.user.id),
      ])

    profile = profileData

    if (profileData) {
      editName = profileData.name || ''
      editAvatar = profileData.avatar || '🦊'
    }

    stats = {
      learningDays: profileData?.streak_days || 0,
      baguaLearned: baguaData.filter((b) => b.learned).length,
      storiesRead: storyData.filter((s) => s.read).length,
      divinationCount: divinationData.length,
      streakDays: profileData?.streak_days || 0,
      totalPoints: pointsData,
    }
  } catch (error) {
    console.error('Error loading profile data:', error)
  }
  loading = false
}

// 打开编辑弹窗
function openEditModal() {
  showEditModal = true
}

// 关闭编辑弹窗
function closeEditModal() {
  showEditModal = false
}

// 选择头像
function selectAvatar(avatar: string) {
  editAvatar = avatar
}

// 保存编辑
async function saveEdit() {
  if (!browser || !$auth.user || isSaving) return

  isSaving = true
  try {
    await updateProfile($auth.user.id, {
      name: editName,
      avatar: editAvatar,
    })

    profile = {
      ...profile,
      name: editName,
      avatar: editAvatar,
    }

    closeEditModal()
  } catch (error) {
    console.error('Error saving profile:', error)
  }
  isSaving = false
}

onMount(() => {
  if (browser && $auth.user) {
    loadData()
  }
})

$effect(() => {
  if (browser && $auth.user && loading) {
    loadData()
  }
})
</script>

<svelte:head>
  <title>我的 - 易经小课堂</title>
</svelte:head>

{#if loading}
  <div class="loading">
    <p>加载中...</p>
  </div>
{:else}
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="avatar">{profile?.avatar || '🦊'}</div>
      <div class="user-info">
        <h1>{profile?.name || '小易'}</h1>
        <span class="level">
          {#if profile?.level === 'beginner'}
            🌱 启蒙期
          {:else if profile?.level === 'explorer'}
            🌿 探索期
          {:else}
            🌳 进阶期
          {/if}
        </span>
      </div>
      <button class="edit-btn" onclick={openEditModal}>编辑</button>
    </div>
    
    <!-- 学习统计 -->
    <section class="stats-section">
      <h2>学习统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📅</span>
          <span class="stat-value">{stats.streakDays}</span>
          <span class="stat-label">连续打卡</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{stats.totalPoints}</span>
          <span class="stat-label">总积分</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">☯️</span>
          <span class="stat-value">{stats.baguaLearned}/8</span>
          <span class="stat-label">已学卦象</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📖</span>
          <span class="stat-value">{stats.storiesRead}</span>
          <span class="stat-label">已读故事</span>
        </div>
      </div>
    </section>
    
    <!-- 成就系统 -->
    <section class="achievements-section">
      <div class="section-header">
        <h2>我的成就</h2>
        <span class="count">{unlockedCount}/{achievements.length}</span>
      </div>
      <div class="achievements-grid">
        {#each achievements as achievement}
          <div class="achievement {achievement.unlocked ? 'unlocked' : 'locked'}">
            <span class="achievement-icon">{achievement.icon}</span>
            <span class="achievement-name">{achievement.name}</span>
          </div>
        {/each}
      </div>
    </section>
    
    <!-- 快捷入口 -->
    <section class="settings-section">
      <a href="/signin" class="setting-item highlight">
        <span class="setting-icon">📅</span>
        <span>每日签到</span>
        <span class="arrow">→</span>
      </a>
      <a href="/settings" class="setting-item">
        <span class="setting-icon">⚙️</span>
        <span>设置</span>
        <span class="arrow">→</span>
      </a>
      <a href="/help" class="setting-item">
        <span class="setting-icon">❓</span>
        <span>帮助中心</span>
        <span class="arrow">→</span>
      </a>
      <a href="/about" class="setting-item">
        <span class="setting-icon">ℹ️</span>
        <span>关于我们</span>
        <span class="arrow">→</span>
      </a>
    </section>
  </div>
  
  <!-- 编辑弹窗 -->
  {#if showEditModal}
    <div class="modal-overlay" onclick={closeEditModal}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <h2>编辑资料</h2>
        
        <div class="form-group">
          <label>昵称</label>
          <input 
            type="text" 
            bind:value={editName} 
            placeholder="请输入昵称"
            maxlength="10"
          />
        </div>
        
        <div class="form-group">
          <label>选择头像</label>
          <div class="avatar-grid">
            {#each avatarOptions as avatar}
              <button 
                class="avatar-option {editAvatar === avatar ? 'selected' : ''}"
                onclick={() => selectAvatar(avatar)}
              >
                {avatar}
              </button>
            {/each}
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-cancel" onclick={closeEditModal}>取消</button>
          <button class="btn btn-save" onclick={saveEdit} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #8E8E93;
  }

  .profile-page {
    padding: 16px;
    padding-top: calc(16px + var(--safe-area-top, 0px));
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, #FF9500, #FF2D55);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;

    .avatar {
      font-size: 48px;
      width: 72px;
      height: 72px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      flex: 1;

      h1 {
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin-bottom: 4px;
      }

      .level {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 13px;
      }
    }

    .edit-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.12s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .stats-section, .achievements-section, .settings-section {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1C1C1E;
      margin-bottom: 16px;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      margin-bottom: 0;
    }

    .count {
      font-size: 14px;
      color: #8E8E93;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    background: #F2F2F7;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .stat-icon {
      font-size: 24px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1C1C1E;
    }

    .stat-label {
      font-size: 12px;
      color: #8E8E93;
    }
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .achievement {
    background: #F2F2F7;
    border-radius: 12px;
    padding: 12px;
    text-align: center;
    transition: transform 0.12s;
    -webkit-tap-highlight-color: transparent;

    &.unlocked {
      background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
    }

    &.locked {
      opacity: 0.5;
    }

    &:active {
      transform: scale(0.95);
    }

    .achievement-icon {
      display: block;
      font-size: 28px;
      margin-bottom: 4px;
    }

    .achievement-name {
      font-size: 11px;
      color: #1C1C1E;
      font-weight: 500;
    }
  }

  .setting-item {
    display: flex;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #F2F2F7;
    text-decoration: none;
    color: #1C1C1E;
    transition: background 0.12s;
    -webkit-tap-highlight-color: transparent;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #F2F2F7;
    }

    &.highlight {
      background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
      margin: 0 -16px 16px -16px;
      padding: 14px 16px;
      border-radius: 12px;
      border-bottom: none;

      &:active {
        background: linear-gradient(135deg, #FFEDD5, #FFE4CC);
      }

      .setting-icon {
        font-size: 24px;
      }
    }

    .setting-icon {
      font-size: 20px;
      margin-right: 12px;
    }

    span:nth-child(2) {
      flex: 1;
      font-size: 16px;
    }

    .arrow {
      color: #C7C7CC;
      font-size: 18px;
    }
  }

  /* 弹窗样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 24px;
  }

  .modal {
    background: white;
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 360px;
    animation: slideUp 0.3s ease-out;

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #1C1C1E;
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E5E5EA;
      border-radius: 12px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #FF9500;
      }
    }
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }

  .avatar-option {
    width: 100%;
    aspect-ratio: 1;
    border: 2px solid #E5E5EA;
    border-radius: 12px;
    background: white;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.12s;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    &.selected {
      border-color: #FF9500;
      background: #FFF7ED;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .modal-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s;
    -webkit-tap-highlight-color: transparent;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.btn-cancel {
      background: #F2F2F7;
      color: #8E8E93;

      &:active:not(:disabled) {
        transform: scale(0.96) translateY(2px);
      }
    }

    &.btn-save {
      background: linear-gradient(135deg, #FF9500, #FF2D55);
      color: white;

      &:active:not(:disabled) {
        transform: scale(0.96) translateY(2px);
      }
    }
  }
</style>
