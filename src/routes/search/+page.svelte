<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { filterApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonSearch from '$lib/components/SkeletonSearch.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { ISearchedMoviesOrSeries } from '$lib/types.js';

	let results: ISearchedMoviesOrSeries[] = $state([]);
	let loading = $state(false);
	let error = $state('');
	let errorType = $state<'network' | 'generic'>('generic');
	let searchQuery = $state('');
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);
	let itemsPerPage = $state(20);
	let retryCount = $state(0);

	$effect(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const q = urlParams.get('q') || '';
		const pageNum = parseInt(urlParams.get('page') || '1');
		
		if (q !== searchQuery || pageNum !== currentPage) {
			searchQuery = q;
			currentPage = pageNum;
			
			if (q.trim()) {
				performSearch(q, pageNum);
			} else {
				results = [];
				totalItems = 0;
				totalPages = 1;
			}
		}
	});

	let allResults: ISearchedMoviesOrSeries[] = $state([]);

	async function performSearch(query: string, page: number = 1) {
		if (!query.trim()) return;
		
		loading = true;
		error = '';
		
		try {
			const data = await filterApi.search(query.trim());
			allResults = data || [];
			
			// Calculate pagination for client-side pagination
			totalItems = allResults.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
			
			// Get results for current page
			const startIndex = (page - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			results = allResults.slice(startIndex, endIndex);


		} catch (err: any) {
			console.error('Error searching:', err);
			
			// Determine error type
			if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
				errorType = 'network';
				error = 'Tidak dapat terhubung ke server API';
			} else {
				errorType = 'generic';
				error = 'Terjadi kesalahan saat melakukan pencarian';
			}

			results = [];
			allResults = [];
			totalItems = 0;
			totalPages = 1;
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		if (searchQuery.trim()) {
			performSearch(searchQuery, currentPage);
		}
	}

	function handleSearch(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const query = formData.get('q') as string;
		
		if (query.trim()) {
			const url = new URL(window.location.href);
			url.searchParams.set('q', query.trim());
			url.searchParams.delete('page'); // Reset to page 1 for new search
			goto(url.toString(), { replaceState: false });
		}
	}

	function changePage(page: number) {
		if (page === currentPage || !searchQuery.trim()) return;
		
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		goto(url.toString(), { replaceState: false });
	}

	// Handle client-side pagination when page changes
	function updatePaginatedResults() {
		if (allResults.length > 0) {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			results = allResults.slice(startIndex, endIndex);
		}
	}

	// Update results when currentPage changes
	$effect(() => {
		updatePaginatedResults();
	});

	onMount(() => {
		// Focus search input on mount
		const searchInput = document.querySelector('input[name="q"]') as HTMLInputElement;
		if (searchInput) {
			searchInput.focus();
		}
	});
</script>

<svelte:head>
	<title>Pencarian{searchQuery ? ` - ${searchQuery}` : ''} - LK21 Streaming</title>
	<meta name="description" content="Cari film dan series favorit Anda di LK21. Temukan movie dan drama terbaru dengan mudah." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-6">Pencarian</h1>
		
		<!-- Search Form -->
		<form onsubmit={handleSearch} class="mb-6">
			<div class="flex gap-4">
				<input 
					type="text" 
					name="q"
					value={searchQuery}
					placeholder="Cari film atau series..."
					class="input flex-1"
				/>
				<button type="submit" class="btn btn-primary">
					🔍 Cari
				</button>
			</div>
		</form>
		
		{#if searchQuery}
			<p class="text-gray-400">
				{#if loading}
					Mencari "{searchQuery}"...
				{:else if results.length > 0}
					Ditemukan {results.length} hasil untuk "{searchQuery}"
				{:else if !loading && !error}
					Tidak ada hasil untuk "{searchQuery}"
				{/if}
			</p>
		{/if}
	</div>

	{#if loading}
		<SkeletonSearch showResults={searchQuery.length > 0} />
	{:else if error}
	{#if errorType === 'network'}
		<NetworkError onRetry={handleRetry} />
	{:else}
		<ErrorBoundary 
			title="Pencarian Gagal"
			message={error}
			onRetry={handleRetry}
		/>
	{/if}
{:else if results.length > 0}
		<!-- Search Results -->
		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{#each results as item}
				{#if item.type === 'movies'}
					<div class="card card-hover">
						<a href="/movies/{item._id}" class="block">
							<div class="relative">
								<img 
									src={item.posterImg} 
									alt={item.title}
									class="w-full h-80 object-cover"
									loading="lazy"
								/>
								<div class="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-xs">
									Film
								</div>
							</div>
							
							<div class="p-4">
								<h3 class="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
								
								<div class="flex flex-wrap gap-1 mb-2">
									{#each item.genres.slice(0, 2) as genre}
										<span class="genre-tag">{genre}</span>
									{/each}
								</div>
								
							</div>
						</a>
					</div>
				{:else}
					<div class="card card-hover">
						<a href="/series/{item._id}" class="block">
							<div class="relative">
								<img 
									src={item.posterImg} 
									alt={item.title}
									class="w-full h-80 object-cover"
									loading="lazy"
								/>
								<div class="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded text-xs">
									Series
								</div>
							</div>
							
							<div class="p-4">
								<h3 class="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
								
								<div class="flex flex-wrap gap-1 mb-2">
									{#each item.genres.slice(0, 2) as genre}
										<span class="genre-tag">{genre}</span>
									{/each}
								</div>
							</div>
						</a>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Search Results Pagination -->
		{#if totalPages > 1}
			<div class="mt-8">
				<Pagination
					{currentPage}
					{totalPages}
					{totalItems}
					{itemsPerPage}
					{loading}
					showInfo={true}
					showFirstLast={totalPages > 5}
					showPreviousNext={true}
					maxVisiblePages={5}
					onPageChange={changePage}
				/>
			</div>
		{/if}
	{:else if !searchQuery}
		
		
	{:else}
		<!-- No Results State -->
		<EmptyState 
			icon="search"
			title="Tidak Ada Hasil"
			message='Tidak ditemukan hasil untuk "{searchQuery}". Coba kata kunci lain.'
			actionText="Coba Lagi"
			onAction={handleRetry}
		/>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>