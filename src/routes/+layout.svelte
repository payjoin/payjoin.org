<script lang="ts">
	import '../app.css';
	import Nav from '../features/Nav.svelte';
</script>

<main class="flex flex-col items-center">
	<Nav />
	<slot />
</main>
