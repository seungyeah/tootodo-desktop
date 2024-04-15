<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, Tooltip } from '$ui';
	import Timer from '$components/timer/Timer.svelte';
	import TimerSetting from '$components/timer/TimerSetting.svelte';
	import { X, Milestone } from 'lucide-svelte';
	import { currentTime, formatTime } from '$store';

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
</script>

{#if timerOpen}
	<Timer bind:timerOpen {duration} {working} {breaking} {cycle} {remain} />
{:else}
	<div class="relative h-full w-full flex-col border-4 border-zinc-900">
		<div class="m-2 flex justify-around">
			<!-- AM -->
			<div class="flex-col">
				<div class="w-full text-center text-xl font-bold" class:active={isAM}>AM</div>
				<table class="h-[380px]">
					<tr>
						<th></th>
						{#each columns as column}
							<th class="!w-[27px] px-1 text-sm">{column + 10}</th>
						{/each}
					</tr>
					{#each amHours as hour, index}
						<tr>
							<th rowspan="2" class="px-1.5">{hour}</th>
							{#each columns as column, columnIndex}
								{#key cellColors}
									<td
										class=" !m-0 !h-[20px] !w-[20px] !p-0"
										class:colored={cellColors[hour][0][columnIndex].colorFill}
										on:mousedown={(event) =>
											handleMouseDown(hour, column, event, cellColors[hour][0][columnIndex].record)}
										on:mouseup={() => handleMouseUp(hour, column)}
										on:mousemove={(e) => handleMouseMove(hour, columnIndex)}
									>
										<Tooltip.Root openDelay={100}>
											<Tooltip.Trigger asChild let:builder>
												<Button
													builders={[builder]}
													variant="ghost"
													class="h-full w-full !p-0 hover:bg-violet-50"
												></Button>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<TimerSetting />
											</Tooltip.Content>
										</Tooltip.Root>
									</td>
								{/key}
							{/each}
						</tr>
						<tr>
							{#each columns as _}
								<td class="!border-0 py-[0.18rem]"></td> <!-- 이 부분은 비어있는 하단 셀을 나타냅니다 -->
							{/each}
						</tr>
					{/each}
				</table>
			</div>

			<!-- PM -->
			<div class="flex-col">
				<div class="block w-full text-center text-xl font-bold" class:active={!isAM}>PM</div>
				<table class="h-[380px]">
					<tr>
						<th></th>
						{#each columns as column}
							<th class="!w-[27px] px-1 text-sm">{column + 10}</th>
						{/each}
					</tr>
					{#each pmHours as hour, index}
						<tr>
							<th rowspan="2" class="px-1.5">{hour}</th>
							{#each columns as column, columnIndex}
								{#key cellColors}
									<td
										class=" !m-0 !h-[20px] !w-[20px] !p-0"
										class:colored={cellColors[hour][0][columnIndex].colorFill}
										on:mousedown={(event) =>
											handleMouseDown(hour, column, event, cellColors[hour][0][columnIndex].record)}
										on:mouseup={() => handleMouseUp(hour, column)}
										on:mousemove={(e) => handleMouseMove(hour, columnIndex)}
									>
										<Tooltip.Root openDelay={100}>
											<Tooltip.Trigger asChild let:builder>
												<Button
													builders={[builder]}
													variant="ghost"
													class="h-full w-full !p-0 hover:bg-violet-50"
												></Button>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<TimerSetting />
											</Tooltip.Content>
										</Tooltip.Root>
									</td>
								{/key}
							{/each}
						</tr>
						<tr>
							{#each columns as _}
							<td class="!border-0 py-[0.18rem]"></td> <!-- 이 부분은 비어있는 하단 셀을 나타냅니다 -->
							{/each}
						</tr>
					{/each}
				</table>
			</div>
		</div>

		<!-- current time -->
		<div class="absolute left-[43.2%] top-2 m-auto w-full text-xl font-bold text-rose-800">
			{currentTimeDisplay}
		</div>
	</div>
{/if}

<style>
	tr,
	th,
	td {
		border: 1px solid #e4e4e7;
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
</style>
