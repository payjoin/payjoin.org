<script lang="ts">
	export let colorClass = 'text-white';
</script>

<h5 class={` text-2xl ${colorClass} ${$$props.class}`}><slot /></h5>
