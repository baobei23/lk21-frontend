<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { moviesApi } from '$lib/api.js';
	import Loading from '$lib/components/Loading.svelte';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonDetail from '$lib/components/SkeletonDetail.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import { toast } from '$lib/stores/toast.js';
	import type { IMovieDetails, IStreamSources, IDownloads } from '$lib/types.js';

	let movie: IMovieDetails | null = $state(null);
	let streams: IStreamSources[] = $state([]);
	let downloads: IDownloads[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let errorType = $state<'network' | 'generic' | 'notfound'>('generic');
	let activeTab = $state('info');
	let retryCount = $state(0);

	const movieId = $page.params.id;

	async function loadMovieDetails() {
		loading = true;
		error = '';

		if (!movieId) {
			errorType = 'notfound';
			error = 'ID film tidak ditemukan';
			loading = false;
			return;
		}

		try {
			const [movieData, streamsData, downloadsData] = await Promise.all([
				moviesApi.getMovieDetails(movieId),
				moviesApi.getMovieStreams(movieId).catch(() => []),
				moviesApi.getMovieDownloads(movieId).catch(() => [])
			]);

			movie = movieData;
			streams = streamsData;
			downloads = downloadsData;

			// Show success toast if this was a retry
			if (retryCount > 0) {
				toast.success('Berhasil memuat detail film', 'Detail film berhasil dimuat ulang');
			}
		} catch (err: any) {
			console.error('Error loading movie details:', err);
			
			// Determine error type
			if (err.response?.status === 404) {
				errorType = 'notfound';
				error = 'Film tidak ditemukan';
			} else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
				errorType = 'network';
				error = 'Tidak dapat terhubung ke server API';
			} else {
				errorType = 'generic';
				error = 'Terjadi kesalahan saat memuat detail film';
			}

			toast.error('Gagal memuat detail film', error);
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		loadMovieDetails();
	}

	onMount(() => {
		loadMovieDetails();
	});

	function playTrailer() {
		if (movie?.trailerUrl) {
			window.open(movie.trailerUrl, '_blank');
		}
	}
</script>

<svelte:head>
	{#if movie}
		<title>{movie.title} - LK21 Streaming</title>
		<meta name="description" content="{movie.synopsis.slice(0, 150)}..." />
		<meta property="og:title" content="{movie.title}" />
		<meta property="og:description" content="{movie.synopsis.slice(0, 150)}..." />
		<meta property="og:image" content="{movie.posterImg}" />
	{:else}
		<title>Detail Film - LK21 Streaming</title>
	{/if}
</svelte:head>

{#if loading}
	<SkeletonDetail type="movie" />
{:else if error}
	{#if errorType === 'network'}
		<NetworkError onRetry={handleRetry} />
	{:else if errorType === 'notfound'}
		<ErrorBoundary 
			title="Film Tidak Ditemukan"
			message="Film yang Anda cari tidak dapat ditemukan. Mungkin telah dihapus atau URL tidak valid."
			showRetry={false}
			actionText="← Kembali ke Film"
			actionHref="/movies"
		/>
	{:else}
		<ErrorBoundary 
			title="Gagal Memuat Detail Film"
			message={error}
			onRetry={handleRetry}
		>
			<a href="/movies" class="btn btn-secondary mt-4">
				← Kembali ke Film
			</a>
		</ErrorBoundary>
	{/if}
{:else if movie}
	<div class="max-w-6xl mx-auto">
		<!-- Movie Header -->
		<div class="grid md:grid-cols-3 gap-8 mb-8">
			<div class="md:col-span-1">
				<img 
					src={movie.posterImg} 
					alt={movie.title}
					class="w-full rounded-lg shadow-lg"
				/>
			</div>
			
			<div class="md:col-span-2">
				<h1 class="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
				
				<div class="flex flex-wrap items-center gap-4 mb-4">
					<div class="flex items-center space-x-2">
						<span class="text-yellow-400">★</span>
						<span class="font-semibold">{movie.rating}</span>
					</div>
					<span class="bg-primary-600 px-2 py-1 rounded text-sm">{movie.quality}</span>
					<span class="text-gray-400">{movie.duration}</span>
					<span class="text-gray-400">{movie.releaseDate}</span>
				</div>

				<div class="flex flex-wrap gap-2 mb-4">
					{#each movie.genres as genre}
						<span class="genre-tag">{genre}</span>
					{/each}
				</div>

				<p class="text-gray-300 mb-6 leading-relaxed">{movie.synopsis}</p>

				<div class="grid md:grid-cols-2 gap-4 mb-6">
					<div>
						<h3 class="font-semibold mb-2">Sutradara</h3>
						<p class="text-gray-300">{movie.directors.join(', ')}</p>
					</div>
					<div>
						<h3 class="font-semibold mb-2">Negara</h3>
						<p class="text-gray-300">{movie.countries.join(', ')}</p>
					</div>
				</div>

				<div class="mb-6">
					<h3 class="font-semibold mb-2">Pemain</h3>
					<p class="text-gray-300">{movie.casts.join(', ')}</p>
				</div>

				<div class="flex flex-wrap gap-4">
					{#if movie.trailerUrl}
						<button class="btn btn-primary" onclick={playTrailer}>
							🎬 Tonton Trailer
						</button>
					{/if}
					{#if streams.length > 0}
						<button 
							class="btn btn-secondary"
							onclick={() => activeTab = 'stream'}
						>
							▶️ Streaming
						</button>
					{/if}
					{#if downloads.length > 0}
						<button 
							class="btn btn-secondary"
							onclick={() => activeTab = 'download'}
						>
							⬇️ Download
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="border-b border-gray-700 mb-6">
			<nav class="flex space-x-8">
				<button 
					class="py-2 border-b-2 font-medium text-sm {
						activeTab === 'info' 
							? 'border-primary-500 text-primary-400' 
							: 'border-transparent text-gray-400 hover:text-gray-300'
					}"
					onclick={() => activeTab = 'info'}
				>
					Informasi
				</button>
				{#if streams.length > 0}
					<button 
						class="py-2 border-b-2 font-medium text-sm {
							activeTab === 'stream' 
								? 'border-primary-500 text-primary-400' 
								: 'border-transparent text-gray-400 hover:text-gray-300'
						}"
						onclick={() => activeTab = 'stream'}
					>
						Streaming ({streams.length})
					</button>
				{/if}
				{#if downloads.length > 0}
					<button 
						class="py-2 border-b-2 font-medium text-sm {
							activeTab === 'download' 
								? 'border-primary-500 text-primary-400' 
								: 'border-transparent text-gray-400 hover:text-gray-300'
						}"
						onclick={() => activeTab = 'download'}
					>
						Download ({downloads.length})
					</button>
				{/if}
			</nav>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'stream' && streams.length > 0}
			<div class="grid gap-4">
				{#each streams as stream}
					<div class="card p-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold mb-1">{stream.provider}</h3>
								<div class="flex gap-2">
									{#each stream.resolutions as resolution}
										<span class="bg-gray-700 px-2 py-1 rounded text-xs">{resolution}</span>
									{/each}
								</div>
							</div>
							<a 
								href={stream.url} 
								target="_blank"
								class="btn btn-primary"
							>
								Tonton
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else if activeTab === 'download' && downloads.length > 0}
			<div class="grid gap-4">
				{#each downloads as download}
					<div class="card p-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold mb-1">{download.server}</h3>
								<span class="bg-gray-700 px-2 py-1 rounded text-xs">{download.quality}</span>
							</div>
							<a 
								href={download.link} 
								target="_blank"
								class="btn btn-primary"
							>
								Download
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="card p-6">
				<div class="grid md:grid-cols-2 gap-6">
					<div>
						<h3 class="font-semibold mb-3">Detail Film</h3>
						<dl class="space-y-2">
							<div>
								<dt class="text-gray-400 text-sm">Judul</dt>
								<dd>{movie.title}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Rating</dt>
								<dd>{movie.rating}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Kualitas</dt>
								<dd>{movie.quality}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Durasi</dt>
								<dd>{movie.duration}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Tanggal Rilis</dt>
								<dd>{movie.releaseDate}</dd>
							</div>
						</dl>
					</div>
					<div>
						<h3 class="font-semibold mb-3">Sinopsis</h3>
						<p class="text-gray-300 leading-relaxed">{movie.synopsis}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}