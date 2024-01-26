<script lang="ts">
	import { browser } from '$app/environment';
	import Link from '../components/Link.svelte';
	import Icon from '../components/Icon/Icon.svelte';
	import { clickOutside } from '$lib/events';

	// Change the background color of Nav when the user scrolls
	function handleScroll(scrollY: number) {
		if (browser) {
			const nav = document.querySelector('nav');
			// const navHeight = nav?.offsetHeight || 0;
			// const navTop = nav?.offsetTop || 0;

			if (scrollY > 0) {
				nav?.classList.add('border-b', 'border-tertiary', 'bg-secondary');
			} else if (scrollY === 0 && !open) {
				nav?.classList.remove('bg-secondary', 'border-b', 'border-tertiary');
			}
		}
	}

	function handleOpen(event: MouseEvent) {
		if (browser && y <= 0) {
			const nav = document.querySelector('nav');
			nav?.classList.add('bg-[#46192b]');
		}
		open = true;
		event.stopPropagation();
	}

	function handleClose() {
		open = false;
	}

	let y = 0;
	let open = false;
	$: handleScroll(y);
</script>

<svelte:window bind:scrollY={y} />

<nav class="fixed w-full flex justify-between bg-opacity-90 items-center p-4 z-10 left-0">
	<h3 class="text-3xl text-white hidden md:inline">
		<a class="flex gap-2 items-center" href="/"><Icon name="monad" /></a>
	</h3>
	<ul class="hidden justify-end gap-4 items-center text-xl md:flex">
		<li><Link textwhite href="https://payjoindevkit.org/introduction/">Dev Kit</Link></li>
		<li><Link textwhite href="https://discord.gg/6rJD9R684h">Discord</Link></li>
		<li><Link textwhite href="https://payjoin.substack.com/">News</Link></li>
	</ul>
	<!-- Hamburger menu -->
	{#if !open}
		<div class="flex justify-between w-full md:hidden">
			<h3 class="text-3xl text-white self-start">
				<a class="flex gap-2 items-center" href="/"><Icon name="monad" /></a>
			</h3>

			<button class="flex items-center" on:click={handleOpen}>
				<Icon class="flex h-6 w-6 text-white" name="hamburger" />
			</button>
		</div>
	{:else}
		<div class="md:hidden flex items-center w-full" use:clickOutside={handleClose}>
			<div class="flex flex-col items-center justify-center h-full gap-4 w-full">
				<button on:click={handleClose}>
					<Icon class="flex h-6 text-white" name="close" />
				</button>

				<!-- FIXME: choppy transitioning -->
				<h3 class="text-3xl text-white">
					<a class="flex gap-2 items-center" href="/"><Icon name="monad" /></a>
				</h3>
				<ul class="flex flex-col gap-4 items-center text-2xl">
					<li><Link textwhite href="https://payjoindevkit.org/introduction/">Dev Kit</Link></li>
					<li><Link textwhite href="https://discord.gg/6rJD9R684h">Discord</Link></li>
					<li><Link textwhite href="https://payjoin.substack.com/">News</Link></li>
				</ul>
			</div>
		</div>
	{/if}
</nav>
