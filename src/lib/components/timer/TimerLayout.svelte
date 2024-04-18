<script lang="ts">
	import { VisSingleContainer, VisDonut } from '@unovis/svelte';
	import Clock from './Clock.svelte';
	export let dataIn: number[] = [40,20]
	export let dataOut: number[] = [80,20]

  const value = (d: number) => d;
  const colorIn = (d: number, i: number) => ['#D92B3A','#022c22'][i]
  const colorOut = (d: number, i: number) => ['#022c22','#D92B3A'][i]
</script>

<div class="w-full h-full relative">
	<div class="absolute w-full h-full scale-90 translate-y-2.5">
		<Clock />
	</div>
	<div class="absolute h-full w-full">
		<div class="chart opacity-40">
			<VisSingleContainer data = {dataOut} class="w-full h-full">
				<VisDonut {value}  color={colorOut} radius={210} arcWidth={20} />
			</VisSingleContainer>
		</div>
		<div class="chart opacity-70">
			<VisSingleContainer data = {dataIn} class="w-full h-full">
				<VisDonut {value} color={colorIn} radius={135} arcWidth={0}/>
			</VisSingleContainer>
		</div>
	</div>

	
</div>

<style>
	.chart{
		@apply absolute w-full h-full 
	}
</style>