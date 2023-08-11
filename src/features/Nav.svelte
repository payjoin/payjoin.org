<script lang="ts">
	import Link from '../components/Link.svelte';

	// Change the background color of Nav when the user scrolls
	function handleScroll(scrollY: number) {
		const nav = document.querySelector('nav');
		const navHeight = nav?.offsetHeight || 0;
		const navTop = nav?.offsetTop || 0;

		if (scrollY > navTop + navHeight) {
			nav?.classList.add('bg-black');
		} else {
			nav?.classList.remove('bg-black');
		}
	}

	let y = 0;
	$: handleScroll(y);
</script>

<svelte:window bind:scrollY={y} />

<nav class="fixed w-full flex justify-center transition-all duration-500 mx-auto bg-opacity-90">
	<ul class="flex justify-end p-4 gap-4 items-center text-xl">
		<li><Link href="#">Why</Link></li>
		<li><Link href="#">How to</Link></li>
		<li><Link href="#">Demo</Link></li>
		<li><Link href="#">Privacy</Link></li>
		<li><Link href="#">Dev kit</Link></li>
		<li><Link href="#">Join</Link></li>
		<!-- TODO: light mode styling -->
		<!-- <li><button on:click={toggleDarkMode}><Icon name="moon" /></button></li> -->
	</ul>
</nav>
