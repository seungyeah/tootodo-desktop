<script lang="ts">
	import {
		getLocalTimeZone,
		today,
	} from "@internationalized/date";
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from "$ui";
	import { CirclePlus, Calendar, GripVertical } from "lucide-svelte";
	import {createEventDispatcher, onMount, tick} from "svelte";
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

<div class="flex flex-col w-full h-full space-y-4">
	<!-- add task -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="relative flex h-9 w-full translate-y-1.5 items-center pb-4"
	>
		<DropdownMenu.Root closeOnItemClick={false}>
			<DropdownMenu.Trigger class="p-0 rounded h-9">
				<Button
					variant="ghost"
					size="sm"
					class="h-8 px-1 rounded shadow bg-zinc-100"
					><Calendar size={16} /></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[300px] translate-x-2 border-2 border-double border-zinc-800 "
			>
				<DropdownMenu.Group>
					<DropdownMenu.Label class="w-full text-center ">
						{#if newTaskDuration}
							<div>
								<span class="font-extrabold text-zinc-400"
									>Date Range:</span
								>
								{newTaskDuration.start ||
									$selectedDate.start ||
									"0000-00-00"}
								<span class="font-extrabold text-zinc-400">~</span>
								{newTaskDuration.end ||
									$selectedDate.end ||
									"0000-00-00"}
							</div>
						{/if}
					</DropdownMenu.Label>

					<DropdownMenu.Item class="-translate-y-1">
						<RangeCalendar
							bind:value={newTaskDuration}
							weekStartsOn={1}
							class="w-[290px] rounded-lg border bg-white shadow "
						/>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
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
			class="my-2 ml-2 h-9 w-full scale-y-95 rounded-r-full p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
		/>
		<Button
			variant="ghost"
			type="submit"
			class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
			><CirclePlus color="#a1a1aa" /></Button
		>
		<div
			class="absolute bottom-0 left-0 w-full text-xs text-center font-digital text-zinc-600"
		>
			<hr class="w-full h-2 translate-y-8 bg-zinc-100" />
			<div class="translate-y-2.5 text-nowrap">
				<span class="text-zinc-950">▶- Assigned In:</span>
				{newTaskDuration.start + " ~ " + newTaskDuration.end} 
				<span class="text-zinc-950">-◀</span>
			</div>
		</div>
	</form>

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
