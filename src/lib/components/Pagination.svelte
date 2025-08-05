<script lang="ts">
	interface Props {
		currentPage?: number;
		totalPages?: number;
		totalItems?: number;
		itemsPerPage?: number;
		showInfo?: boolean;
		showFirstLast?: boolean;
		showPreviousNext?: boolean;
		maxVisiblePages?: number;
		loading?: boolean;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = 1,
		totalPages = 1,
		totalItems = 0,
		itemsPerPage = 24,
		showInfo = true,
		showFirstLast = true,
		showPreviousNext = true,
		maxVisiblePages = 5,
		loading = false,
		onPageChange
	}: Props = $props();

	// Calculate visible page numbers
	function getVisiblePages(current: number, total: number, max: number): number[] {
		if (total <= max) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		const half = Math.floor(max / 2);
		let start = Math.max(1, current - half);
		let end = Math.min(total, start + max - 1);

		// Adjust start if we're near the end
		if (end - start + 1 < max) {
			start = Math.max(1, end - max + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}

	const visiblePages = $derived(getVisiblePages(currentPage, totalPages, maxVisiblePages));
	const startItem = $derived((currentPage - 1) * itemsPerPage + 1);
	const endItem = $derived(Math.min(currentPage * itemsPerPage, totalItems));

	function handlePageChange(page: number) {
		if (page === currentPage || page < 1 || page > totalPages || loading) return;
		onPageChange?.(page);
	}

	function handleKeydown(event: KeyboardEvent, page: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handlePageChange(page);
		}
	}
</script>

<div class="flex flex-col items-center space-y-4">
	<!-- Pagination Info -->
	{#if showInfo && totalItems > 0}
		<div class="text-sm text-gray-400 text-center">
			Menampilkan <span class="font-medium text-gray-200">{startItem}-{endItem}</span> 
			dari <span class="font-medium text-gray-200">{totalItems}</span> hasil
			{#if totalPages > 1}
				(Halaman <span class="font-medium text-gray-200">{currentPage}</span> dari <span class="font-medium text-gray-200">{totalPages}</span>)
			{/if}
		</div>
	{/if}

	<!-- Pagination Controls -->
	{#if totalPages > 1}
		<div class="flex items-center space-x-1">
			<!-- First Page -->
			{#if showFirstLast && currentPage > 1}
				<button
					class="pagination-btn {loading ? 'opacity-50 cursor-not-allowed' : ''}"
					onclick={() => handlePageChange(1)}
					onkeydown={(e) => handleKeydown(e, 1)}
					disabled={loading}
					aria-label="Halaman pertama"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
					</svg>
				</button>
			{/if}

			<!-- Previous Page -->
			{#if showPreviousNext}
				<button
					class="pagination-btn {currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : ''}"
					onclick={() => handlePageChange(currentPage - 1)}
					onkeydown={(e) => handleKeydown(e, currentPage - 1)}
					disabled={currentPage === 1 || loading}
					aria-label="Halaman sebelumnya"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
					<span class="hidden sm:inline ml-1">Sebelumnya</span>
				</button>
			{/if}

			<!-- Page Numbers -->
			<div class="flex items-center space-x-1">
				{#each visiblePages as page}
					<button
						class="pagination-number {page === currentPage ? 'active' : ''} {loading ? 'opacity-50 cursor-not-allowed' : ''}"
						onclick={() => handlePageChange(page)}
						onkeydown={(e) => handleKeydown(e, page)}
						disabled={loading}
						aria-label="Halaman {page}"
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</button>
				{/each}
			</div>

			<!-- Next Page -->
			{#if showPreviousNext}
				<button
					class="pagination-btn {currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : ''}"
					onclick={() => handlePageChange(currentPage + 1)}
					onkeydown={(e) => handleKeydown(e, currentPage + 1)}
					disabled={currentPage === totalPages || loading}
					aria-label="Halaman selanjutnya"
				>
					<span class="hidden sm:inline mr-1">Selanjutnya</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</button>
			{/if}

			<!-- Last Page -->
			{#if showFirstLast && currentPage < totalPages}
				<button
					class="pagination-btn {loading ? 'opacity-50 cursor-not-allowed' : ''}"
					onclick={() => handlePageChange(totalPages)}
					onkeydown={(e) => handleKeydown(e, totalPages)}
					disabled={loading}
					aria-label="Halaman terakhir"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Quick Jump (for large page counts) -->
		{#if totalPages > 10}
			<div class="flex items-center space-x-2 text-sm">
				<span class="text-gray-400">Lompat ke:</span>
				<input
					type="number"
					min="1"
					max={totalPages}
					value={currentPage}
					class="w-16 px-2 py-1 text-center bg-gray-700 border border-gray-600 rounded text-white focus:border-primary-500 focus:outline-none"
					onchange={(e) => {
						const page = parseInt(e.currentTarget.value);
						if (page >= 1 && page <= totalPages) {
							handlePageChange(page);
						}
					}}
					disabled={loading}
					aria-label="Nomor halaman"
				/>
				<span class="text-gray-400">dari {totalPages}</span>
			</div>
		{/if}
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center space-x-2 text-sm text-gray-400">
			<div class="animate-spin w-4 h-4 border-2 border-gray-600 border-t-primary-500 rounded-full"></div>
			<span>Memuat halaman...</span>
		</div>
	{/if}
</div>

<style>
	.pagination-btn {
		@apply flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
	}

	.pagination-number {
		@apply flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
	}

	.pagination-number.active {
		@apply bg-primary-600 text-white border-primary-500 cursor-default;
	}

	.pagination-number.active:hover {
		@apply bg-primary-600;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>