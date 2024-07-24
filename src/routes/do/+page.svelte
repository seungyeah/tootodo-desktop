<script lang="ts">
	import { Separator, Switch, Label, Button, Tabs, ContextMenu } from "$ui";
	import TenMResult from "$components/tenMTable/tenMResult.svelte";
	import PageTemplete from "$components/PageTemplete.svelte";
	import {
		endOfMonth,
		getLocalTimeZone,
		startOfWeek,
		today,
	} from "@internationalized/date";
	import { WeeklyChat, Plan } from "$components/schedule";
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

	let openSide = true;

	let selectedWeekRange = getContext("selectedWeekRange");
	let Stars = new Array(5).fill(0);
	import { Star } from "lucide-svelte";
	import { getContext } from "svelte";

	$: currentTimeDisplay = formatTime($currentTime);

	export let data;
	$: tasks = data?.events.sort(sort_tasks());

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
		};
	}
</script>

<PageTemplete>
	<!-- side: memo -->
	<div
		slot="side"
		class="flex flex-col w-full h-full px-2 py-2 bg-white shadow"
	>
		<div class="w-full text-lg font-bold text-center">Memo</div>
		<div class="side-container">
			<Memo />
		</div>
	</div>

	<div
		slot="main"
		class="relative flex w-full h-full max-w-full space-x-2 overflow-clip"
	>
		<!-- main: schedule-->
		<div
			class="flex flex-col w-1/3 max-w-[220px] xl:max-w-[300px] min-w-[190px]"
		>
			<div class="flex justify-between mb-1 mr-1.5 text-lg font-digital">
				<button
					on:click={() => (openSide = !openSide)}
					class="rounded-full z-[1] h-[30px] flex"
				>
					<MoonStar fill="black" />
					{currentTimeDisplay}
				</button>

				<div class="flex space-x-1">
					<Button
						variant="ghost"
						class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
				hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
					>
						<Workflow strokeWidth={2.5} size={16} />
					</Button>
					<Button
						variant="ghost"
						class="shadow z-[1] h-[30px] px-2 py-0 -translate-y-0.5 translate-x-1 hover:bg-transparent 
			hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-1 rounded-full"
					>
						<Share strokeWidth={2.5} size={16} />
					</Button>
				</div>
			</div>

			<div
				class="h-[calc(100%-30px)] overflow-y-auto overflow-x-clip no-scrollbar rounded-lg border-2 border-zinc-700"
			>
				{#each tasks as task, i}
					<div class="flex flex-col h-[45px] border my-1 mx-2">
						<div class="">{task.title}</div>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="flex flex-col w-full h-full border-2 overflow-clip border-zinc-700"
		>
			<!-- weeks -->
			<Tabs.Root
				value={weeks[$currentTime?.getDay() - 1]}
				class="w-full h-full"
			>
				<Tabs.List class="flex w-full ">
					{#each weeks as week, i}
						<Tabs.Trigger
							value={week}
							class="w-1/4 font-digital"
							disabled={i != $currentTime?.getDay() - 1}
						>
							<span class="mr-2 font-bold">
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
				<Tabs.Root value="result" class="h-[40px] w-full" let:value>
					<Tabs.List class="w-full">
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
						value="plan"
						class="-translate-y-[calc(100vh-146px)] h-[calc(100vh-200px)] w-full   "
					>
						<Plan />
					</Tabs.Content>

					<Tabs.Content
						value="do"
						class="-translate-y-[calc(100vh-146px)] h-[calc(100vh-200px)] w-full   "
					>
						<WeeklyChat />
					</Tabs.Content>

					<Tabs.Content
						value="result"
						class="-translate-y-[calc(100vh-146px)] h-[calc(100vh-200px)] w-full   "
					>
						<div class="flex w-full h-full space-x-1.5">
							{#each weeks as _, i}
								<div
									class="flex flex-col w-full h-full rounded-b-lg shadow"
								>
									<div
										class="flex flex-col justify-between w-full h-1/3"
									>
										<div
											class="w-full translate-x-3.5 -translate-y-1"
										>
											{#each Stars as star, i}
												<button
													class="absolute top-0 left-0 py-1 pt-2 hover:bg-none"
													style="transform:translateX({i * 18}px)"
													on:click={() => {
														Stars = Stars.map((_, j) => j <= i);
													}}
												>
													<Star
														size={14}
														fill={star ? "#fde047" : "white"}
													/>
												</button>
											{/each}
										</div>

										<div
											class="bg-zinc-50 font-digital text-zinc-800 title h-[20px] text-center font-bold"
										>
											05H 30M
										</div>
									</div>
									<!-- tenM planner -->
									<div
										class="relative w-full overflow-y-auto rounded-lg shadow h-2/3 overflow-x-clip no-scrollbar"
									>
										{#if i == $currentTime?.getDay() - 1}
											<div
												class="absolute z-10 flex flex-col justify-between h-[calc(100%-22px)] translate-y-5"
											>
												{#each Array.from({ length: 24 }, (_, i) => i) as hour}
													<div
														class="px-1 py-0 text-center font-semibold text-[0.6rem] leading-3"
													>
														{hour}
													</div>
												{/each}
											</div>
										{/if}

										<div class="absolute top-0 left-0 w-full h-full">
											<TenMResult />
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</PageTemplete>

<style>
	.side-container {
		@apply h-[calc(100%-30px)] w-full py-1.5 border-b-4 border-double border-zinc-900;
	}
</style>
