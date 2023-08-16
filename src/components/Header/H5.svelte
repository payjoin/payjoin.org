<script lang="ts">
	export let colorClass = 'text-white';
</script>

<h5 class={`text-xl ${colorClass} ${$$props.class}`}><slot /></h5>
