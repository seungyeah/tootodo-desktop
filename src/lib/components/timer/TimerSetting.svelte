<script lang="ts">
	import { Button } from "$ui";
	import { Milestone, Trash2 } from "lucide-svelte";
	import { onMount } from "svelte";
	import PomoIcon from "$components/PomoIcon.svelte";
	import { timerSetting, currentTime } from "$store";
	import { timerOpen } from "$store";
	import { Time } from "@internationalized/date";
	import { createEventDispatcher } from "svelte";
	import ProjectSelect from "$components/tenMTable/ProjectSelect.svelte";

	const dispatch = createEventDispatcher();
	// planRecord에서 record(start, end)를 받아오고, 이를 기반으로 duration계산
	// duration 및 사용자가 입력한 working과 braking을 기반으로, cycle과 remain을 계산

	interface Props {
		// 각 cycle에 대한 시작시간, 종료시간, 완료여부(false), 남은시간(=working), 공부시간(=0)을 로컬 저장소에 저장
		record?: any;
	}

	let { record = { start: "", end: "" } }: Props = $props();

	let tooltip = $state(""); // Tooltip text
	let working = $state(25);
	let breaking = $state(5);
	let cycle = $state(1);
	let remain = $state(0);
	let duration = $state(0);
	let durationString = $state("");

	onMount(() => {
		if (record) {
			tooltip = `---  ${record.start} ~ ${record.end} ---`;
			calculateDuration();
			updateCycleAndRemain();
		}
	});

	function removeRecord() {
		dispatch("remove", {
			record,
		});
	}

	function changeProjectRecord() {
		dispatch("changeProject", {
			record,
		});
	}

	function storeTimerSetting() {
		const startTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds(),
		);
		const endTime = startTime.add({ minutes: duration });
		const cycles = calculateCycleArray(startTime);
		const projectColor = record?.color;
		$timerSetting = {
			projectColor,
			working,
			breaking,
			cycles,
			remain,
			duration,
			startTime,
			endTime,
		};
		// console.log($timerSetting.project);
	}

	function calculateCycleArray(startTime: Time) {
		let cycleArray = [];
		let endTime = startTime.add({ minutes: working });
		for (let i = 0; i < cycle; i++) {
			cycleArray.push({
				startTime: startTime.toString(),
				endTime: endTime.toString(),
				done: false,
				leftTime: working,
				studyResult: 0,
			});
			startTime = endTime.add({ minutes: breaking });
			endTime = startTime.add({ minutes: working });
		}
		return cycleArray;
	}

	function calculateDuration() {
		let [startHour, startMin] = record.start.split(":").map(Number);
		let [endHour, endMin] = record.end.split(":").map(Number);
		if (endMin < startMin) {
			endMin += 60;
			endHour -= 1;
		}
		let hours = endHour - startHour;
		let minutes = endMin - startMin;
		duration = hours * 60 + minutes;
		if (hours == 0) durationString = `${minutes}M`;
		else durationString = `${hours}H ${minutes}M`;
	}

	function updateCycleAndRemain() {
		if (duration > 0 && working + breaking > 0) {
			if (working + breaking <= duration) {
				cycle = Math.floor(duration / (working + breaking));
				remain = duration % (working + breaking);
			} else {
				working = 0;
				breaking = 0;
				cycle = 0;
				remain = duration;
			}
		}
	}
</script>

<div
	class="z-20 w-[220px] flex-col items-center justify-center space-y-1 bg-neutral-900 p-2 text-white
border-8 border-double border-neutral-50 box-content rounded-2xl shadow-xl
"
>
	<div class="font-digital text-center w-full">
		{tooltip}
		<Button
			class="absolute right-4 top-3 p-1 aspect-square h-7 bg-neutral-950 text-pomodoro-200
			border-2 border-pomodoro-400 rounded-xl border-double
			hover:bg-pomodoro-500 hover:text-white   "
			onclick={removeRecord}
		>
			<Trash2 size={16} />
		</Button>
	</div>
	<div
		class="flex-col space-y-2 border-2 border-dotted border-white px-1 py-2"
	>
		<!-- working time control  -->
		<div class="flex justify-center space-x-2">
			<span class="leading-8 text-pomodoro-300">WorKing</span>
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-neutral-600 px-2 py-1"
			>
				<button
					class="text-center text-2xl text-neutral-100 hover:text-neutral-300"
					onclick={() => {
						if (working > 10) {
							working -= 5;
							updateCycleAndRemain();
						}
					}}
				>
					-
				</button>
				<input
					type="number"
					class="w-12 text-center text-xl font-semibold text-neutral-100 bg-neutral-900"
					disabled
					bind:value={working}
					min={10}
					max={duration}
				/>
				<button
					class="text-center text-2xl text-neutral-100 hover:text-neutral-300"
					onclick={() => {
						if (working < duration && working >= 10) {
							working += 5;
							if (working === duration) working = duration;
							else updateCycleAndRemain();
						}
					}}
				>
					+
				</button>
			</div>
		</div>

		<!-- breaking time control -->
		<div class="flex w-full justify-center space-x-2">
			<span class="leading-8 text-emerald-300">BreaKing</span>
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-neutral-700 px-2 py-1"
			>
				<button
					class="text-center text-2xl text-neutral-100 hover:text-neutral-300"
					onclick={() => {
						if (breaking > 0) {
							breaking -= 1;
							updateCycleAndRemain();
						} else {
							breaking = 0;
						}
					}}
				>
					-
				</button>
				<input
					type="number"
					disabled
					class="w-12 text-center text-xl font-semibold text-neutral-100 bg-neutral-900"
					bind:value={breaking}
					min={0}
					max={20}
				/>
				<button
					class="text-center text-2xl text-neutral-100 hover:text-neutral-300"
					onclick={() => {
						if (breaking <= 0) {
							breaking = 0;
							return;
						}
						if (breaking < 20) {
							breaking += 1;
							updateCycleAndRemain();
						} else {
							breaking = 20;
						}
					}}
				>
					+
				</button>
			</div>
		</div>
	</div>

	<!-- check duration, -> start timer button -->
	<div class="m-1 flex space-x-2 relative">
		<div class="font-digital flex-col">
			<div class="flex space-x-1">
				<Milestone />
				<div class="text-end">{durationString}</div>
			</div>
			<div class="w-full text-end text-lg">
				(<span class="text-pomodoro-300">{working}</span>+<span
					class="text-emerald-400">{breaking}</span
				>)*{cycle}+<span class="text-blue-200">{remain}</span>
			</div>
		</div>
		<!-- start timer -->
		<Button
			variant="outline"
			class="absolute -top-1.5  right-0 m-2 px-4 h-12 w-18 text-2xl font-bold font-digital text-black shadow-inner shadow-neutral-400 "
			onclick={() => {
				storeTimerSetting();
				$timerOpen = true;
			}}>D<PomoIcon />!</Button
		>
	</div>
</div>

<style>
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
