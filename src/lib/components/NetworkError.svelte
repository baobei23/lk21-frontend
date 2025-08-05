<script lang="ts">
	interface Props {
		onRetry?: () => void;
		showApiStatus?: boolean;
	}
	
	let { onRetry, showApiStatus = true }: Props = $props();
	let checkingApi = $state(false);
	let apiStatus = $state<'unknown' | 'offline' | 'online'>('unknown');

	async function checkApiStatus() {
		checkingApi = true;
		try {
			const response = await fetch('http://localhost:8080/movies?page=1', {
				method: 'GET',
				signal: AbortSignal.timeout(5000) // 5 second timeout
			});
			apiStatus = response.ok ? 'online' : 'offline';
		} catch (error) {
			apiStatus = 'offline';
		} finally {
			checkingApi = false;
		}
	}

	function handleRetry() {
		if (onRetry) {
			onRetry();
		} else {
			window.location.reload();
		}
	}
</script>

<div class="min-h-[400px] flex items-center justify-center py-12">
	<div class="max-w-lg mx-auto text-center">
		<!-- Network Error Icon -->
		<div class="mb-6">
			<div class="mx-auto w-16 h-16 bg-orange-900 bg-opacity-50 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
				</svg>
			</div>
		</div>

		<!-- Error Content -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-orange-400 mb-3">Koneksi Bermasalah</h2>
			<p class="text-gray-300 leading-relaxed mb-4">
				Tidak dapat terhubung ke server. Pastikan:
			</p>
			<ul class="text-left text-gray-300 space-y-2 max-w-sm mx-auto">
				<li class="flex items-start">
					<span class="text-orange-400 mr-2">•</span>
					Server API berjalan di <code class="bg-gray-800 px-2 py-1 rounded text-sm">http://localhost:8080</code>
				</li>
				<li class="flex items-start">
					<span class="text-orange-400 mr-2">•</span>
					Koneksi internet Anda stabil
				</li>
				<li class="flex items-start">
					<span class="text-orange-400 mr-2">•</span>
					Tidak ada pemblokiran firewall
				</li>
			</ul>
		</div>

		<!-- API Status Check -->
		{#if showApiStatus}
			<div class="mb-6">
				<div class="bg-gray-800 rounded-lg p-4 mb-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-400">Status API Server:</span>
						<div class="flex items-center">
							{#if apiStatus === 'unknown'}
								<span class="text-gray-400 text-sm">Belum diperiksa</span>
							{:else if apiStatus === 'online'}
								<div class="flex items-center text-green-400 text-sm">
									<div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
									Online
								</div>
							{:else}
								<div class="flex items-center text-red-400 text-sm">
									<div class="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
									Offline
								</div>
							{/if}
						</div>
					</div>
				</div>
				
				<button 
					class="btn btn-secondary text-sm"
					onclick={checkApiStatus}
					disabled={checkingApi}
				>
					{#if checkingApi}
						<div class="loading-spinner w-4 h-4 mr-2"></div>
						Memeriksa...
					{:else}
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						Periksa Status API
					{/if}
				</button>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<button 
				class="btn btn-primary flex items-center justify-center"
				onclick={handleRetry}
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
				</svg>
				Coba Lagi
			</button>
			
			<a href="/" class="btn btn-secondary flex items-center justify-center">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
				</svg>
				Kembali ke Home
			</a>
		</div>
	</div>
</div>