<script lang="ts">
	import { Button } from '$ui';
	import PomoIcon from './PomoIcon.svelte';
	import TimerLayout from './TimerLayout.svelte';
	import { StepBack, StepForward } from 'lucide-svelte';

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
</script>

<div class="relative h-full w-full">
	<TimerLayout {leftSessionTime} {leftDuration} />

	<Button
		variant="ghost"
		class="absolute top-0 left-0 z-10 text-lg"
		on:click={() => {
			timerOpen = false;
		}}><StepBack/>Back</Button
	>
	<Button
		variant="ghost"
		class="absolute bottom-0 right-0 z-10 text-lg"
		on:click={() => {
			timerOpen = false;
		}}>Next Session <StepForward/></Button
	>
	<Button
		on:click={() => {
			timerWork = !timerWork;
		}}
		class="w-1/2 flex-col absolute left-1/2 top-1/2 -translate-x-[120px] -translate-y-[50px] 
		border-4 border-double border-violet-900  bg-white shadow opacity-90"
	>
		<div class="text-[1.7rem] leading-8 font-bold font-digital text-violet-950">00:{cycleValue}:00</div>
		<hr class="border-2 w-full bg-violet-950" />
		<div class="text-3xl font-bold relative w-full text-rose-950">
			<div class="absolute top-1 -left-1 w-full text-xl flex text-rose-900">
				<PomoIcon />{currentCycle}
			</div>
			<div class="font-digital uppercase translate-x-4">{timerState}</div>
		</div>
	</Button>
</div>
