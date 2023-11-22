<script lang="ts">
	import Icon from './Icon/Icon.svelte';
	import type { IconName } from './Icon/icons';

	export let href = '#';
	export let target = '_self';
	export let icon: IconName | undefined = undefined;
	export let textwhite = false;
	$: rel = target === '_blank' ? 'noopener noreferrer' : '';

	$: clazz = `${
		textwhite ? 'text-white hover:text-primary' : 'text-primary hover:text-pink-300'
	} transition-all inline`;
</script>

<a class={clazz} {href} {target} {rel}>
	<span class="inline-flex gap-2 items-center">
		<slot />
		{#if icon}
			<Icon name={icon} class="flex h-6" />
		{/if}
	</span>
</a>
