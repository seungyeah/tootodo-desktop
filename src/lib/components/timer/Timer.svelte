<script lang="ts">
	import { Button } from '$ui';
	import PomoIcon from '$components/PomoIcon.svelte';
	import TimerLayout from './TimerLayout.svelte';
	import {
		ArrowBigUpDash,
		ArrowUp,
		Pause,
		Play,
		Rocket,
		StepBack,
		StepForward
	} from 'lucide-svelte';
	import { currentTime, formatTime, timerOpen, timerSetting } from '$store';
	import Separator from '$ui/separator/separator.svelte';

	export let goalTime = {
		total: 80,
		cycle: 45
	};
	let totalValue = goalTime.total;
	let cycleValue = goalTime.cycle;
	let currentCycle = 2;

	export let duration = 0;
	export let cycle = 0;
	export let remain = 0;
	export let working = 0;
	export let breaking = 0;
	let leftDuration = duration;
	let leftSessionTime = working;
	// timer operate
	let timerPlay = false;
	let workSession = true;

	let records = $timerSetting.cycles;
	$: console.log(records);
</script>

{#if $timerOpen && records}
	<div
		class=" flex h-full w-full items-center justify-between rounded-2xl border-8 border-double border-zinc-50
	bg-zinc-800 text-white shadow-2xl"
	>
		<!-- timer layout -->
		<div
			class="relative m-1 flex aspect-square h-full scale-90 rounded-full bg-zinc-100 p-0 shadow-xl"
		>
			<div class="h-full w-full rounded-full shadow-xl shadow-zinc-950">
				<TimerLayout {workSession} />
			</div>

			<!-- play/stop -->
			<Button
				variant="secondary"
				class="absolute -left-[2.9rem] -top-7 z-50 h-[220px]  w-[220px] translate-x-1/3 translate-y-1/4
		 rounded-full  border-4  border-amber-950 bg-black/20 p-0 shadow-xl hover:bg-black/60"
				on:click={() => {
					timerPlay = !timerPlay;
				}}
			>
				{#if timerPlay}
					<Pause fill="#e4e4e7" color="#e4e4e7" size={44} />
				{:else}
					<Play fill="#e4e4e7" color="#e4e4e7" size={44} />
				{/if}
			</Button>

			<!-- finish -->
			<Button
				variant="ghost"
				class="absolute -left-2 top-0 z-10  px-1 hover:bg-zinc-200 hover:shadow hover:shadow-zinc-50"
				on:click={() => {
					$timerOpen = false;
				}}><StepBack color="#52525b" fill="#52525b" size={32} /></Button
			>

			<!-- next session -->
			<Button
				variant="ghost"
				class="absolute -right-2 bottom-0 z-10  px-1  hover:bg-zinc-200 hover:shadow hover:shadow-zinc-50"
				on:click={() => {
					$timerOpen = false;
				}}><StepForward color="#52525b" fill="#52525b" size={32} /></Button
			>
		</div>

		<!-- progress -->
		<div class="relative flex h-full w-[calc(100%-290px)] flex-col py-3 text-xl">
			<!-- indicator -->
			<ArrowUp class="absolute right-[3.5rem] top-2 " color="#f7d5d8" />
			<Separator orientation="vertical" class="absolute right-[4.2rem] top-4 h-[230px] border border-zinc-400" />
			<ArrowUp class="absolute bottom-4 right-[3.5rem]" color="#f7d5d8" />

			<!-- status -->
			<div
				class="no-scrollbar flex h-full max-h-[calc(100%-20px)] py-1 flex-col-reverse justify-start gap-2.5 overflow-x-clip overflow-y-scroll"
			>
				{#each records as record, i}
					{@const startTime = record.startTime.slice(0, 5)}
					{@const endTime = record.endTime.slice(0, 5)}

					<div class="flex space-x-4 font-digital text-center text-sm p-0 m-0 border-b border-zinc-500 rounded-full">
						<!-- pomo icon -->
						<div
							class={record.done
								? 'relative scale-125 opacity-90'
								: 'relative scale-125 opacity-30'}
						>
							<PomoIcon />
							<div class="absolute right-1 top-1 text-xs">{i + 1}</div>
						</div>

							<!-- start time -->
							<div class={record.done ? ' text-zinc-500' : ' text-zinc-100'}>
								{startTime}
							</div>

							<!-- end time or current time  -->
							{#if i === 0 || (records[i - 1].done === true && record.done === false)}
								<div
									class={workSession
										? 'z-10 -translate-x-0.5 -translate-y-[0.3rem] scale-[115%] rounded-lg border-4 border-dotted bg-zinc-950 px-1.5 py-0.5 text-[1rem] text-pomodoro-500 shadow-xl'
										: 'z-10  -translate-x-0.5 -translate-y-[0.3rem] scale-[115%] rounded-lg border-4 border-dotted bg-zinc-950 px-1.5 py-0.5 text-[1rem] text-emerald-500 shadow-xl'}
								>
									{formatTime($currentTime)}
								</div>
							{:else}
								<div class={record.done ? 'px-3 pb-1 text-zinc-500' : 'px-3 pb-1 text-zinc-100'}>
									{endTime}
								</div>
							{/if}
						</div>
				{/each}
			</div>

			<!-- start, end -->
			<div
				class="font-digital flex h-[22px] w-full -translate-x-1.5  justify-start text-zinc-500"
			>
				<div class="w-[32px]" />
				<div class="w-[60px] text-center font-extrabold">Start</div>
				<div class="w-[20px] text-center font-extrabold"></div>
				<div class=" w-[60px] text-center font-extrabold">End</div>
			</div>
		</div>

		<!-- timer status -->
		<!-- <Button
		on:click={() => {
			timerPlay = !timerPlay;
		}}
		variant="ghost"
		class="w-1/3 h-[80px]  flex-col absolute left-1/2 top-1/2 -translate-x-[78px] -translate-y-[44px] 
		border-4 border-double border-zinc-400  bg-zinc-950 shadow rounded-xl hover:invert "
	>
		<div class="text-[1.7rem] leading-8 font-bold font-digital text-emerald-50">00:{cycleValue}:00</div>
		<div class="text-lg font-bold text-[rgb(5,150,105)]">			
			<div class="font-digital uppercase ">{timerState}</div>
		</div>
	</Button> -->
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<Button
			on:click={() => ($timerOpen = false)}
			class="font-digital text-2xl font-bold text-zinc-900"
		>
			No Record, Back to the Setting
		</Button>
	</div>
{/if}
