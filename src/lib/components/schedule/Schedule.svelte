<script lang="ts">
	import { Tabs, Button, Input } from '$ui';
	import { Bell, BellRing } from 'lucide-svelte';
	import ScheduleCard from './ScheduleCard.svelte';
	import { onMount } from 'svelte';

	let records = [
		{
			pin: true,
			alarm: true,
			item: 'task',
			title: 'urgent task',
			days: ['mon', 'wed'],
			openChat: false,
			project: { title: 'Project K', color: '#f472b6' }
		},
		{ pin: false, alarm: true, item: 'habit', title: 'exercise', days: ['tue'], openChat: false },
		{
			pin: true,
			alarm: false,
			item: 'task',
			title: 'important review',
			days: ['fri', 'sat'],
			openChat: false,
			project: { title: 'Project V', color: '#818cf8' }
		},
		{
			pin: false,
			alarm: false,
			item: 'habit',
			title: 'meditation',
			days: ['sun'],
			openChat: false
		},
		{
			pin: true,
			alarm: true,
			item: 'task',
			title: 'project deadline',
			days: ['thu', 'fri'],
			openChat: false,
			project: { title: 'Project A', color: '#38bdf8' }
		},
		{
			pin: false,
			alarm: false,
			item: 'task',
			title: 'casual meeting',
			days: ['mon'],
			openChat: false,
			project: { title: 'Project B', color: '#a3e635' }
		},
		{
			pin: true,
			alarm: true,
			item: 'task',
			title: 'team sync',
			days: ['wed', 'fri'],
			openChat: false,
			project: { title: 'Project C', color: '#2dd4bf' }
		},
		{
			pin: false,
			alarm: true,
			item: 'habit',
			title: 'reading',
			days: ['wed', 'fri'],
			openChat: false
		},
		{
			pin: false,
			alarm: true,
			item: 'event',
			title: 'conference',
			days: ['tue', 'thu'],
			openChat: false
		},
		{
			pin: true,
			alarm: false,
			item: 'habit',
			title: 'journaling',
			days: ['mon', 'tue'],
			openChat: false
		},
		{
			pin: false,
			alarm: false,
			item: 'event',
			title: 'routine checkup',
			days: ['sat', 'sun'],
			openChat: false
		}
	];

	$: records = records.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1));
	$: alarmRecords = records.filter((record) => record.alarm);

	onMount(() => {
		console.log('taskRecords', taskRecords);
		console.log('eventRecords', eventRecords);
		console.log('habitRecords', habitRecords);
		console.log('alarmRecords', alarmRecords);
	});

	// 딱 하나의 record에 대한 채팅만을 open하기 위함.
	function handleToggleOpenChat(event) {
		let openChatRecord = event.detail;
		if (openChatRecord) {
			madeOtherRecordFalse(taskRecords, openChatRecord);
			madeOtherRecordFalse(eventRecords, openChatRecord);
		}
	}

	function madeOtherRecordFalse(records, record) {
		return records.map((r) => {
			if (r !== record) {
				r.openChat = false;
			}
			return r;
		});
	}
</script>

<div class="relative h-full w-full space-x-2">
	<Tabs.Root
		value="event"
		class="h-full w-full"
		let:value
		onValueChange={() => madeOtherRecordFalse(records, {})}
	>
		<Tabs.List class="flex w-full ">
			<Tabs.Trigger value="alarm" class="w-[40px] -translate-x-1.5 scale-75">
				{#if value == 'alarm'}
					<Button
						variant="ghost"
						class="absolute left-0 my-2 rounded-full bg-zinc-700 !p-3 hover:bg-zinc-900  "
					>
						<BellRing color="#fde68a" fill="#fde68a" />
					</Button>
				{:else}
					<Button
						variant="ghost"
						class="absolute left-0 my-2  rounded-full bg-zinc-300 !p-3    hover:bg-zinc-400"
					>
						<Bell color="#09090b" />
					</Button>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger value="event" class="w-1/4">Event</Tabs.Trigger>
			<Tabs.Trigger value="task" class="w-1/4">Task</Tabs.Trigger>
			<Tabs.Trigger value="habit" class="w-1/4">Habit</Tabs.Trigger>
		</Tabs.List>

		<Input type="text" placeholder="search and add " class="my-2 h-9 w-full scale-95 p-2" />

		<Tabs.Content
			value="alarm"
			class="h-[calc(100%-94px)]  max-h-[calc(100%)] space-y-2 overflow-y-auto pb-2"
		>
			{#each alarmRecords as record}
				<ScheduleCard {value} bind:record on:toggleOpenChat={handleToggleOpenChat} />
			{/each}
		</Tabs.Content>

		{#each ['event','task','habit'] as tab}
			<Tabs.Content
				value={tab}
				class="h-[calc(100%-94px)]  max-h-[calc(100%-94px)] space-y-2 overflow-y-auto pb-2"
			>
				{#each records as record}
					{#if record.item === tab}
						<ScheduleCard bind:record on:toggleOpenChat={handleToggleOpenChat} />
					{/if}
				{/each}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>

<style>
</style>
