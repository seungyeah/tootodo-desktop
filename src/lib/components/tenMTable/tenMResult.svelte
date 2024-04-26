<script lang="ts">
	import { onMount } from 'svelte';
	import { Bed, BookOpenText, Dumbbell, Globe, Pill, Star, Sun, Utensils } from 'lucide-svelte';

	let records = [
		//24시 단위.
		{ start: '9:37', end: '10:13', study: '40' },
		{ start: '10:17', end: '12:05', study: '40' },
		{ start: '12:12', end: '13:15', study: '43' }
	];

	let todayHabits = [
		{ id: 0, icon: Sun, title: 'wake up', done: true, doneTime: new Date('Fri Apr 26 2024 10:20:30 GMT+0900 (한국 표준시)') },
		{ id: 3, icon: Pill, title: 'take pills', done: false, doneTime: '' },
		{ id: 4, icon: Globe, title: 'learn foreign language', done: false, doneTime: '' },
		{ id: 6, icon: Dumbbell, title: 'workout', done: true, doneTime: new Date() }
	];

	function getHabitIcon(hour, min) {
		const habit = todayHabits.find((habit) => {
			const doneTime = new Date(habit.doneTime);
			return doneTime.getHours() === hour && doneTime.getMinutes() === min;
		});
		return habit ? habit.icon : null;
	}

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

<table class="h-full w-full border-collapse">
	<thead class="sticky top-0 bg-zinc-100">
		<th></th>
		{#each columns as column}
			<th colspan="10" class="!w-[27px] px-1 text-sm">{column + 10}</th>
		{/each}
	</thead>
	<tbody>
		{#each hours as hour}
			<tr>
				<th rowspan="1" class="px-1 py-0 text-[0.9rem]">{hour}</th>
				{#each minutes as min}
					{#if min % 10 === 0}
						<td class=" !m-0 !border-0 !border-l !p-0 relative" class:colored={cellColors[hour][0][min]}>
							{#if getHabitIcon(hour, min)}
								<svelte:component this={getHabitIcon(hour, min)} size="34" class="absolute left-0 -top-0.5  p-1 z-10  bg-zinc-200 rounded-full " />
							{/if}
						</td>
					{:else}
						<td class="!m-0 !border-0 !p-0 relative" class:colored={cellColors[hour][0][min]}>
							{#if getHabitIcon(hour, min)}
								<svelte:component this={getHabitIcon(hour, min)} size="34" class="absolute left-0 -top-0.5 p-1 z-10 bg-zinc-200 rounded-full " />
							{/if}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	tr,
	th,
	td {
		border: 1px solid #e4e4e7;
	}

	
	.colored {
		background: #52525b;
	}

	.active {
		@apply bg-rose-50;
	}
</style>
