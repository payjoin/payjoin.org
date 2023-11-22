<script lang="ts">
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
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
				nav?.classList.add('bg-black');
			} else if (scrollY === 0 && !open) {
				nav?.classList.remove('bg-black');
			}
		}
	}

	function handleOpen(event: MouseEvent) {
		if (browser && y <= 0) {
			const nav = document.querySelector('nav');
			nav?.classList.add('bg-black');
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

<nav
	class="fixed w-full flex justify-between transition-all duration-500 bg-opacity-90 items-center p-4 z-10"
>
	<h3 class="text-3xl text-white hidden md:inline">
		<a class="flex gap-2 items-center" href="/"><Icon name="monad" />Payjoin</a>
	</h3>
	<ul class="hidden justify-end gap-4 items-center text-xl md:flex">
		<li><Link textwhite href="#why">Why</Link></li>
		<li><Link textwhite href="#ux">Demo</Link></li>
		<li><Link textwhite href="#privacy">Privacy</Link></li>
		<li><Link textwhite href="#how-to">How to</Link></li>
		<li><Link textwhite href="#adoption">Supporting Wallets</Link></li>
		<li><Link textwhite href="#future-plans">Future Plans</Link></li>
		<li><Link textwhite href="#get-involved">Get Involved</Link></li>
		<!-- TODO: light mode styling -->
		<!-- <li><button on:click={toggleDarkMode}><Icon name="moon" /></button></li> -->
	</ul>
	<!-- Hamburger menu -->
	{#if !open}
		<div class="flex justify-between w-full md:hidden">
			<h3 class="text-3xl text-white self-start">
				<a class="flex gap-2 items-center" href="/"><Icon name="monad" />Payjoin</a>
			</h3>

			<button class="flex items-center" on:click={handleOpen}>
				<Icon class="flex h-6 text-white" name="hamburger" />
			</button>
		</div>
	{:else}
		<div
			class="md:hidden flex items-center w-full"
			in:slide|local
			out:slide|local
			use:clickOutside={handleClose}
		>
			<div class="flex flex-col items-center justify-center h-full gap-4 w-full">
				<button on:click={handleClose}>
					<Icon class="flex h-6 text-white" name="close" />
				</button>

				<!-- FIXME: choppy transitioning -->
				<h3 class="text-3xl text-white">
					<a class="flex gap-2 items-center" href="/"><Icon name="monad" />Payjoin</a>
				</h3>
				<ul class="flex flex-col gap-4 items-center text-2xl">
					<li><Link href="#why">Why</Link></li>
					<li><Link href="#ux">Demo</Link></li>
					<li><Link href="#privacy">Privacy</Link></li>
					<li><Link href="#how-to">How to</Link></li>
					<li><Link href="#future-plans">Future Plans</Link></li>
					<li><Link href="#get-involved">Get Involved</Link></li>
				</ul>
			</div>
		</div>
	{/if}
</nav>
