<script lang="ts">
	import { Button } from '$ui';
	import PomoIcon from '$components/PomoIcon.svelte';
	import TimerLayout from './TimerLayout.svelte';
	import { ArrowUp, Pause, Play, StepBack, StepForward } from 'lucide-svelte';
	import {
		currentTime,
		formatTime,
		timerOpen,
		timerSetting,
		timerStatus,
		timerStopTime
	} from '$store';
	import Separator from '$ui/separator/separator.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Time } from '@internationalized/date';

	let worker: Worker;

	let leftSecondsDefault = 25;
	let stopSeconds = 0;
	let sessionSwitched = false;
	let records = [{ startTime: '', endTime: '', done: false, leftTime: 25, studyTime: 0 }];

	onMount(async () => {
		await initWebWorker();

		if ($timerStatus.cycle === 0) {
			// 타이머 초기화
			records = $timerSetting.cycles;
			leftSecondsDefault = $timerSetting.working * 60;
			$timerStatus = {
				play: true,
				workSession: true,
				cycle: 1,
				startTime: records[0].startTime,
				endTime: records[0].endTime,
				leftTime: leftSecondsDefault,
				studyTime: 0
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
		// console.log('Timer is destroyed');
		await resetTimer();
		worker.terminate();

		// 타이머가 사라질 때의 시간 저장. 다음에 타이머를 다시 열었을 때, 이 시간을 기준으로 타이머를 재개
		$timerStopTime = Date.now();
	});

	async function initWebWorker() {
		if (typeof window !== 'undefined' && window.Worker) {
			const MyWorker = await import('$lib/worker/timer.worker?worker');
			worker = await new MyWorker.default();

			// Web Worker에서 전달한 타이머 상태 정보를 메인 스레드에서 받아 Svelte 컴포넌트의 상태를 업데이트
			worker.onmessage = async (e) => {
				$timerStatus.leftTime = e.data.leftTime || $timerStatus.leftTime;
				stopSeconds = e.data.stopTime || stopSeconds;
				if (e.data.leftTime === 0) {
					await switchSession();
				}
			};
		}
	}

	async function playTimer() {
		$timerStatus.play = true;
		worker.postMessage({ action: 'play', leftTime: $timerStatus.leftTime });
	}

	async function stopTimer() {
		$timerStatus.play = false;
		worker.postMessage({ action: 'stop', stopTime: stopSeconds, sessionSwitched });
	}

	async function resetTimer() {
		worker.postMessage({ action: 'reset' });
	}

	async function switchSession() {
		let alarmSound = new Audio('https://freesound.org/data/previews/80/80921_1022651-lq.mp3');
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
			$currentTime.getSeconds()
		);
		const endTime = startTime.add({ minutes: $timerSetting.working });

		$timerStatus = {
			play: true,
			workSession: true,
			cycle: ($timerStatus.cycle += 1),
			startTime: startTime.toString(),
			endTime: endTime.toString(),
			leftTime: leftSecondsDefault,
			studyTime: 0
		};
	}

	function resetTimerStatus() {
		$timerStatus = {
			play: true,
			workSession: true,
			cycle: 0,
			startTime: '',
			endTime: '',
			leftTime: $timerSetting.working * 60,
			studyTime: 0
		};
	}

	function setNewRecordAt(currentCycle: number) {
		let startTime = $timerStatus.startTime;
		let endTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds()
		);

		let startTimeParts = startTime.split(':');

		let timeDiff = endTime.subtract({
			hours: +startTimeParts[0],
			minutes: +startTimeParts[1],
			seconds: +startTimeParts[2]
		});

		let timeDiffSeconds = timeDiff.hour * 3600 + timeDiff.minute * 60 + timeDiff.second;
		let duration = Math.floor((timeDiffSeconds - stopSeconds) / 60);

		// 현 cycle의 정보 저장
		records[currentCycle - 1] = {
			done: true,
			startTime,
			endTime: endTime.toString(),
			leftTime: 0,
			studyTime: duration
		};
	}

	function updateRecordsFrom(currentCycle: number) {
		let startTime = new Time(
			$currentTime.getHours(),
			$currentTime.getMinutes(),
			$currentTime.getSeconds()
		);
		let endTime = startTime.add({ minutes: $timerSetting.working });

		// 이후 cycle의 start, end 갱신
		for (let i = currentCycle; i < records.length; i++) {
			records[i] = {
				startTime: startTime.toString(),
				endTime: endTime.toString(),
				done: false,
				leftTime: leftSecondsDefault,
				studyTime: 0
			};
			startTime = endTime.add({ minutes: $timerSetting.breaking });
			endTime = startTime.add({ minutes: $timerSetting.working });
		}

		$timerSetting.cycles = records;
	}
</script>

{#if $timerOpen && records}
	<div
		class=" flex h-full w-full items-center justify-between rounded-2xl border-8 border-double border-zinc-50
	bg-zinc-800 shadow-2xl"
	>
		<!-- timer layout -->
		<div
			class="relative m-1 flex aspect-square h-full scale-90 rounded-full bg-zinc-100 p-0 shadow-xl"
		>
			<div class="h-full w-full rounded-full shadow-xl shadow-zinc-950">
				<TimerLayout />
			</div>

			<!-- play/stop -->
			<Button
				variant="secondary"
				class="absolute -left-[2.9rem] -top-7 z-50 h-[220px]  w-[220px] translate-x-1/3 translate-y-1/4
		 rounded-full  border-4  border-amber-950 bg-black/20 p-0 shadow-xl hover:bg-black/60"
				on:click={async () => {
					$timerStatus.play ? await stopTimer() : await playTimer();
				}}
			>
				{#if $timerStatus.play}
					<Pause fill="#e4e4e7" color="#e4e4e7" size={44} />
					<div class="font-digital absolute left-1/2 top-1/2 translate-x-5 font-bold text-zinc-50">
						{Math.floor($timerStatus.leftTime / 60)
							.toString()
							.padStart(2, '0')}:{($timerStatus.leftTime % 60).toString().padStart(2, '0')}
					</div>
				{:else}
					<Play fill="#e4e4e7" color="#e4e4e7" size={44} />
					<div class="font-digital absolute left-1/2 top-1/2 translate-x-5 font-bold text-zinc-400">
						{Math.floor(stopSeconds / 60)
							.toString()
							.padStart(2, '0')}:{(stopSeconds % 60).toString().padStart(2, '0')}
					</div>
				{/if}
			</Button>

			<!-- finish -->
			<Button
				variant="ghost"
				class="absolute -left-2 top-0 z-10  px-1 hover:bg-zinc-200 hover:shadow hover:shadow-zinc-50"
				on:click={async () => {
					setNewRecordAt($timerStatus.cycle);
					await resetTimer();
					resetTimerStatus();
					$timerOpen = false;
				}}><StepBack color="#52525b" fill="#52525b" size={32} /></Button
			>

			<!-- next session -->
			<Button
				variant="ghost"
				class="absolute -right-2 bottom-0 z-10  px-1  hover:bg-zinc-200 hover:shadow hover:shadow-zinc-50"
				on:click={async () => {
					await switchSession();
				}}><StepForward color="#52525b" fill="#52525b" size={32} /></Button
			>
			<div class="absolute bottom-0 flex items-end text-xs text-zinc-100">
				<PomoIcon />
				<div class="-translate-x-5">
					{$timerSetting.working} min
				</div>
			</div>
		</div>

		<!-- progress -->
		<div class="text-x relative flex h-full w-[calc(100%-290px)] flex-col py-3">
			<!-- indicator -->

			<ArrowUp class="absolute right-[3.5rem] top-2 " color="#f7d5d8" />
			<Separator
				orientation="vertical"
				class="absolute right-[4.2rem] top-4 h-[230px] border border-zinc-400"
			/>
			<ArrowUp class="absolute bottom-4 right-[3.5rem]" color="#f7d5d8" />

			<!-- status -->
			<div
				class="no-scrollbar flex h-full max-h-[calc(100%-20px)] flex-col-reverse justify-start gap-2.5 overflow-x-clip overflow-y-scroll py-1"
			>
				{#each records as record, i}
					{@const startTime = record.startTime.slice(0, 5)}
					{@const endTime = record.endTime.slice(0, 5)}
					{#key record}
						<div
							class="font-digital m-0 flex space-x-4 rounded-full border-b border-zinc-500 p-0 text-center text-sm"
						>
							<!-- pomo icon -->
							<div
								class={record.done
									? 'relative scale-125 opacity-90'
									: 'relative scale-125 opacity-30'}
							>
								<PomoIcon />
								<div class="absolute right-1 top-1 text-xs text-zinc-50">{i + 1}</div>
							</div>

							<!-- start time -->
							<div class={record.done ? ' text-zinc-500' : ' text-zinc-100'}>
								{startTime}
							</div>

							<!-- end time or current time  -->
							{#if (i === 0 || records[i - 1].done === true) && record.done === false && $timerStatus.workSession}
								<div
									class="z-10 -translate-x-0.5 -translate-y-[0.3rem] scale-[115%] rounded-lg border-4 border-dotted bg-zinc-950 px-1.5 py-0.5 text-[1rem] text-pomodoro-500 shadow-xl"
								>
									{formatTime($currentTime)}
								</div>
							{:else if !$timerStatus.workSession && i === $timerStatus.cycle - 1}
								<div
									class="z-10 -translate-x-0.5 -translate-y-[0.3rem] scale-[115%] rounded-lg border-4 border-dotted bg-zinc-950 px-1.5 py-0.5 text-[1rem] text-emerald-500 shadow-xl"
								>
									{formatTime($currentTime)}
								</div>
							{:else}
								<div class={record.done ? 'px-3 pb-1 text-zinc-500' : 'px-3 pb-1 text-zinc-100'}>
									{endTime}
								</div>
							{/if}
						</div>
					{/key}
				{/each}
			</div>

			<!-- start, end -->
			<div
				class="font-digital flex h-[22px] w-full -translate-x-1.5 justify-start text-pomodoro-300"
			>
				<div class="w-[32px]" />
				<div class="w-[60px] text-center font-extrabold">Start</div>
				<div class="w-[20px] text-center font-extrabold"></div>
				<div class=" w-[60px] text-center font-extrabold">End</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<Button
			on:click={() => {
				resetTimerStatus();
				$timerOpen = false;
			}}
			class="font-digital text-2xl font-bold text-zinc-900"
		>
			No Record, Back to the Setting
		</Button>
	</div>
{/if}
