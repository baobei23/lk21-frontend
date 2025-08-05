<script lang="ts">
  export let showResults: boolean = true;
</script>

<div class="animate-pulse">
  <!-- Search Header Skeleton -->
  <div class="text-center mb-8">
    <div class="h-8 bg-gray-700 rounded w-48 mx-auto mb-2"></div>
    <div class="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
  </div>

  <!-- Search Input Skeleton -->
  <div class="max-w-2xl mx-auto mb-8">
    <div class="h-12 bg-gray-700 rounded-lg"></div>
  </div>

  {#if showResults}
    <!-- Results Header Skeleton -->
    <div class="flex items-center justify-between mb-6">
      <div class="h-6 bg-gray-700 rounded w-32"></div>
      <div class="h-4 bg-gray-700 rounded w-24"></div>
    </div>

    <!-- Results Grid Skeleton -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {#each Array(12) as _, i}
        <div class="bg-gray-800 rounded-lg overflow-hidden">
          <!-- Poster Skeleton -->
          <div class="aspect-[2/3] bg-gray-700 relative">
            <div class="absolute top-2 left-2 w-12 h-5 bg-gray-600 rounded"></div>
            <div class="absolute top-2 right-2 w-8 h-4 bg-gray-600 rounded"></div>
          </div>
          
          <!-- Content Skeleton -->
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
            <div class="flex gap-1">
              <div class="h-4 bg-gray-700 rounded w-12"></div>
              <div class="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Pagination Skeleton -->
    <div class="flex justify-center mt-8">
      <div class="flex gap-2">
        <div class="h-10 bg-gray-700 rounded w-20"></div>
        <div class="h-10 bg-gray-700 rounded w-8"></div>
        <div class="h-10 bg-gray-700 rounded w-8"></div>
        <div class="h-10 bg-gray-700 rounded w-8"></div>
        <div class="h-10 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  {/if}
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