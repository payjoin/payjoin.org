<script>
	import Button from '../components/Button.svelte';
	import Capsule from '../components/Capsule.svelte';
	import Icon from '../components/Icon/Icon.svelte';
	import Link from '../components/Link.svelte';
</script>

<div class="w-4/5 flex flex-col gap-8">
	<section class="h-screen pt-24 pb-8 flex items-center justify-between flex-col">
		<div>
			<!-- TODO: some clever quip with "pay" and "join" concepts -->
			<!-- Pay it forward -->
			<!-- Join the fight -->
			<h1>Better Bitcoin Transactions</h1>
			<h5 class="text-2xl">
				A simple protocol that can scale Bitcoin, save fees, and preserve privacy all at once
			</h5>
		</div>
		<a href="#why" class="flex flex-col gap-4 justify-center animate-smooth-bounce">
			<p class="text-primary">Why Payjoin?</p>
			<Icon class="h-20 flex justify-center " name="arrowJoin" />
		</a>
	</section>
	<!-- TODO: flex col on large screen -->
	<section id="why" class="flex flex-col lg:flex-row gap-8">
		<div class="flex flex-col flex-1">
			<h2>The Problem</h2>
			<p>
				Satoshi said that transactions with multiple inputs "necessarily reveal that their inputs
				were owned by the same owner" in the bitcoin whitepaper. For legacy bitcoin software, this
				tends to be true. As a result, you end up spending more than you have to and Surveillance
				companies use this revelation to creep on bitcoin users.
			</p>
		</div>
		<div class="flex flex-col text-[#F75394] flex-1">
			<h2 class="pink">The Solution</h2>
			<p>
				Payjoin joins sender and receiver inputs in the one transaction. Batching like this reduces
				fees and packs more payment activity, scaling bitcoin. Joining inputs from many owners
				breaks that assumption Satoshi warned us about. You wallet can payjoins when you spend
				without having you make any decisions. And if your wallet doesn't support it, it has a
				seamless fallback inside of <Link
					href="https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki"
					target="_blank">the BIP 21 unified payment standard</Link
				>.
			</p>
		</div>
	</section>
	<!-- <section>
		<h2>How to Payjoin</h2>
		<h3>Scan a Unified QR Code</h3>
		<p>
			This is a <Link href="https://bitcoinqr.dev/" target="_blank">BIP21 unified URI</Link> with a payjoin
			parameter. Even if a wallet does not support payjoin, it can still fall back to the address to
			make a successful transfer. This particular BIP21 will go to to payjoin.org’s cold wallet. By using
			payjoin, you can get a unique address for your support to keep that private. Yes, even though we
			use a cold wallet. Cool ❄️!
		</p>
	</section> -->
	<section class="flex gap-4 flex-col lg:flex-row">
		<div class="flex-1">
			<h2>Try the Demo</h2>
			<p>
				Let's check out a payjoin flow. Bob is on the left trying to purchase some jewelry without
				his peers finding out. The merchant's point of sale is on the right. Click Bob's screen to
				scan the QR code and see just how easy it is to payjoin.
			</p>
		</div>
		<div class="flex-1">
			<iframe
				title="Payjoin Demo"
				class="w-full h-96"
				style="border: 1px solid rgba(0, 0, 0, 0.1);"
				src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101"
				allowfullscreen
			/>
		</div>
	</section>
	<section class="flex flex-col gap-4">
		<h3>How is it private?</h3>

		<p>
			The following <a
				href="https://mempool.space/tx/58d68b22ab96b87a11c1fbd3090fee23f96f71a4115f96210ba776d0ae7d8d55"
				>transaction</a
			>
			conforms to <em>unnecessary input heuristic</em>. It contributes more inputs than are typical
			for the outputs it produces. It could be a payjoin, but we can’t know for sure.
		</p>

		<p>
			It’s normal to make transactions like this to <a
				href="https://bitcoin.design/guide/how-it-works/coin-selection/#minimize-future-fees-merge-coins"
				>minimize future fees by merging coins</a
			>. Merging coins connects their histories and hurts privacy if this is not a payjoin.
		</p>

		<p>
			By using payjoin, two parties come together to merge coins, save fees, and enhance privacy at
			the same time.
		</p>

		<code
			class="my-8 flex p-4 text-[#F75394] gap-4 rounded-xl text-xs justify-between bg-[#401D29] self-center"
		>
			<div class="flex flex-col gap-4">
				<span>input 0: 198,209 sats</span>
				<span>input 1: 1,797,496 sats</span>
			</div>
			<div class="flex flex-col justify-center items-center gap-4">🔀</div>
			<div class="flex flex-col gap-4">
				<span> output 0: 288,535 sats</span>
				<span> output 1: 1,705,291 sats</span>
			</div>
		</code>
		<p>Because of payjoin, any of the following outcomes are plausible:</p>
		<ul class="list-disc font-bold">
			<li>
				Alice had input 0 and input 1.
				<br /><span>She paid Bob output 0 and made output 1 as change</span>
			</li>
			<li>
				Alice had input 0 and input 1. <br />
				<span>She paid Bob output 1 and made output 0 as change</span>
			</li>
			<li>
				Bob had input 0, Alice had input 1. <br /><span
					>Bob was paid 90,326 sats to output 0, Alice took output</span
				>
				1 as change.
			</li>
			<li>
				Bob had input 0, Alice had input 1.<br /><span
					>Bob was paid 1,507,082 sats to output 1, Alice took output 0 as change.</span
				>
			</li>
		</ul>

		<p>
			The possibility of that Alice and Bob may have both contributed via payjoin breaks the
			heuristic analysis used to harm bitcoin privacy. Payjoin not only makes it more difficult for
			someone looking at payjoin user history to figure out exactly how much money changed hands, it
			does so for every other transaction with many inputs and two outputs too. It looks no
			different.
		</p>
	</section>
	<section class="grid grid-cols-2 gap-4">
		<h2 class="col-span-2">Use Payjoin with your Stack</h2>
		<h3>Send Payjoin</h3>
		<h3>Receive Payjoin</h3>
		<p>Sending payjoin is simple compared to lightning. It works anywhere with internet:</p>
		<p>Requesting payjoin requires a hot wallet and a public https:// or .onion server endpoint:</p>
		<ul class="list-decimal pl-4">
			<li>
				<Capsule>HTTP</Capsule> request a <Capsule>payjoin</Capsule> by sending a fallback transaction
				to the unified URI
			</li>
			<li>Sign and broadcast the payjoin transaction response</li>
			<li>Enjoy privacy and know you helped the whole network</li>
		</ul>
		<ul class="list-decimal pl-4">
			<li>
				Share a <Capsule>payjoin</Capsule> URI or QR code
			</li>
			<li>Listen for a payjoin request</li>
			<li>Respond with a payjoin proposal, having added receiver input</li>
			<li>Wait for the sender to broadcast the transaction</li>
		</ul>
		<p>
			Make sure your front end accepts bip21 payjoin uris. There are a huge number of reasons they
			improve your users’ experience anyhow.
		</p>
		<p>
			Payjoin is a great fit for lightning nodes since they already depend on hot wallets on
			always-online servers.
		</p>
		<!-- FIXME: maybe we should have just one link for send & receive? -->
		<!-- TODO: icon svg -->
		<Link target="_blank" href="https://docs.rs/payjoin/latest/payjoin/send/index.html"
			><Button secondary>Read the SDK docs</Button></Link
		>
		<Link target="_blank" href="https://docs.rs/payjoin/latest/payjoin/receive/index.html"
			><Button secondary>Read the SDK docs</Button></Link
		>
	</section>
	<section class="flex flex-col">
		<h2>Future Plans</h2>
		<div class="flex flex-col lg:flex-row">
			<div class="flex flex-col flex-1">
				<h3>Serverless Payjoin</h3>
				<p>
					There is a public proposal to allow anyone to receive a payjoin without running a public
					server. In order to advance Serverless Payjoin into a formal BIP specification we need
					your help with a second, independent implementation. Please share, leave your comments,
					and join the development chat to help.
				</p>
			</div>
			<div class="flex flex-col flex-1">
				<h3>Async Payjoin</h3>

				<p>
					The “hot wallet” limitation may also be removed with an asynchronous payjoin protocol that
					lets the sender and receiver wait to receive signatures.
				</p>
			</div>
		</div>
	</section>
	<section class="flex flex-col lg:justify-around items-center gap-4 lg:flex-row">
		<div>
			<h2>Get Involved</h2>
			<p>We need your help to make payjoin a reality. If you are:</p>
			<ul class="list-disc list-inside">
				<li>
					<strong>Developer</strong>: Check out the <Link
						target="_blank"
						href="https://payjoindevkit.org/">SDK</Link
					>
				</li>
				<li>
					<strong>Designer</strong>: See the <Link
						target="_blank"
						href="https://www.figma.com/file/WTqXA6ykLOYEyo2N3wfCGZ/payjoin-%F0%9F%94%97-Design-(Copy)?type=design&node-id=0%3A1&mode=design&t=lpbNqWuNvwXjUnbK-1"
						>Figma</Link
					>
				</li>
				<li><strong>Anyone Else:</strong> Spread the word!</li>
			</ul>
			<!-- If you are a developer, please check out the SDK
				and leave your feedback. If you are a designer, please help us make the user experience
				amazing. If you are a writer, please help us explain payjoin to the world. If you are a
				merchant, please consider accepting payjoin. If you are a user, please ask your wallet
				provider to support payjoin. -->
		</div>
		<img class="w-2/5" src={`/images/uncle-satoshi.jpg`} alt="Satoshi Needs Your Help!" />
	</section>
	<section class="flex gap-4 justify-between mb-10">
		<div class="flex flex-col">
			<p>Community</p>
			<Link target="_blank" href="">Discord</Link>
			<Link target="_blank" href="https://docs.rs/payjoin/latest/payjoin/send/index.html"
				>GitHub</Link
			>
			<Link target="_blank" href="https://payjoin.substack.com">Newsletter</Link>
		</div>
		<div class="flex flex-col">
			<p>Contribute</p>
			<Link target="_blank" href="https://github.com/orgs/payjoin/projects/1">Roadmap</Link>
			<Link target="_blank" href="https://geyser.fund/project/payjoin/">Donate</Link>
			<!-- <Link target="_blank">Spread the Word!</Link> -->
		</div>
		<div class="flex flex-col">
			<p>Resources</p>
			<Link target="_blank" href="https://payjoindevkit.org/">Payjoin Dev Kit</Link>
			<Link target="_blank" href="https://en.bitcoin.it/wiki/PayJoin_adoption"
				>Payjoin Adoption</Link
			>
			<Link target="_blank" href="https://bitcoin.design/guide/case-studies/payjoin/"
				>Case Study</Link
			>
		</div>
	</section>
</div>

<style lang="postcss">
	h1 {
		@apply text-6xl my-4 text-white;
	}
	h2 {
		@apply text-4xl my-4 text-white;
	}
	h3 {
		@apply text-2xl my-2 text-white;
	}
	.pink {
		@apply text-[#F75394];
	}
	h5 {
		@apply text-2xl;
	}
	ul > li > span {
		@apply font-normal;
	}
	@keyframes smooth-bounce {
		0%,
		100% {
			transform: translateY(-5%);
			animation-timing-function: ease-in-out;
		}
		50% {
			transform: none;
			animation-timing-function: ease-in-out;
		}
	}
	.animate-smooth-bounce {
		animation: smooth-bounce 2s infinite;
	}
</style>
