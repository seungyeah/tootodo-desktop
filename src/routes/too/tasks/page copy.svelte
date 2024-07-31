<script lang="ts">
	import PageTemplete from "$components/PageTemplete.svelte";
	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import TaskMain from "$components/task/TaskGanttMain.svelte";
	import TaskSide from "$components/task/TaskSide.svelte";
	import TaskSetting from "$components/task/TaskSetting.svelte";
	import DurationPicker from "$components/task/DurationPicker.svelte";
	import { goto } from "$app/navigation";
	import {  writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api.js";
	import { type Task } from "$lib/schema";
	import { type DateRange, getThis3WeeksRange } from "$lib/utils";
	import TaskList from "$components/task/TaskList.svelte";
	// data
	export let data;
	// todo: be 리펙토링 후, events -> tasks로 변경, api경로 수정
	let tasks: Writable<Task[]> = writable(
		data?.events.sort(sort_tasks()) || [],
	);

	$: $tasks = $tasks.sort(sort_tasks());
	setContext("tasks", tasks);
	
	// duration select
	const selectedDateRange: Writable<DateRange> =
		writable(getThis3WeeksRange());
	setContext("selectedDateRange", selectedDateRange);


	onMount(async () => {
		$selectedDateRange = getThis3WeeksRange();
		await setQuery($selectedDateRange);
	});

	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		await goto(`?${searchParams.toString()}`);
		$tasks = await data?.events;
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedDateRange } = e.detail;
		await setQuery(selectedDateRange);
		$selectedDateRange = selectedDateRange;
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

	async function handleUpdateTask(e) {
		const { id } = e.detail.task;
		// todo: 기존꺼랑 변화 없으면 냅둬.
		try {
			const res = await patchApi({
				path: `/events/${id}`,
				data: e.detail.updateData,
			});
			
			// todo: data.task로 변경
			const updatedTask = res.data.event;

			$tasks = $tasks.map((task) =>
				task.id === updatedTask.id ? updatedTask : task,
			);

			if (e.detail.updateData.start_date || e.detail.updateData.end_date) {
				$tasks.sort(sort_tasks());
			}
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	function sort_tasks() {
		// duration 기준으로 정렬 (start_date가 빠른 것부터 정렬 -> end_date가 느린것부터 정렬)
		return (a, b) => {
			const diff = new Date(a.start_date) - new Date(b.start_date);
			if (diff === 0) {
				return new Date(b.end_date) - new Date(a.end_date);
			} else {
				return diff;
			}
		};
	}

	// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent: SvelteComponent;
	let mainComponent: SvelteComponent;
	let settingComponent: SvelteComponent;

	function handleScroll(e) {
		scrollPosition = {
			scrollTop: e.detail.scrollTop,
			scrollLeft: e.detail.scrollLeft,
		};
		mainComponent.updateScrollPosition(scrollPosition);
		sideComponent.updateScrollPosition(scrollPosition);
		settingComponent.updateScrollPosition(scrollPosition);
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

		<!-- setting -->
		<!-- <div
			slot="options"
			class="absolute flex h-full max-h-[calc(100%-140px)] w-6 flex-col"
			style="transform: translate({sideComponentWidth - 10}px, 24px);"
		>
			<TaskSetting
				bind:this={settingComponent}
				on:scroll={handleScroll}
				on:delete={handleDeleteTask}
				on:update={handleUpdateTask}
				on:create={handleCreateTask}
			/>
		</div> -->

		<!-- main: gantt chart -->
		<div
			slot="main"
			class="relative w-full h-full -translate-y-1 no-scrollbar "
		>
			<div
				class="z-10 absolute -left-4 flex h-[calc(100%-90px)] max-h-[calc(100%-90px)] top-[74px] w-6 flex-col"
			>
				<TaskSetting
					bind:this={settingComponent}
					on:scroll={handleScroll}
					on:delete={handleDeleteTask}
					on:update={handleUpdateTask}
					on:create={handleCreateTask}
				/>
			</div>

			<div class="w-full h-[calc(100%-16px)] max-h-[calc(100%-16px)] font-mono ">
				<TaskMain bind:this={mainComponent} on:scroll={handleScroll} />
			</div>

			<div
				class="absolute left-0 w-full h-[calc(100%-36px)] max-h-[calc(100%-36px)] top-[70px] opacity-90"
			>
				<TaskList
					bind:this={sideComponent}
					bind:scrollPosition
					on:scroll={handleScroll}
					on:create={handleCreateTask}
					on:update={handleUpdateTask}
				/>
			</div>

			<table
				class="absolute left-0 flex w-full font-mono border-2 border-t-0 rounded-b-lg -bottom-2 border-zinc-800"
			>
				<th class=" w-[30px] border-r border-zinc-500">#</th>
				<th class="w-[140px] border-r border-zinc-500">Progress</th>
				<th class="w-full border-r border-zinc-500">Title</th>
				<th class="w-[180px]">Duration</th>
				<th class="w-[20px]"></th>
			</table>
		</div>
	</PageTemplete>
</div>
