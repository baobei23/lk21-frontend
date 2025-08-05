<script lang="ts">
  export let count: number = 5;
</script>

<div class="flex justify-center items-center space-x-2 animate-pulse">
  <!-- Previous Button Skeleton -->
  <div class="h-10 bg-gray-700 rounded w-20"></div>
  
  <!-- Page Numbers Skeleton -->
  {#each Array(count) as _, i}
    <div class="h-10 bg-gray-700 rounded w-10"></div>
  {/each}
  
  <!-- Next Button Skeleton -->
  <div class="h-10 bg-gray-700 rounded w-20"></div>
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