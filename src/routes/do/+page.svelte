<script lang="ts">
	import { Separator, Switch, Label, Button} from '$ui';
	import Diary from '$components/diary/Diary.svelte';
	import TenMResult from '$components/tenMTable/tenMResult.svelte';
	import Schedule from '$components/schedule/Schedule.svelte';
	import { fly,slide,scale} from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Memo from '$components/memo/Memo.svelte';
	import { MoonStar, Share } from 'lucide-svelte';
	let showSchedule = true;
	let openSide = true;
</script>

<div class="m-2 h-full">
	<Separator class="my-2.5" />
	<div class="flex h-[calc(100%-1.6rem)] items-center space-x-4 text-sm">
		<!-- side: schedule or memo -->
		{#if openSide}
		<div class="h-full w-2/5 max-w-[360px] min-w-[240px] text-lg font-bold relative "		
			transition:scale={{ duration: 600, delay: 400, opacity: 0.2, start: 0.1, easing: quintOut }}
		>
			<Switch bind:checked={showSchedule}
				class="absolute -right-1 m-1 scale-90 shadow-sm shadow-zinc-200
				data-[state=checked]:bg-zinc-100 data-[state=unchecked]:bg-zinc-200 "/>			

			{#if showSchedule}
				<div transition:fly={{delay: 100, duration: 600, x:-100}} class="h-full w-full">
					<div class="title">Schedule</div>
					<div class="side-container">
						<Schedule />
					</div>
				</div>
			{:else}
			<div transition:slide={{delay: 100, duration: 600}}  class="h-full w-full">
					<div class="title">Memo</div>
					<div class="side-container">
						<Memo/>      
					</div>
				</div>
			{/if}
		</div>
		{/if}

		<!-- main: diary & timer record result -->
		<div
			class="flex h-[calc(100%-8px)] w-full space-x-2 
			rounded-lg border-4 border-double border-zinc-100 p-2 
			shadow-lg shadow-zinc-500"
		>
			<div class="w-full relative">			
				<button on:click={()=>openSide = !openSide} class="rounded-full absolute -left-2 z-10 
					hover:-rotate-90 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-violet-200">
					<MoonStar fill="black"  />	
				</button>
				<div class="h-full overflow-clip">
					<Diary/>
				</div>
			</div>
			<!-- timer -->
			<div class="h-full flex flex-col items-end  w-1/3 text-lg font-bold max-w-[220px] xl:max-w-[300px] min-w-[190px]">
				<div class="title flex">
					<div class="font-digital text-zinc-800">05H 30M</div>
					<Button variant="ghost" class="z-10 px-2 py-0 -translate-y-1.5 translate-x-1 hover:bg-transparent 
					hover:shadow-lg hover:shadow-zinc-400 hover:-translate-y-2.5 rounded-full">
						<Share strokeWidth={3} size={20} />
					</Button>
				</div>
				<div class="h-[calc(100%-30px)] w-full overflow-y-auto overflow-x-clip no-scrollbar rounded-lg border-2 border-zinc-700">
					<TenMResult />
				</div>
			</div>
		</div>
	</div>


</div>

<style>
	.title {
		@apply h-[30px] text-center text-lg font-bold;
	}

	.side-container{
		@apply h-[calc(100%-30px)] w-full py-1.5 border-b-4 border-double border-zinc-900;
	}
	
</style>
