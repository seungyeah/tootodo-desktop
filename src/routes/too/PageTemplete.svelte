<script lang="ts">
	import { Separator } from '$ui';
</script>

<div class="m-2 h-full">
	<Separator class="my-2.5" />
	<div class="flex h-[calc(100%-1.6rem)] items-center space-x-4 text-sm">
		<!-- side -->
		<div
			class=" flex h-full w-2/5 min-w-[240px] max-w-[360px] flex-col items-center justify-start bg-zinc-50"
		>
			<slot name="side" />
		</div>

		<slot name="options" class="h-full" />
		<!-- main: tasklist -> task -->
		<div
			class="flex h-full w-full space-x-2 
			rounded-lg border-4 border-double border-zinc-100 p-2
			shadow-lg shadow-zinc-500"
		>
			<slot name="main" />
		</div>
	</div>
</div>
