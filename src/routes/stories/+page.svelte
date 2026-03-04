<script lang="ts">
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import { extraStoriesData } from '$lib/data/stories-extra'
import { getStoryProgress } from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'

// 故事基础数据（前16个）
const storiesBaseList = [
  {
    id: 1,
    gua: '乾',
    title: '龙的故事',
    summary: '一条小龙如何成长为天空之王',
    level: 'beginner' as const,
  },
  {
    id: 2,
    gua: '坤',
    title: '大地的礼物',
    summary: '大地母亲如何滋养万物生长',
    level: 'beginner' as const,
  },
  {
    id: 3,
    gua: '屯',
    title: '种子发芽',
    summary: '一颗小种子的冒险旅程',
    level: 'beginner' as const,
  },
  {
    id: 4,
    gua: '蒙',
    title: '小明求学',
    summary: '聪明的小明如何学习知识',
    level: 'beginner' as const,
  },
  {
    id: 5,
    gua: '需',
    title: '等待的智慧',
    summary: '学会耐心等待的小兔子',
    level: 'beginner' as const,
  },
  {
    id: 6,
    gua: '讼',
    title: '和为贵',
    summary: '两个小朋友如何化解矛盾',
    level: 'beginner' as const,
  },
  {
    id: 7,
    gua: '师',
    title: '勇敢的将军',
    summary: '一位智慧的将军带领军队',
    level: 'explorer' as const,
  },
  {
    id: 8,
    gua: '比',
    title: '团结就是力量',
    summary: '小动物们如何互相帮助',
    level: 'explorer' as const,
  },
  {
    id: 9,
    gua: '小畜',
    title: '积少成多',
    summary: '小松鼠的存粮故事',
    level: 'explorer' as const,
  },
  {
    id: 10,
    gua: '履',
    title: '小心走路',
    summary: '踩着石头过河的智慧',
    level: 'explorer' as const,
  },
  {
    id: 11,
    gua: '泰',
    title: '春天来了',
    summary: '万物复苏的美好时光',
    level: 'beginner' as const,
  },
  {
    id: 12,
    gua: '否',
    title: '乌云散去',
    summary: '困难总会过去的',
    level: 'explorer' as const,
  },
  {
    id: 13,
    gua: '同人',
    title: '志同道合',
    summary: '寻找志趣相投的朋友',
    level: 'explorer' as const,
  },
  {
    id: 14,
    gua: '大有',
    title: '丰收的季节',
    summary: '农民伯伯的快乐收获',
    level: 'beginner' as const,
  },
  {
    id: 15,
    gua: '谦',
    title: '谦虚的小象',
    summary: '骄傲使人落后，谦虚使人进步',
    level: 'explorer' as const,
  },
  {
    id: 16,
    gua: '豫',
    title: '快乐的歌声',
    summary: '用音乐传递快乐',
    level: 'explorer' as const,
  },
]

// 合并额外故事（17-64）
const extraStoriesList = Object.values(extraStoriesData).map((s) => ({
  id: s.id,
  gua: s.gua,
  title: s.title,
  summary: s.summary,
  level: s.level,
}))

// 所有故事
const allStoriesList = [...storiesBaseList, ...extraStoriesList]

let progressMap = $state<Record<number, boolean>>({})
let loading = $state(true)
let selectedLevel = $state('all')

const levels = [
  { id: 'all', label: '全部', icon: '📚' },
  { id: 'beginner', label: '启蒙', icon: '🌱' },
  { id: 'explorer', label: '探索', icon: '🌿' },
  { id: 'advanced', label: '进阶', icon: '🌳' },
]

// 合并所有故事和进度
const stories = $derived(
  allStoriesList.map((story) => ({
    ...story,
    read: progressMap[story.id] || false,
  })),
)

// 根据等级过滤
const filteredStories = $derived(
  selectedLevel === 'all'
    ? stories
    : stories.filter((s) => s.level === selectedLevel),
)

const readCount = $derived(stories.filter((s) => s.read).length)

async function loadProgress() {
  if (!browser || !$auth.user) return

  loading = true
  try {
    const progress = await getStoryProgress($auth.user.id)
    progressMap = {}
    progress.forEach((p) => {
      progressMap[p.story_id] = p.read
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

function getLevelColor(level: string) {
  switch (level) {
    case 'beginner':
      return '#22C55E'
    case 'explorer':
      return '#3B82F6'
    default:
      return '#8B5CF6'
  }
}
</script>

<svelte:head>
  <title>故事时光 - 易经小课堂</title>
</svelte:head>

<div class="stories-page">
  <!-- 顶部标题 -->
  <header class="page-header">
    <h1>故事时光</h1>
    <p>六十四卦的趣味故事</p>
    <div class="stats">
      <span class="stat-item">
        <span class="stat-icon">📖</span>
        <span>已读 {readCount} 个</span>
      </span>
      <span class="stat-divider">|</span>
      <span class="stat-item">
        <span class="stat-icon">📚</span>
        <span>共 {stories.length} 个</span>
      </span>
    </div>
  </header>

  <!-- 筛选标签 -->
  <div class="filter-tabs">
    {#each levels as level}
      <button
        class="filter-tab {selectedLevel === level.id ? 'active' : ''}"
        onclick={() => selectedLevel = level.id}
      >
        <span class="tab-icon">{level.icon}</span>
        <span class="tab-label">{level.label}</span>
      </button>
    {/each}
  </div>

  <!-- 故事列表 -->
  {#if loading}
    <div class="loading-state">
      <p>加载中...</p>
    </div>
  {:else if filteredStories.length === 0}
    <div class="empty-state">
      <span class="empty-icon">📭</span>
      <p>这个等级还没有故事哦</p>
    </div>
  {:else}
    <div class="stories-list">
      {#each filteredStories as story (story.id)}
        <a href="/stories/{story.id}" class="story-card">
          <div class="story-gua" style="background: {getLevelColor(story.level)}">
            {story.gua}
          </div>
          <div class="story-info">
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
          </div>
          <div class="story-status">
            {#if story.read}
              <span class="read-badge">✓ 已读</span>
            {:else}
              <span class="arrow">›</span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .stories-page {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
    /* 底部间距由布局统一处理 */
  }

  /* 页面头部 */
  .page-header {
    text-align: center;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1C1C1E;
      margin: 0 0 6px 0;
    }

    p {
      font-size: 14px;
      color: #8E8E93;
      margin: 0 0 12px 0;
    }

    .stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #8E8E93;
      }

      .stat-icon {
        font-size: 14px;
      }

      .stat-divider {
        color: #E5E5EA;
      }
    }
  }

  /* 筛选标签 */
  .filter-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 4px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .filter-tab {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    border-radius: 20px;
    border: none;
    background: #F2F2F7;
    color: #8E8E93;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    .tab-icon {
      font-size: 14px;
    }

    &.active {
      background: #1C1C1E;
      color: white;
    }

    &:active {
      transform: scale(0.96);
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

  /* 空状态 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: #8E8E93;
      margin: 0;
    }
  }

  /* 故事列表 */
  .stories-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .story-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .story-gua {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .story-info {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0 0 3px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 12px;
        color: #8E8E93;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .story-status {
      flex-shrink: 0;

      .read-badge {
        display: inline-block;
        padding: 4px 10px;
        background: #DCFCE7;
        color: #16A34A;
        font-size: 11px;
        font-weight: 600;
        border-radius: 12px;
      }

      .arrow {
        font-size: 20px;
        color: #D1D5DB;
      }
    }
  }

  /* 响应式 */
  @media (min-width: 480px) {
    .stories-page {
      max-width: 480px;
      margin: 0 auto;
    }
  }
</style>
