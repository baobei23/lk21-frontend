<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
	let mobileDropdownOpen = $state(false);

	// Helper function to check if current path matches route
	function isActivePath(path: string): boolean {
		if (path === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(path);
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) {
			mobileDropdownOpen = false;
		}
	}

	function toggleMobileDropdown() {
		mobileDropdownOpen = !mobileDropdownOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		mobileDropdownOpen = false;
	}

	// Close mobile menu when clicking on links
	function handleMobileNavClick() {
		closeMobileMenu();
	}

	// Close mobile menu when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			const mobileMenu = document.getElementById('mobile-menu');
			const mobileMenuButton = document.getElementById('mobile-menu-button');
			
			if (mobileMenuOpen && mobileMenu && mobileMenuButton) {
				if (!mobileMenu.contains(target) && !mobileMenuButton.contains(target)) {
					closeMobileMenu();
				}
			}
		}

		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	// Close mobile menu on escape key
	onMount(() => {
		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape' && mobileMenuOpen) {
				closeMobileMenu();
			}
		}

		document.addEventListener('keydown', handleKeydown);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-900">
	<!-- Header Navigation -->
	<header class="bg-gray-800 shadow-lg">
		<nav class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="text-2xl font-bold text-primary-500">
					LK21 Streaming
				</a>
				
				<div class="hidden md:flex items-center space-x-6">
					<a 
						href="/" 
						class="hover:text-primary-400 transition-colors {isActivePath('/') ? 'text-primary-400 font-semibold' : ''}"
					>
						Home
					</a>
					<a 
						href="/movies" 
						class="hover:text-primary-400 transition-colors {isActivePath('/movies') ? 'text-primary-400 font-semibold' : ''}"
					>
						Movies
					</a>
					<a 
						href="/series" 
						class="hover:text-primary-400 transition-colors {isActivePath('/series') ? 'text-primary-400 font-semibold' : ''}"
					>
						Series
					</a>
					
					<!-- Dropdown untuk Filter -->
					<div class="relative group">
						<button class="hover:text-primary-400 transition-colors flex items-center {isActivePath('/genres') || isActivePath('/countries') || isActivePath('/years') ? 'text-primary-400 font-semibold' : ''}">
							Filter
							<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
							</svg>
						</button>
						<div class="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
							<a 
								href="/genres" 
								class="block px-4 py-2 hover:bg-gray-700 rounded-t-lg {isActivePath('/genres') ? 'bg-gray-700 text-primary-400' : ''}"
							>
								Genres
							</a>
							<a 
								href="/countries" 
								class="block px-4 py-2 hover:bg-gray-700 {isActivePath('/countries') ? 'bg-gray-700 text-primary-400' : ''}"
							>
								Negara
							</a>
							<a 
								href="/years" 
								class="block px-4 py-2 hover:bg-gray-700 rounded-b-lg {isActivePath('/years') ? 'bg-gray-700 text-primary-400' : ''}"
							>
								Tahun
							</a>
						</div>
					</div>
					
					<a 
						href="/search" 
						class="hover:text-primary-400 transition-colors {isActivePath('/search') ? 'text-primary-400 font-semibold' : ''}"
					>
						Search
					</a>
				</div>

				<!-- Mobile menu button -->
				<button 
					id="mobile-menu-button"
					class="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700" 
					aria-label="Toggle mobile menu"
					onclick={toggleMobileMenu}
				>
					{#if mobileMenuOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
						</svg>
					{/if}
				</button>
			</div>
		</nav>

		<!-- Mobile Menu Backdrop -->
		{#if mobileMenuOpen}
			<div class="mobile-menu-overlay md:hidden" onclick={closeMobileMenu}></div>
		{/if}

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div 
				id="mobile-menu"
				class="md:hidden bg-gray-800 border-t border-gray-700 shadow-lg animate-slideDown relative z-50"
			>
				<div class="px-4 py-4 space-y-2">
					<a 
						href="/" 
						class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/') ? 'bg-primary-600 text-white font-semibold' : ''}"
						onclick={handleMobileNavClick}
					>
						Home
					</a>
					<a 
						href="/movies" 
						class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/movies') ? 'bg-primary-600 text-white font-semibold' : ''}"
						onclick={handleMobileNavClick}
					>
						Movies
					</a>
					<a 
						href="/series" 
						class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/series') ? 'bg-primary-600 text-white font-semibold' : ''}"
						onclick={handleMobileNavClick}
					>
						Series
					</a>
					
					<!-- Mobile Filter Dropdown -->
					<div class="relative">
						<button 
							class="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-left {isActivePath('/genres') || isActivePath('/countries') || isActivePath('/years') ? 'bg-primary-600 text-white font-semibold' : ''}"
							onclick={toggleMobileDropdown}
						>
							Filter
							<svg 
								class="w-4 h-4 transition-transform duration-200 {mobileDropdownOpen ? 'rotate-180' : ''}" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
							</svg>
						</button>
						
						{#if mobileDropdownOpen}
							<div class="ml-4 mt-2 space-y-1 animate-slideDown">
								<a 
									href="/genres" 
									class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/genres') ? 'bg-gray-700 text-primary-400 font-semibold' : 'text-gray-300'}"
									onclick={handleMobileNavClick}
								>
									Genres
								</a>
								<a 
									href="/countries" 
									class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/countries') ? 'bg-gray-700 text-primary-400 font-semibold' : 'text-gray-300'}"
									onclick={handleMobileNavClick}
								>
									Negara
								</a>
								<a 
									href="/years" 
									class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/years') ? 'bg-gray-700 text-primary-400 font-semibold' : 'text-gray-300'}"
									onclick={handleMobileNavClick}
								>
									Tahun
								</a>
							</div>
						{/if}
					</div>
					
					<a 
						href="/search" 
						class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors {isActivePath('/search') ? 'bg-primary-600 text-white font-semibold' : ''}"
						onclick={handleMobileNavClick}
					>
						Search
					</a>
				</div>
			</div>
		{/if}
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="bg-gray-800 border-t border-gray-700 mt-16">
		<div class="container mx-auto px-4 py-8">
			<div class="text-center text-gray-400">
				<p>&copy; 2024 LK21 Streaming. Dibuat dengan SvelteKit.</p>
			</div>
		</div>
	</footer>


</div>
