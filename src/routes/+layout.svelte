<script lang="ts">
	import '../app.css';
	import Nav from '../features/Nav.svelte';
</script>

<Nav />

<main class="flex flex-col mx-auto w-4/5 h-screen" on:scroll={() => console.log('asdf')}>
	<slot />
</main>
