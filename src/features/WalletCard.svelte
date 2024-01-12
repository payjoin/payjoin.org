<script lang="ts">
	import type { AcceptedWallet } from '$lib/types';
	import LinkTag from '../components/LinkTag.svelte';

	export let bad = false;
	export let wallets: AcceptedWallet[] = [];
</script>

<div class="flex-1">
	<div
		class={`flex gap-4 p-4 items-center rounded-3xl flex-wrap ${
			bad ? 'bg-red-300' : 'bg-green-400'
		}`}
	>
		{#each wallets as { name, href }}
			<LinkTag {href} {bad} text={name} />
		{/each}
	</div>
</div>
