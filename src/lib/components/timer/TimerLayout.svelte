<script lang="ts">
	import { VisSingleContainer, VisDonut } from '@unovis/svelte';
	import Clock from './Clock.svelte';
	import { timerSetting, timerStatus } from '$store';
	
	$:leftMinutes = ($timerStatus.leftTime/60)%60 || $timerSetting.working%60;
	$: data= [leftMinutes, 0, 60-leftMinutes];
	// $:console.log(leftMinutes);
	// $:console.log($timerStatus.workSession);
	const value = (d: number) => d;
	const colorWorking = (d: number, i: number) => ['#c32734', '#09090b', '#501016'][i]; //pomodoro 600,950
	const colorBreaking = (d: number, i: number) => ['#059669', '#09090b', '#022c22'][i]; //indigo 600, 950
</script>

<div class="relative h-full w-full -translate-y-6">
	{#key $timerStatus.workSession}
		<div class=" absolute z-10 -translate-x-[13px] translate-y-[11px]">
			<VisSingleContainer {data} class="h-full w-full">
				<VisDonut
					{value}
					color={$timerStatus.workSession ? colorWorking : colorBreaking}
					radius={94}
					arcWidth={0}
					showEmptySegments={true}
					emptySegmentAngle={Math.PI / 50}
				/>
			</VisSingleContainer>
		</div>
	{/key}

	<div class="translate-y-6 ">
		<Clock />
	</div>
</div>
