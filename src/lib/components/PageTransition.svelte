<script lang="ts">
import { slide, fade } from 'svelte/transition'

interface Props {
  key: string
}

let { key }: Props = $props()
</script>

<svelte:transition key={key}>
  <div
    transition:slide={{ duration: 200, axis: 'y' }}
    style="height: 100%"
  >
    <slot />
  </div>
</svelte:transition>

<style>
  :global(.page-enter) {
    animation: pageEnter 0.2s ease-out;
  }

  @keyframes pageEnter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
