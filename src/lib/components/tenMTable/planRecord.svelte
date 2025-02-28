<script lang="ts">
	import { onMount } from "svelte";
	import { Button, Popover } from "$ui";
	import Timer from "$components/timer/Timer.svelte";
	import TimerSetting from "$components/timer/TimerSetting.svelte";
	import { timerOpen } from "$store";

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const columns = [0, 10, 20, 30, 40, 50];

	let isAM = $derived(new Date().getHours() < 12);

	onMount(() => {
		cellColors = getCellColor();
	});

	let cellColors = $state(
		Array.from({ length: 24 }, () => [
			Array.from({ length: 6 }, () => ({ colorFill: 0, record: null })),
		]),
	);

	// 600
	let projects = [
		{ color: "#3f3f46", id: "p0", title: "프로젝트 0" },
		{ color: "#e11d48", id: "p1", title: "프로젝트 1" },
		{ color: "#db2777", id: "p2", title: "프로젝트 2" },
		{ color: "#c026d3", id: "p3", title: "프로젝트 3" },
		{ color: "#9333ea", id: "p4", title: "프로젝트 4" },
		{ color: "#7c3aed", id: "p5", title: "프로젝트 5" },
		{ color: "#4f46e5", id: "p6", title: "프로젝트 6" },
		{ color: "#2563eb", id: "p7", title: "프로젝트 7" },
		{ color: "#0284c7", id: "p8", title: "프로젝트 8" },
	];

	let selectedProject = $derived({
		color: "#3f3f46",
		id: "p0",
		title: "프로젝트 0",
	});

	let records = $state([
		{ id: 0, start: "12:10", end: "13:30", dragged: true },
		{ id: 1, start: "0:30", end: "2:00", projectId: "p1", dragged: true },
		{ id: 2, start: "4:00", end: "5:30", projectId: "p2", dragged: true },
		{ id: 3, start: "9:30", end: "10:20", projectId: "p3", dragged: true },
		{ id: 4, start: "10:20", end: "11:40", dragged: true },
		{ id: 5, start: "22:30", end: "23:40", projectId: "p8", dragged: true },
	]);

	function getStartRecordPosition(hour, min) {
		let record = records.find((record) => {
			const startTime = record.start.split(":").map(Number);
			return startTime[0] === hour && startTime[1] === min;
		});
		return record;
	}

	function getEndRecordPosition(hour, min) {
		let record = records.find((record) => {
			const endTime = record.end.split(":").map(Number);
			if (min === 60) {
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
			const project = projects.find(
				(project) => project.id === record.projectId,
			);
			record.color = project?.color || "#3f3f46";
		});
		for (let record of records) {
			let [startHour, startMin] = record.start.split(":").map(Number);
			let [endHour, endMin] = record.end.split(":").map(Number);
			startMin = Math.floor(startMin / 10);
			endMin = Math.floor(endMin / 10);
			// console.log(startHour, startMin, endHour, endMin);
			if (startHour === endHour) {
				for (let j = startMin; j <= endMin - 1; j++) {
					cellColors[startHour][0][j] = {
						colorFill: record.color,
						record,
					};
				}
				continue;
			}
			for (let i = startHour; i <= endHour; i++) {
				if (i === startHour) {
					for (let j = startMin; j < 6; j++) {
						cellColors[i][0][j] = {
							colorFill: record.color,
							record,
						};
					}
				} else if (i === endHour) {
					for (let j = 0; j <= endMin - 1; j++) {
						cellColors[i][0][j] = {
							colorFill: record.color,
							record,
						};
					}
				} else {
					for (let j = 0; j < 6; j++) {
						cellColors[i][0][j] = {
							colorFill: record.color,
							record,
						};
					}
				}
			}
		}
		return cellColors;
	}

	function addNewRecord(startTime, endTime) {
		const startTotalMin = startTime.hour * 60 + startTime.minute;
		const endTotalMin = endTime.hour * 60 + endTime.minute;
		// Add a new record if the start time is earlier than the end time
		if (startTotalMin < endTotalMin) {
			const newRecord = {
				start: `${startTime.hour}:${startTime.minute.toString().padStart(2, "0")}`,
				end: `${endTime.hour}:${endTime.minute.toString().padStart(2, "0")}`,
				dragged: true, // Indicate this record was added by dragging
				projectId: selectedProject.id,
			};
			records = [...records, newRecord];
			cellColors = getCellColor();
		} else {
			cellColors[startTime.hour][0][startTime.minute / 10].colorFill = 0;
		}
	}

	// Dragging
	let dragging = false;
	let dragStartHour = null;
	let dragStartMin = null;
	let dragEndHour = null;
	let dragEndMin = null;

	// Handle the mouse down task
	function handleMouseDown(hour, min, event, record) {
		event.preventDefault();
		event.stopPropagation();
		if (record) return;
		dragging = true;
		dragStartHour = hour;
		dragStartMin = min;
		cellColors[dragStartHour][0][dragStartMin].colorFill = 1;
		console.log("dragging");
	}

	// Handle the mouse enter task for real-time feedback
	function handleMouseMove(hour, minIdx) {
		if (dragging) {
			dragEndHour = hour;
			dragEndMin = minIdx;
			if (dragStartHour === dragEndHour && dragStartMin === dragEndMin)
				return;
			if (dragStartHour > dragEndHour) return;
			cellColors[dragEndHour][0][dragEndMin].colorFill = 1;
		}
	}

	// Handle the mouse up task
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
				minute: dragStartMin,
			};
			const endTime = {
				hour: min === 50 ? hour + 1 : hour,
				minute: min === 50 ? 0 : min + 10,
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

	// task handler
	function handleRemoveRecord(e: CustomEvent<any>): void {
		console.log(e.detail);
		console.log("remove record");
	}

	function hadnleChangeProject(e: CustomEvent<any>): void {
		let record = records.find((record) => record.id === e.detail.record.id);
		record = e.detail.record;
		getCellColor();
	}
</script>

{#if $timerOpen}
	<div
		class="h-[calc(100%+32px)] w-[calc(100%+16px)] -translate-y-2 -translate-x-2 rounded-lg"
	>
		<Timer />
	</div>
{:else}
	<div class="flex justify-around h-full w-full space-x-1.5">
		{#each ["AM", "PM"] as period, periodIndex}
			<div class="flex-col w-full">
				<div
					class="w-full text-center text-xs font-bold"
					class:activeAMPM={periodIndex === Number(!isAM)}
				>
					{period}
				</div>
				<table class="w-full h-full border-collapse">
					<thead
						class="leading-3 bg-neutral-700 border-b border-r border-neutral-700"
					>
						<tr>
							<th class="p-0 border !border-neutral-700"
								><div
									class="h-1 w-1 translate-x-1 rounded-full bg-white"
								></div></th
							>
							{#each columns as column}
								<th
									class="p-0 w-2 text-[0.5rem] text-center border text-neutral-50 !border-neutral-700 translate-y-0.5"
									>{column + 10}</th
								>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
							<tr class="plan-row h-4 w-4">
								<th
									rowspan="2"
									class="font-normal text-[0.56rem] leading-[6px] !w-3"
									>{hour}</th
								>
								{#each columns as min, minIndex}
									{@const colorFill =
										cellColors[hour][0][minIndex].colorFill}
									{@const record =
										cellColors[hour][0][minIndex].record}
									<td
										class="leading-[0] h-4 !border-0 p-0"
										onmousedown={(event) =>
											handleMouseDown(
												hour,
												min,
												event,
												record,
											)}
										onmouseup={() =>
											handleMouseUp(hour, min)}
										onmousemove={() =>
											handleMouseMove(hour, minIndex)}
										ontouchstart={(event) =>
											handleMouseDown(
												hour,
												min,
												event,
												record,
											)}
										ontouchend={() =>
											handleMouseUp(hour, min)}
										ontouchmove={() =>
											handleMouseMove(hour, minIndex)}
									>
										{#if colorFill}
											<Popover.Root>
												<Popover.Trigger
													class="w-full !h-3"
												>
													<Button
														variant="ghost"
														class="w-full h-4 -translate-y-0.5 translate-x-0 !p-0 !m-0 bg-neutral-200/50 hover:bg-neutral-500 rounded-none"
														aria-label="Record cell"
													></Button>
												</Popover.Trigger>
												<Popover.Content
													class="w-auto translate-y-[0.2rem] p-0"
												>
													<TimerSetting
														{record}
														on:remove={handleRemoveRecord}
														on:changeProject={hadnleChangeProject}
													/>
												</Popover.Content>
											</Popover.Root>
										{:else}
											<Button
												variant="ghost"
												class="w-full !h-4 !p-0 !m-0 hover:bg-neutral-600 rounded-none"
												aria-label="Empty cell"
											></Button>
										{/if}
									</td>
								{/each}
							</tr>
							<tr class="record-row h-1">
								{#each columns as min, minIndex}
									{@const record =
										cellColors[hour][0][minIndex].record}
									<td class=" !h-1 relative !border-0 !p-0">
										{#key records}
											{#if getStartRecordPosition(hour, min)}
												<div
													class="absolute -top-4 left-0 h-3.5 w-1 rounded-r-full bg-neutral-500 ml-0.5"
												></div>
											{/if}
											{#if getEndRecordPosition(hour, min + 10)}
												<div
													class="absolute -top-4 right-0 h-3.5 w-1 rounded-l-full bg-neutral-500"
												></div>
											{/if}
										{/key}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
{/if}

<style>
	tr,
	th,
	td {
		border: 0px solid #e4e4e7;
		text-align: center;
	}

	input[type="step"]:disabled {
		background: #ccc;
	}

	.activeAMPM {
		@apply bg-neutral-700 rounded-t-lg text-neutral-50;
	}

	.colored {
		@apply bg-neutral-100;
	}

	tbody tr {
		height: 1rem;
	}

	tbody th {
		width: 4px;
		max-width: 4px;
		height: 1rem;
		max-height: 1rem;
	}

	.plan-row {
		height: 1rem !important;
		min-height: 1rem !important;
		max-height: 1rem !important;
	}

	.record-row {
		height: 0.25rem !important;
		min-height: 0.25rem !important;
		max-height: 0.25rem !important;
	}
</style>
