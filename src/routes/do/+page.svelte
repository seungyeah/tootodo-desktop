<script lang="ts">
	import { Separator,ScrollArea } from '$ui';
	import TipTapEditor from '$components/TipTapEditor.svelte';
	import TenMResult from '$components/tenMTable/tenMResult.svelte';
	import Schedule from '$components/schedule/Schedule.svelte';
</script>

<div class="m-2 h-full max-h-[calc(100%-20px)] ">
	<Separator class="my-2.5" />
	<div class="flex h-[calc(100%-1.6rem)] items-center space-x-4 text-sm">
		<div class="h-full w-2/5 text-lg font-bold">
			<div class="title"> Schedule 
			</div>
			<div class="h-full overflow-clip py-1">
				<Schedule/>
			</div>
		</div>
		<Separator orientation="vertical" />
		<div class="h-full w-3/5">
			<div class="title"> Diary </div>
			<div class="h-full overflow-clip ">
				<TipTapEditor />
			</div>
		</div>
		<Separator orientation="vertical" />
		<div class="h-full w-1/4 text-lg font-bold">
			<div class="title"> Timer Record </div>
			<div class="h-[calc(100%-10px)] overflow-y-auto border-2 border-zinc-900 rounded-lg">
				<TenMResult />
			</div>
		</div>
	</div>
</div>

<style>
	.title{
		@apply h-[30px] text-lg font-bold text-center; 
	}
</style>
