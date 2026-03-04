<script lang="ts">
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import { auth } from '$lib/supabase/auth'

  let notifications = $state(true)
  let soundEnabled = $state(true)
  let autoPlay = $state(false)
  let fontSize = $state('medium')

  function goBack() {
    goto('/profile')
  }

  async function handleLogout() {
    if (browser && $auth.user) {
      await auth.signOut()
      goto('/')
    }
  }
</script>

<svelte:head>
  <title>设置 - 易经小课堂</title>
</svelte:head>

<div class="settings-page">
  <!-- 顶部导航 -->
  <header class="nav">
    <button class="back-btn" onclick={goBack}>←</button>
    <h1>设置</h1>
    <div class="placeholder"></div>
  </header>

  <!-- 通知设置 -->
  <section class="settings-section">
    <h2>通知设置</h2>
    
    <div class="setting-item">
      <div class="setting-info">
        <span class="setting-label">学习提醒</span>
        <span class="setting-desc">每日提醒你学习</span>
      </div>
      <label class="toggle">
        <input type="checkbox" bind:checked={notifications} />
        <span class="toggle-slider"></span>
      </label>
    </div>

    <div class="setting-item">
      <div class="setting-info">
        <span class="setting-label">音效</span>
        <span class="setting-desc">操作时播放音效</span>
      </div>
      <label class="toggle">
        <input type="checkbox" bind:checked={soundEnabled} />
        <span class="toggle-slider"></span>
      </label>
    </div>

    <div class="setting-item">
      <div class="setting-info">
        <span class="setting-label">自动播放故事</span>
        <span class="setting-desc">自动翻页阅读</span>
      </div>
      <label class="toggle">
        <input type="checkbox" bind:checked={autoPlay} />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </section>

  <!-- 显示设置 -->
  <section class="settings-section">
    <h2>显示设置</h2>
    
    <div class="setting-item">
      <div class="setting-info">
        <span class="setting-label">字体大小</span>
      </div>
      <select class="select" bind:value={fontSize}>
        <option value="small">小</option>
        <option value="medium">中</option>
        <option value="large">大</option>
      </select>
    </div>
  </section>

  <!-- 账号设置 -->
  <section class="settings-section">
    <h2>账号</h2>
    
    <button class="setting-item clickable" onclick={handleLogout}>
      <div class="setting-info">
        <span class="setting-label danger">退出登录</span>
      </div>
      <span class="arrow">›</span>
    </button>
  </section>

  <!-- 关于 -->
  <section class="settings-section">
    <h2>其他</h2>
    
    <a href="/help" class="setting-item clickable">
      <div class="setting-info">
        <span class="setting-label">帮助中心</span>
      </div>
      <span class="arrow">›</span>
    </a>

    <a href="/about" class="setting-item clickable">
      <div class="setting-info">
        <span class="setting-label">关于我们</span>
      </div>
      <span class="arrow">›</span>
    </a>
  </section>

  <!-- 版本信息 -->
  <div class="version-info">
    <p>易经小课堂 v1.0.0</p>
  </div>
</div>

<style>
  .settings-page {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
  }

  /* 导航 */
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

  /* 设置区块 */
  .settings-section {
    background: white;
    border-radius: 16px;
    margin-bottom: 16px;
    overflow: hidden;

    h2 {
      font-size: 13px;
      font-weight: 600;
      color: #8E8E93;
      padding: 12px 16px 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  /* 设置项 */
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #F2F2F7;

    &:last-child {
      border-bottom: none;
    }

    &.clickable {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: background 0.15s ease;

      &:active {
        background: #F2F2F7;
      }
    }

    .setting-info {
      flex: 1;

      .setting-label {
        display: block;
        font-size: 15px;
        color: #1C1C1E;

        &.danger {
          color: #EF4444;
        }
      }

      .setting-desc {
        display: block;
        font-size: 12px;
        color: #8E8E93;
        margin-top: 2px;
      }
    }

    .arrow {
      font-size: 20px;
      color: #C7C7CC;
    }
  }

  /* 开关 */
  .toggle {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
    flex-shrink: 0;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .toggle-slider {
        background: #F97316;

        &::before {
          transform: translateX(20px);
        }
      }
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #E5E5EA;
      border-radius: 14px;
      transition: background 0.2s ease;

      &::before {
        position: absolute;
        content: "";
        height: 24px;
        width: 24px;
        left: 2px;
        bottom: 2px;
        background: white;
        border-radius: 50%;
        transition: transform 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }
  }

  /* 下拉选择 */
  .select {
    padding: 8px 12px;
    border: 1px solid #E5E5EA;
    border-radius: 8px;
    font-size: 14px;
    color: #1C1C1E;
    background: white;
    outline: none;

    &:focus {
      border-color: #F97316;
    }
  }

  /* 版本信息 */
  .version-info {
    text-align: center;
    padding: 24px 0;

    p {
      font-size: 12px;
      color: #8E8E93;
      margin: 0;
    }
  }
</style>
