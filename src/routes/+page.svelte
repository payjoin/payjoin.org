<script>
	import Icon from '../components/Icon/Icon.svelte';
</script>

<section
	class="h-screen pt-20 border border-red-300 text-center flex items-center justify-between flex-col w-4/5"
>
	<div>
		<h1>Better Bitcoin Transactions</h1>
		<h5 class="text-2xl">
			Payjoin is a simple protocol that can scale Bitcoin, save fees, and preserve privacy all at
			once
		</h5>
	</div>
	<a href="#why" class="flex flex-col justify-center">
		<p class="text-primary">Why Payjoin?</p>
		<Icon class="h-20 border border-red-300" name="arrowJoin" />
	</a>
</section>

<section id="why">
	<h2>Why Payjoin?</h2>
</section>

<style lang="postcss">
	h1 {
		@apply text-6xl my-4 text-white;
	}
	h2 {
		@apply text-4xl my-4 text-white;
	}
	h5 {
		@apply text-2xl;
	}
</style>
