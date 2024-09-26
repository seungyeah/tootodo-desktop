<script lang="ts">
   import { DropdownMenu, Button, ScrollArea } from "$ui";
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
            class="max-w-72 overflow-clip h-full px-3 text-xs text-start "
         >
            {#if selectedItem.icon}
               <svelte:component this={selectedItem.icon} class="w-3 h-3" />
            {:else}
               {selectedItem.title || "Select " + type}
            {/if}
         </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="h-[300px]" side="top">
         <DropdownMenu.Group>
            <DropdownMenu.Label>Today's {type} List</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <ScrollArea class="h-60  w-60">
               {#if type === "task"}
                  {#each items as { task, subtasks }}
                     <DropdownMenu.Item
                        on:click={() => (selectedItem = task)}
                        class="border-b border-dashed m-1.5 mr-2.5"
                     >
                        {task.title}
                     </DropdownMenu.Item>
                     {#each subtasks as subtask}
                        <DropdownMenu.Item
                           on:click={() => (selectedItem = subtask.task)}
                           class="border-b border-dashed m-1.5 mr-2.5 ml-4 bg-zinc-50"
                        >
                           {subtask.task.title}
                        </DropdownMenu.Item>
                     {/each}
                  {/each}
               {:else}
                  {#each items as item}
                     <DropdownMenu.Item
                        on:click={() => (selectedItem = item)}
                        class="border-b border-dashed m-1.5 mr-2.5"
                     >
                        {#if item.icon}
                           <svelte:component
                              this={item.icon}
                              class="w-4 h-4 mr-2"
                           />
                        {/if}
                        {item.title}
                     </DropdownMenu.Item>
                  {/each}
               {/if}
            </ScrollArea>
         </DropdownMenu.Group>
      </DropdownMenu.Content>
   </DropdownMenu.Root>
</div>
