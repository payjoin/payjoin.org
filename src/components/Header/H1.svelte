<script lang="ts">
	export let colorClass = 'text-white';
</script>

<h1 class={`text-4xl sm:text-6xl my-4 ${colorClass} ${$$props.class}`}><slot /></h1>
