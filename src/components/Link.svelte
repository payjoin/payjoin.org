<script lang="ts">
	import Icon from './Icon/Icon.svelte';
	import type { IconName } from './Icon/icons';

	export let href = '#';
	export let target = '_self';
	export let icon: IconName | undefined = undefined;
	$: rel = target === '_blank' ? 'noopener noreferrer' : '';
</script>

<a {href} {target} {rel}>
	<span class="inline-flex gap-2 items-center">
		<slot />
		{#if icon}
			<Icon name={icon} class="flex h-6" />
		{/if}
	</span>
</a>

<style lang="postcss">
	a:hover {
		@apply dark:text-pink-300 text-pink-800 transition-all;
	}
	a {
		@apply text-primary transition-all inline;
	}
</style>
