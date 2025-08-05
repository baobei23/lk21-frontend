<script lang="ts">
	import { onMount } from 'svelte';
	import { filterApi } from '$lib/api.js';
	import Loading from '$lib/components/Loading.svelte';
	import type { ISetOfYears } from '$lib/types.js';

	let years: ISetOfYears[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const data = await filterApi.getYears();
			// Sort years in descending order (newest first)
			years = (data || []).sort((a, b) => parseInt(b.parameter) - parseInt(a.parameter));
		} catch (err) {
			console.error('Error loading years:', err);
			error = 'Gagal memuat daftar tahun. Pastikan server API berjalan.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Film dan Series Berdasarkan Tahun Rilis - LK21 Streaming</title>
	<meta name="description" content="Jelajahi film dan series berdasarkan tahun rilis. Film terbaru 2024, 2023, dan tahun-tahun sebelumnya di LK21." />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold mb-4">Film & Series Berdasarkan Tahun Rilis</h1>
	<p class="text-gray-300">Jelajahi konten berdasarkan tahun rilis produksi</p>
</div>

{#if loading}
	<Loading text="Memuat daftar tahun..." />
{:else if error}
	<div class="text-center py-8">
		<div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
			<h2 class="text-xl font-semibold text-red-400 mb-2">Error</h2>
			<p class="text-red-300">{error}</p>
		</div>
	</div>
{:else if years.length === 0}
	<div class="text-center py-8">
		<p class="text-gray-400">Tidak ada tahun ditemukan.</p>
	</div>
{:else}
	<div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
		{#each years as year}
			<div class="card card-hover">
				<a href="/years/{year.parameter}" class="block p-6 text-center">
					<h3 class="text-2xl font-bold mb-2 text-primary-400">{year.parameter}</h3>
					<p class="text-gray-400 text-sm">
						{year.numberOfContents} konten
					</p>
				</a>
			</div>
		{/each}
	</div>
{/if}