<script lang="ts">
	import type { ISeries } from '../types.js';
	
	interface Props {
		series: ISeries;
	}
	
	let { series }: Props = $props();
</script>

<div class="card card-hover">
	<a href="/series/{series._id}" class="block">
		<div class="relative">
			<img 
				src={series.posterImg} 
				alt={series.title}
				class="w-full h-80 object-cover"
				loading="lazy"
			/>
			<div class="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
				{series.rating}
			</div>
			<div class="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded text-xs">
				EP {series.episode}
			</div>
		</div>
		
		<div class="p-4">
			<h3 class="font-semibold text-lg mb-2 line-clamp-2">{series.title}</h3>
			
			<div class="flex flex-wrap gap-1 mb-2">
				{#each series.genres.slice(0, 3) as genre}
					<span class="genre-tag">{genre}</span>
				{/each}
			</div>
			
			<div class="text-sm text-gray-400">
				Series • Episode {series.episode}
			</div>
		</div>
	</a>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>