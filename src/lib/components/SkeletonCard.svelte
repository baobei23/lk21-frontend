<script lang="ts">
  export let type: 'movie' | 'series' = 'movie';
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
  <!-- Skeleton Poster -->
  <div class="aspect-[2/3] bg-gray-700 relative">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-750 to-gray-800"></div>
    <!-- Skeleton Quality Badge -->
    <div class="absolute top-2 left-2 w-8 h-4 bg-gray-600 rounded"></div>
    <!-- Skeleton Rating -->
    <div class="absolute top-2 right-2 w-10 h-4 bg-gray-600 rounded"></div>
    <!-- Skeleton Episode Badge (for series) -->
    {#if type === 'series'}
      <div class="absolute bottom-2 right-2 w-12 h-5 bg-gray-600 rounded"></div>
    {/if}
  </div>

  <!-- Skeleton Content -->
  <div class="p-3 space-y-3">
    <!-- Skeleton Title -->
    <div class="space-y-2">
      <div class="h-4 bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>

    <!-- Skeleton Year -->
    <div class="h-3 bg-gray-700 rounded w-16"></div>

    <!-- Skeleton Genres -->
    <div class="flex flex-wrap gap-1">
      <div class="h-5 bg-gray-700 rounded w-12"></div>
      <div class="h-5 bg-gray-700 rounded w-16"></div>
      <div class="h-5 bg-gray-700 rounded w-14"></div>
    </div>

    <!-- Skeleton Rating Bar -->
    <div class="flex items-center gap-2">
      <div class="h-3 bg-gray-700 rounded w-3"></div>
      <div class="h-2 bg-gray-700 rounded flex-1"></div>
      <div class="h-3 bg-gray-700 rounded w-8"></div>
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

  /* Enhanced gradient for more realistic skeleton */
  .bg-gradient-to-br {
    background: linear-gradient(135deg, #374151, #4b5563, #374151);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>