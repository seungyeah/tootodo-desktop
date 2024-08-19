<script lang="ts">
	import {  Label, Badge } from "$ui";
	export let note;
	// $: console.log(note);
</script>

{#if note}
	<div class="flex flex-col items-start justify-center w-full h-full space-y-1">
		<Label class="w-full line-clamp-1">
			{note.title}
		</Label>

		<div class="flex space-x-1 -translate-x-1">
			{#each note.tags as tag}
				<Badge class="h-4 shadow-sm translate-y-0.5 font-mono px-1.5 py-0 text-xs font-medium border rounded-md border-b-zinc-200 border-r-zinc-200"
						style="border-bottom-color:{tag.color};border-right-color:{tag.color}">{tag.name}</Badge>
			{/each}
		</div>
	</div>
{/if}
