<script lang="ts">
import '../app.css'
import { onMount } from 'svelte'
import { browser } from '$app/environment'
import { auth } from '$lib/supabase/auth'

let { children } = $props()
let mounted = $state(false)

onMount(() => {
  mounted = true
  if (browser) {
    auth.initialize()
  }
})
</script>

{#if !mounted || $auth.loading}
  <div class="loading-screen">
    <span class="loading-icon">☯️</span>
    <p>加载中...</p>
  </div>
{:else if !$auth.user}
  <div class="welcome-screen">
    <span class="welcome-icon">☯️</span>
    <h1>易经小课堂</h1>
    <p>探索古老智慧，开启学习之旅</p>
    <button class="start-btn" onclick={() => auth.signInAnonymously()}>
      开始学习
    </button>
  </div>
{:else}
  <div class="app-container">
    <main class="main-content">
      {@render children()}
    </main>
    <BottomNav />
  </div>
{/if}

<style>
  .loading-screen, .welcome-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #F97316, #EC4899);
    text-align: center;
    color: white;
  }

  .loading-icon, .welcome-icon {
    font-size: 80px;
    display: block;
    margin-bottom: 24px;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .loading-screen p, .welcome-screen p {
    font-size: 18px;
    opacity: 0.9;
    margin: 0;
  }

  .welcome-screen h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 12px 0;
  }

  .start-btn {
    margin-top: 32px;
    padding: 16px 48px;
    background: white;
    color: #F97316;
    border: none;
    border-radius: 28px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  /* App 主容器 */
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    /* 底部留出足够空间给导航栏 */
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    overflow-y: auto;
  }
</style>
