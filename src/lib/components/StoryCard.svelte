<script lang="ts">
interface Props {
  story: {
    id: number
    gua: string
    title: string
    summary: string
    read: boolean
    level?: string
  }
}

let { story }: Props = $props()

function getLevelColor(level: string | undefined) {
  switch (level) {
    case 'beginner':
      return '#22C55E'
    case 'explorer':
      return '#3B82F6'
    case 'advanced':
      return '#8B5CF6'
    default:
      return '#F97316'
  }
}
</script>

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

<style>
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
</style>
