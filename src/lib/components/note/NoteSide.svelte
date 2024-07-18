<script lang="ts">
   import {
      Check,
      ChevronsUpDown,
      Circle,
      Plus,
      PlusCircle,
      RotateCcw,
      SquarePlus,
   } from "lucide-svelte";
   import { onMount, tick } from "svelte";
   import {
      Badge,
      Button,
      Command,
      Popover,
      DropdownMenu,
      Switch,
      Label,
   } from "$ui";
   import { cn } from "$lib/utils.js";
   import { tailwindColors } from "$lib/tailwindColors";
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
   style={`background-color: rgb(var(--color-${new_color_name}-50) / 0.35);`}
>
   <div class="absolute top-0 w-full h-2 bg-white" />
   <div class="flex w-full">
      <!-- change category color -->
      <DropdownMenu.Root>
         <DropdownMenu.Trigger asChild let:builder
            ><Button
               variant="ghost"
               builders={[builder]}
               class="px-2 translate-x-1 translate-y-2"
               ><Circle fill={new_color_hex} /></Button
            ></DropdownMenu.Trigger
         >
         <DropdownMenu.Content class="bg-white w-[360px]">
            <DropdownMenu.Label>Category Color</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
               <DropdownMenu.Item
                  class="grid grid-cols-13 data-[highlighted]:bg-zinc-50"
               >
                  {#each tailwindColors as color}
                     <div class="col-span-2 mr-2 text-xs font-digital">
                        {color.name}
                     </div>

                     {#each color.shades as shade}
                        <Button
                           class="w-5 h-5 p-2 m-2"
                           style={`background-color: ${shade.hex};`}
                           on:click={() => {
                              new_color_hex = shade.hex;
                              new_color_name = color.name.toLowerCase();
                           }}
                        />
                     {/each}
                  {/each}
               </DropdownMenu.Item>
            </DropdownMenu.Group>
         </DropdownMenu.Content>
      </DropdownMenu.Root>

      <!-- select category -->
      <Popover.Root bind:open let:ids>
         <Popover.Trigger asChild let:builder>
            <Button
               builders={[builder]}
               variant="outline"
               role="combobox"
               aria-expanded={open}
               class="z-10 w-min-[220px] w-full mx-3 justify-between shadow"
            >
               {selectedValue}
               <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
         </Popover.Trigger>
         <Popover.Content class="w-[200px] p-0">
            <Command.Root>
               <Command.Input placeholder="Select Category" />
               <Command.Empty>No Category found.</Command.Empty>
               <Command.Group>
                  {#each categories as category}
                     <Command.Item
                        value={category.value}
                        onSelect={(currentValue) => {
                           value = currentValue;
                           closeAndFocusTrigger(ids.trigger);
                        }}
                     >
                        <Check
                           class={cn(
                              "mr-2 h-4 w-4",
                              value !== category.value && "text-transparent",
                           )}
                        />
                        {category.label}
                     </Command.Item>
                  {/each}
               </Command.Group>
            </Command.Root>
         </Popover.Content>
      </Popover.Root>
   </div>
   
   <!-- properties -->
   <div class="flex flex-col space-y-2">
      <!-- filter -->
      <div
         class="flex justify-between w-full pt-1.5 mt-2.5 space-x-1 border-t-4 border-double border-zinc-500"
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

<style>
   :root {
      --color-red-50: 254 242 242;
      --color-orange-50: 255 247 237;
      --color-amber-50: 255 251 235;
      --color-yellow-50: 254 252 232;
      --color-lime-50: 247 254 231;
      --color-green-50: 240 253 244;
      --color-emerald-50: 236 253 245;
      --color-teal-50: 240 253 250;
      --color-cyan-50: 236 254 255;
      --color-sky-50: 240 249 255;
      --color-blue-50: 239 246 255;
      --color-indigo-50: 238 242 255;
      --color-violet-50: 245 243 255;
      --color-purple-50: 250 245 255;
      --color-fuchsia-50: 253 244 255;
      --color-pink-50: 253 242 248;
      --color-rose-50: 255 241 242;
   }
</style>
