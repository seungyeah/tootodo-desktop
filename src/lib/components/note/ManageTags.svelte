<script lang="ts">
   import { Button, Badge } from "$ui";
   import { Droplet, Plus, X } from "lucide-svelte";

   export let prop = {
      label: "tags",
      options: [
         "FE",
         "BE",
         "DB",
         "DevOps",
         "Design",
         "Marketing",
         "Sales",
         "HR",
         "Management",
         "Others",
      ],
   };
   import { createTagsInput, melt } from "@melt-ui/svelte";

   const {
      elements: { root, input, tag, deleteTrigger, edit },
      states: { tags },
   } = createTagsInput({
      defaultTags: ["Svelte", "Typescript"],
      unique: true,
      add(tag) {
         return { id: tag, value: tag };
      },
      addOnPaste: true,
   });
</script>

<div class="m-2 bg-white border rounded-lg shadow border-zinc-500">
   <div class="flex flex-col items-start justify-center gap-2">
      <div
         class="flex w-full px-2 py-1 space-x-2 border-b border-dashed rounded-none border-zinc-500"
      >
      <Button class="z-10 w-7 h-6 p-0.5 shadow" variant="ghost"
            ><Droplet size={15} /></Button
         >
         <div class="w-full h-full text-[0.9rem] font-bold">
            {prop.label}
         </div>
         
      </div>
      <div
         use:melt={$root}
         class="flex flex-row flex-wrap w-full gap-2 px-3 py-1 bg-white rounded-md text-zinc-700"
      >
         {#each $tags as t}
            <div
               use:melt={$tag(t)}
               class="flex items-center overflow-hidden rounded-md bg-zinc-200 text-zinc-900 [word-break:break-word]
       data-[disabled]:bg-zinc-300 data-[selected]:bg-zinc-400 data-[disabled]:hover:cursor-default
         data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
            >
               <span class="flex items-center border-r border-white/10 px-1.5"
                  >{t.value}</span
               >
               <button
                  use:melt={$deleteTrigger(t)}
                  class="flex items-center h-full px-1 enabled:hover:bg-zinc-300"
               >
                  <X size={14} />
               </button>
            </div>
            <div
               use:melt={$edit(t)}
               class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500"
            />
         {/each}

         <input
            use:melt={$input}
            type="text"
            placeholder="Add tag..."
            class="min-w-[4.5rem] p-1 shrink grow basis-0 border-0 text-black outline-none focus:shadow focus:ring-2 focus:ring-zinc-900 focus:rounded-sm data-[invalid]:text-red-500"
         />
      </div>
   </div>
</div>
