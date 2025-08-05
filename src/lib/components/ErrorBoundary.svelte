<script lang="ts">
	interface Props {
		title?: string;
		message?: string;
		showRetry?: boolean;
		showBackButton?: boolean;
		actionText?: string;
		actionHref?: string;
		onRetry?: () => void;
		children?: any;
	}
	
	let { 
		title = "Terjadi Kesalahan", 
		message = "Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
		showRetry = true,
		showBackButton = true,
		actionText,
		actionHref,
		onRetry,
		children 
	}: Props = $props();

	function handleRetry() {
		if (onRetry) {
			onRetry();
		} else {
			window.location.reload();
		}
	}

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = '/';
		}
	}
</script>

<div class="min-h-[400px] flex items-center justify-center py-12">
	<div class="max-w-md mx-auto text-center">
		<!-- Error Icon -->
		<div class="mb-6">
			<div class="mx-auto w-16 h-16 bg-red-900 bg-opacity-50 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
				</svg>
			</div>
		</div>

		<!-- Error Content -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-red-400 mb-3">{title}</h2>
			<p class="text-gray-300 leading-relaxed">{message}</p>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			{#if showRetry}
				<button 
					class="btn btn-primary flex items-center justify-center"
					onclick={handleRetry}
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
					</svg>
					Coba Lagi
				</button>
			{/if}
			
			{#if actionText && actionHref}
				<a 
					href={actionHref}
					class="btn btn-secondary flex items-center justify-center"
				>
					{actionText}
				</a>
			{:else if showBackButton}
				<button 
					class="btn btn-secondary flex items-center justify-center"
					onclick={goBack}
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
					</svg>
					Kembali
				</button>
			{/if}
		</div>

		<!-- Additional Content Slot -->
		{#if children}
			<div class="mt-6">
				{@render children()}
			</div>
		{/if}
	</div>
</div>