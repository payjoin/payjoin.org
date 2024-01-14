<script lang="ts">
	export let href: string;
	export let bad = false;
	export let text: string;
</script>

<a
	{href}
	class={`${
		bad ? 'bg-orange-100 cursor-text' : 'bg-green-100'
	} no-underline rounded-xl px-3 p-2 hover:scale-105 transition-all duration-200 ease-in-out`}
	target="_blank"
	rel="noreferrer noopener"
>
	<span class="text-black">{text}</span>
</a>
