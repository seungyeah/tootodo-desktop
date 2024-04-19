<script lang="ts">
	import { Tabs, Button, Input } from '$ui';
	import { Bell, BellRing } from 'lucide-svelte';
	import ScheduleCard from './ScheduleCard.svelte';

	let records = [
		{ pin: true, alarm: true, item: 'task', title: 'urgent task', days: ['mon', 'wed'] },
		{ pin: false, alarm: true, item: 'habit', title: 'exercise', days: ['tue'] },
		{ pin: true, alarm: false, item: 'task', title: 'important review', days: ['fri', 'sat'] },
		{ pin: false, alarm: false, item: 'habit', title: 'meditation', days: ['sun'] },
		{ pin: true, alarm: true, item: 'task', title: 'project deadline', days: ['thu', 'fri'] },
		{ pin: false, alarm: false, item: 'task', title: 'casual meeting', days: ['mon'] },
		{ pin: true, alarm: true, item: 'task', title: 'team sync', days: ['wed', 'fri'] },
		{ pin: false, alarm: true, item: 'habit', title: 'reading', days: ['wed', 'fri'] },
		{ pin: false, alarm: true, item: 'event', title: 'conference', days: ['tue', 'thu'] },
		{ pin: true, alarm: false, item: 'habit', title: 'journaling', days: ['mon', 'tue'] },
		{ pin: false, alarm: false, item: 'event', title: 'routine checkup', days: ['sat', 'sun'] }
	];
	$: sortedRecords = records.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));
	$: taskRecords = sortedRecords.filter((record) => record.item === 'task');
	$: eventRecords = sortedRecords.filter((record) => record.item === 'event');
	$: habitRecords = sortedRecords.filter((record) => record.item === 'habit');
	$: alarmRecords = sortedRecords.filter((record) => record.alarm);
</script>

<div class="relative h-full w-full space-x-2">
	<Tabs.Root value="task" class="h-full w-full" let:value>
		<Tabs.List class="flex w-full ">
			<Tabs.Trigger value="alarm" class="w-[40px] -translate-x-1.5 scale-75">
				{#if value == 'alarm'}
					<Button
						variant="ghost"
						class="absolute left-0 my-2 bg-amber-700 !p-3 hover:bg-amber-800  "
					>
						<BellRing color="#fffbeb" fill="white" />
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

		<Input type="text" placeholder="search and add " class="my-2 h-9 w-full scale-95 p-2" />

		<Tabs.Content value="alarm">
			<div class="card-list space-y-2">
				{#each alarmRecords as record}
					<ScheduleCard {value} bind:record />
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="event">
			<div class="card-list space-y-2">
				{#each eventRecords as record}
					<ScheduleCard {value} bind:record/>
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="task">
			<div class="card-list space-y-2">
				{#each taskRecords as record}
					<ScheduleCard {value} bind:record/>
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="habit">
			<div class="card-list space-y-2">
				{#each habitRecords as record}
					<ScheduleCard {value} bind:record />
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style>
	.card-list {
		@apply h-[calc(100vh-212px)] overflow-auto border-b-4 border-double border-zinc-900 pb-1.5;
	}

</style>
