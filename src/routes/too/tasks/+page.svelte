
<script lang="ts">
	import PageTemplete from "$components/PageTemplete.svelte";
	import { createTreeView } from "@melt-ui/svelte";
	import {
		type Component,
		onMount,
		setContext,
		tick,
		getContext,
	} from "svelte";
	import TaskGantt from "$components/task/TaskGanttMain.svelte";
	import TaskSide from "$components/task/TaskSide.svelte";
	import DurationPicker from "$components/task/DurationPicker.svelte";
	import { goto } from "$app/navigation";
	import { derived, writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api.js";
	import { type Task } from "$lib/schema";
	import {
		type DateRange,
		getThis3WeeksRange,
		parseDateRangeFromURL,
	} from "$lib/utils";
	import TaskTree from "$components/task/TaskTree.svelte";
	import type {
		TaskCreationMode,
		TaskDeleteOption,
		TaskTreeItem,
	} from "$lib/type.js";
	import { invoke } from "@tauri-apps/api/core";
	import {page} from "$app/state";

	let data = { tasks: [] };

	let treeItems = writable(data?.tasks || []);
	setContext("treeItems", treeItems);

	// treeview
	const ctx = createTreeView({
		// expand all tasks that have subtasks
		//defaultExpanded: $treeItems.map((item) => item.subtasks?.length ? item.task.id: null),
		defaultExpanded: [],
	});

	const {
		elements: { tree },
	} = ctx;

	setContext("tree", ctx);

	///////// duration select
	let initialDateRange = parseDateRangeFromURL() || getThis3WeeksRange();

	const selectedDateRange = writable<DateRange>(initialDateRange);
	setContext("selectedDateRange", selectedDateRange);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (!urlParams.get("startDate") || !urlParams.get("endDate")) {
			setQuery(getThis3WeeksRange());
		}
	});

	///////// req api
	function setQuery(duration) {
		console.table(duration);
		const startDate = duration.start;
		const endDate = duration.end;
		const searchParams = new URLSearchParams({ startDate, endDate });
		goto(`?${searchParams.toString()}`);

	}

	$effect(() => {
		const { start, end } = $selectedDateRange;

		invoke("fetch_tasks", {
			startDate: start.toString(),
			endDate: end.toString(),
		})
				.then((tasks) => {
					data.tasks = tasks;
					console.log("tasks", tasks);

					console.log(page.url.href);
				})
				.catch(console.error);
	});


	function handleDateUpdate(e) {
		const { selectedDateRange } = e.detail;

		selectedDateRange.set(selectedDateRange);
		setQuery(selectedDateRange);
	}

	async function handleUpdateTask({ task, updateData }) {
		console.info("update task", updateData);

		// task가 변경되지 않았을 경우, 무시
		const hasChanged = Object.entries(updateData).some(([key, value]) => {
			return !(key in task) || task[key] !== value;
		});

		if (!hasChanged) {
			console.info("nothing changed");
			return;
		}

		// 변경된 task를 api로 전송
		const { id, parent_id } = task;

		try {
			const res = await patchApi({
				path: `/tasks/${id}`,
				data: updateData,
			});

			const updatedTask = res.data?.task;

			treeItems.update(($tasks) => {
				if (parent_id) {
					// Find the parent task using parent_id
					const parentItem = findTaskById($tasks, parent_id);
					if (parentItem && parentItem.subtasks) {
						// Update the subtask with the updated task
						const subtaskIndex = parentItem.subtasks.findIndex(
							(item) => item.task.id === id,
						);
						if (subtaskIndex !== -1) {
							parentItem.subtasks[subtaskIndex].task =
								updatedTask;
							//console.info(parentItem.subtasks[subtaskIndex].task);
						}
					}
				} else {
					// Update the task with the updated task
					const index = $tasks.findIndex(
						(item) => item.task.id === id,
					);
					if (index !== -1) {
						$tasks[index].task = updatedTask;
						//console.info($tasks[index].task);
					}
				}

				return $tasks;
			});
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	async function handleCreateTask(task: Task, mode: TaskCreationMode) {
		if (!task) {
			return;
		}

		let formattedTask: Partial<Task> = {};
		formattedTask.startDate = formatDate(task.startDate);
		formattedTask.endDate = formatDate(task.endDate);
		formattedTask.parent_id = "";

		if (mode === "CREATE_TASK_WITH_TITLE") {
			formattedTask.title = task.title;
		} else {
			formattedTask.title = "";

			if (mode === "CREATE_TASK_FROM_TASK") {
				formattedTask.parent_id = task?.parent_id;
			}

			if (mode === "CREATE_SUBTASK_FROM_TASK") {
				formattedTask.parent_id = task.id;
			}
		}

		invoke("create_task", { ...formattedTask })
			.then(async (newTask) => {
				if (
					mode === "CREATE_TASK_FROM_TASK" ||
					mode === "CREATE_SUBTASK_FROM_TASK"
				) {
					treeItems.update(($tasks) => {
						const parentItem = findTaskById(
							$tasks,
							formattedTask.parent_id,
						);
						if (parentItem) {
							if (!parentItem.subtasks) {
								parentItem.subtasks = [];
							}
							parentItem.subtasks.push({ task: newTask });
						}
						return $tasks;
					});
				} else {
					console.log(newTask);
					$treeItems = [
						...$treeItems,
						{ task: newTask, subtasks: [] },
					];
				}

				await tick();
			})
			.catch((e) => console.error("Fail to fetch tasks", e));
	}

	async function handleDeleteTask(task: Task, option: TaskDeleteOption) {
		const { id, parent_id } = task;
		try {
			await delApi({ path: `/tasks/${id}`, data: option });

			treeItems.update(($tasks) => {
				if (parent_id) {
					// Find the parent task using parent_id
					const parentItem = findTaskById($tasks, parent_id);
					if (parentItem && parentItem.subtasks) {
						// Remove the subtask from the parent's subtasks
						parentItem.subtasks = parentItem.subtasks.filter(
							(item) => item.task.id !== id,
						);
					}
				} else {
					// If no parent_id, remove the task from the root level
					if (option === "CONVERT_SUBTASK_TO_TASK") {
						// Find the task to remove from the root level
						const itemToRemove = $tasks.find(
							(item) => item.task.id === id,
						);

						if (itemToRemove) {
							const subtasks = itemToRemove.subtasks || [];

							$tasks = $tasks.filter(
								(item) => item.task.id !== id,
							);

							// Convert each subtask into a root-level task and add to $tasks
							const convertedTasks = subtasks.map((subtask) => ({
								task: subtask.task, // Assuming subtask has a 'task' property
								subtasks: [], // Initialize with empty subtasks
							}));

							// Append the converted subtasks to the root tasks
							$tasks = [...$tasks, ...convertedTasks];
						}
					} else {
						// If option is not "CONVERT_SUBTASK_TO_TASK", simply remove the task
						$tasks = $tasks.filter((item) => item.task.id !== id);
					}
				}

				return $tasks;
			});

			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	setContext("handleUpdateTask", handleUpdateTask);
	setContext("handleDeleteTask", handleDeleteTask);
	setContext("handleCreateTask", handleCreateTask);

	function formatDate(date: string | null): string | null {
		return date ? new Date(date).toISOString().split("T")[0] : null;
	}

	function findTaskById(
		items: TaskTreeItem[],
		taskId: string,
	): TaskTreeItem | null {
		for (let item of items) {
			if (item.task.id === taskId) {
				return item;
			} else if (item.subtasks && item.subtasks.length > 0) {
				const found = findTaskById(item.subtasks, taskId);
				if (found) return found;
			}
		}
		return null;
	}

	///////// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent: Component;
	let mainComponent: Component;

	function handleScroll(e) {
		scrollPosition = {
			scrollTop: e.detail.scrollTop,
			scrollLeft: e.detail.scrollLeft,
		};
		mainComponent.updateScrollPosition(scrollPosition);
		sideComponent.updateScrollPosition(scrollPosition);
	}
</script>

<div class="relative w-full h-full">
	<PageTemplete>
		{#snippet nav()}
			<DurationPicker on:update={handleDateUpdate} />
		{/snippet}

		{#snippet side()}
		<div class="flex flex-col w-full h-full px-2 py-2">
			<TaskSide
				on:create={handleCreateTask}
				on:update={handleUpdateTask}
			/>
		</div>
		{/snippet}

		<!-- main: gantt chart -->
		{#snippet main()}
		<div
			class="relative w-full h-full -translate-y-1 no-scrollbar"
		>
			<!-- today position line, gantt chart -->
			<div
				{...$tree}
				class="w-full h-[calc(100%-16px)] max-h-[calc(100%-16px)] font-mono"
			>
				<TaskGantt
					bind:this={mainComponent}
					on:scroll={handleScroll}
					bind:treeItems={$treeItems}
				/>
			</div>

			<div
				{...$tree}
				class="absolute left-0 w-full h-[calc(100%-36px)] max-h-[calc(100%-36px)] top-[70.5px] opacity-[94%]"
			>
				<TaskTree
					bind:treeItems={$treeItems}
					bind:this={sideComponent}
					bind:scrollPosition
					on:scroll={handleScroll}
					on:create={handleCreateTask}
					on:update={handleUpdateTask}
				/>
			</div>

			<table
				class="absolute left-0 flex w-full h-5 font-mono border-2 border-t-0 rounded-b-lg -bottom-2 border-zinc-800"
			>
				<thead>
					<tr>
						<th
							class="w-full border-r border-zinc-500 -translate-y-0.5"
							>Title</th
						>
						<th
							class="w-[120px] border-r border-zinc-500 min-w-[120px] max-w-[120px] -translate-y-0.5"
							>Duration</th
						>
						<th class="w-20 min-w-20 max-w-20 -translate-y-0.5"
							>Progress</th
						>
						<th
							class="w-[15px] min-w-[15px] max-w-[15px] -translate-y-0.5"
						></th>
					</tr>
				</thead>
			</table>
		</div>
		{/snippet}
	</PageTemplete>
</div>
