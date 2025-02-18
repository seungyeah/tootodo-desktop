<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import { onMount } from "svelte";
	import { Button, Popover } from "$ui";
	import Timer from "$components/timer/Timer.svelte";
	import TimerSetting from "$components/timer/TimerSetting.svelte";
	import ProjectSelect from "./ProjectSelectWithCurrentTime.svelte";
	import { timerOpen } from "$store";

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const tenMinute = [0, 10, 20, 30, 40, 50];

	let isAM = $derived(new Date().getHours() < 12);

	onMount(() => {
		cellColors = getCellColor();
	});

	let cellColors = $state(Array.from({ length: 24 }, () => [
		Array.from({ length: 6 }, () => ({ colorFill: 0, record: null })),
	]));

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

	let selectedProject = $derived({ color: "#3f3f46", id: "p0", title: "프로젝트 0" });

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
	<Timer />
{:else}
	<div class="relative h-full w-full flex-col border-2 border-zinc-900">
		<div class="m-2 flex justify-around">
			{#each ["AM", "PM"] as period, periodIndex}
				<div class="flex-col shadow">
					<div
						class="w-full text-center text-xl font-bold"
						class:activeAMPM={periodIndex === Number(!isAM)}
					>
						{period}
					</div>
					<table class="h-[410px]">
						<thead>
							<tr>
								<th></th>
								{#each tenMinute as min}
									<th class="!w-[27px] px-1 text-sm"
										>{min + 10}</th
									>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
								<tr>
									<th rowspan="2" class="px-1.5">{hour}</th>
									{#each tenMinute as min, minIndex}
										{@const colorFill =
											cellColors[hour][0][minIndex]
												.colorFill}
										{@const record =
											cellColors[hour][0][minIndex]
												.record}
										{#key records}
											<td
												class="!m-0 !h-[24px] !w-[24px] !p-0"
												class:colored={colorFill}
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
													handleMouseMove(
														hour,
														minIndex,
													)}
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
													handleMouseMove(
														hour,
														minIndex,
													)}
											>
												{#if colorFill}
													<Popover.Root>
														<Popover.Trigger
															asChild
															
														>
															{#snippet children({ builder })}
																														<Button
																	builders={[
																		builder,
																	]}
																	variant="ghost"
																	class="h-full w-full !p-0 translate-y-[0.235rem]  relative bg-zinc-100 hover:bg-zinc-500"
																>
																	<div
																		class="absolute top-0.5 left-1 w-1 h-2 opacity-90 transform rotate-45 bg-white"
																	></div>
																	<div
																		class="absolute top-0 w-1 h-6 opacity-90 transform rotate-45 bg-white"
																	></div>
																	<div
																		class="absolute top-3.5 right-1 w-1 h-2 opacity-90 transform rotate-45 bg-white"
																	></div>
																</Button>
																																												{/snippet}
																												</Popover.Trigger>
														<Popover.Content
															class="w-auto translate-y-[0.2rem] p-0 "
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
														class="h-full w-full !p-0 hover:bg-neutral-600"
													></Button>
												{/if}
											</td>
										{/key}
									{/each}
								</tr>
								<tr>
									<!-- record의 시작시간, 끝 시간 표시 -->
									{#each tenMinute as min, minIndex}
										{@const record =
											cellColors[hour][0][minIndex]
												.record}
										<td
											class="relative !border-0 py-[0.18rem]"
										>
											{#key records}
												{#if getStartRecordPosition(hour, min)}
													<button
														class="absolute -top-[1.56rem] left-0 h-6 w-2.5 rounded-r-full border-r-2 border-l border-zinc-100 bg-zinc-500"
													></button>
												{/if}
												{#if getEndRecordPosition(hour, min + 10)}
													<div
														class="absolute -top-[1.56rem] right-0 h-6 w-2.5 rounded-l-full border-l-2 border-r border-zinc-100 bg-zinc-500"
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

		<!--<div class="absolute left-[42%] -top-0">
			 <ProjectSelect {projects} bind:selectedProject /> 			 
		</div>-->
	</div>
{/if}

<style>
	tr,
	th,
	td {
		border: 1px solid #e4e4e7;
	}
	input[type="step"]:disabled {
		background: #ccc;
	}
	.colored {
		@apply bg-neutral-100;
	}
	.activeAMPM {
		@apply bg-zinc-200;
	}
</style>
