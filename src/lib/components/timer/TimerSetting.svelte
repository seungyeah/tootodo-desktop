<script>
    	import { Button, Input, } from '$ui';
        export let timerOpen = false;

	let tooltip = ''; // Tooltip text
	let tooltipVisible = false; // Tooltip visibility flag
	let tooltipX = 0; // Tooltip X position
	let tooltipY = 0; // Tooltip Y position
    let working = 25;
	let breaking = 5;
	let cycle = 1;
	let remain = 0;
	let duration = 0;
	let durationString = '';

    function getRemainAndCycle() {
		remain = duration % (working + breaking);
		cycle = Math.floor(duration / (working + breaking));
	}

    function showTooltip(event, record) {
		if (record) {
			tooltipVisible = true;
			tooltip = `start: ${record.start}, end: ${record.end}`;
			let [startHour, startMin] = record.start.split(':').map(Number);
			let [endHour, endMin] = record.end.split(':').map(Number);
			let min = endMin - startMin;
			if (min < 0) {
				min += 60;
				endHour -= 1;
			}
			let hour = endHour - startHour;
			duration = hour * 60 + min;
			if (working > duration) {
				working = duration;
				breaking = 0;
			}
			durationString = `${hour}H ${min}M`;
			getRemainAndCycle();
		} else {
			tooltip = '';
			tooltipVisible = false;
		}
		tooltipX = event.clientX - 670; // Get the mouse X position
		tooltipY = event.clientY - 30; // Get the mouse Y position
		event.stopPropagation();
	}
</script>

{#if tooltipVisible}
<div
	class="custom-tooltip w-[220px] flex-col space-y-1 p-2 shadow-lg"
    style="position: fixed; left: {tooltipX}px; top: {tooltipY}px;"
>
	<span class="font-digital mx-2">{tooltip}</span>
	<div class="flex-col space-y-2 border-2 border-dotted border-white px-1 py-2">
		<div class="flex justify-center space-x-2">
			<span class="leading-8 text-rose-200">working</span>
			<Input
				type="number"
				class="w-1/2 translate-x-0.5 text-black"
				bind:value={working}
				step={5}
				min={10}
				max={duration}
				on:change={() => {
					if (working >= duration) {
						breaking = 0;
						remain = 0;
						cycle = 1;
					}
					getRemainAndCycle();
				}}
			/>
		</div>
		<div class="flex w-full justify-center space-x-2">
			<span class="leading-8 text-violet-200">breaking</span>
			<Input
				type="number"
				disabled={working + breaking >= duration}
				class="w-1/2 text-black"
				bind:value={breaking}
				min={0}
				max={20}
				on:change={() => {
					if (working + breaking >= duration) {
						remain = 0;
						cycle = 1;
					}
					getRemainAndCycle();
				}}
			/>
		</div>
	</div>
	<div class="font-digital relative flex-col">
		<div>duration: {durationString}</div>
		<Milestone class="absolute" />
		<div class="w-full translate-x-2 text-center text-lg">
			(<span class="text-rose-200">{working}</span>+<span class="text-violet-200">{breaking}</span
			>)*{cycle}+<span class="text-blue-200">{remain}</span>
		</div>
	</div>
	<div class="m-1 flex space-x-2">
		<Button
			variant="outline"
			class="my-1 w-full text-center text-lg font-bold text-black"
			on:click={() => (timerOpen = !timerOpen)}>Do!</Button
		>
		<Button
			variant="ghost"
			class="my-1 border border-pink-500"
			on:click={() => (tooltipVisible = false)}><X /></Button
		>
	</div>
</div>
{/if}

<style>
	.custom-tooltip {
		position: fixed;
		padding: 4px 8px;
		background-color: #3f3f46;
		color: white;
		border-radius: 10px;
		pointer-events: auto;
		z-index: 1000; /* Make sure the tooltip is above other elements */
		white-space: nowrap;
	}

	.custom-tooltip ::before {
		content: '';
		position: absolute;
		display: block;
		width: 0px;
		left: 50%;
		top: 0;
		border: 10px solid transparent;
		border-top: 0;
		border-bottom: 10px solid #3f3f46;
		transform: translate(100%, calc(-100% - 0px));
	}
</style>