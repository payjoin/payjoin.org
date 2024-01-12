<script lang="ts">
	export let type: 'button' | 'submit' = 'button';
	export let color: 'primary' | 'secondary' = 'primary';
	export let secondary = false;
	export let wide = false;
</script>

<button class:wide class:secondary on:click {type} {color}>
	<slot />
</button>

<style lang="postcss">
	button {
		@apply rounded-lg text-white p-2;
		@apply bg-primary;
	}

	button:not(.secondary):hover {
		@apply bg-pink-600;
		@apply transition-all;
	}

	.secondary:hover {
		@apply dark:outline-pink-300 dark:text-pink-300;
		@apply outline-pink-800 text-pink-800;
		@apply transition-all;
	}

	.secondary {
		@apply outline text-white bg-transparent transition-all;
	}

	.wide {
		@apply w-full;
	}
</style>
