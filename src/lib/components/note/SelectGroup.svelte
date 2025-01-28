<script lang="ts">
   import {Popover, Button, Label, Command} from "$ui";
   import { Circle, ChevronsUpDown, Check } from "lucide-svelte";
   import {cn} from "$lib/utils";
   import {tick} from "svelte";
   
   let open = $state(false);

   
   interface Props {
      value?: string;
      tagGroups: any;
      class?: $$Props["class"];
      info?: import('svelte').Snippet;
   }

   let {
      value = $bindable("undefined"),
      tagGroups,
      class: className = undefined,
      info
   }: Props = $props();

   let selectedGroupToAddTag =
      $derived(tagGroups.find((f) => f.name === value)?.name ?? "select group");

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
            {@render info?.()}
            <Button
               builders={[builder]}
               variant="outline"
               role="combobox"
               aria-expanded={open}
               class={cn("w-full justify-between"
               ,className)}
            >
               {selectedGroupToAddTag}
               <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
                  {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-[200px] p-0">
         <Command.Root>
            <Command.Input placeholder="Search Group..." />
            <Command.Empty>No group found.</Command.Empty>
            <Command.Group>
               {#each tagGroups as tagGroup}
                  <Command.Item
                     value={tagGroup.name}
                     onSelect={(currentValue) => {
                        value = currentValue;
                        closeAndFocusTrigger(ids.trigger);
                     }}
                  >
                     <Check
                        class={cn(
                           "mr-2 h-4 w-4",
                           value !== tagGroup.name && "text-transparent",
                        )}
                     />
                     {tagGroup.name}
                  </Command.Item>
               {/each}
            </Command.Group>
         </Command.Root>
      </Popover.Content>
   {/snippet}
</Popover.Root>