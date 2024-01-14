<script>
	import Link from '@/components/Link.svelte';
</script>

<footer
	class="bg-secondary px-4 w-full flex flex-wrap sm:justify-evenly sm:items-start sm:flex-row gap-8 sm:gap-12 sm:py-16 py-4 text-white"
>
	<div class="flex flex-col">
		<strong>Learn</strong>
		<Link href="https://payjoindevkit.org/introduction/">Get Started</Link>
		<Link href="https://payjoindevkit.org/">Payjoin Dev Kit</Link>
		<Link href="https://bitcoin.design/guide/case-studies/payjoin/">Case Study</Link>
	</div>
	<div class="flex flex-col">
		<strong>Community</strong>
		<Link href="https://payjoin.substack.com/">News</Link>
		<Link href="https://discord.gg/6rJD9R684h">Discord</Link>
		<Link href="https://twitter.com/payjoindevkit">Twitter</Link>
		<Link href="https://github.com/payjoin">GitHub</Link>
	</div>
	<div class="flex flex-col">
		<strong>Support</strong>
		<Link href="https://geyser.fund/project/payjoin/">Donate</Link>
		<Link href="https://github.com/orgs/payjoin/projects/1">Roadmap</Link>
	</div>
</footer>
