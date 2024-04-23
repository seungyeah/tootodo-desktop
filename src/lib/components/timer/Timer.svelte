<script lang="ts">
	import { Button } from '$ui';
	import PomoIcon from '$components/PomoIcon.svelte';
	import TimerLayout from './TimerLayout.svelte';
	import { Pause, Play, StepBack, StepForward } from 'lucide-svelte';
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
	let timerState = 'working';

	export let duration = 0;
	export let cycle = 0;
	export let remain = 0;
	export let working = 0;
	export let breaking = 0;
	let leftDuration = duration;
	let leftSessionTime = working;
	// timer operate
	let timerWork = false;

	let records = [
		{ start: '10:30', end: '10:55', done: true, leftTime: 0, studyResult: 20 },
		{ start: '11:00', end: '11:25', done: true, leftTime: 0, studyResult: 10 },
		{ start: '11:30', end: '11:55', done: true, leftTime: 0, studyResult: 20 },
		{ start: '12:00', end: '12:25', done: false, leftTime: 20, studyResult: 0 },
		{ start: '12:30', end: '12:55', done: false, leftTime: 20, studyResult: 0 },
		{ start: '13:00', end: '13:25', done: false, leftTime: 20, studyResult: 0 },
		{ start: '13:30', end: '13:55', done: false, leftTime: 20, studyResult: 0 },
	];
</script>

<div class="relative flex h-full w-full items-center justify-between text-white">
	<div class="aspect-ratio absolute h-full w-2/3 bg-zinc-50 rounded-full">
		<div class="h-full w-full ">
			<TimerLayout />
		</div>

		<!-- play/stop -->
		<Button variant="secondary" class="absolute left-1/3 top-1/3 z-50 border-4 border-emerald-950
		 rounded-full w-14 h-14 p-0 translate-x-1/3 translate-y-1/4 bg-zinc-50 opacity-90"
			on:click={() => {
				timerWork = !timerWork;
			}}
		>
			{#if timerWork}
				<Pause fill="#022c22" color="#064e3b" size={32}/>
			{:else}
				<Play fill="#022c22" color="#064e3b" size={32}/>
			{/if}
		</Button>

		<!-- finish -->
		<Button
			variant="ghost"
			class="absolute left-0 top-0 z-10  px-2 text-lg"
			on:click={() => {
				timerOpen = false;
			}}><StepBack color="#09090b" fill="#09090b"/></Button
		>

		<!-- next session -->
		<Button
			variant="ghost"
			class="absolute bottom-0 right-0 z-10  px-2 text-lg"
			on:click={() => {
				timerOpen = false;
			}}><StepForward color="#09090b" fill="#09090b" /></Button
		>
	</div>

	<!-- progress -->
	<div class="absolute right-0 h-full w-1/4 -translate-x-4 text-xl">
		<div class="flex h-[calc(100%-24px)] flex-col-reverse justify-between">
			{#each records as record}
				<div class={record.done ? 'scale-125 opacity-80' : 'scale-125 opacity-10'}>
					<PomoIcon />
				</div>
			{/each}
		</div>

		<div
			class="h-full w-full"
		>			
			<table class="font-digital absolute -right-4 top-0 h-[calc(100%-24px)] w-full flex flex-col-reverse justify-between items-end
			space-x-4 text-center text-sm text-zinc-700">
				{#each records as record, i}
					<tr class="w-full border-b">
						<td class="border-r-2 px-2 pb-1">{record.start}</td>
						<td class="px-2 pb-1">
							{#if i != 0 && records[i - 1].done === true && record.done === false}
								<span class="absolute -translate-y-3.5 -translate-x-3 z-10 scale-110 px-1.5 py-0.5
								text-pomodoro-500 text-[1rem] shadow-xl  border-emerald-950 rounded-lg bg-white border-r-2 border-t-2  ">
								{formatTime($currentTime)}</span>
							{:else}
								{record.end}
							{/if}
						</td>
					</tr>
				{/each}
			</table>

			<div class="flex translate-x-7 translate-y-1 w-full text-lg text-zinc-800 ">
				<div class=" w-full  font-extrabold ">Start</div>
				<div class="w-full  font-extrabold">End</div>
			</div>
		</div>
	</div>

	<!-- timer status -->
	<!-- <Button
		on:click={() => {
			timerWork = !timerWork;
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
