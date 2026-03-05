<script lang="ts">
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { baguaInfo, guaCompleteData } from '$lib/data/gua-complete'
import { getBaguaProgress, updateBaguaProgress } from '$lib/supabase/api'
import { auth } from '$lib/supabase/auth'

// 从 gua-complete.ts 构建八卦详情数据（只取8个基础卦的完整信息）
const baguaDetailData: Record<string, {
  name: string
  pinyin: string
  symbol: string
  nature: string
  naturePinyin: string
  trait: string
  story: string
  traits: string[]
  emoji: string
}> = {}

// 初始化八卦详情数据
Object.entries(baguaInfo).forEach(([name, info]) => {
  // 从64卦中找到对应的卦象获取完整故事
  const gua = guaCompleteData.find(g => g.name === name)
  baguaDetailData[name] = {
    name,
    pinyin: info.pinyin,
    symbol: info.symbol,
    nature: info.nature,
    naturePinyin: info.naturePinyin,
    trait: info.trait,
    story: gua?.story.content.join('\n\n') || `${name}卦的故事`,
    traits: [info.trait],
    emoji: gua?.story.emoji || '🔮'
  }
})

const guaName = $derived($page.params.name)
const gua = $derived(baguaDetailData[guaName])

let learned = $state(false)
let showCelebration = $state(false)
let isSaving = $state(false)

// 加载学习状态
async function loadProgress() {
  if (!browser || !$auth.user || !guaName) return

  try {
    const progress = await getBaguaProgress($auth.user.id)
    const found = progress.find((p) => p.gua_name === guaName)
    learned = found?.learned || false
  } catch (error) {
    console.error('Error loading progress:', error)
  }
}

// 标记为已学习
async function markAsLearned() {
  if (!browser || !$auth.user || !guaName || isSaving) return

  isSaving = true
  try {
    await updateBaguaProgress($auth.user.id, guaName, true)
    learned = true
    showCelebration = true

    // 3秒后关闭庆祝动画
    setTimeout(() => {
      showCelebration = false
    }, 3000)
  } catch (error) {
    console.error('Error saving progress:', error)
  }
  isSaving = false
}

// 返回上一页
function goBack() {
  goto('/bagua')
}

$effect(() => {
  if (browser && $auth.user && guaName) {
    loadProgress()
  }
})
</script>

<svelte:head>
  <title>{gua?.name || '卦象'}卦 - 易经小课堂</title>
</svelte:head>

{#if !gua}
  <div class="not-found">
    <span class="icon">🔮</span>
    <h2>找不到这个卦象</h2>
    <button class="btn btn-primary" onclick={goBack}>返回八卦乐园</button>
  </div>
{:else}
  <div class="detail-page">
    <!-- 顶部导航 -->
    <header class="nav">
      <button class="back-btn" onclick={goBack}>
        <span>←</span>
      </button>
      <h1>{gua.name} ({gua.pinyin})</h1>
      <div class="placeholder"></div>
    </header>
    
    <!-- 卦象主体 -->
    <div class="hero">
      <div class="symbol-wrapper" class:learned>
        <span class="symbol">{gua.symbol}</span>
        <span class="emoji">{gua.emoji}</span>
      </div>
      <h2 class="nature">{gua.nature} ({gua.naturePinyin}) · {gua.trait}</h2>
    </div>
    
    <!-- 特质标签 -->
    <section class="traits">
      <h3>✨ 关键词</h3>
      <div class="trait-list">
        {#each gua.traits as trait}
          <span class="trait">{trait}</span>
        {/each}
      </div>
    </section>
    
    <!-- 故事 -->
    <section class="story">
      <h3>📖 {gua.name}卦的故事</h3>
      <div class="story-content">
        {#each gua.story.split('\n\n') as paragraph, i}
          <p class="story-text">{paragraph}</p>
        {/each}
      </div>
    </section>
    
    <!-- 学习按钮 -->
    <div class="action-area">
      {#if learned}
        <button class="btn btn-success" disabled>
          <span>✓ 已学会</span>
        </button>
      {:else}
        <button 
          class="btn btn-primary" 
          onclick={markAsLearned}
          disabled={isSaving}
        >
          {#if isSaving}
            <span>保存中...</span>
          {:else}
            <span>我学会了！</span>
          {/if}
        </button>
      {/if}
    </div>
    
    <!-- 其他卦象 -->
    <section class="others">
      <h3>继续学习</h3>
      <div class="other-list">
        {#each Object.entries(baguaDetailData) as [name, data]}
          {#if name !== guaName}
            <a href="/bagua/{name}" class="other-item">
              <span class="other-symbol">{data.symbol}</span>
              <span class="other-name">{name}</span>
              <span class="other-pinyin">({data.pinyin})</span>
            </a>
          {/if}
        {/each}
      </div>
    </section>
  </div>
  
  <!-- 庆祝动画 -->
  {#if showCelebration}
    <div class="celebration">
      <div class="confetti">🎉</div>
      <div class="celebration-text">
        <span class="big">太棒了！</span>
        <span>你已经学会了{gua.name}卦</span>
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
      font-size: 20px;
      color: #8E8E93;
      margin-bottom: 24px;
    }
  }

  .detail-page {
    padding: 16px;
    padding-top: calc(16px + var(--safe-area-top, 0px));
    /* 底部间距由布局统一处理 */

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      .back-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: #F2F2F7;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      h1 {
        font-size: 18px;
        font-weight: 600;
        color: #1C1C1E;
      }

      .placeholder {
        width: 40px;
      }
    }

    .hero {
      text-align: center;
      margin-bottom: 32px;

      .symbol-wrapper {
        position: relative;
        display: inline-block;
        margin-bottom: 16px;

        .symbol {
          font-size: 120px;
          line-height: 1;
          background: linear-gradient(135deg, #FF9500, #FF2D55);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .emoji {
          position: absolute;
          bottom: -10px;
          right: -20px;
          font-size: 40px;
          animation: bounce 2s infinite;
        }

        &.learned .symbol {
          background: linear-gradient(135deg, #34C759, #30D158);
          -webkit-background-clip: text;
          background-clip: text;
        }
      }

      .nature {
        font-size: 20px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0;
      }
    }

    .traits, .story {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1C1C1E;
        margin-bottom: 12px;
      }
    }

    .trait-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .trait {
        background: linear-gradient(135deg, #FFEDD5, #FED7AA);
        color: #9A3412;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .story-content {
      .story-text {
        font-size: 15px;
        color: #3C3C43;
        line-height: 1.8;
        margin: 0 0 12px 0;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .action-area {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      background: white;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    }

    .others {
      margin-top: 24px;

      h3 {
        padding: 0 4px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #1C1C1E;
      }

      .other-list {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 8px;

        .other-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          padding: 16px 20px;
          border-radius: 16px;
          text-decoration: none;
          transition: transform 0.2s;

          &:hover {
            transform: translateY(-2px);
          }

          .other-symbol {
            font-size: 32px;
            margin-bottom: 4px;
          }

          .other-name {
            font-size: 14px;
            font-weight: 600;
            color: #1C1C1E;
          }

          .other-pinyin {
            font-size: 11px;
            color: #8E8E93;
          }
        }
      }
    }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.btn-primary {
      background: linear-gradient(135deg, #FF9500, #FF2D55);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 149, 0, 0.4);
      }
    }

    &.btn-success {
      background: linear-gradient(135deg, #34C759, #30D158);
      color: white;
    }
  }

  /* 庆祝动画 */
  .celebration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.3s;

    .confetti {
      font-size: 80px;
      animation: spin 1s ease-out;
    }

    .celebration-text {
      background: white;
      padding: 24px 32px;
      border-radius: 20px;
      text-align: center;
      margin-top: 16px;
      animation: slideUp 0.4s ease-out;

      .big {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #1C1C1E;
        margin-bottom: 8px;
      }

      span:not(.big) {
        font-size: 16px;
        color: #8E8E93;
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg) scale(0); }
    to { transform: rotate(360deg) scale(1); }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
