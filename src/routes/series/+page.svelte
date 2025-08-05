<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { seriesApi } from '$lib/api.js';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import type { ISeries } from '$lib/types.js';

	let series: ISeries[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let currentPage = $state(1);
	let currentTab = $state('latest');
	let hasMore = $state(true);

	const tabs = [
		{ id: 'latest', name: 'Terbaru', endpoint: 'getSeries' },
		{ id: 'popular', name: 'Populer', endpoint: 'getPopularSeries' },
		{ id: 'recent-release', name: 'Rilis Baru', endpoint: 'getRecentReleaseSeries' },
		{ id: 'top-rated', name: 'Rating Tinggi', endpoint: 'getTopRatedSeries' }
	];

	$effect(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const tab = urlParams.get('tab') || 'latest';
		const pageNum = parseInt(urlParams.get('page') || '1');
		
		if (tab !== currentTab || pageNum !== currentPage) {
			currentTab = tab;
			currentPage = pageNum;
			loadSeries();
		}
	});

	async function loadSeries() {
		loading = true;
		error = '';
		
		try {
			const activeTab = tabs.find(t => t.id === currentTab) || tabs[0];
			const apiMethod = seriesApi[activeTab.endpoint as keyof typeof seriesApi] as Function;
			const data = await apiMethod(currentPage);
			
			series = data || [];
			hasMore = data && data.length > 0;
		} catch (err) {
			console.error('Error loading series:', err);
			error = 'Gagal memuat data series. Pastikan server API berjalan.';
			series = [];
		} finally {
			loading = false;
		}
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
		loadSeries();
	});
</script>

<svelte:head>
	<title>Series Terbaru - LK21 Streaming</title>
	<meta name="description" content="Koleksi series terbaru, populer, dan rating tinggi. Streaming drama Korea, Indonesia, Thailand dengan kualitas HD di LK21." />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold mb-6">Series</h1>
	
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
			message="Memuat series..." 
			subMessage="Mengambil data series terbaru"
			animated={true}
		/>
		<SkeletonGrid count={12} type="series" showTitle={false} />
	</div>
{:else if error}
	<div class="text-center py-8">
		<div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
			<h2 class="text-xl font-semibold text-red-400 mb-2">Error</h2>
			<p class="text-red-300">{error}</p>
		</div>
	</div>
{:else if series.length === 0}
	<div class="text-center py-8">
		<p class="text-gray-400">Tidak ada series ditemukan.</p>
	</div>
{:else}
	<!-- Series Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
		{#each series as s}
			<SeriesCard series={s} />
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