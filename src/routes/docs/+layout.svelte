<script lang="ts">
	import Button from '@/components/Button.svelte';
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownItem,
		SidebarDropdownWrapper
	} from 'flowbite-svelte';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let open = false;

	function handleOpen() {
		open = !open;
	}
</script>

<div class="mt-12 w-full h-full flex justify-between">
	<!-- <Button on:click={handleOpen}>open</Button> -->
	<!-- {#if open} -->
	<Sidebar class="sticky top-12 h-full bg-secondary w-full">
		<SidebarWrapper class="bg-secondary">
			<SidebarGroup class="bg-secondary">
				<SidebarItem label="Dashboard" />
				<SidebarDropdownWrapper label="E-commerce">
					<SidebarDropdownItem label="Products" />
					<SidebarDropdownItem label="Billing" />
					<SidebarDropdownItem label="Invoice" />
				</SidebarDropdownWrapper>
				<SidebarItem label="Kanban" {spanClass}>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"
						>
							Pro
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Inbox" {spanClass}>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"
						>
							3
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Users" />
				<SidebarItem label="Sign In" />
				<SidebarItem label="Sign Up" />
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
	<!-- {/if} -->

	<div class="mt-24 flex justify-center">
		<slot />
	</div>
</div>
