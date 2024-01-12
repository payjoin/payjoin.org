<script lang="ts">
	import Link from '@/components/Link.svelte';
	import '../app.css';
	import Nav from '../features/Nav.svelte';
	import Footer from '@/features/Footer.svelte';
</script>

<main class="flex flex-col items-center">
	<Nav />
	<slot />
	<Footer />
</main>
