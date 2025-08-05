<script lang="ts">
  export let count: number = 10;
  export let showImage: boolean = true;
  export let showTitle: boolean = true;
  export let title: string = 'Loading...';
</script>

<div class="animate-pulse">
  {#if showTitle}
    <div class="mb-6">
      <div class="h-8 bg-gray-700 rounded w-48 mb-2"></div>
      <div class="h-4 bg-gray-700 rounded w-32"></div>
    </div>
  {/if}

  <div class="space-y-4">
    {#each Array(count) as _, i}
      <div class="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
        {#if showImage}
          <div class="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0"></div>
        {/if}
        
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-700 rounded w-1/2"></div>
          <div class="flex gap-2">
            <div class="h-3 bg-gray-700 rounded w-12"></div>
            <div class="h-3 bg-gray-700 rounded w-16"></div>
            <div class="h-3 bg-gray-700 rounded w-20"></div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="h-6 bg-gray-700 rounded w-16"></div>
          <div class="h-4 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
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