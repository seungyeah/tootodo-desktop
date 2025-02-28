<!-- @migration-task Error while migrating Svelte code: Cannot subscribe to stores that are not declared at the top level of the component
https://svelte.dev/e/store_invalid_scoped_subscription -->
<!-- @migration-task Error while migrating Svelte code: Cannot subscribe to stores that are not declared at the top level of the component
https://svelte.dev/e/store_invalid_scoped_subscription -->
<script lang="ts">
	import PageTemplete from "$components/PageTemplete.svelte";
	import { type Component, onMount, setContext, tick } from "svelte";
	import HabitMain from "$components/habit/HabitMain.svelte";
	import HabitCreate from "$components/habit/HabitCreate.svelte";
	import HabitSetting from "$components/habit/HabitSetting.svelte";
	import DurationPicker from "$components/habit/DurationPicker.svelte";
	import { goto } from "$app/navigation";
	import { writable, type Writable } from "svelte/store";
	import { postApi, delApi, patchApi } from "$lib/api.js";
	import { type Habit } from "$lib/schema";
	import {
		type DateRange,
		getThisMonthRange,
		parseMonthRangeFromURL,
	} from "$lib/utils";
	import HabitList from "$components/habit/HabitList.svelte";
	import TwoOptTab from "$components/TwoOptTab.svelte";

	let changeMode = $state(false);
	// data
	let data;
	let habits: Writable<Habit[]> = writable(data?.habits || []);
	setContext("habits", habits);

	let statusOption: Writable<String> = writable("InProgress");
	setContext("statusOption", statusOption);

	// duration select
	let initialDateRange = parseMonthRangeFromURL() || getThisMonthRange();
	const selectedMonthRange: Writable<DateRange> = writable(initialDateRange);
	setContext("selectedMonthRange", selectedMonthRange);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (!urlParams.get("start_month") || !urlParams.get("end_month")) {
			setQuery(getThisMonthRange());
		}
	});

	function setQuery(duration) {
		$selectedMonthRange = duration;
		const start_month = $selectedMonthRange.start;
		const end_month = $selectedMonthRange.end;
		const searchParams = new URLSearchParams({ start_month, end_month });
		//console.info(searchParams.toString());
		goto(`?${searchParams.toString()}`);
		//$habits = data?.habits;
	}

	async function handleCreateHabit(e) {
		const { name, icon, color } = e.detail.habit;
		try {
			const res = await postApi({
				path: "/habits/",
				data: { name, icon, color },
			});
			const newHabit = res.data.habit;
			$habits = [newHabit, ...$habits];
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	async function handleDeleteHabit(e) {
		const { id } = e.detail.habit;
		try {
			await delApi({ path: `/habits/${id}` });
			$habits = $habits.filter((habit) => habit.id !== id);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}

	async function handleUpdateHabit({ habit, updateData }) {
		const { id } = habit;

		try {
			const res = await patchApi({
				path: `/habits/${id}`,
				data: updateData,
			});
			const updatedHabit = res.data.habit;

			$habits = $habits.map((habit) =>
				habit.id === updatedHabit.id ? updatedHabit : habit,
			);
			await tick();
		} catch (error) {
			console.error("Request failed:", error);
		}
	}
	setContext("handleUpdateHabit", handleUpdateHabit);
	// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let sideComponent: Component;
	let mainComponent: Component;
	let settingComponent: Component;

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

<PageTemplete {changeMode}>
	<!-- haibt list, create habit -->
	{#snippet main_side()}
		<div
			class="flex flex-col w-1/3 min-w-[320px] h-full"
			bind:clientWidth={sideComponentWidth}
		>
			<div class="flex w-full h-10">
				<DurationPicker update={(newRange) => setQuery(newRange)} />
			</div>
			<!--			<HabitCreate-->
			<!--				bind:this={sideComponent}-->
			<!--				on:scroll={handleScroll}-->
			<!--				on:create={handleCreateHabit}-->
			<!--			/>-->

			<TwoOptTab class="w-full h-full mt-2">
				<!--				TODO: scroll 설정-->
				<!--				<div slot="tab-1" bind:this={sideComponent} onscroll={handleScroll}>-->
				<!--				</div>-->
				{#snippet tab1()}
					<HabitList></HabitList>
				{/snippet}
				{#snippet tab2()}
					<HabitList></HabitList>
				{/snippet}
			</TwoOptTab>
		</div>
	{/snippet}

	<!-- setting -->

	{#snippet options()}
		<div
			class="absolute flex h-full max-h-[calc(100%-130px)] w-6 flex-col"
			style="transform: translate({sideComponentWidth - 22}px, 36px);"
		>
			<HabitSetting
				bind:this={settingComponent}
				on:scroll={handleScroll}
				on:delete={handleDeleteHabit}
			/>
		</div>
	{/snippet}

	<!-- main: gantt chart -->
	{#snippet main()}
		<HabitMain
			bind:this={mainComponent}
			bind:scrollPosition
			on:scroll={handleScroll}
		/>
	{/snippet}
</PageTemplete>
