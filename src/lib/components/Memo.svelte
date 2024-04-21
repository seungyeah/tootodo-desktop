<script lang="ts">
	import { Tabs, Button, Input } from '$ui';
	import { Bell, BellRing, Grip } from 'lucide-svelte';


</script>

<div class="relative h-full w-full space-x-2">
	<Tabs.Root value="all" class="h-full w-full" let:value>
		<Tabs.List class="flex w-full ">
			<Tabs.Trigger value="all" class="w-[40px] -translate-x-1.5 scale-75">
				{#if value == 'all'}
					<Button
						variant="ghost"
						class="absolute left-0 my-2 bg-zinc-700 !p-3 hover:bg-zinc-800  "
					>
						<Grip color="#fffbeb" fill="white" />
					</Button>
				{:else}
					<Button
						variant="ghost"
						class="absolute left-0 my-2  bg-zinc-300 !p-3 hover:bg-zinc-600"
					>
						<Grip color="#fffbeb" />
					</Button>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger value="rose" class="w-7 h-7 rounded-full mx-1 shadow bg-rose-200"></Tabs.Trigger>
            <Tabs.Trigger value="orange" class="w-7 h-7 rounded-full mx-1 shadow bg-orange-200"></Tabs.Trigger>
			<Tabs.Trigger value="green" class="w-7 h-7 rounded-full mx-1 shadow bg-green-200"></Tabs.Trigger>
            <Tabs.Trigger value="blue" class="w-7 h-7 rounded-full mx-1 shadow bg-blue-200"></Tabs.Trigger>
            <Tabs.Trigger value="violet" class="w-7 h-7 rounded-full mx-1 shadow bg-violet-200"></Tabs.Trigger>
            <Tabs.Trigger value="fuchsia" class="w-7 h-7 rounded-full mx-1 shadow bg-fuchsia-200"></Tabs.Trigger>
            
		</Tabs.List>

		<Input type="text" placeholder="search and add " class="my-2 h-9 w-full scale-95 p-2" />

		<Tabs.Content value="all">
		</Tabs.Content>
		<Tabs.Content value="red">
		</Tabs.Content>
		<Tabs.Content value="orange">
		</Tabs.Content>
		<Tabs.Content value="lime">
		</Tabs.Content>
	</Tabs.Root>
</div>

<style>
	.card-list {
		@apply h-[calc(100vh-212px)] overflow-auto border-b-4 border-double border-zinc-900 pb-1.5;
	}
</style>
