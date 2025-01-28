<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { getLocalTimeZone, today } from "@internationalized/date";
	import {
		Button,
		DropdownMenu,
		RangeCalendar,
		Resizable,
		ScrollArea,
	} from "$ui";
	import { BotMessageSquare, Search } from "lucide-svelte";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import { getContext } from "svelte";
	import Switch from "$ui/switch/switch.svelte";
	import { postApi } from "$lib/api_ai";

	const selectedDate = getContext("selectedDateRange");
	const dispatchCreateTask = getContext("handleCreateTask");
	const todayValue = today(getLocalTimeZone());

	let askMode = $state(true);
	let newTaskDuration = $state({
		start: $selectedDate.start.add({ days: 7 }),
		end: $selectedDate.start.add({ days: 13 }),
	});

	onMount(async () => {
		await tick();
		//await  handleStoreTasksToAI();
		newTaskDuration = {
			start: $selectedDate.start.add({ days: 7 }),
			end: $selectedDate.start.add({ days: 13 }),
		};
	});

	// items
	const treeItems = getContext("treeItems");

	function resetNewTask() {
		newTask = {
			title: "",
			startDate: todayValue,
			endDate: todayValue.add({ days: 0 }),
		};
	}

	let newTask = $state({
		title: "",
		startDate: todayValue,
		endDate: todayValue.add({ days: 0 }),
	});

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

	async function handleStoreTasksToAI() {
		const new_tasks = $treeItems.map((task) => {
			return {
				title: task.title,
				id: task.id,
				progress_rate: task.progress_rate,
				user: task.user,
			};
		});

		try {
			const res = await postApi({
				path: "/ai/store_tasks",
				data: new_tasks,
			});
			console.log(res);
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	////// dispatch
	const dispatch = createEventDispatcher();

	// crud
	function handleCreate(task) {
		dispatchCreateTask(task, "CREATE_TASK_WITH_TITLE");
	}
</script>

<div class="relative flex flex-col w-full h-full">
	<div
		class="relative flex flex-col justify-between h-full bg-white shadow rounded-xl"
	>
		<Resizable.PaneGroup
			direction="vertical"
			class="flex justify-center w-full py-1 space-x-2 border-b-2 shadow rounded-t-xl border-zinc-500"
		>
			<Resizable.Pane minSize={14}>
				{#if askMode}
					<div
						class="flex justify-center w-full py-1 space-x-2 border-b-2 shadow rounded-t-xl border-zinc-500"
					>
						<BotMessageSquare size={16} />
						<div class="font-mono font-semibold text-unwrap">
							Add Task with Bot!
						</div>
					</div>
				{:else}
					<div class="flex flex-col h-full">
						<div
							class="flex justify-center w-full py-1 space-x-2 border-b-2 shadow rounded-t-xl border-zinc-500"
						>
							<Search size={16} />
							<div class="font-semibold text-unwrap">
								Add Task by Search!
							</div>
						</div>
						<!-- <ScrollArea class=" h-[calc(100%-34px)]">
							<ScheduleList treeItems={$treeItems} />
						</ScrollArea> -->
					</div>
				{/if}
			</Resizable.Pane>

			<Resizable.Handle withHandle class="-translate-x-2 bg-zinc-400" />

			<!-- add task -->
			<Resizable.Pane minSize={14} defaultSize={14}>
				<form
					onsubmit={preventDefault(handleSubmit)}
					class="relative flex items-center w-full h-full p-1"
				>
					<div
						class="flex flex-col h-[70px] space-y-1 translate-y-0.5 -translate-x-1 justify-evenly"
					>
						<Button
							variant="ghost"
							size="sm"
							class="w-auto h-8 p-1.5 text-xs bg-white rounded-lg shadow"
							><BotMessageSquare size={16} />
						</Button>
						<Switch
							onclick={() => (askMode = !askMode)}
							class="w-8 h-4 data-[state=checked]:bg-emerald-700"
							checked={askMode}
						/>
					</div>
					<textarea
						placeholder="title : put more than 1 char"
						bind:value={newTask.title}
						onkeydown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
						class="absolute right-2 top-0.5 border rounded-lg ml-2 h-full w-10/12 scale-y-95 p-2 pr-9 text-[0.9rem] font-normal focus:shadow"
					></textarea>
					<!-- 
			<Button
				variant="ghost"
				type="submit"
				class="absolute z-10 p-0 rounded-full botom-0 right-1 hover:bg-zinc-100"
				><CirclePlus color="#a1a1aa" /></Button
			> -->
				</form>
			</Resizable.Pane>
		</Resizable.PaneGroup>

		<hr class="absolute w-full border bottom-9 border-zinc-500" />

		<!-- duration picker -->
		<div
			class="w-full text-xs text-center font-digital text-zinc-600 text-nowrap bg-zinc-100"
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
					class="w-[300px] border-2 border-double border-zinc-800"
				>
					<RangeCalendar
						bind:value={newTaskDuration}
						weekStartsOn={1}
						class="w-[290px] rounded-lg border bg-white shadow"
					/>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<span class="text-zinc-950">-◀</span>
		</div>
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
