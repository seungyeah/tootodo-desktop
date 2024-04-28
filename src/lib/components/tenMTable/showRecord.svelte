<script lang="ts">
	import { onMount } from 'svelte';
	import {timerOpen}from '$store';

		// 200
		let projects = [
		{ color: '#fecdd3', id: 'p1', title: '프로젝트 1' },
		{ color: '#fbcfe8', id: 'p2', title: '프로젝트 2' },
		{ color: '#f5d0fe', id: 'p3', title: '프로젝트 3' },
		{ color: '#e9d5ff', id: 'p4', title: '프로젝트 4' },
		{ color: '#ddd6fe', id: 'p5', title: '프로젝트 5' },
		{ color: '#c7d2fe', id: 'p6', title: '프로젝트 6' },
		{ color: '#bfdbfe', id: 'p7', title: '프로젝트 7' },
		{ color: '#bae6fd', id: 'p8', title: '프로젝트 8' },
	];

	let records = [
		{ start: '0:30', end: '2:00', study: '50', projectId: 'p1' },
		{ start: '4:00', end: '5:30', study: '60', projectId: 'p2' },
		{ start: '9:37', end: '10:13', study: '40', projectId: 'p3' },
		{ start: '10:17', end: '12:05', study: '40', projectId: 'p4' },
		{ start: '12:12', end: '13:15', study: '43', projectId: 'p5' },
		{ start: '16:00', end: '17:45', study: '75', projectId: 'p6' },
		{ start: '20:30', end: '22:15', study: '80', projectId: 'p7' },
		{ start: '22:30', end: '23:45', study: '55', projectId: 'p8' }
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
	let cellColors = Array.from({ length: 24 }, () => [Array.from({ length: 60 }, () => 0)]);

	onMount(() => {
		cellColors = getCellColor();
	});

	function getCellColor() {
		records.forEach((record) => {
			const [startHour, startMin] = record.start.split(':').map(Number);
			const [endHour, endMin] = record.end.split(':').map(Number);
			const project = projects.find((p) => p.id === record.projectId);
			const colorFill = project ? project.color : '#52525b'; // 해당 record의 project color로 할당

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
			{#each ['AM', 'PM'] as period, periodIndex}
				<div class="flex-col mx-1.5">
					<div
						class="w-full text-center text-xl font-bold"
					>
						{period}
					</div>
					<table class="h-[410px]">
						<tr>
							<th></th>
							{#each columns as column}
								<th colspan="10" class="!w-[27px] px-1 text-sm">{column + 10}</th>
							{/each}
						</tr>
						{#each hours.slice(periodIndex * 12, (periodIndex + 1) * 12) as hour}
							<tr>
								<th rowspan="2" class="px-1.5">{hour}</th>
								{#each minutes as min}
								{@const color = cellColors[hour][0][min]}
									{#if min % 10 === 0}
										<td class=" !border-0 !border-l !m-0 !h-[25px] !p-0" ></td>
									{:else}
										<td class="!border-0 !m-0 !h-[25px]  !p-0"></td>
									{/if}
								{/each}
							</tr>
							<tr>
								{#each minutes as min}
								{@const color = cellColors[hour][0][min]}
									<td class="!border-0 py-[0.18rem] " class:colored={cellColors[hour][0][min]} style="background-color: {color}"></td>
								{/each}
							</tr>
						{/each}
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
