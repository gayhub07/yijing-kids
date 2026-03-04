<script lang="ts">
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import {
  checkIn,
  getBaguaProgress,
  getDivinationHistory,
  getProfile,
  getStoryProgress,
} from '$lib/supabase/api'

let profile = $state<any>(null)
let baguaProgress = $state<any[]>([])
let storyProgress = $state<any[]>([])
let divinationCount = $state(0)
let loading = $state(true)

const features = [
  {
    title: '八卦乐园',
    description: '认识神奇的八卦符号',
    icon: '☯️',
    color: 'from-orange-400 to-rose-500',
    href: '/bagua',
  },
  {
    title: '故事时光',
    description: '六十四卦的趣味故事',
    icon: '📖',
    color: 'from-blue-400 to-indigo-500',
    href: '/stories',
  },
  {
    title: '小小占卜师',
    description: '摇一摇，看看运势',
    icon: '🔮',
    color: 'from-purple-400 to-pink-500',
    href: '/divination',
  },
  {
    title: '成长之路',
    description: '记录你的进步',
    icon: '🌟',
    color: 'from-amber-400 to-orange-500',
    href: '/profile',
  },
]

async function loadData() {
  if (!browser || !$auth.user) return

  loading = true

  try {
    const [profileData, baguaData, storyData, divinationData] =
      await Promise.all([
        getProfile($auth.user.id),
        getBaguaProgress($auth.user.id),
        getStoryProgress($auth.user.id),
        getDivinationHistory($auth.user.id),
      ])

    profile = profileData
    baguaProgress = baguaData
    storyProgress = storyData
    divinationCount = divinationData.length
  } catch (error) {
    console.error('Error loading data:', error)
  }

  loading = false
}

async function handleCheckIn() {
  if (!browser || !$auth.user) return
  try {
    const result = await checkIn($auth.user.id)
    if (result.isNewDay) {
      await loadData()
    }
  } catch (error) {
    console.error('Check in error:', error)
  }
}

onMount(() => {
  if (browser && $auth.user) {
    loadData()
  }
})

$effect(() => {
  if (browser && $auth.user && !profile) {
    loadData()
  }
})

const learnedBagua = $derived(baguaProgress.filter((b) => b.learned).length)
const readStories = $derived(storyProgress.filter((s) => s.read).length)

function getLevelText(level: string) {
  switch (level) {
    case 'beginner':
      return '启蒙期'
    case 'explorer':
      return '探索期'
    default:
      return '进阶期'
  }
}
</script>

<svelte:head>
  <title>易经小课堂</title>
</svelte:head>

{#if loading}
  <div class="loading-container">
    <p>加载中...</p>
  </div>
{:else}
  <div class="home-container">
    <!-- 顶部欢迎区 -->
    <header class="header">
      <div class="header-left">
        <div class="avatar">
          {profile?.avatar || '🦊'}
        </div>
        <div class="user-info">
          <h1>你好，{profile?.name || '小易'}！</h1>
          <p>当前阶段：{getLevelText(profile?.level)}</p>
        </div>
      </div>
      <button class="streak-btn" onclick={handleCheckIn}>
        <span class="streak-icon">🔥</span>
        <span class="streak-text">{profile?.streak_days || 0}天</span>
      </button>
    </header>

    <!-- 今日进度 -->
    <section class="section">
      <h2 class="section-title">今日学习</h2>
      <div class="progress-grid">
        <div class="progress-card">
          <div class="progress-ring-wrapper">
            <ProgressRing progress={(learnedBagua / 8) * 100} color="#F97316" />
          </div>
          <span class="progress-label">八卦</span>
          <span class="progress-value">{learnedBagua}/8</span>
        </div>
        <div class="progress-card">
          <div class="progress-ring-wrapper">
            <ProgressRing progress={(readStories / 64) * 100} color="#007AFF" />
          </div>
          <span class="progress-label">故事</span>
          <span class="progress-value">{readStories}/64</span>
        </div>
        <div class="progress-card">
          <div class="progress-ring-wrapper">
            <ProgressRing progress={divinationCount > 0 ? 100 : 0} color="#AF52DE" />
          </div>
          <span class="progress-label">占卜</span>
          <span class="progress-value">{divinationCount}次</span>
        </div>
      </div>
    </section>

    <!-- 功能入口 -->
    <section class="section">
      <h2 class="section-title">开始学习</h2>
      <div class="features-grid">
        {#each features as feature}
          <FeatureCard {feature} />
        {/each}
      </div>
    </section>

    <!-- 每日推荐 -->
    <section class="section">
      <h2 class="section-title">今日推荐</h2>
      <a href="/stories/1" class="recommend-card">
        <div class="recommend-icon">🌅</div>
        <div class="recommend-content">
          <h3>乾卦的故事</h3>
          <p>天行健，君子以自强不息</p>
        </div>
        <span class="recommend-arrow">›</span>
      </a>
    </section>
  </div>
{/if}

<style>
  .home-container {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
    /* 底部间距由布局统一处理 */
    max-width: 100%;
    margin: 0 auto;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    color: #8E8E93;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #F97316, #EC4899);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  }

  .user-info h1 {
    font-size: 22px;
    font-weight: 700;
    color: #1C1C1E;
    margin: 0;
    line-height: 1.2;
  }

  .user-info p {
    font-size: 13px;
    color: #8E8E93;
    margin: 4px 0 0 0;
  }

  .streak-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 24px;
    background: linear-gradient(135deg, #F97316, #EC4899);
    border: none;
    cursor: pointer;
    color: white;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px rgba(249, 115, 22, 0.3);
    }

    .streak-icon {
      font-size: 16px;
    }

    .streak-text {
      font-size: 14px;
      font-weight: 600;
    }
  }

  /* Sections */
  .section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 17px;
    font-weight: 700;
    color: #1C1C1E;
    margin: 0 0 14px 0;
  }

  /* Progress Grid */
  .progress-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .progress-card {
    background: white;
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;

    .progress-ring-wrapper {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #8E8E93;
      margin-top: 10px;
    }

    .progress-value {
      display: block;
      font-size: 14px;
      font-weight: 700;
      color: #1C1C1E;
      margin-top: 2px;
    }
  }

  /* Features Grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  /* Recommend Card */
  .recommend-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .recommend-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FBBF24, #F97316);
      border-radius: 14px;
      font-size: 26px;
      flex-shrink: 0;
    }

    .recommend-content {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0;
      }

      p {
        font-size: 13px;
        color: #8E8E93;
        margin: 4px 0 0 0;
      }
    }

    .recommend-arrow {
      font-size: 24px;
      font-weight: 300;
      color: #C7C7CC;
      flex-shrink: 0;
    }
  }

  /* 响应式 */
  @media (min-width: 480px) {
    .home-container {
      max-width: 480px;
    }
  }
</style>
