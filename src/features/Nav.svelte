<script>
	import Link from '../components/Link.svelte';
	import { toggleDarkMode } from '$lib/theme';
	import Icon from '../components/Icon/Icon.svelte';
</script>

<ul class="flex justify-end m-6 gap-4 items-center">
	<li><Link href="#">How to</Link></li>
	<li><Link href="#">Demo</Link></li>
	<li><Link href="#">Privacy</Link></li>
	<li><Link href="#">Dev kit</Link></li>
	<li><Link href="#">Join</Link></li>
	<li><button on:click={toggleDarkMode}><Icon name="moon" /></button></li>
</ul>
