<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Tooltip, Popover } from '$ui';
	import Timer from '$components/timer/Timer.svelte';
	import TimerSetting from '$components/timer/TimerSetting.svelte';
	import { currentTime, formatTime, timerOpen } from '$store';
	let settingVisible = false;

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const columns = [0, 10, 20, 30, 40, 50];
	$: currentTimeDisplay = formatTime($currentTime);
	$: isAM = new Date().getHours() < 12;

	onMount(() => {
		cellColors = getCellColor();
	});

	let cellColors = Array.from({ length: 24 }, () => [
		Array.from({ length: 6 }, () => ({ colorFill: false, record: null }))
	]);

	let projects = [
		{ color: '#fb7185', id: 'p1', title: '프로젝트 1' },
		{ color: '#f472b6', id: 'p2', title: '프로젝트 2' },
		{ color: '#e879f9', id: 'p3', title: '프로젝트 3' },
		{ color: '#c084fc', id: 'p4', title: '프로젝트 4' },
		{ color: '#a78bfa', id: 'p5', title: '프로젝트 5' },
		{ color: '#818cf8', id: 'p6', title: '프로젝트 6' },
		{ color: '#60a5fa', id: 'p7', title: '프로젝트 7' },
		{ color: '#38bdf8', id: 'p8', title: '프로젝트 8' },
	];

	let records = [
		{ start: '12:10', end: '13:30', dragged: true },
		{ start: '0:30', end: '2:00', projectId: 'p1' },
		{ start: '4:00', end: '5:30', projectId: 'p2' },		
		{ start: '9:30', end: '10:15', projectId: 'p3' },
		{ start: '10:20', end: '11:40', dragged: true },
		{ start: '22:30', end: '23:45', projectId: 'p8' }
	];

	function getProjectColorPosition(hour,min){
		let record = records.find(record => {
			const startTime = record.start.split(':').map(Number);
			return startTime[0] === hour && startTime[1] === min;			
		});
		return record;
	}

	function getCellColor() {
		// map records color
		records.map((record)=>{
			const project = projects.find(project => project.id === record.projectId);
			record.color = project?.color || "#3f3f46";
		})
		for (let record of records) {
			let [startHour, startMin] = record.start.split(':').map(Number);
			let [endHour, endMin] = record.end.split(':').map(Number);
			startMin = Math.floor(startMin / 10);
			endMin = Math.floor(endMin / 10);
			// console.log(startHour, startMin, endHour, endMin);
			if (startHour === endHour) {
				for (let j = startMin; j <= endMin - 1; j++) {
					cellColors[startHour][0][j] = { colorFill: record.color, record };
				}
				continue;
			}
			for (let i = startHour; i <= endHour; i++) {
				if (i === startHour) {
					for (let j = startMin; j < 6; j++) {
						cellColors[i][0][j] = { colorFill: record.color, record };
					}
				} else if (i === endHour) {
					for (let j = 0; j <= endMin - 1; j++) {
						cellColors[i][0][j] = { colorFill: record.color, record };
					}
				} else {
					for (let j = 0; j < 6; j++) {
						cellColors[i][0][j] = { colorFill: record.color, record };
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

			if (startTime < endTime) {
				const newRecord = {
					start: `${startHour}:${startMinute.toString().padStart(2, '0')}`,
					end: `${endHour}:${endMinute.toString().padStart(2, '0')}`,
					dragged: true // Indicate this record was added by dragging
				};
				records = [...records, newRecord];
				cellColors = getCellColor();
				console.log('Added new record:', newRecord);
			} else {
				cellColors[startHour][0][startMinute / 10].colorFill = 0;
			}

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
			if (dragStartHour === dragEndHour && dragStartColumn === dragEndColumn) return;
			if (dragStartHour > dragEndHour) return;
			cellColors[dragEndHour][0][dragEndColumn].colorFill = 1;
		}
	}
</script>

{#if $timerOpen}
	<Timer />
{:else}
	<div class="relative h-full w-full flex-col border-2 border-zinc-900">
		<div class="m-2 flex justify-around">
			{#each ['AM', 'PM'] as period, periodIndex}
				<div class="flex-col">
					<div
						class="w-full text-center text-xl font-bold"
						class:active={periodIndex === Number(!isAM)}
					>
						{period}
					</div>
					<table class="h-[410px]">
						<tr>
							<th></th>
							{#each columns as column}
								<th class="!w-[27px] px-1 text-sm">{column + 10}</th>
							{/each}
						</tr>
						{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
							<tr>
								<th rowspan="2" class="px-1.5">{hour}</th>
								{#each columns as column, columnIndex}
									{@const colorFill = cellColors[hour][0][columnIndex].colorFill}
									{@const record = cellColors[hour][0][columnIndex].record}
									{#key cellColors}
										<td
											class="!m-0 !h-[24px] !w-[24px] !p-0"
											class:colored={colorFill}
											on:mousedown={(event) => handleMouseDown(hour, column, event, record)}
											on:mouseup={() => handleMouseUp(hour, column)}
											on:mousemove={() => handleMouseMove(hour, columnIndex)}
										>
											<Popover.Root
												onOutsideClick={() => (settingVisible = false)}
												closeFocus={() => (settingVisible = false)}
												openFocus={() => {
													settingVisible = colorFill;
												}}
											>
												<Popover.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														variant="ghost"
														class="h-full w-full !p-0 hover:bg-zinc-950"
													></Button>
												</Popover.Trigger>
												{#if settingVisible && record}
													<Popover.Content class="translate-y-[0.2rem] w-auto p-0 " >
														<TimerSetting {record}  />
													</Popover.Content>
												{/if}
											</Popover.Root>
										</td>
									{/key}
								{/each}
							</tr>
							<tr>
								{#each columns as column,columnIndex}
								{@const record = cellColors[hour][0][columnIndex].record}
									<td class="!border-0 py-[0.18rem] relative">
										{#if getProjectColorPosition(hour,column)}
											<button class="absolute -top-[1.56rem] left-0 w-2 h-6 rounded-r-full  border-r-2 border-zinc-50  " style="background-color:{record?.color}"/>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</table>
				</div>
			{/each}
		</div>
		<div class="absolute left-[42%] top-1 m-auto w-[80px] text-[1.4rem] font-bold font-digital text-violet-950">
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
		background: #52525b;
	}
	.active {
		@apply bg-zinc-200;
	}
</style>
