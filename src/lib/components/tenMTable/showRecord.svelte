<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import { onMount } from "svelte";
	import { timerOpen } from "$store";

	// 200
	let projects = [
		{ color: " #f7d5d8", id: "p1", title: "프로젝트 1" },
		{ color: "#f8ecec ", id: "p2", title: "프로젝트 2" },
		{ color: "#f6cace", id: "p3", title: "프로젝트 3" },
		{ color: "#f0aab0", id: "p4", title: "프로젝트 4" },
		{ color: "#e46b75", id: "p5", title: "프로젝트 5" },
		{ color: "#D92B3Af0", id: "p6", title: "프로젝트 6" },
		{ color: "#c32734", id: "p7", title: "프로젝트 7" },
		{ color: "#821a23", id: "p8", title: "프로젝트 8" },
	];

	let records = [
		{ start: "0:30", end: "2:00", study: "50", projectId: "p1" },
		{ start: "10:17", end: "12:05", study: "40", projectId: "p4" },
		{ start: "4:00", end: "5:30", study: "60", projectId: "p2" },
		{ start: "9:37", end: "10:13", study: "40", projectId: "p3" },
		{ start: "12:12", end: "13:15", study: "43", projectId: "p5" },
		{ start: "16:00", end: "17:45", study: "75", projectId: "p6" },
		{ start: "20:30", end: "22:15", study: "80", projectId: "p7" },
		{ start: "22:30", end: "23:45", study: "55", projectId: "p8" },
	];
	type Record = {
		start: string;
		end: string;
		study: string;
		dragged?: boolean;
	};
	type ColorRange = {
		colorStart: number;
		colorEnd: number;
	};
	let recordColorRanges: ColorRange[] = [];

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const columns = [0, 10, 20, 30, 40, 50];
	const minutes = Array.from({ length: 60 }, (_, i) => i);
	let isAM = new Date().getHours() < 12;

	// Initialize cell colors
	let cellColors = $state(Array.from({ length: 24 }, () => [
		Array.from({ length: 60 }, () => 0),
	]));

	onMount(() => {
		cellColors = getCellColor();
	});

	function getCellColor() {
		records.forEach((record) => {
			const [startHour, startMin] = record.start.split(":").map(Number);
			const [endHour, endMin] = record.end.split(":").map(Number);
			const project = projects.find((p) => p.id === record.projectId);
			const colorFill = project ? project.color : "#52525b"; // 해당 record의 project color로 할당

			for (let i = startHour; i <= endHour; i++) {
				if (i === startHour) {
					for (let j = startMin - 1; j < 60; j++) {
						cellColors[i][0][j] = colorFill;
					}
				} else if (i === endHour) {
					for (let j = 0; j <= endMin - 1; j++) {
						cellColors[i][0][j] = colorFill;
					}
				} else {
					for (let j = 0; j < 60; j++) {
						cellColors[i][0][j] = colorFill;
					}
				}
			}
		});

		return cellColors;
	}
</script>

{#if !$timerOpen}
	<div class="relative h-full w-full flex-col border-2 border-zinc-900">
		<div class="m-2 flex justify-around">
			{#each ["AM", "PM"] as period, periodIndex}
				<div class="flex-col mx-1.5">
					<div class="w-full text-center text-xl font-bold">
						{period}
					</div>
					<table class="h-[410px]">
						<thead>
							<tr>
								<th></th>
								{#each columns as column}
									<th
										colspan="10"
										class="!w-[27px] px-1 text-sm"
										>{column + 10}</th
									>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
								<tr>
									<th rowspan="2" class="px-1.5">{hour}</th>
									{#each minutes as min}
										<td
											class={min % 10 === 0
												? " !border-0 !border-l !m-0 !h-[25px] !p-0"
												: "!border-0 !m-0 !h-[25px]  !p-0"}
										></td>
									{/each}
								</tr>
								<tr>
									{#each minutes as min}
										{@const color =
											cellColors[hour][0][min]}
										<td
											class="!border-0 py-[0.18rem]"
											class:colored={cellColors[hour][0][
												min
											]}
											style="background-color: {color}"
										></td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	tr,
	th,
	td {
		border: 1px solid #e4e4e7;
	}

	.colored {
		background: #52525b;
	}
</style>
