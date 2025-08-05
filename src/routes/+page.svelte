<script lang="ts">
	import { onMount } from 'svelte';
	import { moviesApi, seriesApi } from '$lib/api.js';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import SeriesCard from '$lib/components/SeriesCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import { toast } from '$lib/stores/toast.js';
	import type { IMovies, ISeries } from '$lib/types.js';

	let movies: IMovies[] = $state([]);
	let series: ISeries[] = $state([]);
	let popularMovies: IMovies[] = $state([]);
	let popularSeries: ISeries[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let errorType = $state<'network' | 'generic'>('generic');
	let retryCount = $state(0);

	async function loadData() {
		loading = true;
		error = '';
		
		try {
			const [moviesData, seriesData, popularMoviesData, popularSeriesData] = await Promise.all([
				moviesApi.getMovies(),
				seriesApi.getSeries(),
				moviesApi.getPopularMovies(),
				seriesApi.getPopularSeries()
			]);

			movies = moviesData?.slice(0, 8) || [];
			series = seriesData?.slice(0, 8) || [];
			popularMovies = popularMoviesData?.slice(0, 8) || [];
			popularSeries = popularSeriesData?.slice(0, 8) || [];

			// Show success toast if this was a retry
			if (retryCount > 0) {
				toast.success('Berhasil memuat data', 'Konten berhasil dimuat ulang');
			}
		} catch (err: any) {
			console.error('Error loading data:', err);
			
			// Determine error type
			if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
				errorType = 'network';
				error = 'Tidak dapat terhubung ke server API';
			} else {
				errorType = 'generic';
				error = 'Terjadi kesalahan saat memuat data';
			}

			// Show error toast
			toast.error('Gagal memuat data', error);
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		loadData();
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>LK21 Streaming - Nonton Film dan Series Online</title>
	<meta name="description" content="Streaming film dan series terbaru gratis di LK21. Nonton movie dan drama Korea, Indonesia, Hollywood dengan kualitas HD." />
</svelte:head>

{#if loading}
	<!-- Hero Section (always show) -->
	<section class="mb-12">
		<div class="text-center mb-8">
			<h1 class="text-4xl md:text-6xl font-bold mb-4">
				<span class="text-primary-500">LK21</span> Streaming
			</h1>
			<p class="text-xl text-gray-300 max-w-2xl mx-auto">
				Streaming film dan series terbaru dengan kualitas HD. Nikmati koleksi lengkap movie dan drama dari berbagai negara.
			</p>
		</div>
		
		<div class="flex justify-center space-x-4">
			<a href="/movies" class="btn btn-primary">
				Jelajahi Film
			</a>
			<a href="/series" class="btn btn-secondary">
				Lihat Series
			</a>
		</div>
	</section>

	<!-- Loading Progress -->
	<div class="mb-8">
		<LoadingProgress 
			message="Memuat konten terbaru..." 
			subMessage="Mengambil data film dan series populer"
			showProgress={false}
			animated={true}
		/>
	</div>

	<!-- Skeleton Content Sections -->
	<div class="space-y-12">
		<SkeletonGrid count={8} type="movie" title="Film Terbaru" />
		<SkeletonGrid count={8} type="series" title="Series Terbaru" />
		<SkeletonGrid count={8} type="movie" title="Film Populer" />
		<SkeletonGrid count={8} type="series" title="Series Populer" />
	</div>
{:else if error}
	{#if errorType === 'network'}
		<NetworkError onRetry={handleRetry} />
	{:else}
		<ErrorBoundary 
			title="Gagal Memuat Halaman"
			message={error}
			onRetry={handleRetry}
		/>
	{/if}
{:else if movies.length === 0 && series.length === 0 && popularMovies.length === 0 && popularSeries.length === 0}
	<EmptyState 
		icon="generic"
		title="Tidak Ada Konten"
		message="Tidak ada film atau series yang tersedia saat ini."
		actionText="Coba Lagi"
		onAction={handleRetry}
	/>
{:else}
	<!-- Hero Section -->
	<section class="mb-12">
		<div class="text-center mb-8">
			<h1 class="text-4xl md:text-6xl font-bold mb-4">
				<span class="text-primary-500">LK21</span> Streaming
			</h1>
			<p class="text-xl text-gray-300 max-w-2xl mx-auto">
				Streaming film dan series terbaru dengan kualitas HD. Nikmati koleksi lengkap movie dan drama dari berbagai negara.
			</p>
		</div>
		
		<div class="flex justify-center space-x-4">
			<a href="/movies" class="btn btn-primary">
				Jelajahi Film
			</a>
			<a href="/series" class="btn btn-secondary">
				Lihat Series
			</a>
		</div>
	</section>

	<!-- Popular Movies -->
	{#if popularMovies.length > 0}
		<section class="mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold">Film Populer</h2>
				<a href="/movies?tab=popular" class="text-primary-400 hover:text-primary-300">
					Lihat Semua →
				</a>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each popularMovies as movie}
					<MovieCard {movie} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Popular Series -->
	{#if popularSeries.length > 0}
		<section class="mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold">Series Populer</h2>
				<a href="/series?tab=popular" class="text-primary-400 hover:text-primary-300">
					Lihat Semua →
				</a>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each popularSeries as s}
					<SeriesCard series={s} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Latest Movies -->
	{#if movies.length > 0}
		<section class="mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold">Film Terbaru</h2>
				<a href="/movies" class="text-primary-400 hover:text-primary-300">
					Lihat Semua →
				</a>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each movies as movie}
					<MovieCard {movie} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Latest Series -->
	{#if series.length > 0}
		<section class="mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold">Series Terbaru</h2>
				<a href="/series" class="text-primary-400 hover:text-primary-300">
					Lihat Semua →
				</a>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each series as s}
					<SeriesCard series={s} />
				{/each}
			</div>
		</section>
	{/if}
{/if}
