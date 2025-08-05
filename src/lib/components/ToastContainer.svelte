<script lang="ts">
	import { toast, type Toast } from '$lib/stores/toast.js';

	let toasts: Toast[] = $state([]);
	
	// Subscribe to toast store
	toast.subscribe((value) => {
		toasts = value;
	});

	function handleDismiss(id: string) {
		toast.removeToast(id);
	}

	function getToastIcon(type: Toast['type']) {
		switch (type) {
			case 'success':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
			case 'error':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
			case 'warning':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>`;
			case 'info':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
			default:
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`;
		}
	}

	function getToastColors(type: Toast['type']) {
		switch (type) {
			case 'success':
				return {
					bg: 'bg-green-900 bg-opacity-90',
					border: 'border-green-700',
					icon: 'text-green-400',
					title: 'text-green-300'
				};
			case 'error':
				return {
					bg: 'bg-red-900 bg-opacity-90',
					border: 'border-red-700',
					icon: 'text-red-400',
					title: 'text-red-300'
				};
			case 'warning':
				return {
					bg: 'bg-yellow-900 bg-opacity-90',
					border: 'border-yellow-700',
					icon: 'text-yellow-400',
					title: 'text-yellow-300'
				};
			case 'info':
				return {
					bg: 'bg-blue-900 bg-opacity-90',
					border: 'border-blue-700',
					icon: 'text-blue-400',
					title: 'text-blue-300'
				};
			default:
				return {
					bg: 'bg-gray-900 bg-opacity-90',
					border: 'border-gray-700',
					icon: 'text-gray-400',
					title: 'text-gray-300'
				};
		}
	}
</script>

<!-- Toast Container -->
{#if toasts.length > 0}
	<div class="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full" role="region" aria-label="Notifications">
		{#each toasts as toastItem (toastItem.id)}
			{@const colors = getToastColors(toastItem.type)}
			<div 
				class="toast-slide-in {colors.bg} {colors.border} border rounded-lg shadow-lg backdrop-blur-sm"
				role="alert"
				aria-live="polite"
			>
				<div class="p-4">
					<div class="flex items-start">
						<!-- Toast Icon -->
						<div class="flex-shrink-0 mr-3">
							<svg class="w-5 h-5 {colors.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{@html getToastIcon(toastItem.type)}
							</svg>
						</div>

						<!-- Toast Content -->
						<div class="flex-1 min-w-0">
							<h4 class="text-sm font-semibold {colors.title} mb-1">
								{toastItem.title}
							</h4>
							{#if toastItem.message}
								<p class="text-sm text-gray-300 leading-relaxed">
									{toastItem.message}
								</p>
							{/if}
						</div>

						<!-- Dismiss Button -->
						{#if toastItem.dismissible}
							<button 
								class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-300 transition-colors"
								onclick={() => handleDismiss(toastItem.id)}
								aria-label="Tutup notifikasi"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-slide-in {
		animation: slideInRight 0.3s ease-out;
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.toast-slide-in {
			margin-left: 1rem;
			margin-right: 1rem;
			max-width: calc(100vw - 2rem);
		}
	}
</style>