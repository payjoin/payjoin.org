<script>
	import Button from '../components/Button.svelte';
	import Capsule from '../components/Capsule.svelte';
	import H1 from '../components/Header/H1.svelte';
	import H2 from '../components/Header/H2.svelte';
	import H3 from '../components/Header/H3.svelte';
	import H5 from '../components/Header/H5.svelte';
	import Icon from '../components/Icon/Icon.svelte';
	import Link from '../components/Link.svelte';
</script>

<div class="w-4/5 flex flex-col">
	<section class="h-screen pt-24 pb-8 flex items-center justify-between flex-col">
		<div class="w-4/5">
			<H1>Better Bitcoin Transactions</H1>
			<H3 colorClass=""
				>A simple protocol that can scale Bitcoin, save fees, and preserve privacy, without changing
				how you use it.</H3
			>
			<H5 colorClass="">
				Help improve Bitcoin by <Link
					href="https://en.bitcoin.it/wiki/PayJoin_adoption"
					target="_blank"
					icon="externalLink">asking your wallet to implement payjoin!</Link
				></H5
			>
		</div>

		<a href="#why" class="flex flex-col gap-4 justify-center animate-smooth-bounce">
			<p class="text-primary">Why Payjoin?</p>
			<Icon class="h-20 flex justify-center " name="arrowJoin" />
		</a>
	</section>
	<section id="why" class="flex flex-col gap-8 pt-24">
		<div class="flex flex-col gap-4">
			<div class="flex gap-2 items-center">
				<Icon class="flex h-10 text-white" name="spiral" />
				<H2>The Problem</H2>
			</div>
			<p>
				Satoshi said that transactions with multiple inputs "necessarily reveal that their inputs
				were owned by the same owner" in the bitcoin whitepaper. For legacy bitcoin software, this
				tends to be true. As a result, you end up spending more than you have to and surveillance
				companies use this revelation to creep on bitcoin users.
			</p>
			<div class="flex flex-col md:grid grid-cols-3 gap-4">
				<div>
					<H3>Privacy</H3>

					<p>
						Transaction histories are normally easy to trace, allowing chain surveillance companies
						to spy on bitcoin users.
					</p>
				</div>
				<div>
					<H3>Scaling</H3>
					<p>
						Bitcoin’s blockchain processes about 7 transactions per second, as block space is
						scarce.
					</p>
				</div>
				<div>
					<H3>Fees</H3>
					<p>
						Normally, one fee is paid for a single transaction, which frequently fluctuates based on
						demand and is often untenable for small purchases.
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col text-primary gap-4">
			<div class="flex gap-2 items-center">
				<Icon class="flex h-10 " name="monad" />
				<H2 colorClass="text-primary">The Solution</H2>
			</div>
			<p>
				Payjoin joins sender and receiver inputs in the one transaction. Batching like this reduces
				fees and packs more payment activity, scaling bitcoin. Joining inputs from many owners
				breaks that assumption Satoshi warned us about. Your wallet can payjoin when you spend
				without having you make any decisions. And if your wallet doesn't support it, it has a
				seamless fallback inside of <Link
					href="https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki"
					target="_blank">the BIP 21 unified payment standard</Link
				>.
			</p>
			<div class="flex flex-col md:grid grid-cols-3 gap-8">
				<div>
					<H3 colorClass="text-primary">Privacy Enhanced</H3>
					<p>
						By cleverly taking advantage of transaction structure, payjoin allows for enhanced
						privacy for everyone ― even for those who don’t use it ― foiling chain surveillance.
					</p>
				</div>
				<div>
					<H3 colorClass="text-primary">Scaling Upgraded</H3>
					<p>
						Payjoin settles many transfers together in one transaction, saving time spent waiting for block
						confirmations and enabling higher throughput.
					</p>
				</div>
				<div>
					<H3 colorClass="text-primary">Fees Saved</H3>
					<p>
						As a byproduct of the scaling improvements, the many transfers inside each payjoin share the fees of a single transaction.
					</p>
				</div>
			</div>
		</div>
		<div>
			<H2 class="inline-flex items-end gap-2"
				>Lightning Compatible <Icon name="lightning" class="flex w-8 text-primary" /></H2
			>
			<H3><i>Open all your channels at once</i></H3>
			<p>Combining payjoin with the Lightning Network opens up new possibilities for bitcoin.</p>
			<p>With payjoin, lightning nodes could:</p>
			<ul class="list-disc list-inside">
				<li>Fund and open any number of channels in one transaction</li>
				<li>Auto-open new channels when transactions are sent to them</li>
			</ul>
			Saving time, fees, and preserving privacy. See the <Link
				target="_blank"
				href="https://github.com/payjoin/nolooking">Nolooking</Link
			> project for an example.
		</div>
	</section>
	<!-- <section>
		<H2>How to Payjoin</H2>
		<H3>Scan a Unified QR Code</H3>
		<p>
			This is a <Link href="https://bitcoinqr.dev/" target="_blank">BIP21 unified URI</Link> with a payjoin
			parameter. Even if a wallet does not support payjoin, it can still fall back to the address to
			make a successful transfer. This particular BIP21 will go to to payjoin.org’s cold wallet. By using
			payjoin, you can get a unique address for your support to keep that private. Yes, even though we
			use a cold wallet. Cool ❄️!
		</p>
	</section> -->
	<section id="ux" class="flex gap-4 flex-col pt-24">
		<div>
			<div class="flex-1">
				<H2>Payjoin User Experience</H2>
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
		</div>
		<p>
			As you can see, Bob's wallet automatically payjoined. Neither he nor the merchant had to do
			anything, and their privacy was preserved. It's that easy.
		</p>
		<p>
			Therefore, the biggest barrier to payjoin adoption is not UX, but <Link
				href="https://en.bitcoin.it/wiki/PayJoin_adoption"
				target="_blank">wallet integration</Link
			>
		</p>
	</section>
	<section id="privacy" class="flex flex-col gap-4 pt-24">
		<H2>How is it private?</H2>
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
		<!-- TODO: add #F75394 to tailwind colors -->
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
	<section id="how-to" class="grid grid-cols-2 gap-4 pt-24">
		<H2 class="col-span-2">Use Payjoin with your Stack</H2>
		<H3>Send Payjoin</H3>
		<H3>Receive Payjoin</H3>
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
	<section id="future-plans" class="flex flex-col pt-24">
		<H2>Future Plans</H2>
		<div class="flex flex-col lg:flex-row">
			<div class="flex flex-col flex-1">
				<H3>Serverless Payjoin</H3>
				<p>
					There is a public proposal to allow anyone to receive a payjoin without running a public
					server. In order to advance Serverless Payjoin into a formal BIP specification we need
					your help with a second, independent implementation. Please share, leave your comments,
					and join the development chat to help.
				</p>
			</div>
			<div class="flex flex-col flex-1">
				<H3>Async Payjoin</H3>

				<p>
					The “hot wallet” limitation may also be removed with an asynchronous payjoin protocol that
					lets the sender and receiver wait to receive signatures.
				</p>
			</div>
		</div>
	</section>
	<section
		id="get-involved"
		class="flex flex-col lg:justify-around items-center gap-4 lg:flex-row pt-24"
	>
		<div class="self-start flex-1">
			<H2>We need your help!</H2>
			<H3>Pay it forward. Join the movement.</H3>
			<p>
				Payjoin has many benefits for Bitcoin and doesn't require much, we need your help to get
				wallets to support it!
			</p>
			<ul class="list-disc list-inside">
				<li>
					<strong>Developer</strong>: Check out <Link
						target="_blank"
						href="https://payjoindevkit.org/">Payjoin Dev Kit (PDK)</Link
					>
				</li>
				<li>
					<strong>Designer</strong>: See the <Link
						target="_blank"
						href="https://www.figma.com/file/WTqXA6ykLOYEyo2N3wfCGZ/payjoin-%F0%9F%94%97-Design-(Copy)?type=design&node-id=0%3A1&mode=design&t=lpbNqWuNvwXjUnbK-1"
						>Figma</Link
					>
				</li>
				<li>
					<strong>Anyone Else:</strong> Ask your <Link
						href="https://en.bitcoin.it/wiki/PayJoin_adoption"
						target="_blank">wallet provider to integrate it</Link
					>!
				</li>
			</ul>
		</div>
		<img class="w-2/5" src={`/images/uncle-satoshi-payjoin.png`} alt="Satoshi Needs Your Help!" />
	</section>
	<section class="flex gap-4 justify-between mb-10 pt-24">
		<div class="flex flex-col">
			<p>Community</p>
			<Link target="_blank" href="https://discord.gg/HrTwfxQG">Discord</Link>
			<Link target="_blank" href="https://github.com/payjoin">GitHub</Link>
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
