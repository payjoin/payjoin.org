<script lang="ts">
	import Icon from '@components/Icon/Icon.svelte';
	import H1 from '@components/Header/H1.svelte';
	import Button from '@components/Button.svelte';
	import Card from '@components/Card.svelte';
	import Link from '@components/Link.svelte';
	import { WALLET_ADOPTION } from '@/lib/constants';
	import WalletCard from '@features/WalletCard.svelte';
	import H3 from '@/components/Header/H3.svelte';
	import H2 from '@/components/Header/H2.svelte';

	const privateWallets = WALLET_ADOPTION.filter((wallet) => wallet.sending || wallet.sending);
	const surveillableWallets = WALLET_ADOPTION.filter(
		(wallet) => !wallet.sending && !wallet.sending
	);

	let faqs = [
		{
			question: 'Does Payjoin require changes to Bitcoin?',
			answer:
				'No. Payjoin was designed with ease of adoption in mind, and requiring consensus changes would be slow and difficult. Payjoin works as a protocol on top of Bitcoin.',
			open: false
		},
		{
			question: 'Why doesn’t my wallet support Payjoin yet?',
			answer:
				'One of the great things about payjoin is that it doesn’t require any consensus changes to Bitcoin. The flip side is that it’s up to individual wallets to implement it, and historically there haven’t been many tools to assist developers. Payjoin Dev Kit (PDK) aims to solve this problem as the de-facto library for payjoin, and it includes payjoin-cli as a reference implementation.\n\n\
Another barrier has been that the first version of payjoin required an HTTPS server for a receiver to be running at the time a sender wanted to make a payment. This practically limited payjoin’s utility to always-online wallets such as merchants. But with the recent development of <a href="https://github.com/bitcoin/bips/pull/1483" target="_blank" class="underline">Payjoin V2</a>, receivers can create payjoin transactions asynchronously while offline. This opens up adoption to all types of wallets.\n\n\
If there is a wallet you’d like to see adopt payjoin or you are a wallet developer and who’d like to integrate it, check out our tutorials or reach out to us for help!',
			open: false
		},
		{
			question: 'Can I add Payjoin to my wallet right now using Payjoin Dev Kit?',
			answer:
				'<a href="https://payjoindevkit.org" target="_blank" class="underline">PDK</a> is a Rust library to help your wallet use Payjoin. If your wallet uses another language, we are creating bindings to other languages so it can be used across all sorts of different applications, including mobile apps. The Python bindings are nearly complete.',
			open: false
		}
	];
</script>

<section
	class="w-full h-full max-sm:mb-4 sm:h-screen flex items-center justify-center max-sm:pt-24"
>
	<div class="flex flex-col gap-4 items-center text-center w-2/3">
		<Icon name="monad" class="h-24 w-24 text-primary" />
		<H1>Payjoin</H1>
		<h2 class="text-2xl text-white sm:text-4xl">
			Scale Bitcoin, save fees, and preserve privacy all at once
		</h2>
		<br />
		<div class="flex flex-col w-full sm:flex-row gap-4 sm:w-1/2 justify-center">
			<a class="w-full" href="#why-payjoin"><Button wide>Learn More</Button></a>
			<a class="w-full" href="https://payjoindevkit.org/"
				><Button wide secondary>Developer Kit</Button></a
			>
		</div>
	</div>
</section>

<section
	id="why-payjoin"
	class="bg-tertiary w-full flex flex-col gap-4 sm:gap-14 items-center py-16"
>
	<H2>Why Payjoin?</H2>
	<div class="flex flex-col lg:flex-row sm:gap-12 gap-4 w-3/4">
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<h3 class="font-bold">Preserve Privacy</h3>
				<p>
					Payjoin preserves privacy by breaking the most common method used to spy on bitcoin users
				</p>
				<Link href="/privacy">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<h3 class="font-bold">Scale Bitcoin, Lower Fees</h3>
				<p>
					Payjoin can settle many transactions at once, allowing higher throughput, time savings,
					and lower fees
				</p>
				<Link href="/scale">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<h3 class="font-bold">Augment Lightning</h3>
				<p>
					Payjoin enables Lightning nodes to fund and open all their channels in one transaction
					while maintaining privacy
				</p>
				<Link href="/lightning">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
	</div>
</section>

<section class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white">
	<H2>Try it Yourself</H2>
	<H3>Click through the app below to see all it takes to payjoin</H3>
	<iframe
		title="Payjoin Demo"
		class="w-full h-[66vh]"
		style="border: 1px solid rgba(0, 0, 0, 0.1);"
		src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101"
		allowfullscreen
	/>
</section>

<section
	class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white text-center"
>
	<H2>Wallets Using Payjoin</H2>
	<div
		class="flex flex-col xl:flex-row max-xl:py-4 gap-8 w-full bg-tertiary justify-center items-center"
	>
		<a href="https://bitmask.app"
			><img src="/images/bitmask.svg" alt="bitmasklogo" class="max-w-[200px] w-full h-full" /></a
		>
		<a href="https://bluewallet.io"><img src="/images/bluewallet.svg" alt="bluewallet logo" /></a>
		<a href="https://btcpayserver.org"><img src="/images/btcpay.svg" alt="btcpayserver logo" /></a>
		<a href="https://joinmarket.net"
			><img src="/images/joinmarket.png" alt="joinmarket logo" class="max-w-[200px]" /></a
		>
		<a href="https://sparrowwallet.com"
			><img src="/images/sparrow.png" alt="sparrow logo" class="max-w-[75px]" /></a
		>
		<a href="https://wasabiwallet.app"><img src="/images/wasabi.svg" alt="wasabi logo" /></a>
	</div>
	<div class="flex xl:flex-row flex-col gap-8 w-3/4">
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex gap-4 items-center sm:flex-row flex-col"
				><Icon name="check" class="text-green-400 w-8 sm:w-4" />Supports Payjoin</H3
			>
			<WalletCard wallets={privateWallets} />
		</div>
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex flex-col sm:flex-row gap-4 items-center"
				><Icon name="megaphone" class="text-orange-300 w-8 sm:w-4" />Needs a nudge</H3
			>
			<WalletCard bad wallets={surveillableWallets} />
		</div>
	</div>

	<span class="flex flex-col items-center text-lg"
		>If you are a developer seeking to enhance your wallet with payjoin, check out<Link
			href="https://payjoindevkit.org/"><strong>Payjoin Dev Kit</strong></Link
		></span
	>
</section>

<section class="bg-tertiary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white">
	<H2>FAQ</H2>
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
					<div class={open ? 'mt-4' : 'hidden'}>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<span>{@html answer}</span>
					</div>
				</span>
			</Card>
		{/each}
	</div>
</section>

<section
	class="bg-secondary w-full flex flex-col gap-4 sm:gap-12 items-center py-16 text-white max-sm:text-center"
>
	<div class="flex flex-col items-center">
		<H2>Pay it Forward</H2>
		<H2>Join the Community</H2>
	</div>
	<p class="text-2xl my-2">Payjoin can bring many benefits to Bitcoin, but it needs your help</p>
	<p class="text-2xl my-2">
		Join our <Link href="https://payjoin.substack.com/">newsletter</Link> and the <Link
			href="https://discord.gg/6rJD9R684h">Discord</Link
		> to stay up to date with payjoin development
	</p>
</section>
