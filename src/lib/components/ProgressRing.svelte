<script lang="ts">
  interface Props {
    progress: number
    color?: string
    size?: number
    strokeWidth?: number
    showLabel?: boolean
  }

  let {
    progress,
    color = '#F97316',
    size = 56,
    strokeWidth = 5,
    showLabel = true
  }: Props = $props()

  const radius = $derived((size - strokeWidth) / 2)
  const circumference = $derived(radius * 2 * Math.PI)
  const offset = $derived(circumference - (Math.min(progress, 100) / 100) * circumference)
</script>

<div class="relative flex items-center justify-center flex-shrink-0" style="width: {size}px; height: {size}px;">
  <svg width={size} height={size} class="block">
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke="#E5E5EA"
      stroke-width={strokeWidth}
    />
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      class="progress-circle"
    />
  </svg>
  {#if showLabel}
    <span class="absolute text-[12px] font-bold text-gray-800">{Math.round(progress)}%</span>
  {/if}
</div>

<style>
  .progress-circle {
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dashoffset 0.5s ease;
  }
</style>
