<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { filterApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { IMovies, ISeries } from '$lib/types.js';

	let content: (IMovies | ISeries)[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let currentPage = $state(1);
	let contentType = $state('movies');
	let countryName = $state('');
	let totalPages = $state(1);
	let totalItems = $state(0);
	let itemsPerPage = $state(24);

	const countryParam = $page.params.country;

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
		if (!countryParam) return;
		
		loading = true;
		error = '';
		
		try {
			const isSeries = contentType === 'series';
			const data = await filterApi.getByCountry(countryParam, isSeries, currentPage);
			
			content = data || [];
			
			// Calculate pagination info
			// Since API doesn't return total count, we estimate based on results
			const hasNextPage = data && data.length === itemsPerPage;
			
			if (data && data.length > 0) {
				// Estimate total items (this is approximate)
				totalItems = hasNextPage ? (currentPage * itemsPerPage) + 1 : ((currentPage - 1) * itemsPerPage) + data.length;
				// Calculate total pages based on whether there are more results
				totalPages = hasNextPage ? currentPage + 1 : currentPage;
			} else {
				totalItems = 0;
				totalPages = 1;
			}
			
			// Set country name - capitalize first letter
			if (!countryName) {
				countryName = countryParam.charAt(0).toUpperCase() + countryParam.slice(1).replace(/-/g, ' ');
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
		goto(url.toString(), { replaceState: false });
	}

	function changePage(page: number) {
		if (page === currentPage) return;
		
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		goto(url.toString(), { replaceState: false });
	}

	onMount(() => {
		loadContent();
	});
</script>

<svelte:head>
	<title>Film & Series dari {countryName || countryParam} - LK21 Streaming</title>
	<meta name="description" content="Film dan series dari {countryName || countryParam}. Streaming gratis dengan kualitas HD di LK21." />
</svelte:head>

<div class="mb-8">
	<nav class="mb-4">
		<a href="/countries" class="text-primary-400 hover:text-primary-300">← Kembali ke Negara</a>
	</nav>
	
	<h1 class="text-3xl font-bold mb-4">
		{countryName || (countryParam ? countryParam.charAt(0).toUpperCase() + countryParam.slice(1) : 'Negara')}
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
			Tidak ada {contentType === 'movies' ? 'film' : 'series'} ditemukan dari negara ini.
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

	<!-- Enhanced Pagination -->
	<Pagination
		{currentPage}
		{totalPages}
		{totalItems}
		{itemsPerPage}
		{loading}
		showInfo={true}
		showFirstLast={true}
		showPreviousNext={true}
		maxVisiblePages={5}
		onPageChange={changePage}
	/>
{/if}