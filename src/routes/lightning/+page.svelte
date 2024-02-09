<script lang="ts">
	import H1 from '@components/Header/H1.svelte';
	import H2 from '@components/Header/H2.svelte';
	import Link from '@components/Link.svelte';
</script>

<svelte:head>
	<title>Lightning</title>
</svelte:head>

<section class="text-white mt-24 w-2/3 flex flex-col gap-4 text-xl">
	<H1>How Payjoin Improves Lightning</H1>
	<div class="flex flex-col gap-4">
		<div>
			The Lightning Network (LN) is a second-layer solution built on Bitcoin that takes transactions
			off-chain to allow for near-instant, final settlements with far lower fees, tremendously
			increasing transaction throughput, improving privacy, and allowing for new use cases for
			Bitcoin such as micropayments. It uses a network of payment channels between nodes to route
			payments from source to destination. These channels require node operators to lock up
			“liquidity” (bitcoin that can flow between one node and its channel partner) between their
			channel partners. How much bitcoin you can spend in a channel is limited by how much liquidity
			exists on your side of that channel.
		</div>
		<div>
			Setting up and managing liquidity in a Lightning Node can be cumbersome and expensive.
			Transactions can't be sent immediately after the node has synced with the blockchain. You
			first have to conduct a two-step process of <i>funding</i> the node's on-chain wallet and then
			<i>opening a channel</i> with another node, which involves constructing another on-chain transaction
			to lock up the funds between you and your channel partner. This is a two-step process of funding
			the node, waiting for at least one confirmation (~10 minutes), then sending a channel open transaction
			and waiting another ~10 minutes, paying two fees along the way. This is unnecessarily slow and
			expensive. The node operator will likely want to open multiple channels to help ensure against
			routing failures and to increase liquidity, making this a repeat process.
		</div>
		<img
			src="images/lightning-open-without-payjoin.png"
			alt="Normal Lightning Channel Open Process"
		/>
		<div>
			Many other technical difficulties in setting up a node can be abstracted away for end users,
			but liquidity requirements remain a challenge for all self-custodial nodes. In fact, there is
			<Link href="https://river.com/learn/files/river-lightning-report-2023.pdf"
				>estimated to be 1 non-custodial user for every 8 custodial users</Link
			>, simply due to the challenges of self-custodial user interfaces — liquidity issues being one
			of the primary setbacks.
		</div>
		<H2>With Payjoin, We Can Do Better</H2>
		<div>
			Payjoin can simplify this process, saving both money and time by allowing the node operator to
			do both the funding and the opening transaction at once. Instead of having to wait for two
			transactions to confirm to open one channel, they can wait for one transaction to confirm for
			<i>as many channels as they'd like</i>, provided they have sufficient funds. Since payjoin can
			create transactions with multiple UTXOs, it can effectively batch transactions and open
			multiple channels at once.
		</div>
		<img
			src="images/lightning-payjoin.png"
			alt="Lightning Channel Open with Payjoin"
			class="w-2/3 mx-auto max-md:w-full"
		/>
		<div>
			Payjoin also preserves privacy by removing the on-chain footprint (the size of your channels
			and who you open channels with) normally left by lightning channels. A transaction sent over a
			lightning channel opened via a payjoin transaction has far greater privacy than a normal
			on-chain transaction.
		</div>
		<div>
			In summary, payjoin makes channel opens <i>simpler</i> because users now only have to make one
			transaction instead of two, <i>faster</i> because they only have to wait for one transaction
			to be confirmed, and <i>cheaper</i> because they only have to pay one fee.
		</div>
	</div>
</section>
