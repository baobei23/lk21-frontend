<script lang="ts">
  import LoadingProgress from './LoadingProgress.svelte';
  import SkeletonGrid from './SkeletonGrid.svelte';
  import SkeletonDetail from './SkeletonDetail.svelte';
  import SkeletonSearch from './SkeletonSearch.svelte';
  import SkeletonList from './SkeletonList.svelte';

  export let type: 'grid' | 'detail' | 'search' | 'list' | 'progress' = 'progress';
  export let message: string = 'Loading...';
  export let subMessage: string = '';
  export let count: number = 12;
  	export let contentType: 'movie' | 'series' = 'movie';
  export let showProgress: boolean = false;
  export let progress: number = 0;
</script>

{#if type === 'progress'}
  <LoadingProgress {message} {subMessage} {showProgress} {progress} />
{:else if type === 'grid'}
  <SkeletonGrid {count} type={contentType} />
{:else if type === 'detail'}
  <SkeletonDetail type={contentType} />
{:else if type === 'search'}
  <SkeletonSearch showResults={true} />
{:else if type === 'list'}
  <SkeletonList {count} />
{/if}