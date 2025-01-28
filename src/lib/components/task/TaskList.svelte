<!-- @migration-task Error while migrating Svelte code: Identifier 'Task' has already been declared
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Identifier 'Task' has already been declared
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import {
		getLocalTimeZone,
		today,
		CalendarDate,
		parseDate,
	} from "@internationalized/date";
	import { Popover, RangeCalendar } from "$ui";
	import { GripVertical } from "lucide-svelte";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import { getContext } from "svelte";
	import { type Task } from "$lib/schema";
	import { type Task } from "$lib/schema";

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
			startDate: todayValue,
			endDate: todayValue.add({ days: 0 }),
		};
	}

	let newTask = {
		title: "",
		startDate: todayValue,
		endDate: todayValue.add({ days: 0 }),
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
			startDate: newTaskDuration.start,
			endDate: newTaskDuration.end,
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
			startDate: duration.start.toString(),
			endDate: duration.end.toString(),
		};
		dispatch("update", { task, updateData });
	}

	function handleUpdateProgressRate(task: Task, progressRate: Number) {
		const updateData = {
			progress_rate: +progressRate,
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
	export let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
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

	$: {
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

<!-- task list -->
{#key $tasks}
	<div
		class="
shadow-md bg-white border-r-2 border-l-2 border-zinc-600
			 h-full max-h-[calc(100%-48px)] w-full max-w-full overflow-x-clip overflow-y-scroll"
		bind:this={tableContainer}
		on:scroll={handleScroll}
	>
		<table class="w-full translate-y-1">
			{#if !$tasks || tasks.length === 0}
				<td class="h-[300px] w-full" colspan="3">No tasks</td>
			{:else}
				{#each $tasks as task, i}
					<tr
						class="flex w-full h-[30px]"
						class:dragging={draggedIndex === i}
					>
						<!-- index -->
						<td
							class="h-[30px] w-7 draggable border-b border-r"
							draggable="true"
							on:dragstart={(e) => handleDragStart(e, i)}
							on:dragover={handleDragOver}
							on:drop={(e) => handleDrop(e, i)}
							on:dragend={handleDragEnd}
						>
							<div class="w-full h-full">
								{#if draggedIndex === i}
									<GripVertical size={18} />
								{/if}
								<div class="text-center translate-y-1">
									{i + 1}
								</div>
							</div>
						</td>
						<!-- progress rate -->
						<td class="w-32 h-[30px] border-b px-2">
							<input
								class="w-32 translate-y-1 shadow opacity-70"
								class:complete={task.progress_rate === 100}
								class:inProgress={task.progress_rate > 25 &&
									task.progress_rate < 100}
								type="range"
								step="25"
								min="0"
								max="100"
								value={task.progress_rate || 0}
								list="markers"
								on:change={(e) =>
									handleUpdateProgressRate(
										task,
										e.target.value,
									)}
							/>
							<!-- <datalist
								id="markers"
								class="-translate-y-[21px] opacity-50"
							>
								<option value="0" class="!opacity-0"></option>
								<option value="25"></option>
								<option value="50"></option>
								<option value="75"></option>
								<option value="100" class="!opacity-0"></option>
							</datalist> -->
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
									task.startDate =
										cellDuration.start.toString();
									task.endDate = cellDuration.end.toString();
									handleUpdateDuration(task, cellDuration);
								} else {
									cellDuration.start = parseDate(
										task.startDate,
									);
									cellDuration.end = parseDate(task.endDate);
								}
							}}
						>
							<Popover.Trigger
								><td
									class="inline-block h-[30px] w-[120px] border-b"
								>
									<div
										class="inline-flex space-x-1 h-[20px] translate-y-1"
									>
										{#if task.startDate && task.endDate}
											<div class="">
												{task.startDate.slice(5, 10)}
											</div>
											<div
												class="font-extrabold text-zinc-400"
											>
												~
											</div>
											<div>
												{task.endDate.slice(5, 10)}
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
		</table>
	</div>
{/key}

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

	/* https://blog.logrocket.com/creating-custom-css-range-slider-javascript-upgrades/ */
	input[type="range"] {
		/* removing default appearance */
		appearance: none;
		/* creating a custom design */
		width: 100%;
		height: 57%;
		cursor: pointer;
		outline: none;
		/*  slider progress trick  */
		overflow: hidden;
		border-radius: 16px;
	}

	/* Track: webkit browsers */
	input[type="range"]::-webkit-slider-runnable-track {
		height: 15px;
		background: linear-gradient(
			to right,
			#e46b756d 0%,
			#f6ecec 50%,
			#7eaf807c 100%
		);
		border-radius: 16px;
	}

	/* Track: Mozilla Firefox */
	input[type="range"]::-moz-range-track {
		height: 15px;
		background: linear-gradient(
			to right,
			#e46b758d 0%,
			#f8ecec 50%,
			#7eaf807c 100%
		);
		border-radius: 16px;
	}

	/* Thumb: webkit */
	input[type="range"]::-webkit-slider-thumb {
		/* removing default appearance */
		-webkit-appearance: none;
		appearance: none;
		/* creating a custom design */
		height: 15px;
		width: 15px;
		border-radius: 50%;
		border: 2px solid #b91c1cb4;
		/*  slider progress trick  */
		box-shadow: -407px 0 2px 400px #b91c1cb4;
	}

	input[type="range"].complete::-webkit-slider-thumb {
		/* removing default appearance */
		-webkit-appearance: none;
		appearance: none;
		/* creating a custom design */
		height: 15px;
		width: 15px;
		border-radius: 50%;
		border: 2px solid #7eaf80;
		/*  slider progress trick  */
		box-shadow: -407px 0 2px 400px #7eaf80;
	}

	input[type="range"].inProgress::-webkit-slider-thumb {
		/* removing default appearance */
		-webkit-appearance: none;
		appearance: none;
		/* creating a custom design */
		height: 15px;
		width: 15px;
		border-radius: 50%;
		border: 2px solid #7194b1;
		/*  slider progress trick  */
		box-shadow: -407px 0 2px 400px #7194b1;
	}

	/* Thumb: Firefox */
	input[type="range"]::-moz-range-thumb {
		height: 15px;
		width: 15px;
		background-color: #fff;
		border-radius: 50%;
		border: 1px solid #e46b75;
		/*  slider progress trick  */
		box-shadow: -407px 0 0 400px #e46b75;
	}

	datalist {
		position: relative;
		display: flex;
		justify-content: space-between;
		display: flex;
		justify-content: space-between;
		z-index: -1;
	}

	datalist option {
		display: flex;
		justify-content: center;
		background: #56121800;
		z-index: -1;
	}
</style>
