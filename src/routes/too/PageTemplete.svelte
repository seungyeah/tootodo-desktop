<script lang="ts">
	import { Separator } from '$ui';
</script>

<div class="h-full m-2">
	<Separator class="my-2.5" />
	<div class="fixed top-5 z-10 w-[calc(100%-150px)] translate-x-1/2">
		<slot name="nav" />
	</div>
	<div class="flex h-[calc(100%-1.6rem)] max-w-full overflow-x-clip items-center space-x-4 text-sm">
		<!-- side -->
		<div
			class=" flex h-full w-2/5 min-w-[260px] max-w-[360px] flex-col items-center justify-start bg-zinc-50"
		>
			<slot name="side" />
		</div>

		<slot name="options" class="h-full" />

		<!-- main: itemlist -->
		<div
			class="flex w-full h-full max-w-[calc(100%-260px)] p-2 space-x-2 overflow-x-auto border-4 border-double rounded-lg shadow-md border-zinc-100 shadow-zinc-400"
		>
			<slot name="main" />
		</div>
	</div>
</div>
