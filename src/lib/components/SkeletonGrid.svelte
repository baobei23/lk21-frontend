<script lang="ts">
  import SkeletonCard from './SkeletonCard.svelte';
  
  export let count: number = 12;
  export let type: 'movie' | 'series' = 'movie';
  export let showTitle: boolean = true;
  export let title: string = 'Loading...';
</script>

<div>
  {#if showTitle}
    <div class="mb-6">
      <!-- Skeleton Title -->
      <div class="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
      <div class="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
    </div>
  {/if}

  <!-- Skeleton Grid -->
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {#each Array(count) as _, i}
      <SkeletonCard {type} />
    {/each}
  </div>
</div>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>