<script lang="ts">
	import {
		getLocalTimeZone,
		today,
		CalendarDate,
		parseDate,
	} from "@internationalized/date";
	import { Button, DropdownMenu, Input, Popover, RangeCalendar } from "$ui";
	import { CirclePlus, Calendar, GripVertical } from "lucide-svelte";
	import {createEventDispatcher, onMount, tick} from "svelte";
	import { getContext } from "svelte";

	const selectedDate = getContext("selectedDateRange");
	const todayValue = today(getLocalTimeZone());
	let cellDuration = {
		start: today(getLocalTimeZone()),
		end: todayValue.add({ days: 0 }),
	};

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

	function handleUpdateDuration(
		task: Task,
		duration: { start: CalendarDate; end: CalendarDate },
	) {
		const updateData = {
			start_date: duration.start.toString(),
			end_date: duration.end.toString(),
		};
		dispatch("update", { task, updateData });
	}

	function handleUpdateTitle(task: Task, title: String) {
		const updateData = {
			title: title,
		};
		dispatch("update", { task, updateData });
	}

	// scroll
	let tableContainer: HTMLElement;

	function handleScroll() {
		dispatch("scroll", {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft,
		});
	}

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}

	// dnd
	let draggedIndex = null;

	function handleDragStart(e, index) {
		draggedIndex = index;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", index);
	}

	
	function handleDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}


	function handleDrop(e, index) {
		e.preventDefault();
		const draggedOverIndex = index;

		if (draggedIndex !== draggedOverIndex) {
			const reorderedTasks = [...$tasks];
			const [movedItem] = reorderedTasks.splice(draggedIndex, 1);
			reorderedTasks.splice(draggedOverIndex, 0, movedItem);
			$tasks = reorderedTasks;
		}

		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
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
			<div class="translate-y-2.5">
				<span class="text-zinc-950">▶- Assigned In:</span>
				{newTaskDuration.start + " ~ " + newTaskDuration.end} 
				<span class="text-zinc-950">-◀</span>
			</div>
		</div>
	</form>

	<!-- task list -->
	{#key $tasks}
		<div
			class="
			rounded-t-xl rounded-b-lg shadow-md bg-white border-0 border-zinc-600
			no-scrollbar h-full max-h-[calc(100%-50px)] w-full max-w-full overflow-x-clip overflow-y-scroll"
			bind:this={tableContainer}
			on:scroll={handleScroll}
		>
			<table class="translate-y-1">
				<thead class="sticky top-0 z-10 h-[20px] bg-white text-center">
					<tr class="">
						<th
							scope="col"
							class="flex items-center justify-center h-full translate-y-1 border-r min-w-5"
							><GripVertical size={14} /></th
						>
						<th scope="col" class="w-3/5 border-r">Title</th>
						<th scope="col" class="w-2/5">Duration</th>
					</tr>
					<tr class="absolute min-w-full border-b-2 border-zinc-500"></tr>
				</thead>
				<tbody class="text-center">
					{#if !$tasks || tasks.length === 0}
						<td class="h-[300px] w-full" colspan="3">No tasks</td>
					{:else}
						{#each $tasks as task, i}
							<tr class="text-start" class:dragging={draggedIndex === i}>
								<!-- index -->
								<td
									class="h-[30px] draggable inline-block border-b"
									draggable="true"
									on:dragstart={(e) => handleDragStart(e, i)}
									on:dragover={handleDragOver}
									on:drop={(e) => handleDrop(e, i)}
									on:dragend={handleDragEnd}
								>
									<div class="w-full h-full text-center translate-y-1">
										{#if draggedIndex === i}
											<GripVertical size={18} />
										{/if}{i + 1}
									</div>
								</td>
								<!-- title -->
								<td class="h-[30px] border border-t-0 w-full"
									><input
										value={task.title}
										class="h-full px-1.5 w-full bg-transparent"
										on:blur={(e) =>
											handleUpdateTitle(task, e.target.value)}
									/>
								</td>
								<!-- duration -->
								<Popover.Root
									onOpenChange={(open) => {
										if (!open) {
											task.start_date =
												cellDuration.start.toString();
											task.end_date = cellDuration.end.toString();
											handleUpdateDuration(task, cellDuration);
										} else {
											cellDuration.start = parseDate(
												task.start_date,
											);
											cellDuration.end = parseDate(task.end_date);
										}
									}}
								>
									<Popover.Trigger
										><td
											class="inline-block h-[30px] w-[110px] border-b"
										>
											<div
												class="inline-flex space-x-1 h-[30px] translate-y-1.5"
											>
												{#if task.start_date && task.end_date}
													<div class="">
														{task.start_date.slice(5, 10)}
													</div>
													<div
														class="font-extrabold text-zinc-400"
													>
														~
													</div>
													<div>
														{task.end_date.slice(5, 10)}
													</div>
												{:else}
													00-00 <span
														class="font-extrabold text-zinc-400"
														>~</span
													> 00-00
												{/if}
											</div>
										</td></Popover.Trigger
									>
									<Popover.Content class="w-[300px]">
										<!-- select range -->
										<RangeCalendar
											bind:value={cellDuration}
											weekStartsOn={1}
											class="w-full bg-white border rounded-lg shadow "
										/>
									</Popover.Content>
								</Popover.Root>
							</tr>{/each}{/if}
				</tbody>
			</table>
		</div>
	{/key}
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
