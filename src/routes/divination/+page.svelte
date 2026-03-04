<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { auth } from '$lib/supabase/auth'
  import { addDivinationRecord, getDivinationHistory } from '$lib/supabase/api'
  
  // 完整的占卜结果（八卦）
  const divinationResults = [
    { gua: '乾', symbol: '☰', meaning: '刚健进取', advice: '今天适合主动出击，勇敢尝试新事物！相信自己的能力！', fortune: '大吉' },
    { gua: '坤', symbol: '☷', meaning: '厚德载物', advice: '今天要耐心等待，做好自己的事情。稳扎稳打才是王道！', fortune: '中吉' },
    { gua: '震', symbol: '☳', meaning: '震动觉醒', advice: '可能会有意外的事情发生，保持警觉哦！变化中藏着机会！', fortune: '小吉' },
    { gua: '巽', symbol: '☴', meaning: '随风入微', advice: '今天适合温和地表达自己的想法，用温柔打动别人！', fortune: '中吉' },
    { gua: '坎', symbol: '☵', meaning: '流动变化', advice: '遇到困难不要怕，换个角度试试看。灵活应变是关键！', fortune: '小吉' },
    { gua: '离', symbol: '☲', meaning: '光明灿烂', advice: '今天运气不错，适合展示自己的才华！勇敢地表现吧！', fortune: '大吉' },
    { gua: '艮', symbol: '☶', meaning: '稳重如山', advice: '今天适合停下来思考，不要急于行动。稳住就是胜利！', fortune: '中吉' },
    { gua: '兑', symbol: '☱', meaning: '喜悦交流', advice: '和朋友聊聊天，会有好心情！今天适合社交活动！', fortune: '大吉' },
  ]
  
  let isShaking = $state(false)
  let showResult = $state(false)
  let result = $state<typeof divinationResults[0] | null>(null)
  let isSaving = $state(false)
  
  let history = $state<any[]>([])
  let loadingHistory = $state(true)
  
  // 加载占卜历史
  async function loadHistory() {
    if (!browser || !$auth.user) return
    
    loadingHistory = true
    try {
      const data = await getDivinationHistory($auth.user.id, 10)
      history = data
    } catch (error) {
      console.error('Error loading history:', error)
    }
    loadingHistory = false
  }
  
  // 开始占卜
  async function startDivination() {
    if (isShaking || !$auth.user) return
    
    isShaking = true
    showResult = false
    
    // 模拟摇签动画
    setTimeout(async () => {
      isShaking = false
      result = divinationResults[Math.floor(Math.random() * divinationResults.length)]
      showResult = true
      
      // 保存到数据库
      if (browser && $auth.user && result) {
        isSaving = true
        try {
          await addDivinationRecord(
            $auth.user.id, 
            result.gua, 
            `${result.meaning}|${result.advice}|${result.fortune}`
          )
          // 刷新历史
          await loadHistory()
        } catch (error) {
          console.error('Error saving divination:', error)
        }
        isSaving = false
      }
    }, 2000)
  }
  
  // 重置
  function reset() {
    showResult = false
    result = null
  }
  
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
  
  // 解析结果
  function parseResult(resultStr: string): { meaning: string, fortune: string } {
    const parts = resultStr.split('|')
    return {
      meaning: parts[0] || '',
      fortune: parts[2] || '中吉'
    }
  }
  
  onMount(() => {
    if (browser && $auth.user) {
      loadHistory()
    }
  })
  
  $effect(() => {
    if (browser && $auth.user && loadingHistory) {
      loadHistory()
    }
  })
</script>

<svelte:head>
  <title>小小占卜师 - 易经小课堂</title>
</svelte:head>

<div class="divination-page">
  <header class="page-header">
    <h1>小小占卜师</h1>
    <p>摇一摇，看看今天的运势</p>
  </header>
  
  <div class="divination-area">
    {#if !showResult}
      <div 
        class="crystal-ball" 
        class:shaking={isShaking}
        onclick={startDivination}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && startDivination()}
      >
        <span class="ball-icon">🔮</span>
        {#if isShaking}
          <p class="hint">正在摇签...</p>
        {:else}
          <p class="hint">点击水晶球开始占卜</p>
        {/if}
      </div>
      
      <button 
        class="divine-btn" 
        onclick={startDivination}
        disabled={isShaking}
      >
        {isShaking ? '摇一摇...' : '开始占卜'}
      </button>
    {:else if result}
      <div class="result-card animate-slide-up">
        <div class="result-gua">{result.gua} {result.symbol}</div>
        <div class="fortune-badge fortune-{result.fortune === '大吉' ? 'great' : result.fortune === '中吉' ? 'good' : 'small'}">
          {result.fortune}
        </div>
        <h2>{result.meaning}</h2>
        <p class="advice">{result.advice}</p>
        <button class="btn btn-secondary" onclick={reset}>再占一次</button>
      </div>
    {/if}
  </div>
  
  <section class="tips">
    <h3>💡 小贴士</h3>
    <ul>
      <li>占卜只是一种有趣的体验</li>
      <li>真正的命运掌握在自己手中</li>
      <li>遇到困难要勇敢面对哦！</li>
    </ul>
  </section>
  
  <section class="history">
    <h3>📜 占卜记录</h3>
    {#if loadingHistory}
      <p class="loading-text">加载中...</p>
    {:else if history.length === 0}
      <p class="empty-text">还没有占卜记录，快来试试吧！</p>
    {:else}
      <div class="history-list">
        {#each history as record}
          {@const parsed = parseResult(record.result)}
          <div class="history-item">
            <span class="date">{formatDate(record.created_at)}</span>
            <span class="gua">{record.gua_name}卦</span>
            <span class="meaning">{parsed.meaning}</span>
            <span class="result-text fortune-{parsed.fortune === '大吉' ? 'great' : parsed.fortune === '中吉' ? 'good' : 'small'}">
              {parsed.fortune}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .divination-page {
    padding: 16px;
    padding-top: calc(16px + var(--safe-area-top, 0px));

    .page-header {
      text-align: center;
      margin-bottom: 32px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1C1C1E;
        margin-bottom: 8px;
      }

      p {
        font-size: 15px;
        color: #8E8E93;
      }
    }

    .divination-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
    }
  }

  .crystal-ball {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }

    &:focus {
      outline: 3px solid rgba(102, 126, 234, 0.5);
      outline-offset: 4px;
    }

    &.shaking {
      animation: shake 0.5s infinite;
    }

    .ball-icon {
      font-size: 64px;
      margin-bottom: 8px;
    }

    .hint {
      color: white;
      font-size: 14px;
      text-align: center;
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0) rotate(0); }
    25% { transform: translateX(-10px) rotate(-5deg); }
    75% { transform: translateX(10px) rotate(5deg); }
  }

  .divine-btn {
    padding: 16px 48px;
    background: linear-gradient(135deg, #FF9500, #FF2D55);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 149, 0, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .result-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 320px;
    animation: slideUp 0.4s ease-out;

    .result-gua {
      font-size: 56px;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1C1C1E;
      margin-bottom: 12px;
    }

    .advice {
      font-size: 15px;
      color: #8E8E93;
      line-height: 1.6;
      margin-bottom: 24px;
    }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .fortune-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;

    &.fortune-great {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
    }

    &.fortune-good {
      background: linear-gradient(135deg, #34C759, #30D158);
      color: white;
    }

    &.fortune-small {
      background: linear-gradient(135deg, #5AC8FA, #007AFF);
      color: white;
    }
  }

  .btn {
    padding: 14px 28px;
    border-radius: 14px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &.btn-secondary {
      background: #F2F2F7;
      color: #1C1C1E;

      &:hover {
        background: #E5E5EA;
      }
    }
  }

  .tips, .history {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1C1C1E;
      margin-bottom: 12px;
    }
  }

  .tips ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 14px;
      color: #8E8E93;
      padding: 8px 0;
      border-bottom: 1px solid #F2F2F7;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .loading-text, .empty-text {
    font-size: 14px;
    color: #8E8E93;
    text-align: center;
    padding: 16px 0;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #F2F2F7;
    border-radius: 12px;
    font-size: 14px;

    .date {
      color: #8E8E93;
      width: 50px;
      flex-shrink: 0;
    }

    .gua {
      font-weight: 600;
      color: #1C1C1E;
      width: 50px;
      flex-shrink: 0;
    }

    .meaning {
      flex: 1;
      color: #8E8E93;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-text {
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 12px;
      flex-shrink: 0;

      &.fortune-great {
        background: rgba(255, 215, 0, 0.2);
        color: #B8860B;
      }

      &.fortune-good {
        background: rgba(52, 199, 89, 0.15);
        color: #28A745;
      }

      &.fortune-small {
        background: rgba(0, 122, 255, 0.15);
        color: #007AFF;
      }
    }
  }
</style>
