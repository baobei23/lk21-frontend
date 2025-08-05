<script lang="ts">
	interface Props {
		icon?: 'search' | 'movie' | 'series' | 'generic';
		title?: string;
		message?: string;
		actionText?: string;
		actionHref?: string;
		onAction?: () => void;
		children?: any;
	}
	
	let { 
		icon = 'generic',
		title = "Tidak Ada Data",
		message = "Tidak ada data yang dapat ditampilkan saat ini.",
		actionText,
		actionHref,
		onAction,
		children 
	}: Props = $props();

	const icons = {
		search: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>`,
		movie: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6M5 8h14M5 12h14M5 16h14"/>`,
		series: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
		generic: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>`
	};
</script>

<div class="min-h-[300px] flex items-center justify-center py-12">
	<div class="max-w-md mx-auto text-center">
		<!-- Empty State Icon -->
		<div class="mb-6">
			<div class="mx-auto w-20 h-20 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center">
				<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html icons[icon]}
				</svg>
			</div>
		</div>

		<!-- Empty State Content -->
		<div class="mb-8">
			<h3 class="text-xl font-semibold text-gray-300 mb-3">{title}</h3>
			<p class="text-gray-400 leading-relaxed">{message}</p>
		</div>

		<!-- Action Button -->
		{#if actionText && (actionHref || onAction)}
			<div class="mb-6">
				{#if actionHref}
					<a href={actionHref} class="btn btn-primary">
						{actionText}
					</a>
				{:else if onAction}
					<button class="btn btn-primary" onclick={onAction}>
						{actionText}
					</button>
				{/if}
			</div>
		{/if}

		<!-- Additional Content Slot -->
		{#if children}
			<div class="mt-6">
				{@render children()}
			</div>
		{/if}
	</div>
</div>