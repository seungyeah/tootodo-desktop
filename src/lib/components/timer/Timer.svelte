<script lang="ts">
	import { Button } from "$ui";
	import PomoIcon from "$components/PomoIcon.svelte";
	import TimerLayout from "./TimerLayout.svelte";
	import {
		ArrowUp,
		MoveHorizontal,
		Pause,
		Play,
		StepBack,
		StepForward,
	} from "lucide-svelte";
	import {
		currentTime,
		formatTime,
		timerOpen,
		timerSetting,
		timerStatus,
		timerStopTime,
	} from "$store";
	import Separator from "$ui/separator/separator.svelte";
	import { onDestroy, onMount } from "svelte";
	import { Time } from "@internationalized/date";

	let worker: Worker;

	let leftSecondsDefault = 25;
	let stopSeconds = $state(0);
	let sessionSwitched = false;
	let records = $state([
		{ startTime: "", endTime: "", done: false, leftTime: 25, studyTime: 0 },
	]);

	onMount(async () => {
		await initWebWorker();
		records = $timerSetting.cycles;
		leftSecondsDefault = $timerSetting.working * 60;

		if ($timerStatus.cycle === 0) {
			records = $timerSetting.cycles;
			// 타이머 초기화
			$timerStatus = {
				play: true,
				workSession: true,
				cycle: 1,
				startTime: records[0].startTime,
				endTime: records[0].endTime,
				leftTime: leftSecondsDefault,
				studyTime: 0,
			};
		} else {
			// 이전에 저장된 시간과 현재 시간의 차이 계산
			const storedStopTime = $timerStopTime;
			if (storedStopTime) {
				const elapsedTime = Date.now() - parseInt(storedStopTime, 10);
				const elapsedSeconds = Math.floor(elapsedTime / 1000);

				// leftTime 업데이트
				$timerStatus.leftTime -= elapsedSeconds;
				if ($timerStatus.leftTime < 0) {
					$timerStatus.leftTime = 0;
				}
			}
		}

		await playTimer();
	});

	onDestroy(async () => {
		await resetTimer();
		worker.terminate();
		// 타이머가 사라질 때의 시간 저장. 다음에 타이머를 다시 열었을 때, 이 시간을 기준으로 타이머를 재개
		if ($timerStatus.cycle <= records.length) $timerStopTime = Date.now();
	});

	/////////////////////////////// web worker ///////////////////////////////
	async function initWebWorker() {
		if (typeof window !== "undefined" && window.Worker) {
			try {
				const MyWorker = await import(
					"$lib/worker/timer.worker?worker"
				);
				worker = new MyWorker.default();

				worker.onmessage = async (e) => {
					if (e.data.leftTime !== undefined) {
						$timerStatus.leftTime = e.data.leftTime;
					}
					if (e.data.stopTime !== undefined) {
						stopSeconds = e.data.stopTime;
					}
					if (e.data.leftTime === 0) {
						await switchSession();
					}
				};
			} catch (error) {
				console.error("Worker initialization failed:", error);
			}
		}
	}

	async function playTimer() {
		if (!worker) await initWebWorker();
		$timerStatus.play = true;
		worker.postMessage({
			action: "play",
			leftTime: $timerStatus.leftTime,
		});
	}

	async function stopTimer() {
		if (!worker) return;
		$timerStatus.play = false;
		worker.postMessage({
			action: "stop",
			stopTime: stopSeconds,
			sessionSwitched,
		});
	}

	async function resetTimer() {
		worker.postMessage({ action: "reset" });
		resetTimerStatus();
		worker.terminate();
	}

	/////////////////////////////// functions ///////////////////////////////
	async function switchSession() {
		let alarmSound = new Audio(
			"https://freesound.org/data/previews/80/80921_1022651-lq.mp3",
		);
		alarmSound.play();

		sessionSwitched = true;

		if ($timerSetting.breaking === 0) {
			if ($timerStatus.cycle >= records.length) {
				resetTimerStatus();
				$timerOpen = false;
			}
			stopSeconds = 0;
			await stopTimer();
			setNewRecordAt($timerStatus.cycle);
			updateRecordsFrom($timerStatus.cycle);
			updateTimerStatus();
			await playTimer();
			sessionSwitched = false;
			return;
		}

		if ($timerStatus.workSession) {
			setNewRecordAt($timerStatus.cycle);
			$timerStatus.workSession = false;
			$timerStatus.leftTime = $timerSetting.breaking * 60;
			if ($timerStatus.cycle >= records.length) {
				resetTimerStatus();
				$timerStopTime = 0;
				$timerOpen = false;
			}
		} else {
			updateRecordsFrom($timerStatus.cycle);
			updateTimerStatus();
		}

		stopSeconds = 0;
		await stopTimer();
		await playTimer();
		sessionSwitched = false;
	}

	// breaking -> working
	function updateTimerStatus() {
		const startTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds(),
		);
		const endTime = startTime.add({ minutes: $timerSetting.working });

		$timerStatus = {
			play: true,
			workSession: true,
			cycle: ($timerStatus.cycle += 1),
			startTime: startTime.toString(),
			endTime: endTime.toString(),
			leftTime: leftSecondsDefault,
			studyTime: 0,
		};
	}

	function resetTimerStatus() {
		$timerStatus = {
			play: true,
			workSession: true,
			cycle: 0,
			startTime: "",
			endTime: "",
			leftTime: $timerSetting.working * 60,
			studyTime: 0,
		};
	}

	function setNewRecordAt(currentCycle: number) {
		let startTime = $timerStatus.startTime;
		let endTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds(),
		);

		let startTimeParts = startTime.split(":");

		let timeDiff = endTime.subtract({
			hours: +startTimeParts[0],
			minutes: +startTimeParts[1],
			seconds: +startTimeParts[2],
		});

		let timeDiffSeconds =
			timeDiff.hour * 3600 + timeDiff.minute * 60 + timeDiff.second;
		let duration = Math.floor((timeDiffSeconds - stopSeconds) / 60);

		// 현 cycle의 정보 저장
		records[currentCycle - 1] = {
			done: true,
			startTime,
			endTime: endTime.toString(),
			leftTime: 0,
			studyTime: duration,
		};
	}

	function updateRecordsFrom(currentCycle: number) {
		let startTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds(),
		);
		let endTime = startTime.add({ minutes: $timerSetting.working });

		// 이후 cycle의 start, end 갱신
		for (let i = currentCycle; i < records.length; i++) {
			records[i] = {
				startTime: startTime.toString(),
				endTime: endTime.toString(),
				done: false,
				leftTime: leftSecondsDefault,
				studyTime: 0,
			};
			startTime = endTime.add({ minutes: $timerSetting.breaking });
			endTime = startTime.add({ minutes: $timerSetting.working });
		}

		$timerSetting.cycles = records;
	}
</script>

{#if $timerOpen && records}
	<div
		class="z-20 w-full h-full flex flex-col items-center justify-center space-y-1
    bg-neutral-950 p-2 text-neutral-100
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

		<!-- timer layout -->
		<div
			class="relative flex aspect-square w-[94.5%] -translate-y-2 items-center justify-center rounded-full p-0 shadow-xl"
		>
			<div class="h-full w-full rounded-full">
				<TimerLayout />
			</div>

			<!-- finish , reset-->
			<Button
				variant="ghost"
				class="absolute -left-2 top-1.5 z-10 
					    w-12 h-12 rounded-full
					   bg-neutral-700 hover:bg-neutral-700
					   shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]
					   border border-neutral-700"
				onclick={async () => {
					setNewRecordAt($timerStatus.cycle);
					await resetTimer();
					$timerOpen = false;
				}}><StepBack color="white" fill="white" size={24} /></Button
			>

			<!-- next session -->
			<Button
				variant="ghost"
				class="absolute -right-2 bottom-0 z-10
					   w-12 h-12 rounded-full
					   bg-neutral-800 hover:bg-neutral-700
					   shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]
					   border border-neutral-700"
				onclick={async () => {
					await switchSession();
				}}><StepForward color="white" fill="white" size={24} /></Button
			>

			<!-- timer operation Button: play/stop -->
			<Button
				class="absolute top-7 left-7 z-50 h-[204px]  w-[204px] 
		 			   rounded-full  border-4  border-neutral-950 bg-black/20 p-0 shadow-xl hover:bg-black/60"
				onclick={async () => {
					$timerStatus.play ? await stopTimer() : await playTimer();
				}}
			>
				{#if $timerStatus.play}
					<Pause fill="#e4e4e7" color="#e4e4e7" size={44} />
					<div
						class="text-2xl font-digital absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 font-bold text-neutral-50"
					>
						{Math.floor($timerStatus.leftTime / 60)
							.toString()
							.padStart(2, "0")}:{($timerStatus.leftTime % 60)
							.toString()
							.padStart(2, "0")}
					</div>
				{:else}
					<Play fill="#e4e4e7" color="#e4e4e7" size={44} />
					<div
						class="text-2xl font-digital absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 font-bold text-neutral-300"
					>
						{Math.floor(stopSeconds / 60)
							.toString()
							.padStart(2, "0")}:{(stopSeconds % 60)
							.toString()
							.padStart(2, "0")}
					</div>
				{/if}
			</Button>
		</div>

		<!-- info -->
		<div class="relative flex w-full gap-2 h-12">
			<!-- 작업/휴식 시간 설정 표시 -->
			<div
				class="relative h-full w-24 flex space-x-1.5 items-center justify-center
						bg-neutral-900 rounded-lg
						border border-neutral-700
						shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
						overflow-hidden
						p-1 text-neutral-100 text-center font-bold text-sm px-2
						"
				style="border-color:{$timerSetting.projectColor}"
			>
				<span class="text-pomodoro-500">{$timerSetting.working}</span>

				<div class="flex-col">
					<div class="translate-y-2 text-xs text-neutral-200">
						{$timerSetting.cycles.length}
					</div>
					<MoveHorizontal size={20} />
				</div>

				<span class="text-success">{$timerSetting.breaking}</span>
				<span>,</span>
				<span class="text-blue-500">{$timerSetting.remain}</span>
			</div>

			<!-- 현재 세션 정보 -->
			<div class="flex-1 grid grid-cols-3 gap-1">
				<!-- 현재 사이클 상태 -->
				<div
					class="bg-neutral-900 rounded-lg px-3
							border border-neutral-700
							shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
							flex items-center justify-between"
				>
					<div class="flex flex-col items-start w-full">
						<span class="text-[0.65rem] text-neutral-400"
							>Cycle</span
						>
						<!-- 사이클 수 표시 -->
						<div
							class="h-5 w-full m-auto
							flex justify-center items-center
						text-sm font-bold"
						>
							{$timerStatus.cycle} /{$timerSetting.cycles.length}
						</div>
					</div>
				</div>

				<!-- 시작 시간 -->
				<div
					class="bg-neutral-900 rounded-lg
							border border-neutral-700
							shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
							flex flex-col items-center justify-center"
				>
					<span class="text-[0.65rem] text-neutral-400">Start</span>
					<span class="font-digital text-sm">
						{$timerStatus.startTime.slice(0, 5)}
					</span>
				</div>

				<!-- 목표 종료 시간 -->
				<div
					class="bg-neutral-900 rounded-lg
							border border-neutral-700
							shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
							flex flex-col items-center justify-center"
				>
					<span class="text-[0.65rem] text-neutral-400">Goal</span>
					<span class="font-digital text-sm">
						{$timerStatus.endTime.slice(0, 5)}
					</span>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<Button
			onclick={() => {
				resetTimerStatus();
				$timerOpen = false;
			}}
			class="font-digital text-2xl font-bold text-neutral-900"
		>
			No Record, Back to the Setting
		</Button>
	</div>
{/if}
