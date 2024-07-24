<script lang="ts">
   import {
      ToggleGroup,
      Button,
      Command,
      Popover,
      DropdownMenu,
      Label,
   } from "$ui";
   import { goto } from "$app/navigation";

   import { page } from "$app/stores";
   import { Check, ChevronsUpDown, Circle } from "lucide-svelte";
   import { onMount, tick } from "svelte";

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

   $: selectedPage = $page.url.pathname.split("/")[2];

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

<!-- header: select item -->
<div class="relative flex w-44">
   <!-- change category color -->
   <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder
         ><Button
            variant="ghost"
            builders={[builder]}
            class="absolute z-20 px-2 translate-x-1 translate-y-0 -left-3"
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
            class="z-10 w-[130px] mx-3 justify-between shadow"
         >
            {selectedValue}
            <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
         </Button>
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
   </Popover.Root>
</div>

<style>
   :root{
      --bg-light-red: 254 242 242;
      --bg-light-orange: 255 247 237;
      --bg-light-amber: 255 251 235;
      --bg-light-yellow: 254 252 232;
      --bg-light-lime: 247 254 231;
      --bg-light-green: 240 253 244;
      --bg-light-emerald: 236 253 245;
      --bg-light-teal: 240 253 250;
      --bg-light-cyan: 236 254 255;
      --bg-light-sky: 240 249 255;
      --bg-light-blue: 239 246 255;
      --bg-light-indigo: 238 242 255;
      --bg-light-violet: 245 243 255;
      --bg-light-purple: 250 245 255;
      --bg-light-fuchsia: 253 244 255;
      --bg-light-pink: 253 242 248;
      --bg-light-rose: 255 241 242;
   }
</style>
