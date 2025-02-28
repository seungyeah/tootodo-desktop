<script lang="ts">
	import { Button } from "$ui";
	import { Milestone, MoveHorizontal, Trash2 } from "lucide-svelte";
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
	class="z-20 w-[240px] flex-col items-center justify-center space-y-1
    bg-neutral-950 p-2 text-white
    rounded-2xl
    shadow-[0_0_10px_rgba(0,0,0,0.3),inset_0_0_10px_rgba(255,255,255,0.1)]
    border-4 border-neutral-800
    relative
    before:absolute before:inset-0 before:rounded-xl
    before:shadow-[inset_0_2px_3px_rgba(255,255,255,0.2),inset_0_-2px_3px_rgba(0,0,0,0.2)]
    "
>
	<!-- 시계 테두리 효과 -->
	<div
		class="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-neutral-700 to-neutral-900 -z-10"
	></div>

	<div class="font-digital text-center w-full relative">
		<!-- 윗부분 볼트 장식 -->
		<div
			class="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-neutral-600 shadow-inner"
		></div>
		<div
			class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neutral-600 shadow-inner"
		></div>

		{tooltip}

		<Button
			class="absolute -left-1 top-5 p-1 aspect-square h-7  z-20
            bg-neutral-950 text-pomodoro-500
            rounded-xl 
            hover:bg-pomodoro-500 hover:text-white
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
			onclick={removeRecord}
		>
			<Trash2 size={16} />
		</Button>
	</div>

	<!-- 나머지 내용의 스타일도 수정 -->
	<div
		class="flex-col space-y-2 border-2 border-dotted border-neutral-700 px-1 py-2 rounded-xl
        bg-gradient-to-b from-neutral-950 to-neutral-900
        shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]
        relative z-10"
	>
		<!-- working time control  -->
		<div class="flex justify-center space-x-2">
			<span class="leading-8 text-pomodoro-400">WorKing</span>
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-neutral-600 px-2 py-1"
			>
				<button
					type="button"
					class="z-20 relative text-center text-2xl text-neutral-100 hover:text-neutral-300 w-6 h-8"
					on:click={() => {
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
					type="button"
					class="z-20 relative text-center text-2xl text-neutral-100 hover:text-neutral-300 w-6 h-8"
					on:click={() => {
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
			<span class="leading-8 text-success">BreaKing</span>
			<div
				class="flex h-[32px] w-[100px] items-center justify-between rounded-lg bg-neutral-700 px-2 py-1"
			>
				<button
					type="button"
					class="z-20 relative text-center text-2xl text-neutral-100 hover:text-neutral-300 w-6 h-8"
					on:click={() => {
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
					type="button"
					class="z-20 relative text-center text-2xl text-neutral-100 hover:text-neutral-300 w-6 h-8"
					on:click={() => {
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
	<div class="flex space-x-2 relative">
		<div class="font-digital flex-col">
			<div class="flex space-x-1">
				<Milestone />
				<div class="text-end">{durationString}</div>
			</div>
			<!-- <div class="w-full text-end text-lg">
				(<span class="text-pomodoro-400">{working}</span>+<span
					class="text-success">{breaking}</span
				>)*{cycle}+<span class="text-blue-500">{remain}</span>
			</div> -->
			<div class="w-full text-end text-lg flex relative space-x-2.5">
				<span class="text-pomodoro-400">{working}</span>
				<span class="absolute -top-1 left-[30px] text-base"
					>{cycle}</span
				>
				<span class="translate-y-2"><MoveHorizontal /></span>
				<span class="text-success">{breaking}</span>
				,
				<span class="text-blue-500">{remain}</span>
			</div>
		</div>
		<!-- start timer -->
		<Button
			variant="outline"
			class="absolute top-1 right-0 h-11 w-[84px] text-2xl font-bold font-digital text-black"
			onclick={() => {
				storeTimerSetting();
				$timerOpen = true;
			}}
			>D
			<span
				class="translate-y-0 border-2 rounded-full p-0.5 border-neutral-700"
				><PomoIcon /></span
			>!</Button
		>
	</div>
</div>

<style>
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* 유리 효과 */
	.font-digital {
		position: relative;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.05) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
	}

	/* 입체감을 위한 그림자 효과 */
	input[type="number"] {
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	button {
		transition: transform 0.1s ease;
		position: relative;
		z-index: 20;
	}

	button:active {
		transform: scale(0.95);
	}
</style>
