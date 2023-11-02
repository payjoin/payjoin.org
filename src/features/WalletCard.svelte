<script lang="ts">
	import type { AcceptedWallet } from '$lib/types';
	import LinkTag from '../components/LinkTag.svelte';

	export let bad = false;
	export let wallets: AcceptedWallet[] = [];
</script>

<div class={`flex gap-12 p-4 ${bad ? 'bg-red-400' : 'bg-green-300'}`}>
	{#each wallets as { name, href }}
		<LinkTag {href} {bad} text={name} />
	{/each}
</div>
