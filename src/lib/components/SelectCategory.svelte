<script lang="ts">
   import {
      Button,
      Command,
      Popover,
      DropdownMenu,
      Label,
   } from "$ui";

   import { page } from "$app/stores";
   import { Check, ChevronsUpDown, Circle } from "lucide-svelte";
   import {  tick } from "svelte";

   import { cn } from "$lib/utils.js";
   import { tailwindColors } from "$lib/tailwindColors";
   type Category = {
      value: string;
      label: string;
      color: string;
      properties: {
         options: string[];
         label: string;
      }[];
   };
   const categories: Category[] = [
      {
         value: "tootodo",
         label: "tootodo",
         color: "#c4b5fd",
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
         color: "#c4b5fd",
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

   let selectedPage = $derived($page.url.pathname.split("/")[2]);

   let new_color_name = $state("violet");
   let new_color_hex = $state("#c4b5fd");
   let open = $state(false);
   let value = $state("tootodo");
   let selectedValue =
      $derived(categories.find((f) => f.value === value)?.label ??
      "Select a Category...");

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

<!-- header: select item -->
<div class="relative flex w-44">
   <!-- change category color -->
   <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild 
         >{#snippet children({ builder })}
                  <Button
               variant="ghost"
               builders={[builder]}
               class="absolute z-20 px-2 translate-x-1 translate-y-0 -left-3"
               ><Circle fill={new_color_hex} /></Button
            >               {/snippet}
            </DropdownMenu.Trigger
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
   <Popover.Root bind:open >
      {#snippet children({ ids })}
            <Popover.Trigger asChild >
            {#snippet children({ builder })}
                  <Button
                  builders={[builder]}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  class="z-10 w-[130px] mx-3 justify-between shadow"
               >
                  {selectedValue}
                  <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
               </Button>
                           {/snippet}
            </Popover.Trigger>
         <Popover.Content class="w-[170px] p-0 translate-y-1">
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
                        class="flex justify-between "
                     >
                        <div class="flex">
                           <Check
                              class={cn(
                                 "mr-2 h-4 w-4",
                                 value !== category.value && "text-transparent",
                              )}
                           />
                           {category.label}
                        </div>
                        <Label
                           class="w-5 h-5 border-2 rounded-full border-zinc-900"
                           style={`background: ${category.color};`}
                        ></Label>
                     </Command.Item>
                  {/each}
               </Command.Group>
            </Command.Root>
         </Popover.Content>
               {/snippet}
      </Popover.Root>
</div>
