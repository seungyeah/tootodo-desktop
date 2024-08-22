<script lang="ts">
	import { Tabs, Button } from "$ui";
	import PageTemplete from "$components/PageTemplete.svelte";
	import {
		endOfMonth,
		getLocalTimeZone,
		startOfWeek,
		today,
	} from "@internationalized/date";
	import {
		WeeklyChat,
		Plan,
		Result,
		ScheduleList,
		ScheduleHeader,
	} from "$components/schedule";
	import Memo from "$components/memo/Memo.svelte";
	import {
		Columns3,
		MessageSquareMore,
		MoonStar,
		Rows3,
		Share,
		Workflow,
	} from "lucide-svelte";
	import { currentTime, formatTime } from "$store";
	import { createTreeView } from "@melt-ui/svelte";

	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import { derived, writable, type Writable } from "svelte/store";
	import { getTaskTreeItems } from "$lib/utils";

	let openSide = true;

	let selectedWeekRange = getContext("selectedWeekRange");
	import { getContext } from "svelte";
	import ScrollArea from "$ui/scroll-area/scroll-area.svelte";
	import Input from "$ui/input/input.svelte";

	export let data;
	$: tasks = data?.tasks.sort(sort_tasks());

	const treeItems = writable(getTaskTreeItems(tasks) || []);
	$: treeItems.set(getTaskTreeItems(tasks));
	setContext("treeItems", treeItems);

	// treeview
	const ctx = createTreeView({
		defaultExpanded: [],
	});

	const {
		elements: { tree },
	} = ctx;

	setContext("tree", ctx);

	const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	$: monday_date =
		$selectedWeekRange.start.day ||
		startOfWeek(today(getLocalTimeZone()), "fr-FR").day;

	function sort_tasks() {
		// duration 기준으로 정렬 (start_date가 빠른 것부터 정렬 -> end_date가 느린것부터 정렬)
		return (a, b) => {
			const diff = new Date(a.start_date) - new Date(b.start_date);
			if (diff === 0) {
				return new Date(b.end_date) - new Date(a.end_date);
			} else {
				return diff;
			}
			11`																								`;
		};
	}

	///////// scroll
	let scrollPosition = { scrollTop: 0, scrollLeft: 0 };
	let planComponent: SvelteComponent;
	let scheduleListComponent: SvelteComponent;

	function handleScroll(e) {
		scrollPosition = {
			scrollTop: e.detail.scrollTop,
			scrollLeft: e.detail.scrollLeft,
		};
		scheduleListComponent.updateScrollPosition(scrollPosition);
		planComponent.updateScrollPosition(scrollPosition);
	}
</script>

<PageTemplete>
	<!-- side: memo -->
	<div
		slot="side"
		class="flex flex-col w-full h-full px-2 py-1 bg-white shadow"
	>
		<div
			class="h-[calc(100%-4px)] w-full py-1.5 border-b-4 border-double border-zinc-400"
		>
			<Memo />
		</div>
	</div>

	<div
		slot="main"
		class="relative flex w-full h-full max-w-full space-x-2 overflow-clip"
	>
		<!-- main: schedule-->
		<div
			{...$tree}
			class="relative flex flex-col pt-1 w-1/3 max-w-[320px] xl:max-w-[400px] min-w-[220px]"
		>
			<ScheduleHeader bind:openSide></ScheduleHeader>

			<div class="flex-col flex border-2 h-[calc(100%-34px)] rounded-lg border-zinc-700">
				<div
					class="rounded-b-lg pr-1 border-b-[2.5px] border-zinc-700 h-[calc(100%-44px)] bg-white"
				>
					<ScheduleList
						treeItems={$treeItems}
						bind:this={scheduleListComponent}
						on:scroll={handleScroll}
					/>
				</div>

				<input
					class="h-10 px-2 py-1 mt-1 w-full rounded-none"
					placeholder="Search & Add Task.."
				/>
			</div>
		</div>

		<div
			class="flex flex-col w-full h-full overflow-auto border-2 no-scrollbar border-zinc-700"
		>
			<!-- weeks -->
			<Tabs.Root
				value={weeks[$currentTime?.getDay() - 1]}
				class="w-full h-full"
			>
				<Tabs.List class="flex w-full border-b-[2.5px] border-zinc-700 ">
					{#each weeks as week, i}
						<Tabs.Trigger
							value={week}
							class="w-20 w-min-20 font-digital"
							disabled={i != $currentTime?.getDay() - 1}
						>
							<span class="mr-1 font-bold">
								{week}
							</span>
							{#if $selectedWeekRange.start.day < $selectedWeekRange.end.day}
								{monday_date + i}
							{:else}
								{endOfMonth($selectedWeekRange.start).day === 31 &&
								monday_date + i > 31
									? monday_date + i - 31
									: endOfMonth($selectedWeekRange.start).day === 30 &&
										  monday_date + i > 30
										? monday_date + i - 30
										: monday_date + i}
							{/if}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</Tabs.Root>

			<!-- schedule -->
			<div class="bg-zinc-100 w-full h-[40px] flex justify-center">
				<Tabs.Root value="plan" class="h-[40px] w-full">
					<Tabs.List class="w-full border-t-[2.5px] border-zinc-700   ">
						<Tabs.Trigger value="plan" class="w-[100px]"
							><Rows3 size={20} class="mr-1.5" />Plan</Tabs.Trigger
						>
						<Tabs.Trigger value="do" class="w-[100px]"
							><MessageSquareMore
								size={20}
								class="mr-1.5"
							/>Do!</Tabs.Trigger
						>
						<Tabs.Trigger value="result" class="w-[100px]"
							><Columns3 size={20} class="mr-1.5" />Result</Tabs.Trigger
						>
					</Tabs.List>

					<Tabs.Content
						{...$tree}
						value="plan"
						class="-translate-y-[calc(100vh-144px)] w-full "
					>
						<div class=" h-[calc(100vh-198px)]">
							<Plan
								treeItems={$treeItems}
								bind:scrollPosition
								bind:this={planComponent}
								on:scroll={handleScroll}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content
						value="do"
						class="-translate-y-[calc(100vh-148px)] h-[calc(100vh-200px)] w-full   "
					>
						<WeeklyChat {tasks} />
					</Tabs.Content>

					<Tabs.Content
						value="result"
						class="-translate-y-[calc(100vh-146px)] h-[calc(100vh-200px)] w-full "
					>
						<Result {tasks} />
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</PageTemplete>
