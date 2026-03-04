<script lang="ts">
  import { goto } from '$app/navigation'

  let expandedFaq = $state<number | null>(null)

  const faqs = [
    {
      question: '什么是易经？',
      answer: '易经是中国最古老的经典之一，通过八卦和六十四卦来解释天地万物的变化规律。它不仅是一本占卜书，更是一部哲学著作，教导我们如何顺应自然、把握时机。'
    },
    {
      question: '什么是八卦？',
      answer: '八卦是由阴爻（⚋）和阳爻（☰）组成的八个基本符号，分别代表天、地、雷、风、水、火、山、泽八种自然现象。每个卦象都有独特的含义和象征。'
    },
    {
      question: '如何学习八卦？',
      answer: '建议从认识八个基本卦象开始，了解每个卦象的名称、符号和含义。然后阅读每个卦象对应的故事，理解其中的道理。最后可以尝试占卜功能，体验易经的智慧。'
    },
    {
      question: '占卜结果准确吗？',
      answer: '占卜是一种有趣的体验，结果仅供参考。易经的真正价值在于帮助我们思考问题、启发智慧。不要过分依赖占卜结果，而是要从中获得启发和思考。'
    },
    {
      question: '连续打卡有什么用？',
      answer: '连续打卡可以记录你的学习习惯，帮助你养成每天学习的好习惯。坚持学习可以获得成就徽章，见证自己的成长！'
    },
    {
      question: '如何修改头像和昵称？',
      answer: '进入"我的"页面，点击"编辑"按钮，就可以修改你的昵称和选择喜欢的头像啦！'
    }
  ]

  function toggleFaq(index: number) {
    expandedFaq = expandedFaq === index ? null : index
  }

  function goBack() {
    goto('/settings')
  }
</script>

<svelte:head>
  <title>帮助中心 - 易经小课堂</title>
</svelte:head>

<div class="help-page">
  <!-- 顶部导航 -->
  <header class="nav">
    <button class="back-btn" onclick={goBack}>←</button>
    <h1>帮助中心</h1>
    <div class="placeholder"></div>
  </header>

  <!-- 搜索框（装饰性） -->
  <div class="search-box">
    <span class="search-icon">🔍</span>
    <input type="text" placeholder="搜索问题..." disabled />
  </div>

  <!-- 常见问题 -->
  <section class="faq-section">
    <h2>常见问题</h2>
    
    <div class="faq-list">
      {#each faqs as faq, i}
        <div class="faq-item">
          <button 
            class="faq-question" 
            onclick={() => toggleFaq(i)}
          >
            <span>{faq.question}</span>
            <span class="faq-arrow {expandedFaq === i ? 'expanded' : ''}">›</span>
          </button>
          
          {#if expandedFaq === i}
            <div class="faq-answer">
              <p>{faq.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- 联系我们 -->
  <section class="contact-section">
    <h2>联系我们</h2>
    
    <div class="contact-card">
      <span class="contact-icon">📧</span>
      <div class="contact-info">
        <span class="contact-label">问题反馈</span>
        <span class="contact-value">发送邮件至 190909891@qq.com</span>
      </div>
    </div>

    <div class="contact-card">
      <span class="contact-icon">💬</span>
      <div class="contact-info">
        <span class="contact-label">在线客服</span>
        <span class="contact-value">工作日 9:00-18:00</span>
      </div>
    </div>
  </section>

  <!-- 使用提示 -->
  <section class="tips-section">
    <h2>💡 小贴士</h2>
    <ul class="tips-list">
      <li>每天坚持学习一点点，积少成多</li>
      <li>阅读故事时，可以和爸爸妈妈一起讨论</li>
      <li>遇到不理解的地方，可以多看几遍</li>
      <li>把学到的道理应用到生活中</li>
    </ul>
  </section>
</div>

<style>
  .help-page {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
  }

  /* 导航 */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

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

  /* 搜索框 */
  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #F2F2F7;
    border-radius: 12px;
    margin-bottom: 20px;

    .search-icon {
      font-size: 16px;
      opacity: 0.5;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 15px;
      color: #1C1C1E;
      outline: none;

      &::placeholder {
        color: #8E8E93;
      }
    }
  }

  /* FAQ 区块 */
  .faq-section, .contact-section, .tips-section {
    margin-bottom: 20px;

    h2 {
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
      margin-bottom: 12px;
    }
  }

  /* FAQ 列表 */
  .faq-list {
    background: white;
    border-radius: 16px;
    overflow: hidden;
  }

  .faq-item {
    border-bottom: 1px solid #F2F2F7;

    &:last-child {
      border-bottom: none;
    }
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;

    span:first-child {
      font-size: 15px;
      font-weight: 500;
      color: #1C1C1E;
    }

    .faq-arrow {
      font-size: 20px;
      color: #C7C7CC;
      transition: transform 0.2s ease;

      &.expanded {
        transform: rotate(90deg);
      }
    }
  }

  .faq-answer {
    padding: 0 16px 16px;

    p {
      font-size: 14px;
      color: #8E8E93;
      line-height: 1.6;
      margin: 0;
    }
  }

  /* 联系卡片 */
  .contact-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: white;
    border-radius: 14px;
    margin-bottom: 10px;

    .contact-icon {
      font-size: 24px;
    }

    .contact-info {
      flex: 1;

      .contact-label {
        display: block;
        font-size: 15px;
        font-weight: 500;
        color: #1C1C1E;
      }

      .contact-value {
        display: block;
        font-size: 13px;
        color: #8E8E93;
        margin-top: 2px;
      }
    }
  }

  /* 提示列表 */
  .tips-list {
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    padding: 16px;
    border-radius: 14px;
    list-style: none;
    margin: 0;

    li {
      font-size: 14px;
      color: #1E40AF;
      line-height: 1.6;
      padding: 8px 0;
      padding-left: 20px;
      position: relative;

      &::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #3B82F6;
      }
    }
  }
</style>
