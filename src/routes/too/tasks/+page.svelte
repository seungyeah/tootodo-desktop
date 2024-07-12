<script lang="ts">
	import PageTemplete from "../PageTemplete.svelte";
	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import TaskMain from "$components/task/TaskMain.svelte";
	import TaskSide from "$components/task/TaskSide.svelte";
	import TaskSetting from "$components/task/TaskSetting.svelte";
	import DurationPicker from "$components/task/DurationPicker.svelte";
	import { goto} from "$app/navigation";
	import { writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api";
	import {type Task } from "$lib/schema";
	import { type DateRange ,getThis3WeeksRange} from "$lib/utils";
	// data
	export let data;
	// todo: be 리펙토링 후, events -> tasks로 변경, api경로 수정
	let tasks: Writable<Task[]> = writable(data?.events || []);
	
	// duration select
	const selectedDateRange:Writable<DateRange> = writable(getThis3WeeksRange());
	setContext("selectedDateRange", selectedDateRange);
	setContext("tasks", tasks);

	onMount(async () => {
		$selectedDateRange =getThis3WeeksRange();
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
		const { title, start_date, end_date } = e.detail.task;
		const formattedTask = {
			title,
			start_date: start_date
				? new Date(start_date).toISOString().split("T")[0]
				: null,
			end_date: end_date
				? new Date(end_date).toISOString().split("T")[0]
				: null,
		};
		try {
			const res = await postApi({
				path: "/tasks/",
				data: formattedTask,
			});
			const newTask = res.data.task;
			$tasks = [ ...$tasks, newTask ];
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
		const {id} = e.detail.task;
		
		try {
			const res = await patchApi({ path: `/events/${id}`, data:e.detail.updateData });
			const updatedTask = res.data.task;
			
			$tasks = $tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
			);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
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

	// get setting component's x position
	let sideComponentWidth = 0;
	onMount(async () => {
		if (sideComponent) {
			sideComponentWidth = sideComponent.clientWidth;
			await tick().then(() => {
				sideComponentWidth = sideComponent.clientWidth;
			});
		}
	});
</script>

<div class="relative w-full h-full">
	<PageTemplete>
		<div slot="nav" class="">
			<DurationPicker on:update={handleDateUpdate} />
		</div>

		<div
			slot="side"
			class="flex flex-col w-full h-full px-2 py-2"
			bind:clientWidth={sideComponentWidth}
		>
			<TaskSide
				bind:this={sideComponent}
				on:scroll={handleScroll}
				on:create={handleCreateTask}
				on:update={handleUpdateTask}
			/>
		</div>

		<!-- setting -->
		<div
			slot="options"
			class="absolute flex h-full max-h-[calc(100%-130px)] w-6 flex-col"
			style="transform: translate({sideComponentWidth - 22}px, 34px);"
		>
			<TaskSetting
				bind:this={settingComponent}
				on:scroll={handleScroll}
				on:delete={handleDeleteTask}
				on:update={handleUpdateTask}
			/>
		</div>

		<!-- main: gantt chart -->
		<div slot="main" class="w-full h-full">
			<TaskMain
				bind:this={mainComponent}
				bind:scrollPosition
				on:scroll={handleScroll}
			/>
		</div>
	</PageTemplete>
</div>
