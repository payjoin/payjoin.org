<script lang="ts">
	import H1 from '@components/Header/H1.svelte';
</script>

<svelte:head>
	<title>Payjoin Privacy</title>
</svelte:head>

<section class="text-white mt-24 w-2/3 flex flex-col gap-4 text-xl">
	<H1>Payjoin Privacy</H1>
	<div>
		<div>
			Satoshi left exactly one privacy problem open in the whitepaper, that transactions with
			multiple inputs "necessarily reveal that their inputs were owned by the same owner." In early
			bitcoin software, this was true. But nothing prevents one from making a transaction with
			inputs from multiple sources. Payjoin is the simplest way to do that.
		</div>
		<br />
		<div>
			In a basic bitcoin transaction, a sender spends some bitcoin to a new transaction output
			paying someone and makes change from their funds at the same time. A third party looking at
			the transaction on chain could assume all input to a transaction must have come from that
			sender.
		</div>
		<br />
		<div>
			In Payjoin, the sender and receiver both contribute funds, breaking Satoshi's assumption. The
			payment amount plus receiver input amount both go to the receiver and the sender gets change.
			Because bitcoin is stored in distinct transaction outputs, and not accounts, such a
			transaction looks the same as one where a sender spent multiple inputs to a receiver and made
			change. By breaking the assumption from the whitepaper, payjoin makes it much harder to be
			sure about who got paid how much.
		</div>
	</div>
</section>
