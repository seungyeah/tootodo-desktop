<script lang="ts">
	import { Separator, Switch, Label} from '$ui';
	import TipTapEditor from '$components/TipTapEditor.svelte';
	import TenMResult from '$components/tenMTable/tenMResult.svelte';
	import Schedule from '$components/schedule/Schedule.svelte';
	import { fly,slide} from 'svelte/transition';
	import Memo from '$components/memo/Memo.svelte';
	let showSchedule = false;
</script>

<div class="m-2 h-full">
	<Separator class="my-2.5" />
	<div class="flex h-[calc(100%-1.6rem)] items-center space-x-4 text-sm">

		<!-- schedule or memo -->
		<div class="h-full w-2/5 max-w-[400px] min-w-[210px] text-lg font-bold relative">
			<Switch bind:checked={showSchedule}
				class="absolute -right-1 m-1 scale-90 data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-100 shadow-sm shadow-amber-200"/>			

			{#if showSchedule}
				<div transition:fly={{delay: 100, duration: 600, x:-100}}>
					<div class="title">Schedule</div>
					<div class="side-container">
						<Schedule />
					</div>
				</div>
			{:else}
			<div transition:slide={{delay: 100, duration: 600}}>
					<div class="title">Memo</div>
					<div class="side-container">
						<Memo/>      
					</div>
				</div>
			{/if}
		</div>
		<!-- <Separator orientation="vertical" /> -->
		<div
			class="flex h-[calc(100%-7px)] w-full space-x-2 rounded-lg border-4 border-double border-zinc-100 p-2 shadow-lg shadow-zinc-500"
		>
			<div class="h-full w-full">
				<div class="title">Diary</div>
				<div class="h-full overflow-clip">
					<TipTapEditor />
				</div>
			</div>
			<div class="h-full w-1/3 text-lg font-bold">
				<div class="title">Timer Record</div>
				<div class="h-[calc(100%-30px)] overflow-y-auto rounded-lg border-2 border-zinc-900">
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
		@apply h-full py-1 border-b-4 border-double border-zinc-900;
	}
	
</style>
