<script lang="ts">
	import type { IconName } from './icons';
	import icons from './icons';

	export let name: IconName;
</script>

<span class={`flex ${$$props.class || 'h-6 text-primary'} aspect-square`}>
	{icons[name]}
</span>
