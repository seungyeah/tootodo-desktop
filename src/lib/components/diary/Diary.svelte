<script lang="ts">
	import { Badge, Button, Resizable } from "$ui";
	import DiaryEditor from "$components/note/editor/Editor.svelte";
	import {
		Bed,
		BookOpenText,
		Dumbbell,
		Globe,
		Pill,
		Star,
		Sun,
		Utensils,
	} from "lucide-svelte";
	import ItemList from "./ItemList.svelte";
	import { currentTime } from "$store";
	let habits = [
		{ id: 0, icon: Sun, title: "wake up" },
		{ id: 1, icon: Bed, title: "go to bed" },
		{ id: 2, icon: Utensils, title: "breakfast" },
		{ id: 3, icon: Pill, title: "take pills" },
		{ id: 4, icon: Globe, title: "learn foreign language" },
		{ id: 5, icon: BookOpenText, title: "read book" },
		{ id: 6, icon: Dumbbell, title: "workout" },
	];

	let records = [
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "urgent note",
			days: ["mon", "wed"],
			openChat: false,
			project: { title: "Project K", color: "#f472b6" },
			chatID: "def456",
		},
		{
			pin: false,
			alarm: true,
			item: "habit",
			title: "exercise",
			days: ["tue"],
		},
		{
			pin: true,
			alarm: false,
			item: "note",
			title: "important review",
			days: ["fri", "sat"],
			openChat: false,
			project: { title: "Project V", color: "#818cf8" },
			chatID: "def456",
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "meditation",
			days: ["sun"],
		},
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "project deadline",
			days: ["thu", "fri"],
			openChat: false,
			project: { title: "Project A", color: "#38bdf8" },
			chatID: "def456",
		},
		{
			pin: false,
			alarm: false,
			item: "note",
			title: "casual meeting",
			days: ["mon"],
			openChat: false,
			project: { title: "Project B", color: "#a3e635" },
			chatID: "def456",
		},
		{
			pin: true,
			alarm: true,
			item: "note",
			title: "team sync",
			days: ["wed", "fri"],
			openChat: false,
			project: { title: "Project C", color: "#2dd4bf" },
			chatID: "def456",
		},
		{
			pin: false,
			alarm: true,
			item: "habit",
			title: "reading",
			days: ["wed", "fri"],
		},
		{
			pin: false,
			alarm: true,
			item: "event",
			title: "conference",
			days: ["tue", "thu", "fri"],
			openChat: false,
			chatID: "abc123",
		},
		{
			pin: true,
			alarm: false,
			item: "habit",
			title: "journaling",
			days: ["mon", "tue"],
		},
		{
			pin: false,
			alarm: false,
			item: "event",
			title: "routine checkup",
			days: ["sat", "sun"],
			openChat: false,
			chatID: "def456",
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "wake up",
			days: ["mon", "wed", "fri"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "go to bed",
			days: ["sun", "mon", "tue"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "breakfast",
			days: ["tue", "thu", "sat"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "take pills",
			days: ["wed", "fri", "sun"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "learn foreign language",
			days: ["mon", "wed", "fri"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "read book",
			days: ["tue", "thu", "sat"],
		},
		{
			pin: false,
			alarm: false,
			item: "habit",
			title: "workout",
			days: ["mon", "wed", "fri"],
		},
	];

	// export let day = new Date().getDay();
	let day = "fri";
	let sortedRecords = $derived(
		records.sort((a, b) => (b.pin === a.pin ? 0 : b.pin ? 1 : -1)),
	);
	let taskRecords = $derived(
		sortedRecords.filter(
			(record) => record.item === "note" && record.days.includes(day),
		),
	);
	let eventRecords = $derived(
		sortedRecords.filter(
			(record) => record.item === "event" && record.days.includes(day),
		),
	);
	let habitRecords = $derived(
		sortedRecords.filter(
			(record) => record.item === "habit" && record.days.includes(day),
		),
	);
	let todayHabits = $derived(
		habits.filter((habit) =>
			habitRecords.some((record) => record.title === habit.title),
		),
	);

	// $:console.log(todayHabits);
	let Stars = $state(new Array(5).fill(0));
</script>

<div class="relative h-full w-full flex-col">
	<div
		class="flex h-[32px] translate-y-1.5 border-l-2 border-neutral-700 text-center text-lg font-bold"
	>
		<div class="relative w-full -translate-y-3 translate-x-4">
			{#each Stars as star, i}
				<button
					class="absolute left-0 top-0 py-1 pt-2 hover:bg-none"
					style="transform:translateX({i * 24}px)"
					onclick={() => {
						Stars = Stars.map((_, j) => j <= i);
					}}
				>
					<Star size={20} fill={star ? "#fde047" : "white"} />
				</button>
			{/each}
			<!-- today, date -->
			<!-- <div class="hidden lg:block ">
                <div class="w-full t  ext-center font-mono -translate-y-1 flex justify-center items-center space-x-4">
                    <Badge/>
                    <div>2024-04-22</div>
                    <Badge/>
                </div>
            </div> -->
		</div>
	</div>
	<div
		class="flex h-[38%] w-full translate-y-1 border-l-2 border-neutral-700 p-1 pt-1.5 text-center text-lg font-bold"
	>
		<Resizable.PaneGroup
			direction="horizontal"
			class="m-2 -translate-y-5 text-nowrap rounded-xl border-2 border-double  border-neutral-400"
		>
			<Resizable.Pane minSize={14}>
				<div class="h-7 border-b-2 border-dashed p-0.5">Task</div>
				<ItemList records={taskRecords} />
			</Resizable.Pane>
			<Resizable.Handle withHandle class="bg-neutral-300 p-[1px]" />
			<Resizable.Pane minSize={17} defaultSize={45}>
				<div class="h-7 border-b-2 border-dashed p-0.5">Event</div>
				<ItemList records={eventRecords} />
			</Resizable.Pane>
		</Resizable.PaneGroup>

		<!-- habbit -->
		<div class="h-full w-1/4 -translate-y-10">
			<div
				class="mb-2 w-full border-b-4 border-double border-neutral-200"
			>
				Habit
			</div>
			<div
				class="no-scrollbar grid h-[calc(100%-14px)] max-h-[calc(100%-14px)]
				grid-cols-1 place-items-center items-center gap-1 overflow-y-scroll rounded-lg px-1.5 shadow
				lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
			>
				{#each todayHabits as habit}
					<Button
						variant="ghost"
						onclick={() => {
							habit.done = !habit.done;
							if (habit.done) habit.doneTime = $currentTime;
							else habit.doneTime = "";
						}}
						class={habit.done
							? "aspect-square rounded-full bg-neutral-200 p-1"
							: "aspect-square rounded-full p-1"}
						><habit.icon /></Button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="font-chat h-[calc(62%-32px)] w-full">
		<DiaryEditor />
	</div>
</div>
