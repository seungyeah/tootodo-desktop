<script lang="ts">
   import { Badge } from "$ui";
   import SelectGroup from "../SelectGroup.svelte";
   let xValue = "undefined";
   let yValue = "";
   export let tagGroups;
   $: xGroup = tagGroups.find((f) => f.name === xValue);
   $: yGroup = tagGroups.find((f) => f.name === yValue);
</script>

<div
   class="axis !border-b-4 text-sm"
>
   X
   <SelectGroup bind:value={xValue} {tagGroups} class="my-2" />
   {#if xValue}
      {#each xGroup.tags as tag}
         <Badge
            class="m-0.5 w-auto font-medium rounded-md data-[selected]:bg-zinc-400 "
            style={`background-color: ${xGroup.color};`}
         >
            {tag}
         </Badge>
      {/each}
   {/if}
</div>

<div
   class="axis !border-l-4 text-sm"
>
   Y
   <SelectGroup bind:value={yValue} {tagGroups} class="my-2" />
   {#if yValue}
   {#each yGroup.tags as tag}
      <Badge
         class="m-0.5 w-auto font-medium rounded-md data-[selected]:bg-zinc-400 "
         style={`background-color: ${yGroup.color};`}
      >
         {tag}
      </Badge>
   {/each}
{/if}
</div>

<style>
   .axis {
      @apply min-h-24  font-bold p-2 m-2 bg-white border border-dashed rounded-lg shadow border-zinc-500 hover:bg-zinc-50
   }
</style>