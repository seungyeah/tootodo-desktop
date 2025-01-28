<script lang="ts">
   import { Button, Badge } from "$ui";
   import { Plus, RotateCcw } from "lucide-svelte";

   let { tagGroup } = $props();
</script>

<div class="m-2 bg-white border rounded-lg shadow border-zinc-500">
   <div
      class="flex justify-between w-full px-2 py-1 border-b border-dashed rounded-none border-zinc-500"
   >
      
      <div class="w-full h-full text-sm font-bold translate-y-0.5">
         {tagGroup.name}
      </div>
      <Button
         class="z-10 w-7 h-6 p-0.5 shadow  "
         variant="ghost"><RotateCcw size={15} /></Button
      >
   </div>
   <!-- values -->
   <div 
   class="flex gap-0.5 flex-wrap w-full px-2.5 py-1 bg-white rounded-md text-zinc-700"

   >
      {#each tagGroup.tags as tag}
         <Badge
            class="m-0.5 w-auto font-medium rounded-md data-[selected]:bg-zinc-400 "
            style={`background-color: ${tagGroup.color};`}
         >
            {tag}
         </Badge>
      {/each}
   </div>
</div>
