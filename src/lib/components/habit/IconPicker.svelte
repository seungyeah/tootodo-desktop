<script lang="ts">
   import { Button, DropdownMenu } from "$ui";
   import icons from "$lib/icons";
   import { createEventDispatcher } from "svelte";
   interface Props {
      trigger?: import("svelte").Snippet;
   }

   let { trigger }: Props = $props();
   const dispatch = createEventDispatcher();
   let color = $state("#09090b");
   export function updateHabit(key, value) {
      dispatch("update", { key, value });
   }
</script>

<DropdownMenu.Root closeOnItemClick={false}>
   <DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
      {#if trigger}{@render trigger()}{:else}Icon{/if}
   </DropdownMenu.Trigger>
   <DropdownMenu.Content
      class="w-[300px] translate-x-2 border-2 border-double border-neutral-800 "
   >
      <DropdownMenu.Group>
         <div
            class="grid grid-flow-row auto-rows-max grid-cols-6 gap-2 p-2 w-full h-[200px] h-max-[200px] overflow-y-auto"
         >
            {#each Object.keys(icons) as icon}
               <Button
                  variant="outline"
                  class="px-1"
                  onclick={() => updateHabit("icon", icon)}
               >
                  {@const Component = icons[icon]}
                  <Component size={16} {color} />
               </Button>
            {/each}
         </div>
         <DropdownMenu.Separator />
         <DropdownMenu.Item class="h-8">
            <DropdownMenu.Label class="w-full text-center ">
               Color
            </DropdownMenu.Label>
            <input
               type="color"
               bind:value={color}
               onchange={() => updateHabit("color", color)}
            />
         </DropdownMenu.Item>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>
