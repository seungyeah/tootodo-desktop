<script lang="ts">
	import { run } from "svelte/legacy";

	import Clock from "./Clock.svelte";
	import { timerSetting, timerStatus, timerOpen } from "$store";
	import Dougnut from "./Dougnut.svelte";
	let leftMinutes = $derived(
		($timerStatus.leftTime / 60) % 60 || $timerSetting.working % 60,
	);
	let data;
	run(() => {
		data = [leftMinutes, 0, 60 - leftMinutes];
	});
	// $:console.log(leftMinutes);
	// $:console.log($timerStatus.workSession);
	const value = (d: number) => d;
	const colorWorking = (d: number, i: number) =>
		["#c32734", "#09090b", "#501016"][i]; //pomodoro 600,950
	const colorBreaking = (d: number, i: number) =>
		["#059669", "#09090b", "#022c22"][i]; //indigo 600, 950
</script>

<div
	class="relative h-full w-full -translate-y-6 hidden"
	class:openTimer={$timerOpen}
>
	<div class=" absolute z-10 translate-x-[37px] translate-y-[61px]">
		<Dougnut
			bind:data
			color={$timerStatus.workSession ? colorWorking : colorBreaking}
		/>
	</div>

	<div class="translate-y-6">
		<Clock />
	</div>
</div>

<style>
	.openTimer {
		display: block;
	}
</style>
