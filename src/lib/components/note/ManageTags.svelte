<script lang="ts">
   import { Button, Badge } from "$ui";
   import { Droplet, Plus, X } from "lucide-svelte";
   import { createTagsInput, melt } from "@melt-ui/svelte";
   import { cn } from "$lib/utils";
   import SelectGroupColor from "./SelectGroupColor.svelte";

   export let tagGroup;
   const {
      elements: { root, input, tag, deleteTrigger, edit },
      states: { tags },
   } = createTagsInput({
      defaultTags: tagGroup.tags,
      unique: true,
      add(tag) {
         return { id: tag, value: tag };
      },
      addOnPaste: false,
   });

   //todo: tag추가시 tags에 존재하지 않는다면, 신규 tag생성. 아니라면, 동일 id및 이름을 가진 tag추가.
</script>

{#key tagGroup}
   <div class="m-2 bg-white border rounded-lg shadow border-zinc-500">
      <div class="flex flex-col items-start justify-center gap-2">
         <div
            class="flex w-full px-2 py-1 space-x-2 border-b border-dashed rounded-none border-zinc-500"
         >
            <Button class="z-10 w-7 h-6 p-0.5 shadow" variant="ghost"
               ><SelectGroupColor {tagGroup} class="text-zinc-400 scale-90" icon={Droplet}/></Button
            >            
            <div class="w-full h-full text-sm translate-y-0.5 font-bold">
               {tagGroup.name}
            </div>
         </div>

         <div
            use:melt={$root}
            class="flex gap-1.5 -translate-y-0.5 flex-wrap w-full px-2.5 py-1 bg-white rounded-md text-zinc-700"
            
         >
            {#each $tags as t}
               <div
                  use:melt={$tag(t)}
                  class="flex items-center overflow-hidden rounded-md [word-break:break-word]"
               >
                  <Badge
                     class="flex h-5 items-center font-medium border-r rounded-md border-white/10 px-1.5 bg-inherit rounded-r-none"                     
                     style={`background-color: ${tagGroup.color};`}
                     >{t.value}</Badge
                  >
                  <button
                     use:melt={$deleteTrigger(t)}
                     class="flex items-center h-5 px-1 enabled:hover:bg-zinc-300 rounded-r-md"                     
                     style={`background-color: ${tagGroup.color};`}
                  >
                     <X size={14} />
                  </button>
               </div>
               <div
                  use:melt={$edit(t)}
                  class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word]
                data-[invalid-edit]:focus:!ring-red-500"
               />
            {/each}

            <input
               use:melt={$input}
               type="text"
               placeholder="Add tag..."
               class="font-mono min-w-[4.5rem] p-1 shrink grow basis-0 border-0 text-black outline-none focus:shadow focus:ring-2 focus:ring-zinc-900 focus:rounded-sm data-[invalid]:text-red-500"
            />
         </div>
      </div>
   </div>
{/key}
