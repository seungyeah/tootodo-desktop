<script lang="ts">
	import { VisSingleContainer, VisDonut } from '@unovis/svelte';
	import Clock from './Clock.svelte';
	import PomoIcon from '$components/PomoIcon.svelte';
	export let dataIn: number[] = [40,0,20]

  const value = (d: number) => d;
  const colorIn = (d: number, i: number) => ['#D92B3A','#022c22','#F8ECEC'][i]
</script>

<div class="w-full h-full relative -translate-y-6 ">
	
		<div class=" absolute z-10 -translate-x-[5px] translate-y-[5px]">
			<VisSingleContainer data = {dataIn} class="w-full h-full">
				<VisDonut {value} color={colorIn} radius={92} arcWidth={0} showEmptySegments={true} emptySegmentAngle={Math.PI / 50}/>
			</VisSingleContainer>
		</div>

		<div class="translate-y-2.5 scale-95">
			<Clock />
		</div>

	
</div>
