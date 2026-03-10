<script lang="ts">
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import {
  dailySignin,
  getSigninHistory,
  getSigninStreak,
  getTotalPoints,
} from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'

type SigninRecord = {
  id: string
  signin_date: string
  points: number
  created_at: string
}

let signinHistory = $state<SigninRecord[]>([])
let streak = $state(0)
let totalPoints = $state(0)
let hasSignedInToday = $state(false)
let loading = $state(true)
let signingIn = $state(false)
let lastSigninResult = $state<{
  success: boolean
  points: number
  streak: number
  message: string
} | null>(null)

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 获取星期
function getWeekday(dateStr: string): string {
  const date = new Date(dateStr)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `周${weekdays[date.getDay()]}`
}

// 加载数据
async function loadData() {
  if (!browser || !$auth.user) return

  loading = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const [history, streakData, pointsData] = await Promise.all([
      getSigninHistory($auth.user.id, 30),
      getSigninStreak($auth.user.id),
      getTotalPoints($auth.user.id),
    ])

    signinHistory = history
    streak = streakData
    totalPoints = pointsData

    // 检查今天是否已签到
    hasSignedInToday = history.some((record) => record.signin_date === today)
  } catch (error) {
    console.error('Error loading signin data:', error)
  }
  loading = false
}

// 签到
async function handleSignin() {
  if (!browser || !$auth.user || signingIn) return

  signingIn = true
  try {
    const result = await dailySignin($auth.user.id)
    lastSigninResult = result

    if (result.success) {
      // 刷新数据
      await loadData()
    }
  } catch (error) {
    console.error('Signin error:', error)
    lastSigninResult = {
      success: false,
      points: 0,
      streak: 0,
      message: '签到失败，请重试',
    }
  }
  signingIn = false

  // 3 秒后清除提示
  setTimeout(() => {
    lastSigninResult = null
  }, 3000)
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
  <title>每日签到 - 易经小课堂</title>
</svelte:head>

{#if loading}
  <div class="loading">
    <p>加载中...</p>
  </div>
{:else}
  <div class="signin-page">
    <!-- 签到卡片 -->
    <div class="signin-card">
      <div class="card-header">
        <h1>每日签到</h1>
        <span class="subtitle">坚持学习，收获成长</span>
      </div>

      <!-- 签到按钮区域 -->
      <div class="signin-action">
        {#if hasSignedInToday}
          <div class="signed-in">
            <span class="checkmark">✅</span>
            <p>今天已签到</p>
            <span class="streak-badge">连续 {streak} 天</span>
          </div>
        {:else}
          <button
            class="signin-btn"
            onclick={handleSignin}
            disabled={signingIn}
          >
            {#if signingIn}
              <span class="spinner"></span>
              签到中...
            {:else}
              <span class="btn-icon">🎁</span>
              立即签到
            {/if}
          </button>
        {/if}

        {#if lastSigninResult}
          <div class="signin-result {lastSigninResult.success ? 'success' : 'error'}">
            {lastSigninResult.message}
          </div>
        {/if}
      </div>

      <!-- 统计信息 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">{streak}</span>
          <span class="stat-label">连续签到</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{totalPoints}</span>
          <span class="stat-label">总积分</span>
        </div>
      </div>
    </div>

    <!-- 积分规则 -->
    <div class="rules-card">
      <h2>积分规则</h2>
      <div class="rules-list">
        <div class="rule-item">
          <span class="rule-icon">📅</span>
          <div class="rule-content">
            <span class="rule-title">每日签到</span>
            <span class="rule-desc">每天签到可获得 10 积分</span>
          </div>
        </div>
        <div class="rule-item">
          <span class="rule-icon">🔥</span>
          <div class="rule-content">
            <span class="rule-title">连续签到奖励</span>
            <span class="rule-desc">连续 3 天 +5 分，连续 7 天 +10 分</span>
          </div>
        </div>
        <div class="rule-item">
          <span class="rule-icon">🎯</span>
          <div class="rule-content">
            <span class="rule-title">积分用途</span>
            <span class="rule-desc">积分可兑换奖励和特殊功能（开发中）</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 签到历史 -->
    <div class="history-card">
      <h2>签到历史</h2>
      {#if signinHistory.length === 0}
        <div class="empty-history">
          <span class="empty-icon">📝</span>
          <p>还没有签到记录</span>
          <p class="empty-hint">快来签到吧！</p>
        </div>
      {:else}
        <div class="history-list">
          {#each signinHistory as record}
            <div class="history-item">
              <div class="history-date">
                <span class="date">{formatDate(record.signin_date)}</span>
                <span class="weekday">{getWeekday(record.signin_date)}</span>
              </div>
              <div class="history-points">
                <span class="points-icon">⭐</span>
                <span class="points-value">+{record.points}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #8E8E93;
  }

  .signin-page {
    padding: 16px;
    padding-top: calc(16px + var(--safe-area-top, 0px));
  }

  .signin-card {
    background: linear-gradient(135deg, #FF9500, #FF2D55);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    color: white;

    .card-header {
      text-align: center;
      margin-bottom: 24px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .subtitle {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }

  .signin-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .signed-in {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .checkmark {
        font-size: 48px;
      }

      p {
        font-size: 16px;
        font-weight: 600;
      }

      .streak-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
      }
    }

    .signin-btn {
      background: white;
      color: #FF9500;
      border: none;
      padding: 16px 48px;
      border-radius: 16px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      -webkit-tap-highlight-color: transparent;

      &:active:not(:disabled) {
        transform: scale(0.95);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .btn-icon {
        font-size: 24px;
      }

      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 149, 0, 0.3);
        border-top-color: #FF9500;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .signin-result {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      animation: slideDown 0.3s ease-out;

      &.success {
        background: rgba(255, 255, 255, 0.95);
        color: #34C759;
      }

      &.error {
        background: rgba(255, 255, 255, 0.95);
        color: #FF3B30;
      }
    }

    @keyframes slideDown {
      from {
        transform: translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 16px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;

      .stat-icon {
        font-size: 24px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 700;
      }

      .stat-label {
        font-size: 13px;
        opacity: 0.9;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .rules-card, .history-card {
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

  .rules-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rule-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #F2F2F7;
    border-radius: 12px;

    .rule-icon {
      font-size: 24px;
    }

    .rule-content {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .rule-title {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1E;
      }

      .rule-desc {
        font-size: 13px;
        color: #8E8E93;
      }
    }
  }

  .empty-history {
    text-align: center;
    padding: 32px 16px;
    color: #8E8E93;

    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 12px;
    }

    p {
      margin: 4px 0;
    }

    .empty-hint {
      font-size: 14px;
      color: #C7C7CC;
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #F2F2F7;
    border-radius: 12px;

    .history-date {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .date {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1E;
      }

      .weekday {
        font-size: 13px;
        color: #8E8E93;
      }
    }

    .history-points {
      display: flex;
      align-items: center;
      gap: 4px;

      .points-icon {
        font-size: 16px;
      }

      .points-value {
        font-size: 16px;
        font-weight: 700;
        color: #FF9500;
      }
    }
  }
</style>
