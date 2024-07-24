<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from "$ui";
	import { CirclePlus, Calendar, BotMessageSquare } from "lucide-svelte";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import { getContext } from "svelte";

	const selectedDate = getContext("selectedDateRange");
	const todayValue = today(getLocalTimeZone());

	let newTaskDuration = {
		start: $selectedDate.start.add({ days: 7 }),
		end: $selectedDate.start.add({ days: 13 }),
	};

	onMount(async () => {
		await tick();
		newTaskDuration = {
			start: $selectedDate.start.add({ days: 7 }),
			end: $selectedDate.start.add({ days: 13 }),
		};
	});

	// items
	const tasks = getContext("tasks");

	function resetNewTask() {
		newTask = {
			title: "",
			start_date: todayValue,
			end_date: todayValue.add({ days: 0 }),
		};
	}

	let newTask = {
		title: "",
		start_date: todayValue,
		end_date: todayValue.add({ days: 0 }),
	};

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		event.preventDefault();

		if (newTask.title.trim() === "") {
			return;
		}

		await tick();

		handleCreate({
			title: newTask.title,
			start_date: newTaskDuration.start,
			end_date: newTaskDuration.end,
		});
		resetNewTask();
	}

	////// dispatch
	const dispatch = createEventDispatcher();

	// crud
	function handleCreate(task) {
		dispatch("create", { task });
	}
</script>

<div class="relative flex flex-col w-full h-full">
	<!-- duration picker -->
	<div
		class="w-full text-xs text-center font-digital text-zinc-600 text-nowrap"
	>
		<span class="text-zinc-950">▶- Assign :</span>

		<DropdownMenu.Root closeOnItemClick={false}>
			<DropdownMenu.Trigger class="p-0 rounded h-9">
				<Button
					variant="ghost"
					size="sm"
					class="w-auto h-6 p-1.5 text-xs bg-white rounded-lg shadow"
					>{newTaskDuration.start + " ~ " + newTaskDuration.end}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[300px] border-2 border-double border-zinc-800 "
			>
				<RangeCalendar
					bind:value={newTaskDuration}
					weekStartsOn={1}
					class="w-[290px] rounded-lg border bg-white shadow "
				/>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<span class="text-zinc-950">-◀</span>
	</div>

	<!-- add task -->
	<div class="relative flex flex-col justify-between h-full bg-white shadow rounded-xl">
		<div class="flex justify-center w-full py-1 space-x-2 border-b-2 shadow rounded-t-xl border-zinc-500 ">
			<BotMessageSquare size={16} />
			<div class="font-mono font-semibold text-unwrap"> Add Task with Bot!</div>
			
		</div>

		<hr class="-translate-y-12 border border-zinc-500"/>
		<form
			on:submit|preventDefault={handleSubmit}
			class="absolute flex items-center w-full p-2 bottom-2 h-9 "
		>
		
			<Button
				variant="ghost"
				size="sm"
				class="w-auto h-8 p-1.5 text-xs bg-white rounded-lg shadow"
				><BotMessageSquare size={16} />
			</Button>
			<Input
				type="text"
				placeholder={"title : put more than 1 char"}
				bind:value={newTask.title}
				on:keydown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						handleSubmit(e);
					}
				}}
				class="my-2 ml-2 h-9 w-full scale-y-95 p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
			/>
			<!-- 
		<Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		> -->
		</form>
	</div>
</div>

<style>
	.draggable {
		display: flex;
		align-items: center;
		cursor: move;
	}

	.dragging {
		opacity: 0.5;
	}

	tr.dragging {
		background-color: #f0f0f0;
	}
</style>
