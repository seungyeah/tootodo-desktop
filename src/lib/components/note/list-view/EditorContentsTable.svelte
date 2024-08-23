<script lang="ts">
	import { cn } from "$lib/utils";
	import { Label, Badge, Dialog, Button, ScrollArea, Tabs, Table } from "$ui";
	import { ListTree, Text } from "lucide-svelte";
	import Input from "$ui/input/input.svelte";
	export let pages;
	export let size = "sm";
</script>

<div
	class="flex flex-col h-full bg-white justify-start mb-2 p-2 space-x-1 rounded-md"
>
	<div class="h-7 flex justify-between">
		<div>
			<Badge class="bg-pomodoro-900/10 rounded-none">Contents</Badge>
		</div>
		{#if size === "lg"}
			<div>
				<Button
					variant="outline"
					class="h-6 border-2 border-double px-2.5  ">+ Property</Button
				>
			</div>
		{/if}
	</div>

	<!-- editable table -->
	<ScrollArea
		class="w-full h-full border-double border-y-2 border-pomodoro-950/90 max-h-[calc(100%-20px)] overflow-scroll"
	>
		<table class="w-full">
			<thead>
				<tr class="w-full border-b text-center">
					<th class=" text-center border-r"></th>
					<th class="px-2">Title</th>
				</tr>
			</thead>
			<tbody class="h-10">
				{#each pages as page}
					<tr class="">
						<th class="text-xs text-center">
							{#if page.type === "page"}
								<ListTree size={14} />
							{:else}
								<svelte:component this={Text} size={14} />
							{/if}
							<!-- <span class="bg-zinc-100 rounded-sm px-1.5 py-0.5">
								{page.type.slice(0,1).toUpperCase()}</span
							> -->
						</th>
						<td class="!m-0 !px-1 !pr-1.5"
							><Input
								value={page.title || "undefined"}
								class="border-0 border-b h-7"
							/></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</ScrollArea>
</div>
