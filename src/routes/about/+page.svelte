<script lang="ts">
import { goto } from '$app/navigation'

function goBack() {
  goto('/settings')
}
</script>

<svelte:head>
  <title>关于我们 - 易经小课堂</title>
</svelte:head>

<div class="about-page">
  <!-- 顶部导航 -->
  <header class="nav">
    <button class="back-btn" onclick={goBack}>←</button>
    <h1>关于我们</h1>
    <div class="placeholder"></div>
  </header>

  <!-- Logo 和名称 -->
  <div class="app-info">
    <span class="logo">☯️</span>
    <h1>易经小课堂</h1>
    <p class="version">Version 1.0.0</p>
    <p class="tagline">让古老的智慧陪伴孩子成长</p>
  </div>

  <!-- 介绍 -->
  <section class="intro-section">
    <h2>关于应用</h2>
    <p>
      易经小课堂是一款专为 3-12 岁儿童设计的易经启蒙学习应用。我们通过生动有趣的故事、互动游戏和可爱的界面，让孩子们在快乐中学习中国古老的智慧。
    </p>
    <p>
      八卦、六十四卦不再是神秘难懂的符号，而是一个个有趣的故事角色。孩子们可以通过阅读故事、学习卦象、尝试占卜，逐步了解易经的基本概念和其中蕴含的人生哲理。
    </p>
  </section>

  <!-- 功能特色 -->
  <section class="features-section">
    <h2>功能特色</h2>
    
    <div class="feature-item">
      <span class="feature-icon">📚</span>
      <div class="feature-info">
        <h3>趣味故事</h3>
        <p>64个精心编写的故事，用孩子听得懂的语言讲述卦象的含义</p>
      </div>
    </div>

    <div class="feature-item">
      <span class="feature-icon">🎮</span>
      <div class="feature-info">
        <h3>互动学习</h3>
        <p>通过点击、滑动等互动方式，让孩子主动参与学习过程</p>
      </div>
    </div>

    <div class="feature-item">
      <span class="feature-icon">🏆</span>
      <div class="feature-info">
        <h3>成就系统</h3>
        <p>完成学习任务获得成就徽章，激励孩子持续学习</p>
      </div>
    </div>

    <div class="feature-item">
      <span class="feature-icon">📊</span>
      <div class="feature-info">
        <h3>进度追踪</h3>
        <p>记录学习进度，见证孩子的每一步成长</p>
      </div>
    </div>
  </section>

  <!-- 教育理念 -->
  <section class="philosophy-section">
    <h2>教育理念</h2>
    <div class="philosophy-card">
      <p class="philosophy-quote">"天行健，君子以自强不息"</p>
      <p class="philosophy-source">——《周易·乾卦》</p>
    </div>
    <p class="philosophy-text">
      我们相信，传统文化中蕴含着无穷的智慧。通过现代化的方式，将这些智慧传递给下一代，是我们创建这款应用的初衷。希望每一个使用易经小课堂的孩子，都能从中获得启发，养成积极向上的人生态度。
    </p>
  </section>

  <!-- 联系方式 -->
  <section class="contact-section">
    <h2>联系我们</h2>
    
    <div class="contact-item">
      <span class="contact-label">📧 邮箱</span>
      <span class="contact-value">support@yijing-kids.com</span>
    </div>

    <div class="contact-item">
      <span class="contact-label">🌐 官网</span>
      <span class="contact-value">www.yijing-kids.com</span>
    </div>

    <div class="contact-item">
      <span class="contact-label">📱 微信公众号</span>
      <span class="contact-value">易经小课堂</span>
    </div>
  </section>

  <!-- 版权信息 -->
  <footer class="footer">
    <p>© 2026 易经小课堂团队</p>
    <p>保留所有权利</p>
  </footer>
</div>

<style>
  .about-page {
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

  /* App 信息 */
  .app-info {
    text-align: center;
    padding: 32px 0;
    margin-bottom: 24px;

    .logo {
      font-size: 72px;
      display: block;
      margin-bottom: 16px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1C1C1E;
      margin: 0 0 8px 0;
    }

    .version {
      font-size: 13px;
      color: #8E8E93;
      margin: 0 0 8px 0;
    }

    .tagline {
      font-size: 14px;
      color: #F97316;
      margin: 0;
    }
  }

  /* 介绍区块 */
  .intro-section, .features-section, .philosophy-section, .contact-section {
    margin-bottom: 24px;

    h2 {
      font-size: 17px;
      font-weight: 600;
      color: #1C1C1E;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: #3C3C43;
      line-height: 1.7;
      margin: 0 0 12px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  /* 功能特色 */
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px;
    background: white;
    border-radius: 14px;
    margin-bottom: 10px;

    .feature-icon {
      font-size: 28px;
      flex-shrink: 0;
    }

    .feature-info {
      flex: 1;

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1E;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #8E8E93;
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  /* 教育理念 */
  .philosophy-card {
    background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
    padding: 20px;
    border-radius: 14px;
    text-align: center;
    margin-bottom: 12px;

    .philosophy-quote {
      font-size: 18px;
      font-weight: 600;
      color: #9A3412;
      margin: 0 0 8px 0;
    }

    .philosophy-source {
      font-size: 12px;
      color: #C2410C;
      margin: 0;
    }
  }

  .philosophy-text {
    font-size: 14px;
    color: #3C3C43;
    line-height: 1.7;
  }

  /* 联系方式 */
  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    background: white;
    border-radius: 12px;
    margin-bottom: 8px;

    .contact-label {
      font-size: 14px;
      color: #1C1C1E;
    }

    .contact-value {
      font-size: 13px;
      color: #8E8E93;
    }
  }

  /* 页脚 */
  .footer {
    text-align: center;
    padding: 24px 0;
    margin-top: 20px;

    p {
      font-size: 12px;
      color: #8E8E93;
      margin: 0;
      line-height: 1.6;
    }
  }
</style>
