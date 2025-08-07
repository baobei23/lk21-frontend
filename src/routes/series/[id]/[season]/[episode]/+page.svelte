<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { seriesApi } from '$lib/api.js';
	import NetworkError from '$lib/components/NetworkError.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import SkeletonDetail from '$lib/components/SkeletonDetail.svelte';
	import type { ISeriesDetails, IStreamSources } from '$lib/types.js';

	let series: ISeriesDetails | null = $state(null);
	let streams: IStreamSources[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let errorType = $state<'network' | 'generic' | 'notfound'>('generic');
	let retryCount = $state(0);

	const { id, season, episode } = $page.params;

	async function loadEpisodeDetails() {
		loading = true;
		error = '';

		if (!id || !season || !episode) {
			errorType = 'notfound';
			error = 'Parameter tidak valid untuk memuat episode.';
			loading = false;
			return;
		}

		try {
			const [seriesData, streamsData] = await Promise.all([
				seriesApi.getSeriesDetails(id),
				seriesApi.getSeriesStreams(id, parseInt(season), parseInt(episode)).catch(() => [])
			]);

			series = seriesData;
			streams = streamsData;

			if (streams.length === 0) {
				errorType = 'notfound';
				error = 'Sumber streaming untuk episode ini tidak ditemukan.';
			}

		} catch (err: any) {
			console.error('Error loading episode details:', err);
			
			if (err.response?.status === 404) {
				errorType = 'notfound';
				error = 'Serial atau episode tidak ditemukan.';
			} else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
				errorType = 'network';
				error = 'Tidak dapat terhubung ke server API.';
			} else {
				errorType = 'generic';
				error = 'Terjadi kesalahan saat memuat detail episode.';
			}
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		retryCount += 1;
		loadEpisodeDetails();
	}

	onMount(() => {
		loadEpisodeDetails();
	});

	function openStream(url: string) {
		window.open(url, '_blank');
	}

</script>

<svelte:head>
	{#if series}
		<title>{series.title} S{season}E{episode} - LK21 Streaming</title>
		<meta name="description" content={`Tonton ${series.title} Season ${season} Episode ${episode}. ${series.synopsis.slice(0, 120)}...`} />
	{:else}
		<title>Detail Episode - LK21 Streaming</title>
	{/if}
</svelte:head>

{#if loading}
	<SkeletonDetail type="series" />
{:else if error}
    {#if errorType === 'network'}
        <NetworkError onRetry={handleRetry} />
    {:else}
        <ErrorBoundary 
            title={errorType === 'notfound' ? 'Episode Tidak Ditemukan' : 'Gagal Memuat Episode'}
            message={error}
            showRetry={errorType !== 'notfound'}
            onRetry={handleRetry}
            actionText="← Kembali ke Detail Serial"
            actionHref={`/series/${id}`}
        />
    {/if}
{:else if series}
	<div class="max-w-6xl mx-auto">
        <div class="text-center my-6">
            <h1 class="text-3xl font-bold">{series.title}</h1>
            <h2 class="text-xl text-gray-400">Season {season}, Episode {episode}</h2>
            <a href={`/series/${id}`} class="text-primary-400 hover:underline mt-2 inline-block">← Kembali ke Daftar Episode</a>
        </div>

		<!-- Stream Selection -->
		{#if streams.length > 0}
            <div class="mb-8">
                <h3 class="text-xl font-semibold mb-4 text-center">Pilih Sumber Streaming</h3>
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each streams as stream, index (stream.url)}
                        <button 
                            class="card p-4 text-left transition-colors hover:bg-gray-700"
                            on:click={() => openStream(stream.url)}
                        >
                            <h4 class="font-semibold mb-1">{stream.provider || `Sumber ${index + 1}`}</h4>
                            <div class="flex gap-2">
                                {#each stream.resolutions as resolution}
                                    <span class="bg-gray-600 px-2 py-1 rounded text-xs">{resolution}</span>
                                {/each}
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Other Episodes -->
        <div class="card p-6">
            <h3 class="text-xl font-semibold mb-4">Episode Lainnya</h3>
            <div class="space-y-4">
                {#each series.seasons as seasonItem}
                    <div>
                        <h4 class="font-semibold text-lg mb-2">Season {seasonItem.season}</h4>
                        <div class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-12 gap-2">
                            {#each Array(seasonItem.totalEpisodes) as _, index}
                                {@const episodeNum = index + 1}
                                <a 
                                    href={`/series/${id}/${seasonItem.season}/${episodeNum}`}
                                    class="aspect-square flex items-center justify-center rounded border bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                    }"
                                >
                                    {episodeNum}
                                </a>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
	</div>
{/if}
