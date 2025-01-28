<script lang="ts">
	import { onMount } from "svelte";
	import { Dumbbell, Globe, Pill, Sun } from "lucide-svelte";
	import { currentTime } from "$store";
	import { cn } from "$lib/utils";

	onMount(() => {
		cellColors = getCellColor();
	});

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

	let todayHabits = [
		{
			id: 0,
			icon: Sun,
			title: "wake up",
			done: true,
			doneTime: new Date("Fri Apr 26 2024 10:20:30 GMT+0900 (한국 표준시)"),
		},
		{ id: 3, icon: Pill, title: "take pills", done: false, doneTime: "" },
		{
			id: 4,
			icon: Globe,
			title: "learn foreign language",
			done: false,
			doneTime: "",
		},
		{
			id: 6,
			icon: Dumbbell,
			title: "workout",
			done: true,
			doneTime: new Date("Fri Apr 26 2024 21:40:30 GMT+0900 (한국 표준시)"),
		},
	];

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const columns = [0, 10, 20, 30, 40, 50];
	const minutes = Array.from({ length: 60 }, (_, i) => i);

	// Initialize cell colors
	let cellColors = $state(Array.from({ length: 24 }, () => [
		Array.from({ length: 60 }, () => 0),
	]));

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

	function getHabitIcon(hour, min) {
		const habit = todayHabits.find((habit) => {
			const doneTime = new Date(habit.doneTime);
			return doneTime.getHours() === hour && doneTime.getMinutes() === min;
		});
		return habit ? habit.icon : null;
	}

	function getCurrentTimePosition(hour, min) {
		return $currentTime
			? $currentTime.getHours() === hour && $currentTime.getMinutes() === min
			: false;
	}
</script>

<table class="w-full h-full border-collapse">
	<thead class="sticky z-[2] top-0 leading-4 bg-zinc-100">
		{#each columns as column}
			<th
				colspan="10"
				class="p-0 w-2 text-[0.45rem] bg-zinc-700 text-zinc-50"
				>{column + 10}</th
			>
		{/each}
	</thead>
	<tbody>
		{#each hours as hour}
			<tr>
				<!-- <th rowspan="1" class="px-1 py-0 text-[0.9rem]">{hour}</th> -->
				{#each minutes as min}
					{@const color = cellColors[hour][0][min]}
					<td
						class={cn(
							"relative !m-0 !border-0 !p-0 w-2",
							min % 10 === 0 && "!border-l",
						)}
						style="background-color: {color}"
						class:colored={color}
					>
						{#if getHabitIcon(hour, min)}
							{@const SvelteComponent = getHabitIcon(hour, min)}
							<SvelteComponent
								strokeWidth={2.4}
								class="absolute w-5 h-5 -top-0.5 left-0  z-[1] rounded-full  border-2 border-white text-zinc-950 bg-white/70 p-0.5 shadow-md "
							/>
						{/if}

						<!-- {#key $currentTime}
							{#if getCurrentTimePosition(hour, min)}
								<div
									class="absolute -left-0.5 -top-1 z-[1] h-[calc(100%+8px)] w-1 transform bg-pomodoro-950"
								/>
							{/if}
						{/key} -->
					</td>
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
		@apply border-r border-dashed border-white;
	}
</style>
