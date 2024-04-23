<script lang="ts">
	import { VisSingleContainer, VisDonut } from '@unovis/svelte';
	import Clock from './Clock.svelte';
	import PomoIcon from '$components/PomoIcon.svelte';
	export let dataIn: number[] = [40,0,20]

	export let workSession = true;
  const value = (d: number) => d;
  const colorWorking = (d: number, i: number) => ['#c32734','#09090b','#501016'][i] //pomodoro 600,950
  const colorBreaking = (d: number, i: number) => ['#059669','#09090b','#022c22'][i]; //indigo 600, 950

</script>

<div class="w-full h-full relative -translate-y-6 ">
	
		<div class=" absolute z-10 -translate-x-[13px] translate-y-[11px]">
			<VisSingleContainer data = {dataIn} class="w-full h-full">
				<VisDonut {value} color={workSession? colorWorking: colorBreaking} radius={94} arcWidth={0} showEmptySegments={true} emptySegmentAngle={Math.PI / 50}/>
			</VisSingleContainer>
		</div>

		<div class="translate-y-6 ">
			<Clock />
		</div>

	
</div>
