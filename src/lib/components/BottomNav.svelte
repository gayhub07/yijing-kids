<script lang="ts">
import { page } from '$app/state'

const navItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/bagua', icon: 'bagua', label: '八卦' },
  { path: '/stories', icon: 'book', label: '故事' },
  { path: '/divination', icon: 'compass', label: '占卜' },
  { path: '/profile', icon: 'user', label: '我的' },
]

const currentPath = $derived(page.url.pathname)
</script>

<nav class="bottom-nav">
  {#each navItems as item}
    <a 
      href={item.path} 
      class="nav-item {currentPath === item.path ? 'active' : ''}"
    >
      {#if item.icon === 'home'}
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      {:else if item.icon === 'bagua'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor"/>
          <circle cx="12" cy="7.5" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="16.5" r="1.5"/>
        </svg>
      {:else if item.icon === 'book'}
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        </svg>
      {:else if item.icon === 'compass'}
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
        </svg>
      {:else if item.icon === 'user'}
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      {/if}
      <span>{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    color: #8E8E93;
    text-decoration: none;
    transition: color 0.2s ease, transform 0.12s ease;
    gap: 4px;
    -webkit-tap-highlight-color: transparent;

    svg {
      width: 24px;
      height: 24px;
      transition: transform 0.2s ease;
    }

    span {
      font-size: 11px;
      font-weight: 500;
    }

    &:active {
      transform: scale(0.9);
    }

    &.active {
      color: #F97316;

      svg {
        transform: scale(1.1);
      }
    }
  }
</style>
