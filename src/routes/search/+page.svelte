<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { filterApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonSearch from '$lib/components/SkeletonSearch.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import { toast } from '$lib/stores/toast.js';
	import type { ISearchedMoviesOrSeries } from '$lib/types.js';

	let results: ISearchedMoviesOrSeries[] = $state([]);
	let loading = $state(false);
	let error = $state('');
	let errorType = $state<'network' | 'generic'>('generic');
	let searchQuery = $state('');
	let retryCount = $state(0);

	$effect(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const q = urlParams.get('q') || '';
		
		if (q !== searchQuery) {
			searchQuery = q;
			if (q.trim()) {
				performSearch(q);
			} else {
				results = [];
			}
		}
	});

	async function performSearch(query: string) {
		if (!query.trim()) return;
		
		loading = true;
		error = '';
		
		try {
			const data = await filterApi.search(query.trim());
			results = data || [];

			// Show success toast if this was a retry
			if (retryCount > 0 && results.length > 0) {
				toast.success('Pencarian berhasil', `Ditemukan ${results.length} hasil untuk "${query}"`);
			}
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
			toast.error('Pencarian gagal', error);
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		if (searchQuery.trim()) {
			performSearch(searchQuery);
		}
	}

	function handleSearch(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const query = formData.get('q') as string;
		
		if (query.trim()) {
			const url = new URL(window.location.href);
			url.searchParams.set('q', query.trim());
			window.history.pushState({}, '', url.toString());
		}
	}

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
				{#if item.type === 'movie'}
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
								
								{#if item.directors.length > 0}
									<div class="text-sm text-gray-400 mb-1">
										Sutradara: {item.directors[0]}
									</div>
								{/if}
								
								{#if item.casts.length > 0}
									<div class="text-sm text-gray-400">
										Pemain: {item.casts.slice(0, 2).join(', ')}
									</div>
								{/if}
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
								
								{#if item.directors.length > 0}
									<div class="text-sm text-gray-400 mb-1">
										Sutradara: {item.directors[0]}
									</div>
								{/if}
								
								{#if item.casts.length > 0}
									<div class="text-sm text-gray-400">
										Pemain: {item.casts.slice(0, 2).join(', ')}
									</div>
								{/if}
							</div>
						</a>
					</div>
				{/if}
			{/each}
		</div>
	{:else if !searchQuery}
		<!-- Empty State -->
		<EmptyState 
			icon="search"
			title="Cari Film dan Series"
			message="Masukkan kata kunci untuk mencari film atau series favorit Anda"
		>
			<div class="max-w-md mx-auto">
				<form onsubmit={handleSearch}>
					<div class="flex gap-2">
						<input 
							type="text" 
							name="q"
							placeholder="Contoh: Avengers, Squid Game..."
							class="input flex-1"
						/>
						<button type="submit" class="btn btn-primary">
							Cari
						</button>
					</div>
				</form>
			</div>
		</EmptyState>
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