<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { filterApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import type { IMovies, ISeries } from '$lib/types.js';

	let content: (IMovies | ISeries)[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let currentPage = $state(1);
	let contentType = $state('movies');
	let genreName = $state('');
	let hasMore = $state(true);

	const genreParam = $page.params.genre;

	$effect(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const type = urlParams.get('type') || 'movies';
		const pageNum = parseInt(urlParams.get('page') || '1');
		
		if (type !== contentType || pageNum !== currentPage) {
			contentType = type;
			currentPage = pageNum;
			loadContent();
		}
	});

	async function loadContent() {
		if (!genreParam) return;
		
		loading = true;
		error = '';
		
		try {
			const isSeries = contentType === 'series';
			const data = await filterApi.getByGenre(genreParam, isSeries, currentPage);
			
			content = data || [];
			hasMore = data && data.length > 0;
			
			// Set genre name from first item if available
			if (content.length > 0 && !genreName) {
				const firstItem = content[0] as IMovies | ISeries;
				if (firstItem.genres && firstItem.genres.length > 0) {
					genreName = firstItem.genres.find(g => 
						g.toLowerCase().includes(genreParam.toLowerCase()) ||
						genreParam.toLowerCase().includes(g.toLowerCase())
					) || genreParam;
				} else {
					genreName = genreParam;
				}
			}
		} catch (err) {
			console.error('Error loading content:', err);
			error = 'Gagal memuat konten. Pastikan server API berjalan.';
			content = [];
		} finally {
			loading = false;
		}
	}

	function changeType(type: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('type', type);
		url.searchParams.delete('page');
		window.history.pushState({}, '', url.toString());
	}

	function changePage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.history.pushState({}, '', url.toString());
	}

	onMount(() => {
		loadContent();
	});
</script>

<svelte:head>
	<title>Genre {genreName || genreParam} - LK21 Streaming</title>
	<meta name="description" content="Film dan series dengan genre {genreName || genreParam}. Streaming gratis dengan kualitas HD di LK21." />
</svelte:head>

<div class="mb-8">
	<nav class="mb-4">
		<a href="/genres" class="text-primary-400 hover:text-primary-300">← Kembali ke Genre</a>
	</nav>
	
	<h1 class="text-3xl font-bold mb-4">
		Genre: {genreName || genreParam.charAt(0).toUpperCase() + genreParam.slice(1)}
	</h1>
	
	<!-- Content Type Tabs -->
	<div class="flex gap-2 mb-6">
		<button 
			class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 {
				contentType === 'movies' 
					? 'bg-primary-600 text-white' 
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
			}"
			onclick={() => changeType('movies')}
		>
			Film
		</button>
		<button 
			class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 {
				contentType === 'series' 
					? 'bg-primary-600 text-white' 
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
			}"
			onclick={() => changeType('series')}
		>
			Series
		</button>
	</div>
</div>

{#if loading}
	<Loading text="Memuat konten..." />
{:else if error}
	<div class="text-center py-8">
		<div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
			<h2 class="text-xl font-semibold text-red-400 mb-2">Error</h2>
			<p class="text-red-300">{error}</p>
		</div>
	</div>
{:else if content.length === 0}
	<div class="text-center py-8">
		<p class="text-gray-400">
			Tidak ada {contentType === 'movies' ? 'film' : 'series'} ditemukan untuk genre ini.
		</p>
	</div>
{:else}
	<!-- Content Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
		{#each content as item}
			{#if contentType === 'movies'}
				<MovieCard movie={item as IMovies} />
			{:else}
				<SeriesCard series={item as ISeries} />
			{/if}
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