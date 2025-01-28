<script lang="ts">
   import { ChevronsUpDown, Check } from "lucide-svelte";
   import { tick } from "svelte";
   import * as Command from "$lib/components/ui/command/index.js";
   import * as Popover from "$lib/components/ui/popover/index.js";
   import { Button } from "$lib/components/ui/button/index.js";
   import { cn } from "$lib/utils.js";

   const frameworks = [
      {
         value: "sveltekit",
         label: "SvelteKit",
      },
      {
         value: "next.js",
         label: "Next.js",
      },
      {
         value: "nuxt.js",
         label: "Nuxt.js",
      },
      {
         value: "remix",
         label: "Remix",
      },
      {
         value: "astro",
         label: "Astro",
      },
   ];

   let open = $state(false);
   let value = $state("");

   let selectedValue =
      $derived(frameworks.find((f) => f.value === value)?.label ??
      "Select a tag group...");

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

   <Popover.Root bind:open >
      {#snippet children({ ids })}
      <Popover.Trigger asChild >
            {#snippet children({ builder })}
            <Button
                  builders={[builder]}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  class="justify-between w-full"
               >
                  {selectedValue}
                  <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
               </Button>
                     {/snippet}
      </Popover.Trigger>
         <Popover.Content class="w-[240px] p-0">
            <Command.Root>
               <Command.Input placeholder="Search Tag Group..." />
               <Command.Empty>No framework found.</Command.Empty>
               <Command.Group>
                  {#each frameworks as framework}
                     <Command.Item
                        value={framework.value}
                        onSelect={(currentValue) => {
                           value = currentValue;
                           closeAndFocusTrigger(ids.trigger);
                        }}
                     >
                        <Check
                           class={cn(
                              "mr-2 h-4 w-4",
                              value !== framework.value && "text-transparent",
                           )}
                        />
                        {framework.label}
                     </Command.Item>
                  {/each}
               </Command.Group>
            </Command.Root>
         </Popover.Content>
         {/snippet}
</Popover.Root>