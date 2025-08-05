<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { seriesApi } from '$lib/api.js';
	import Loading from '$lib/components/Loading.svelte';
	import SkeletonDetail from '$lib/components/SkeletonDetail.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import type { ISeriesDetails, IStreamSources } from '$lib/types.js';

	let series: ISeriesDetails | null = $state(null);
	let streams: IStreamSources[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let activeTab = $state('info');
	let selectedSeason = $state(1);
	let selectedEpisode = $state(1);

	const seriesId = $page.params.id;

	onMount(async () => {
		if (!seriesId) {
			error = 'ID series tidak ditemukan';
			loading = false;
			return;
		}

		try {
			const seriesData = await seriesApi.getSeriesDetails(seriesId);
			series = seriesData;
			
			// Load default episode (S1E1)
			if (series && series.seasons.length > 0) {
				selectedSeason = series.seasons[0].season;
				selectedEpisode = 1;
				await loadEpisodeStreams();
			}
		} catch (err) {
			console.error('Error loading series details:', err);
			error = 'Series tidak ditemukan atau terjadi kesalahan';
		} finally {
			loading = false;
		}
	});

	async function loadEpisodeStreams() {
		try {
			const streamsData = await seriesApi.getSeriesStreams(seriesId, selectedSeason, selectedEpisode);
			streams = streamsData || [];
		} catch (err) {
			console.error('Error loading episode streams:', err);
			streams = [];
		}
	}

	async function changeEpisode(season: number, episode: number) {
		selectedSeason = season;
		selectedEpisode = episode;
		await loadEpisodeStreams();
		activeTab = 'stream';
	}

	function playTrailer() {
		if (series?.trailerUrl) {
			window.open(series.trailerUrl, '_blank');
		}
	}
</script>

<svelte:head>
	{#if series}
		<title>{series.title} - LK21 Streaming</title>
		<meta name="description" content="{series.synopsis.slice(0, 150)}..." />
		<meta property="og:title" content="{series.title}" />
		<meta property="og:description" content="{series.synopsis.slice(0, 150)}..." />
		<meta property="og:image" content="{series.posterImg}" />
	{:else}
		<title>Detail Series - LK21 Streaming</title>
	{/if}
</svelte:head>

{#if loading}
	<SkeletonDetail type="series" />
{:else if error}
	<div class="text-center py-8">
		<div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
			<h2 class="text-xl font-semibold text-red-400 mb-2">Error</h2>
			<p class="text-red-300">{error}</p>
			<a href="/series" class="btn btn-primary mt-4">
				← Kembali ke Series
			</a>
		</div>
	</div>
{:else if series}
	<div class="max-w-6xl mx-auto">
		<!-- Series Header -->
		<div class="grid md:grid-cols-3 gap-8 mb-8">
			<div class="md:col-span-1">
				<img 
					src={series.posterImg} 
					alt={series.title}
					class="w-full rounded-lg shadow-lg"
				/>
			</div>
			
			<div class="md:col-span-2">
				<h1 class="text-3xl md:text-4xl font-bold mb-4">{series.title}</h1>
				
				<div class="flex flex-wrap items-center gap-4 mb-4">
					<div class="flex items-center space-x-2">
						<span class="text-yellow-400">★</span>
						<span class="font-semibold">{series.rating}</span>
					</div>
					<span class="bg-green-600 px-2 py-1 rounded text-sm">EP {series.episode}</span>
					<span class="bg-primary-600 px-2 py-1 rounded text-sm">{series.status}</span>
					<span class="text-gray-400">{series.duration}</span>
					<span class="text-gray-400">{series.releaseDate}</span>
				</div>

				<div class="flex flex-wrap gap-2 mb-4">
					{#each series.genres as genre}
						<span class="genre-tag">{genre}</span>
					{/each}
				</div>

				<p class="text-gray-300 mb-6 leading-relaxed">{series.synopsis}</p>

				<div class="grid md:grid-cols-2 gap-4 mb-6">
					<div>
						<h3 class="font-semibold mb-2">Sutradara</h3>
						<p class="text-gray-300">{series.directors.join(', ')}</p>
					</div>
					<div>
						<h3 class="font-semibold mb-2">Negara</h3>
						<p class="text-gray-300">{series.countries.join(', ')}</p>
					</div>
				</div>

				<div class="mb-6">
					<h3 class="font-semibold mb-2">Pemain</h3>
					<p class="text-gray-300">{series.casts.join(', ')}</p>
				</div>

				<div class="flex flex-wrap gap-4">
					{#if series.trailerUrl}
						<button class="btn btn-primary" onclick={playTrailer}>
							🎬 Tonton Trailer
						</button>
					{/if}
					<button 
						class="btn btn-secondary"
						onclick={() => activeTab = 'episodes'}
					>
						📺 Episode
					</button>
					{#if streams.length > 0}
						<button 
							class="btn btn-secondary"
							onclick={() => activeTab = 'stream'}
						>
							▶️ Streaming
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
				<button 
					class="py-2 border-b-2 font-medium text-sm {
						activeTab === 'episodes' 
							? 'border-primary-500 text-primary-400' 
							: 'border-transparent text-gray-400 hover:text-gray-300'
					}"
					onclick={() => activeTab = 'episodes'}
				>
					Episode ({series.seasons.reduce((total, season) => total + season.totalEpisodes, 0)})
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
						Streaming S{selectedSeason}E{selectedEpisode}
					</button>
				{/if}
			</nav>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'episodes'}
			<div class="space-y-6">
				{#each series.seasons as season}
					<div class="card p-6">
						<h3 class="text-xl font-semibold mb-4">Season {season.season}</h3>
						<div class="grid grid-cols-5 md:grid-cols-10 gap-2">
							{#each Array(season.totalEpisodes) as _, index}
								{@const episodeNum = index + 1}
								<button 
									class="aspect-square flex items-center justify-center rounded border transition-colors {
										selectedSeason === season.season && selectedEpisode === episodeNum
											? 'bg-primary-600 border-primary-500 text-white'
											: 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
									}"
									onclick={() => changeEpisode(season.season, episodeNum)}
								>
									{episodeNum}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else if activeTab === 'stream' && streams.length > 0}
			<div class="mb-4">
				<h3 class="text-lg font-semibold">
					Season {selectedSeason} Episode {selectedEpisode}
				</h3>
			</div>
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
		{:else}
			<div class="card p-6">
				<div class="grid md:grid-cols-2 gap-6">
					<div>
						<h3 class="font-semibold mb-3">Detail Series</h3>
						<dl class="space-y-2">
							<div>
								<dt class="text-gray-400 text-sm">Judul</dt>
								<dd>{series.title}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Rating</dt>
								<dd>{series.rating}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Status</dt>
								<dd>{series.status}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Episode Terbaru</dt>
								<dd>{series.episode}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Durasi</dt>
								<dd>{series.duration}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Tanggal Rilis</dt>
								<dd>{series.releaseDate}</dd>
							</div>
							<div>
								<dt class="text-gray-400 text-sm">Total Season</dt>
								<dd>{series.seasons.length}</dd>
							</div>
						</dl>
					</div>
					<div>
						<h3 class="font-semibold mb-3">Sinopsis</h3>
						<p class="text-gray-300 leading-relaxed">{series.synopsis}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}