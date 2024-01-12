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
</script>

<section class="w-full h-screen flex items-center justify-center">
	<div class="flex flex-col gap-4 items-center text-center w-2/3">
		<Icon name="monad" class="w-24 text-primary" />
		<H1>Payjoin</H1>
		<H2>A simple protocol to scale Bitcoin, save fees, and preserve privacy all at once</H2>
		<div class="flex gap-4 w-1/2 justify-center">
			<a class="w-full" href="/learn"><Button wide>Get Started</Button></a>
			<a class="w-full" href="/devkit"><Button wide secondary>Developer Kit</Button></a>
		</div>
	</div>
</section>

<section class="bg-tertiary w-full flex flex-col gap-20 items-center py-16">
	<H1>Why Payjoin?</H1>
	<div class="flex gap-12 w-3/4">
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Preserves Privacy</strong>
				<span
					>Payjoin preserves privacy by breaking common assumptions made for traditional
					transactions used to spy on bitcoin users
				</span>
				<Link href="/learn/privacy">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Low Fees, High Scaling</strong>
				<span
					>Payjoin can settle many transactions at once, allowing higher throughput, time savings,
					and opportunistically lower fees
				</span>
				<Link href="/learn">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col gap-2 text-white">
				<strong>Augments Lightning</strong>
				<span
					>Payjoin allows Lightning nodes to fund and open all their channels in one transaction
					while maintaining privacy
				</span>
				<Link href="/learn">Learn More<Icon name="arrow" class="w-4" /></Link>
			</div>
		</Card>
	</div>
</section>

<section class="bg-secondary w-full flex flex-col gap-12 items-center py-16 text-white">
	<H1>Supporting Wallets</H1>
	<div class="flex gap-8 w-3/4">
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex gap-2 items-center"
				>Not yet supporting payjoin<Icon name="close" class="text-red-300 w-4" /></H3
			>
			<WalletCard bad wallets={surveillableWallets} />
		</div>
		<div class="flex flex-col gap-2 w-full items-center">
			<H3 class="flex gap-2 items-center"
				>Supports sending or receiving payjoin<Icon name="check" class="text-green-400 w-4" /></H3
			>
			<WalletCard wallets={privateWallets} />
		</div>
	</div>
</section>
