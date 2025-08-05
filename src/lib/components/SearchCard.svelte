<script lang="ts">
	import type { ISearchedMoviesOrSeries } from '$lib/types.js';
	
	interface Props {
		item: ISearchedMoviesOrSeries;
	}
	
	let { item }: Props = $props();
	
	const isMovie = item.type === 'movies';
	const href = isMovie ? `/movies/${item._id}` : `/series/${item._id}`;
	const typeLabel = isMovie ? 'Film' : 'Series';
	const typeColor = isMovie ? 'bg-blue-600' : 'bg-green-600';
</script>

<div class="card card-hover">
	<a href={href} class="block">
		<div class="relative">
			<img 
				src={item.posterImg} 
				alt={item.title}
				class="w-full h-80 object-cover rounded-t-lg"
				loading="lazy"
			/>
			<div class="absolute top-3 left-3 {typeColor} px-2 py-1 rounded-md text-xs font-medium text-white shadow-md">
				{typeLabel}
			</div>
		</div>
		
		<div class="p-4">
			<h3 class="font-semibold text-lg mb-3 line-clamp-2 text-white hover:text-blue-400 transition-colors">
				{item.title}
			</h3>
			
			<div class="flex flex-wrap gap-1.5 mb-2">
				{#each item.genres.slice(0, 2) as genre}
					<span class="genre-tag text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
						{genre}
					</span>
				{/each}
			</div>
			

		</div>
	</a>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.card {
		background: rgba(31, 41, 55, 0.8);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.3s ease;
		border: 1px solid rgba(75, 85, 99, 0.3);
	}
	
	.card-hover:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		border-color: rgba(59, 130, 246, 0.5);
	}
	
	.genre-tag {
		transition: all 0.2s ease;
	}
	
	.genre-tag:hover {
		background-color: rgba(75, 85, 99, 0.8);
		color: white;
	}
</style>