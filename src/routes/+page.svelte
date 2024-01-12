<script lang="ts">
	import Icon from '@components/Icon/Icon.svelte';
	import H1 from '@components/Header/H1.svelte';
	import H2 from '@components/Header/H2.svelte';
	import Button from '@components/Button.svelte';
	import Card from '@components/Card.svelte';
	import Link from '@components/Link.svelte';
	import { WALLET_ADOPTION } from '@/lib/constants';
	import WalletCard from '@features/WalletCard.svelte';
	import H3 from '@/components/Header/H3.svelte';

	const privateWallets = WALLET_ADOPTION.filter((wallet) => wallet.sending || wallet.sending);
	const surveillableWallets = WALLET_ADOPTION.filter(
		(wallet) => !wallet.sending && !wallet.sending
	);

	let faqs = [
		{
			question: 'Does this require changes to Bitcoin?',
			answer:
				'No. Payjoin was designed with ease of adoption in mind, and requiring consensus changes would be slow and difficult. Payjoin works as a protocol on top of Bitcoin.',
			open: false
		},
		{
			question: 'Why isn’t there much adoption yet?',
			answer:
				'One of the great things about payjoin is that it doesn’t require any consensus changes to Bitcoin. The flip side is that it’s up to individual wallets to implement it, and historically there haven’t been many tools to assist developers. Payjoin Dev Kit (PDK) aims to solve this problem as the de-facto library for payjoin, and it includes payjoin-cli as a reference implementation.\n\n\
Another barrier has been that the first version of payjoin required an HTTPS server for a receiver to be running at the time a sender wanted to make a payment. This practically limited payjoin’s utility to always-online wallets such as merchants. But with the recent release of payjoin V2, receivers can create payjoin transactions asynchronously while offline. This opens up adoption to all types of wallets.\n\n\
If there is a wallet you’d like to see adopt payjoin or you are a wallet developer and who’d like to integrate it, checkout our tutorials or reach out to us for help!',
			open: false
		},
		{
			question: 'Can I add Payjoin to my wallet right now using Payjoin Dev Kit?',
			answer:
				'PDK currently only supports wallets that use Rust. However, we are creating bindings to other languages to allow it to be used across all sorts of different applications, including mobile apps.',
			open: false
		}
	];
</script>

<section
	class="w-full h-full max-sm:mb-4 sm:h-screen flex items-center justify-center max-sm:pt-24"
>
	<div class="flex flex-col gap-4 items-center text-center w-2/3">
		<Icon name="monad" class="w-24 text-primary" />
		<H1>Payjoin</H1>
		<h2 class="text-2xl text-white sm:text-4xl">
			A simple protocol to scale Bitcoin, save fees, and preserve privacy all at once
		</h2>
		<div class="flex flex-col w-full sm:flex-row gap-4 sm:w-1/2 justify-center">
			<a class="w-full" href="https://payjoindevkit.org/introduction/"
				><Button wide>Get Started</Button></a
			>
			<a class="w-full" href="https://payjoindevkit.org/"
				><Button wide secondary>Developer Kit</Button></a
			>
		</div>
	</div>
</section>

<section class="bg-tertiary w-full flex flex-col gap-4 sm:gap-14 items-center py-16">
	<H1>Why Payjoin?</H1>
	<div class="flex flex-col sm:flex-row sm:gap-12 gap-4 w-3/4">
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Preserves Privacy</strong>
				<span
					>Payjoin preserves privacy by breaking common assumptions made for traditional
					transactions used to spy on bitcoin users
				</span>
				<!-- <Link href="/learn/privacy">Learn More<Icon name="arrow" class="w-4" /></Link> -->
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Low Fees, High Scaling</strong>
				<span
					>Payjoin can settle many transactions at once, allowing higher throughput, time savings,
					and opportunistically lower fees
				</span>
				<!-- <Link href="/learn">Learn More<Icon name="arrow" class="w-4" /></Link> -->
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Augments Lightning</strong>
				<span
					>Payjoin allows Lightning nodes to fund and open all their channels in one transaction
					while maintaining privacy
				</span>
				<!-- <Link href="/learn">Learn More<Icon name="arrow" class="w-4" /></Link> -->
			</div>
		</Card>
	</div>
</section>

<section class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white">
	<H1>User Experience</H1>
	<H3>Click through the Figma below to see how simple it can be to payjoin!</H3>
	<div class="w-4/5 sm:w-1/2">
		<iframe
			title="Payjoin Demo"
			class="w-full h-96"
			style="border: 1px solid rgba(0, 0, 0, 0.1);"
			src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101"
			allowfullscreen
		/>
	</div>
</section>

<section
	class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white text-center"
>
	<H1>Wallets Using Payjoin</H1>
	<div
		class="flex flex-col sm:flex-row max-sm:py-4 gap-8 w-full bg-tertiary justify-center items-center"
	>
		<img src="/images/bitmask.svg" alt="bitmasklogo" class="max-w-[200px]" />
		<img src="/images/bluewallet.svg" alt="bluewallet logo" />
		<img src="/images/btcpay.svg" alt="btcpayserver logo" />
		<img src="/images/joinmarket.png" alt="joinmarket logo" class="max-w-[200px]" />
		<img src="/images/sparrow.png" alt="sparrow logo" class="max-w-[75px]" />
		<img src="/images/wasabi.svg" alt="wasabi logo" />
	</div>
	<div class="flex sm:flex-row flex-col-reverse gap-8 w-3/4">
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex flex-col sm:flex-row gap-2 items-center"
				>Not yet supporting payjoin<Icon name="close" class="text-red-300 w-8 sm:w-4" /></H3
			>
			<WalletCard bad wallets={surveillableWallets} />
		</div>
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex gap-2 items-center sm:flex-row flex-col"
				>Supports sending or receiving payjoin<Icon
					name="check"
					class="text-green-400 w-8 sm:w-4"
				/></H3
			>
			<WalletCard wallets={privateWallets} />
		</div>
	</div>

	<span class="flex flex-col items-center text-lg"
		>If you are a developer seeking to enhance your wallet with payjoin, check out<Link
			href="https://payjoindevkit.org/"><strong>Payjoin Dev Kit</strong></Link
		></span
	>
</section>

<section class="bg-tertiary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white">
	<H1>FAQ</H1>
	<div class="flex flex-col gap-8 w-3/4">
		{#each faqs as { question, answer, open }, i}
			<Card>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<span class="cursor-pointer" on:click={() => (faqs[i].open = !open)}>
					<div
						class="flex justify-between items-center flex-col sm:flex-row max-sm:text-center max-sm:gap-4"
					>
						<H3>{question}</H3>
						<Icon name={open ? 'minus' : 'plus'} class="text-white  w-6 sm:w-4" />
					</div>
					<span class={open ? '' : 'hidden'}>{answer}</span>
				</span>
			</Card>
		{/each}
	</div>
</section>

<section
	class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white max-sm:text-center"
>
	<div class="flex flex-col items-center">
		<H1>Pay it Forward</H1>
		<H1>Join the Community</H1>
		<H3>Payjoin can bring many benefits to Bitcoin, but it needs your help</H3>
	</div>
	<H3
		>Join our <Link href="https://payjoin.substack.com/">newsletter</Link> or the <Link
			href="https://discord.gg/6rJD9R684h">Discord</Link
		> to stay up to date with payjoin development</H3
	>
</section>
