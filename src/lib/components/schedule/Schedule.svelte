<!-- @migration-task Error while migrating Svelte code: Cannot reassign or bind to each block argument in runes mode. Use the array and index variables instead (e.g. `array[i] = value` instead of `entry = value`, or `bind:value={array[i]}` instead of `bind:value={entry}`)
https://svelte.dev/e/each_item_invalid_assignment -->
<script lang="ts">
	import { Tabs, Button, Input } from "$ui";
	import { Bell, BellRing, Filter } from "lucide-svelte";
	import ScheduleCard from "./ScheduleCard.svelte";
	import { onMount } from "svelte";

	let records = [
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "urgent note",
			days: [
				{ day: "mon", time: "10:30" },
				{ day: "wed", time: "12:30" },
			],
			openChat: false,
			project: { title: "Project K", color: "#f472b6" },
		},
		{
			pin: false,
			alarm: true,
			item: "habit",
			title: "exercise",
			days: ["tue"],
			openChat: false,
		},
		{
			pin: true,
			alarm: false,
			item: "note",
			title: "important review",
			days: [
				{ day: "fri", time: "" },
				{ day: "sat", time: "" },
			],
			openChat: false,
			project: { title: "Project V", color: "#818cf8" },
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "meditation",
			days: ["sun"],
			openChat: false,
		},
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "project deadline",
			days: ["thu", "fri"],
			openChat: false,
			project: { title: "Project A", color: "#38bdf8" },
		},
		{
			pin: false,
			alarm: false,
			item: "note",
			title: "casual meeting",
			days: ["mon"],
			openChat: false,
			project: { title: "Project B", color: "#a3e635" },
		},
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "team sync",
			days: ["wed", "fri"],
			openChat: false,
			project: { title: "Project C", color: "#2dd4bf" },
		},
		{
			pin: false,
			alarm: true,
			item: "habit",
			title: "reading",
			days: ["wed", "fri"],
			openChat: false,
		},
		{
			pin: false,
			alarm: true,
			item: "event",
			title: "conference",
			days: ["tue", "thu"],
			openChat: false,
		},
		{
			pin: true,
			alarm: false,
			item: "habit",
			title: "journaling",
			days: ["mon", "tue"],
			openChat: false,
		},
		{
			pin: false,
			alarm: false,
			item: "event",
			title: "routine checkup",
			days: ["sat", "sun"],
			openChat: false,
		},
	];

	let sortedRecords = $derived(
		records.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1)),
	);
	let taskRecords = $derived(
		sortedRecords.filter((record) => record.item === "note"),
	);
	let eventRecords = $derived(
		sortedRecords.filter((record) => record.item === "event"),
	);
	let habitRecords = $derived(
		sortedRecords.filter((record) => record.item === "habit"),
	);
	let alarmRecords = $derived(sortedRecords.filter((record) => record.alarm));

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
		value="task"
		class="h-full w-full"
		onValueChange={() => madeOtherRecordFalse(records, {})}
	>
		{#snippet children({ value })}
			<Tabs.List class="flex w-full ">
				<Tabs.Trigger
					value="alarm"
					class="w-[40px] -translate-x-1.5 scale-75"
				>
					{#if value == "alarm"}
						<Button
							variant="ghost"
							class="absolute left-0 my-2 rounded-full bg-neutral-700 !p-3 hover:bg-neutral-900  "
						>
							<BellRing color="#fde68a" fill="#fde68a" />
						</Button>
					{:else}
						<Button
							variant="ghost"
							class="absolute left-0 my-2  rounded-full bg-neutral-300 !p-3    hover:bg-neutral-400"
						>
							<Bell color="#09090b" />
						</Button>
					{/if}
				</Tabs.Trigger>
				<Tabs.Trigger value="event" class="w-1/4">Event</Tabs.Trigger>
				<Tabs.Trigger value="task" class="w-1/4">Task</Tabs.Trigger>
				<Tabs.Trigger value="habit" class="w-1/4">Habit</Tabs.Trigger>
			</Tabs.List>

			<div class="flex items-center">
				<Button variant="ghost" class="py-0 pl-2 pr-1">
					<Filter color="#71717a" />
				</Button>
				<Input
					type="text"
					placeholder="search and add "
					class="my-2 h-9 w-full scale-95 p-2"
				/>
			</div>

			<Tabs.Content
				value="alarm"
				class="h-[calc(100%-94px)]  max-h-[calc(100%)] space-y-2 overflow-y-auto pb-2"
			>
				{#each alarmRecords as record}
					<ScheduleCard
						{value}
						bind:record
						on:toggleOpenChat={handleToggleOpenChat}
					/>
				{/each}
			</Tabs.Content>

			{#each ["event", "note", "habit"] as tab}
				<Tabs.Content
					value={tab}
					class="h-[calc(100%-94px)]  max-h-[calc(100%-94px)] space-y-2 overflow-y-auto pb-2"
				>
					{#each tab === "event" ? eventRecords : tab === "note" ? taskRecords : habitRecords as record}
						<ScheduleCard
							bind:record
							on:toggleOpenChat={handleToggleOpenChat}
						/>
					{/each}
				</Tabs.Content>
			{/each}
		{/snippet}
	</Tabs.Root>
</div>

<style>
</style>
