<script lang="ts">
   import { DropdownMenu, Button } from "$ui";
   export let items = [];
   export let type = "work";
   $: selectedItem = {
      title: "",
      id: "",
      icon: "",
   };
</script>

<div class="flex h-full p-1">
   <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
         <Button
            builders={[builder]}
            variant="outline"
            class="max-w-72 overflow-clip h-full px-3 text-xs text-start shadow-sm"
            >
            {#if selectedItem.icon}
            <svelte:component this={selectedItem.icon} class="w-3 h-3" />
            {:else}
            {selectedItem.title || "Select "+ type}
            {/if}
            </Button
         >
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
         <DropdownMenu.Group>
            <DropdownMenu.Label>Today's Todo List</DropdownMenu.Label>
            <DropdownMenu.Separator />
            {#each items as item}            
               <DropdownMenu.Item on:click={() => (selectedItem = item)}
                  >
                  <svelte:component this={item.icon} class="w-4 h-4 mr-2" />
                  {item.title}</DropdownMenu.Item
               >
            {/each}
         </DropdownMenu.Group>
      </DropdownMenu.Content>
   </DropdownMenu.Root>
</div>
