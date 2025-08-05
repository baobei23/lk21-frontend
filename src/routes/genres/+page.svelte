<script lang="ts">
	import { onMount } from 'svelte';
	import { filterApi } from '$lib/api.js';
	import Loading from '$lib/components/Loading.svelte';
	import type { ISetOfGenres } from '$lib/types.js';

	let genres: ISetOfGenres[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const data = await filterApi.getGenres();
			genres = data || [];
		} catch (err) {
			console.error('Error loading genres:', err);
			error = 'Gagal memuat daftar genre. Pastikan server API berjalan.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Genre Film dan Series - LK21 Streaming</title>
	<meta name="description" content="Jelajahi film dan series berdasarkan genre favorit Anda. Action, Romance, Comedy, Horror, dan banyak lagi di LK21." />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold mb-4">Genre</h1>
	<p class="text-gray-300">Jelajahi film dan series berdasarkan genre favorit Anda</p>
</div>

{#if loading}
	<Loading text="Memuat genre..." />
{:else if error}
	<div class="text-center py-8">
		<div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
			<h2 class="text-xl font-semibold text-red-400 mb-2">Error</h2>
			<p class="text-red-300">{error}</p>
		</div>
	</div>
{:else if genres.length === 0}
	<div class="text-center py-8">
		<p class="text-gray-400">Tidak ada genre ditemukan.</p>
	</div>
{:else}
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each genres as genre}
			<div class="card card-hover">
				<a href="/genres/{genre.parameter}" class="block p-6 text-center">
					<h3 class="text-xl font-semibold mb-2">{genre.name}</h3>
					<p class="text-gray-400 text-sm">
						{genre.numberOfContents} konten
					</p>
				</a>
			</div>
		{/each}
	</div>
{/if}