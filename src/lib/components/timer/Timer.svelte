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
	import { currentTime, formatTime } from '$store';
	import { record } from 'zod';

	export let timerOpen = false;
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

	let records = [
		{ start: '10:30', end: '10:55', done: true, leftTime: 0, studyResult: 20 },
		{ start: '11:00', end: '11:25', done: true, leftTime: 0, studyResult: 10 },
		{ start: '11:30', end: '11:55', done: true, leftTime: 0, studyResult: 20 },
		{ start: '12:00', end: '12:25', done: false, leftTime: 20, studyResult: 0 },
		{ start: '12:30', end: '12:55', done: false, leftTime: 20, studyResult: 0 },
		{ start: '13:00', end: '13:25', done: false, leftTime: 20, studyResult: 0 },
		{ start: '13:30', end: '13:55', done: false, leftTime: 20, studyResult: 0 }
	];
</script>

<div
	class=" flex h-full w-full items-center justify-between rounded-2xl border-8 border-double border-zinc-50
	bg-zinc-800 text-white shadow-2xl"
>
	<!-- timer layout -->
	<div
		class="relative m-1 flex aspect-square h-full scale-90 rounded-full bg-zinc-100 p-0 shadow-xl"
	>
		<div class="h-full w-full rounded-full shadow-xl shadow-zinc-950">
			<TimerLayout {workSession}/>
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
				timerOpen = false;
			}}><StepBack color="#52525b" fill="#52525b" size={32} /></Button
		>

		<!-- next session -->
		<Button
			variant="ghost"
			class="absolute -right-2 bottom-0 z-10  px-1  hover:bg-zinc-200 hover:shadow hover:shadow-zinc-50"
			on:click={() => {
				timerOpen = false;
			}}><StepForward color="#52525b" fill="#52525b" size={32} /></Button
		>
	</div>

	<!-- progress -->
	<div class="flex h-full w-[calc(100%-290px)] flex-col py-3 text-xl">
		<div class="flex h-full space-x-1">
			<!-- pomo icon -->
			<div class="flex h-full flex-col-reverse justify-between">
				{#each records as record}
					<div class={record.done ? 'scale-125 opacity-90' : 'scale-125 opacity-30'}>
						<PomoIcon />
					</div>
				{/each}
			</div>
			<!-- cycle table -->

			<table
				class="font-digital relative flex h-full w-full flex-col-reverse items-end
			justify-between space-x-4 text-center text-sm"
			>
				{#each records as record, i}
					<tr class="w-full">
						<td class="border-b border-r-2 px-2 pb-1">
							<span class={record.done? "text-zinc-500":"text-zinc-100"}>
								{record.start}
							</span>
						</td>
						<td class="border-b px-2 pb-1">
							{#if i != 0 && records[i - 1].done === true && record.done === false}
								<span
									class={workSession
										? 'absolute z-10 -translate-x-1.5 -translate-y-4 scale-125 rounded-lg border-4 border-dotted bg-zinc-950 px-1.5 py-0.5 text-[1rem] text-pomodoro-500 shadow-xl'
										: 'absolute z-10 -translate-x-1.5 -translate-y-4 scale-125 rounded-lg border-4 border-dotted px-1.5 py-0.5 text-[1rem] text-emerald-500 shadow-xl bg-zinc-950'}
								>
									{formatTime($currentTime)}</span
								>
							{:else}
							<span class={record.done? "text-zinc-500":"text-zinc-100"}>
								{record.end}
							</span>
							{/if}
						</td>
					</tr>
				{/each}
				<ArrowUp class="absolute -top-2.5 right-16" />
				<ArrowUp class="absolute bottom-2.5 right-16" />
			</table>
		</div>

		<div class="font-digital flex h-[22px] w-full -translate-x-2 justify-start text-pomodoro-600">
			<div class="w-[32px]" />
			<div class="w-[60px] text-center font-extrabold">Start</div>
			<div class="w-[20px] text-center font-extrabold">-</div>
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
