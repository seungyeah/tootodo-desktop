<script lang="ts">
	import { Separator } from '$ui';
	import TipTapEditor from '$components/TipTapEditor.svelte';
</script>

<div class="m-2 h-full">
	<Separator class="my-3" />
	<div class="flex h-5 items-center space-x-4 text-sm">
		<div class="w-2/5 text-lg font-bold">Schedule</div>
		<Separator orientation="vertical" />
		<div class="h-full w-3/5 text-lg font-bold">
			Diary
			<TipTapEditor />
		</div>
		<Separator orientation="vertical" />
		<div class="w-1/4 text-lg font-bold">Timer Record</div>
	</div>
</div>
