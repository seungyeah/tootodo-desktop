<script>
   import { Button,Badge } from "$ui";
   import { Plus, Settings } from "lucide-svelte";

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
</script>

<div class="m-2 bg-white border rounded-lg shadow border-zinc-500">
   <div
      class="flex justify-between w-full px-2 py-1 border-b border-dashed rounded-none border-zinc-500"
   >
      <div class="w-full h-full text-[0.9rem] font-bold ">
         {prop.label}
      </div>
      <Button
         class="z-10 w-7 h-6 p-0.5 shadow"
         variant="ghost"><Settings size={15}  /></Button
      >
   </div>
   <!-- values -->
   <div class="w-full p-2">
      {#each prop.options as option}
         <Badge class="m-0.5 w-auto" variant="outline">
            {option}
         </Badge>
      {/each}
   </div>
</div>