<script lang="ts">
interface Props {
  gua: {
    name: string
    pinyin?: string
    symbol: string
    nature: string
    naturePinyin?: string
    element: string
    meaning: string
    learned: boolean
  }
  index: number
}

let { gua, index }: Props = $props()

// 八卦对应的渐变色
const gradients = [
  'linear-gradient(135deg, #FB923C, #EF4444)',
  'linear-gradient(135deg, #FBBF24, #F97316)',
  'linear-gradient(135deg, #34D399, #14B8A6)',
  'linear-gradient(135deg, #22D3EE, #3B82F6)',
  'linear-gradient(135deg, #60A5FA, #6366F1)',
  'linear-gradient(135deg, #A78BFA, #8B5CF6)',
  'linear-gradient(135deg, #F472B6, #FB7185)',
  'linear-gradient(135deg, #FB7185, #EF4444)',
]

const gradient = $derived(gradients[(index - 1) % 8])
</script>

<a href="/bagua/{gua.name}" class="bagua-card" style="background: {gradient}">
  <span class="symbol">{gua.symbol}</span>
  <div class="name-row">
    <h3>{gua.name}</h3>
    {#if gua.pinyin}
      <span class="pinyin">({gua.pinyin})</span>
    {/if}
  </div>
  <p class="nature">
    {gua.nature}
    {#if gua.naturePinyin}
      <span class="nature-pinyin">({gua.naturePinyin})</span>
    {/if}
  </p>
  
  {#if gua.learned}
    <span class="status learned">✓</span>
  {:else}
    <span class="status locked">🔒</span>
  {/if}
</a>

<style>
  .bagua-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 110px;
    padding: 18px;
    border-radius: 16px;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:active {
      transform: scale(0.98);
    }

    .symbol {
      font-size: 36px;
      line-height: 1;
      color: white;
      opacity: 0.95;
      margin-bottom: 12px;
    }

    .name-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 2px;

      h3 {
        font-size: 26px;
        font-weight: 700;
        color: white;
        margin: 0;
      }

      .pinyin {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .nature {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;

      .nature-pinyin {
        font-size: 11px;
        opacity: 0.8;
      }
    }

    .status {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      &.learned {
        background: white;
        color: #22C55E;
        font-weight: 700;
      }

      &.locked {
        background: rgba(255, 255, 255, 0.2);
        font-size: 16px;
      }
    }
  }
</style>
