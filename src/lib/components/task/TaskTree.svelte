<script context="module" lang="ts">
	import { type Task } from "$lib/schema";

	export type TreeItem = {
		task: Task;
		subtasks?: TreeItem[];
	};
	
	let draggedTask: Task | null = null;
</script>

<script lang="ts">
	import {
		getLocalTimeZone,
		today,
		CalendarDate,
		parseDate,
	} from "@internationalized/date";
	import { Popover, RangeCalendar } from "$ui";
	import { Folder, FolderOpen, ArrowRight, GripVertical } from "lucide-svelte";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import { getContext } from "svelte";
	import TaskSettingIcon from "./TaskSettingIcon.svelte";

	import { melt, type TreeView } from "@melt-ui/svelte";

	const {
		elements: { item, group },
		helpers: { isExpanded, isSelected },
	} = getContext<TreeView>("tree");

	// items
	export let level = 1;
	export let treeItems: TreeItem[] = [];

	const todayValue = today(getLocalTimeZone());
	let cellDuration = {
		start: today(getLocalTimeZone()),
		end: todayValue.add({ days: 0 }),
	};

	////// dispatch
	const dispatch = createEventDispatcher();

	// update
	function handleUpdateDuration(
		task: Task,
		duration: { start: CalendarDate; end: CalendarDate },
	) {
		//console.log("task transfer",task.start_date, task.end_date);
		const updateData = {
			start_date: duration.start.toString(),
			end_date: duration.end.toString(),
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

	// 자식 컴포넌트(self)에서 발생한 이벤트를 처리하고 상위로 전달하는 함수
	function handleChildUpdate(event: CustomEvent) {
		const { task, updateData } = event.detail;
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

	function handleDragStart(e: DragEvent, task: Task) {
		draggedTask = {...task} ;
		e.dataTransfer!.effectAllowed = "move";
		e.dataTransfer!.setData("text/plain", task.id);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		console.log(draggedTask?.title, "over");
		e.dataTransfer!.dropEffect = "move";
	}

	function handleDrop(e: DragEvent, targetTask: Task) {
		e.preventDefault();
		console.log(draggedTask?.title, "target: ",targetTask.title);
		if (draggedTask && draggedTask.id !== targetTask.id) {
			console.info("start update")
			handleUpdateParent(draggedTask, targetTask);
		}
	}

	function handleUpdateParent(task: Task, targetTask: Task) {
    const updateData = targetTask.parent_id
        ? { parent_id: targetTask.parent_id }
        : { parent_id: targetTask.id };
    dispatch("update", { task, updateData });
}

	function handleDragEnd() {
		console.info("drag end")
		draggedTask = null;
	}
</script>

{#key treeItems}
	<div
		class="bg-white border-r-[3px] border-l-2 border-zinc-800
			 h-full max-h-[calc(100%-48px)] w-full min-w-full overflow-x-clip overflow-y-auto"
		bind:this={tableContainer}
		on:scroll={handleScroll}
	>
		{#each treeItems as { task, subtasks }, i}
			{@const itemId = `${task.id}`}
			{@const hasChildren = !!subtasks?.length}
			<div				
				draggable={!hasChildren}
				class="flex w-full h-[30px] items-center gap-0 rounded-md"
				class:group={$isExpanded(itemId)}
				class:dragging={task === draggedTask}
				class:draggable={!hasChildren}
				on:dragstart={(e) => handleDragStart(e, task)}
				on:dragover={handleDragOver}
				on:drop={(e) => handleDrop(e, task)}
				on:dragend={handleDragEnd}
				role="listitem"
			>
				{#if task === draggedTask}
					<GripVertical size={18} />
				{/if}

				{#if !hasChildren }
					<div
						class={level !== 1 ? "pl-4 h-full bg-zinc-100 border-b" : ""}
					/>
				{/if}

				<!-- icons -->
				<div
					class="flex border-b h-[30px] items-center"
					use:melt={$item({
						id: itemId,
						hasChildren,
					})}
				>
					<TaskSettingIcon {task} {hasChildren} />
					<div
						class={hasChildren && $isSelected(itemId)
							? "flex space-x-1 border border-zinc-200 shadow-sm rounded-full py-0.5 px-1.5"
							: ""}
					>
						<!-- Folder icon. -->
						{#if hasChildren && $isExpanded(itemId)}
							<svelte:component this={FolderOpen} class="w-4 h-4" />
						{:else if hasChildren}
							<svelte:component this={Folder} class="w-4 h-4 " />
						{/if}
						<!-- Selected icon. -->
						{#if $isSelected(itemId)}
							<svelte:component
								this={ArrowRight}
								class="w-4 h-4 text-pomodoro-500"
							/>
						{/if}
					</div>
				</div>

				<!-- title -->
				<div class="h-[30px] border-b border-r w-full">
					<input
						value={task.title}
						class="h-full px-1.5 w-full bg-transparent focus:bg-zinc-50"
						on:blur={(e) => handleUpdateTitle(task, e.target.value)}
					/>
				</div>

				<!-- duration -->
				<Popover.Root
					onOpenChange={(open) => {
						if (!open) {
							handleUpdateDuration(task, cellDuration);
						} else {
							cellDuration.start = parseDate(task.start_date);
							cellDuration.end = parseDate(task.end_date);
						}
					}}
				>
					<Popover.Trigger
						><td
							class="inline-block h-[30px] w-[120px] border-b border-r"
						>
							<div class="inline-flex space-x-1 h-[20px] translate-y-1">
								{#if task.start_date && task.end_date}
									<div class="">
										{task.start_date.slice(5, 10)}
									</div>
									<div class="font-extrabold text-zinc-400">~</div>
									<div>
										{task.end_date.slice(5, 10)}
									</div>
								{:else}
									00-00 <span class="font-extrabold text-zinc-400"
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

				<!-- progress rate -->
				<div
					class="w-20 min-w-20 h-[30px] border-b border-r px-1.5"
					class:group_={$isExpanded(itemId)}
				>
					<input
						class="w-20 translate-y-1.5 shadow opacity-40"
						class:complete={task.progress_rate === 100}
						class:inProgress={task.progress_rate > 25 &&
							task.progress_rate < 100}
						type="range"
						step="25"
						min="0"
						max="100"
						value={task.progress_rate || 0}
						on:change={(e) =>
							handleUpdateProgressRate(task, e.target.value)}
					/>
				</div>
			</div>

			{#if subtasks?.length}
				<div
					use:melt={$group({ id: itemId })}
					class:groupChild={$isExpanded(itemId)}
				>
					<svelte:self
						treeItems={subtasks}
						level={level + 1}
						on:update={handleChildUpdate}
					/>
				</div>
			{/if}
		{/each}
	</div>
{/key}

<style>
	.group_ {
		@apply border-r-[3px] border-r-zinc-700 mr-2 ml-[2.5px] rounded-r-md rounded-b-none;
	}

	.group {
		@apply border-l-2 rounded-b-none ml-1  border-zinc-700;
	}

	.groupChild {
		@apply border-zinc-500 ml-1 mr-1 border-t  border-dashed;
	}

	.draggable {
		display: flex;
		align-items: center;
		cursor: move;
	}

	.dragging {
		opacity: 0.5;
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
