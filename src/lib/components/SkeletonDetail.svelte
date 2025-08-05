<script lang="ts">
  export let type: 'movie' | 'series' = 'movie';
</script>

<div class="animate-pulse">
  <!-- Hero Section Skeleton -->
  <div class="relative bg-gray-800 mb-8">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Poster Skeleton -->
        <div class="flex-shrink-0">
          <div class="w-64 h-96 bg-gray-700 rounded-lg"></div>
        </div>

        <!-- Info Skeleton -->
        <div class="flex-1 space-y-6">
          <!-- Title Skeleton -->
          <div class="space-y-3">
            <div class="h-8 bg-gray-700 rounded w-3/4"></div>
            <div class="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>

          <!-- Badges Skeleton -->
          <div class="flex flex-wrap gap-2">
            <div class="h-6 bg-gray-700 rounded w-12"></div>
            <div class="h-6 bg-gray-700 rounded w-16"></div>
            <div class="h-6 bg-gray-700 rounded w-20"></div>
          </div>

          <!-- Rating Skeleton -->
          <div class="flex items-center gap-4">
            <div class="h-8 bg-gray-700 rounded w-24"></div>
            <div class="h-6 bg-gray-700 rounded w-32"></div>
          </div>

          <!-- Synopsis Skeleton -->
          <div class="space-y-2">
            <div class="h-4 bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>

          <!-- Details Skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="h-4 bg-gray-700 rounded w-20"></div>
              <div class="h-4 bg-gray-700 rounded w-32"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-700 rounded w-16"></div>
              <div class="h-4 bg-gray-700 rounded w-28"></div>
            </div>
          </div>

          <!-- Action Buttons Skeleton -->
          <div class="flex flex-wrap gap-4">
            <div class="h-10 bg-gray-700 rounded w-32"></div>
            <div class="h-10 bg-gray-700 rounded w-24"></div>
            <div class="h-10 bg-gray-700 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs Skeleton -->
  <div class="container mx-auto px-4">
    <div class="border-b border-gray-700 mb-6">
      <div class="flex gap-8">
        <div class="h-10 bg-gray-700 rounded w-20"></div>
        <div class="h-10 bg-gray-700 rounded w-24"></div>
        <div class="h-10 bg-gray-700 rounded w-20"></div>
      </div>
    </div>

    <!-- Tab Content Skeleton -->
    <div class="space-y-4">
      {#if type === 'series'}
        <!-- Episodes Skeleton -->
        <div class="space-y-4">
          <div class="h-6 bg-gray-700 rounded w-32"></div>
          <div class="grid grid-cols-10 gap-2">
            {#each Array(20) as _, i}
              <div class="h-8 bg-gray-700 rounded aspect-square"></div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Links Skeleton -->
      <div class="space-y-3">
        {#each Array(5) as _, i}
          <div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="h-4 bg-gray-700 rounded w-16"></div>
              <div class="h-4 bg-gray-700 rounded w-24"></div>
            </div>
            <div class="h-8 bg-gray-700 rounded w-20"></div>
          </div>
        {/each}
      </div>
    </div>
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