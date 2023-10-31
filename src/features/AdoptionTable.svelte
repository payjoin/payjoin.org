<script lang="ts">
	import { WALLET_ADOPTION } from '$lib/constants';
</script>

<table>
	<thead>
		<tr>
			<th>Wallet</th>
			<th>Sending</th>
			<th>Receiving</th>
		</tr>
	</thead>
	<tbody>
		{#each WALLET_ADOPTION as { name, sending, receiving }}
			<tr>
				<td>{name}</td>
				<td class={`${sending ? 'yes' : 'no'} text-black`}>{sending ? 'Yes' : 'No'}</td>
				<td class={`${receiving ? 'yes' : 'no'} text-black`}>{receiving ? 'Yes' : 'No'}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	table {
		@apply bg-gray-600 table-fixed border-collapse w-full;
	}
	thead th:nth-child(1) {
		@apply w-1/3;
	}
	thead th:nth-child(2) {
		@apply w-1/3;
	}
	thead th:nth-child(3) {
		@apply w-1/3;
	}
	th,
	td {
		@apply text-left px-4 py-2;
	}
	th,
	td {
		@apply border border-gray-500;
	}
	tbody tr:nth-child(odd) {
		@apply bg-gray-700;
	}
	.no {
		@apply bg-red-300;
	}
	.yes {
		@apply bg-green-400;
	}
</style>
