<script lang="ts">
	import { Separator } from "$ui";
	import {cn} from "$lib/utils";
	export let openSide = true;
</script>

<div class="h-full m-2">
	<Separator class="my-2.5" />
	<div
		class="fixed top-5 right-0 z-10 w-[calc(100%-504px)] -translate-x-[20px]"
	>
		<slot name="nav" />
	</div>
	<div
		class="flex h-[calc(100%-1.6rem)] max-w-full items-center space-x-4 text-sm"
	>
		<!-- side -->
		{#if openSide}
			<div
				class=" flex h-full w-2/5 min-w-[260px] max-w-[360px] flex-col items-center justify-start bg-zinc-50"
			>
				<slot name="side" />
			</div>
		{/if}

		<slot name="options" class="h-full" />

		<!-- main: itemlist -->
		<div
			class={cn("flex w-full h-full  p-2 space-x-2 overflow-x-auto overflow-y-clip border-4 border-double rounded-lg shadow-md border-zinc-100 shadow-zinc-400", {
				"max-w-[calc(100%-260px)]": openSide,
				"max-w-full": !openSide,
			})}
		>
			<slot name="main" />
		</div>
	</div>
</div>
