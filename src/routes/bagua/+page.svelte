<script lang="ts">
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import BaguaCard from '$lib/components/BaguaCard.svelte'
import { getBaguaProgress } from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'

// 八卦基础数据
const baguaBaseList = [
  {
    name: '乾',
    symbol: '☰',
    nature: '天',
    element: '金',
    meaning: '刚健、创造',
  },
  {
    name: '坤',
    symbol: '☷',
    nature: '地',
    element: '土',
    meaning: '柔顺、承载',
  },
  {
    name: '震',
    symbol: '☳',
    nature: '雷',
    element: '木',
    meaning: '震动、启动',
  },
  {
    name: '巽',
    symbol: '☴',
    nature: '风',
    element: '木',
    meaning: '渗透、顺从',
  },
  {
    name: '坎',
    symbol: '☵',
    nature: '水',
    element: '水',
    meaning: '险陷、流动',
  },
  {
    name: '离',
    symbol: '☲',
    nature: '火',
    element: '火',
    meaning: '光明、依附',
  },
  {
    name: '艮',
    symbol: '☶',
    nature: '山',
    element: '土',
    meaning: '静止、稳定',
  },
  {
    name: '兑',
    symbol: '☱',
    nature: '泽',
    element: '金',
    meaning: '喜悦、沟通',
  },
]

let progressMap = $state<Record<string, boolean>>({})
let loading = $state(true)

// 合并基础数据和进度
const baguaList = $derived(
  baguaBaseList.map((gua) => ({
    ...gua,
    learned: progressMap[gua.name] || false,
  })),
)

const learnedCount = $derived(baguaList.filter((b) => b.learned).length)

async function loadProgress() {
  if (!browser || !$auth.user) return

  loading = true
  try {
    const progress = await getBaguaProgress($auth.user.id)
    progressMap = {}
    progress.forEach((p) => {
      progressMap[p.gua_name] = p.learned
    })
  } catch (error) {
    console.error('Error loading progress:', error)
  }
  loading = false
}

onMount(() => {
  if (browser && $auth.user) {
    loadProgress()
  }
})

$effect(() => {
  if (browser && $auth.user && loading) {
    loadProgress()
  }
})
</script>

<svelte:head>
  <title>八卦乐园 - 易经小课堂</title>
</svelte:head>

<div class="bagua-page">
  <!-- 页面头部 -->
  <header class="page-header">
    <h1>八卦乐园</h1>
    <p>认识神奇的八卦符号</p>
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {(learnedCount / 8) * 100}%"></div>
      </div>
      <span class="progress-text">已学习 {learnedCount}/8</span>
    </div>
  </header>
  
  {#if loading}
    <div class="loading-state">
      <p>加载中...</p>
    </div>
  {:else}
    <!-- 八卦网格 -->
    <div class="bagua-grid">
      {#each baguaList as gua, i}
        <BaguaCard {gua} index={i + 1} />
      {/each}
    </div>
    
    <!-- 提示卡片 -->
    <section class="tip-card">
      <span class="tip-icon">💡</span>
      <p>点击任意卦象，开始学习它的故事吧！</p>
    </section>
  {/if}
</div>

<style>
  .bagua-page {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
    /* 底部间距由布局统一处理 */
  }

  /* 页面头部 */
  .page-header {
    text-align: center;
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1C1C1E;
      margin: 0 0 6px 0;
    }

    p {
      font-size: 14px;
      color: #8E8E93;
      margin: 0 0 16px 0;
    }
  }

  /* 进度条 */
  .progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .progress-bar {
      width: 180px;
      height: 8px;
      background: #E5E5EA;
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #F97316, #EC4899);
        border-radius: 4px;
        transition: width 0.5s ease;
      }
    }

    .progress-text {
      font-size: 13px;
      color: #8E8E93;
    }
  }

  /* 加载状态 */
  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #8E8E93;
  }

  /* 八卦网格 */
  .bagua-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  /* 提示卡片 */
  .tip-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
    padding: 16px;
    border-radius: 16px;

    .tip-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    p {
      font-size: 14px;
      color: #9A3412;
      line-height: 1.4;
      margin: 0;
    }
  }

  /* 响应式 */
  @media (min-width: 480px) {
    .bagua-page {
      max-width: 480px;
      margin: 0 auto;
    }
  }
</style>
