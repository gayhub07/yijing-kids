<script lang="ts">
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { getBaguaProgress, updateBaguaProgress } from '$lib/supabase/api'

// 八卦完整数据
const baguaData: Record<
  string,
  {
    name: string
    symbol: string
    nature: string
    element: string
    meaning: string
    story: string
    traits: string[]
    emoji: string
  }
> = {
  乾: {
    name: '乾',
    symbol: '☰',
    nature: '天',
    element: '金',
    meaning: '刚健、创造、自强不息',
    story:
      '在很久很久以前，有一条小龙生活在深山里。它每天都努力练习飞翔，想要飞到最高的天空。虽然有时候会摔倒，但它从不放弃。终于有一天，它飞上了云端，成为了天空之王！这就是乾卦告诉我们的道理：要像天一样刚强，永不放弃，就一定能成功！',
    traits: ['勇敢', '坚强', '有志气', '主动'],
    emoji: '🐉',
  },
  坤: {
    name: '坤',
    symbol: '☷',
    nature: '地',
    element: '土',
    meaning: '柔顺、承载、厚德载物',
    story:
      '大地妈妈很温柔，她抱着所有的花草树木，让它们在自己的怀抱里长大。不管是高高的大树，还是小小的花朵，大地妈妈都会给它们营养和水分。坤卦告诉我们，要像大地一样，温柔地对待别人，帮助身边的人成长。',
    traits: ['温柔', '包容', '稳重', '善良'],
    emoji: '🌍',
  },
  震: {
    name: '震',
    symbol: '☳',
    nature: '雷',
    element: '木',
    meaning: '震动、启动、惊醒万物',
    story:
      '春天来了，轰隆隆的雷声唤醒了沉睡的小种子。"该起床啦！"雷公公喊道。小种子们伸伸懒腰，从泥土里探出头来，开始新的生活。震卦告诉我们，有时候需要一点"惊吓"来开始新的事情，不要害怕变化哦！',
    traits: ['活力', '积极', '勇敢', '有冲劲'],
    emoji: '⚡',
  },
  巽: {
    name: '巽',
    symbol: '☴',
    nature: '风',
    element: '木',
    meaning: '渗透、顺从、温柔入微',
    story:
      '春风姑娘很温柔，她轻轻地吹过田野，吹过森林，吹过每一个角落。她不强迫任何人，但每个人都能感受到她的存在。小树苗在她的抚摸下慢慢长高，花儿在她的陪伴下绽放。巽卦告诉我们，温柔的力量也很强大！',
    traits: ['温柔', '灵活', '适应力强', '善解人意'],
    emoji: '🍃',
  },
  坎: {
    name: '坎',
    symbol: '☵',
    nature: '水',
    element: '水',
    meaning: '险陷、流动、以柔克刚',
    story:
      '小溪流遇到了一块大石头，挡住了去路。它没有硬冲，而是轻轻地绕过去，继续向前流淌。久而久之，石头被水冲出了一个小洞，小溪顺利通过了！坎卦告诉我们，遇到困难不要怕，像水一样灵活，总能找到办法。',
    traits: ['聪明', '灵活', '坚韧', '善于变通'],
    emoji: '💧',
  },
  离: {
    name: '离',
    symbol: '☲',
    nature: '火',
    element: '火',
    meaning: '光明、依附、热情灿烂',
    story:
      '太阳公公每天都准时起床，把温暖和光明送给大地。有了阳光，花儿才能开放，小动物才能快乐地玩耍。离卦就像太阳一样，告诉我们要把快乐和温暖分享给身边的人，让大家都能感受到光明！',
    traits: ['热情', '开朗', '有才华', '乐于分享'],
    emoji: '🔥',
  },
  艮: {
    name: '艮',
    symbol: '☶',
    nature: '山',
    element: '土',
    meaning: '静止、稳定、适可而止',
    story:
      '高山爷爷站得很稳，不管是刮风还是下雨，他都一动不动。小动物们都知道，遇到危险可以躲到山后面。艮卦告诉我们，有时候要懂得停下来，不要太着急，稳稳当当才能走得远。',
    traits: ['稳重', '冷静', '有原则', '懂得分寸'],
    emoji: '⛰️',
  },
  兑: {
    name: '兑',
    symbol: '☱',
    nature: '泽',
    element: '金',
    meaning: '喜悦、沟通、口才伶俐',
    story:
      '小湖边总是很热闹，小鸭子在游泳，青蛙在唱歌，小朋友们也在开心地玩耍。大家聚在一起，说说笑笑，多么快乐啊！兑卦告诉我们，和朋友聊天、分享快乐是一件很美好的事情！',
    traits: ['开朗', '善于沟通', '有趣', '人缘好'],
    emoji: '💬',
  },
}

const guaName = $derived($page.params.name)
const gua = $derived(baguaData[guaName])

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
      <h1>{gua.name}卦</h1>
      <div class="placeholder"></div>
    </header>
    
    <!-- 卦象主体 -->
    <div class="hero">
      <div class="symbol-wrapper" class:learned>
        <span class="symbol">{gua.symbol}</span>
        <span class="emoji">{gua.emoji}</span>
      </div>
      <h2 class="nature">{gua.nature} · {gua.element}</h2>
      <p class="meaning">{gua.meaning}</p>
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
      <p class="story-text">{gua.story}</p>
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
        {#each Object.entries(baguaData) as [name, data]}
          {#if name !== guaName}
            <a href="/bagua/{name}" class="other-item">
              <span class="other-symbol">{data.symbol}</span>
              <span class="other-name">{name}</span>
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
        margin-bottom: 8px;
      }

      .meaning {
        font-size: 16px;
        color: #8E8E93;
        max-width: 280px;
        margin: 0 auto;
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

    .story-text {
      font-size: 15px;
      color: #3C3C43;
      line-height: 1.8;
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
