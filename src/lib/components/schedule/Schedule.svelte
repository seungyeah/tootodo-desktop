<script lang="ts">
	import { Tabs, Button, Input } from '$ui';
	import { Bell, BellRing } from 'lucide-svelte';
	import ScheduleCard from './ScheduleCard.svelte';
</script>

<div class="relative h-full w-full space-x-2">

	<Tabs.Root value="task" class="h-full w-full" let:value>
		<Tabs.List class="flex w-full ">
			<Tabs.Trigger value="alarm" class="w-[40px] -translate-x-1.5 scale-75">
				{#if value == 'alarm'}
					<Button
						variant="ghost"
						class="absolute left-0 my-2 !p-3 bg-amber-700 hover:bg-amber-800  "
					>
						<BellRing color="#fffbeb" fill="white"/>
					</Button>
				{:else}
					<Button
						variant="ghost"
						class="absolute left-0 my-2  bg-amber-500 !p-3 hover:bg-amber-600"
					>
						<Bell color="#fffbeb" />
					</Button>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger value="event" class="w-1/4">Event</Tabs.Trigger>
			<Tabs.Trigger value="task" class="w-1/4">Task</Tabs.Trigger>
			<Tabs.Trigger value="habit" class="w-1/4">Habit</Tabs.Trigger>
		</Tabs.List>
        <Input type="text" placeholder="search and add " class="h-9 w-full p-2 my-2 scale-95" />

		<Tabs.Content value="alarm">
			<ScheduleCard {value} />
		</Tabs.Content>
		<Tabs.Content value="event">
			<ScheduleCard {value} />
		</Tabs.Content>
		<Tabs.Content value="task">
			<div class="max-h-[calc(100vh-212px)] flex-col space-y-2.5 pb-1 overflow-auto border-b-4 border-double border-zinc-900">
				{#each Array.from({ length: 30 }, (_, i) => i) as _}
					<ScheduleCard {value} />
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="habit">
			<ScheduleCard {value} />
		</Tabs.Content>
	</Tabs.Root>


</div>

<style>
</style>
