<script lang="ts">
  export let message: string = 'Loading...';
  export let subMessage: string = '';
  export let progress: number = 0; // 0-100
  export let showProgress: boolean = false;
  export let animated: boolean = true;
</script>

<div class="flex flex-col items-center justify-center py-12">
  <!-- Loading Spinner -->
  <div class="relative mb-4">
    <div class="w-12 h-12 border-4 border-gray-600 border-t-primary-500 rounded-full {animated ? 'animate-spin' : ''}"></div>
    {#if showProgress}
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs font-semibold text-primary-400">{Math.round(progress)}%</span>
      </div>
    {/if}
  </div>

  <!-- Progress Bar -->
  {#if showProgress}
    <div class="w-64 h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300 ease-out"
        style="width: {progress}%"
      ></div>
    </div>
  {/if}

  <!-- Loading Message -->
  <div class="text-center">
    <p class="text-lg font-medium text-gray-200 mb-1">{message}</p>
    {#if subMessage}
      <p class="text-sm text-gray-400">{subMessage}</p>
    {/if}
  </div>

  <!-- Loading Animation Dots -->
  <div class="flex gap-1 mt-4">
    <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
    <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
    <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
  </div>
</div>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translateY(0);
    }
    40%, 43% {
      transform: translateY(-8px);
    }
    70% {
      transform: translateY(-4px);
    }
    90% {
      transform: translateY(-2px);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-bounce {
    animation: bounce 1.4s ease-in-out infinite;
  }
</style>