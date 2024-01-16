<script lang="ts">
	import H1 from '@components/Header/H1.svelte';
	import H2 from '@components/Header/H2.svelte';
</script>

<svelte:head>
	<title>Scaling</title>
</svelte:head>

<section class="text-white mt-24 w-2/3 flex flex-col gap-4 text-xl">
	<H1>How Does Payjoin Scale Bitcoin?</H1>
	<div class="flex flex-col gap-4">
		<div>
			The Bitcoin blockchain is limited by block size. Approximately every ten minutes a new block
			is added to the chain. New blocks add 2MB of data on average [[1]](). Blocks are limited by
			transaction weight, or how much of each type of data is included in a transaction.
		</div>
		<div>
			The simplest way to scale any database is batching, which is exactly what Payjoin does.
		</div>
		<div>
			Payjoin enables multiple distinct parties to combine what would otherwise be distinct
			transaction intents into a joint transaction which lets them share transaction data they would
			otherwise both need to pay to add to the chain.
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<H2>Your Typical Payjoin</H2>
		<div>
			In a basic bitcoin transaction, a sender spends some bitcoin to a new transaction output
			paying someone and makes change from their funds at the same time. A third party looking at
			the transaction on chain could assume all input to a transaction must have come from that
			sender.
		</div>
		<div>
			In Payjoin, the sender and receiver both contribute funds, breaking Satoshi's assumption. The
			payment amount plus receiver input amount both go to the receiver and the sender gets change.
			Because bitcoin is stored in distinct transaction outputs, and not accounts, such a
			transaction looks the same as one where a sender spent multiple inputs to a receiver and made
			change. By breaking the assumption from the whitepaper, payjoin makes it much harder to be
			sure about who got paid how much.
		</div>
		<div>
			The Payjoin using exclusively Pay-to-Taproot addresses (P2TR)
			[here](https://mutinynet.com/tx/3c5436f1edf7d4c32a5ccf2448c1e963f52bb8a0fb6f8688d7e78a14e1cbe80b)
			is 211.75 vB. An analogous P2TR payment
			[here](https://mutinynet.com/tx/2c45dc6fef9feb32b9741cc3e6197eda94e1b0c45675e18818bfadce9fa94e20)
			is 152.25 vB and P2TR consolidation
			[here](https://mutinynet.com/tx/ef9263ed05c07f7ba933389eee7bfd62372e3dc4d1e697f96b7c66a215cc9b46)
			is 168.5 vB, for a total of 320.75 vB. The separate payment and consolidation have to pay for
			51% more block weight to be mined than the Payjoin. What other scaling solution achieves that
			kind of savings?
		</div>

		<div class="flex flex-col gap-4">
			<H2>Opportunistic Consolidation</H2>

			<div>
				Payjoin got its start as a way to make a sort of [coinjoin] from a payment. A receiver
				combines their input with the sender's, effectively joining a [consolidation]() transaction
				with a simple transfer. An observer looking at the payjoin is cannot tell it apart from a
				simple transfer where all of the inputs come from the same entity.
			</div>

			<div>
				<!-- < need visuals > -->
				TODO: visuals
			</div>

			<div>not only does the total weight get shaved. wouldn't it be cool when wallet</div>
		</div>
		<div class="flex flex-col gap-4">
			<H2>Transaction Cut-Through</H2>
			<div>
				Payjoin not only creates opportunity to batch consolidation, but may create any output with
				the incoming funds. Because payjoin involves live interaction, the receiver may open
				lightning channels, forward funds to a different wallet, pay for goods and services, or
				batch forward transactions with incoming funds without first taking them into a new UTXO.
			</div>

			<!-- https://chaincase.app/words/lightning-payjoin https://payjoin.substack.com/p/interactive-payment-batching-is-better -->
			<!-- [1](https://bitcoin.stackexchange.com/a/116350)  {#1} -->
		</div>
	</div>
</section>
