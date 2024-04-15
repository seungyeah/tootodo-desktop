<script lang="ts">
	import { Chart, LinearGradient, Svg, Arc, Group } from 'layerchart';
	import Clock from '$components/timer/Clock.svelte';
	import { onMount } from 'svelte';
	let duration = 0;
	onMount(() => {
		duration = leftDuration;
	});
	export let leftDuration = 0;
	export let leftSessionTime = 0;
</script>

<div class="w-full h-full p-4 border rounded relative">
	<div class="absolute top-0 opacity-50 right-0 h-full w-full p-4 scale-[90%]">
		<Chart>
			<Svg>
				<Group center>
					<LinearGradient stops={['#4c1d95', '#c4b5fd']} horizontal let:url>
						<Arc
							value={leftSessionTime}
							domain={[0, 60]}
							range = {[360,0]}
							innerRadius={0}
							outerRadius={170}
							fill={url}
							track={{ fill: 'hsl(0 0% 0% / 6% )' }}
						></Arc>
					</LinearGradient>

					<LinearGradient stops={['#2e1065', '#c4b5fd']} horizontal let:url>
						<Arc
							value={(duration-leftDuration)/duration*100}
							domain={[0, 100]}
							range = {[0,360]}
							innerRadius={195}
							outerRadius={240}
							fill={url}
							track={{ fill: 'hsl(0 0% 0% / 6% )' }}
						></Arc>
					</LinearGradient>
				</Group>
			</Svg>
		</Chart>
	</div>

	<div class="z-10 w-full h-full">
		<Clock />
	</div>
</div>
