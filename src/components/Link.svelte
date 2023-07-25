<script lang="ts">
	export let href = '#';
	export let target = '_self';
	$: rel = target === '_blank' ? 'noopener noreferrer' : '';
</script>

<a {href} {rel}>
	<slot />
</a>

<style lang="postcss">
	a:hover {
		@apply dark:text-pink-300 text-pink-800 transition-all;
	}
	a {
		@apply text-primary transition-all;
	}
</style>
