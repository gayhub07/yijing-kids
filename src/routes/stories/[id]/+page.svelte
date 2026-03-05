<script lang="ts">
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { storiesDetailMap, allStoriesList } from '$lib/data/gua-stories'
import { getStoryProgress, updateStoryProgress } from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'
import { getVideoUrl } from '$lib/data/gua-videos'

const storyId = $derived($page.params.id)
const story = $derived(storiesDetailMap[storyId])
const videoUrl = $derived(story ? getVideoUrl(story.gua) : undefined)

let read = $state(false)
let currentIndex = $state(0)
let showCelebration = $state(false)
let isSaving = $state(false)
let showLines = $state(false) // 是否显示爻辞

async function loadProgress() {
  if (!browser || !$auth.user || !storyId) return
  try {
    const progress = await getStoryProgress($auth.user.id)
    const found = progress.find((p) => p.story_id === parseInt(storyId, 10))
    read = found?.read || false
  } catch (error) {
    console.error('Error loading progress:', error)
  }
}

function nextPage() {
  if (story && currentIndex < story.content.length - 1) currentIndex++
}

function prevPage() {
  if (currentIndex > 0) currentIndex--
}

async function markAsRead() {
  if (!browser || !$auth.user || !story || isSaving) return
  isSaving = true
  try {
    await updateStoryProgress($auth.user.id, story.id, story.gua, true)
    read = true
    showCelebration = true
    setTimeout(() => {
      showCelebration = false
    }, 3000)
  } catch (error) {
    console.error('Error saving progress:', error)
  }
  isSaving = false
}

function goBack() {
  goto('/stories')
}

function getLevelInfo(level: string) {
  switch (level) {
    case 'beginner':
      return { label: '启蒙', color: '#22C55E', bg: '#DCFCE7' }
    case 'explorer':
      return { label: '探索', color: '#3B82F6', bg: '#DBEAFE' }
    default:
      return { label: '进阶', color: '#8B5CF6', bg: '#EDE9FE' }
  }
}

// 推荐更多故事
const moreStories = $derived(
  allStoriesList
    .filter((s) => String(s.id) !== storyId)
    .slice(0, 6)
)

$effect(() => {
  if (browser && $auth.user && storyId) loadProgress()
})
</script>

<svelte:head>
  <title>{story?.title || '故事'} - 易经小课堂</title>
</svelte:head>

{#if !story}
  <div class="not-found">
    <span class="icon">📖</span>
    <h2>找不到这个故事</h2>
    <button class="btn btn-primary" onclick={goBack}>返回故事列表</button>
  </div>
{:else}
  {@const levelInfo = getLevelInfo(story.level)}
  
  <div class="story-detail">
    <!-- 顶部导航 -->
    <header class="nav">
      <button class="back-btn" onclick={goBack}>←</button>
      <h1>{story.gua} ({story.guaPinyin})</h1>
      <div class="placeholder"></div>
    </header>

    <!-- 卦象信息卡片 -->
    <div class="gua-info-card">
      <div class="symbol">{story.symbol}</div>
      <div class="gua-text">
        <p class="text-main">{story.text}</p>
        <p class="text-pinyin">{story.textPinyin}</p>
        <p class="text-meaning">{story.textMeaning}</p>
      </div>
    </div>

    <!-- 视频讲解 -->
    {#if videoUrl}
      <section class="video-section">
        <div class="video-header">
          <span class="video-icon">🎬</span>
          <h3>动画讲解</h3>
        </div>
        <div class="video-wrapper">
          <video
            controls
            preload="metadata"
            playsinline
            poster=""
          >
            <source src={videoUrl} type="video/webm" />
            <p>你的浏览器不支持视频播放</p>
          </video>
        </div>
      </section>
    {/if}

    <!-- 故事标题 -->
    <div class="story-header">
      <span class="emoji">{story.emoji}</span>
      <h2>{story.title}</h2>
      <p class="summary">{story.summary}</p>
      <span class="level-badge" style="background: {levelInfo.bg}; color: {levelInfo.color}">
        {levelInfo.label}
      </span>
    </div>

    <!-- 进度指示 -->
    <div class="progress-dots">
      {#each story.content as _, i}
        <span class="dot {i === currentIndex ? 'active' : ''} {i < currentIndex ? 'completed' : ''}"></span>
      {/each}
    </div>

    <!-- 故事内容 -->
    <div class="content-card">
      <p class="story-text">{story.content[currentIndex]}</p>
      
      <div class="nav-buttons">
        <button class="btn btn-secondary" onclick={prevPage} disabled={currentIndex === 0}>
          ← 上一页
        </button>
        <span class="page-indicator">{currentIndex + 1} / {story.content.length}</span>
        
        {#if currentIndex < story.content.length - 1}
          <button class="btn btn-primary" onclick={nextPage}>
            下一页 →
          </button>
        {:else}
          <button class="btn btn-success" onclick={markAsRead} disabled={isSaving || read}>
            {#if read}✓ 已读完{:else if isSaving}保存中...{:else}完成 🎉{/if}
          </button>
        {/if}
      </div>
    </div>

    <!-- 爻辞展开 -->
    <section class="lines-section">
      <button class="lines-toggle" onclick={() => showLines = !showLines}>
        <span class="toggle-icon">{showLines ? '▼' : '▶'}</span>
        <span>六爻详解 ({story.gua})</span>
      </button>
      
      {#if showLines}
        <div class="lines-list">
          {#each story.lines as line, i}
            <div class="line-item">
              <div class="line-header">
                <span class="line-num">第 {i + 1} 爻</span>
              </div>
              <p class="line-text">{line.text}</p>
              <p class="line-pinyin">{line.pinyin}</p>
              <p class="line-meaning">💡 {line.meaning}</p>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <!-- 故事启示 -->
    <section class="lesson-card">
      <h3>💡 故事启示</h3>
      <p>{story.lesson}</p>
    </section>

    <!-- 生活应用 -->
    <section class="application-card">
      <h3>🌟 生活中的应用</h3>
      <p>{story.application}</p>
    </section>

    <!-- 更多故事 -->
    <section class="more-stories">
      <h3>更多故事</h3>
      <div class="story-list">
        {#each moreStories as s}
          <a href="/stories/{s.id}" class="story-item">
            <span class="item-emoji">{s.emoji}</span>
            <div class="item-info">
              <span class="item-title">{s.title}</span>
              <span class="item-gua">{s.gua} ({s.guaPinyin})</span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </div>

  <!-- 庆祝动画 -->
  {#if showCelebration}
    <div class="celebration">
      <span class="celebration-emoji">🎉</span>
      <div class="celebration-card">
        <span class="celebration-title">太棒了！</span>
        <span class="celebration-text">你读完了《{story.title}》</span>
      </div>
    </div>
  {/if}
{/if}

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 24px;
    text-align: center;

    .icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 18px;
      color: #8E8E93;
      margin-bottom: 24px;
    }
  }

  .btn {
    padding: 12px 20px;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.btn-primary {
      background: #F97316;
      color: white;

      &:hover:not(:disabled) {
        background: #EA580C;
      }
    }

    &.btn-secondary {
      background: #F2F2F7;
      color: #8E8E93;
    }

    &.btn-success {
      background: #22C55E;
      color: white;
    }
  }

  .story-detail {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #F2F2F7;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;

      &:active {
        background: #E5E5EA;
      }
    }

    h1 {
      font-size: 17px;
      font-weight: 600;
      color: #1C1C1E;
    }

    .placeholder {
      width: 40px;
    }
  }

  /* 卦象信息卡片 */
  .gua-info-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    border-radius: 16px;
    margin-bottom: 16px;

    .symbol {
      font-size: 48px;
      line-height: 1;
    }

    .gua-text {
      flex: 1;

      .text-main {
        font-size: 16px;
        font-weight: 600;
        color: #92400E;
        margin: 0 0 4px 0;
      }

      .text-pinyin {
        font-size: 12px;
        color: #B45309;
        margin: 0 0 4px 0;
      }

      .text-meaning {
        font-size: 13px;
        color: #78350F;
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  /* 视频播放器 */
  .video-section {
    margin-bottom: 20px;

    .video-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .video-icon {
        font-size: 20px;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0;
      }
    }

    .video-wrapper {
      border-radius: 16px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

      video {
        width: 100%;
        display: block;
        aspect-ratio: 16 / 9;
        object-fit: contain;
      }
    }
  }

  .story-header {
    text-align: center;
    margin-bottom: 20px;

    .emoji {
      font-size: 56px;
      display: block;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1C1C1E;
      margin: 0 0 6px 0;
    }

    .summary {
      font-size: 14px;
      color: #8E8E93;
      margin: 0 0 12px 0;
    }

    .level-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .progress-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 16px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #E5E5EA;
      transition: all 0.2s ease;

      &.completed {
        background: #22C55E;
      }

      &.active {
        background: #F97316;
        transform: scale(1.3);
      }
    }
  }

  .content-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .story-text {
      font-size: 16px;
      color: #1C1C1E;
      line-height: 1.8;
      margin: 0 0 24px 0;
      min-height: 100px;
    }

    .nav-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .page-indicator {
        font-size: 13px;
        color: #8E8E93;
      }
    }
  }

  /* 爻辞区域 */
  .lines-section {
    margin-bottom: 16px;

    .lines-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      background: white;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

      .toggle-icon {
        font-size: 12px;
        color: #8E8E93;
      }
    }

    .lines-list {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .line-item {
      background: white;
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

      .line-header {
        margin-bottom: 8px;

        .line-num {
          display: inline-block;
          padding: 2px 10px;
          background: #F2F2F7;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #8E8E93;
        }
      }

      .line-text {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0 0 4px 0;
      }

      .line-pinyin {
        font-size: 12px;
        color: #8E8E93;
        margin: 0 0 8px 0;
      }

      .line-meaning {
        font-size: 13px;
        color: #6B7280;
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  .lesson-card {
    background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1E40AF;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #1E3A8A;
      line-height: 1.6;
      margin: 0;
    }
  }

  .application-card {
    background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #065F46;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #064E3B;
      line-height: 1.6;
      margin: 0;
    }
  }

  .more-stories {
    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
      margin: 0 0 12px 0;
    }

    .story-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 8px;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .story-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      background: white;
      border-radius: 14px;
      text-decoration: none;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
      transition: transform 0.15s ease;

      &:active {
        transform: scale(0.98);
      }

      .item-emoji {
        font-size: 28px;
      }

      .item-info {
        display: flex;
        flex-direction: column;

        .item-title {
          font-size: 13px;
          font-weight: 600;
          color: #1C1C1E;
        }

        .item-gua {
          font-size: 11px;
          color: #8E8E93;
        }
      }
    }
  }

  .celebration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.3s ease;

    .celebration-emoji {
      font-size: 72px;
      animation: bounce 0.6s ease;
    }

    .celebration-card {
      background: white;
      padding: 24px 32px;
      border-radius: 20px;
      text-align: center;
      margin-top: 16px;
      animation: slideUp 0.4s ease;

      .celebration-title {
        display: block;
        font-size: 26px;
        font-weight: 700;
        color: #1C1C1E;
        margin-bottom: 8px;
      }

      .celebration-text {
        font-size: 15px;
        color: #8E8E93;
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
