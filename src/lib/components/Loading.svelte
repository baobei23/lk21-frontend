<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		text?: string;
		subText?: string;
		variant?: 'spinner' | 'dots' | 'pulse';
		showIcon?: boolean;
	}
	
	let { 
		size = 'md', 
		text = 'Loading...', 
		subText = '',
		variant = 'spinner',
		showIcon = true
	}: Props = $props();
	
	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	};

	const textSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};
</script>

<div class="flex flex-col items-center justify-center py-8">
	{#if showIcon}
		{#if variant === 'spinner'}
			<!-- Enhanced Spinner Loading -->
			<div class="relative mb-4">
				<div class="animate-spin rounded-full {sizeClasses[size]} border-4 border-gray-600 border-t-primary-500"></div>
			</div>
		{:else if variant === 'dots'}
			<!-- Dots Loading -->
			<div class="flex gap-2 mb-4">
				<div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
				<div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
				<div class="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
			</div>
		{:else if variant === 'pulse'}
			<!-- Pulse Loading -->
			<div class="animate-pulse rounded-full {sizeClasses[size]} bg-primary-500 mb-4"></div>
		{/if}
	{/if}

	<!-- Loading Text -->
	<div class="text-center">
		{#if text}
			<p class="text-gray-200 {textSizeClasses[size]} font-medium mb-1">{text}</p>
		{/if}
		{#if subText}
			<p class="text-gray-400 text-sm">{subText}</p>
		{/if}
	</div>
</div>

<style>
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	@keyframes bounce {
		0%, 20%, 53%, 80%, 100% {
			transform: translateY(0);
		}
		40%, 43% {
			transform: translateY(-8px);
		}
		70% {
			transform: translateY(-4px);
		}
		90% {
			transform: translateY(-2px);
		}
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}

	.animate-bounce {
		animation: bounce 1.4s ease-in-out infinite;
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>