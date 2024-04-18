<script lang="ts">
	import { Separator,ScrollArea } from '$ui';
	import TipTapEditor from '$components/TipTapEditor.svelte';
	import TenMResult from '$components/tenMTable/tenMResult.svelte';
</script>

<div class="m-2 h-full ">
	<Separator class="my-2.5" />
	<div class="flex h-[calc(100%-1.6rem)] items-center space-x-4 text-sm">
		<div class="h-full w-2/5 text-lg font-bold">
			<span class="h-[40px] text-lg font-bold"> Schedule </span>
		</div>
		<Separator orientation="vertical" />
		<div class="h-full w-3/5">
			<span class="h-[40px] text-lg font-bold"> Diary </span>
			<div class="h-full max-h-[calc(100%-20px)] overflow-clip py-1">
				<TipTapEditor />
			</div>
		</div>
		<Separator orientation="vertical" />
		<div class="h-full w-1/4 text-lg font-bold">
			<span class="h-[40px] text-lg font-bold"> Timer Record </span>
			<ScrollArea class="h-[calc(100%-30px)] border-2 border-zinc-900 rounded-lg">
				<TenMResult />
			</ScrollArea>
		</div>
	</div>
</div>
