<script lang="ts">
	export let colorClass = 'text-white';
</script>

<h2 class={`text-center text-6xl my-4 ${colorClass} ${$$props.class}`}><slot /></h2>
