<script>
	import Link from '@/components/Link.svelte';
</script>

<footer
	class="bg-secondary px-4 w-full flex flex-wrap sm:justify-evenly sm:items-start sm:flex-row gap-8 sm:gap-12 sm:py-16 py-4 text-white"
>
	<div class="flex flex-col">
		<strong>Learn</strong>
		<Link href="/learn">Get Started</Link>
		<Link href="https://payjoindevkit.org/">Developer Kit</Link>
		<Link href="https://brandonlucas.net/articles/bitcoin/payjoin">Payjoin Explained</Link>
		<Link href="https://bitcoin.design/guide/case-studies/payjoin/">Case Study</Link>
	</div>
	<div class="flex flex-col">
		<strong>Community</strong>
		<Link href="https://payjoin.substack.com/">Blog</Link>
		<Link href="https://discord.gg/6rJD9R684h">Discord</Link>
		<Link href="https://twitter.com/payjoindevkit">Twitter</Link>
		<Link href="https://github.com/payjoin">Github</Link>
	</div>
	<div class="flex flex-col">
		<strong>Support</strong>
		<Link href="https://geyser.fund/project/payjoin/">Donate</Link>
		<Link href="https://github.com/orgs/payjoin/projects/1">Roadmap</Link>
	</div>
</footer>
