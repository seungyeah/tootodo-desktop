<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input } from '$ui';
	import Timer from '$components/timer/Timer.svelte';
	import { X, Milestone } from 'lucide-svelte';

	// timer
	export let timerOpen = false;

	let records = [
		{ start: '9:20', end: '9:50', dragged: true },
		{ start: '10:20', end: '11:40', dragged: true },
		{ start: '12:10', end: '13:30', dragged: true } // Add a record with the 'dragged' property
	];
	const amHours = Array.from({ length: 12 }, (_, i) => i);
	const pmHours = Array.from({ length: 12 }, (_, i) => i + 12);

	const columns = [0, 10, 20, 30, 40, 50]; // 10-minute intervals
	import { currentTime, formatTime } from '$store';

	$: currentTimeDisplay = formatTime($currentTime);
	let isAM = new Date().getHours() < 12;

	// Convert a time string to minutes since midnight
	function timeToMinutes(time) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
	// Initialize cell colors
	let cellColors = Array.from({ length: 24 }, () => [
		Array.from({ length: 6 }, () => ({ colorFill: 0, record: null }))
	]);

	onMount(() => {
		cellColors = getCellColor();
	});

	function getCellColor() {
		for (let record of records) {
			let [startHour, startMin] = record.start.split(':').map(Number);
			let [endHour, endMin] = record.end.split(':').map(Number);
			startMin = Math.floor(startMin / 10);
			endMin = Math.floor(endMin / 10);
			// console.log(startHour, startMin, endHour, endMin);
			if (startHour === endHour) {
				for (let j = startMin; j <= endMin - 1; j++) {
					cellColors[startHour][0][j] = { colorFill: 1, record };
				}
				continue;
			}
			for (let i = startHour; i <= endHour; i++) {
				if (i === startHour) {
					for (let j = startMin; j < 6; j++) {
						cellColors[i][0][j] = { colorFill: 1, record };
					}
				} else if (i === endHour) {
					for (let j = 0; j <= endMin - 1; j++) {
						cellColors[i][0][j] = { colorFill: 1, record };
					}
				} else {
					for (let j = 0; j < 6; j++) {
						cellColors[i][0][j] = { colorFill: 1, record };
					}
				}
			}
		}

		return cellColors;
	}

	// Dragging
	let dragging = false;
	let dragStartHour = null;
	let dragStartColumn = null;
	let dragEndHour = null;
	let dragEndColumn = null;
	// Handle the mouse down event
	function handleMouseDown(hour, column, event, record) {
		if (record) return;
		dragging = true;
		dragStartHour = hour;
		dragStartColumn = column;
		dragEndHour = hour;
		dragEndColumn = column;
		console.log('dragging');
		event.preventDefault(); // Prevent text selection
		event.stopPropagation(); // Prevent the event from bubbling up to the table
	}

	// Handle the mouse up event
	function handleMouseUp(hour, column) {
		if (dragging) {
			// Adjust the end time if dragging ended in the next hour's first column
			if (column === 0 && hour > dragStartHour) {
				column = 60;
				hour--;
			}

			if (dragStartHour === hour && column - dragStartColumn < 10) {
				// Reset dragging state
				dragging = false;
				// console.log('dragging canceled')
				dragEndHour = null;
				dragEndColumn = null;
				cellColors[hour][0][column / 10].colorFill = 0;
				return;
			}
			const startMinute = dragStartColumn;
			const endMinute = column === 50 ? 0 : column + 10;
			const startHour = dragStartHour;
			const endHour = column === 50 ? hour + 1 : hour;

			// Calculate the duration of the drag in minutes
			const startTime = startHour * 60 + startMinute;
			const endTime = endHour * 60 + endMinute;

			const newRecord = {
				start: `${startHour}:${startMinute.toString().padStart(2, '0')}`,
				end: `${endHour}:${endMinute.toString().padStart(2, '0')}`,
				dragged: true // Indicate this record was added by dragging
			};
			records = [...records, newRecord];
			cellColors = getCellColor();
			console.log('Added new record:', newRecord);

			// Reset dragging state
			dragging = false;
			dragEndHour = null;
			dragEndColumn = null;
		}
	}

	// Handle the mouse enter event for real-time feedback
	function handleMouseMove(hour, columnIdx) {
		if (dragging) {
			dragEndHour = hour;
			dragEndColumn = columnIdx;
			cellColors[dragEndHour][0][dragEndColumn].colorFill = 1;
		}
	}

	// timer
	let working = 25;
	let breaking = 5;
	let cycle = 1;
	let remain = 0;
	let duration = 0;
	let durationString = '';

	// tooltip
	let tooltip = ''; // Tooltip text
	let tooltipVisible = false; // Tooltip visibility flag
	let tooltipX = 0; // Tooltip X position
	let tooltipY = 0; // Tooltip Y position
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
		tooltipX = event.clientX - 160; // Get the mouse X position
		tooltipY = event.clientY + 5; // Get the mouse Y position
		event.stopPropagation();
	}
	function getRemainAndCycle() {
		remain = duration % (working + breaking);
		cycle = Math.floor(duration / (working + breaking));
	}
	// $:console.log(timerOpen);
</script>

{#if timerOpen}
	<Timer bind:timerOpen {duration} {working} {breaking} {cycle} {remain} />
{:else}
	<div class="relative m-auto h-full w-full flex-col border-4">
		<div class="m-2 flex justify-around">
			<!-- AM -->
			<div class="flex-col">
				<div class="w-full text-center text-xl font-bold" class:active={isAM}>AM</div>
				<table class="h-[450px]">
					<tr>
						<th></th>
						{#each columns as column}
							<th>{column + 10}</th>
						{/each}
					</tr>
					{#each amHours as hour, index}
						<tr>
							<th rowspan="2">{hour}</th>
							{#each columns as column, columnIndex}
								{#key cellColors}
									<td
										class="!py-[0.7rem]"
										class:colored={cellColors[hour][0][columnIndex].colorFill}
										on:mouseover={(event) =>
											showTooltip(event, cellColors[hour][0][columnIndex].record)}
										on:mousedown={(event) =>
											handleMouseDown(hour, column, event, cellColors[hour][0][columnIndex].record)}
										on:mouseup={() => handleMouseUp(hour, column)}
										on:mousemove={(e) => handleMouseMove(hour, columnIndex)}
									></td>
								{/key}
							{/each}
						</tr>
						<tr>
							{#each columns as column, columnIndex}
								<td class="!border-0"></td> <!-- 이 부분은 비어있는 하단 셀을 나타냅니다 -->
							{/each}
						</tr>
					{/each}
				</table>
			</div>

			<!-- PM -->
			<div class="flex-col">
				<div class="block w-full text-center text-xl font-bold" class:active={!isAM}>PM</div>
				<table class="h-[450px]">
					<tr>
						<th></th>
						{#each columns as column}
							<th>{column + 10}</th>
						{/each}
					</tr>
					{#each pmHours as hour, index}
						<tr>
							<th rowspan="2">{hour}</th>
							{#each columns as column, columnIndex}
								{#key cellColors}
									<td
										class="!py-[0.7rem]"
										class:colored={cellColors[hour][0][columnIndex].colorFill}
										on:mouseover={(event) =>
											showTooltip(event, cellColors[hour][0][columnIndex].record)}
										on:mousedown={(event) =>
											handleMouseDown(hour, column, event, cellColors[hour][0][columnIndex].record)}
										on:mouseup={() => handleMouseUp(hour, column)}
										on:mousemove={(e) => handleMouseMove(hour, columnIndex)}
									></td>
								{/key}
							{/each}
						</tr>
						<tr>
							{#each columns as column, columnIndex}
								<td class="!border-0"></td> <!-- 이 부분은 비어있는 하단 셀을 나타냅니다 -->
							{/each}
						</tr>
					{/each}
				</table>
			</div>

			<!-- tooltip => check druation -> set working/breaking -> start timer -->
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
							(<span class="text-rose-200">{working}</span>+<span class="text-violet-200"
								>{breaking}</span
							>)*{cycle}+<span class="text-blue-200">{remain}</span>
						</div>
					</div>
					<div class="m-1 flex space-x-2">
						<Button
							variant="outline"
							class="my-1 w-full font-bold text-lg text-black text-center"
							on:click={() => (timerOpen = !timerOpen)}>Do!</Button
						>
						<Button variant="ghost" class="my-1 border border-pink-500" on:click={() => (tooltipVisible = false)}
							><X /></Button
						>
					</div>
				</div>
			{/if}
		</div>

		<!-- current time -->
		<div class="absolute left-[44%] top-2 m-auto w-full text-xl font-bold text-rose-800">
			{currentTimeDisplay}
		</div>
	</div>
{/if}

<style>
	tr,
	th,
	td {
		border: 1px solid #e4e4e7;
		text-align: center;
		padding: 5px;
	}
	input[type='step']:disabled {
		background: #ccc;
	}
	.colored {
		background: #ddd6fe;
	}

	.active {
		@apply bg-rose-50;
	}

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
