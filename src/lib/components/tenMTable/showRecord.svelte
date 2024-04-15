<script lang="ts">
	import { onMount } from 'svelte';

	export let timerOpen = false;

	let records = [
		//24시 단위.
		{ start: '9:37', end: '10:13', study: '40' },
		{ start: '10:17', end: '12:05', study: '40' },
		{ start: '12:12', end: '13:15', study: '43' }
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

	const amHours = Array.from({ length: 12 }, (_, i) => i);
	const pmHours = Array.from({ length: 12 }, (_, i) => i + 12);
	const columns = [10, 20, 30, 40, 50, 60];
	const minutes = Array.from({ length: 60 }, (_, i) => i);
	let isAM = new Date().getHours() < 12;

	// Convert a time string to minutes since midnight
	function timeToMinutes(time) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}

	// Initialize cell colors
	let cellColors = Array.from({ length: 24 }, () => [Array.from({ length: 60 }, () => 0)]);

	onMount(() => {
		cellColors = getCellColor();
	});

	function getCellColor() {
		records.forEach((record) => {
			const [startHour, startMin] = record.start.split(':').map(Number);
			const [endHour, endMin] = record.end.split(':').map(Number);
			// console.log(startHour, startMin, endHour, endMin);
			for (let i = startHour; i <= endHour; i++) {
				if (i === startHour) {
					for (let j = startMin - 1; j < 60; j++) {
						cellColors[i][0][j] = 1;
					}
				} else if (i === endHour) {
					for (let j = 0; j <= endMin - 1; j++) {
						cellColors[i][0][j] = 1;
					}
				} else {
					for (let j = 0; j < 60; j++) {
						cellColors[i][0][j] = 1;
					}
				}
			}
		});

		return cellColors;
	}
</script>

{#if !timerOpen}
	<div class="relative m-auto h-full w-full flex-col border-4">
		<div class="m-2 flex justify-around">
			<!-- AM -->
			<div class="flex-col">
				<div class=" w-full text-center text-xl font-bold" class:active={isAM}>AM</div>
				<table class="h-[450px]">
					<tr>
						<th></th>
						{#each columns as column}
							<th colspan="10">{column}</th>
						{/each}
					</tr>
					{#each amHours as hour, index}
						<tr>
							<th rowspan="2">{hour}</th>
							{#each minutes as min}
								{#if min % 10 === 0}
									<td class="!m-0 !border-0 !border-l !px-0 !py-[0.05rem]"></td>
								{:else}
									<td class="!m-0 !border-0 !px-0 !py-[0.05rem]"></td>
								{/if}
							{/each}
						</tr>
						<tr>
							{#each minutes as min}
								<td class="!m-0 !border-0 !p-0" class:colored={cellColors[hour][0][min]}
								></td>
							{/each}
						</tr>
					{/each}
				</table>
			</div>

			<!-- PM -->
			<div class="flex-col">
				<div class="block w-full text-center text-xl font-bold" class:active={!isAM}>PM</div>
				<table class="!m-0 h-[450px] !p-0">
					<tr>
						<th></th>
						{#each columns as column}
							<th colspan="10">{column}</th>
						{/each}
					</tr>
					{#each pmHours as hour, index}
						<tr>
							<th rowspan="2">{hour}</th>
							{#each minutes as min}
								{#if min % 10 === 0}
									<td class="!m-0 !border-0 !border-l !px-0 !py-[0.05rem]"></td>
								{:else}
									<td class="!m-0 !border-0 !px-0 !py-[0.05rem]"></td>
								{/if}
							{/each}
						</tr>
						<tr>
							{#each minutes as min}
								<td class="!m-0 !border-0 !p-0" class:colored={cellColors[hour][0][min]}
								></td>
							{/each}
						</tr>
					{/each}
				</table>
			</div>
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

	.colored {
		background: #52525b;
	}

	.active {
		@apply bg-rose-50;
	}
</style>
