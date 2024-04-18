<script>
	import { Button } from '$ui';
	import { Milestone } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import PomoIcon from '$components/PomoIcon.svelte';

	export let timerOpen = false;
	export let record = { start: '', end: '' };

	let tooltip = ''; // Tooltip text
	let working = 25;
	let breaking = 5;
	let cycle = 1;
	let remain = 0;
	let duration = 0;
	let durationString = '';

	onMount(() => {
		if (record) {
			tooltip = `---  ${record.start} ~ ${record.end} ---`;
			calculateDuration();
		}
	});

	function calculateDuration() {
		let [startHour, startMin] = record.start.split(':').map(Number);
		let [endHour, endMin] = record.end.split(':').map(Number);
		if (endMin < startMin) {
			endMin += 60;
			endHour -= 1;
		}
		let hours = endHour - startHour;
		let minutes = endMin - startMin;
		duration = hours * 60 + minutes;
		if (hours == 0) durationString = `${minutes}M`;
		else durationString = `${hours}H ${minutes}M`;
		updateCycleAndRemain();
	}

	function updateCycleAndRemain() {
		if (duration > 0 && working + breaking > 0) {
			if (working + breaking <= duration) {
				cycle = Math.floor(duration / (working + breaking));
				remain = duration % (working + breaking);
			} else {
				working = 0;
				breaking = 0;
				cycle = 0;
				remain = duration;
			}
		}
	}
</script>

<div class="z-20 w-[220px] flex-col items-center justify-center space-y-1 bg-zinc-800 p-2 text-white shadow-lg">
	<div class="font-digital text-center w-full">{tooltip}</div>
	<div class="flex-col space-y-2 border-2 border-dotted border-white px-1 py-2">
		<!-- working time control  -->
		<div class="flex justify-center space-x-2">
			<span class="leading-8 text-rose-200">working</span>			
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-white px-2 py-1"
			>
				<button
					class="text-center text-2xl text-zinc-500 hover:text-zinc-700"
					on:click={() => {
						if (working > 10) {
							working -= 5;
							updateCycleAndRemain();
						}
					}}
				>
					-
				</button>
				<input
					type="number"
					class="w-12 text-center text-xl font-semibold text-zinc-900"
					disabled
					bind:value={working}
					min={10}
					max={duration}
				/>
				<button
					class="text-center text-2xl text-zinc-500 hover:text-zinc-700"
					on:click={() => {
						if (working < duration && working >= 10) {
							working += 5;
							if (working === duration) working = duration;
							else updateCycleAndRemain();
						}
					}}
				>
					+
				</button>
			</div>
		</div>

		<!-- breaking time control -->
		<div class="flex w-full justify-center space-x-2">
			<span class="leading-8 text-violet-200">breaking</span>
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-white px-2 py-1"
			>
				<button
					class="text-center text-2xl text-zinc-500 hover:text-zinc-700"
					on:click={() => {
						if (breaking > 0) {
							breaking -= 1;
							updateCycleAndRemain();
						} else {
							breaking = 0;
						}
					}}
				>
					-
				</button>
				<input
					type="number"
					disabled
					class="w-12 text-center text-xl font-semibold text-zinc-900"
					bind:value={breaking}
					min={0}
					max={20}
				/>
				<button
					class="text-center text-2xl text-zinc-500 hover:text-zinc-700"
					on:click={() => {
						if (breaking <= 0) {
							breaking = 0;
							return;
						}
						if (breaking < 20) {
							breaking += 1;
							updateCycleAndRemain();
						} else {
							breaking = 20;
						}
					}}
				>
					+
				</button>
			</div>
		</div>
	</div>

	<!-- check duration, -> start timer button -->
	<div class="m-1 flex space-x-2 relative">
		<div class="font-digital  flex-col">
			<Milestone class="absolute"/>
			<div class="text-end w-full">{durationString}</div>			
			<div class="w-full text-center text-lg">
				(<span class="text-rose-200">{working}</span>+<span class="text-violet-200">{breaking}</span
				>)*{cycle}+<span class="text-blue-200">{remain}</span>
			</div>
		</div>
		<Button
			variant="outline"
			class="absolute -top-1.5  right-0 m-2 px-2 h-12 w-18 text-2xl font-bold font-digital text-black "
			on:click={() => (timerOpen = !timerOpen)}>D<PomoIcon />!</Button
		>
	</div>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
