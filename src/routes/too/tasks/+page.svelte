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

	
	/////// data
	export let data;
	// todo: be 리펙토링 후, events -> tasks로 변경, api경로 수정
	const tasks: Writable<Task[]> = writable(data?.events || []);
	const sortTasks = (a, b) => {
		const diff = new Date(a.start_date) - new Date(b.start_date);
		return diff === 0 ? new Date(b.end_date) - new Date(a.end_date) : diff;
	};
	const sortedTasks = derived(tasks, ($tasks) => [...$tasks].sort(sortTasks));
	setContext("tasks", sortedTasks);
	
	const treeItems = writable(getTreeItems($sortedTasks)||[]);
	$: {
		treeItems.set(getTreeItems($sortedTasks));
	}
	setContext("treeItems", treeItems);

	// treeview
	const ctx = createTreeView({
		// expand all tasks that have subtasks
		//defaultExpanded: $treeItems.map((item) => item.subtasks?.length ? item.task.id: null),
		defaultExpanded:[],
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
		$tasks = await data?.events;
		$treeItems = getTreeItems($tasks);
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedDateRange } = e.detail;
		await setQuery(selectedDateRange);
		$selectedDateRange = selectedDateRange;
	}

	async function handleUpdateTask(e) {
		console.info("update task", e.detail.updateData);
		
		// task가 변경되지 않았을 경우, 무시
		const hasChanged = Object.entries(e.detail.updateData).some(([key, value]) => {
			return !(key in e.detail.task) || e.detail.task[key] !== value;
		});

		if (!hasChanged) {
			console.info("nothing changed");
			return;
		}

		// 변경된 task를 api로 전송
		const { id } = e.detail.task;
		try {
			const res = await patchApi({
				path: `/events/${id}`,
				data: e.detail.updateData,
			});

			// todo: data.task로 변경
			const updatedTask = res.data.event;

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

	async function handleCreateTask(e) {
		if (!e.detail.task) {
			return;
		}
		let formattedTask = {};

		if (e.detail.addBelow) {
			// 선택된 task의 하단에 새로운 task 추가
			const task_before = e.detail.task;
			formattedTask = {
				title: "",
				start_date: task_before.start_date
					? new Date(task_before.start_date).toISOString().split("T")[0]
					: null,
				end_date: task_before.end_date
					? new Date(task_before.end_date).toISOString().split("T")[0]
					: null,
			};
			// subtask를 추가하는 명령을 받을 경우.
			if (e.detail.addChild) {
				formattedTask = {
					...formattedTask,
					parent_id: task_before.id,
				};
			}
		} else {
			// 사용자가 선택한 duration에 새로운 task 추가
			const { title, start_date, end_date } = e.detail.task;
			formattedTask = {
				title,
				start_date: start_date
					? new Date(start_date).toISOString().split("T")[0]
					: null,
				end_date: end_date
					? new Date(end_date).toISOString().split("T")[0]
					: null,
			};
		}

		try {
			const res = await postApi({
				// todo: be 리펙토링 후, events -> tasks로 api경로 수정
				path: "/events/",
				data: formattedTask,
			});
			// todo: data.tasks로 변경
			const newTask = res.data.event;

			$tasks = [...$tasks, newTask];

			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	async function handleDeleteTask(e) {
		const { id } = e.detail.task;
		try {
			await delApi({ path: `/events/${id}` });
			$tasks = $tasks.filter((task) => task.id !== id);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

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
				<th class="w-[120px] border-r border-zinc-500 min-w-[120px] max-w-[120px] -translate-y-0.5"
					>Duration</th
				>
				<th
					class="w-20 min-w-20 max-w-20 -translate-y-0.5"
					>Progress</th
				>
				<th class="w-[15px] min-w-[15px] max-w-[15px] -translate-y-0.5"
				></th>
			</table>
		</div>
	</PageTemplete>
</div>
