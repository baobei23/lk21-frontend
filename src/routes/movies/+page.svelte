<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { moviesApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import { toast } from '$lib/stores/toast.js';
	import type { IMovies } from '$lib/types.js';

	let movies: IMovies[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let errorType = $state<'network' | 'generic'>('generic');
	let currentPage = $state(1);
	let currentTab = $state('latest');
	let hasMore = $state(true);
	let retryCount = $state(0);

	const tabs = [
		{ id: 'latest', name: 'Terbaru', endpoint: 'getMovies' },
		{ id: 'popular', name: 'Populer', endpoint: 'getPopularMovies' },
		{ id: 'recent-release', name: 'Rilis Baru', endpoint: 'getRecentReleaseMovies' },
		{ id: 'top-rated', name: 'Rating Tinggi', endpoint: 'getTopRatedMovies' }
	];

	$effect(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const tab = urlParams.get('tab') || 'latest';
		const pageNum = parseInt(urlParams.get('page') || '1');
		
		if (tab !== currentTab || pageNum !== currentPage) {
			currentTab = tab;
			currentPage = pageNum;
			loadMovies();
		}
	});

	async function loadMovies() {
		loading = true;
		error = '';
		
		try {
			const activeTab = tabs.find(t => t.id === currentTab) || tabs[0];
			const apiMethod = moviesApi[activeTab.endpoint as keyof typeof moviesApi] as Function;
			const data = await apiMethod(currentPage);
			
			movies = data || [];
			hasMore = data && data.length > 0;

			// Show success toast if this was a retry
			if (retryCount > 0) {
				toast.success('Berhasil memuat film', `Data ${activeTab.name.toLowerCase()} berhasil dimuat`);
			}
		} catch (err: any) {
			console.error('Error loading movies:', err);
			
			// Determine error type
			if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
				errorType = 'network';
				error = 'Tidak dapat terhubung ke server API';
			} else {
				errorType = 'generic';
				error = 'Terjadi kesalahan saat memuat data film';
			}

			movies = [];
			toast.error('Gagal memuat film', error);
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		loadMovies();
	}

	function changeTab(tabId: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('tab', tabId);
		url.searchParams.delete('page');
		window.history.pushState({}, '', url.toString());
	}

	function changePage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.history.pushState({}, '', url.toString());
	}

	onMount(() => {
		loadMovies();
	});
</script>

<svelte:head>
	<title>Film Terbaru - LK21 Streaming</title>
	<meta name="description" content="Koleksi film terbaru, populer, dan rating tinggi. Streaming movie gratis dengan kualitas HD di LK21." />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold mb-6">Film</h1>
	
	<!-- Tabs -->
	<div class="flex flex-wrap gap-2 mb-6">
		{#each tabs as tab}
			<button 
				class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 {
					currentTab === tab.id 
						? 'bg-primary-600 text-white' 
						: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
				}"
				onclick={() => changeTab(tab.id)}
			>
				{tab.name}
			</button>
		{/each}
	</div>
</div>

{#if loading}
	<!-- Enhanced Loading with Skeleton -->
	<div class="space-y-6">
		<LoadingProgress 
			message="Memuat film..." 
			subMessage="Mengambil data dari server"
			animated={true}
		/>
		<SkeletonGrid count={12} type="movie" showTitle={false} />
	</div>
{:else if error}
	{#if errorType === 'network'}
		<NetworkError onRetry={handleRetry} />
	{:else}
		<ErrorBoundary 
			title="Gagal Memuat Film"
			message={error}
			onRetry={handleRetry}
		/>
	{/if}
{:else if movies.length === 0}
	<EmptyState 
		icon="movie"
		title="Tidak Ada Film"
		message="Tidak ada film ditemukan untuk kategori ini."
		actionText="Coba Lagi"
		onAction={handleRetry}
	/>
{:else}
	<!-- Movies Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
		{#each movies as movie}
			<MovieCard {movie} />
		{/each}
	</div>

	<!-- Pagination -->
	<div class="flex justify-center items-center space-x-4">
		{#if currentPage > 1}
			<button 
				class="btn btn-secondary"
				onclick={() => changePage(currentPage - 1)}
			>
				← Sebelumnya
			</button>
		{/if}
		
		<span class="text-gray-400">
			Halaman {currentPage}
		</span>
		
		{#if hasMore}
			<button 
				class="btn btn-secondary"
				onclick={() => changePage(currentPage + 1)}
			>
				Selanjutnya →
			</button>
		{/if}
	</div>
{/if}