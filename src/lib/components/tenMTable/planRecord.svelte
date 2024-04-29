<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Tooltip, Popover } from '$ui';
	import Timer from '$components/timer/Timer.svelte';
	import TimerSetting from '$components/timer/TimerSetting.svelte';
	import { currentTime, formatTime, timerOpen } from '$store';
	let settingVisible = false;

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const tenMinute = [0, 10, 20, 30, 40, 50];
	$: currentTimeDisplay = formatTime($currentTime);
	$: isAM = new Date().getHours() < 12;

	onMount(() => {
		cellColors = getCellColor();
	});

	let cellColors = Array.from({ length: 24 }, () => [
		Array.from({ length: 6 }, () => ({ colorFill: 0, record: null }))
	]);

	let projects = [
		{ color: '#fb7185', id: 'p1', title: '프로젝트 1' },
		{ color: '#f472b6', id: 'p2', title: '프로젝트 2' },
		{ color: '#e879f9', id: 'p3', title: '프로젝트 3' },
		{ color: '#c084fc', id: 'p4', title: '프로젝트 4' },
		{ color: '#a78bfa', id: 'p5', title: '프로젝트 5' },
		{ color: '#818cf8', id: 'p6', title: '프로젝트 6' },
		{ color: '#60a5fa', id: 'p7', title: '프로젝트 7' },
		{ color: '#38bdf8', id: 'p8', title: '프로젝트 8' }
	];

	let records = [
		{ start: '12:10', end: '13:30', dragged: true },
		{ start: '0:30', end: '2:00', projectId: 'p1' , dragged: true},
		{ start: '4:00', end: '5:30', projectId: 'p2' , dragged: true},
		{ start: '9:30', end: '10:20', projectId: 'p3' , dragged: true},
		{ start: '10:20', end: '11:40', dragged: true },
		{ start: '22:30', end: '23:40', projectId: 'p8' , dragged: true}
	];

	function getStartRecordPosition(hour, min) {
		let record = records.find((record) => {
			const startTime = record.start.split(':').map(Number);
			return startTime[0] === hour && startTime[1] === min;
		});
		return record;
	}

	function getEndRecordPosition(hour, min) {
		let record = records.find((record) => {
			const endTime = record.end.split(':').map(Number);
			if(min===60) {
				hour += 1;
				min = 0;
			}
			return endTime[0] === hour && endTime[1] === min;			
		});
		return record;
	}
	function getCellColor() {
		// map records color
		records.map((record) => {
			const project = projects.find((project) => project.id === record.projectId);
			record.color = project?.color || '#3f3f46';
		});
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
	let dragStartMin = null;
	let dragEndHour = null;
	let dragEndMin = null;

	// Handle the mouse down event
	function handleMouseDown(hour, min, event, record) {
		event.preventDefault();
		event.stopPropagation();
		if (record) return;
		dragging = true;
		dragStartHour = hour;
		dragStartMin = min;
		cellColors[dragStartHour][0][dragStartMin].colorFill = 1;
		console.log('dragging');
	}

	// Handle the mouse enter event for real-time feedback
	function handleMouseMove(hour, minIdx) {
		if (dragging) {
			dragEndHour = hour;
			dragEndMin = minIdx;
			if (dragStartHour === dragEndHour && dragStartMin === dragEndMin) return;
			if (dragStartHour > dragEndHour) return;
			cellColors[dragEndHour][0][dragEndMin].colorFill = 1;
		}
	}

	// Handle the mouse up event
	function handleMouseUp(hour, min) {
		if (dragging) {

			//드래그 시작 시간과 끝 시간이 같고 열 차이가 10분 미만인 경우, 드래그 상태를 초기화하고 함수를 종료.
			if (dragStartHour === hour && min - dragStartMin < 10) {
				resetDragState();
				cellColors[hour][0][min / 10].colorFill = 0;
				return;
			}

			// Calculate the duration of the drag in minutes
			const startTime = {
				hour: dragStartHour,
				minute: dragStartMin
			};
			const endTime = {
				hour: min === 50 ? hour + 1 : hour,
				minute: min === 50 ? 0 : min + 10
			};
			
			addNewRecord(startTime, endTime);
			resetDragState();
		}
	}

	function resetDragState() {
			dragging = false;
			dragEndHour = null;
			dragEndMin = null;
	}

	function addNewRecord(startTime, endTime) {
		const startTotalMin = startTime.hour * 60 + startTime.minute;
		const endTotalMin = endTime.hour * 60 + endTime.minute;
		// Add a new record if the start time is earlier than the end time
		if (startTotalMin < endTotalMin) {
			const newRecord = {
				start: `${startTime.hour}:${startTime.minute.toString().padStart(2, '0')}`,
				end: `${endTime.hour}:${endTime.minute.toString().padStart(2, '0')}`,
				dragged: true // Indicate this record was added by dragging
			};
			records = [...records, newRecord];
			cellColors = getCellColor();
			console.log('Added new record:', newRecord);
		} else {
			cellColors[startTime.hour][0][startTime.minute / 10].colorFill = 0;
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
							{#each tenMinute as min}
								<th class="!w-[27px] px-1 text-sm">{min + 10}</th>
							{/each}
						</tr>
						{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
							<tr>
								<th rowspan="2" class="px-1.5">{hour}</th>
								{#each tenMinute as min, minIndex}
									{@const colorFill = cellColors[hour][0][minIndex].colorFill}
									{@const record = cellColors[hour][0][minIndex].record}
									{#key cellColors}
										<td
											class="!m-0 !h-[24px] !w-[24px] !p-0"
											class:colored={colorFill}
											on:mousedown={(event) => handleMouseDown(hour, min, event, record)}
											on:mouseup={() => handleMouseUp(hour, min)}
											on:mousemove={() => handleMouseMove(hour, minIndex)}
											on:touchstart={(event) => handleMouseDown(hour, min, event, record)}
											on:touchend={() => handleMouseUp(hour, min)}
											on:touchmove={() => handleMouseMove(hour, minIndex)}
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
													<Popover.Content class="w-auto translate-y-[0.2rem] p-0 ">
														<TimerSetting {record} />
													</Popover.Content>
												{/if}
											</Popover.Root>
										</td>
									{/key}
								{/each}
							</tr>
							<tr>
								{#each tenMinute as min, minIndex}
									{@const record = cellColors[hour][0][minIndex].record}
									<td class="relative !border-0 py-[0.18rem]">
										{#key records}
											{#if getStartRecordPosition(hour, min)}
												<button
													class="absolute -top-[1.56rem] left-0 h-6 w-2.5 rounded-r-full border-l-2 border-r-2 border-zinc-50"
													style="background-color:{record?.color}"
												/>
											{/if}
											{#if getEndRecordPosition(hour, min+10)}
												<button
													class="absolute -top-[1.56rem] right-0 h-6 w-2.5 rounded-l-full border-l-2 border-r-2 border-zinc-50 "
													style="background-color:{record?.color}"
												/>
											{/if}
										{/key}
									</td>
								{/each}
							</tr>
						{/each}
					</table>
				</div>
			{/each}
		</div>
		<div
			class="font-digital absolute left-[42%] top-1 m-auto w-[80px] text-[1.4rem] font-bold text-violet-950"
		>
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
