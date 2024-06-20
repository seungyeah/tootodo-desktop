<script lang="ts">
	import { Button, DropdownMenu, } from "$ui";
	import icons from "$lib/icons";
   import { createEventDispatcher } from "svelte";
   const dispatch = createEventDispatcher();
   let color = "#09090b";
   export function updateHabit(key, value){
      dispatch("update", { key,value });
   }
</script>
<DropdownMenu.Root closeOnItemClick={false}>
   <DropdownMenu.Trigger class=" h-9 -translate-y-0.5 rounded p-0">
      <slot name="trigger">Icon</slot>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content
      class="w-[300px] translate-x-2 border-2 border-double border-zinc-800 "
   >
      <DropdownMenu.Group>
         <div
            class="grid grid-flow-row auto-rows-max grid-cols-6 gap-2 p-2 w-full h-[200px] h-max-[200px] overflow-y-auto"
         >
            {#each Object.keys(icons) as icon}
               <Button
                  variant="outline"
                  class="px-1"
                  on:click={()=>updateHabit("icon", icon)}
               >
                  <svelte:component
                     this={icons[icon]}
                     size={16}
                     color={color}
                  />
               </Button>
            {/each}
         </div>
         <DropdownMenu.Separator />
         <DropdownMenu.Item class="h-8">
            <DropdownMenu.Label class="w-full text-center ">
               Color
            </DropdownMenu.Label>
            <input type="color" bind:value={color} on:change={()=>updateHabit("color", color)} />
         </DropdownMenu.Item>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>