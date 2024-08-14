<script lang="ts">
	import PageTemplete from "$components/PageTemplete.svelte";
	import { createTreeView } from "@melt-ui/svelte";

	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import TaskGantt from "$components/task/TaskGanttMain.svelte";
	import TaskSide from "$components/task/TaskSide.svelte";
	import DurationPicker from "$components/task/DurationPicker.svelte";
	import { goto } from "$app/navigation";
	import { derived, writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api.js";
	import { type Task } from "$lib/schema";
	import { type DateRange, getThis3WeeksRange } from "$lib/utils";
	import TaskTree from "$components/task/TaskTree.svelte";
	import type TreeItem from "$lib/components/task/TaskTree.svelte";
    import type { TaskCreationMode } from "$lib/type.js";

	/////// data
	export let data;
	const tasks: Writable<Task[]> = writable(data?.tasks || []);
	const sortTasks = (a, b) => {
		const diff = new Date(a.start_date) - new Date(b.start_date);
		return diff === 0 ? new Date(b.end_date) - new Date(a.end_date) : diff;
	};
	const sortedTasks = derived(tasks, ($tasks) => [...$tasks].sort(sortTasks));
	setContext("tasks", sortedTasks);

	const treeItems = writable(getTreeItems($sortedTasks) || []);
	$: {
		treeItems.set(getTreeItems($sortedTasks));
	}
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

	function getTreeItems(tasks) {
		const itemMap = new Map();
		const rootItems: TreeItem[] = [];

		tasks.forEach((task) => {
			const item = { task, subtasks: [] };
			itemMap.set(task.id, item);

			if (!task.parent_id) {
				rootItems.push(item);
			}
		});

		tasks.forEach((task) => {
			if (task.parent_id) {
				const parentItem = itemMap.get(task.parent_id);
				if (parentItem) {
					parentItem.subtasks.push(itemMap.get(task.id));
				}
			}
		});

		return rootItems;
	}

	///////// duration select
	const selectedDateRange: Writable<DateRange> =
		writable(getThis3WeeksRange());
	setContext("selectedDateRange", selectedDateRange);

	onMount(async () => {
		$selectedDateRange = getThis3WeeksRange();
		await setQuery($selectedDateRange);
	});

	///////// req api
	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		await goto(`?${searchParams.toString()}`);
		$tasks = await data?.tasks;
		$treeItems = getTreeItems($tasks);
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedDateRange } = e.detail;
		await setQuery(selectedDateRange);
		$selectedDateRange = selectedDateRange;
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
		const { id } = task;
		try {
			const res = await patchApi({
				path: `/tasks/${id}`,
				data: updateData,
			});

			const updatedTask = res.data.task;

			tasks.update(($tasks) => {
				const index = $tasks.findIndex((task) => task.id === id);
				if (index !== -1) {
					$tasks[index] = updatedTask;
				}
				return $tasks;
			});

			//console.info("updated")

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

		if (mode === "new") {
			formattedTask = {
				title: task.title,
				start_date: formatDate(task.start_date),
				end_date: formatDate(task.end_date),
			};
		} else {
			formattedTask = {
				title: "",
				start_date: formatDate(task.start_date),
				end_date: formatDate(task.end_date),
			};

			if (mode === "child") {
				formattedTask.parent_id = task.id;
			}
		}

		try {
			const res = await postApi({
				path: "/tasks/",
				data: formattedTask,
			});
			const newTask = res.data.task;

			$tasks = [...$tasks, newTask];

			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	function formatDate(date: string | null): string | null {
		return date ? new Date(date).toISOString().split("T")[0] : null;
	}

	async function handleDeleteTask(task: Task) {
		const { id } = task;
		try {
			await delApi({ path: `/tasks/${id}` });
			$tasks = $tasks.filter((task) => task.id !== id);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	setContext("handleUpdateTask", handleUpdateTask);
	setContext("handleDeleteTask", handleDeleteTask);
	setContext("handleCreateTask", handleCreateTask);

	///////// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent: SvelteComponent;
	let mainComponent: SvelteComponent;

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
		<div slot="nav" class="">
			<DurationPicker on:update={handleDateUpdate} />
		</div>

		<div slot="side" class="flex flex-col w-full h-full px-2 py-2">
			<TaskSide
				bind:this={sideComponent}
				on:scroll={handleScroll}
				on:create={handleCreateTask}
				on:update={handleUpdateTask}
			/>
		</div>

		<!-- main: gantt chart -->
		<div
			slot="main"
			class="relative w-full h-full -translate-y-1 no-scrollbar"
		>
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
				class="absolute left-0 w-full h-[calc(100%-36px)] max-h-[calc(100%-36px)] top-[70.5px] opacity-[89%]"
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
				<th class="w-full border-r border-zinc-500 -translate-y-0.5"
					>Title</th
				>
				<th
					class="w-[120px] border-r border-zinc-500 min-w-[120px] max-w-[120px] -translate-y-0.5"
					>Duration</th
				>
				<th class="w-20 min-w-20 max-w-20 -translate-y-0.5">Progress</th>
				<th class="w-[15px] min-w-[15px] max-w-[15px] -translate-y-0.5"
				></th>
			</table>
		</div>
	</PageTemplete>
</div>
