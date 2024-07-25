<script lang="ts">
   import {
      Plus,
      RotateCcw,
   } from "lucide-svelte";
   import { onMount, tick } from "svelte";
   import {
      Badge,
      Button,
      Switch,
      Label,
   } from "$ui";
   type Category = {
      value: string;
      label: string;
      properties: {
         options: string[];
         label: string;
      }[];
   };
   const categories: Category[] = [
      {
         value: "tootodo",
         label: "tootodo",
         properties: [
            {
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
            },
            {
               label: "status",
               options: ["Todo", "Doing", "Done"],
            },
         ],
      },
      {
         value: "english",
         label: "English",
         properties: [
            {
               label: "tags",
               options: [
                  "Vocabulary",
                  "Grammar",
                  "Listening",
                  "Speaking",
                  "Reading",
                  "Writing",
                  "Others",
               ],
            },
            {
               label: "status",
               options: ["Todo", "Doing", "Done"],
            },
         ],
      },
   ];
   let new_color_name = "violet";
   let new_color_hex = "#c4b5fd";
   let open = false;
   let value = "tootodo";
   $: selectedValue =
      categories.find((f) => f.value === value)?.label ??
      "Select a Category...";

   // We want to refocus the trigger button when the user selects
   // an item from the list so users can continue navigating the
   // rest of the form with the keyboard.
   function closeAndFocusTrigger(triggerId: string) {
      open = false;
      tick().then(() => {
         document.getElementById(triggerId)?.focus();
      });
   }
</script>

<div
   class="category relative flex h-full min-w-[240px] max-w-[360px] flex-col items-center justify-start text-lg font-bold"
   style={`background-color: rgb(var(--bg-light-${new_color_name}) / 0.35)`}
>
   <!-- properties -->
   <div class="flex flex-col space-y-2">
      <!-- filter -->
      <div
         class="flex justify-between w-full pt-1.5 pb-2 space-x-1 border-b-4 border-double border-zinc-500"
      >
         <!-- filter web -->
         <div class="flex items-center w-full mx-2 space-x-2">
            <Switch
               id="web"
               class="scale-90 data-[state=checked]:bg-zinc-600"
            />
            <Label for="web" class="text-xs font-semibold ">On Web</Label>
         </div>
         <div class="absolute flex h-6 space-x-2 right-2">
            <!-- reset filter -->
            <Button variant="ghost" class="bg-pomodoro-800/70  h-6 px-1.5 shadow hover:bg-pomodoro-900"
               ><RotateCcw size={16} color="white" /></Button
            >
            <!-- add property -->
            <Button variant="ghost" class="h-6 px-1 bg-white shadow "
               ><Plus color="#a1a1aa" /></Button
            >
         </div>
      </div>
      <!-- props-->
      {#if selectedValue}
         {@const category = categories.find((f) => f.value === value)}
         {#if category}
            {#each category.properties as prop}
               <div class="m-2 bg-white rounded-lg">
                  <Button
                     class="justify-between w-full border-b-2 rounded-none"
                  >
                     {prop.label}
                     <Button
                        class="absolute z-10 px-2 scale-75 shadow right-2"
                        variant="ghost"><Plus /></Button
                     >
                  </Button>
                  <!-- values -->
                  <div class="p-2">
                     {#each prop.options as option}
                        <Badge class="mx-0.5 w-auto" variant="outline">
                           {option}
                        </Badge>
                     {/each}
                  </div>
               </div>
            {/each}
         {/if}
      {/if}
   </div>
</div>


