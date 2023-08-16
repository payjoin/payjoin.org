<script lang="ts">
	export let colorClass = 'text-white';
</script>

<h2 class={`text-2xl my-2 ${colorClass} ${$$props.class}`}><slot /></h2>
